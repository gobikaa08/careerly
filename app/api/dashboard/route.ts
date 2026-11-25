import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CAREER_DATABASE, findCareerDefinition } from "@/lib/careers-data";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch Profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // 2. Fetch Latest Resume
    const { data: resumes } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    const latestResume = resumes && resumes.length > 0 ? resumes[0] : null;

    // 3. Fetch Latest Resume Analysis
    let latestAnalysis = null;
    if (latestResume) {
      const { data: analyses } = await supabase
        .from("resume_analyses")
        .select("*")
        .eq("user_id", user.id)
        .eq("resume_id", latestResume.id)
        .order("created_at", { ascending: false })
        .limit(1);

      latestAnalysis = analyses && analyses.length > 0 ? analyses[0] : null;
    }

    // 4. Fetch User Skills
    const { data: userSkills } = await supabase
      .from("user_skills")
      .select("*")
      .eq("user_id", user.id);

    const skillsList = userSkills || [];

    // 5. Target Career & Benchmarks (synchronized across profile and recommendations)
    let targetTitle = profile?.target_career;
    if (!targetTitle) {
      const { data: recTarget } = await supabase
        .from("career_recommendations")
        .select("career_title")
        .eq("user_id", user.id)
        .eq("is_target", true)
        .limit(1)
        .maybeSingle();

      if (recTarget?.career_title) {
        targetTitle = recTarget.career_title;
      }
    }

    if (!targetTitle) {
      targetTitle = "Full-Stack Web Developer";
    }

    const careerDef = findCareerDefinition(targetTitle) || CAREER_DATABASE[0];

    // Calculate Skill Coverage against Target Career Benchmarks
    let skillCoveragePct = 0;
    let matchedSkillsCount = 0;
    let missingSkills: string[] = [];

    if (careerDef && skillsList.length > 0) {
      const userSkillNames = skillsList.map(s => s.skill_name.toLowerCase());
      careerDef.skills.forEach(req => {
        const found = userSkillNames.some(us => us.includes(req.name.toLowerCase()) || req.name.toLowerCase().includes(us));
        if (found) {
          matchedSkillsCount++;
        } else {
          missingSkills.push(req.name);
        }
      });
      skillCoveragePct = Math.min(100, Math.round((matchedSkillsCount / careerDef.skills.length) * 100));
    }

    // 6. Fetch Active Roadmap & Progress synchronized with Target Career
    const { data: activeRoadmap } = await supabase
      .from("learning_roadmaps")
      .select("*")
      .eq("user_id", user.id)
      .eq("career_title", careerDef.title)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let completedMilestonesCount = 0;
    if (activeRoadmap?.id) {
      const { data: completedTasks } = await supabase
        .from("learning_tasks")
        .select("id")
        .eq("user_id", user.id)
        .eq("roadmap_id", activeRoadmap.id)
        .eq("completed", true);
      completedMilestonesCount = completedTasks ? completedTasks.length : 0;
    }

    const roadmapProgressPct = activeRoadmap ? activeRoadmap.progress : 0;

    // 7. Fetch Study Activity (Past 7 Days)
    const { data: activities } = await supabase
      .from("study_activity")
      .select("hours, date")
      .eq("user_id", user.id)
      .order("date", { ascending: true })
      .limit(7);

    // 8. Calculate Overall Readiness Index from REAL DATABASE RECORDS
    // If user has not uploaded a resume, overall readiness is 0% (True onboarding state)
    let overallReadinessScore = 0;
    let readinessStatus = "Getting Started (Upload Resume)";

    if (latestResume) {
      const assessmentScore = latestAnalysis ? 100 : 25;
      const resumeScore = latestAnalysis ? latestAnalysis.overall_score : 50;
      const skillsScore = skillCoveragePct;
      const roadmapScore = roadmapProgressPct;

      overallReadinessScore = Math.round(
        (assessmentScore * 0.15) +
        (skillsScore * 0.35) +
        (roadmapScore * 0.30) +
        (resumeScore * 0.20)
      );

      if (overallReadinessScore >= 80) readinessStatus = "Interview Ready & Market Competitive";
      else if (overallReadinessScore >= 55) readinessStatus = "Steady Growth & Good Foundation";
      else if (overallReadinessScore >= 30) readinessStatus = "Developing Competencies";
      else readinessStatus = "Early Trajectory";
    }

    // 9. Dynamic Real Next Actions
    const nextActions: Array<{ title: string; description: string; link: string; badge: string }> = [];

    if (!latestResume) {
      nextActions.push({
        title: "Upload Your Resume",
        description: "Upload your PDF or Word resume to unlock automatic skill extraction and AI quality analysis.",
        link: "/upload",
        badge: "Highest Priority",
      });
    } else if (!latestAnalysis) {
      nextActions.push({
        title: "Analyze Resume with AI",
        description: "Review your extracted resume data and consent to generate personalized ATS recommendations.",
        link: "/resume",
        badge: "Urgent",
      });
    }

    if (!targetTitle) {
      nextActions.push({
        title: "Select Target Career",
        description: "Explore tech trajectories to set your benchmark career path.",
        link: "/careers",
        badge: "Core Step",
      });
    } else if (missingSkills.length > 0) {
      nextActions.push({
        title: `Bridge Skill Gap: ${missingSkills[0]}`,
        description: `Tackle the top missing competency for ${careerDef?.title || "your target role"}.`,
        link: "/skill-gap",
        badge: "Skill Deficit",
      });
    }

    if (roadmapProgressPct < 20) {
      nextActions.push({
        title: "Check Off First Roadmap Milestone",
        description: "Complete and verify your initial foundational curriculum task.",
        link: "/roadmap",
        badge: "High Momentum",
      });
    }

    return NextResponse.json({
      profile: profile || {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || "",
      },
      hasResume: !!latestResume,
      latestResume,
      latestAnalysis,
      targetCareer: careerDef,
      allCareers: CAREER_DATABASE.map((c) => ({
        id: c.id,
        title: c.title,
        salaryRange: c.salaryRange,
      })),
      skills: {
        totalVerified: skillsList.length,
        items: skillsList,
        coveragePct: skillCoveragePct,
        matchedCount: matchedSkillsCount,
        missingSkills,
      },
      roadmap: {
        active: !!activeRoadmap,
        title: activeRoadmap?.career_title || null,
        progress: roadmapProgressPct,
        completedMilestonesCount,
      },
      readiness: {
        score: overallReadinessScore,
        status: readinessStatus,
        breakdown: {
          assessment: latestAnalysis ? 15 : 0,
          skills: Math.round(skillCoveragePct * 0.35),
          roadmap: Math.round(roadmapProgressPct * 0.30),
          resume: latestAnalysis ? Math.round(latestAnalysis.overall_score * 0.20) : 0,
        },
      },
      studyActivity: activities || [],
      nextActions: nextActions.slice(0, 3),
    });
  } catch (err: any) {
    console.error("Dashboard Aggregation Error:", err);
    return NextResponse.json({ error: err.message || "Failed to load dashboard." }, { status: 500 });
  }
}
