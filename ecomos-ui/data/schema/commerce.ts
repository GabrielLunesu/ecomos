/**
 * Commerce domain: products, suppliers, customers, orders and order economics.
 *
 * Pages: /commerce/*, /finance/orders-margin (order margin inputs),
 * /operations/* (fulfilment, returns), and cross-links into CS and Agents.
 *
 * Orders carry enough to compute contribution margin without re-deriving it on
 * each page: revenue, discounts, cogs (nullable for missing-COGS cases),
 * allocated ad spend, fees, shipping, refunds, plus a precomputed
 * `contributionMargin` and a `costConfidence`.
 */

import type {
  EntityId,
  IsoTimestamp,
  Money,
  CurrencyCode,
  Confidence,
} from "./shared";

/** A supplier — used by Commerce (product sourcing) and Operations (scorecards). */
export interface Supplier {
  id: EntityId;
  name: string;
  /** Country/region label, e.g. "CN", "NL". */
  region: string;
  /** Product ids sourced from this supplier. */
  productIds: EntityId[];
  status: "active" | "watch" | "suspended";
}

/** A sellable product. */
export interface Product {
  id: EntityId;
  storeId: EntityId;
  title: string;
  sku: string;
  /** List price in MAJOR units. */
  price: Money;
  currency: CurrencyCode;
  /** Per-unit cost of goods; null when COGS is missing (partial-data scenario). */
  unitCost: Money | null;
  costConfidence: Confidence;
  supplierIds: EntityId[];
  status: "active" | "draft" | "archived";
}

/** A customer of the brand. */
export interface Customer {
  id: EntityId;
  /** Display name (fictional). */
  name: string;
  /** Masked/fictional email — never a real address. */
  email: string;
  storeId: EntityId;
  firstOrderAt: IsoTimestamp | null;
  lastOrderAt: IsoTimestamp | null;
  ordersCount: number;
  lifetimeRevenue: Money;
  lifetimeMargin: Money;
  currency: CurrencyCode;
  segment: "new" | "returning" | "vip" | "at-risk";
  /** Linked ticket ids for this customer's support history. */
  ticketIds: EntityId[];
}

/** A line within an order. */
export interface OrderLine {
  id: EntityId;
  orderId: EntityId;
  productId: EntityId;
  quantity: number;
  /** Unit price charged in MAJOR units. */
  unitPrice: Money;
  /** Per-unit cost at time of sale; null when COGS missing. */
  unitCost: Money | null;
  discount: Money;
}

export const FULFILMENT_STATUSES = [
  "unfulfilled",
  "processing",
  "shipped",
  "delivered",
  "delayed",
  "returned",
  "cancelled",
] as const;
export type FulfilmentStatus = (typeof FULFILMENT_STATUSES)[number];

/** Shipment/fulfilment record attached to an order. */
export interface Fulfilment {
  id: EntityId;
  orderId: EntityId;
  supplierId: EntityId | null;
  status: FulfilmentStatus;
  promisedAt: IsoTimestamp | null;
  shippedAt: IsoTimestamp | null;
  deliveredAt: IsoTimestamp | null;
  /** Carrier tracking number; null when tracking is missing. */
  trackingNumber: string | null;
  carrier: string | null;
}

/** A discount applied to an order or offered as a code. */
export interface Discount {
  id: EntityId;
  code: string;
  /** Source of the discount: human-created, agent-proposed, or campaign-driven. */
  source: "human" | "agent" | "campaign";
  /** Percentage (0–100) OR fixed amount, disambiguated by `kind`. */
  kind: "percentage" | "fixed";
  value: number;
  amountApplied: Money;
  status: "active" | "scheduled" | "expired" | "disabled";
  /** Approval that authorized this discount, if any. */
  approvalId: EntityId | null;
}

/** A refund issued against an order. */
export interface Refund {
  id: EntityId;
  orderId: EntityId;
  amount: Money;
  reason: string;
  issuedAt: IsoTimestamp;
  /** Approval that authorized the refund, if any. */
  approvalId: EntityId | null;
}

export const RETURN_STATUSES = [
  "requested",
  "approved",
  "in-transit",
  "received",
  "refunded",
  "rejected",
] as const;
export type ReturnStatus = (typeof RETURN_STATUSES)[number];

/** A customer-initiated return request. */
export interface Return {
  id: EntityId;
  orderId: EntityId;
  customerId: EntityId;
  productIds: EntityId[];
  reason: string;
  status: ReturnStatus;
  /** Estimated margin impact in MAJOR units (negative when it erodes margin). */
  marginImpact: Money;
  requestedAt: IsoTimestamp;
  approvalId: EntityId | null;
}

/** A platform/payment fee line. */
export interface Fee {
  id: EntityId;
  orderId: EntityId | null;
  kind: "payment" | "platform" | "app" | "marketplace" | "chargeback";
  amount: Money;
  currency: CurrencyCode;
}

export const PAYOUT_STATUSES = ["expected", "pending", "paid", "failed"] as const;
export type PayoutStatus = (typeof PAYOUT_STATUSES)[number];

/** A payout from a payment provider to the brand. */
export interface Payout {
  id: EntityId;
  storeId: EntityId;
  amount: Money;
  currency: CurrencyCode;
  status: PayoutStatus;
  expectedAt: IsoTimestamp;
  paidAt: IsoTimestamp | null;
  /** Difference between expected and paid amounts (0 when reconciled). */
  variance: Money;
  /** Order ids covered by this payout. */
  orderIds: EntityId[];
}

export const ORDER_STATUSES = [
  "open",
  "fulfilled",
  "partially-refunded",
  "refunded",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/**
 * An order. Carries margin inputs and a precomputed contribution margin so
 * Finance, Commerce, Operations, CS and Activity all show the same number.
 */
export interface Order {
  id: EntityId;
  /** Human-facing order number, e.g. "#1042". */
  number: string;
  storeId: EntityId;
  customerId: EntityId;
  currency: CurrencyCode;
  placedAt: IsoTimestamp;
  status: OrderStatus;

  /** Linkage ids for cross-department consistency. */
  productIds: EntityId[];
  supplierIds: EntityId[];
  lineIds: EntityId[];
  fulfilmentId: EntityId | null;
  ticketId: EntityId | null;
  campaignId: EntityId | null;

  // --- Margin inputs (all in MAJOR units, order currency) ---
  /** Net revenue after discounts, before costs. */
  revenue: Money;
  discounts: Money;
  /** Cost of goods; null for the missing-COGS cohort. */
  cogs: Money | null;
  /** Ad spend allocated to this order by the attribution fixture. */
  allocatedAdSpend: Money;
  /** Payment + platform fees. */
  fees: Money;
  shippingCost: Money;
  refunds: Money;

  /** Precomputed contribution margin; null when inputs are too incomplete. */
  contributionMargin: Money | null;
  /** Trustworthiness of the margin given the inputs above. */
  costConfidence: Confidence;

  /** Flags driving saved views and exception surfacing. */
  isHighValue: boolean;
  isLowMargin: boolean;
}
