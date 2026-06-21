/**
 * Operations fixtures: fulfilment records, returns, supplier scorecards,
 * optional inventory, and the exception queue.
 *
 * The Aurora Supply delay (EXC-aurora) is the incident spine — it cross-links
 * 14 delayed orders (ORD-1300..1313) to WISMO tickets and refunds.
 */

import type {
  FulfilmentRecord,
  InventoryItem,
  OperationsException,
  ReturnRequest,
  SupplierScorecard,
} from "@/data/schema";
import { ORDERS, AURORA_DELAYED_ORDER_IDS } from "@/data/base/orders";
import { SUPPLIERS } from "@/data/base/suppliers";
import { PRODUCTS } from "@/data/base/products";
import { daysAgo, hoursAgo, money, seededFloat, seededInt, seededPick } from "@/data/base/_seed";

const CARRIERS = ["PostNL", "DHL", "DPD", "Royal Mail"];

export const FULFILMENT_RECORDS: FulfilmentRecord[] = ORDERS.map((o, i) => {
  const delayed = AURORA_DELAYED_ORDER_IDS.includes(o.id);
  const status = delayed
    ? "delayed"
    : o.status === "refunded"
      ? "returned"
      : seededPick(i, ["delivered", "delivered", "shipped", "processing"] as const);
  return {
    id: `FULREC-${o.id}`,
    orderId: o.id,
    supplierId: delayed ? "sup-aurora" : o.supplierIds[0] ?? null,
    status: status as FulfilmentRecord["status"],
    promisedAt: daysAgo(seededInt(i + 1, 1, 6)),
    shippedAt: delayed ? null : hoursAgo(seededInt(i + 2, 6, 96)),
    deliveredAt: status === "delivered" ? hoursAgo(seededInt(i + 3, 1, 60)) : null,
    trackingNumber: delayed ? null : `NS${1000000 + i}`,
    carrier: delayed ? null : seededPick(i + 4, CARRIERS),
    delayHours: delayed ? seededInt(i + 5, 36, 120) : 0,
    customerId: o.customerId,
    ticketId: o.ticketId,
    exceptionId: delayed ? "EXC-aurora" : null,
  };
});

export const RETURN_REQUESTS: ReturnRequest[] = [
  { id: "RET-001", orderId: "ORD-1188", customerId: ORDERS.find((o) => o.id === "ORD-1188")!.customerId, productIds: [PRODUCTS[2].id], reason: "Arrived damaged", status: "refunded", value: money(64), marginImpact: money(-48), ownerId: "tm-priya", approvalId: "apr-refund-1188", requestedAt: daysAgo(4) },
  { id: "RET-002", orderId: AURORA_DELAYED_ORDER_IDS[1], customerId: ORDERS.find((o) => o.id === AURORA_DELAYED_ORDER_IDS[1])!.customerId, productIds: [PRODUCTS[0].id], reason: "Did not arrive in time — no longer needed", status: "triaging", value: money(89), marginImpact: money(-71), ownerId: "tm-tomas", approvalId: null, requestedAt: hoursAgo(20) },
  { id: "RET-003", orderId: AURORA_DELAYED_ORDER_IDS[4], customerId: ORDERS.find((o) => o.id === AURORA_DELAYED_ORDER_IDS[4])!.customerId, productIds: [PRODUCTS[1].id], reason: "Changed mind", status: "requested", value: money(42), marginImpact: money(-30), ownerId: null, approvalId: null, requestedAt: hoursAgo(8) },
  { id: "RET-004", orderId: "ORD-1001", customerId: ORDERS.find((o) => o.id === "ORD-1001")!.customerId, productIds: [PRODUCTS[5].id], reason: "Wrong colour", status: "approved", value: money(58), marginImpact: money(-41), ownerId: "tm-priya", approvalId: null, requestedAt: daysAgo(2) },
];

export const SUPPLIER_SCORECARDS: SupplierScorecard[] = SUPPLIERS.map((s, i) => {
  const aurora = s.id === "sup-aurora";
  const onTimeRate = aurora ? 0.61 : money(seededFloat(i + 1, 0.86, 0.98));
  return {
    supplierId: s.id,
    onTimeRate,
    defectRate: aurora ? 0.07 : money(seededFloat(i + 2, 0.005, 0.03)),
    avgLeadTimeDays: aurora ? 11 : seededInt(i + 3, 3, 7),
    communicationScore: aurora ? 2.4 : money(seededFloat(i + 4, 3.6, 4.8)),
    openIssues: aurora ? 5 : seededInt(i + 5, 0, 2),
    grade: aurora ? "D" : onTimeRate > 0.95 ? "A" : onTimeRate > 0.9 ? "B" : "C",
    relatedProductIds: PRODUCTS.filter((p) => p.supplierIds.includes(s.id)).map((p) => p.id),
    relatedOrderIds: aurora ? AURORA_DELAYED_ORDER_IDS : [],
  };
});

export const INVENTORY_ITEMS: InventoryItem[] = PRODUCTS.slice(0, 8).map((p, i) => {
  const onHand = seededInt(i + 1, 0, 240);
  return {
    id: `INV-${p.id}`,
    productId: p.id,
    location: i % 2 === 0 ? "Rotterdam 3PL" : "Manchester 3PL",
    onHand,
    incoming: seededInt(i + 2, 0, 120),
    daysCover: onHand === 0 ? 0 : seededInt(i + 3, 4, 45),
    reorderPoint: 40,
    risk: onHand === 0 ? "stockout" : onHand < 40 ? "low" : onHand > 200 ? "overstock" : "healthy",
  };
});

export const OPERATIONS_EXCEPTIONS: OperationsException[] = [
  {
    id: "EXC-aurora",
    kind: "supplier-delay",
    severity: "critical",
    impact: "Aurora Supply shipment delayed — 14 orders late, WISMO tickets rising, refunds requested.",
    ownerId: "tm-jonas",
    ageHours: 22,
    recommendedResponse: "Proactively message affected customers with revised ETA and goodwill credit; escalate to supplier account manager.",
    traceId: "TR-ops-incident",
    relatedOrderIds: AURORA_DELAYED_ORDER_IDS,
    relatedTicketIds: ["TKT-1400", "TKT-2001", "TKT-2002"],
    status: "open",
  },
  {
    id: "EXC-missing-tracking",
    kind: "missing-tracking",
    severity: "medium",
    impact: "6 shipments dispatched without tracking numbers from PostNL feed.",
    ownerId: null,
    ageHours: 9,
    recommendedResponse: "Re-poll carrier API; backfill tracking and notify customers.",
    traceId: null,
    relatedOrderIds: ORDERS.slice(2, 8).map((o) => o.id),
    relatedTicketIds: [],
    status: "acknowledged",
  },
  {
    id: "EXC-duplicate-action",
    kind: "duplicate-action",
    severity: "high",
    impact: "Refund action returned an uncertain outcome and may have been applied twice.",
    ownerId: "tm-lena",
    ageHours: 4,
    recommendedResponse: "Reconcile against payout ledger before retrying — retry could double-refund.",
    traceId: "TR-uncertain-connector",
    relatedOrderIds: ["ORD-1188"],
    relatedTicketIds: ["TKT-1188"],
    status: "open",
  },
];
