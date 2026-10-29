import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "لوحة الإدارة" };

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [pendingTeams, pendingWorks, pendingChapters] = await Promise.all([
    supabase.from("teams").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase
      .from("manhwa")
      .select("id", { count: "exact", head: true })
      .eq("content_status", "pending_review")
      .is("deleted_at", null),
    supabase
      .from("chapters")
      .select("id", { count: "exact", head: true })
      .eq("content_status", "pending_review"),
  ]);

  const stats = [
    { label: "طلبات الفرق المعلقة", value: pendingTeams.count ?? 0 },
    { label: "أعمال بانتظار المراجعة", value: pendingWorks.count ?? 0 },
    { label: "فصول بانتظار المراجعة", value: pendingChapters.count ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">لوحة الإدارة</h1>
        <p className="mt-2 text-muted">ما يحتاج متابعتك الآن.</p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <li key={stat.label} className="border-2 border-ink bg-bubble p-5">
            <p className="text-sm font-bold text-muted">{stat.label}</p>
            <p className="font-display mt-3 text-5xl font-bold tabular-nums">{stat.value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
