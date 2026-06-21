/**
 * Customer Service overview selector. Attention summary, volume + automation
 * rate, response/resolution proxies, topic distribution, and rep workload —
 * derived from ticket records.
 */

import type { ScenarioId } from "@/data/scenario";
import type { StatusVariant, Ticket } from "@/data/schema";
import type { StoreScope } from "@/data/scenario";
import { getScenarioData } from "@/data/scenarios";

export type CsTopic = { topic: string; count: number };
export type CsRiskItem = { id: string; subject: string; reason: string; severity: StatusVariant; href: string };
export type CsWorkloadRow = { ownerLabel: string; isAgent: boolean; open: number };

export type CsOverviewData = {
  totalTickets: number;
  open: number;
  escalations: number;
  overdue: number;
  failedSends: number;
  pendingApprovals: number;
  automationRatePct: number;
  autonomousResolved: number;
  avgFirstResponseMins: number;
  avgResolutionHours: number;
  reopenRatePct: number;
  negativeSentimentPct: number;
  topics: CsTopic[];
  riskItems: CsRiskItem[];
  workload: CsWorkloadRow[];
  isEmpty: boolean;
};

function isOverdue(t: Ticket): boolean {
  return t.slaDueAt < "2026-06-20T09:00:00.000+02:00" && t.status !== "resolved";
}

export function selectCsOverview(scenarioId: ScenarioId, _storeScope: StoreScope): CsOverviewData {
  const data = getScenarioData(scenarioId);
  const tickets = data.tickets;
  const total = tickets.length;

  if (total === 0) {
    return {
      totalTickets: 0, open: 0, escalations: 0, overdue: 0, failedSends: 0, pendingApprovals: 0,
      automationRatePct: 0, autonomousResolved: 0, avgFirstResponseMins: 0, avgResolutionHours: 0,
      reopenRatePct: 0, negativeSentimentPct: 0, topics: [], riskItems: [], workload: [], isEmpty: true,
    };
  }

  const open = tickets.filter((t) => t.status !== "resolved").length;
  const escalations = tickets.filter((t) => t.priority === "urgent" || t.priority === "high").length;
  const overdue = tickets.filter(isOverdue).length;
  const failedSends = tickets.filter((t) => t.status === "failed").length;
  const autoOwned = tickets.filter((t) => t.owner.kind === "agent").length;
  const autonomousResolved = tickets.filter((t) => t.owner.kind === "agent" && t.status === "resolved").length;
  const reopened = tickets.filter((t) => t.status === "reopened").length;
  const negative = tickets.filter((t) => t.sentiment === "negative").length;

  const topicCounts = new Map<string, number>();
  for (const t of tickets) topicCounts.set(t.topic, (topicCounts.get(t.topic) ?? 0) + 1);
  const topics = [...topicCounts.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);

  const riskItems: CsRiskItem[] = tickets
    .filter((t) => t.status === "failed" || t.status === "reopened" || t.sentiment === "negative")
    .slice(0, 5)
    .map((t) => ({
      id: t.id,
      subject: t.subject,
      reason: t.status === "failed" ? "Outbound send failed" : t.status === "reopened" ? "Reopened" : "Negative sentiment",
      severity: t.status === "failed" ? "critical" : t.status === "reopened" ? "warning" : "warning",
      href: "/customer-service/tickets",
    }));

  const workloadMap = new Map<string, { isAgent: boolean; open: number }>();
  for (const t of tickets) {
    if (t.status === "resolved") continue;
    const label = t.owner.ref?.label ?? (t.owner.kind === "agent" ? "Unassigned agent" : "Unassigned");
    const entry = workloadMap.get(label) ?? { isAgent: t.owner.kind === "agent", open: 0 };
    entry.open += 1;
    workloadMap.set(label, entry);
  }
  const workload = [...workloadMap.entries()]
    .map(([ownerLabel, v]) => ({ ownerLabel, isAgent: v.isAgent, open: v.open }))
    .sort((a, b) => b.open - a.open)
    .slice(0, 6);

  return {
    totalTickets: total,
    open,
    escalations,
    overdue,
    failedSends,
    pendingApprovals: data.approvals.filter((a) => a.state === "pending" && a.actionType !== "config").length,
    automationRatePct: Math.round((autoOwned / total) * 100),
    autonomousResolved,
    avgFirstResponseMins: data.config.incidentActive ? 42 : 18,
    avgResolutionHours: data.config.incidentActive ? 9.4 : 4.1,
    reopenRatePct: Math.round((reopened / total) * 100),
    negativeSentimentPct: Math.round((negative / total) * 100),
    topics,
    riskItems,
    workload,
    isEmpty: false,
  };
}
