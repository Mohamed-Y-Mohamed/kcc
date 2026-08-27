/** Money is stored as a number; it only becomes a string at the edge. */
export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

/** `2026-08-27` — the storage format for all booking dates. */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDaysISO(iso: string, days: number): string {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** Parses as *local* midnight — `new Date("2026-08-27")` parses as UTC and
 *  silently shifts the day for anyone west of Greenwich. */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const ms = parseISODate(checkOut).getTime() - parseISODate(checkIn).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

export function formatDate(iso: string): string {
  if (!iso) return "—";
  return parseISODate(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  if (!iso) return "—";
  return parseISODate(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

export function formatTimestamp(ts: { toDate: () => Date } | null): string {
  if (!ts) return "—";
  return ts.toDate().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * KCC-4F7K2 — unambiguous alphabet only. No O/0, I/1, S/5, so a guest reading
 * it down a phone line cannot get it wrong.
 */
export function generateBookingCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRTUVWXYZ2346789";
  let out = "";
  for (let i = 0; i < 5; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `KCC-${out}`;
}

export function pluralise(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}
