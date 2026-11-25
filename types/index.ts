/**
 * CAREERLY – Global TypeScript Definitions
 * Type-safe contracts for Database entities, API payloads, Parsed Resumes & AI Analysis.
 */

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  headline?: string;
  bio?: string;
  linkedin_url?: string;
  github_url?: string;
  target_career?: string;
  weekly_hours?: number;
  learning_style?: 'hands-on' | 'documentation' | 'video';
  target_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ParsedEducation {
  institution: string;
  degree: string;
  graduation_year?: string;
  cgpa_or_percentage?: string;
  field_of_study?: string;
}

export interface ParsedProject {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface ParsedExperience {
  role: string;
  company: string;
  duration?: string;
  description?: string;
  bullets?: string[];
}

export interface ParsedResumeData {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  summary: string | null;
  education: ParsedEducation[];
  technical_skills: string[];
  tools_and_technologies: string[];
  projects: ParsedProject[];
  work_experience: ParsedExperience[];
  internships: ParsedExperience[];
  certifications: string[];
  achievements: string[];
}

export interface ResumeRecord {
  id: string;
  user_id: string;
  file_path: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  extracted_text?: string;
  parsed_data: ParsedResumeData;
  upload_status: 'uploaded' | 'processing' | 'parsed' | 'analyzed' | 'error';
  created_at: string;
  updated_at: string;
}

export interface ATSChecklistItem {
  id: string;
  category: string;
  criterion: string;
  status: 'passed' | 'warning' | 'missing';
  feedback: string;
  weight: number;
}

export interface ResumeAnalysisRecord {
  id: string;
  user_id: string;
  resume_id: string;
  overall_score: number; // 0 to 100
  candidate_level?: 'student_fresher' | 'experienced_professional';
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  ats_checklist: ATSChecklistItem[];
  formatting_notes: string;
  categories?: Array<{
    category: string;
    score: number;
    weight: number;
    weightedScore: number;
    status: string;
    positiveEvidence: string[];
    deductions: Array<{ reason: string; points: number; actionableFix: string }>;
  }>;
  created_at: string;
}

export interface CareerRecommendationRecord {
  id: string;
  user_id: string;
  resume_id?: string;
  career_title: string;
  match_score: number; // 0 to 100
  explanation: string;
  matching_skills: string[];
  missing_skills: string[];
  suggested_projects: string[];
  learning_path_summary?: string;
  is_target: boolean;
  created_at: string;
}

export interface UserSkillRecord {
  id: string;
  user_id: string;
  skill_name: string;
  category: string;
  proficiency_level: number; // 0, 25, 50, 75, 100
  verified_by_user: boolean;
  created_at?: string;
}

export interface RoadmapTopic {
  id: string;
  title: string;
  resourceUrl?: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  timeline: string;
  description: string;
  topics: RoadmapTopic[];
  tasks: RoadmapTask[];
  project?: string;
}

export interface LearningRoadmapRecord {
  id: string;
  user_id: string;
  career_title: string;
  roadmap_data: {
    phases: RoadmapPhase[];
  };
  progress: number; // 0 to 100
  created_at: string;
  updated_at: string;
}

export interface LearningTaskRecord {
  id: string;
  user_id: string;
  roadmap_id: string;
  task_id: string;
  task_title: string;
  phase_id: string;
  completed: boolean;
  completed_at?: string;
}

export interface ResumeChecklistRecord {
  id: string;
  user_id: string;
  resume_id?: string;
  checklist_data: Record<string, boolean>;
  progress: number;
  updated_at: string;
}

export interface StudyActivityRecord {
  id: string;
  user_id: string;
  hours: number;
  date: string;
  created_at: string;
}

export interface CareerDefinition {
  id: string;
  title: string;
  category: string;
  categoryKey: string;
  tagline: string;
  salaryRange: string;
  projectedGrowth: string;
  difficulty: string;
  badge: string;
  overview: string;
  responsibilities: string[];
  tools: string[];
  progression: Array<{ role: string; exp: string; salary: string }>;
  skills: Array<{ id: string; name: string; benchmark: number; category: string }>;
  roadmapPhases: RoadmapPhase[];
}
