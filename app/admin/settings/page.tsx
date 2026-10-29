import type { Metadata } from "next";
import { requireAdminOrOwner } from "@/lib/auth/guards";
import { getSiteSettings } from "@/lib/site-settings";
import { SettingsForm } from "./SettingsForm";

export const metadata: Metadata = { title: "إعدادات الموقع" };

export default async function SiteSettingsPage() {
  // The layout only hides the link. This check is the real guard.
  await requireAdminOrOwner();
  const settings = await getSiteSettings();

  return (
    <div className="max-w-xl space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">إعدادات الموقع</h1>
        <p className="mt-2 text-muted">غيّر اسم الموقع وشعاره مباشرة، دون تعديل الكود.</p>
      </header>

      <SettingsForm initialName={settings.site_name} currentLogo={settings.logo_url} />
    </div>
  );
}
