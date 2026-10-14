export function formatDate(iso: string, timeZone: string, opts: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat("en-IN", { timeZone, weekday: "short", day: "numeric", month: "short", ...opts }).format(
    new Date(iso),
  );
}

export function formatTime(iso: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-IN", { timeZone, hour: "numeric", minute: "2-digit" }).format(new Date(iso));
}

/** YYYY-MM-DD of an instant in a timezone. */
export function localDate(iso: string | Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(typeof iso === "string" ? new Date(iso) : iso);
}

/** Current time in ms. Pages render per request, so reading the clock during render is intended. */
export function nowMs() {
  return Date.now();
}

/** "13:30:00" -> "1:30 pm" */
export function formatClock(time: string) {
  const [h, m] = time.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
}
