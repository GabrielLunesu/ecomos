/**
 * Command Center overview selector. Reconciles the business pulse, attention
 * queue, department summaries, trend series, and recent activity from records.
 */

import type { ScenarioId } from "@/data/scenario";
import type {
  ActivityEvent,
  Confidence,
  CurrencyCode,
  StatusVariant,
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
  scopeCurrency,
  sum,
  windowOrders,
} from "./helpers";

export type PulseMetric = {
  key: string;
  label: string;
  value: number | null;
  format: "currency" | "currency-compact" | "number" | "percent";
  currency: CurrencyCode;
  trend: Trend | null;
  invertTrend?: boolean;
  confidence?: Confidence;
  href: string;
};

export type AttentionItem = {
  id: string;
  title: string;
  detail: string;
  severity: StatusVariant;
  actorKind: "human" | "agent" | "system" | "connector" | "approval";
  href: string;
};

export type DepartmentSummary = {
  key: string;
  label: string;
  status: StatusVariant;
  headline: string;
  href: string;
};

export type CommandCenterData = {
  currency: CurrencyCode;
  pulse: PulseMetric[];
  attention: AttentionItem[];
  departments: DepartmentSummary[];
  series: DailyPoint[];
  recentActivity: ActivityEvent[];
  priorities: { id: string; title: string; href: string }[];
  isEmpty: boolean;
};

const SEVERITY_TO_VARIANT: Record<string, StatusVariant> = {
  critical: "critical",
  high: "warning",
  medium: "warning",
  low: "info",
  info: "info",
};

export function selectCommandCenter(
  scenarioId: ScenarioId,
  storeScope: StoreScope,
  period: PeriodId = "30d",
  compare = true,
): CommandCenterData {
  const data = getScenarioData(scenarioId);
  const currency = scopeCurrency(storeScope);
  const days = periodDays(period);
  const scoped = filterOrdersByStore(data.orders, storeScope);
  const orders = windowOrders(scoped, days);
  const prev = previousWindowOrders(scoped, days);

  const marginSum = (os: typeof orders) => sum(os.filter((o) => o.contributionMargin !== null).map((o) => o.contributionMargin));
  const revenue = sum(orders.map((o) => o.revenue));
  const adSpend = sum(orders.map((o) => o.allocatedAdSpend));
  const refunds = sum(orders.map((o) => o.refunds));
  const margin = marginSum(orders);
  const missingCogs = orders.some((o) => o.cogs === null);
  const marginConfidence: Confidence = data.config.cogsMissing || missingCogs ? "partial" : "estimated";

  const pulse: PulseMetric[] = [
    { key: "margin", label: "Est. contribution margin", value: orders.length ? margin : null, format: "currency", currency, trend: compareTrend(margin, marginSum(prev), compare), confidence: marginConfidence, href: "/finance" },
    { key: "revenue", label: "Revenue", value: orders.length ? revenue : null, format: "currency", currency, trend: compareTrend(revenue, sum(prev.map((o) => o.revenue)), compare), href: "/commerce/orders" },
    { key: "spend", label: "Ad spend", value: orders.length ? adSpend : null, format: "currency", currency, trend: compareTrend(adSpend, sum(prev.map((o) => o.allocatedAdSpend)), compare), invertTrend: true, href: "/finance/spend-roas" },
    { key: "orders", label: "Orders", value: orders.length, format: "number", currency, trend: compareTrend(orders.length, prev.length, compare), href: "/commerce/orders" },
    { key: "refunds", label: "Refund impact", value: orders.length ? -refunds : null, format: "currency", currency, trend: compareTrend(refunds, sum(prev.map((o) => o.refunds)), compare), invertTrend: true, href: "/operations/returns" },
  ];

  const attention: AttentionItem[] = data.alerts.map((a) => ({
    id: a.id,
    title: a.title,
    detail: a.recommendation,
    severity: SEVERITY_TO_VARIANT[a.severity] ?? "info",
    actorKind: a.sourceActorKind,
    href: a.kind === "insight" ? "/command-center/insights" : "/command-center/alerts",
  }));
  // Pending approvals are attention too.
  for (const ap of data.approvals.filter((a) => a.state === "pending")) {
    attention.push({ id: ap.id, title: ap.proposedAction, detail: ap.impact, severity: "awaiting-approval", actorKind: "approval", href: "/inbox/approvals" });
  }

  const lateOrders = data.config.incidentActive ? data.exceptions.find((e) => e.kind === "supplier-delay")?.relatedOrderIds.length ?? 0 : 0;
  const departments: DepartmentSummary[] = [
    { key: "cs", label: "Customer Service", status: data.config.incidentActive ? "critical" : data.config.minAlertRank <= 2 ? "warning" : "success", headline: data.config.incidentActive ? "WISMO volume rising from supplier delay" : "Automation rate healthy", href: "/customer-service" },
    { key: "finance", label: "Finance", status: marginConfidence === "partial" ? "warning" : "success", headline: marginConfidence === "partial" ? "Margin estimated — missing COGS for a cohort" : "Margin tracking to plan", href: "/finance" },
    { key: "marketing", label: "Marketing", status: data.config.metaStale ? "warning" : "success", headline: data.config.metaStale ? "Meta data stale; prospecting inefficient" : "ROAS stable across channels", href: "/marketing" },
    { key: "operations", label: "Operations", status: lateOrders > 0 ? "critical" : "success", headline: lateOrders > 0 ? `${lateOrders} orders late (Aurora Supply)` : "Fulfilment within SLA", href: "/operations" },
  ];

  const priorities = data.tasks
    .filter((t) => t.status !== "done")
    .slice(0, 4)
    .map((t) => ({ id: t.id, title: t.title, href: "/tasks" }));

  return {
    currency,
    pulse,
    attention: attention.slice(0, 6),
    departments,
    series: dailySeries(orders, days),
    recentActivity: [...data.activity].sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 8),
    priorities,
    isEmpty: orders.length === 0,
  };
}
