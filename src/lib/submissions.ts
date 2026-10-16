/**
 * Rules for assignment uploads, shared by the student form (client) and the server actions.
 * Files go straight from the browser to Supabase Storage through one-time signed upload
 * links, so large files never pass through the web server.
 */

export const SUBMISSION_BUCKET = "submissions";
export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_FILES = 5;

/** File types students commonly need for this course. */
export const ALLOWED_EXTENSIONS = [
  "pdf", "png", "jpg", "jpeg", "webp",
  "doc", "docx", "ppt", "pptx", "xls", "xlsx", "csv",
  "ipynb", "py", "txt",
  "twb", "twbx", "zip",
];

export type SubmittedFile = { path: string; name: string; size: number; type: string };

export function fileExtension(name: string) {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot + 1).toLowerCase();
}

/** Reason a file can't be uploaded, or null if it's fine. */
export function fileProblem(file: { name: string; size: number }): string | null {
  if (!ALLOWED_EXTENSIONS.includes(fileExtension(file.name))) {
    return `${file.name}: this file type isn't accepted. Use PDF, images, Word, PowerPoint, Excel, CSV, notebooks or Tableau files.`;
  }
  if (file.size > MAX_FILE_BYTES) return `${file.name} is larger than 25 MB. Put it on Google Drive and paste the link instead.`;
  if (file.size === 0) return `${file.name} is empty.`;
  return null;
}

/** Storage folder that holds one student's files for one assessment. */
export function submissionFolder(cohortId: string, assessmentId: string, studentId: string) {
  return `${cohortId}/${assessmentId}/${studentId}/`;
}

/** A storage-safe version of a file name (keeps the extension). */
export function safeFileName(name: string) {
  const ext = fileExtension(name);
  const base = (ext ? name.slice(0, -(ext.length + 1)) : name)
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "file";
  return ext ? `${base}.${ext}` : base;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Accepts only http(s) links; returns the cleaned URL or null. */
export function cleanLink(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}
