import type { Metadata } from "next";
import Link from "next/link";
import { panelClass } from "@/components/ui/styles";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = { title: "إنشاء حساب" };

export default function SignupPage() {
  return (
    <div className={`${panelClass} mx-auto max-w-md p-6 sm:p-8`}>
      <h1 className="font-display text-3xl font-bold">إنشاء حساب</h1>
      <p className="mt-2 text-muted">أنشئ حسابك لتحفظ تقدمك ونقاطك.</p>

      <div className="mt-6">
        <SignupForm />
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        لديك حساب بالفعل؟{" "}
        <Link href="/login" className="font-bold text-ink underline decoration-2 underline-offset-4">
          سجّل الدخول
        </Link>
      </p>
    </div>
  );
}
