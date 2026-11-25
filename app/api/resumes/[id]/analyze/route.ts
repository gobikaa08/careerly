import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { analyzeResumeRuleBased } from "@/lib/analysis/rule-engine";
import { classifyDocument } from "@/lib/validation/document-classifier";

export const maxDuration = 30; // Fast deterministic rule-based evaluation

export async function POST(
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
    const { user_consent, target_career, interests } = body;

    // Rule 5: User consent is required before running analysis
    if (!user_consent) {
      return NextResponse.json(
        { error: "User consent is required before analyzing your resume." },
        { status: 400 }
      );
    }

    // 1. Fetch resume record from Supabase (protected by RLS: user_id = user.id)
    const { data: resume, error: resumeError } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (resumeError || !resume) {
      return NextResponse.json({ error: "Resume not found." }, { status: 404 });
    }

    if (!resume.extracted_text || resume.extracted_text.trim().length < 50) {
      return NextResponse.json(
        { error: "Resume does not contain sufficient readable text for analysis." },
        { status: 422 }
      );
    }

    // Validate that document is a genuine resume before performing analysis
    const classification = classifyDocument(resume.extracted_text);
    if (!classification.isResume) {
      return NextResponse.json(
        {
          error:
            classification.userFacingMessage ||
            "⚠️ This document doesn't appear to be a resume. Please upload a valid resume in PDF format.",
          detectedType: classification.detectedTypeLabel,
        },
        { status: 422 }
      );
    }

    // 2. Perform 100% Free, Deterministic Rule-Based Analysis (Zero OpenAI or Paid APIs Required)
    const result = analyzeResumeRuleBased(
      resume.extracted_text,
      resume.parsed_data || {},
      { target_career, interests }
    );

    // 3. Save Analysis to resume_analyses table
    const { data: savedAnalysis, error: analysisError } = await supabase
      .from("resume_analyses")
      .insert({
        user_id: user.id,
        resume_id: resume.id,
        overall_score: result.analysis.overall_score,
        summary: result.analysis.summary,
        strengths: result.analysis.strengths,
        weaknesses: result.analysis.weaknesses,
        suggestions: result.analysis.suggestions,
        ats_checklist: result.analysis.ats_checklist,
        formatting_notes: result.analysis.formatting_notes,
      })
      .select()
      .single();

    if (analysisError) {
      console.error("Failed to save resume analysis:", analysisError);
    }

    // 4. Save Recommended Careers to career_recommendations table
    if (result.recommendedCareers && result.recommendedCareers.length > 0) {
      // Clear old recommendations for this user
      await supabase.from("career_recommendations").delete().eq("user_id", user.id);

      const recommendationsToInsert = result.recommendedCareers.map((rec, idx) => ({
        user_id: user.id,
        resume_id: resume.id,
        career_title: rec.career_title,
        match_score: rec.match_score,
        explanation: rec.explanation,
        matching_skills: rec.matching_skills,
        missing_skills: rec.missing_skills,
        suggested_projects: rec.suggested_projects,
        learning_path_summary: rec.learning_path_summary,
        is_target: idx === 0, // Top match default target
      }));

      await supabase.from("career_recommendations").insert(recommendationsToInsert);

      // Auto-set profile target career if not already set
      await supabase.from("profiles").update({
        target_career: result.recommendedCareers[0].career_title,
      }).eq("id", user.id).is("target_career", null);
    }

    // 5. Update user_skills table with verified technical skills
    if (result.parsedData.technical_skills && result.parsedData.technical_skills.length > 0) {
      const skillsToInsert = result.parsedData.technical_skills.map(skill => ({
        user_id: user.id,
        skill_name: skill,
        category: "Technical",
        proficiency_level: 60,
        verified_by_user: true,
      }));

      await supabase.from("user_skills").upsert(skillsToInsert, { onConflict: "user_id,skill_name" });
    }

    // 6. Update resume status to 'analyzed' and save refreshed parsed_data
    await supabase.from("resumes").update({
      upload_status: "analyzed",
      parsed_data: result.parsedData,
      updated_at: new Date().toISOString(),
    }).eq("id", resume.id);

    return NextResponse.json({
      message: "Rule-based resume analysis completed successfully.",
      analysis: savedAnalysis || result.analysis,
      recommendedCareers: result.recommendedCareers,
      parsedData: result.parsedData,
      aiSource: "rule-based",
    });
  } catch (err: any) {
    console.error("Analysis Exception:", err);
    return NextResponse.json({ error: err.message || "Failed to analyze resume." }, { status: 500 });
  }
}
