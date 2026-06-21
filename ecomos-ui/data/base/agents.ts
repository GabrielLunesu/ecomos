/**
 * Agents, schedules, and memory fixtures.
 */

import type { Agent, MemoryEntry, Schedule } from "@/data/schema";
import { hoursAgo, hoursFromNow, minutesAgo } from "@/data/base/_seed";

export const AGENTS: Agent[] = [
  { id: "ag-copilot", name: "Operator Copilot", purpose: "Answer questions and summarise the business across departments.", status: "active", autonomyMode: "suggest", tools: ["search", "read-metrics", "read-records"], scheduleId: null, ownerId: "tm-ava", recentSuccessRate: 0.97, lastRunAt: minutesAgo(12) },
  { id: "ag-cs", name: "CS Copilot", purpose: "Resolve WISMO and routine tickets; draft replies for review.", status: "active", autonomyMode: "approve", tools: ["read-order", "read-policy", "send-reply", "propose-discount"], scheduleId: "sch-cs", ownerId: "tm-priya", recentSuccessRate: 0.91, lastRunAt: minutesAgo(3) },
  { id: "ag-finance", name: "Finance Analyst", purpose: "Reconcile payouts and flag margin anomalies with evidence.", status: "active", autonomyMode: "suggest", tools: ["read-orders", "read-payouts", "read-costs"], scheduleId: "sch-finance", ownerId: "tm-lena", recentSuccessRate: 0.95, lastRunAt: minutesAgo(48) },
  { id: "ag-marketing", name: "Marketing Researcher", purpose: "Monitor campaign efficiency and surface creative fatigue.", status: "idle", autonomyMode: "suggest", tools: ["read-campaigns", "web-research"], scheduleId: "sch-marketing", ownerId: "tm-sam", recentSuccessRate: 0.88, lastRunAt: hoursAgo(5) },
  { id: "ag-ops", name: "Operations Monitor", purpose: "Watch fulfilment SLAs and detect supplier delays.", status: "active", autonomyMode: "approve", tools: ["read-fulfilment", "read-suppliers", "notify"], scheduleId: "sch-ops", ownerId: "tm-jonas", recentSuccessRate: 0.93, lastRunAt: minutesAgo(22) },
  { id: "ag-brief", name: "Daily Brief", purpose: "Compose and deliver the morning brief to Telegram and Slack.", status: "idle", autonomyMode: "auto", tools: ["read-metrics", "compose", "deliver"], scheduleId: "sch-brief", ownerId: "tm-ava", recentSuccessRate: 0.99, lastRunAt: hoursAgo(2) },
  { id: "ag-returns", name: "Returns Triage", purpose: "Classify return requests and route refunds for approval.", status: "paused", autonomyMode: "approve", tools: ["read-returns", "propose-refund"], scheduleId: null, ownerId: "tm-priya", recentSuccessRate: 0.84, lastRunAt: hoursAgo(9) },
];

export function getAgent(id: string): Agent | undefined {
  return AGENTS.find((a) => a.id === id);
}

export const SCHEDULES: Schedule[] = [
  { id: "sch-brief", agentId: "ag-brief", job: "Daily brief", cadence: "Daily 08:00", nextRunAt: hoursFromNow(22), lastRunAt: hoursAgo(2), channel: "Telegram", scope: "Northstar Goods", status: "enabled" },
  { id: "sch-cs", agentId: "ag-cs", job: "Ticket sweep", cadence: "Every 15m", nextRunAt: hoursFromNow(0.2), lastRunAt: minutesAgo(3), channel: "in-app", scope: "Northstar Goods", status: "enabled" },
  { id: "sch-finance", agentId: "ag-finance", job: "Payout reconciliation", cadence: "Daily 07:30", nextRunAt: hoursFromNow(22.5), lastRunAt: minutesAgo(48), channel: "Slack", scope: "Northstar Goods", status: "enabled" },
  { id: "sch-marketing", agentId: "ag-marketing", job: "Campaign efficiency scan", cadence: "Every 6h", nextRunAt: hoursFromNow(1), lastRunAt: hoursAgo(5), channel: "in-app", scope: "Northstar Goods", status: "enabled" },
  { id: "sch-ops", agentId: "ag-ops", job: "Fulfilment SLA monitor", cadence: "Every 30m", nextRunAt: hoursFromNow(0.5), lastRunAt: minutesAgo(22), channel: "Slack", scope: "Northstar Goods", status: "failing" },
];

export const MEMORY_ENTRIES: MemoryEntry[] = [
  { id: "mem-1", namespace: "cs/policies", source: "Shipping policy v3", updatedAt: hoursAgo(72), access: "read", referencedRunIds: ["RUN-901", "RUN-902"] },
  { id: "mem-2", namespace: "cs/tone", source: "Tone-of-voice guide", updatedAt: hoursAgo(120), access: "read", referencedRunIds: ["RUN-901"] },
  { id: "mem-3", namespace: "marketing/learnings", source: "Creative fatigue heuristics", updatedAt: hoursAgo(36), access: "write", referencedRunIds: ["RUN-940"] },
  { id: "mem-4", namespace: "ops/suppliers", source: "Aurora Supply incident log", updatedAt: hoursAgo(20), access: "operator-owned", referencedRunIds: ["RUN-960"] },
];
