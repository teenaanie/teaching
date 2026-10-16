"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNav({ slug }: { slug: string }) {
  const path = usePathname();
  const items = [
    { href: `/admin/${slug}`, label: "Sessions" },
    { href: `/admin/${slug}/assignments`, label: "Assignments" },
    { href: `/admin/${slug}/gradebook`, label: "Gradebook" },
    { href: `/admin/${slug}/students`, label: "Students" },
    { href: `/admin/${slug}/feedback`, label: "Feedback" },
    { href: `/admin/${slug}/settings`, label: "Settings" },
  ];
  return (
    <nav className="flex flex-wrap gap-1 text-sm">
      {items.map((i) => {
        const active = i.href === `/admin/${slug}` ? path === i.href || path.includes("/sessions/") : path.startsWith(i.href);
        return (
          <Link key={i.href} href={i.href} className={`rounded-full px-3 py-1 ${active ? "bg-ink font-bold text-paper" : "hover:bg-teal-soft"}`}>
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
