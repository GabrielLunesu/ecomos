/**
 * Centralized formatting for Ecom-OS.
 *
 * Fixture values stay numeric (and timestamps stay ISO strings) until they
 * reach one of these helpers. Never store display-formatted strings as the
 * canonical fixture value.
 *
 * All relative-time math is computed against a single deterministic reference
 * instant so the prototype renders identically on every machine and in tests.
 */

/** The one deterministic "now" for the whole prototype. */
export const REFERENCE_NOW = new Date("2026-06-20T09:00:00.000+02:00");

export const DEFAULT_LOCALE = "en-GB";

type Numeric = number | null | undefined;

const MISSING = "—";

function isMissing(value: Numeric): value is null | undefined {
  return value === null || value === undefined || Number.isNaN(value);
}

/** Currency, e.g. €1,240.50. Accepts ISO currency code; defaults to EUR. */
export function formatCurrency(
  value: Numeric,
  currency = "EUR",
  options: { compact?: boolean; decimals?: number } = {},
): string {
  if (isMissing(value)) return MISSING;
  const { compact, decimals } = options;
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    minimumFractionDigits: decimals ?? (compact ? 0 : 2),
    maximumFractionDigits: decimals ?? (compact ? 1 : 2),
  }).format(value);
}

/** Signed currency for deltas, e.g. +€320 / −€1,024. */
export function formatCurrencyDelta(value: Numeric, currency = "EUR"): string {
  if (isMissing(value)) return MISSING;
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${formatCurrency(Math.abs(value), currency, { compact: true })}`;
}

/** Plain integer / decimal number with thousands separators. */
export function formatNumber(value: Numeric, decimals = 0): string {
  if (isMissing(value)) return MISSING;
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Compact number, e.g. 12.4K, 1.2M. */
export function formatCompact(value: Numeric): string {
  if (isMissing(value)) return MISSING;
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Percentage. Pass the value already as a percentage by default (e.g. 12.5 -> "12.5%").
 * Set `fromRatio` to convert a 0–1 ratio (e.g. 0.125 -> "12.5%").
 */
export function formatPercent(
  value: Numeric,
  options: { decimals?: number; fromRatio?: boolean; signed?: boolean } = {},
): string {
  if (isMissing(value)) return MISSING;
  const { decimals = 1, fromRatio = false, signed = false } = options;
  const pct = fromRatio ? value * 100 : value;
  const formatted = new Intl.NumberFormat(DEFAULT_LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(pct));
  const sign = signed ? (pct > 0 ? "+" : pct < 0 ? "−" : "") : pct < 0 ? "−" : "";
  return `${sign}${formatted}%`;
}

/** Ratio multiplier, e.g. 3.2× (used for ROAS). */
export function formatMultiplier(value: Numeric, decimals = 1): string {
  if (isMissing(value)) return MISSING;
  return `${value.toFixed(decimals)}×`;
}

const DATE_FMT = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const SHORT_DATE_FMT = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  day: "numeric",
  month: "short",
});
const TIME_FMT = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
});
const DATETIME_FMT = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function toDate(value: Date | string | number | null | undefined): Date | null {
  if (value === null || value === undefined) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDate(value: Date | string | number | null | undefined): string {
  const d = toDate(value);
  return d ? DATE_FMT.format(d) : MISSING;
}

export function formatShortDate(value: Date | string | number | null | undefined): string {
  const d = toDate(value);
  return d ? SHORT_DATE_FMT.format(d) : MISSING;
}

export function formatTime(value: Date | string | number | null | undefined): string {
  const d = toDate(value);
  return d ? TIME_FMT.format(d) : MISSING;
}

export function formatDateTime(value: Date | string | number | null | undefined): string {
  const d = toDate(value);
  return d ? DATETIME_FMT.format(d) : MISSING;
}

/**
 * Relative time against REFERENCE_NOW, e.g. "8 minutes ago", "in 2 days".
 * Deterministic: never reads the wall clock.
 */
export function formatRelativeTime(
  value: Date | string | number | null | undefined,
  now: Date = REFERENCE_NOW,
): string {
  const d = toDate(value);
  if (!d) return MISSING;
  const diffMs = d.getTime() - now.getTime();
  const abs = Math.abs(diffMs);
  const rtf = new Intl.RelativeTimeFormat(DEFAULT_LOCALE, { numeric: "auto" });

  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (abs < minute) return "just now";
  if (abs < hour) return rtf.format(Math.round(diffMs / minute), "minute");
  if (abs < day) return rtf.format(Math.round(diffMs / hour), "hour");
  if (abs < week) return rtf.format(Math.round(diffMs / day), "day");
  if (abs < 4 * week) return rtf.format(Math.round(diffMs / week), "week");
  return DATE_FMT.format(d);
}

/** Duration from milliseconds, e.g. "1m 24s", "3.2s", "2h 5m". */
export function formatDuration(ms: Numeric): string {
  if (isMissing(ms)) return MISSING;
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const totalSeconds = ms / 1000;
  if (totalSeconds < 60) return `${totalSeconds.toFixed(1)}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  if (minutes < 60) return seconds ? `${minutes}m ${seconds}s` : `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${hours}h ${mins}m` : `${hours}h`;
}

/** Compact age between a timestamp and the reference, e.g. "8m", "3h", "2d". */
export function formatAge(
  value: Date | string | number | null | undefined,
  now: Date = REFERENCE_NOW,
): string {
  const d = toDate(value);
  if (!d) return MISSING;
  const diffMs = Math.abs(now.getTime() - d.getTime());
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diffMs < minute) return "now";
  if (diffMs < hour) return `${Math.round(diffMs / minute)}m`;
  if (diffMs < day) return `${Math.round(diffMs / hour)}h`;
  return `${Math.round(diffMs / day)}d`;
}

/** Title-case a kebab/snake/space identifier for display fallbacks. */
export function titleCase(value: string): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
