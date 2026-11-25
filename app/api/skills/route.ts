import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: skills, error } = await supabase
    .from("user_skills")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ skills: skills || [] });
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { skill_name, category, proficiency_level, verified_by_user } = body;

    if (!skill_name || !skill_name.trim()) {
      return NextResponse.json({ error: "Skill name is required" }, { status: 400 });
    }

    const { data: skill, error } = await supabase
      .from("user_skills")
      .upsert({
        user_id: user.id,
        skill_name: skill_name.trim(),
        category: category || "Technical",
        proficiency_level: proficiency_level !== undefined ? proficiency_level : 50,
        verified_by_user: verified_by_user !== undefined ? verified_by_user : true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ skill });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { skills } = body; // Array of { skill_name, proficiency_level, category }

    if (!Array.isArray(skills)) {
      return NextResponse.json({ error: "Expected array of skills" }, { status: 400 });
    }

    const payload = skills.map((s: any) => ({
      user_id: user.id,
      skill_name: s.skill_name,
      category: s.category || "Technical",
      proficiency_level: s.proficiency_level ?? 50,
      verified_by_user: true,
    }));

    const { data: updated, error } = await supabase
      .from("user_skills")
      .upsert(payload)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ skills: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const name = searchParams.get("name");

  let query = supabase.from("user_skills").delete().eq("user_id", user.id);
  if (id) {
    query = query.eq("id", id);
  } else if (name) {
    query = query.eq("skill_name", name);
  } else {
    return NextResponse.json({ error: "Provide id or name" }, { status: 400 });
  }

  const { error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
