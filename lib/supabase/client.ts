import { createBrowserClient } from "@supabase/ssr";

const PLACEHOLDER_URL = "https://placeholder-url.supabase.co";

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes("placeholder-url") && !key.includes("placeholder"));
}

export function formatAuthErrorMessage(err: any, fallback: string): string {
  const msg = err?.message || "";
  if (!isSupabaseConfigured()) {
    return "Authentication service is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your deployment environment variables and redeploy.";
  }
  if (msg.toLowerCase().includes("failed to fetch")) {
    return "Unable to reach the authentication server (network error). Verify NEXT_PUBLIC_SUPABASE_URL is correct, your Supabase project is active, and ad-blockers are not blocking Supabase.";
  }
  return msg || fallback;
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createBrowserClient(supabaseUrl, supabaseKey);
}
