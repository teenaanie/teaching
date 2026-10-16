"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useHydrated } from "@/lib/use-hydrated";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState(params.get("error") === "not-a-teacher" ? "This account isn't set up as a teacher." : "");
  const [pending, setPending] = useState(false);
  const hydrated = useHydrated();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    const { error } = await createClient().auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setPending(false);
    if (error) return setError(error.message);
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form method="post" onSubmit={onSubmit} className="grid w-full max-w-sm gap-4 rounded-2xl border border-line bg-card p-6">
      <h1 className="font-display text-2xl font-semibold">Teacher sign in</h1>
      <label className="grid gap-1 text-sm font-bold">
        Email
        <input name="email" type="email" required autoComplete="email" className="rounded-lg border border-line bg-paper px-3 py-2 font-normal" />
      </label>
      <label className="grid gap-1 text-sm font-bold">
        Password
        <input name="password" type="password" required autoComplete="current-password" className="rounded-lg border border-line bg-paper px-3 py-2 font-normal" />
      </label>
      {error && <p className="text-sm font-bold text-warn">{error}</p>}
      <button disabled={pending || !hydrated} className="rounded-full bg-teal px-5 py-2 font-bold text-white disabled:opacity-60 dark:text-[#0d1a1d]">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
