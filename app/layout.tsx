import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Reem_Kufi, Tajawal } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { getSiteSettings } from "@/lib/site-settings";

const bodyFont = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Reem_Kufi({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// The site name and logo come from the database, so admins can change them without a deploy.
export async function generateMetadata(): Promise<Metadata> {
  const { site_name, logo_url } = await getSiteSettings();

  return {
    title: { default: site_name, template: `%s · ${site_name}` },
    description: "اقرأ المانهوا المترجمة من فرق تحبها.",
    icons: logo_url ? { icon: logo_url } : undefined,
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="min-h-dvh font-sans">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
