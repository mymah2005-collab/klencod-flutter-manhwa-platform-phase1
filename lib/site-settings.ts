import "server-only";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

export type SiteSettings = { site_name: string; logo_url: string | null };

const FALLBACK: SiteSettings = { site_name: "منصة المانهوا", logo_url: null };

async function fetchSiteSettings(): Promise<SiteSettings> {
  // Public data only, so this client has no cookies and no service key.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("site_settings")
    .select("site_name, logo_url")
    .eq("id", 1)
    .maybeSingle();

  if (error) console.error("site_settings_fetch_failed", error.message);
  if (error || !data) return FALLBACK;

  return { site_name: data.site_name, logo_url: data.logo_url };
}

// Cached for an hour. Saving settings calls revalidateTag("site-settings").
export const getSiteSettings = unstable_cache(fetchSiteSettings, ["site-settings"], {
  tags: ["site-settings"],
  revalidate: 3600,
});
