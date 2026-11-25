import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800 pt-12 pb-8 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center">
              Career<span className="text-indigo-600 dark:text-indigo-400">ly</span>
            </span>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Full-Stack Career Navigator. Real resume parsing, deterministic rule-based skill gap analysis, personalized roadmaps, and ATS audit accuracy with zero third-party billing.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link></li>
              <li><Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400">Dashboard</Link></li>
              <li><Link href="/upload" className="hover:text-indigo-600 dark:hover:text-indigo-400">Upload Resume</Link></li>
              <li><Link href="/careers" className="hover:text-indigo-600 dark:hover:text-indigo-400">Career Explorer</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Tools &amp; Modules
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/resume" className="hover:text-indigo-600 dark:hover:text-indigo-400">Resume Audit &amp; Score</Link></li>
              <li><Link href="/skill-gap" className="hover:text-indigo-600 dark:hover:text-indigo-400">Skill Gap Analyzer</Link></li>
              <li><Link href="/roadmap" className="hover:text-indigo-600 dark:hover:text-indigo-400">Learning Roadmaps</Link></li>
              <li><Link href="/profile" className="hover:text-indigo-600 dark:hover:text-indigo-400">Settings &amp; Privacy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Security &amp; Privacy
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              Your resume files are securely stored in isolated private storage buckets. Text is transmitted to AI only with your explicit consent.
            </p>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Row Level Security Active
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 dark:text-slate-400 gap-3">
          <div>
            &copy; {new Date().getFullYear()} Careerly – AI Career Navigator. All rights reserved.
          </div>
          <div className="flex gap-4">
            <Link href="/profile" className="hover:text-slate-700 dark:hover:text-slate-300">Privacy &amp; Data Control</Link>
            <Link href="/profile" className="hover:text-slate-700 dark:hover:text-slate-300">Account Deletion</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
