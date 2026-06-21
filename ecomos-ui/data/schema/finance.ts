/**
 * Finance domain: contribution-margin model, summaries, profit bridge,
 * reconciliation, and source connections.
 *
 * Pages: /finance, /finance/profit, /finance/orders-margin, /finance/spend-roas,
 * /finance/costs-fees, /finance/payouts, /finance/reconciliation.
 */

import type {
  EntityId,
  IsoTimestamp,
  Money,
  CurrencyCode,
  Confidence,
  Freshness,
  Trend,
  FreshnessStatus,
} from "./shared";

/**
 * Explainable contribution-margin breakdown for an entity (order, period, store…).
 *
 *   net revenue
 *   - COGS
 *   - allocated ad spend
 *   - fees
 *   - shipping cost
 *   - refunds
 *   = estimated contribution margin
 */
export interface ContributionMarginBreakdown {
  netRevenue: Money;
  /** null when COGS is missing for this scope. */
  cogs: Money | null;
  allocatedAdSpend: Money;
  fees: Money;
  shippingCost: Money;
  refunds: Money;
  /** Result of the formula above; null when too incomplete to estimate. */
  estimatedContributionMargin: Money | null;
  confidence: Confidence;
  /** Human-readable names of inputs that are missing or estimated. */
  missingInputs: string[];
}

/** Top-line finance summary for the overview header / MetricStrip. */
export interface FinanceSummary {
  periodStart: IsoTimestamp;
  periodEnd: IsoTimestamp;
  currency: CurrencyCode;
  revenue: Money;
  contributionMargin: Money | null;
  marginRatePct: number | null;
  adSpend: Money;
  cogs: Money | null;
  fees: Money;
  discounts: Money;
  refunds: Money;
  shippingCost: Money;
  confidence: Confidence;
  freshness: Freshness;
  marginTrend: Trend;
}

/** One step in a profit-bridge / waterfall chart. */
export interface ProfitBridgeStep {
  /** Semantic key, e.g. "revenue", "cogs", "ad-spend", "fees", "contribution-margin". */
  key: string;
  label: string;
  /** Signed contribution to the bridge (positive adds, negative subtracts). */
  amount: Money;
  kind: "start" | "increase" | "decrease" | "total";
}

export const RECONCILIATION_KINDS = [
  "unmatched-transaction",
  "missing-cogs",
  "currency-gap",
  "attribution-gap",
  "totals-mismatch",
  "payout-variance",
] as const;
export type ReconciliationKind = (typeof RECONCILIATION_KINDS)[number];

/** An item in the reconciliation / data-trust workspace. */
export interface ReconciliationItem {
  id: EntityId;
  kind: ReconciliationKind;
  description: string;
  /** Monetary impact where applicable; null for non-monetary gaps. */
  amount: Money | null;
  currency: CurrencyCode | null;
  /** Related records to inspect. */
  relatedEntityIds: EntityId[];
  status: "open" | "investigating" | "resolved";
  ownerId: EntityId | null;
  firstSeen: IsoTimestamp;
}

/** A connected source feeding finance data (reconciliation source panel). */
export interface SourceConnection {
  id: EntityId;
  name: string;
  kind: "commerce" | "ads" | "payments" | "inbox" | "communication";
  lastSyncAt: IsoTimestamp | null;
  status: FreshnessStatus;
  /** Explains what data is missing/stale when status is not healthy. */
  missingDataNote?: string;
}
