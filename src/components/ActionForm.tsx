"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "@/app/admin/actions";
import { useHydrated } from "@/lib/use-hydrated";

/**
 * Form wrapper that shows an action's success or error message. Submits manually so typed
 * values survive an error (React resets forms after `action` submissions).
 */
export function ActionForm({
  action,
  children,
  submit,
  className = "",
  clearOnSuccess = false,
}: {
  action: (prev: ActionResult | null, form: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  submit: string;
  className?: string;
  clearOnSuccess?: boolean;
}) {
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();
  const hydrated = useHydrated();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    start(async () => {
      const r = await action(null, data);
      setResult(r);
      if (r.ok && clearOnSuccess) form.reset();
    });
  }

  return (
    <form method="post" onSubmit={onSubmit} className={className}>
      {children}
      <div className="flex flex-wrap items-center gap-3">
        <button disabled={pending || !hydrated} className="rounded-full bg-teal px-5 py-2 text-sm font-bold text-white disabled:opacity-60 dark:text-[#0d1a1d]">
          {pending ? "Saving…" : submit}
        </button>
        {result && <span className={`text-sm ${result.ok ? "text-ok" : "font-bold text-warn"}`}>{result.message}</span>}
      </div>
    </form>
  );
}
