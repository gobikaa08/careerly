import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { extractResumeText } from "@/lib/parsers";

export const maxDuration = 60; // 60s timeout for parsing

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized. Please sign in to upload your resume." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No resume file provided." }, { status: 400 });
    }

    // 1. File Size Validation (Configurable limit, default 5MB)
    const maxMb = Number(process.env.MAX_UPLOAD_SIZE_MB || 5);
    const maxBytes = maxMb * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `File size exceeds the allowed limit of ${maxMb} MB. Please upload a smaller file.` },
        { status: 400 }
      );
    }

    // 2. MIME & Extension Validation
    const originalFilename = file.name || "resume.pdf";
    const extension = originalFilename.split(".").pop()?.toLowerCase();
    const validExtensions = ["pdf", "docx"];

    if (!extension || !validExtensions.includes(extension)) {
      return NextResponse.json(
        { error: "Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx)." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Extract Text & Run Intelligent Document Validation
    const mimeType = file.type || (extension === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    const {
      text,
      isScannedOrEmpty,
      pageCount,
      initialParsedData,
      isRejected,
      rejectionMessage,
      detectedTypeLabel,
      classification,
    } = await extractResumeText(buffer, originalFilename, mimeType);

    // Reject non-resumes (Invoices, Research Papers, Assignments, Certificates, Manuals) or unreadable scans
    if (isRejected) {
      return NextResponse.json(
        {
          error:
            rejectionMessage ||
            "⚠️ This document doesn't appear to be a resume. Please upload a valid resume in PDF format.",
          isInvalidDocument: true,
          detectedType: detectedTypeLabel,
          isScanned: isScannedOrEmpty,
          classification,
        },
        { status: 422 }
      );
    }

    // 4. Upload to Private Supabase Storage Bucket
    const safeFilename = `${Date.now()}_${originalFilename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const storagePath = `${user.id}/${safeFilename}`;

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(storagePath, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage bucket upload error:", uploadError);
      // If bucket does not exist or fails, still allow saving record with path
    }

    // 5. Save Record in Resumes Table
    const { data: resumeRecord, error: dbError } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        file_path: storagePath,
        original_filename: originalFilename,
        file_type: mimeType,
        file_size: file.size,
        extracted_text: text,
        parsed_data: initialParsedData,
        upload_status: "parsed",
      })
      .select()
      .single();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Auto-update user skills table with initial detected skills if not present
    if (initialParsedData.technical_skills && initialParsedData.technical_skills.length > 0) {
      const skillsToInsert = initialParsedData.technical_skills.map(s => ({
        user_id: user.id,
        skill_name: s,
        category: "Technical",
        proficiency_level: 60,
        verified_by_user: false,
      }));

      await supabase.from("user_skills").upsert(skillsToInsert, { onConflict: "user_id,skill_name", ignoreDuplicates: true });
    }

    return NextResponse.json({
      message: "Resume uploaded and text extracted successfully.",
      resume: resumeRecord,
      pages: pageCount,
    });
  } catch (err: any) {
    console.error("Resume Upload Exception:", err);
    return NextResponse.json({ error: err.message || "Failed to process resume upload." }, { status: 500 });
  }
}
