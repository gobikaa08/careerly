import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Sparkles, FileText, Compass, Target, MapPin } from "lucide-react";
import { CAREER_DATABASE } from "@/lib/careers-data";

export default function HomePage() {
  const popularCareers = CAREER_DATABASE.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                <Sparkles size={14} className="text-indigo-600" /> Full-Stack Career Intelligence &bull; 100% Free &amp; Private
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                Discover Your Path.<br />
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
                  Build Your Future.
                </span>
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                Upload your actual resume for server-side text extraction, transparent rule-based ATS audits, benchmark skill gap analysis, and personalized milestone roadmaps — with zero third-party AI billing or API requirements.
              </p>

              <div className="flex flex-wrap gap-3.5 pt-2">
                <Link
                  href="/upload"
                  className="px-6 py-3.5 rounded-xl text-white font-semibold text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all hover:-translate-y-0.5"
                >
                  Upload Your Resume
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/assessment"
                  className="px-6 py-3.5 rounded-xl font-semibold text-base bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:-translate-y-0.5 shadow-sm"
                >
                  Take Assessment
                </Link>
                <Link
                  href="/careers"
                  className="px-5 py-3.5 rounded-xl font-semibold text-base text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 transition-all flex items-center gap-1"
                >
                  Browse Careers &rarr;
                </Link>
              </div>

              <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-500" /> PDF &amp; DOCX Parsing
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Private Cloud Storage
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Database-Backed Progress
                </div>
              </div>
            </div>

            {/* Right Interactive Vector Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <img
                  src="/assets/images/hero-illustration.svg"
                  alt="Careerly Trajectory Graphics"
                  className="w-full h-auto drop-shadow-xl"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5-Stage Journey Section */}
      <section className="py-16 bg-white dark:bg-[#111827] border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              The 5-Step Career Acceleration Pipeline
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
              No generic mock data. Built around your verified skills and actual qualifications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Step 01</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-2">Resume Upload</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Upload your PDF or Word resume. Our server extracts readable text and flags image-only scans.
                </p>
              </div>
              <Link href="/upload" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-4 inline-flex items-center gap-1 hover:underline">
                Upload File →
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">Step 02</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-2">Review &amp; Rule-Based Audit</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Review extracted skills and projects. Run Careerly&apos;s deterministic rule-based audit with zero third-party data sharing.
                </p>
              </div>
              <Link href="/resume" className="text-xs font-bold text-violet-600 dark:text-violet-400 mt-4 inline-flex items-center gap-1 hover:underline">
                View Audit →
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">Step 03</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-2">Target Career</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Select a recommended tech trajectory matching your actual background and interests.
                </p>
              </div>
              <Link href="/careers" className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-4 inline-flex items-center gap-1 hover:underline">
                Explore Roles →
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Step 04</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-2">Skill Gap Matrix</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Compare your verified competencies against industry benchmarks and isolate missing skills.
                </p>
              </div>
              <Link href="/skill-gap" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-4 inline-flex items-center gap-1 hover:underline">
                Analyze Gaps →
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Step 05</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-2">Roadmap &amp; Launch</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Follow curated learning milestones and monitor your Job Readiness Score in real-time.
                </p>
              </div>
              <Link href="/dashboard" className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-4 inline-flex items-center gap-1 hover:underline">
                Open Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Roles Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                In-Demand Tech Career Tracks
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Calibrated against current enterprise hiring standards and real tech requirements.
              </p>
            </div>
            <Link href="/careers" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              View All 14 Roles →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularCareers.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      {c.category}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {c.projectedGrowth.split(" ")[0]} Growth
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{c.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {c.tagline}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs mb-4">
                    <span className="text-slate-400 block font-semibold uppercase tracking-wider mb-0.5">Est. Salary Band</span>
                    <strong className="text-slate-900 dark:text-white text-sm">{c.salaryRange}</strong>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <Link
                    href={`/skill-gap?career=${c.id}`}
                    className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Skill Matrix
                  </Link>
                  <Link
                    href={`/roadmap?career=${c.id}`}
                    className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    View Roadmap
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
