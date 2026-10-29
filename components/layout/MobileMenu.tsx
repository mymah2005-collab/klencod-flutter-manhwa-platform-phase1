"use client";

import Link from "next/link";
import { useState } from "react";
import { primaryButtonClass, secondaryButtonClass } from "@/components/ui/styles";

export type NavItem = { href: string; label: string };

export function MobileMenu({ items, signedIn }: { items: NavItem[]; signedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
        className="grid size-11 place-items-center border-2 border-ink bg-bubble"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="القائمة"
          className="absolute inset-x-0 top-16 border-b-2 border-ink bg-page px-4 pb-6 pt-4"
        >
          {items.length > 0 && (
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.href} className="border-b border-tone">
                  <Link href={item.href} onClick={close} className="block py-4 text-lg font-bold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6">
            {signedIn ? (
              <form action="/auth/signout" method="post">
                <button type="submit" className={`${secondaryButtonClass} w-full`}>
                  تسجيل الخروج
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/login" onClick={close} className={secondaryButtonClass}>
                  تسجيل الدخول
                </Link>
                <Link href="/signup" onClick={close} className={primaryButtonClass}>
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="square"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="square"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
