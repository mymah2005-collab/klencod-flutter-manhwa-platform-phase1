import type { Metadata } from "next";
import Link from "next/link";
import { panelClass } from "@/components/ui/styles";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "تسجيل الدخول" };

type Props = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { next, error } = await searchParams;

  return (
    <div className={`${panelClass} mx-auto max-w-md p-6 sm:p-8`}>
      <h1 className="font-display text-3xl font-bold">تسجيل الدخول</h1>
      <p className="mt-2 text-muted">أدخل بياناتك وتابع من حيث توقفت.</p>

      <div className="mt-6">
        <LoginForm next={next ?? "/"} authError={error === "auth"} />
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        ليس لديك حساب؟{" "}
        <Link href="/signup" className="font-bold text-ink underline decoration-2 underline-offset-4">
          أنشئ حساباً
        </Link>
      </p>
    </div>
  );
}
