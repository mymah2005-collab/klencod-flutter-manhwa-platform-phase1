import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth/guards";
import { getSiteSettings } from "@/lib/site-settings";
import { MobileMenu, type NavItem } from "@/components/layout/MobileMenu";
import { primaryButtonClass, secondaryButtonClass } from "@/components/ui/styles";

const textLinkClass =
  "rounded-full px-3 py-2 text-sm font-bold underline-offset-4 decoration-2 hover:underline";

export async function Navbar() {
  const [settings, session] = await Promise.all([getSiteSettings(), getSession()]);

  const staffLinks: NavItem[] = session.isStaffOrAdmin
    ? [{ href: "/admin", label: "لوحة الإدارة" }]
    : [];

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-page">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          {settings.logo_url ? (
            <Image
              src={settings.logo_url}
              alt=""
              width={36}
              height={36}
              className="size-9 shrink-0 border-2 border-ink object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="font-display grid size-9 shrink-0 place-items-center border-2 border-ink bg-sfx text-lg font-bold"
            >
              {settings.site_name.charAt(0)}
            </span>
          )}
          <span className="font-display truncate text-xl font-bold">{settings.site_name}</span>
        </Link>

        <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-2 md:flex">
          {session.user ? (
            <>
              {session.isStaffOrAdmin && (
                <Link href="/admin" className={textLinkClass}>
                  لوحة الإدارة
                </Link>
              )}
              <form action="/auth/signout" method="post">
                <button type="submit" className={secondaryButtonClass}>
                  تسجيل الخروج
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={textLinkClass}>
                تسجيل الدخول
              </Link>
              <Link href="/signup" className={primaryButtonClass}>
                إنشاء حساب
              </Link>
            </>
          )}
        </nav>

        <MobileMenu items={staffLinks} signedIn={!!session.user} />
      </div>
    </header>
  );
}
