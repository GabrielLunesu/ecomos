/**
 * Brand, store, channel, and team types.
 *
 * Pages: /settings/stores, /settings/team, BrandContextSwitcher, /command-center
 * (store scope + freshness), and aggregation across all analytical routes.
 */

import type { CurrencyCode, IsoTimestamp, EntityId, Department } from "./shared";

/** The single fixture brand (e.g. "Northstar Goods"). */
export interface Brand {
  id: EntityId;
  name: string;
  currency: CurrencyCode;
  /** IANA timezone, e.g. "Europe/Amsterdam". */
  timezone: string;
  businessModel: "dropshipping" | "stock" | "hybrid";
  /** When false, the Inventory module is hidden by default. */
  inventoryEnabled: boolean;
}

/** A storefront under the brand. Exact shape per SEED-DATA-CONTRACT. */
export interface Store {
  id: EntityId;
  brandId: EntityId;
  name: string;
  domain: string;
  currency: CurrencyCode;
  timezone: string;
  status: "healthy" | "degraded" | "disconnected";
}

/** A sales / ads / support channel connected to the brand. */
export const CHANNEL_KINDS = [
  "commerce",
  "ads",
  "inbox",
  "payments",
  "communication",
] as const;
export type ChannelKind = (typeof CHANNEL_KINDS)[number];

export const CHANNEL_STATUSES = [
  "connected",
  "degraded",
  "expired",
  "action-required",
  "disconnected",
] as const;
export type ChannelStatus = (typeof CHANNEL_STATUSES)[number];

export interface Channel {
  id: EntityId;
  brandId: EntityId;
  /** Display name, e.g. "Meta Ads", "Shopify", "Gmail support inbox". */
  name: string;
  kind: ChannelKind;
  status: ChannelStatus;
  lastSyncAt: IsoTimestamp | null;
}

/** Local role identifiers (mirrors data/scenario.ts ROLE_IDS for the role preview). */
export const TEAM_ROLES = ["owner", "admin", "cs-lead", "cs-rep", "finance", "viewer"] as const;
export type TeamRole = (typeof TEAM_ROLES)[number];

export const PRESENCE_STATES = ["online", "away", "offline"] as const;
export type Presence = (typeof PRESENCE_STATES)[number];

/** A person on the team. Used for ownership, assignment, and presence. */
export interface TeamMember {
  id: EntityId;
  name: string;
  /** Two-letter initials for avatar fallback, e.g. "AV". */
  initials: string;
  role: TeamRole;
  department: Department;
  presence: Presence;
  /** Invite lifecycle for /settings/team. */
  inviteStatus?: "active" | "invited" | "expired";
}
