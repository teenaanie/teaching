import Link from "next/link";
import { ActionForm } from "@/components/ActionForm";
import { requireTeacher } from "@/lib/auth";
import { addTeacher, removeTeacher } from "../actions";

export const instant = false;

const field = "rounded-lg border border-line bg-paper px-3 py-2 font-normal";

export default async function TeachersPage() {
  const { db, teacher } = await requireTeacher();
  const [{ data: teachers }, { data: users }] = await Promise.all([
    db.from("teachers").select("user_id, name, created_at").order("created_at"),
    db.auth.admin.listUsers({ perPage: 1000 }),
  ]);
  const emails = new Map((users?.users ?? []).map((u) => [u.id, u.email]));

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link href="/admin" className="text-sm text-muted hover:underline">
        ← Classes
      </Link>
      <h1 className="mt-2 font-display text-3xl font-semibold">Teachers</h1>
      <p className="mt-1 text-sm text-muted">Teachers can see and edit every class: attendance, students, grades and settings.</p>

      <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-card">
        {(teachers ?? []).map((t) => (
          <li key={t.user_id} className="flex items-center justify-between gap-3 px-5 py-3">
            <span>
              <span className="block font-bold">
                {t.name ?? "Teacher"}
                {t.user_id === teacher.user_id && <span className="font-normal text-muted"> (you)</span>}
              </span>
              <span className="text-sm text-muted">{emails.get(t.user_id)}</span>
            </span>
            {t.user_id !== teacher.user_id && (
              <form action={removeTeacher.bind(null, t.user_id)}>
                <button className="text-sm text-warn hover:underline">Remove access</button>
              </form>
            )}
          </li>
        ))}
      </ul>

      <section className="mt-8 rounded-2xl border border-line bg-card p-5">
        <h2 className="font-display text-xl font-semibold">Add a teacher</h2>
        <p className="mt-1 text-sm text-muted">
          Set a temporary password and share it with them privately. If they already have a login here, leave the password
          empty and they&apos;ll just get teacher access.
        </p>
        <ActionForm action={addTeacher} submit="Add teacher" clearOnSuccess className="mt-4 grid gap-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1 text-sm font-bold">
              Name
              <input name="name" required className={field} />
            </label>
            <label className="grid gap-1 text-sm font-bold">
              Email
              <input name="email" type="email" required autoComplete="off" className={field} />
            </label>
            <label className="grid gap-1 text-sm font-bold">
              Temporary password
              <input name="password" type="text" minLength={8} autoComplete="new-password" className={`${field} font-mono`} />
            </label>
          </div>
        </ActionForm>
      </section>
    </main>
  );
}
