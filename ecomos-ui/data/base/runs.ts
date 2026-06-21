/**
 * Agent runs, tool calls, and actions. Includes the seven required trace
 * exemplars (see traces.ts) plus bulk routine runs for table volume.
 */

import type { AgentAction, AgentRun, ToolCall } from "@/data/schema";
import { AGENTS } from "@/data/base/agents";
import { hoursAgo, minutesAgo, seededInt, seededPick } from "@/data/base/_seed";

export const TOOL_CALLS: ToolCall[] = [
  { id: "tc-1", runId: "RUN-901", name: "read-order", argsSummary: "orderId: ORD-1042", status: "succeeded", durationMs: 320, resultSummary: "Order found · shipped · tracking active", retries: 0, linkedActionId: null },
  { id: "tc-2", runId: "RUN-901", name: "read-policy", argsSummary: "policy: shipping", status: "succeeded", durationMs: 180, resultSummary: "Shipping policy v3 retrieved", retries: 0, linkedActionId: null },
  { id: "tc-3", runId: "RUN-901", name: "send-reply", argsSummary: "ticketId: TKT-2003 · template: wismo-eta", status: "succeeded", durationMs: 540, resultSummary: "Reply delivered to customer", retries: 0, linkedActionId: "act-1" },
  { id: "tc-4", runId: "RUN-882", name: "send-reply", argsSummary: "ticketId: TKT-2002 · template: wismo-delay", status: "failed", durationMs: 8200, resultSummary: "Connector error: inbox send timed out", retries: 2, linkedActionId: "act-2" },
  { id: "tc-5", runId: "RUN-915", name: "propose-discount", argsSummary: "orderId: ORD-1042 · 15% goodwill", status: "succeeded", durationMs: 410, resultSummary: "Discount proposed, routed to approval apr-discount-1042", retries: 0, linkedActionId: "act-3" },
  { id: "tc-6", runId: "RUN-930", name: "read-payouts", argsSummary: "range: last-7d", status: "outcome-uncertain", durationMs: 6100, resultSummary: "Payout source returned partial page; reconciliation needed", retries: 1, linkedActionId: "act-4" },
];

const csActor = { kind: "agent" as const, ref: { id: "ag-cs", kind: "agent", label: "CS Copilot" } };
const finActor = { kind: "agent" as const, ref: { id: "ag-finance", kind: "agent", label: "Finance Analyst" } };

export const AGENT_ACTIONS: AgentAction[] = [
  { id: "act-1", runId: "RUN-901", state: "succeeded", actor: csActor, targetRef: { id: "TKT-2003", kind: "ticket", label: "TKT-2003" }, approvalId: null, resultSummary: "Sent WISMO ETA reply", badge: "success" },
  { id: "act-2", runId: "RUN-882", state: "failed", actor: csActor, targetRef: { id: "TKT-2002", kind: "ticket", label: "TKT-2002" }, approvalId: null, resultSummary: "Outbound send failed after 2 retries", badge: "critical" },
  { id: "act-3", runId: "RUN-915", state: "awaiting-approval", actor: csActor, targetRef: { id: "ORD-1042", kind: "order", label: "ORD-1042" }, approvalId: "apr-discount-1042", resultSummary: "15% goodwill discount proposed for VIP", badge: "awaiting-approval" },
  { id: "act-4", runId: "RUN-930", state: "outcome-uncertain", actor: finActor, targetRef: { id: "ORD-1188", kind: "order", label: "ORD-1188" }, approvalId: null, resultSummary: "Refund may have applied twice — reconcile before retry", badge: "outcome-uncertain" },
];

const NAMED_RUNS: AgentRun[] = [
  { id: "RUN-901", agentId: "ag-cs", trigger: "ticket-created", startedAt: minutesAgo(14), durationMs: 1240, status: "succeeded", targetEntity: { id: "TKT-2003", kind: "ticket", label: "TKT-2003" }, toolCallIds: ["tc-1", "tc-2", "tc-3"], actionIds: ["act-1"], approvalState: "none", outcome: "WISMO resolved autonomously", error: null, relatedEntityIds: ["ORD-1042"], traceId: "TR-wismo-success" },
  { id: "RUN-882", agentId: "ag-cs", trigger: "ticket-created", startedAt: hoursAgo(1.5), durationMs: 9100, status: "failed", targetEntity: { id: "TKT-2002", kind: "ticket", label: "TKT-2002" }, toolCallIds: ["tc-4"], actionIds: ["act-2"], approvalState: "none", outcome: "Outbound send failed", error: "Inbox connector timeout after 2 retries", relatedEntityIds: ["EXC-aurora"], traceId: "TR-failed-send" },
  { id: "RUN-915", agentId: "ag-cs", trigger: "ticket-escalation", startedAt: minutesAgo(19), durationMs: 880, status: "awaiting-approval", targetEntity: { id: "ORD-1042", kind: "order", label: "ORD-1042" }, toolCallIds: ["tc-5"], actionIds: ["act-3"], approvalState: "pending", outcome: "Discount proposed, awaiting approval", error: null, relatedEntityIds: ["apr-discount-1042"], traceId: "TR-discount-approval" },
  { id: "RUN-930", agentId: "ag-finance", trigger: "schedule", startedAt: minutesAgo(48), durationMs: 6400, status: "outcome-uncertain", targetEntity: { id: "ORD-1188", kind: "order", label: "ORD-1188" }, toolCallIds: ["tc-6"], actionIds: ["act-4"], approvalState: "none", outcome: "Payout reconciliation incomplete", error: null, relatedEntityIds: [], traceId: "TR-uncertain-connector" },
  { id: "RUN-940", agentId: "ag-marketing", trigger: "schedule", startedAt: hoursAgo(5), durationMs: 4200, status: "succeeded", targetEntity: { id: "CAMP-Meta-Prospecting", kind: "campaign", label: "Meta · Prospecting" }, toolCallIds: [], actionIds: [], approvalState: "none", outcome: "Flagged prospecting inefficiency with evidence", error: null, relatedEntityIds: [], traceId: "TR-finance-insight" },
  { id: "RUN-960", agentId: "ag-ops", trigger: "sla-breach", startedAt: hoursAgo(22), durationMs: 3100, status: "succeeded", targetEntity: { id: "EXC-aurora", kind: "exception", label: "Aurora delay" }, toolCallIds: [], actionIds: [], approvalState: "none", outcome: "Raised supplier-delay exception", error: null, relatedEntityIds: ["sup-aurora"], traceId: "TR-ops-incident" },
  { id: "RUN-970", agentId: "ag-brief", trigger: "schedule", startedAt: hoursAgo(2), durationMs: 5200, status: "succeeded", targetEntity: null, toolCallIds: [], actionIds: [], approvalState: "none", outcome: "Daily brief delivered to Telegram + Slack", error: null, relatedEntityIds: [], traceId: "TR-daily-brief" },
];

// Bulk routine runs for table volume (deterministic).
const TRIGGERS = ["schedule", "ticket-created", "operator-ask", "sla-breach"];
const OUTCOMES = ["Resolved autonomously", "Drafted reply for review", "Summarised metrics", "No action needed"];
const BULK_RUNS: AgentRun[] = Array.from({ length: 44 }, (_, i) => {
  const agent = AGENTS[seededInt(i + 1, 0, AGENTS.length - 1)];
  const statuses = ["succeeded", "succeeded", "succeeded", "failed", "awaiting-approval"] as const;
  const status = seededPick(i + 2, statuses);
  return {
    id: `RUN-${1000 + i}`,
    agentId: agent.id,
    trigger: seededPick(i + 3, TRIGGERS),
    startedAt: hoursAgo(seededInt(i + 4, 1, 96)),
    durationMs: seededInt(i + 5, 600, 8000),
    status,
    targetEntity: null,
    toolCallIds: [],
    actionIds: [],
    approvalState: status === "awaiting-approval" ? "pending" : "none",
    outcome: seededPick(i + 6, OUTCOMES),
    error: status === "failed" ? "Transient connector error" : null,
    relatedEntityIds: [],
    traceId: null,
  };
});

export const AGENT_RUNS: AgentRun[] = [...NAMED_RUNS, ...BULK_RUNS];

export function getRun(id: string): AgentRun | undefined {
  return AGENT_RUNS.find((r) => r.id === id);
}
export function toolCallsForRun(runId: string): ToolCall[] {
  return TOOL_CALLS.filter((t) => t.runId === runId);
}
export function actionsForRun(runId: string): AgentAction[] {
  return AGENT_ACTIONS.filter((a) => a.runId === runId);
}
