import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CAREER_DATABASE, findCareerDefinition } from "@/lib/careers-data";

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const careerParam = searchParams.get("career");

  // 1. Always resolve the user's authoritative active target career from backend
  const { data: profile } = await supabase
    .from("profiles")
    .select("target_career")
    .eq("id", user.id)
    .maybeSingle();

  let activeTargetTitle = profile?.target_career;

  if (!activeTargetTitle) {
    const { data: recTarget } = await supabase
      .from("career_recommendations")
      .select("career_title")
      .eq("user_id", user.id)
      .eq("is_target", true)
      .limit(1)
      .maybeSingle();

    if (recTarget?.career_title) {
      activeTargetTitle = recTarget.career_title;
    }
  }

  if (!activeTargetTitle) {
    activeTargetTitle = CAREER_DATABASE[0].title;
  }

  const activeCareerDef = findCareerDefinition(activeTargetTitle) || CAREER_DATABASE[0];

  // 2. Determine which career roadmap to load (URL override or active target career)
  const careerDef = careerParam
    ? (findCareerDefinition(careerParam) || activeCareerDef)
    : activeCareerDef;

  // 3. Fetch or initialize roadmap record safely (avoid .single() failure on duplicates)
  let { data: roadmap } = await supabase
    .from("learning_roadmaps")
    .select("*")
    .eq("user_id", user.id)
    .eq("career_title", careerDef.title)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!roadmap) {
    const { data: created } = await supabase
      .from("learning_roadmaps")
      .insert({
        user_id: user.id,
        career_title: careerDef.title,
        roadmap_data: { phases: careerDef.roadmapPhases },
        progress: 0,
      })
      .select()
      .single();

    roadmap = created;
  }

  // 4. Fetch completed tasks for this roadmap
  const { data: tasks } = await supabase
    .from("learning_tasks")
    .select("task_id, completed")
    .eq("user_id", user.id)
    .eq("roadmap_id", roadmap?.id || "");

  const completedTaskIds = (tasks || []).filter(t => t.completed).map(t => t.task_id);

  return NextResponse.json({
    roadmap: roadmap || {
      career_title: careerDef.title,
      roadmap_data: { phases: careerDef.roadmapPhases },
      progress: 0,
    },
    careerDefinition: careerDef,
    completedTaskIds,
    activeTargetCareer: activeCareerDef.title,
    activeTargetId: activeCareerDef.id,
    isTarget: careerDef.id === activeCareerDef.id,
  });
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { roadmap_id, task_id, task_title, phase_id, completed } = body;

    if (!roadmap_id || !task_id) {
      return NextResponse.json({ error: "roadmap_id and task_id are required" }, { status: 400 });
    }

    // 1. Upsert task record
    await supabase.from("learning_tasks").upsert({
      user_id: user.id,
      roadmap_id,
      task_id,
      task_title: task_title || task_id,
      phase_id: phase_id || "phase-1",
      completed: !!completed,
      completed_at: completed ? new Date().toISOString() : null,
    }, { onConflict: "user_id,roadmap_id,task_id" });

    // 2. Fetch all tasks count & roadmap phases count to update percentage
    const { data: roadmap } = await supabase
      .from("learning_roadmaps")
      .select("roadmap_data")
      .eq("id", roadmap_id)
      .eq("user_id", user.id)
      .single();

    let totalTasksCount = 0;
    if (roadmap?.roadmap_data?.phases) {
      roadmap.roadmap_data.phases.forEach((p: any) => {
        totalTasksCount += (p.topics ? p.topics.length : 0);
        totalTasksCount += (p.tasks ? p.tasks.length : 0);
        if (p.project) totalTasksCount += 1;
      });
    }

    const { data: completedTasks } = await supabase
      .from("learning_tasks")
      .select("id")
      .eq("user_id", user.id)
      .eq("roadmap_id", roadmap_id)
      .eq("completed", true);

    const completedCount = completedTasks ? completedTasks.length : 0;
    const progressPct = totalTasksCount > 0 ? Math.min(100, Math.round((completedCount / totalTasksCount) * 100)) : 0;

    await supabase
      .from("learning_roadmaps")
      .update({ progress: progressPct, updated_at: new Date().toISOString() })
      .eq("id", roadmap_id);

    return NextResponse.json({
      success: true,
      completed: !!completed,
      task_id,
      progress: progressPct,
      completedCount,
      totalCount: totalTasksCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
