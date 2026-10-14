import type { Resource } from "./types";

/** Extracts a Google Drive / Docs file id from common share URLs. */
export function driveFileId(url: string): string | null {
  const m = url.match(/\/(?:file|document|presentation|spreadsheets)\/d\/([\w-]+)/) ?? url.match(/[?&]id=([\w-]+)/);
  return m ? m[1] : null;
}

/** Returns an iframe-embeddable URL for Drive videos, slides and docs, or null if not embeddable. */
export function embedUrl(resource: Resource): string | null {
  const id = driveFileId(resource.url);
  if (!id) return null;
  if (resource.url.includes("docs.google.com/presentation")) return `https://docs.google.com/presentation/d/${id}/embed`;
  if (resource.url.includes("docs.google.com/document")) return `https://docs.google.com/document/d/${id}/preview`;
  if (resource.url.includes("drive.google.com/file")) return `https://drive.google.com/file/d/${id}/preview`;
  return null;
}

export const resourceLabels: Record<Resource["type"], string> = {
  slides: "Slides",
  video: "Video",
  notebook: "Colab notebook",
  dataset: "Dataset",
  doc: "Document",
  link: "Link",
};
