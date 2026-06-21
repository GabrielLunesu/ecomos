/**
 * Cross-cutting activity: events, alerts/insights, approvals, and tasks.
 * Approvals reference exact seeded proposals (apr-discount-1042 → ORD-1042).
 */

import type { ActivityEvent, Alert, Approval, Task } from "@/data/schema";
import { daysAgo, daysFromNow, hoursAgo, hoursFromNow, minutesAgo, seededInt, seededPick } from "@/data/base/_seed";

const ref = (id: string, kind: string, label: string) => ({ id, kind, label });

export const APPROVALS: Approval[] = [
  {
    id: "apr-discount-1042",
    proposedAction: "Apply a 15% goodwill discount code to VIP customer order ORD-1042.",
    targetRef: ref("ORD-1042", "order", "Order #1042"),
    impact: "≈ €37 margin reduction on a €248 order; retains a high-LTV customer.",
    impactAmount: -37,
    evidence: ["mem-1", "TR-discount-approval"],
    policyComparison: "Within policy: VIP delay goodwill capped at 15%.",
    requester: { kind: "agent", ref: ref("ag-cs", "agent", "CS Copilot") },
    expiresAt: hoursFromNow(6),
    history: [{ at: minutesAgo(19), actor: { kind: "agent", ref: ref("ag-cs", "agent", "CS Copilot") }, event: "proposed", note: "VIP frustrated by Aurora delay." }],
    state: "pending",
    actionType: "discount",
  },
  {
    id: "apr-refund-1188",
    proposedAction: "Refund €64 for damaged item on order ORD-1188.",
    targetRef: ref("ORD-1188", "order", "Order #1188"),
    impact: "€64 refund; €48 margin impact. Photo evidence provided.",
    impactAmount: -64,
    evidence: ["RET-001"],
    policyComparison: "Within policy: damaged-on-arrival full refund.",
    requester: { kind: "agent", ref: ref("ag-returns", "agent", "Returns Triage") },
    expiresAt: hoursFromNow(12),
    history: [{ at: daysAgo(4), actor: { kind: "agent", ref: ref("ag-returns", "agent", "Returns Triage") }, event: "proposed", note: null }],
    state: "pending",
    actionType: "refund",
  },
  {
    id: "apr-msg-aurora",
    proposedAction: "Send a proactive delay notice with revised ETA to 14 affected customers.",
    targetRef: ref("EXC-aurora", "exception", "Aurora delay"),
    impact: "Reduces inbound WISMO volume; sets expectations honestly.",
    impactAmount: null,
    evidence: ["EXC-aurora", "TR-ops-incident"],
    policyComparison: "Exceptional bulk outbound — requires lead approval.",
    requester: { kind: "agent", ref: ref("ag-ops", "agent", "Operations Monitor") },
    expiresAt: hoursFromNow(3),
    history: [{ at: hoursAgo(2), actor: { kind: "agent", ref: ref("ag-ops", "agent", "Operations Monitor") }, event: "proposed", note: "14 orders affected." }],
    state: "pending",
    actionType: "message",
  },
];

export function getApproval(id: string): Approval | undefined {
  return APPROVALS.find((a) => a.id === id);
}

export const ALERTS: Alert[] = [
  { id: "INS-margin", kind: "insight", title: "Contribution margin down 6.4% week-over-week", severity: "high", sourceActorKind: "agent", scope: "Finance", firstSeen: hoursAgo(5), lastSeen: minutesAgo(40), ownerId: "tm-lena", state: "investigating", relatedTraceId: "TR-finance-insight", evidence: ["TR-finance-insight"], recommendation: "Reduce Meta prospecting budget; backfill missing COGS for 42 orders.", relatedEntityIds: ["CAMP-Meta-Prospecting"] },
  { id: "ALR-aurora", kind: "alert", title: "Supplier delay — Aurora Supply", severity: "critical", sourceActorKind: "connector", scope: "Operations", firstSeen: hoursAgo(22), lastSeen: minutesAgo(15), ownerId: "tm-jonas", state: "new", relatedTraceId: "TR-ops-incident", evidence: ["EXC-aurora"], recommendation: "Approve proactive customer notice; escalate to supplier.", relatedEntityIds: ["EXC-aurora", "sup-aurora"] },
  { id: "ALR-meta-stale", kind: "alert", title: "Meta Ads data is 3 hours stale", severity: "medium", sourceActorKind: "system", scope: "Marketing · Meta Ads", firstSeen: hoursAgo(3), lastSeen: minutesAgo(20), ownerId: null, state: "new", relatedTraceId: null, evidence: [], recommendation: "Re-authorise the Meta connection if staleness persists.", relatedEntityIds: ["acc-meta"] },
  { id: "ALR-send-fail", kind: "alert", title: "Outbound send failed (RUN-882)", severity: "high", sourceActorKind: "agent", scope: "Customer Service", firstSeen: hoursAgo(1.5), lastSeen: hoursAgo(1.5), ownerId: "tm-priya", state: "new", relatedTraceId: "TR-failed-send", evidence: ["TR-failed-send"], recommendation: "Retry from a healthy connector or send manually.", relatedEntityIds: ["TKT-2002", "RUN-882"] },
  { id: "ALR-payout", kind: "alert", title: "Possible duplicate refund — reconcile", severity: "high", sourceActorKind: "agent", scope: "Finance", firstSeen: minutesAgo(48), lastSeen: minutesAgo(48), ownerId: "tm-lena", state: "investigating", relatedTraceId: "TR-uncertain-connector", evidence: ["TR-uncertain-connector"], recommendation: "Reconcile against payout ledger before any retry.", relatedEntityIds: ["ORD-1188"] },
];

export const TASKS: Task[] = [
  { id: "TASK-1", title: "Approve or revise the Aurora delay customer notice", status: "todo", priority: "urgent", assigneeId: "tm-priya", dueDate: hoursFromNow(2), department: "customer-service", linkedEntityRefs: [ref("apr-msg-aurora", "approval", "Bulk delay notice"), ref("EXC-aurora", "exception", "Aurora delay")], creatorKind: "agent", checklist: [{ id: "c1", label: "Review revised ETA", done: true }, { id: "c2", label: "Confirm goodwill credit", done: false }], createdAt: hoursAgo(2), completedAt: null, blockedBy: [] },
  { id: "TASK-2", title: "Reconcile potential duplicate refund on ORD-1188", status: "in-progress", priority: "high", assigneeId: "tm-lena", dueDate: hoursFromNow(20), department: "finance", linkedEntityRefs: [ref("ORD-1188", "order", "Order #1188")], creatorKind: "agent", checklist: [], createdAt: minutesAgo(48), completedAt: null, blockedBy: [] },
  { id: "TASK-3", title: "Reduce Meta prospecting budget by 30%", status: "todo", priority: "high", assigneeId: "tm-sam", dueDate: hoursFromNow(28), department: "marketing", linkedEntityRefs: [ref("CAMP-Meta-Prospecting", "campaign", "Meta · Prospecting")], creatorKind: "human", checklist: [], createdAt: hoursAgo(4), completedAt: null, blockedBy: [] },
  { id: "TASK-4", title: "Escalate Aurora Supply SLA breach to account manager", status: "blocked", priority: "high", assigneeId: "tm-jonas", dueDate: hoursFromNow(6), department: "operations", linkedEntityRefs: [ref("sup-aurora", "supplier", "Aurora Supply")], creatorKind: "human", checklist: [], createdAt: hoursAgo(20), completedAt: null, blockedBy: ["TASK-1"] },
  { id: "TASK-5", title: "Backfill missing COGS for 42 May orders", status: "todo", priority: "normal", assigneeId: "tm-lena", dueDate: daysFromNow(2), department: "finance", linkedEntityRefs: [], creatorKind: "agent", checklist: [{ id: "c3", label: "Export supplier invoices", done: false }], createdAt: hoursAgo(5), completedAt: null, blockedBy: [] },
  { id: "TASK-6", title: "Review weekly CS quality sample", status: "done", priority: "normal", assigneeId: "tm-priya", dueDate: daysAgo(1), department: "customer-service", linkedEntityRefs: [], creatorKind: "human", checklist: [], createdAt: daysAgo(3), completedAt: daysAgo(1), blockedBy: [] },
];

// Activity timeline — named cross-department events + bulk routine events.
const NAMED_EVENTS: ActivityEvent[] = [
  { id: "ev-1", actorKind: "agent", actorRef: ref("ag-ops", "agent", "Operations Monitor"), action: "raised exception", targetRef: ref("EXC-aurora", "exception", "Aurora delay"), result: "14 orders flagged late", department: "operations", storeId: null, at: hoursAgo(22) },
  { id: "ev-2", actorKind: "agent", actorRef: ref("ag-cs", "agent", "CS Copilot"), action: "resolved ticket", targetRef: ref("TKT-2003", "ticket", "TKT-2003"), result: "WISMO answered with ETA", department: "customer-service", storeId: "store-northstar", at: minutesAgo(14) },
  { id: "ev-3", actorKind: "agent", actorRef: ref("ag-cs", "agent", "CS Copilot"), action: "proposed discount", targetRef: ref("ORD-1042", "order", "Order #1042"), result: "Awaiting approval", department: "customer-service", storeId: "store-northstar", at: minutesAgo(19) },
  { id: "ev-4", actorKind: "connector", actorRef: ref("ch-meta", "connector", "Meta Ads"), action: "sync delayed", targetRef: ref("acc-meta", "account", "Northstar — Meta"), result: "Data 3h stale", department: "marketing", storeId: null, at: hoursAgo(3) },
  { id: "ev-5", actorKind: "human", actorRef: ref("tm-ava", "human", "Ava Bergström"), action: "created task", targetRef: ref("TASK-3", "task", "Reduce Meta budget"), result: "Assigned to Sam", department: "marketing", storeId: null, at: hoursAgo(4) },
  { id: "ev-6", actorKind: "agent", actorRef: ref("ag-brief", "agent", "Daily Brief"), action: "delivered brief", targetRef: null, result: "Telegram + Slack", department: null, storeId: null, at: hoursAgo(2) },
  { id: "ev-7", actorKind: "agent", actorRef: ref("ag-cs", "agent", "CS Copilot"), action: "send failed", targetRef: ref("TKT-2002", "ticket", "TKT-2002"), result: "Connector timeout", department: "customer-service", storeId: null, at: hoursAgo(1.5) },
  { id: "ev-8", actorKind: "agent", actorRef: ref("ag-finance", "agent", "Finance Analyst"), action: "flagged anomaly", targetRef: ref("ORD-1188", "order", "Order #1188"), result: "Possible duplicate refund", department: "finance", storeId: null, at: minutesAgo(48) },
];

const VERBS = ["synced", "viewed", "updated", "resolved", "assigned", "acknowledged"];
const DEPTS = ["customer-service", "finance", "marketing", "commerce", "operations"] as const;
const BULK_EVENTS: ActivityEvent[] = Array.from({ length: 36 }, (_, i) => {
  const kinds = ["human", "agent", "system", "connector"] as const;
  const kind = seededPick(i + 1, kinds);
  return {
    id: `ev-b${i}`,
    actorKind: kind,
    actorRef: ref(kind === "human" ? "tm-tomas" : "ag-copilot", kind, kind === "human" ? "Tomas Kovač" : "Operator Copilot"),
    action: seededPick(i + 2, VERBS),
    targetRef: ref(`ORD-${1001 + seededInt(i + 3, 0, 40)}`, "order", `Order`),
    result: "ok",
    department: seededPick(i + 4, DEPTS),
    storeId: i % 2 === 0 ? "store-northstar" : "store-northstar",
    at: hoursAgo(seededInt(i + 5, 1, 120)),
  };
});

export const ACTIVITY_EVENTS: ActivityEvent[] = [...NAMED_EVENTS, ...BULK_EVENTS];
