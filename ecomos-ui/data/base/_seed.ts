/**
 * Deterministic helpers for the seed-data layer.
 *
 * NOTHING here reads the wall clock or uses unseeded randomness. The single
 * reference instant is 2026-06-20T09:00:00+02:00 (mirrors lib/formatting
 * REFERENCE_NOW). Timestamps are built as explicit ISO strings relative to it.
 */

/** The one reference "now" as epoch milliseconds (2026-06-20T09:00:00+02:00). */
export const REFERENCE_NOW_MS = Date.parse("2026-06-20T09:00:00.000+02:00");

/** Build an ISO timestamp `offsetMinutes` before the reference now (negative = future). */
export function minutesAgo(offsetMinutes: number): string {
  return new Date(REFERENCE_NOW_MS - offsetMinutes * 60_000).toISOString();
}

/** Build an ISO timestamp `hours` before the reference now. */
export function hoursAgo(hours: number): string {
  return minutesAgo(hours * 60);
}

/** Build an ISO timestamp `days` before the reference now. */
export function daysAgo(days: number): string {
  return minutesAgo(days * 24 * 60);
}

/** Build an ISO timestamp `days` after the reference now (for due/expiry). */
export function daysFromNow(days: number): string {
  return daysAgo(-days);
}

/** Build an ISO timestamp `hours` after the reference now. */
export function hoursFromNow(hours: number): string {
  return hoursAgo(-hours);
}

/**
 * Seeded pseudo-random generator (mulberry32). Same seed → same sequence.
 * Use for spreading fixture values deterministically by index.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic float in [min, max) keyed by index. */
export function seededFloat(index: number, min: number, max: number): number {
  const r = mulberry32(index * 2654435761 + 12345)();
  return min + r * (max - min);
}

/** Deterministic integer in [min, max] keyed by index. */
export function seededInt(index: number, min: number, max: number): number {
  return Math.floor(seededFloat(index, min, max + 1));
}

/** Deterministic pick from an array keyed by index. */
export function seededPick<T>(index: number, items: readonly T[]): T {
  return items[seededInt(index, 0, items.length - 1)];
}

/** Round money to 2 decimals (avoids float dust in fixtures). */
export function money(value: number): number {
  return Math.round(value * 100) / 100;
}
