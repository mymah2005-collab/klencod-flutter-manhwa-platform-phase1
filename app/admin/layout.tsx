import Link from "next/link";
import type { ReactNode } from "react";
import { requireStaffOrAdmin } from "@/lib/auth/guards";

type AdminLink = { href: string; label: string; adminOnly: boolean };

// Only links for pages that exist. Add each section here as it gets built.
const ADMIN_LINKS: AdminLink[] = [
  { href: "/admin", label: "نظرة عامة", adminOnly: false },
  { href: "/admin/settings", label: "إعدادات الموقع", adminOnly: true },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireStaffOrAdmin();

  const links = ADMIN_LINKS.filter((link) => !link.adminOnly || session.isAdmin);
  const roleLabel = session.isOwner ? "مالك المنصة" : session.isAdmin ? "مشرف" : "موظف";

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:gap-10">
      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <p className="text-sm font-bold text-muted">{roleLabel}</p>
        <nav
          aria-label="قائمة الإدارة"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full border-2 border-ink bg-bubble px-4 py-2 text-sm font-bold transition hover:bg-sfx"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="min-w-0">{children}</section>
    </div>
  );
}
