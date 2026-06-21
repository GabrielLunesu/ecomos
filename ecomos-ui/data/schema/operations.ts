/**
 * Operations domain: fulfilment records, returns, supplier scorecards,
 * optional inventory, and the operational exception queue.
 *
 * Pages: /operations, /operations/fulfilment, /returns, /suppliers,
 * /inventory (optional module), /operations/exceptions.
 */

import type {
  EntityId,
  IsoTimestamp,
  Money,
  Severity,
} from "./shared";
import type { FulfilmentStatus } from "./commerce";

/** Fulfilment timeline row for the operations fulfilment table. */
export interface FulfilmentRecord {
  id: EntityId;
  orderId: EntityId;
  supplierId: EntityId | null;
  status: FulfilmentStatus;
  promisedAt: IsoTimestamp | null;
  shippedAt: IsoTimestamp | null;
  deliveredAt: IsoTimestamp | null;
  trackingNumber: string | null;
  carrier: string | null;
  /** Delay vs promised date, in hours (0 when on time, null when not computable). */
  delayHours: number | null;
  customerId: EntityId;
  ticketId: EntityId | null;
  /** Exception driving attention, if any. */
  exceptionId: EntityId | null;
}

export const RETURN_REQUEST_STATUSES = [
  "requested",
  "triaging",
  "approved",
  "in-transit",
  "received",
  "refunded",
  "rejected",
] as const;
export type ReturnRequestStatus = (typeof RETURN_REQUEST_STATUSES)[number];

/** A return request in the operations triage flow. */
export interface ReturnRequest {
  id: EntityId;
  orderId: EntityId;
  customerId: EntityId;
  productIds: EntityId[];
  reason: string;
  status: ReturnRequestStatus;
  value: Money;
  /** Margin impact (negative erodes margin). */
  marginImpact: Money;
  ownerId: EntityId | null;
  approvalId: EntityId | null;
  requestedAt: IsoTimestamp;
}

/** A supplier scorecard derived from delivery / defect / cost / comms data. */
export interface SupplierScorecard {
  supplierId: EntityId;
  /** On-time delivery rate (0–1). */
  onTimeRate: number;
  defectRate: number;
  /** Average lead time in days. */
  avgLeadTimeDays: number;
  communicationScore: number;
  openIssues: number;
  /** Overall grade for the RankedList. */
  grade: "A" | "B" | "C" | "D";
  relatedProductIds: EntityId[];
  relatedOrderIds: EntityId[];
}

/** Optional inventory item (hidden by default via brand.inventoryEnabled). */
export interface InventoryItem {
  id: EntityId;
  productId: EntityId;
  location: string;
  onHand: number;
  incoming: number;
  /** Estimated days of cover at current sell-through. */
  daysCover: number | null;
  reorderPoint: number;
  risk: "healthy" | "low" | "stockout" | "overstock";
}

export const OPERATIONS_EXCEPTION_KINDS = [
  "late-fulfilment",
  "missing-tracking",
  "failed-update",
  "duplicate-action",
  "supplier-delay",
  "return-anomaly",
  "connector-failure",
] as const;
export type OperationsExceptionKind = (typeof OPERATIONS_EXCEPTION_KINDS)[number];

/** An item in the central operational exception queue. */
export interface OperationsException {
  id: EntityId;
  kind: OperationsExceptionKind;
  severity: Severity;
  /** Human-readable impact summary, e.g. "14 orders delayed, rising WISMO". */
  impact: string;
  ownerId: EntityId | null;
  ageHours: number;
  recommendedResponse: string;
  traceId: EntityId | null;
  relatedOrderIds: EntityId[];
  relatedTicketIds: EntityId[];
  status: "open" | "acknowledged" | "resolved";
}
