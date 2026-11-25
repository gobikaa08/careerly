import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CAREER_DATABASE, findCareerDefinition } from "@/lib/careers-data";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Fetch user recommendations
  const { data: recs, error } = await supabase
    .from("career_recommendations")
    .select("*")
    .eq("user_id", user.id)
    .order("match_score", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 2. Fetch profile to check active target
  const { data: profile } = await supabase
    .from("profiles")
    .select("target_career")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    recommendations: recs || [],
    target_career: profile?.target_career || (recs && recs[0]?.career_title) || null,
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
    const { career_title } = body;

    if (!career_title) {
      return NextResponse.json({ error: "Career title is required." }, { status: 400 });
    }

    // Resolve canonical career definition first so every table uses identical naming
    const careerDef = findCareerDefinition(career_title) || CAREER_DATABASE[0];
    const now = new Date().toISOString();

    // 1. Update all recommendations for this user to set is_target = false
    await supabase
      .from("career_recommendations")
      .update({ is_target: false })
      .eq("user_id", user.id);

    // 2. Set this career as target
    await supabase
      .from("career_recommendations")
      .update({ is_target: true })
      .eq("user_id", user.id)
      .eq("career_title", careerDef.title);

    // 3. Upsert user profile so it persists even if profile row was not yet initialized
    await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          email: user.email || "",
          target_career: careerDef.title,
          updated_at: now,
        },
        { onConflict: "id" }
      );

    // 4. Auto-generate or activate roadmap for this target career
    const { data: existingRoadmap } = await supabase
      .from("learning_roadmaps")
      .select("id")
      .eq("user_id", user.id)
      .eq("career_title", careerDef.title)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingRoadmap) {
      await supabase
        .from("learning_roadmaps")
        .update({ updated_at: now })
        .eq("id", existingRoadmap.id);
    } else {
      await supabase.from("learning_roadmaps").insert({
        user_id: user.id,
        career_title: careerDef.title,
        roadmap_data: { phases: careerDef.roadmapPhases },
        progress: 0,
      });
    }

    return NextResponse.json({ success: true, target_career: careerDef.title, target_id: careerDef.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
