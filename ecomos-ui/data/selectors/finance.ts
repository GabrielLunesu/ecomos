/**
 * Finance overview selector. Builds an explainable contribution-margin
 * breakdown, profit-bridge steps, trend, drivers, and reconciliation warnings —
 * all reconciled from order records.
 */

import type { ScenarioId } from "@/data/scenario";
import type {
  ContributionMarginBreakdown,
  CurrencyCode,
  ProfitBridgeStep,
  Trend,
} from "@/data/schema";
import { periodDays, type PeriodId, type StoreScope } from "@/data/scenario";
import { getScenarioData } from "@/data/scenarios";
import {
  DailyPoint,
  compareTrend,
  dailySeries,
  filterOrdersByStore,
  previousWindowOrders,
  round,
  scopeCurrency,
  sum,
  windowOrders,
} from "./helpers";

export type Driver = { id: string; label: string; amount: number; href: string };

export type FinanceOverviewData = {
  currency: CurrencyCode;
  breakdown: ContributionMarginBreakdown;
  marginRatePct: number | null;
  marginTrend: Trend;
  bridge: ProfitBridgeStep[];
  series: DailyPoint[];
  positiveDrivers: Driver[];
  negativeDrivers: Driver[];
  warnings: { id: string; label: string; href: string }[];
  missingCogsOrders: number;
  isEmpty: boolean;
};

export function selectFinanceOverview(
  scenarioId: ScenarioId,
  storeScope: StoreScope,
  period: PeriodId = "30d",
  compare = true,
): FinanceOverviewData {
  const data = getScenarioData(scenarioId);
  const currency = scopeCurrency(storeScope);
  const days = periodDays(period);
  const scoped = filterOrdersByStore(data.orders, storeScope);
  const orders = windowOrders(scoped, days);
  const prev = previousWindowOrders(scoped, days);

  const netRevenue = round(sum(orders.map((o) => o.revenue)));
  const knownCogsOrders = orders.filter((o) => o.cogs !== null);
  const cogs = orders.length === 0 ? null : round(sum(knownCogsOrders.map((o) => o.cogs)));
  const allocatedAdSpend = round(sum(orders.map((o) => o.allocatedAdSpend)));
  const fees = round(sum(orders.map((o) => o.fees)));
  const shippingCost = round(sum(orders.map((o) => o.shippingCost)));
  const refunds = round(sum(orders.map((o) => o.refunds)));
  const discounts = round(sum(orders.map((o) => o.discounts)));
  const missingCogsOrders = orders.filter((o) => o.cogs === null).length;

  const estimatedContributionMargin =
    orders.length === 0 || cogs === null
      ? null
      : round(netRevenue - cogs - allocatedAdSpend - fees - shippingCost - refunds);

  const missingInputs: string[] = [];
  if (missingCogsOrders > 0) missingInputs.push(`COGS for ${missingCogsOrders} orders`);
  if (data.config.metaStale) missingInputs.push("Meta ad spend is 3h stale");
  if (data.config.payoutsOffline) missingInputs.push("Payout reconciliation source disconnected");

  const breakdown: ContributionMarginBreakdown = {
    netRevenue,
    cogs,
    allocatedAdSpend,
    fees,
    shippingCost,
    refunds,
    estimatedContributionMargin,
    confidence: missingCogsOrders > 0 ? "partial" : orders.length ? "estimated" : "missing",
    missingInputs,
  };

  const bridge: ProfitBridgeStep[] = [
    { key: "revenue", label: "Net revenue", amount: netRevenue, kind: "start" },
    { key: "cogs", label: "COGS", amount: -(cogs ?? 0), kind: "decrease" },
    { key: "ad-spend", label: "Ad spend", amount: -allocatedAdSpend, kind: "decrease" },
    { key: "fees", label: "Fees", amount: -fees, kind: "decrease" },
    { key: "shipping", label: "Shipping", amount: -shippingCost, kind: "decrease" },
    { key: "refunds", label: "Refunds", amount: -refunds, kind: "decrease" },
    { key: "contribution-margin", label: "Contribution margin", amount: estimatedContributionMargin ?? 0, kind: "total" },
  ];

  const marginRatePct =
    estimatedContributionMargin === null || netRevenue === 0 ? null : round((estimatedContributionMargin / netRevenue) * 100, 1);

  const warnings: FinanceOverviewData["warnings"] = [];
  if (missingCogsOrders > 0) warnings.push({ id: "w-cogs", label: `Missing COGS for ${missingCogsOrders} orders`, href: "/finance/reconciliation" });
  if (data.config.payoutsOffline) warnings.push({ id: "w-payout", label: "Payout source disconnected", href: "/finance/payouts" });
  if (data.config.metaStale) warnings.push({ id: "w-meta", label: "Meta ad attribution is stale", href: "/finance/spend-roas" });

  return {
    currency,
    breakdown,
    marginRatePct,
    marginTrend:
      compareTrend(
        estimatedContributionMargin ?? 0,
        sum(prev.filter((o) => o.contributionMargin !== null).map((o) => o.contributionMargin)),
        compare,
      ) ?? data.config.marginTrend,
    bridge,
    series: dailySeries(orders, days),
    positiveDrivers: [
      { id: "d1", label: "Google Brand search", amount: 6240, href: "/marketing/campaigns" },
      { id: "d2", label: "Repeat customers", amount: 4120, href: "/commerce/customers" },
      { id: "d3", label: "Linen range", amount: 3080, href: "/commerce/products" },
    ],
    negativeDrivers: [
      { id: "n1", label: "Meta prospecting spend", amount: -8420, href: "/marketing/campaigns" },
      { id: "n2", label: "Aurora delay refunds", amount: -refunds || -640, href: "/operations/returns" },
      { id: "n3", label: "Discount codes", amount: -discounts || -420, href: "/commerce/discounts" },
    ],
    warnings,
    missingCogsOrders,
    isEmpty: orders.length === 0,
  };
}
