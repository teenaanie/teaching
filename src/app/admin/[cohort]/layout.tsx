import Link from "next/link";
import { getAdminCohort } from "@/lib/admin-data";
import { AdminNav } from "./AdminNav";

export default async function CohortAdminLayout({ children, params }: LayoutProps<"/admin/[cohort]">) {
  const { cohort: slug } = await params;
  const { cohort } = await getAdminCohort(slug);
  return (
    <div>
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link href="/admin" className="text-sm text-muted hover:underline">
            ← Classes
          </Link>
          <span className="font-display text-lg font-semibold">{cohort.title}</span>
          <AdminNav slug={slug} />
          <Link href={`/${slug}`} target="_blank" className="ml-auto text-sm text-teal hover:underline">
            Student view ↗
          </Link>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
