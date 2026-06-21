/**
 * Canonical brand identity, store, channels, and team.
 *
 * Ecom-OS is a SINGLE-STORE application: the brand operates exactly one store.
 * There is no store-scope switching or multi-store aggregation.
 */

import type { Brand, Channel, Store, TeamMember } from "@/data/schema";

export const BRAND: Brand = {
  id: "brand-northstar",
  name: "Northstar Goods",
  currency: "EUR",
  timezone: "Europe/Amsterdam",
  businessModel: "dropshipping",
  inventoryEnabled: false,
};

/** The single store. */
export const STORE: Store = {
  id: "store-northstar",
  brandId: BRAND.id,
  name: "Northstar Goods",
  domain: "northstar-goods.com",
  currency: "EUR",
  timezone: "Europe/Amsterdam",
  status: "healthy",
};

/** Retained as an array for callers that iterate; always length 1. */
export const STORES: Store[] = [STORE];

export const CHANNELS: Channel[] = [
  { id: "ch-shopify", brandId: BRAND.id, name: "Shopify", kind: "commerce", status: "connected", lastSyncAt: "2026-06-20T08:52:00.000+02:00" },
  { id: "ch-meta", brandId: BRAND.id, name: "Meta Ads", kind: "ads", status: "connected", lastSyncAt: "2026-06-20T06:10:00.000+02:00" },
  { id: "ch-google", brandId: BRAND.id, name: "Google Ads", kind: "ads", status: "connected", lastSyncAt: "2026-06-20T07:30:00.000+02:00" },
  { id: "ch-gmail", brandId: BRAND.id, name: "Gmail support inbox", kind: "inbox", status: "connected", lastSyncAt: "2026-06-20T08:58:00.000+02:00" },
  { id: "ch-stripe", brandId: BRAND.id, name: "Stripe payouts", kind: "payments", status: "connected", lastSyncAt: "2026-06-19T23:00:00.000+02:00" },
  { id: "ch-telegram", brandId: BRAND.id, name: "Telegram daily brief", kind: "communication", status: "connected", lastSyncAt: "2026-06-20T07:00:00.000+02:00" },
  { id: "ch-slack", brandId: BRAND.id, name: "Slack operations alerts", kind: "communication", status: "connected", lastSyncAt: "2026-06-20T08:40:00.000+02:00" },
];

export const TEAM: TeamMember[] = [
  { id: "tm-ava", name: "Ava Bergström", initials: "AB", role: "owner", department: "commerce", presence: "online", inviteStatus: "active" },
  { id: "tm-jonas", name: "Jonas Meyer", initials: "JM", role: "admin", department: "operations", presence: "online", inviteStatus: "active" },
  { id: "tm-priya", name: "Priya Nair", initials: "PN", role: "cs-lead", department: "customer-service", presence: "online", inviteStatus: "active" },
  { id: "tm-tomas", name: "Tomas Kovač", initials: "TK", role: "cs-rep", department: "customer-service", presence: "away", inviteStatus: "active" },
  { id: "tm-lena", name: "Lena Fischer", initials: "LF", role: "finance", department: "finance", presence: "offline", inviteStatus: "active" },
  { id: "tm-sam", name: "Sam Okafor", initials: "SO", role: "viewer", department: "marketing", presence: "offline", inviteStatus: "invited" },
];

/** Single store — scope argument is ignored (kept for selector signatures). */
export function storeName(): string {
  return STORE.name;
}

export function storeCurrency(): "EUR" | "GBP" | "USD" {
  return STORE.currency;
}
