"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, AlertCircle, Copy, Printer, FileText, Upload, Sparkles, ArrowRight } from "lucide-react";
import { ResumeAnalysisRecord, ResumeRecord } from "@/types";

export default function ResumeImprovementPage() {
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState<ResumeRecord | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysisRecord | null>(null);
  const [activeTab, setActiveTab] = useState<"analysis" | "checklist" | "preview">("analysis");

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          setResume(data.latestResume || null);
          setAnalysis(data.latestAnalysis || null);
        }
      } catch (err) {
        console.error("Failed to load resume analysis", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, []);

  const handleCopyPlainText = () => {
    if (!resume?.parsed_data) return;
    const p = resume.parsed_data;

    const text = `
${p.full_name || "Candidate Name"}
${p.email || ""} | ${p.phone || ""} | ${p.location || ""}
${p.linkedin_url || ""} | ${p.github_url || ""}

SUMMARY
${p.summary || "Technical professional"}

TECHNICAL COMPETENCIES
${(p.technical_skills || []).join(", ")}

PROJECTS
${(p.projects || []).map(proj => `* ${proj.title}: ${proj.description} (Tech: ${proj.technologies?.join(", ")})`).join("\n")}

EDUCATION
${(p.education || []).map(e => `* ${e.degree} - ${e.institution} (${e.graduation_year || ""})`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(text);
    alert("Plain text resume copied to clipboard!");
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-slate-500">Loading your resume analysis...</p>
      </div>
    );
  }

  // Empty state if no resume uploaded
  if (!resume) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 mx-auto flex items-center justify-center mb-4">
          <Upload size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          No Resume Uploaded Yet
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          Upload your PDF or Word resume to unlock our ATS compatibility audit, AI-powered quality suggestions, and personalized skill gap breakdown.
        </p>
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Upload Resume Now <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 mb-2">
            <Sparkles size={14} /> Rule-Based Resume Quality Suite
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Resume Analysis &amp; ATS Audit
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Auditing <strong>{resume.original_filename}</strong> (100% Free &amp; Private Rule-Based Engine)
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab("analysis")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "analysis" ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-sm" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Quality Audit Report
          </button>
          <button
            onClick={() => setActiveTab("checklist")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "checklist" ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-sm" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            ATS Criteria
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "preview" ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-sm" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            ATS Preview &amp; Export
          </button>
        </div>
      </div>

      {/* Score Banner */}
      {analysis ? (
        <div className="my-8 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border-2 border-indigo-600/30 text-indigo-600 flex flex-col items-center justify-center font-extrabold shrink-0">
              <span className="text-2xl leading-none">{analysis.overall_score}%</span>
              <span className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Rating</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Careerly Resume Audit Score
                {analysis.candidate_level && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 border border-indigo-200 dark:border-indigo-800">
                    {analysis.candidate_level === "student_fresher" ? "Student / Fresher Track" : "Experienced Professional"}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Notice: This is an approximate Careerly assessment heuristic evaluating clarity, completeness, and keyword presence — not an official employer&apos;s proprietary ATS score.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/upload"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Update Resume
            </Link>
            <Link
              href="/skill-gap"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Check Skill Gaps
            </Link>
          </div>
        </div>
      ) : (
        <div className="my-8 p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">Rule-Based Analysis Not Yet Run</h3>
            <p className="text-xs text-amber-700 dark:text-amber-400">Trigger the rule-based analysis to evaluate your resume against industry ATS benchmarks.</p>
          </div>
          <Link href="/upload" className="px-4 py-2 text-xs font-bold bg-amber-600 text-white rounded-lg">
            Review &amp; Audit
          </Link>
        </div>
      )}

      {/* TAB 1: AI QUALITY ANALYSIS */}
      {activeTab === "analysis" && analysis && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Executive Summary</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-emerald-200 dark:border-emerald-900/60">
              <h3 className="text-base font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
                <CheckCircle2 size={18} /> Observed Strengths
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {(analysis.strengths || []).map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-amber-200 dark:border-amber-900/60">
              <h3 className="text-base font-bold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
                <AlertTriangle size={18} /> High-Yield Weaknesses
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {(analysis.weaknesses || []).map((weak, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Category-by-Category Evidence Breakdown */}
          {analysis.categories && analysis.categories.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Evidence-Based Scoring Breakdown (10 Core Dimensions)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Transparent rubric weighting with verified positive evidence and explicit point deductions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.categories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <strong className="text-slate-900 dark:text-white font-semibold">{cat.category}</strong>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 border border-indigo-200 dark:border-indigo-800">
                        {cat.score}/100 • {Math.round(cat.weight * 100)}% wt
                      </span>
                    </div>

                    {cat.positiveEvidence && cat.positiveEvidence.length > 0 && (
                      <ul className="text-emerald-700 dark:text-emerald-400 space-y-1">
                        {cat.positiveEvidence.map((ev, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span>✓</span>
                            <span>{ev}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {cat.deductions && cat.deductions.length > 0 && (
                      <div className="pt-1 border-t border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400 space-y-1">
                        {cat.deductions.map((ded, i) => (
                          <div key={i} className="text-[11px]">
                            <span>• {ded.reason} (-{ded.points} pts)</span>
                            <span className="block text-slate-500 italic mt-0.5 ml-2.5">Fix: {ded.actionableFix}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ATS CRITERIA CHECKLIST */}
      {activeTab === "checklist" && analysis && (
        <div className="space-y-4">
          {(analysis.ats_checklist || []).map((item, idx) => {
            const isPassed = item.status === "passed";
            const isWarning = item.status === "warning";

            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isPassed
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : isWarning
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.criterion}</h4>
                  <p className="text-xs text-slate-500 mt-1">{item.feedback}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-400">+{item.weight} pts</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: LIVE ATS PREVIEW & EXPORT */}
      {activeTab === "preview" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              ATS-Optimized Single Column Layout
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleCopyPlainText}
                className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-1.5 hover:bg-slate-50"
              >
                <Copy size={14} /> Copy Plain Text
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg flex items-center gap-1.5 hover:bg-indigo-700"
              >
                <Printer size={14} /> Print / Save PDF
              </button>
            </div>
          </div>

          {/* Clean Printable Sheet */}
          <div id="resume-sheet" className="p-10 rounded-2xl bg-white text-slate-900 border border-slate-300 shadow-lg font-sans max-w-3xl mx-auto space-y-6">
            <div className="text-center border-b border-slate-900 pb-4">
              <h2 className="text-2xl font-bold">{resume.parsed_data?.full_name || "Candidate Name"}</h2>
              <div className="text-xs text-slate-600 mt-1 space-x-2">
                <span>{resume.parsed_data?.email}</span>
                {resume.parsed_data?.phone && <span>• {resume.parsed_data.phone}</span>}
                {resume.parsed_data?.location && <span>• {resume.parsed_data.location}</span>}
              </div>
              <div className="text-xs text-indigo-700 font-semibold mt-1 space-x-2">
                {resume.parsed_data?.linkedin_url && <span>{resume.parsed_data.linkedin_url}</span>}
                {resume.parsed_data?.github_url && <span>• {resume.parsed_data.github_url}</span>}
              </div>
            </div>

            {resume.parsed_data?.technical_skills && resume.parsed_data.technical_skills.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">
                  Technical Competencies
                </h3>
                <p className="text-xs leading-relaxed">
                  {resume.parsed_data.technical_skills.join(", ")}
                </p>
              </div>
            )}

            {resume.parsed_data?.education && resume.parsed_data.education.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">
                  Education
                </h3>
                {resume.parsed_data.education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between text-xs mb-1">
                    <div>
                      <strong>{edu.degree}</strong> – {edu.institution}
                    </div>
                    <span className="text-slate-500">{edu.graduation_year}</span>
                  </div>
                ))}
              </div>
            )}

            {resume.parsed_data?.projects && resume.parsed_data.projects.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">
                  Key Projects
                </h3>
                {resume.parsed_data.projects.map((proj, idx) => (
                  <div key={idx} className="text-xs mb-3">
                    <strong className="text-sm block">{proj.title}</strong>
                    <p className="text-slate-700 mt-0.5">{proj.description}</p>
                    {proj.technologies && (
                      <span className="text-slate-500 italic">Stack: {proj.technologies.join(", ")}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
