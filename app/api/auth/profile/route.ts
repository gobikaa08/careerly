import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CAREER_DATABASE, findCareerDefinition } from "@/lib/careers-data";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let targetCareer = profile?.target_career;
  if (!targetCareer) {
    const { data: recTarget } = await supabase
      .from("career_recommendations")
      .select("career_title")
      .eq("user_id", user.id)
      .eq("is_target", true)
      .limit(1)
      .maybeSingle();
    targetCareer = recTarget?.career_title || CAREER_DATABASE[0].title;
  }

  const canonicalCareer = findCareerDefinition(targetCareer)?.title || targetCareer;

  return NextResponse.json({
    profile: profile
      ? { ...profile, target_career: canonicalCareer }
      : {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || "",
          target_career: canonicalCareer,
        },
  });
}

export async function PUT(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { full_name, headline, phone, location, bio, linkedin_url, github_url, target_career, weekly_hours, learning_style, target_date } = body;

    const { data: updated, error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email,
        full_name: full_name ?? "",
        headline: headline ?? "",
        phone: phone ?? "",
        location: location ?? "",
        bio: bio ?? "",
        linkedin_url: linkedin_url ?? "",
        github_url: github_url ?? "",
        target_career: target_career ?? "",
        weekly_hours: weekly_hours ?? 12,
        learning_style: learning_style ?? "hands-on",
        target_date: target_date ?? null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Synchronize target career across recommendations and roadmaps
    if (target_career) {
      try {
        const careerDef = findCareerDefinition(target_career) || CAREER_DATABASE[0];
        const now = new Date().toISOString();

        await supabase
          .from("career_recommendations")
          .update({ is_target: false })
          .eq("user_id", user.id);

        await supabase
          .from("career_recommendations")
          .update({ is_target: true })
          .eq("user_id", user.id)
          .eq("career_title", careerDef.title);

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
      } catch {
        // Non-blocking sync error
      }
    }

    return NextResponse.json({ profile: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update profile" }, { status: 400 });
  }
}
