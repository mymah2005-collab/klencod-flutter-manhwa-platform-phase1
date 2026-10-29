import { createBrowserClient } from "@supabase/ssr";

// Browser client. Uses only the public anon key, and RLS protects all data.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
