"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { setGlobalTargetRole, syncLocalTargetRole, TARGET_ROLE_EVENT } from "@/lib/target-role";
import { CAREER_DATABASE } from "@/lib/careers-data";
import {
  Upload,
  FileText,
  CheckCircle2,
  ArrowRight,
  Target,
  Clock,
  Trophy,
  Sparkles,
  Plus,
  BookOpen,
  TrendingUp,
  Map,
} from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [loggingHour, setLoggingHour] = useState(false);
  const [logSuccess, setLogSuccess] = useState<string | null>(null);
  const [switchingTarget, setSwitchingTarget] = useState(false);

  useEffect(() => {
    fetchDashboard();

    const onTargetUpdated = () => {
      fetchDashboard();
    };
    window.addEventListener(TARGET_ROLE_EVENT, onTargetUpdated);
    window.addEventListener("careerly_roadmap_updated", onTargetUpdated);
    return () => {
      window.removeEventListener(TARGET_ROLE_EVENT, onTargetUpdated);
      window.removeEventListener("careerly_roadmap_updated", onTargetUpdated);
    };
  }, []);

  const handleSwitchTargetRole = async (newTitle: string) => {
    setSwitchingTarget(true);
    await setGlobalTargetRole(newTitle);
    await fetchDashboard();
    setSwitchingTarget(false);
  };

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.targetCareer?.title) {
          syncLocalTargetRole(json.targetCareer.title);
        }
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogHour = async (hours = 1) => {
    setLoggingHour(true);
    setLogSuccess(null);
    try {
      const res = await fetch("/api/study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours }),
      });

      if (res.ok) {
        setLogSuccess(`+${hours} hr study session recorded!`);
        await fetchDashboard();
        setTimeout(() => setLogSuccess(null), 4000);
      }
    } catch {
      alert("Failed to log study hour.");
    } finally {
      setLoggingHour(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-slate-500">Loading your personalized career dashboard...</p>
      </div>
    );
  }

  // Onboarding state if user has not uploaded any resume yet
  if (!data?.hasResume) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 mx-auto flex items-center justify-center mb-6">
            <Upload size={32} />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
            Welcome to Your Career Command Center
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto mb-8 leading-relaxed">
            Your dashboard currently shows zero progress because you haven&apos;t uploaded a resume yet. Upload your resume to unlock your real readiness score, verified skills, and roadmap.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/upload"
              className="px-6 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2"
            >
              Upload Resume (PDF / DOCX) <ArrowRight size={18} />
            </Link>
            <Link
              href="/careers"
              className="px-6 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
            >
              Browse 14 Tech Careers
            </Link>
            <Link
              href="/assessment"
              className="px-6 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
            >
              Take Assessment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { profile, readiness, targetCareer, skills, roadmap, latestAnalysis, nextActions, studyActivity } = data;

  const totalStudyHours = (studyActivity || []).reduce((acc: number, cur: any) => acc + (cur.hours || 0), 0);
  const targetWeeklyHours = profile?.weekly_hours || 10;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-slate-200 dark:border-slate-800 gap-4 mb-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-0.5">
            Executive Command Center
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome, {profile?.full_name || profile?.email?.split("@")[0] || "Candidate"}!
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tracking your trajectory towards: <strong className="text-indigo-600">{targetCareer?.title || "Technology Specialist"}</strong>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/upload"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
          >
            Update Resume
          </Link>
          <Link
            href="/skill-gap"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
          >
            Update Skill Matrix
          </Link>
        </div>
      </div>

      {/* Main Readiness Gauge Hero */}
      <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex flex-col items-center justify-center font-extrabold shadow-lg shadow-indigo-600/20 shrink-0">
            <span className="text-3xl leading-none">{readiness?.score || 0}%</span>
            <span className="text-[10px] tracking-wider uppercase font-bold mt-1 opacity-90">Ready</span>
          </div>

          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              Job Readiness Index
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {readiness?.status || "In Progress"}
            </h2>
            <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
              Weighted composite from your Resume Analysis (20%), Skill Gap Mastery (35%), and Roadmap Completion (30%).
            </p>
          </div>
        </div>

        {/* Target Career Capsule with Instant Synchronized Role Switcher */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full sm:w-auto min-w-[280px]">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Target Role
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              {targetCareer?.salaryRange || "$80,000 - $140,000 / yr"}
            </span>
          </div>

          <select
            value={targetCareer?.title || ""}
            onChange={(e) => handleSwitchTargetRole(e.target.value)}
            disabled={switchingTarget}
            className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
            aria-label="Switch Active Target Role"
          >
            {CAREER_DATABASE.map((c) => (
              <option key={c.id} value={c.title}>
                {c.title}
              </option>
            ))}
          </select>

          <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] font-bold">
            <Link href="/skill-gap" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Skill Gap Matrix &rarr;
            </Link>
            <Link href="/roadmap" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Learning Roadmap &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Status Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Link
          href="/resume"
          className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Resume ATS</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                Audit
              </span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {latestAnalysis?.overall_score || 0}%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {latestAnalysis ? "Quality audit verified" : "Pending analysis"}
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 mt-4 flex items-center gap-1">
            View Resume Audit →
          </span>
        </Link>

        <Link
          href="/skill-gap"
          className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Skill Coverage</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                Verified
              </span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {skills?.coveragePct || 0}%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {skills?.matchedCount || 0} benchmark skills satisfied
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 mt-4 flex items-center gap-1">
            Open Skill Matrix →
          </span>
        </Link>

        <Link
          href="/roadmap"
          className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Roadmap</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                Active
              </span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {roadmap?.progress || 0}%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {roadmap?.completedMilestonesCount || 0} tasks completed
            </p>
          </div>
          <span className="text-xs font-bold text-amber-600 mt-4 flex items-center gap-1">
            Check Off Milestones →
          </span>
        </Link>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Study Habit</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700">
                Tracked
              </span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalStudyHours} hrs
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Target: {targetWeeklyHours} hrs/week
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => handleLogHour(1)}
              disabled={loggingHour}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Plus size={14} /> Log 1 hr
            </button>
            {logSuccess && (
              <span className="text-[10px] font-bold text-emerald-600 animate-in fade-in">
                {logSuccess}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Next Actions */}
      <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          Recommended Next Steps
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          High-yield actions calculated directly from your missing skills and incomplete roadmap milestones.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(nextActions || []).map((action: any, idx: number) => (
            <Link
              key={idx}
              href={action.link}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 mb-2 inline-block">
                  {action.badge}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">
                  {action.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">{action.description}</p>
              </div>
              <span className="text-xs font-bold text-indigo-600 mt-4 flex items-center gap-1">
                Action Step →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
