/**
 * Pure selector helpers. Deterministic; no wall-clock, no randomness.
 * Multi-currency note: the prototype aggregates numeric amounts directly and
 * presents the brand currency (EUR) for "all stores"; single-store scope uses
 * that store's currency. A real implementation would FX-normalise.
 */

import type { Order } from "@/data/schema";
import type { StoreScope } from "@/data/scenario";
import { STORES } from "@/data/base/brand";

export function filterOrdersByStore(orders: Order[], scope: StoreScope): Order[] {
  if (scope === "all") return orders;
  return orders.filter((o) => o.storeId === scope);
}

export function scopeCurrency(scope: StoreScope): "EUR" | "GBP" | "USD" {
  if (scope === "all") return "EUR";
  return STORES.find((s) => s.id === scope)?.currency ?? "EUR";
}

export function sum(values: (number | null | undefined)[]): number {
  return values.reduce<number>((acc, v) => acc + (v ?? 0), 0);
}

/** Date key (YYYY-MM-DD) of an ISO timestamp. */
export function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

/** A daily revenue / margin / spend series over the orders provided. */
export type DailyPoint = { date: string; revenue: number; margin: number; spend: number; orders: number };

export function dailySeries(orders: Order[], days = 30, endDate = "2026-06-20"): DailyPoint[] {
  const end = new Date(`${endDate}T00:00:00Z`).getTime();
  const buckets = new Map<string, DailyPoint>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end - i * 86_400_000).toISOString().slice(0, 10);
    buckets.set(d, { date: d, revenue: 0, margin: 0, spend: 0, orders: 0 });
  }
  for (const o of orders) {
    const k = dayKey(o.placedAt);
    const b = buckets.get(k);
    if (!b) continue;
    b.revenue += o.revenue;
    b.margin += o.contributionMargin ?? 0;
    b.spend += o.allocatedAdSpend;
    b.orders += 1;
  }
  return [...buckets.values()];
}

export function round(n: number, dp = 2): number {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}

const REFERENCE_END = "2026-06-20";

/** Orders placed within the current N-day window ending at the reference date. */
export function windowOrders(orders: Order[], days: number, endDate = REFERENCE_END): Order[] {
  const end = new Date(`${endDate}T23:59:59Z`).getTime();
  const start = end - days * 86_400_000;
  return orders.filter((o) => {
    const t = new Date(o.placedAt).getTime();
    return t > start && t <= end;
  });
}

/** Orders in the immediately preceding N-day window (for "vs prev period"). */
export function previousWindowOrders(orders: Order[], days: number, endDate = REFERENCE_END): Order[] {
  const end = new Date(`${endDate}T23:59:59Z`).getTime() - days * 86_400_000;
  const start = end - days * 86_400_000;
  return orders.filter((o) => {
    const t = new Date(o.placedAt).getTime();
    return t > start && t <= end;
  });
}

/**
 * Build a factual comparison trend from current vs previous window totals.
 * Returns null when comparison is disabled; deltaPct null when no prior data.
 */
export function compareTrend(curr: number, prev: number, compare: boolean): import("@/data/schema").Trend | null {
  if (!compare) return null;
  const direction = curr > prev ? "up" : curr < prev ? "down" : "flat";
  if (prev <= 0) return { direction, deltaPct: null };
  return { direction, deltaPct: round(((curr - prev) / prev) * 100, 1) };
}
