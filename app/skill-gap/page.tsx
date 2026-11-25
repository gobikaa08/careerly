"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Trash2, CheckCircle2, AlertTriangle, ArrowRight, Target, RefreshCw, Sparkles, Map } from "lucide-react";
import { CAREER_DATABASE, findCareerDefinition } from "@/lib/careers-data";
import { setGlobalTargetRole, syncLocalTargetRole, TARGET_ROLE_EVENT, getStoredTargetRole } from "@/lib/target-role";
import { UserSkillRecord, CareerDefinition } from "@/types";

function SkillGapContent() {
  const searchParams = useSearchParams();
  const careerParam = searchParams?.get("career");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loading, setLoading] = useState(true);
  const [targetCareer, setTargetCareer] = useState<CareerDefinition>(() => {
    if (careerParam) {
      const found = findCareerDefinition(careerParam);
      if (found) return found;
    }
    const stored = getStoredTargetRole();
    if (stored) {
      const found = findCareerDefinition(stored.id) || findCareerDefinition(stored.title);
      if (found) return found;
    }
    return CAREER_DATABASE[0];
  });

  const [userSkills, setUserSkills] = useState<UserSkillRecord[]>([]);
  const [newSkillName, setNewSkillName] = useState("");
  const [savingSkill, setSavingSkill] = useState(false);
  const [settingTarget, setSettingTarget] = useState(false);
  const [isTarget, setIsTarget] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, skillsRes] = await Promise.all([
          fetch("/api/dashboard", { cache: "no-store" }),
          fetch("/api/skills", { cache: "no-store" }),
        ]);

        if (dashRes.ok) {
          const dash = await dashRes.json();
          if (dash.targetCareer?.title) {
            syncLocalTargetRole(dash.targetCareer.title);
            const serverDef = findCareerDefinition(dash.targetCareer.title);
            const paramDef = careerParam ? findCareerDefinition(careerParam) : undefined;
            const activeDef = paramDef || serverDef || targetCareer;

            if (!careerParam && serverDef) {
              setTargetCareer(serverDef);
            }
            setIsTarget(Boolean(serverDef && activeDef.id === serverDef.id));
          }
        }

        if (skillsRes.ok) {
          const skillsData = await skillsRes.json();
          setUserSkills(skillsData.skills || []);
        }
      } catch (err) {
        console.error("Failed to load skill gap data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const onTargetUpdated = (e: any) => {
      const newTitle = e.detail?.title;
      if (newTitle) {
        const found = findCareerDefinition(newTitle);
        if (found) {
          setTargetCareer(found);
          setIsTarget(true);
        }
      }
    };
    window.addEventListener(TARGET_ROLE_EVENT, onTargetUpdated);
    return () => window.removeEventListener(TARGET_ROLE_EVENT, onTargetUpdated);
  }, [careerParam]);

  // Handle career track selection
  const handleCareerChange = (careerId: string) => {
    const found = CAREER_DATABASE.find((c) => c.id === careerId);
    if (found) {
      setTargetCareer(found);
      checkIsTarget(found.title);
    }
  };

  const checkIsTarget = async (title: string) => {
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const data = await res.json();
        setIsTarget(data.targetCareer?.title?.toLowerCase() === title.toLowerCase());
      }
    } catch {
      // Ignore
    }
  };

  const handleSetTargetCareer = async () => {
    setSettingTarget(true);
    try {
      await setGlobalTargetRole(targetCareer.title);
      setIsTarget(true);
    } catch {
      alert("Failed to update target career.");
    } finally {
      setSettingTarget(false);
    }
  };

  // Draw Radar Chart on Canvas
  useEffect(() => {
    if (!canvasRef.current || !targetCareer) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 300;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, size, size);

    const skills = targetCareer.skills;
    const count = skills.length;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.36;
    const angleStep = (Math.PI * 2) / count;

    // Web circles
    for (let l = 1; l <= 4; l++) {
      const r = (radius / 4) * l;
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Benchmark polygon (purple dashed)
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const val = skills[i].benchmark / 100;
      const x = centerX + Math.cos(angle) * radius * val;
      const y = centerY + Math.sin(angle) * radius * val;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "#8B5CF6";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    // User polygon (indigo filled)
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const skillName = skills[i].name.toLowerCase();
      const userSkill = userSkills.find((us) =>
        us.skill_name.toLowerCase().includes(skillName) || skillName.includes(us.skill_name.toLowerCase())
      );
      const val = userSkill ? userSkill.proficiency_level / 100 : 0.15;
      const x = centerX + Math.cos(angle) * radius * val;
      const y = centerY + Math.sin(angle) * radius * val;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(79, 70, 229, 0.25)";
    ctx.fill();
    ctx.strokeStyle = "#4F46E5";
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }, [targetCareer, userSkills]);

  const handleUpdateLevel = async (skillName: string, newLevel: number) => {
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skill_name: skillName,
          proficiency_level: newLevel,
          verified_by_user: true,
        }),
      });

      if (res.ok) {
        const { skill } = await res.json();
        setUserSkills((prev) => {
          const filtered = prev.filter((s) => s.skill_name.toLowerCase() !== skillName.toLowerCase());
          return [...filtered, skill];
        });
      }
    } catch {
      alert("Failed to update skill proficiency.");
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setSavingSkill(true);
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skill_name: newSkillName.trim(),
          proficiency_level: 60,
          verified_by_user: true,
        }),
      });

      if (res.ok) {
        const { skill } = await res.json();
        setUserSkills((prev) => [...prev, skill]);
        setNewSkillName("");
      }
    } catch {
      alert("Failed to add skill.");
    } finally {
      setSavingSkill(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
      setUserSkills((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Failed to remove skill.");
    }
  };

  // Calculations
  const userSkillNames = userSkills.map((s) => s.skill_name.toLowerCase());
  const matchingSkills = targetCareer.skills.filter((req) =>
    userSkillNames.some((us) => us.includes(req.name.toLowerCase()) || req.name.toLowerCase().includes(us))
  );
  const missingSkills = targetCareer.skills.filter(
    (req) => !userSkillNames.some((us) => us.includes(req.name.toLowerCase()) || req.name.toLowerCase().includes(us))
  );

  const coveragePct = Math.min(100, Math.round((matchingSkills.length / targetCareer.skills.length) * 100));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-slate-500">Loading skill gap matrix...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-slate-200 dark:border-slate-800 gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 mb-2">
            Target Competency Benchmarks
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Skill Gap Analysis
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Analyzing your verified skills against: <strong>{targetCareer.title}</strong>
          </p>
        </div>

        {/* Change Target Dropdown & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={targetCareer.id}
            onChange={(e) => handleCareerChange(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white shadow-sm"
          >
            {CAREER_DATABASE.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleSetTargetCareer}
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
            href={`/roadmap?career=${targetCareer.id}`}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5"
          >
            <Map size={14} /> Roadmap
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-extrabold text-2xl shrink-0">
            {coveragePct}%
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Skill Coverage</span>
            <strong className="text-lg text-slate-900 dark:text-white">{matchingSkills.length} of {targetCareer.skills.length} Met</strong>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-extrabold text-2xl shrink-0">
            {userSkills.length}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Verified User Skills</span>
            <strong className="text-lg text-slate-900 dark:text-white">Active Profile Inventory</strong>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-extrabold text-2xl shrink-0">
            {missingSkills.length}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Missing Core Skills</span>
            <strong className="text-lg text-slate-900 dark:text-white">Priority Focus Gaps</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Skills Matrix + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Target Career Requirements & Rating */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Required Benchmark Skills
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Compare your current capability against hiring benchmarks. Adjust your proficiency level to reflect your hands-on mastery.
            </p>

            <div className="space-y-4">
              {targetCareer.skills.map((req) => {
                const userSkill = userSkills.find((us) =>
                  us.skill_name.toLowerCase().includes(req.name.toLowerCase()) ||
                  req.name.toLowerCase().includes(us.skill_name.toLowerCase())
                );
                const currentLevel = userSkill ? userSkill.proficiency_level : 0;
                const isMet = currentLevel >= req.benchmark;

                return (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 dark:text-white font-semibold">{req.name}</strong>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {req.category}
                        </span>
                      </div>
                      <span className={`font-bold ${isMet ? "text-emerald-600" : "text-amber-600"}`}>
                        Target: {req.benchmark}% • You: {currentLevel}%
                      </span>
                    </div>

                    {/* Dual Progress Bar */}
                    <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 bottom-0 bg-indigo-600 transition-all duration-300"
                        style={{ width: `${currentLevel}%` }}
                      ></div>
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-violet-600"
                        style={{ left: `${req.benchmark}%` }}
                        title={`Target: ${req.benchmark}%`}
                      ></div>
                    </div>

                    {/* Level Selector Buttons */}
                    <div className="flex gap-1.5 pt-1">
                      {[
                        { label: "None", val: 0 },
                        { label: "Beginner", val: 25 },
                        { label: "Intermed.", val: 50 },
                        { label: "Advanced", val: 75 },
                        { label: "Expert", val: 100 },
                      ].map((lvl) => (
                        <button
                          key={lvl.val}
                          onClick={() => handleUpdateLevel(req.name, lvl.val)}
                          className={`flex-1 py-1 text-[10px] font-semibold rounded ${
                            currentLevel === lvl.val
                              ? "bg-indigo-600 text-white"
                              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {lvl.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Radar Chart & Custom Skills Inventory */}
        <div className="lg:col-span-5 space-y-6">
          {/* Radar Chart */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Competency Radar Visualization
            </h3>
            <div className="text-[10px] text-slate-500 mb-4 flex justify-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span> Your Level
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-600 inline-block border border-dashed border-violet-600"></span> Benchmark
              </span>
            </div>
            <div className="flex justify-center">
              <canvas ref={canvasRef} style={{ width: "300px", height: "300px" }}></canvas>
            </div>
          </div>

          {/* Add / Manage Personal Skills */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Add Verified Skill to Profile
            </h3>
            <form onSubmit={handleAddSkill} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="e.g. GraphQL, Prisma, AWS"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
              />
              <button
                type="submit"
                disabled={savingSkill}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shrink-0"
              >
                <Plus size={16} />
              </button>
            </form>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {userSkills.map((s) => (
                <div
                  key={s.id}
                  className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200">{s.skill_name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-semibold">{s.proficiency_level}%</span>
                    <button
                      onClick={() => handleDeleteSkill(s.id)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SkillGapPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-slate-500">Loading skill gap matrix...</p>
        </div>
      }
    >
      <SkillGapContent />
    </Suspense>
  );
}
