"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { isValidUsername } from "@/lib/validation";
import { fieldClass, primaryButtonClass } from "@/components/ui/styles";

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const username = String(form.get("username") ?? "").trim();
    const displayName = String(form.get("display_name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!isValidUsername(username)) {
      setError("اسم المستخدم من 3 إلى 24 حرفاً، بالإنجليزية والأرقام و_ فقط.");
      return;
    }
    if (password.length < 8) {
      setError("كلمة المرور يجب ألا تقل عن 8 أحرف.");
      return;
    }

    setLoading(true);
    setError(null);
    const supabase = createClient();

    // Friendly pre-check only. The unique constraint on profiles is the real guard.
    const { data: taken } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (taken) {
      setLoading(false);
      setError("اسم المستخدم مأخوذ بالفعل. جرّب اسماً آخر.");
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: displayName || null },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/`,
      },
    });

    setLoading(false);

    if (signUpError) {
      const alreadyRegistered = signUpError.message.toLowerCase().includes("already");
      setError(
        alreadyRegistered
          ? "هذا البريد الإلكتروني مسجّل بالفعل."
          : "تعذّر إنشاء الحساب. حاول مرة أخرى."
      );
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div role="status" className="border-2 border-ink bg-sfx p-5 font-bold leading-relaxed">
        أرسلنا رابط التأكيد إلى بريدك الإلكتروني. افتح الرسالة لتفعيل حسابك، ثم سجّل الدخول.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="username" className="mb-2 block font-bold">
          اسم المستخدم
        </label>
        <input
          id="username"
          name="username"
          dir="ltr"
          autoComplete="username"
          required
          minLength={3}
          maxLength={24}
          pattern="[A-Za-z0-9_]{3,24}"
          title="بالإنجليزية والأرقام و_ فقط"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="display_name" className="mb-2 block font-bold">
          الاسم المعروض <span className="font-normal text-muted">(اختياري)</span>
        </label>
        <input id="display_name" name="display_name" maxLength={40} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block font-bold">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          name="email"
          type="email"
          dir="ltr"
          autoComplete="email"
          required
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block font-bold">
          كلمة المرور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          dir="ltr"
          autoComplete="new-password"
          required
          minLength={8}
          className={fieldClass}
        />
        <p className="mt-2 text-sm text-muted">8 أحرف على الأقل.</p>
      </div>

      {error && (
        <p role="alert" className="border-2 border-red-700 bg-red-50 p-3 text-sm font-bold text-red-800">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className={`${primaryButtonClass} w-full`}>
        {loading ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
      </button>
    </form>
  );
}
