import Link from "next/link";
import { requireTeacher } from "@/lib/auth";
import { signOut } from "./actions";

export const instant = false;

export default async function AdminHome() {
  const { db, teacher } = await requireTeacher();
  const { data: cohorts } = await db.from("cohorts").select("id, slug, title, institution, start_date, course:courses(title)").order("start_date", { ascending: false });
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Hello{teacher.name ? `, ${teacher.name}` : ""}</h1>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/admin/teachers" className="text-teal hover:underline">
            Teachers
          </Link>
          <form action={signOut}>
            <button className="text-muted hover:underline">Sign out</button>
          </form>
        </div>
      </div>
      <h2 className="mt-8 text-xs font-bold uppercase tracking-widest text-muted">Your classes</h2>
      <ul className="mt-3 grid gap-3">
        {(cohorts ?? []).map((c) => (
          <li key={c.id}>
            <Link href={`/admin/${c.slug}`} className="block rounded-xl border border-line bg-card p-5 hover:border-teal">
              <span className="block font-display text-xl font-semibold">{c.title}</span>
              <span className="text-sm text-muted">
                {(c.course as unknown as { title: string }).title} · {c.institution}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-muted">
        New courses and classes are added from content files with <code>npm run seed</code>. See the README.
      </p>
    </main>
  );
}
