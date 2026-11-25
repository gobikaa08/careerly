"use client";

import { CAREER_DATABASE, findCareerDefinition } from "./careers-data";

export const TARGET_ROLE_EVENT = "careerly_target_role_updated";

export interface StoredTargetRole {
  title: string;
  id: string;
}

/**
 * Reads the current target role from localStorage, matching either by ID or title.
 */
export function getStoredTargetRole(): StoredTargetRole | null {
  if (typeof window === "undefined") return null;
  const stored =
    localStorage.getItem("careerly_target_career_title") ||
    localStorage.getItem("careerly_target_career") ||
    localStorage.getItem("careerly_target_career_id");

  if (!stored) return null;

  const career = findCareerDefinition(stored);
  if (career) {
    return { title: career.title, id: career.id };
  }

  return { title: stored, id: stored };
}

/**
 * Updates localStorage target role cache without sending an API request.
 * Useful when hydrating authoritative state from the server.
 */
export function syncLocalTargetRole(careerTitleOrId: string): StoredTargetRole | null {
  if (!careerTitleOrId || typeof window === "undefined") return null;

  const career = findCareerDefinition(careerTitleOrId);
  const title = career ? career.title : careerTitleOrId;
  const id = career ? career.id : careerTitleOrId;

  try {
    localStorage.setItem("careerly_target_career", id);
    localStorage.setItem("careerly_target_career_id", id);
    localStorage.setItem("careerly_target_career_title", title);
  } catch {
    // Ignore localStorage errors
  }

  return { title, id };
}

/**
 * Sets the global target role across the entire application:
 * 1. Synchronizes localStorage (careerly_target_career, id, and title)
 * 2. Broadcasts a custom window event for real-time live synchronization
 * 3. Persists to Supabase backend via /api/careers/recommendations
 */
export async function setGlobalTargetRole(careerTitleOrId: string): Promise<boolean> {
  if (!careerTitleOrId) return false;

  const career = findCareerDefinition(careerTitleOrId);
  const title = career ? career.title : careerTitleOrId;
  const id = career ? career.id : careerTitleOrId;

  // 1. Immediately sync in localStorage for all sections and static fallbacks
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("careerly_target_career", id);
      localStorage.setItem("careerly_target_career_id", id);
      localStorage.setItem("careerly_target_career_title", title);

      window.dispatchEvent(
        new CustomEvent(TARGET_ROLE_EVENT, { detail: { title, id } })
      );
    } catch {
      // Ignore localStorage errors
    }
  }

  // 2. Persist to server backend
  try {
    const res = await fetch("/api/careers/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ career_title: title }),
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to persist target role to backend:", err);
    return false;
  }
}
