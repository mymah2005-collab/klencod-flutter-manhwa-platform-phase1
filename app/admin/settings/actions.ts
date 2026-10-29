"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { logAudit } from "@/lib/audit";
import { requireAdminOrOwner } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

export type SettingsState = { ok: boolean; message: string } | null;

const LOGO_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};
const MAX_LOGO_BYTES = 2 * 1024 * 1024;

export async function updateSiteSettings(
  _previous: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  // Authorize on the server first. Never trust the form or the client.
  const session = await requireAdminOrOwner();
  const supabase = await createClient();

  const siteName = String(formData.get("site_name") ?? "").trim();
  if (siteName.length < 2 || siteName.length > 40) {
    return { ok: false, message: "اسم الموقع يجب أن يكون بين 2 و40 حرفاً." };
  }

  const updates: Record<string, string> = {
    site_name: siteName,
    updated_by: session.user.id,
    updated_at: new Date().toISOString(),
  };

  const logo = formData.get("logo");
  if (logo instanceof File && logo.size > 0) {
    const extension = LOGO_EXTENSIONS[logo.type];
    if (!extension) {
      return { ok: false, message: "صيغة الشعار يجب أن تكون PNG أو JPG أو WEBP." };
    }
    if (logo.size > MAX_LOGO_BYTES) {
      return { ok: false, message: "حجم الشعار يتجاوز 2 ميغابايت." };
    }

    const bucket = supabase.storage.from("site-assets");
    const path = `logos/${Date.now()}.${extension}`;
    const { error: uploadError } = await bucket.upload(path, logo, {
      contentType: logo.type,
      cacheControl: "3600",
    });
    if (uploadError) {
      return { ok: false, message: "تعذّر رفع الشعار. حاول مرة أخرى." };
    }

    updates.logo_url = bucket.getPublicUrl(path).data.publicUrl;
  }

  const { error } = await supabase.from("site_settings").update(updates).eq("id", 1);
  if (error) {
    return { ok: false, message: "تعذّر حفظ الإعدادات. حاول مرة أخرى." };
  }

  await logAudit({
    actorId: session.user.id,
    action: "site.settings_update",
    targetType: "site_settings",
    targetId: "1",
    metadata: { site_name: siteName, logo_changed: "logo_url" in updates },
  });

  revalidateTag("site-settings");
  revalidatePath("/", "layout");

  return { ok: true, message: "تم حفظ الإعدادات بنجاح." };
}
