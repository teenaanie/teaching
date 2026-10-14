import Link from "next/link";
import { notFound } from "next/navigation";
import { getCohortView } from "@/lib/data";

// Pages here depend on the current time and live data, so they render per request.
export const instant = false;


export default async function CohortLayout({ children, params }: LayoutProps<"/[cohort]">) {
  const { cohort: slug } = await params;
  const view = await getCohortView(slug);
  if (!view) notFound();
  const { cohort } = view;
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href={`/${cohort.slug}`} className="min-w-0">
            <span className="block truncate font-display text-lg font-semibold">{view.course.title}</span>
            <span className="block truncate text-xs text-muted">{cohort.title}</span>
          </Link>
          {cohort.classroom_url && (
            <a
              href={cohort.classroom_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-teal px-4 py-1.5 text-sm font-bold text-white dark:text-[#0d1a1d]"
            >
              Google Classroom ↗
            </a>
          )}
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="mx-auto w-full max-w-5xl px-4 py-8 text-xs text-muted">
        {cohort.institution} · Questions? Ask in class or on Google Classroom.
      </footer>
    </div>
  );
}
