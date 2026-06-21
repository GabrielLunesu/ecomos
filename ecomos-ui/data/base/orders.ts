/**
 * Orders + order economics: lines, fulfilments, discounts, refunds, fees, payouts.
 *
 * ~146 orders across ~180 days (ending 2026-06-20). Each order carries the full
 * contribution-margin input set so Finance/Commerce/Operations/CS/Activity all
 * read the same numbers. `contributionMargin` is PRECOMPUTED here:
 *
 *   contributionMargin = revenue - (cogs ?? 0) - allocatedAdSpend - fees - shippingCost - refunds
 *
 * (null when cogs is null — represented at the scenario layer for the
 *  missing-COGS cohort; base data has confirmed COGS everywhere.)
 *
 * Pinned story orders:
 *  - ORD-1042  VIP Anna, €248, high value, discount-approval target.
 *  - ORD-1188  Marek, refunded, links to TKT-1188.
 *  - ORD-1300..1313  Aurora Supply delayed cohort (14 orders) for the incident.
 */

import type {
  Order,
  OrderLine,
  Fulfilment,
  Discount,
  Refund,
  Fee,
  Payout,
  CurrencyCode,
  FulfilmentStatus,
} from "@/data/schema";
import { CUSTOMERS } from "./customers";
import { PRODUCTS, getProduct } from "./products";
import { daysAgo, hoursAgo, seededInt, seededFloat, seededPick, money } from "./_seed";

const HOME_PRODUCTS = PRODUCTS.filter((p) => p.storeId === "store-northstar" && p.status !== "draft");
const LIVING_PRODUCTS = PRODUCTS.filter((p) => p.storeId === "store-northstar");

type Built = {
  orders: Order[];
  lines: OrderLine[];
  fulfilments: Fulfilment[];
  refunds: Refund[];
  fees: Fee[];
};

/** Compute contribution margin from inputs (cogs null → margin null). */
function computeMargin(o: {
  revenue: number;
  cogs: number | null;
  allocatedAdSpend: number;
  fees: number;
  shippingCost: number;
  refunds: number;
}): number | null {
  if (o.cogs === null) return null;
  return money(o.revenue - o.cogs - o.allocatedAdSpend - o.fees - o.shippingCost - o.refunds);
}

const CAMPAIGN_IDS = ["camp-meta-prospecting", "camp-meta-retarget", "camp-google-brand", "camp-google-shopping", null];

/** Aurora-delayed incident cohort order ids (14 orders). */
export const AURORA_DELAYED_ORDER_IDS = Array.from({ length: 14 }, (_, i) => `ORD-${1300 + i}`);

function buildAll(): Built {
  const orders: Order[] = [];
  const lines: OrderLine[] = [];
  const fulfilments: Fulfilment[] = [];
  const refunds: Refund[] = [];
  const fees: Fee[] = [];

  // ---- Helper to assemble one order from chosen products ----
  function assemble(opts: {
    id: string;
    num: string;
    storeId: "store-northstar";
    customerId: string;
    placedDaysAgo: number;
    items: { productId: string; quantity: number; discountPerUnit?: number }[];
    status: Order["status"];
    fulfilmentStatus: FulfilmentStatus;
    supplierId: string | null;
    delayHours?: number;
    missingTracking?: boolean;
    ticketId?: string | null;
    campaignId?: string | null;
    refundAmount?: number;
    adSpend?: number;
    exceptionDelayed?: boolean;
  }) {
    const currency: CurrencyCode = "EUR";
    const lineIds: string[] = [];
    const productIds: string[] = [];
    const supplierIds = new Set<string>();
    let gross = 0;
    let discountTotal = 0;
    let cogsTotal = 0;

    opts.items.forEach((item, idx) => {
      const p = getProduct(item.productId)!;
      const lineId = `${opts.id}-L${idx + 1}`;
      const disc = (item.discountPerUnit ?? 0) * item.quantity;
      lines.push({
        id: lineId,
        orderId: opts.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: p.price,
        unitCost: p.unitCost,
        discount: money(disc),
      });
      lineIds.push(lineId);
      productIds.push(item.productId);
      p.supplierIds.forEach((s) => supplierIds.add(s));
      gross += p.price * item.quantity;
      discountTotal += disc;
      cogsTotal += (p.unitCost ?? 0) * item.quantity;
    });

    const revenue = money(gross - discountTotal);
    const fee = money(revenue * 0.029 + 0.3); // payment + platform
    const shippingCost = money(seededFloat(orders.length + 31, 4.5, 12.5));
    const adSpend = money(opts.adSpend ?? (opts.campaignId ? seededFloat(orders.length + 41, 3, 24) : 0));
    const refundAmount = money(opts.refundAmount ?? 0);
    const cogs = money(cogsTotal);

    const order: Order = {
      id: opts.id,
      number: opts.num,
      storeId: opts.storeId,
      customerId: opts.customerId,
      currency,
      placedAt: daysAgo(opts.placedDaysAgo),
      status: opts.status,
      productIds,
      supplierIds: [...supplierIds],
      lineIds,
      fulfilmentId: `FUL-${opts.id}`,
      ticketId: opts.ticketId ?? null,
      campaignId: opts.campaignId ?? null,
      revenue,
      discounts: money(discountTotal),
      cogs,
      allocatedAdSpend: adSpend,
      fees: fee,
      shippingCost,
      refunds: refundAmount,
      contributionMargin: computeMargin({ revenue, cogs, allocatedAdSpend: adSpend, fees: fee, shippingCost, refunds: refundAmount }),
      costConfidence: "confirmed",
      isHighValue: revenue >= 200,
      isLowMargin: false,
    };
    order.isLowMargin =
      order.contributionMargin !== null && revenue > 0 && order.contributionMargin / revenue < 0.15;
    orders.push(order);

    // Fulfilment record
    const promisedDays = opts.placedDaysAgo - 3;
    const shipped = opts.fulfilmentStatus !== "unfulfilled" && opts.fulfilmentStatus !== "processing";
    fulfilments.push({
      id: `FUL-${opts.id}`,
      orderId: opts.id,
      supplierId: opts.supplierId,
      status: opts.fulfilmentStatus,
      promisedAt: daysAgo(Math.max(promisedDays, 0)),
      shippedAt: shipped ? daysAgo(Math.max(opts.placedDaysAgo - 1, 0)) : null,
      deliveredAt: opts.fulfilmentStatus === "delivered" ? daysAgo(Math.max(opts.placedDaysAgo - 2, 0)) : null,
      trackingNumber: opts.missingTracking ? null : `TRK${opts.id.replace(/\D/g, "")}`,
      carrier: opts.missingTracking ? null : seededPick(orders.length + 5, ["PostNL", "DHL", "DPD", "Royal Mail"]),
    });

    // Refund record
    if (refundAmount > 0) {
      refunds.push({
        id: `REF-${opts.id}`,
        orderId: opts.id,
        amount: refundAmount,
        reason: opts.exceptionDelayed ? "Late delivery — goodwill refund" : "Customer return",
        issuedAt: daysAgo(Math.max(opts.placedDaysAgo - 4, 0)),
        approvalId: opts.id === "ORD-1188" ? "apr-refund-1188" : null,
      });
    }

    // Fee record
    fees.push({ id: `FEE-${opts.id}`, orderId: opts.id, kind: "payment", amount: fee, currency });
  }

  // ---------- Pinned story orders ----------
  // ORD-1042 — VIP Anna, €248, high value (target of discount approval apr-discount-1042)
  assemble({
    id: "ORD-1042",
    num: "#1042",
    storeId: "store-northstar",
    customerId: "cust-vip-anna",
    placedDaysAgo: 2,
    items: [
      { productId: "prod-jute-rug", quantity: 1 }, // 159
      { productId: "prod-table-lamp", quantity: 1 }, // 98 -> 257; nudge with discount to 248
      { productId: "prod-candle-set", quantity: 0 + 1, discountPerUnit: 9 },
    ],
    status: "open",
    fulfilmentStatus: "processing",
    supplierId: "sup-verdant",
    ticketId: null,
    campaignId: "camp-meta-retarget",
    adSpend: 18,
  });

  // ORD-1188 — Marek, refunded, links to TKT-1188
  assemble({
    id: "ORD-1188",
    num: "#1188",
    storeId: "store-northstar",
    customerId: "cust-refund-marek",
    placedDaysAgo: 9,
    items: [
      { productId: "prod-wool-blanket", quantity: 1 }, // 139
      { productId: "prod-cushion-cover", quantity: 1 }, // 34 -> 173
    ],
    status: "refunded",
    fulfilmentStatus: "returned",
    supplierId: "sup-aurora",
    ticketId: "TKT-1188",
    campaignId: null,
    refundAmount: 173.0,
  });

  // ---------- Aurora incident cohort (14 delayed orders) ----------
  AURORA_DELAYED_ORDER_IDS.forEach((id, i) => {
    const customer = CUSTOMERS[(i + 3) % 20]; // home-store customers
    assemble({
      id,
      num: `#${1300 + i}`,
      storeId: "store-northstar",
      customerId: customer.id,
      placedDaysAgo: 6 + (i % 4),
      items: [
        { productId: "prod-linen-throw", quantity: 1 },
        ...(i % 3 === 0 ? [{ productId: "prod-cushion-cover", quantity: 2 }] : []),
      ],
      status: i % 5 === 0 ? "partially-refunded" : "open",
      fulfilmentStatus: "delayed",
      supplierId: "sup-aurora",
      delayHours: 72 + i * 6,
      ticketId: i < 9 ? `TKT-${1400 + i}` : null, // first 9 spawn WISMO tickets
      campaignId: "camp-meta-prospecting",
      adSpend: 9,
      refundAmount: i % 5 === 0 ? 17.0 : 0,
      exceptionDelayed: true,
    });
  });

  // ---------- Bulk ordinary orders (ORD-1001..) ----------
  // Spread across ~180 days so 7/30/90-day windows AND their previous periods
  // are all populated → realistic "vs prev period" deltas.
  const ORDINARY_COUNT = 130;
  for (let i = 0; i < ORDINARY_COUNT; i++) {
    const idNum = 1001 + i;
    const id = `ORD-${idNum}`;
    if (id === "ORD-1042") continue; // reserved above (won't collide; 1042 in range)
    const isLiving = seededInt(i + 101, 0, 4) === 0; // ~1 in 5 to Living
    const storeId = isLiving ? "store-northstar" : "store-northstar";
    const pool = isLiving ? LIVING_PRODUCTS : HOME_PRODUCTS;
    const custPool = CUSTOMERS.filter((c) => c.storeId === storeId && c.ordersCount > 0);
    const customer = custPool[seededInt(i + 211, 0, custPool.length - 1)];

    const itemCount = seededInt(i + 53, 1, 3);
    const items = Array.from({ length: itemCount }, (_, k) => {
      const p = seededPick(i * 7 + k + 313, pool);
      return { productId: p.id, quantity: seededInt(i * 11 + k + 17, 1, 2) };
    });

    const placedDaysAgo = seededInt(i + 67, 0, 179); // ~6 months of history
    const roll = seededFloat(i + 401, 0, 1);
    let status: Order["status"] = "fulfilled";
    let fulfilmentStatus: FulfilmentStatus = "delivered";
    let refundAmount = 0;
    let missingTracking = false;
    let delayHours: number | undefined;

    if (roll < 0.08) {
      status = "refunded";
      fulfilmentStatus = "returned";
      refundAmount = -1; // sentinel; set after revenue known below via re-derive
    } else if (roll < 0.18) {
      status = "open";
      fulfilmentStatus = seededInt(i + 71, 0, 1) === 0 ? "processing" : "shipped";
    } else if (roll < 0.24) {
      fulfilmentStatus = "delayed";
      delayHours = 36 + (i % 5) * 12;
      missingTracking = seededInt(i + 73, 0, 1) === 0;
    } else if (roll < 0.27) {
      fulfilmentStatus = "shipped";
      missingTracking = true;
    }

    const supplierId = getProduct(items[0].productId)!.supplierIds[0] ?? null;
    const campaignId = seededPick(i + 503, CAMPAIGN_IDS);

    // For refunds we need revenue; do a quick pre-calc of gross-discount.
    let preRevenue = 0;
    for (const it of items) preRevenue += getProduct(it.productId)!.price * it.quantity;
    if (refundAmount === -1) refundAmount = money(preRevenue * 0.5);

    assemble({
      id,
      num: `#${idNum}`,
      storeId,
      customerId: customer.id,
      placedDaysAgo,
      items,
      status,
      fulfilmentStatus,
      supplierId,
      delayHours,
      missingTracking,
      ticketId: null,
      campaignId,
      refundAmount: refundAmount > 0 ? refundAmount : 0,
    });
  }

  return { orders, lines, fulfilments, refunds, fees };
}

const BUILT = buildAll();

export const ORDERS: Order[] = BUILT.orders;
export const ORDER_LINES: OrderLine[] = BUILT.lines;
export const FULFILMENTS: Fulfilment[] = BUILT.fulfilments;
export const REFUNDS: Refund[] = BUILT.refunds;
export const FEES: Fee[] = BUILT.fees;

const ORDER_INDEX = new Map(ORDERS.map((o) => [o.id, o]));
export function getOrder(id: string): Order | undefined {
  return ORDER_INDEX.get(id);
}

// ---- Discounts (codes + the agent-proposed one tied to ORD-1042 approval) ----
export const DISCOUNTS: Discount[] = [
  { id: "disc-welcome10", code: "WELCOME10", source: "human", kind: "percentage", value: 10, amountApplied: 1240.5, status: "active", approvalId: null },
  { id: "disc-summer", code: "SUMMER15", source: "campaign", kind: "percentage", value: 15, amountApplied: 880.0, status: "active", approvalId: null },
  { id: "disc-vip-1042", code: "VIPTHANKS", source: "agent", kind: "fixed", value: 25, amountApplied: 25.0, status: "scheduled", approvalId: "apr-discount-1042" },
  { id: "disc-clearance", code: "CLEAR20", source: "human", kind: "percentage", value: 20, amountApplied: 410.0, status: "expired", approvalId: null },
];

// ---- Payouts (incl. a variance/mismatch example) ----
export const PAYOUTS: Payout[] = [
  {
    id: "pay-home-2026-06-18",
    storeId: "store-northstar",
    amount: 8420.5,
    currency: "EUR",
    status: "paid",
    expectedAt: daysAgo(3),
    paidAt: daysAgo(2),
    variance: 0,
    orderIds: ORDERS.filter((o) => o.storeId === "store-northstar").slice(0, 20).map((o) => o.id),
  },
  {
    id: "pay-home-2026-06-19",
    storeId: "store-northstar",
    amount: 6190.0,
    currency: "EUR",
    status: "pending",
    expectedAt: hoursAgo(20),
    paidAt: null,
    variance: -142.5, // mismatch example
    orderIds: ORDERS.filter((o) => o.storeId === "store-northstar").slice(20, 38).map((o) => o.id),
  },
  {
    id: "pay-northstar-2026-06-16",
    storeId: "store-northstar",
    amount: 3110.0,
    currency: "EUR",
    status: "paid",
    expectedAt: daysAgo(5),
    paidAt: daysAgo(4),
    variance: 0,
    orderIds: ORDERS.filter((o) => o.storeId === "store-northstar").slice(40, 54).map((o) => o.id),
  },
  {
    id: "pay-home-expected",
    storeId: "store-northstar",
    amount: 4980.0,
    currency: "EUR",
    status: "expected",
    expectedAt: daysAgo(-1),
    paidAt: null,
    variance: 0,
    orderIds: ORDERS.filter((o) => o.storeId === "store-northstar").slice(38, 52).map((o) => o.id),
  },
];
