"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, ArrowRight, CheckCircle2, Star, Target } from "lucide-react";
import { CAREER_DATABASE } from "@/lib/careers-data";
import { setGlobalTargetRole, syncLocalTargetRole, TARGET_ROLE_EVENT, getStoredTargetRole } from "@/lib/target-role";
import { CareerDefinition } from "@/types";

export default function CareerExplorerPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCareer, setSelectedCareer] = useState<CareerDefinition | null>(null);
  const [targetCareerTitle, setTargetCareerTitle] = useState<string | null>(() => {
    const stored = getStoredTargetRole();
    return stored ? stored.title : null;
  });
  const [updatingTarget, setUpdatingTarget] = useState(false);

  useEffect(() => {
    // Fetch active target career from server
    const fetchTarget = async () => {
      try {
        const res = await fetch("/api/dashboard", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.targetCareer?.title) {
            setTargetCareerTitle(data.targetCareer.title);
            syncLocalTargetRole(data.targetCareer.title);
          }
        }
      } catch {
        // Ignore
      }
    };

    fetchTarget();

    const onTargetUpdated = (e: any) => {
      const newTitle = e.detail?.title;
      if (newTitle) {
        setTargetCareerTitle(newTitle);
      }
    };
    window.addEventListener(TARGET_ROLE_EVENT, onTargetUpdated);
    return () => window.removeEventListener(TARGET_ROLE_EVENT, onTargetUpdated);
  }, []);

  const handleSetTarget = async (careerTitle: string) => {
    setUpdatingTarget(true);
    try {
      await setGlobalTargetRole(careerTitle);
      setTargetCareerTitle(careerTitle);
    } catch {
      alert("Failed to update target career.");
    } finally {
      setUpdatingTarget(false);
    }
  };

  const filteredCareers = CAREER_DATABASE.filter((career) => {
    const matchesCat = selectedCategory === "all" || career.categoryKey === selectedCategory;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      career.title.toLowerCase().includes(q) ||
      career.tagline.toLowerCase().includes(q) ||
      career.skills.some((s) => s.name.toLowerCase().includes(q)) ||
      career.tools.some((t) => t.toLowerCase().includes(q));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Explore Tech Career Tracks
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Search comprehensive technology disciplines, inspect benchmark competencies, and set your target career trajectory.
        </p>
      </div>

      {/* Target Active Alert */}
      {targetCareerTitle && (
        <div className="mb-8 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Target size={20} className="text-indigo-600 shrink-0" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                Active Target Career
              </span>
              <strong className="text-base text-slate-900 dark:text-white">{targetCareerTitle}</strong>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/skill-gap"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Analyze Skill Gap
            </Link>
            <Link
              href="/roadmap"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              Open Roadmap
            </Link>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by role title, skill (e.g. React, Python), or tool..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { key: "all", label: "All Tracks" },
              { key: "software", label: "Software" },
              { key: "data-ai", label: "AI & Data" },
              { key: "design", label: "UI/UX Design" },
              { key: "cloud-security", label: "Cloud & Security" },
              { key: "product", label: "Product" },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.key
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Career Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCareers.map((c) => {
          const isTarget = targetCareerTitle?.toLowerCase() === c.title.toLowerCase();

          return (
            <div
              key={c.id}
              className={`p-6 rounded-2xl bg-white dark:bg-[#111827] border ${
                isTarget ? "border-indigo-600 ring-2 ring-indigo-500/20" : "border-slate-200 dark:border-slate-800"
              } shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    {c.category}
                  </span>
                  {isTarget && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Target Role
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1.5">{c.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {c.tagline}
                </p>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Salary Band</span>
                    <strong className="text-slate-900 dark:text-white text-xs">{c.salaryRange.split("/")[0]}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Growth</span>
                    <strong className="text-emerald-600 text-xs">{c.projectedGrowth.split(" ")[0]}</strong>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Key Tools</span>
                  <div className="flex flex-wrap gap-1">
                    {c.tools.slice(0, 4).map((tool, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <button
                  onClick={() => setSelectedCareer(c)}
                  className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                >
                  Role Details
                </button>
                <button
                  onClick={() => handleSetTarget(c.title)}
                  disabled={updatingTarget || isTarget}
                  className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-colors ${
                    isTarget
                      ? "bg-emerald-600 text-white cursor-default"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {isTarget ? "✓ Selected" : "Set Target"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Details Modal */}
      {selectedCareer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                  {selectedCareer.category}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5">{selectedCareer.title}</h2>
              </div>
              <button
                onClick={() => setSelectedCareer(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              {selectedCareer.overview}
            </p>

            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Core Responsibilities</h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {selectedCareer.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Required Skills Benchmark</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedCareer.skills.map((s, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex justify-between items-center">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{s.name}</span>
                    <span className="font-bold text-indigo-600">{s.benchmark}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedCareer(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleSetTarget(selectedCareer.title);
                  setSelectedCareer(null);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              >
                Set as My Target Career
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
