import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: resume, error } = await supabase
    .from("resumes")
    .select("*, resume_analyses(*)")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: "Resume not found or access denied." }, { status: 404 });
  }

  return NextResponse.json({ resume });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { parsed_data } = body;

    const { data: updated, error } = await supabase
      .from("resumes")
      .update({
        parsed_data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ resume: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Get file path
  const { data: resume } = await supabase
    .from("resumes")
    .select("file_path")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (resume?.file_path) {
    // Delete file from private storage
    await supabase.storage.from("resumes").remove([resume.file_path]);
  }

  // 2. Delete database record (cascades to analyses and recommendations)
  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Resume and associated analyses deleted successfully." });
}
