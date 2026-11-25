-- ==============================================================================
-- CAREERLY – PRODUCTION SUPABASE SCHEMA & SECURITY POLICIES
-- Full-Stack AI Career Platform Database Architecture
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  location TEXT DEFAULT '',
  headline TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  target_career TEXT DEFAULT '',
  weekly_hours INT DEFAULT 12,
  learning_style TEXT DEFAULT 'hands-on',
  target_date DATE DEFAULT (CURRENT_DATE + INTERVAL '6 months'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. RESUMES TABLE (Uploaded Documents & Extracted Metadata)
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INT NOT NULL,
  extracted_text TEXT,
  parsed_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  upload_status TEXT NOT NULL DEFAULT 'uploaded',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. RESUME ANALYSES TABLE (AI Review & ATS Quality Audit)
CREATE TABLE IF NOT EXISTS public.resume_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  overall_score INT NOT NULL DEFAULT 0,
  summary TEXT NOT NULL DEFAULT '',
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  weaknesses JSONB NOT NULL DEFAULT '[]'::jsonb,
  suggestions JSONB NOT NULL DEFAULT '[]'::jsonb,
  ats_checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
  formatting_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. CAREER RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS public.career_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  career_title TEXT NOT NULL,
  match_score INT NOT NULL,
  explanation TEXT NOT NULL,
  matching_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  missing_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  suggested_projects JSONB NOT NULL DEFAULT '[]'::jsonb,
  learning_path_summary TEXT DEFAULT '',
  is_target BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. USER SKILLS TABLE (Verified & Editable by User)
CREATE TABLE IF NOT EXISTS public.user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Technical',
  proficiency_level INT NOT NULL DEFAULT 50, -- 0 to 100
  verified_by_user BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. CAREER GOALS TABLE
CREATE TABLE IF NOT EXISTS public.career_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  career_title TEXT NOT NULL,
  target_date DATE,
  weekly_hours INT DEFAULT 12,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. LEARNING ROADMAPS TABLE
CREATE TABLE IF NOT EXISTS public.learning_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  career_goal_id UUID REFERENCES public.career_goals(id) ON DELETE SET NULL,
  career_title TEXT NOT NULL,
  roadmap_data JSONB NOT NULL,
  progress INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. LEARNING TASKS TABLE (Individual Checklist Items)
CREATE TABLE IF NOT EXISTS public.learning_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  roadmap_id UUID NOT NULL REFERENCES public.learning_roadmaps(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL,
  task_title TEXT NOT NULL,
  phase_id TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, roadmap_id, task_id)
);

-- 9. RESUME CHECKLISTS TABLE
CREATE TABLE IF NOT EXISTS public.resume_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  checklist_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  progress INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- 10. STUDY ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.study_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hours NUMERIC(4,2) NOT NULL DEFAULT 1.0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures complete multi-tenant user isolation.
-- Users can strictly view and modify only their own data.
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_activity ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Resumes Policies
CREATE POLICY "Users can view their own resumes" ON public.resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own resumes" ON public.resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own resumes" ON public.resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own resumes" ON public.resumes FOR DELETE USING (auth.uid() = user_id);

-- Resume Analyses Policies
CREATE POLICY "Users can view their own analyses" ON public.resume_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own analyses" ON public.resume_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own analyses" ON public.resume_analyses FOR DELETE USING (auth.uid() = user_id);

-- Career Recommendations Policies
CREATE POLICY "Users can view their career recommendations" ON public.career_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert career recommendations" ON public.career_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update career recommendations" ON public.career_recommendations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete career recommendations" ON public.career_recommendations FOR DELETE USING (auth.uid() = user_id);

-- User Skills Policies
CREATE POLICY "Users can view their own skills" ON public.user_skills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own skills" ON public.user_skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own skills" ON public.user_skills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own skills" ON public.user_skills FOR DELETE USING (auth.uid() = user_id);

-- Career Goals Policies
CREATE POLICY "Users can view their own career goals" ON public.career_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own career goals" ON public.career_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own career goals" ON public.career_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own career goals" ON public.career_goals FOR DELETE USING (auth.uid() = user_id);

-- Learning Roadmaps Policies
CREATE POLICY "Users can view their own roadmaps" ON public.learning_roadmaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own roadmaps" ON public.learning_roadmaps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own roadmaps" ON public.learning_roadmaps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own roadmaps" ON public.learning_roadmaps FOR DELETE USING (auth.uid() = user_id);

-- Learning Tasks Policies
CREATE POLICY "Users can view their own learning tasks" ON public.learning_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own learning tasks" ON public.learning_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own learning tasks" ON public.learning_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own learning tasks" ON public.learning_tasks FOR DELETE USING (auth.uid() = user_id);

-- Resume Checklists Policies
CREATE POLICY "Users can view their own checklist" ON public.resume_checklists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own checklist" ON public.resume_checklists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own checklist" ON public.resume_checklists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own checklist" ON public.resume_checklists FOR DELETE USING (auth.uid() = user_id);

-- Study Activity Policies
CREATE POLICY "Users can view their own study activity" ON public.study_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own study activity" ON public.study_activity FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own study activity" ON public.study_activity FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- Automatically creates a user profile row whenever a new user signs up in auth.users
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- STORAGE CONFIGURATION (Private Resume Storage Bucket)
-- ==============================================================================

-- Create bucket if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false,
  5242880, -- 5 MB configurable limit
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880;

-- Storage RLS: Users can only upload, read, update, and delete in their user-scoped folder
CREATE POLICY "User can upload resume to own folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "User can view own resume" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "User can update own resume" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "User can delete own resume" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
