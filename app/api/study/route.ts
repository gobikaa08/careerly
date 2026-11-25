import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: activities, error } = await supabase
    .from("study_activity")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ activities: activities || [] });
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const hours = Math.max(0.5, Math.min(24, Number(body.hours) || 1));
    const date = body.date || new Date().toISOString().split("T")[0];

    const { data: activity, error } = await supabase
      .from("study_activity")
      .insert({
        user_id: user.id,
        hours,
        date,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Study activity logged successfully.",
      activity,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to log study activity." }, { status: 500 });
  }
}
