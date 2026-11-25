"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, MapPin, Linkedin, Github, Clock, Calendar, Shield, Trash2, CheckCircle2 } from "lucide-react";
import { CAREER_DATABASE } from "@/lib/careers-data";
import { setGlobalTargetRole, syncLocalTargetRole, TARGET_ROLE_EVENT } from "@/lib/target-role";
import { UserProfile } from "@/types";

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();

    const onTargetUpdated = (e: any) => {
      const newTitle = e.detail?.title;
      if (newTitle) {
        setProfile((prev) => (prev ? { ...prev, target_career: newTitle } : prev));
      }
    };
    window.addEventListener(TARGET_ROLE_EVENT, onTargetUpdated);
    return () => window.removeEventListener(TARGET_ROLE_EVENT, onTargetUpdated);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/profile", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        if (data.profile?.target_career) {
          syncLocalTargetRole(data.profile.target_career);
        }
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setMessage(null);

    try {
      if (profile.target_career) {
        await setGlobalTargetRole(profile.target_career);
      }

      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setMessage("Profile and target role saved and synchronized successfully!");
      }
    } catch {
      setMessage("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("⚠️ PERMANENT ACTION: Are you sure you want to delete your Careerly account? This will permanently delete your uploaded resume files, AI analyses, roadmap progress, and verified skills.")) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch("/api/user/delete-account", { method: "DELETE" });
      if (res.ok) {
        alert("Account and all associated records deleted permanently.");
        router.push("/");
        router.refresh();
      }
    } catch {
      alert("Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-slate-500">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Account Settings &amp; Preferences
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal details, target career goal, weekly study pace, and privacy controls.
        </p>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} /> {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={profile?.full_name || ""}
                  onChange={(e) => setProfile({ ...profile!, full_name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={profile?.email || ""}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={profile?.phone || ""}
                  onChange={(e) => setProfile({ ...profile!, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={profile?.location || ""}
                  onChange={(e) => setProfile({ ...profile!, location: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                LinkedIn URL
              </label>
              <div className="relative">
                <Linkedin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={profile?.linkedin_url || ""}
                  onChange={(e) => setProfile({ ...profile!, linkedin_url: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                GitHub / Portfolio URL
              </label>
              <div className="relative">
                <Github size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={profile?.github_url || ""}
                  onChange={(e) => setProfile({ ...profile!, github_url: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Professional Headline / Bio
            </label>
            <textarea
              rows={2}
              value={profile?.bio || ""}
              onChange={(e) => setProfile({ ...profile!, bio: e.target.value })}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              placeholder="e.g. Aspiring Full-Stack Software Engineer with passion for accessible UI and scalable backend APIs."
            />
          </div>
        </div>

        {/* Study Preferences Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Career Goal &amp; Study Schedule
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Target Role
              </label>
              <select
                value={profile?.target_career || ""}
                onChange={(e) => setProfile({ ...profile!, target_career: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              >
                {CAREER_DATABASE.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Weekly Study Time
              </label>
              <select
                value={profile?.weekly_hours || 12}
                onChange={(e) => setProfile({ ...profile!, weekly_hours: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              >
                <option value={6}>Light (5 - 8 hrs / week)</option>
                <option value={12}>Standard (10 - 14 hrs / week)</option>
                <option value={20}>Accelerated (18 - 24 hrs / week)</option>
                <option value={35}>Full-Time Immersion (30+ hrs / week)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Learning Modality
              </label>
              <select
                value={profile?.learning_style || "hands-on"}
                onChange={(e) => setProfile({ ...profile!, learning_style: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              >
                <option value="hands-on">Hands-On Projects</option>
                <option value="documentation">Official Docs &amp; Deep Reads</option>
                <option value="video">Visual &amp; Video Courses</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Preferences"}
            </button>
          </div>
        </div>
      </form>

      {/* Danger Zone: Permanent Data & Account Deletion */}
      <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-base font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2">
            <Shield size={18} /> Privacy &amp; Permanent Deletion
          </h3>
          <p className="text-xs text-rose-700 dark:text-rose-400 mt-1 max-w-lg leading-relaxed">
            In compliance with our strict privacy policy, deleting your account immediately removes all uploaded resume files, storage objects, parsed data, and database records.
          </p>
        </div>

        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 flex items-center gap-1.5 shrink-0 disabled:opacity-50"
        >
          <Trash2 size={14} /> {deleting ? "Deleting Account..." : "Delete Account & Data"}
        </button>
      </div>
    </div>
  );
}
