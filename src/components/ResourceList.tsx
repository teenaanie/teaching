import { embedUrl, resourceLabels } from "@/lib/resources";
import type { Resource } from "@/lib/types";

const icons: Record<Resource["type"], string> = {
  slides: "▤",
  video: "▶",
  notebook: "{ }",
  dataset: "▦",
  doc: "¶",
  link: "↗",
};

export function ResourceList({ resources }: { resources: Resource[] }) {
  if (resources.length === 0) return null;
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {resources.map((r) => (
        <li key={r.url}>
          <a
            href={r.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg border border-line bg-card px-3 py-2.5 hover:border-teal"
          >
            <span aria-hidden className="grid h-8 w-10 shrink-0 place-items-center rounded bg-teal-soft text-xs font-bold text-teal">
              {icons[r.type]}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-bold">{r.title}</span>
              <span className="block text-xs text-muted">
                {r.type === "notebook" ? "Open in Colab" : resourceLabels[r.type]}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Embeds the first video and first slide deck inline. */
export function ResourceEmbeds({ resources }: { resources: Resource[] }) {
  const picks = (["video", "slides"] as const)
    .map((type) => resources.find((r) => r.type === type))
    .filter((r): r is Resource => !!r && !!embedUrl(r));
  if (picks.length === 0) return null;
  return (
    <div className="grid gap-4">
      {picks.map((r) => (
        <figure key={r.url} className="overflow-hidden rounded-xl border border-line bg-card">
          <div className="aspect-video">
            <iframe
              src={embedUrl(r)!}
              title={r.title}
              className="h-full w-full"
              allow="autoplay; fullscreen"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <figcaption className="px-3 py-2 text-sm text-muted">{r.title}</figcaption>
        </figure>
      ))}
    </div>
  );
}
