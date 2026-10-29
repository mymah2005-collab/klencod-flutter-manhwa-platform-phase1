"use client";

import Image from "next/image";
import { useActionState } from "react";
import { fieldClass, panelClass, primaryButtonClass } from "@/components/ui/styles";
import { updateSiteSettings, type SettingsState } from "./actions";

export function SettingsForm({
  initialName,
  currentLogo,
}: {
  initialName: string;
  currentLogo: string | null;
}) {
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(
    updateSiteSettings,
    null
  );

  return (
    <form action={formAction} className={`${panelClass} space-y-6 p-5 sm:p-7`}>
      <div>
        <label htmlFor="site_name" className="mb-2 block font-bold">
          اسم الموقع
        </label>
        <input
          id="site_name"
          name="site_name"
          defaultValue={initialName}
          required
          minLength={2}
          maxLength={40}
          className={fieldClass}
        />
      </div>

      <div className="space-y-3">
        <p className="font-bold">الشعار الحالي</p>
        <div className="flex items-center gap-4">
          {currentLogo ? (
            <Image
              src={currentLogo}
              alt="الشعار الحالي"
              width={64}
              height={64}
              className="size-16 border-2 border-ink object-cover"
            />
          ) : (
            <span className="grid size-16 place-items-center border-2 border-dashed border-ink text-xs text-muted">
              لا يوجد
            </span>
          )}
          <p className="text-sm text-muted">PNG أو JPG أو WEBP، بحد أقصى 2 ميغابايت.</p>
        </div>

        <div>
          <label htmlFor="logo" className="mb-2 block font-bold">
            تغيير الشعار
          </label>
          <input
            id="logo"
            name="logo"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="block w-full text-sm file:me-3 file:rounded-full file:border-2 file:border-ink file:bg-bubble file:px-4 file:py-2 file:font-bold"
          />
        </div>
      </div>

      {state && (
        <p
          role="status"
          className={`border-2 p-3 text-sm font-bold ${
            state.ok ? "border-ink bg-sfx" : "border-red-700 bg-red-50 text-red-800"
          }`}
        >
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className={primaryButtonClass}>
        {pending ? "جارٍ الحفظ..." : "حفظ التغييرات"}
      </button>
    </form>
  );
}
