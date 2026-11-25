"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Trash2, ArrowRight, Sparkles, RefreshCw, Shield } from "lucide-react";
import { ResumeRecord, ParsedResumeData } from "@/types";

export default function ResumeUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [candidateProfileLevel, setCandidateProfileLevel] = useState<string | null>(null);

  const [currentResume, setCurrentResume] = useState<ResumeRecord | null>(null);
  const [editableData, setEditableData] = useState<ParsedResumeData | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Consent & AI Triggering
  const [userConsent, setUserConsent] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  // Fetch current resume if user already has one uploaded
  useEffect(() => {
    const fetchLatestResume = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          if (data.latestResume) {
            setCurrentResume(data.latestResume);
            setEditableData(data.latestResume.parsed_data || {});
          }
        }
      } catch {
        // Ignore
      }
    };

    fetchLatestResume();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    setSuccessMessage(null);

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "docx") {
      setError("Please select a PDF (.pdf) or Word document (.docx).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File exceeds the maximum limit of 5 MB. Please upload a smaller file.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploadProgress(45);
      const res = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(85);
      const data = await res.json();

      if (!res.ok) {
        if (data.detectedType) {
          setDetectedType(data.detectedType);
        }
        throw new Error(data.error || "Failed to process resume upload.");
      }

      setUploadProgress(100);
      setDetectedType(null);
      setSuccessMessage(data.message || "Resume verified, uploaded, and text extracted successfully!");
      if (data.resume?.parsed_data?.candidate_level) {
        setCandidateProfileLevel(data.resume.parsed_data.candidate_level);
      }
      setCurrentResume(data.resume);
      setEditableData(data.resume.parsed_data);
      setSelectedFile(null);
    } catch (err: any) {
      setError(err.message || "An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!currentResume) return;

    if (!confirm("Are you sure you want to delete this resume? This will also remove associated audit analyses and records.")) {
      return;
    }

    try {
      const res = await fetch(`/api/resumes/${currentResume.id}`, { method: "DELETE" });
      if (res.ok) {
        setCurrentResume(null);
        setEditableData(null);
        setSuccessMessage("Resume deleted.");
      }
    } catch {
      setError("Failed to delete resume.");
    }
  };

  const handleSaveEdits = async () => {
    if (!currentResume || !editableData) return;
    setSavingEdit(true);

    try {
      const res = await fetch(`/api/resumes/${currentResume.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsed_data: editableData }),
      });

      if (res.ok) {
        setSuccessMessage("Extracted information updated!");
      }
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleTriggerAnalysis = async () => {
    if (!currentResume) return;

    if (!userConsent) {
      setError("Please grant consent before running the rule-based resume audit.");
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const res = await fetch(`/api/resumes/${currentResume.id}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_consent: true,
          target_career: editableData?.technical_skills ? "Full-Stack Web Developer" : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze resume.");
      }

      router.push("/resume");
    } catch (err: any) {
      setError(err.message || "Analysis request failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-3">
          <Shield size={13} className="text-indigo-600" /> Rule-Based Engine &bull; 100% Free &amp; Private (No External AI API Required)
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Resume Upload &amp; Verification
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload your resume in PDF or DOCX format. Our server-side rule-based engine extracts text, identifies skills, and evaluates your ATS readiness with zero third-party AI billing or data transmission.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-sm">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <div>
              <strong className="block font-bold text-sm">
                {error.startsWith("⚠️")
                  ? error
                  : detectedType
                  ? "⚠️ This document doesn't appear to be a resume. Please upload a valid resume in PDF format."
                  : error.includes("scanned") || error.includes("unreadable")
                  ? "⚠️ We couldn't extract readable content from this PDF. Please upload a clear, readable resume."
                  : "Upload Validation Notice"}
              </strong>
              {!error.startsWith("⚠️") && (
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">{error}</p>
              )}
              {detectedType && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-rose-100 dark:bg-rose-900/60 text-rose-900 dark:text-rose-100 border border-rose-200 dark:border-rose-800">
                  Detected Document Classification: <strong>{detectedType}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-start gap-3 text-emerald-700 dark:text-emerald-300 text-sm">
          <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Upload Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
          dragActive
            ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20"
            : "border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] hover:border-indigo-400"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-4">
          <UploadCloud size={32} />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          Drag &amp; Drop Your Resume Here
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Supports PDF (.pdf) and Microsoft Word (.docx) up to 5 MB
        </p>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
        >
          Browse Files
        </button>

        {selectedFile && (
          <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md mx-auto flex items-center justify-between text-left">
            <div className="flex items-center gap-3 truncate">
              <FileText size={24} className="text-indigo-600 shrink-0" />
              <div className="truncate">
                <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {selectedFile.name}
                </div>
                <div className="text-xs text-slate-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </div>
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shrink-0 disabled:opacity-50"
            >
              {uploading ? "Extracting..." : "Process Upload"}
            </button>
          </div>
        )}

        {uploading && (
          <div className="mt-4 max-w-md mx-auto">
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span className="text-xs text-slate-500 mt-1 block">Extracting readable text &amp; keywords...</span>
          </div>
        )}
      </div>

      {/* Review & Correct Extracted Information */}
      {currentResume && editableData && (
        <div className="mt-12 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                ✓ Document Extracted
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                Review &amp; Verify Extracted Information
              </h2>
              <p className="text-xs text-slate-500">
                Uploaded file: <strong>{currentResume.original_filename}</strong> ({(currentResume.file_size / 1024).toFixed(1)} KB)
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDeleteResume}
                className="px-3 py-1.5 text-xs font-semibold text-rose-600 border border-rose-200 dark:border-rose-900 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Replace / Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Detected Full Name
              </label>
              <input
                type="text"
                value={editableData.full_name || ""}
                onChange={(e) => setEditableData({ ...editableData, full_name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Detected Email
              </label>
              <input
                type="email"
                value={editableData.email || ""}
                onChange={(e) => setEditableData({ ...editableData, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={editableData.phone || ""}
                onChange={(e) => setEditableData({ ...editableData, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                LinkedIn / GitHub
              </label>
              <input
                type="text"
                value={editableData.linkedin_url || editableData.github_url || ""}
                onChange={(e) => setEditableData({ ...editableData, linkedin_url: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
              />
            </div>
          </div>

          {/* Detected Skills Chips */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Detected Technical Skills ({editableData.technical_skills?.length || 0})
              </label>
              <span className="text-xs text-slate-400">Click to add/remove in skill gap analysis</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(editableData.technical_skills || []).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleSaveEdits}
              disabled={savingEdit}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
            >
              {savingEdit ? "Saving..." : "Save Edits"}
            </button>

            {/* Rule-Based Audit Consent & Trigger */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userConsent}
                  onChange={(e) => setUserConsent(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>I agree to run Careerly&apos;s rule-based resume audit and career matching engine.</span>
              </label>

              <button
                onClick={handleTriggerAnalysis}
                disabled={analyzing || !userConsent}
                className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-lg shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Running Audit...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} /> Run Rule-Based Resume Audit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
