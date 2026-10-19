import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";

export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const supabaseUrl = rawUrl.replace(/\/+$/, "");
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const createBrowserClient = createClient;
