import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  panelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/ui/styles";

type Work = {
  id: string;
  slug: string;
  title: string;
  cover_url: string | null;
  status: string;
};

const STATUS_LABEL: Record<string, string> = {
  ongoing: "مستمر",
  completed: "مكتمل",
  hiatus: "متوقف مؤقتاً",
};

export default async function HomePage() {
  const supabase = await createClient();

  // RLS already limits this to published, non-deleted works.
  const { data, error } = await supabase
    .from("manhwa")
    .select("id, slug, title, cover_url, status")
    .eq("content_status", "published")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) console.error("home_works_query_failed", error.message);
  const works = (data ?? []) as Work[];

  return (
    <div className="space-y-14 sm:space-y-20">
      <section className="halftone border-2 border-ink p-6 sm:p-10 lg:p-16">
        <h1 className="font-display max-w-3xl text-4xl font-bold leading-[1.2] sm:text-6xl">
          المانهوا المترجمة، من فرق تحبها
        </h1>
        <p className="mt-6 max-w-xl text-base leading-loose text-muted sm:text-lg">
          تصفّح الأعمال المنشورة، واقرأ على هاتفك بسهولة، وتابع فرقك المفضلة من مكان واحد.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#latest" className={primaryButtonClass}>
            تصفّح الأعمال
          </a>
          <Link href="/signup" className={secondaryButtonClass}>
            إنشاء حساب
          </Link>
        </div>
      </section>

      <section id="latest" aria-labelledby="latest-title">
        <h2 id="latest-title" className="font-display mb-6 text-2xl font-bold sm:text-3xl">
          أحدث الإصدارات
        </h2>

        {error ? (
          <p role="alert" className="border-2 border-red-700 bg-red-50 p-5 font-bold text-red-800">
            تعذّر تحميل الأعمال الآن. حاول بعد قليل.
          </p>
        ) : works.length === 0 ? (
          <div className={`${panelClass} p-6 sm:p-10`}>
            <p className="font-display text-2xl font-bold">لا توجد أعمال منشورة بعد</p>
            <p className="mt-2 text-muted">تظهر الأعمال هنا بعد أن يعتمدها فريق الإدارة.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-6">
            {works.map((work) => (
              <li key={work.id}>
                <WorkCard work={work} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function WorkCard({ work }: { work: Work }) {
  return (
    <Link href={`/manhwa/${work.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden border-2 border-ink bg-bubble">
        {work.cover_url ? (
          <Image
            src={work.cover_url}
            alt={work.title}
            fill
            sizes="(min-width:1280px) 16vw, (min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
            className="object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="font-display grid h-full place-items-center text-6xl font-bold text-tone"
          >
            {work.title.charAt(0)}
          </span>
        )}
        <span className="absolute start-2 top-2 rounded-full border-2 border-ink bg-bubble px-2.5 py-0.5 text-xs font-bold">
          {STATUS_LABEL[work.status] ?? work.status}
        </span>
      </div>
      <h3 className="mt-3 line-clamp-2 text-base font-bold leading-snug underline-offset-4 group-hover:underline">
        {work.title}
      </h3>
    </Link>
  );
}
