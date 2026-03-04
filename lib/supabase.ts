import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser / SSR client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-only admin client (uses service role key — never expose to browser)
// Overrides fetch with cache:'no-store' so Next.js data cache never stales the result
export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
    global: {
      fetch: (url: RequestInfo | URL, options: RequestInit = {}) =>
        fetch(url, { ...options, cache: "no-store" }),
    },
  });
}

export interface WW3Prediction {
  id: number;
  score: number;
  reasoning: string;
  key_factors: string[];
  news_sample: string[];
  created_at: string;
}
