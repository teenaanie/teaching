"use client";

import { useActionState } from "react";
import { studentSignIn } from "./actions";

export function SignInForm({ cohortId, slug }: { cohortId: string; slug: string }) {
  const [error, action, pending] = useActionState(studentSignIn.bind(null, cohortId, slug), null);
  return (
    <form action={action} className="grid gap-4 rounded-2xl border border-line bg-card p-6">
      <label className="grid gap-1 text-sm font-bold">
        Roll number
        <input name="rollNo" required autoComplete="username" className="rounded-lg border border-line bg-paper px-3 py-2 font-normal" />
      </label>
      <label className="grid gap-1 text-sm font-bold">
        Your code (from the slip your teacher gave you)
        <input
          name="code"
          required
          autoComplete="current-password"
          autoCapitalize="characters"
          className="rounded-lg border border-line bg-paper px-3 py-2 font-mono font-normal uppercase tracking-widest"
        />
      </label>
      {error && <p className="font-bold text-warn">{error}</p>}
      <button disabled={pending} className="justify-self-start rounded-full bg-teal px-6 py-2 font-bold text-white disabled:opacity-60 dark:text-[#0d1a1d]">
        {pending ? "Checking…" : "See my progress"}
      </button>
      <p className="text-xs text-muted">On a shared lab computer, press &ldquo;Sign out&rdquo; when you&apos;re done.</p>
    </form>
  );
}
