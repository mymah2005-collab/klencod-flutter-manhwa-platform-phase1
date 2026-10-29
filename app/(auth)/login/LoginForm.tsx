"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { safeNext } from "@/lib/validation";
import { fieldClass, primaryButtonClass } from "@/components/ui/styles";

const ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  "Email not confirmed": "يرجى تأكيد بريدك الإلكتروني أولاً، ثم حاول مجدداً.",
};

export function LoginForm({ next, authError }: { next: string; authError: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    authError ? "تعذّر تأكيد الحساب. حاول تسجيل الدخول مجدداً." : null
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    });

    if (signInError) {
      setError(ERROR_MESSAGES[signInError.message] ?? "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.");
      setLoading(false);
      return;
    }

    router.replace(safeNext(next));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          autoComplete="current-password"
          required
          className={fieldClass}
        />
      </div>

      {error && (
        <p role="alert" className="border-2 border-red-700 bg-red-50 p-3 text-sm font-bold text-red-800">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className={`${primaryButtonClass} w-full`}>
        {loading ? "جارٍ الدخول..." : "دخول"}
      </button>
    </form>
  );
}
