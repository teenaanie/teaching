import Link from "next/link";
import { getPublicCohorts } from "@/lib/data";

// Pages here depend on the current time and live data, so they render per request.
export const instant = false;


export default async function Home() {
  const cohorts = await getPublicCohorts();
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-semibold">Classes</h1>
      <p className="mt-2 text-muted">Pick your class to see the schedule, lessons and quizzes.</p>
      <ul className="mt-8 grid gap-3">
        {cohorts.map((c) => (
          <li key={c.id}>
            <Link href={`/${c.slug}`} className="block rounded-xl border border-line bg-card p-5 hover:border-teal">
              <span className="block font-display text-xl font-semibold">{c.title}</span>
              <span className="text-sm text-muted">
                {c.course.title}
                {c.institution ? ` · ${c.institution}` : ""}
              </span>
            </Link>
          </li>
        ))}
        {cohorts.length === 0 && <li className="text-muted">No classes yet.</li>}
      </ul>
    </main>
  );
}
