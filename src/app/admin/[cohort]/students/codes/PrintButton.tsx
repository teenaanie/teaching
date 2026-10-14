"use client";

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="rounded-full bg-teal px-5 py-2 text-sm font-bold text-white dark:text-[#0d1a1d]">
      Print
    </button>
  );
}
