import Link from "next/link";
import { ArrowLeft, Compass, LayoutDashboard, FileText, Briefcase, Map, Upload } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 mb-4">
          Error 404
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Page Not Found
        </h1>

        <p className="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          The page you are looking for doesn&apos;t exist or has moved. Explore Careerly&apos;s available navigation modules below:
        </p>

        {/* Quick Navigation Cards */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
          <Link
            href="/dashboard"
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-500 hover:shadow-sm transition-all group"
          >
            <LayoutDashboard className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-1.5 group-hover:scale-105 transition-transform" />
            <span className="block text-xs font-bold text-slate-900 dark:text-white">Dashboard</span>
            <span className="text-[11px] text-slate-500">Your career hub</span>
          </Link>

          <Link
            href="/resume"
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-500 hover:shadow-sm transition-all group"
          >
            <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400 mb-1.5 group-hover:scale-105 transition-transform" />
            <span className="block text-xs font-bold text-slate-900 dark:text-white">Resume Audit</span>
            <span className="text-[11px] text-slate-500">ATS audit &amp; score</span>
          </Link>

          <Link
            href="/upload"
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-500 hover:shadow-sm transition-all group"
          >
            <Upload className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-1.5 group-hover:scale-105 transition-transform" />
            <span className="block text-xs font-bold text-slate-900 dark:text-white">Upload Resume</span>
            <span className="text-[11px] text-slate-500">PDF / DOCX parser</span>
          </Link>

          <Link
            href="/careers"
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-500 hover:shadow-sm transition-all group"
          >
            <Briefcase className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mb-1.5 group-hover:scale-105 transition-transform" />
            <span className="block text-xs font-bold text-slate-900 dark:text-white">Careers</span>
            <span className="text-[11px] text-slate-500">Role benchmarks</span>
          </Link>

          <Link
            href="/skill-gap"
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-500 hover:shadow-sm transition-all group"
          >
            <Compass className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-1.5 group-hover:scale-105 transition-transform" />
            <span className="block text-xs font-bold text-slate-900 dark:text-white">Skill Gap</span>
            <span className="text-[11px] text-slate-500">Missing skills</span>
          </Link>

          <Link
            href="/roadmap"
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-500 hover:shadow-sm transition-all group"
          >
            <Map className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-1.5 group-hover:scale-105 transition-transform" />
            <span className="block text-xs font-bold text-slate-900 dark:text-white">Roadmap</span>
            <span className="text-[11px] text-slate-500">Step-by-step plan</span>
          </Link>
        </div>

        {/* Back to Home CTA */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
