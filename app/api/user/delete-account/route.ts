import { NextResponse } from "next/server";
import { createServerSupabaseClient, createAdminSupabaseClient } from "@/lib/supabase/server";

export async function DELETE() {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Delete all storage files in user's folder
    const { data: files } = await supabase.storage
      .from("resumes")
      .list(user.id);

    if (files && files.length > 0) {
      const filePaths = files.map(f => `${user.id}/${f.name}`);
      await supabase.storage.from("resumes").remove(filePaths);
    }

    // 2. Database records cascade via ON DELETE CASCADE from profiles / auth.users
    // Also explicitly wipe tables for defense in depth
    await supabase.from("resumes").delete().eq("user_id", user.id);
    await supabase.from("resume_analyses").delete().eq("user_id", user.id);
    await supabase.from("career_recommendations").delete().eq("user_id", user.id);
    await supabase.from("user_skills").delete().eq("user_id", user.id);
    await supabase.from("learning_roadmaps").delete().eq("user_id", user.id);
    await supabase.from("learning_tasks").delete().eq("user_id", user.id);
    await supabase.from("profiles").delete().eq("id", user.id);

    // 3. Delete auth account using admin client
    const admin = createAdminSupabaseClient();
    await admin.auth.admin.deleteUser(user.id);

    return NextResponse.json({ message: "Account and all associated records deleted permanently." });
  } catch (err: any) {
    console.error("Account Deletion Error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete account." }, { status: 500 });
  }
}
