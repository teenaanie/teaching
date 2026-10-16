"use client";

import { useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/browser";
import {
  ALLOWED_EXTENSIONS,
  fileProblem,
  formatBytes,
  MAX_FILES,
  SUBMISSION_BUCKET,
  type SubmittedFile,
} from "@/lib/submissions";
import { requestUploads, saveSubmission } from "../../actions";

type Initial = { link: string; comment: string; files: SubmittedFile[]; submittedAt: string | null };

export function SubmitForm({ cohortId, slug, assessmentId, initial }: { cohortId: string; slug: string; assessmentId: string; initial: Initial }) {
  const [link, setLink] = useState(initial.link);
  const [comment, setComment] = useState(initial.comment);
  const [kept, setKept] = useState<SubmittedFile[]>(initial.files);
  const [picked, setPicked] = useState<File[]>([]);
  const [status, setStatus] = useState<{ kind: "idle" | "error" | "done"; text: string }>({ kind: "idle", text: "" });
  const [submittedAt, setSubmittedAt] = useState(initial.submittedAt);
  const [pending, start] = useTransition();
  const input = useRef<HTMLInputElement>(null);
  // Any edit makes the last "Submitted" message out of date.
  const changed = () => setStatus({ kind: "idle", text: "" });

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = [...picked, ...Array.from(list)];
    for (const f of next) {
      const problem = fileProblem(f);
      if (problem) return setStatus({ kind: "error", text: problem });
    }
    if (next.length + kept.length > MAX_FILES) return setStatus({ kind: "error", text: `You can attach up to ${MAX_FILES} files.` });
    setStatus({ kind: "idle", text: "" });
    setPicked(next);
    if (input.current) input.current.value = "";
  }

  function submit() {
    start(async () => {
      setStatus({ kind: "idle", text: picked.length ? "Uploading…" : "Saving…" });
      const uploaded: SubmittedFile[] = [];
      if (picked.length) {
        const res = await requestUploads(cohortId, assessmentId, picked.map((f) => ({ name: f.name, size: f.size })));
        if (!res.ok) return setStatus({ kind: "error", text: res.error });
        const storage = createClient().storage.from(SUBMISSION_BUCKET);
        for (const [i, file] of picked.entries()) {
          setStatus({ kind: "idle", text: `Uploading ${i + 1} of ${picked.length}: ${file.name}` });
          const ticket = res.tickets[i];
          const { error } = await storage.uploadToSignedUrl(ticket.path, ticket.token, file, { contentType: file.type || undefined });
          if (error) return setStatus({ kind: "error", text: `${file.name} didn't upload. Check your connection and try again.` });
          uploaded.push({ path: ticket.path, name: file.name, size: file.size, type: file.type });
        }
      }
      const saved = await saveSubmission(cohortId, slug, assessmentId, { link, comment, files: [...kept, ...uploaded] });
      if (!saved.ok) return setStatus({ kind: "error", text: saved.error });
      setKept([...kept, ...uploaded]);
      setPicked([]);
      setSubmittedAt("just now");
      setStatus({ kind: "done", text: "Submitted. Your teacher can see it now." });
    });
  }

  const nothing = !link.trim() && kept.length + picked.length === 0;

  return (
    <div className="grid gap-5 rounded-2xl border border-line bg-card p-5">
      {submittedAt && <p className="rounded-lg bg-teal-soft px-3 py-2 text-sm">Submitted {submittedAt}. You can change it and submit again.</p>}

      <label className="grid gap-1 text-sm font-bold">
        Link (Tableau Public, Google Drive, Slides or Colab)
        <input
          id="submission-link"
          type="url"
          value={link}
          onChange={(e) => { setLink(e.target.value); changed(); }}
          placeholder="https://public.tableau.com/app/profile/…"
          className="rounded-lg border border-line bg-paper px-3 py-2 font-normal"
        />
      </label>

      <div className="grid gap-2">
        <p className="text-sm font-bold">Files</p>
        <ul className="grid gap-2">
          {kept.map((f) => (
            <li key={f.path} className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2 text-sm">
              <span className="min-w-0 truncate">{f.name} <span className="text-muted">· {formatBytes(f.size)}</span></span>
              <button type="button" onClick={() => { setKept(kept.filter((k) => k.path !== f.path)); changed(); }} className="shrink-0 text-warn hover:underline">
                Remove
              </button>
            </li>
          ))}
          {picked.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-teal px-3 py-2 text-sm">
              <span className="min-w-0 truncate">{f.name} <span className="text-muted">· {formatBytes(f.size)} · new</span></span>
              <button type="button" onClick={() => { setPicked(picked.filter((_, j) => j !== i)); changed(); }} className="shrink-0 text-warn hover:underline">
                Remove
              </button>
            </li>
          ))}
        </ul>
        <input
          ref={input}
          id="submission-files"
          type="file"
          multiple
          accept={ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(",")}
          onChange={(e) => addFiles(e.target.files)}
          className="text-sm"
        />
        <p className="text-xs text-muted">Up to {MAX_FILES} files, 25 MB each. Videos are usually bigger: upload them to Google Drive and paste the link above.</p>
      </div>

      <label className="grid gap-1 text-sm font-bold">
        Note for your teacher (optional)
        <textarea id="submission-comment" value={comment} onChange={(e) => { setComment(e.target.value); changed(); }} rows={3} className="rounded-lg border border-line bg-paper px-3 py-2 font-normal" />
      </label>

      {status.text && (
        <p className={`text-sm ${status.kind === "error" ? "font-bold text-warn" : status.kind === "done" ? "font-bold text-ok" : "text-muted"}`}>{status.text}</p>
      )}
      <button
        type="button"
        disabled={pending || nothing}
        onClick={submit}
        className="justify-self-start rounded-full bg-teal px-6 py-2.5 font-bold text-white disabled:opacity-60 dark:text-[#0d1a1d]"
      >
        {pending ? "Submitting…" : submittedAt ? "Submit again" : "Submit"}
      </button>
    </div>
  );
}
