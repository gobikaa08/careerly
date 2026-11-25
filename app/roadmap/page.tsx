"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Circle, ExternalLink, Trophy, Sparkles, BookOpen, Clock, Target, ArrowRight } from "lucide-react";
import { CAREER_DATABASE, findCareerDefinition } from "@/lib/careers-data";
import { setGlobalTargetRole, syncLocalTargetRole, TARGET_ROLE_EVENT, getStoredTargetRole } from "@/lib/target-role";
import { CareerDefinition, RoadmapPhase } from "@/types";

function RoadmapContent() {
  const searchParams = useSearchParams();
  const careerParam = searchParams?.get("career");

  const [loading, setLoading] = useState(true);
  const [selectedCareerId, setSelectedCareerId] = useState<string>(() => {
    if (careerParam) {
      return findCareerDefinition(careerParam)?.id || careerParam;
    }
    const stored = getStoredTargetRole();
    if (stored) return stored.id;
    return CAREER_DATABASE[0].id;
  });
  const [activeTargetTitle, setActiveTargetTitle] = useState<string>("");
  const [careerTitle, setCareerTitle] = useState("");
  const [roadmapId, setRoadmapId] = useState("");
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [settingTarget, setSettingTarget] = useState(false);
  const [isTarget, setIsTarget] = useState(false);

  const [celebrationModal, setCelebrationModal] = useState<{ open: boolean; title: string }>({
    open: false,
    title: "",
  });

  useEffect(() => {
    // 1. Always fetch authoritative roadmap from backend when no URL career override is given,
    // so changes made to target career in Dashboard / Careers / Skill Gap / Profile sync automatically.
    fetchRoadmap(careerParam || undefined);

    // 2. Global Target Role listener for real-time live synchronization across all sections
    const onTargetUpdated = (e: any) => {
      const newTitle = e.detail?.title;
      const newId = e.detail?.id;
      if (newTitle) {
        setActiveTargetTitle(newTitle);
        if (!careerParam || careerParam.toLowerCase() === (newId || "").toLowerCase()) {
          const matched = findCareerDefinition(newId || newTitle);
          if (matched) {
            setSelectedCareerId(matched.id);
            setCareerTitle(matched.title);
          } else {
            if (newId) setSelectedCareerId(newId);
            setCareerTitle(newTitle);
          }
          setIsTarget(true);
          fetchRoadmap(matched?.id || newId || newTitle);
        } else {
          const paramDef = findCareerDefinition(careerParam);
          const newDef = findCareerDefinition(newId || newTitle);
          setIsTarget(Boolean(paramDef && newDef && paramDef.id === newDef.id));
        }
      }
    };

    // 3. Cross-tab localStorage listener
    const onStorageChange = (e: StorageEvent) => {
      if (
        (e.key === "careerly_target_career" || e.key === "careerly_target_career_title") &&
        e.newValue &&
        !careerParam
      ) {
        const matched = findCareerDefinition(e.newValue);
        if (matched) {
          setActiveTargetTitle(matched.title);
          setSelectedCareerId(matched.id);
          setCareerTitle(matched.title);
          setIsTarget(true);
          fetchRoadmap(matched.id);
        }
      }
    };

    window.addEventListener(TARGET_ROLE_EVENT, onTargetUpdated);
    window.addEventListener("storage", onStorageChange);
    return () => {
      window.removeEventListener(TARGET_ROLE_EVENT, onTargetUpdated);
      window.removeEventListener("storage", onStorageChange);
    };
  }, [careerParam]);

  const fetchRoadmap = async (careerOverride?: string) => {
    setLoading(true);
    try {
      const url = careerOverride
        ? `/api/roadmaps?career=${encodeURIComponent(careerOverride)}`
        : "/api/roadmaps";
      const res = await fetch(url, { cache: "no-store" });

      if (res.ok) {
        const data = await res.json();
        const def: CareerDefinition =
          data.careerDefinition ||
          findCareerDefinition(data.roadmap?.career_title) ||
          CAREER_DATABASE[0];

        const fetchedTitle = data.roadmap?.career_title || def.title;
        setCareerTitle(fetchedTitle);
        setSelectedCareerId(def.id);
        setRoadmapId(data.roadmap?.id || "");
        setPhases(data.roadmap?.roadmap_data?.phases || def.roadmapPhases || []);
        setCompletedTaskIds(data.completedTaskIds || []);
        setProgress(data.roadmap?.progress || 0);

        const serverTarget = data.activeTargetCareer || def.title;
        setActiveTargetTitle(serverTarget);
        syncLocalTargetRole(serverTarget);

        const targetDef = findCareerDefinition(serverTarget);
        const matchesTarget =
          typeof data.isTarget === "boolean"
            ? data.isTarget
            : Boolean(targetDef && targetDef.id === def.id);
        setIsTarget(matchesTarget);
      } else {
        // Fallback when unauthenticated
        const fallbackRole =
          findCareerDefinition(careerOverride) ||
          findCareerDefinition(getStoredTargetRole()?.id) ||
          CAREER_DATABASE[0];
        setCareerTitle(fallbackRole.title);
        setSelectedCareerId(fallbackRole.id);
        setPhases(fallbackRole.roadmapPhases);
        const stored = getStoredTargetRole();
        setActiveTargetTitle(stored?.title || fallbackRole.title);
        setIsTarget(!stored || stored.id === fallbackRole.id);
      }
    } catch (err) {
      console.error("Failed to fetch roadmap", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackChange = async (newCareerId: string) => {
    setSelectedCareerId(newCareerId);
    const found = CAREER_DATABASE.find((c) => c.id === newCareerId);
    if (found) {
      setCareerTitle(found.title);
      setPhases(found.roadmapPhases);
      await fetchRoadmap(found.id);
    }
  };

  const handleSetTarget = async () => {
    setSettingTarget(true);
    try {
      await setGlobalTargetRole(careerTitle);
      setActiveTargetTitle(careerTitle);
      setIsTarget(true);
    } catch {
      alert("Failed to update target career.");
    } finally {
      setSettingTarget(false);
    }
  };

  const handleToggleTask = async (taskId: string, taskTitle: string, phaseId: string, phaseTitle: string) => {
    const isCompleted = completedTaskIds.includes(taskId);
    const nextCompleted = !isCompleted;

    // Optimistic UI update
    setCompletedTaskIds((prev) =>
      nextCompleted ? [...prev, taskId] : prev.filter((id) => id !== taskId)
    );

    try {
      const res = await fetch("/api/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roadmap_id: roadmapId,
          task_id: taskId,
          task_title: taskTitle,
          phase_id: phaseId,
          completed: nextCompleted,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress);

        // Notify dashboard of verified roadmap milestone completion
        window.dispatchEvent(
          new CustomEvent("careerly_roadmap_updated", { detail: { progress: data.progress } })
        );

        // Check if phase was just completed
        const phase = phases.find((p) => p.title === phaseTitle || p.id === phaseId);
        if (phase && nextCompleted) {
          const phaseTaskIds = [
            ...(phase.topics ? phase.topics.map((t) => t.id) : []),
            ...(phase.tasks ? phase.tasks.map((t) => t.id) : []),
            `project-${phase.id}`,
          ];
          const allDone = phaseTaskIds.every((id) =>
            id === taskId ? true : completedTaskIds.includes(id)
          );

          if (allDone) {
            setCelebrationModal({ open: true, title: phase.title });
          }
        }
      }
    } catch {
      // Revert if error
      fetchRoadmap(selectedCareerId);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-slate-500">Loading learning roadmap...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header & Career Track Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-slate-200 dark:border-slate-800 gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 mb-2">
            <Sparkles size={13} /> Curated Milestones
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {careerTitle} Roadmap
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Sequential phases from fundamentals to production deployment. Check off tasks to persist verified progress.
          </p>
        </div>

        {/* Track Selector & Set Target Action */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2.5">
          <select
            value={selectedCareerId}
            onChange={(e) => handleTrackChange(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white shadow-sm"
          >
            {CAREER_DATABASE.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleSetTarget}
            disabled={settingTarget || isTarget}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              isTarget
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 cursor-default"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
            }`}
          >
            {isTarget ? "✓ Active Target Role" : "Set as Target Career"}
          </button>

          <Link
            href={`/skill-gap?career=${selectedCareerId}`}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            View Skill Gap
          </Link>
        </div>
      </div>

      {/* Track Progress Card */}
      <div className="mb-10 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Overall Curriculum Mastery
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            {progress}% Completed
          </div>
          <span className="text-xs text-slate-500">
            {completedTaskIds.length} milestones verified in database
          </span>
        </div>

        <div className="w-full sm:w-64">
          <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Sequential Phases */}
      <div className="space-y-8">
        {phases.map((phase, pIdx) => {
          const phaseTaskIds = [
            ...(phase.topics ? phase.topics.map((t) => t.id) : []),
            ...(phase.tasks ? phase.tasks.map((t) => t.id) : []),
            `project-${phase.id}`,
          ];
          const phaseTotal = phaseTaskIds.length;
          const phaseCompleted = phaseTaskIds.filter((id) => completedTaskIds.includes(id)).length;
          const phasePct = phaseTotal > 0 ? Math.round((phaseCompleted / phaseTotal) * 100) : 0;
          const isPhaseDone = phasePct === 100;

          return (
            <div
              key={phase.id || pIdx}
              className={`p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111827] border ${
                isPhaseDone ? "border-emerald-500/60" : "border-slate-200 dark:border-slate-800"
              } shadow-sm space-y-6`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                      {phase.timeline}
                    </span>
                    {isPhaseDone && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        ✓ Phase Mastered
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{phase.title}</h2>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl">{phase.description}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {phaseCompleted} / {phaseTotal} Milestones
                  </span>
                  <div className="w-28 h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full ${isPhaseDone ? "bg-emerald-500" : "bg-indigo-600"}`}
                      style={{ width: `${phasePct}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Topics */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <BookOpen size={14} /> Core Topics &amp; Official References
                </h4>
                <div className="space-y-2.5">
                  {(phase.topics || []).map((topic) => {
                    const isChecked = completedTaskIds.includes(topic.id);

                    return (
                      <div
                        key={topic.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                          isChecked
                            ? "bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900"
                            : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        <button
                          onClick={() => handleToggleTask(topic.id, topic.title, phase.id, phase.title)}
                          className="flex items-center gap-3 text-left flex-1"
                        >
                          {isChecked ? (
                            <CheckCircle2 size={18} className="text-indigo-600 shrink-0" />
                          ) : (
                            <Circle size={18} className="text-slate-400 shrink-0" />
                          )}
                          <span className={`font-medium ${isChecked ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-200"}`}>
                            {topic.title}
                          </span>
                        </button>

                        {topic.resourceUrl && (
                          <a
                            href={topic.resourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 font-semibold inline-flex items-center gap-1 ml-3 hover:underline shrink-0"
                          >
                            Docs <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Practical Drills */}
              {phase.tasks && phase.tasks.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Clock size={14} /> Hands-On Practice Tasks
                  </h4>
                  <div className="space-y-2">
                    {phase.tasks.map((task) => {
                      const isChecked = completedTaskIds.includes(task.id);

                      return (
                        <button
                          key={task.id}
                          onClick={() => handleToggleTask(task.id, task.title, phase.id, phase.title)}
                          className={`w-full p-3 rounded-xl border flex items-center gap-3 text-left text-xs transition-colors ${
                            isChecked
                              ? "bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900"
                              : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                          }`}
                        >
                          {isChecked ? (
                            <CheckCircle2 size={18} className="text-indigo-600 shrink-0" />
                          ) : (
                            <Circle size={18} className="text-slate-400 shrink-0" />
                          )}
                          <span className={`font-medium ${isChecked ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-200"}`}>
                            {task.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Capstone Deliverable */}
              {phase.project && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/40 border border-indigo-200 dark:border-indigo-800 flex justify-between items-center flex-wrap gap-3">
                  <div className="flex items-center gap-2.5">
                    <Trophy size={18} className="text-indigo-600 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase block">Phase Capstone</span>
                      <strong className="text-xs text-slate-900 dark:text-white">{phase.project}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleTask(`project-${phase.id}`, phase.project || "", phase.id, phase.title)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-indigo-600 border border-indigo-200 dark:border-indigo-800 shadow-sm"
                  >
                    {completedTaskIds.includes(`project-${phase.id}`) ? "✓ Project Completed" : "Mark Project Completed"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Phase Celebration Modal */}
      {celebrationModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
            <Trophy size={48} className="mx-auto text-amber-500 mb-3" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Phase Completed!</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Superb work! You completed all topics and deliverables for <strong>{celebrationModal.title}</strong>. Your Job Readiness Score has increased.
            </p>
            <button
              onClick={() => setCelebrationModal({ open: false, title: "" })}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-slate-500">Loading learning roadmap...</p>
        </div>
      }
    >
      <RoadmapContent />
    </Suspense>
  );
}
