/**
 * Shared domain vocabulary and primitives.
 *
 * Pure types only — no runtime logic, no data, no React.
 *
 * Conventions used across every domain:
 * - All date/time fields are ISO 8601 strings (e.g. "2026-06-20T09:00:00.000+02:00").
 *   NEVER store pre-formatted display strings; formatting happens at render time
 *   via `lib/formatting`.
 * - Money amounts are plain `number` values in MAJOR currency units (e.g. 1240.50
 *   means €1,240.50). Currency is carried separately via `currency: CurrencyCode`
 *   on entities that need it. Never store strings like "€1,240.50" as canonical data.
 * - Cross-entity links use either a raw id (`customerId: EntityId`) when a direct id
 *   is clearer, or an `EntityRef` when a lightweight label+kind is useful for display.
 */

/** Stable identifier for any seeded entity. Plain string alias for ergonomics. */
export type EntityId = string;

/** ISO 8601 timestamp string. Documentation alias — same as `string`. */
export type IsoTimestamp = string;

/**
 * Lightweight reference to another entity for display/navigation.
 * Use where a direct id is not enough (e.g. an activity target you render inline).
 */
export interface EntityRef {
  id: EntityId;
  /** Entity kind, e.g. "order", "ticket", "customer", "campaign", "agent", "run". */
  kind: string;
  /** Human-readable label, e.g. "Order #1042" or "Anna de Vries". */
  label: string;
}

/** Who or what performed an action. Drives the actor badge. */
export type ActorKind = "human" | "agent" | "system" | "connector" | "approval";

/**
 * Semantic status variants for the status badge (see COMPONENT-SYSTEM).
 * `StatusTone` and `StatusVariant` are aliases of the same union.
 */
export const STATUS_VARIANTS = [
  "neutral",
  "info",
  "in-progress",
  "success",
  "warning",
  "critical",
  "blocked",
  "paused",
  "awaiting-approval",
  "outcome-uncertain",
  "stale",
] as const;
export type StatusVariant = (typeof STATUS_VARIANTS)[number];
export type StatusTone = StatusVariant;

/** Data-quality / confidence indicator. */
export const CONFIDENCE_LEVELS = ["confirmed", "estimated", "partial", "missing"] as const;
export type Confidence = (typeof CONFIDENCE_LEVELS)[number];

/** Source/data freshness summary used by the freshness indicator. */
export const FRESHNESS_STATUSES = ["healthy", "stale", "partial", "disconnected"] as const;
export type FreshnessStatus = (typeof FRESHNESS_STATUSES)[number];

export interface Freshness {
  /** ISO timestamp of the most recent underlying update. */
  updatedAt: IsoTimestamp;
  /** Number of distinct sources backing this value. */
  sourceCount: number;
  status: FreshnessStatus;
}

/** Supported currency codes for the fixture brand and stores. */
export const CURRENCY_CODES = ["EUR", "GBP", "USD"] as const;
export type CurrencyCode = (typeof CURRENCY_CODES)[number];

/**
 * Money amount in MAJOR units. Kept as a discrete type for clarity at call sites;
 * structurally identical to `number`.
 */
export type Money = number;

/** Directional trend with optional percentage delta (null when not computable). */
export const TREND_DIRECTIONS = ["up", "down", "flat"] as const;
export type TrendDirection = (typeof TREND_DIRECTIONS)[number];

export interface Trend {
  direction: TrendDirection;
  /** Percentage change vs comparison period, or null when missing/partial. */
  deltaPct: number | null;
}

/** Department namespaces used for routing, filtering, and ownership. */
export const DEPARTMENTS = [
  "customer-service",
  "finance",
  "marketing",
  "commerce",
  "operations",
  "agents",
  "knowledge",
] as const;
export type Department = (typeof DEPARTMENTS)[number];

/** Generic severity scale for alerts, exceptions, and errors. */
export const SEVERITIES = ["info", "low", "medium", "high", "critical"] as const;
export type Severity = (typeof SEVERITIES)[number];

/**
 * Actor descriptor — resolves an `ActorKind` to a concrete entity for display.
 * `ref` is null for anonymous system/connector actors.
 */
export interface Actor {
  kind: ActorKind;
  ref: EntityRef | null;
}
