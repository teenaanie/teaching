export function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl animate-pulse px-4 py-8" aria-busy="true" aria-label="Loading">
      <div className="h-40 rounded-2xl bg-line/60" />
      <div className="mt-8 h-6 w-40 rounded bg-line/60" />
      <div className="mt-4 grid gap-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-10 rounded bg-line/40" />
        ))}
      </div>
    </div>
  );
}
