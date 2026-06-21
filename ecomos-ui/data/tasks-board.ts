/**
 * Task-board fixtures (adapted from the tasks-inspo Linear-style board).
 * Self-contained from the analytical seed layer: this drives the /tasks board,
 * which supports drag-between-columns, per-person scope, and sub-todos.
 *
 * Deterministic: no wall clock / randomness at module scope.
 */

import { TEAM } from "@/data/base/brand";

export const BOARD_STATUS_IDS = [
  "backlog",
  "to-do",
  "in-progress",
  "technical-review",
  "paused",
  "completed",
] as const;
export type BoardStatusId = (typeof BOARD_STATUS_IDS)[number];

export type BoardPriority = "no-priority" | "low" | "medium" | "high" | "urgent";

export type BoardLabel = { id: string; name: string; className: string };

export const BOARD_LABELS: BoardLabel[] = [
  { id: "finance", name: "Finance", className: "bg-info-surface text-info-foreground" },
  { id: "cs", name: "Customer Service", className: "bg-agent-surface text-agent-foreground" },
  { id: "marketing", name: "Marketing", className: "bg-accent-pink/15 text-accent-pink" },
  { id: "operations", name: "Operations", className: "bg-warning-surface text-warning-foreground" },
  { id: "growth", name: "Growth", className: "bg-success-surface text-success-foreground" },
];

export type BoardPerson = { id: string; name: string; initials: string };

/** People are the real team; no remote avatars (initials only). */
export const BOARD_PEOPLE: BoardPerson[] = TEAM.map((m) => ({ id: m.id, name: m.name, initials: m.initials }));

export type SubTodo = { id: string; title: string; done: boolean };

export type Attachment = {
  id: string;
  name: string;
  kind: "pdf" | "image" | "doc" | "sheet" | "link";
  meta: string;
};

export type TimelineEvent = {
  id: string;
  kind: "created" | "status" | "comment" | "assignee" | "subtask" | "attachment";
  text: string;
  actorInitials: string;
  at: string;
};

export type BoardTask = {
  id: string;
  title: string;
  description: string;
  statusId: BoardStatusId;
  assigneeIds: string[];
  labelIds: string[];
  priority: BoardPriority;
  dueDate: string | null;
  comments: number;
  links: number;
  subtodos: SubTodo[];
  attachments: Attachment[];
  timeline: TimelineEvent[];
};

const sub = (id: string, title: string, done = false): SubTodo => ({ id, title, done });

export const BOARD_TASKS: BoardTask[] = [
  {
    id: "NT-1",
    title: "Aurora Supply delay — customer comms plan",
    description: "Draft and approve the proactive delay notice with revised ETA for the 14 affected orders.",
    statusId: "in-progress",
    assigneeIds: ["tm-priya", "tm-jonas"],
    labelIds: ["operations", "cs"],
    priority: "urgent",
    dueDate: "Jun 22",
    comments: 6,
    links: 3,
    subtodos: [
      sub("s1", "Confirm revised ETA from supplier", true),
      sub("s2", "Draft customer message", true),
      sub("s3", "Decide goodwill credit amount", false),
      sub("s4", "Get lead approval", false),
    ],
    attachments: [
      { id: "a1", name: "aurora-eta-email.pdf", kind: "pdf", meta: "212 KB" },
      { id: "a2", name: "affected-orders.csv", kind: "sheet", meta: "14 rows" },
    ],
    timeline: [
      { id: "t1", kind: "created", text: "created this task", actorInitials: "JM", at: "2 days ago" },
      { id: "t2", kind: "assignee", text: "assigned Priya Nair", actorInitials: "JM", at: "2 days ago" },
      { id: "t3", kind: "status", text: "moved to In Progress", actorInitials: "PN", at: "20 hours ago" },
    ],
  },
  {
    id: "NT-2",
    title: "Backfill missing COGS for 42 orders",
    description: "Export supplier invoices and attach unit costs so contribution margin is no longer partial.",
    statusId: "to-do",
    assigneeIds: ["tm-lena"],
    labelIds: ["finance"],
    priority: "high",
    dueDate: "Jun 23",
    comments: 2,
    links: 1,
    subtodos: [
      sub("s1", "Export May supplier invoices", false),
      sub("s2", "Map invoices → SKUs", false),
      sub("s3", "Upload cost table", false),
    ],
    attachments: [],
    timeline: [{ id: "t1", kind: "created", text: "created this task", actorInitials: "AB", at: "5 hours ago" }],
  },
  {
    id: "NT-3",
    title: "Reduce Meta prospecting budget by 30%",
    description: "Prospecting ROAS is 1.9× and dragging margin. Cut budget and shift to retargeting.",
    statusId: "to-do",
    assigneeIds: ["tm-sam"],
    labelIds: ["marketing", "growth"],
    priority: "high",
    dueDate: "Jun 24",
    comments: 4,
    links: 2,
    subtodos: [sub("s1", "Lower daily cap to €120", false), sub("s2", "Reallocate to retargeting", false)],
    attachments: [{ id: "a1", name: "meta-efficiency.png", kind: "image", meta: "PNG" }],
    timeline: [{ id: "t1", kind: "created", text: "created this task", actorInitials: "AB", at: "4 hours ago" }],
  },
  {
    id: "NT-4",
    title: "Reconcile possible duplicate refund (ORD-1188)",
    description: "Payout source returned a partial page; a refund may have applied twice. Reconcile before any retry.",
    statusId: "technical-review",
    assigneeIds: ["tm-lena"],
    labelIds: ["finance"],
    priority: "urgent",
    dueDate: "Jun 21",
    comments: 8,
    links: 1,
    subtodos: [
      sub("s1", "Pull payout ledger", true),
      sub("s2", "Match refund REF-ORD-1188", true),
      sub("s3", "Confirm single refund", false),
    ],
    attachments: [{ id: "a1", name: "payout-ledger.csv", kind: "sheet", meta: "7d" }],
    timeline: [
      { id: "t1", kind: "created", text: "created this task", actorInitials: "AB", at: "yesterday" },
      { id: "t2", kind: "status", text: "moved to Technical Review", actorInitials: "LF", at: "3 hours ago" },
    ],
  },
  {
    id: "NT-5",
    title: "Weekly CS quality sample review",
    description: "Review the sampled conversations, flag grounding issues, and log verdicts.",
    statusId: "completed",
    assigneeIds: ["tm-priya"],
    labelIds: ["cs"],
    priority: "medium",
    dueDate: "Jun 19",
    comments: 1,
    links: 0,
    subtodos: [sub("s1", "Sample 20 conversations", true), sub("s2", "Log verdicts", true)],
    attachments: [],
    timeline: [{ id: "t1", kind: "status", text: "marked Completed", actorInitials: "PN", at: "yesterday" }],
  },
  {
    id: "NT-6",
    title: "Escalate Aurora SLA breach to account manager",
    description: "Supplier on-time rate dropped to 61%. Escalate and request remediation.",
    statusId: "paused",
    assigneeIds: ["tm-jonas"],
    labelIds: ["operations"],
    priority: "high",
    dueDate: "Jun 25",
    comments: 3,
    links: 4,
    subtodos: [sub("s1", "Send escalation email", false), sub("s2", "Schedule call", false)],
    attachments: [],
    timeline: [
      { id: "t1", kind: "created", text: "created this task", actorInitials: "JM", at: "yesterday" },
      { id: "t2", kind: "comment", text: "blocked on customer comms (NT-1)", actorInitials: "JM", at: "8 hours ago" },
    ],
  },
  {
    id: "NT-7",
    title: "Refresh shipping policy for EU/UK split",
    description: "Update the shipping policy doc with revised carrier lead times.",
    statusId: "backlog",
    assigneeIds: [],
    labelIds: ["cs", "operations"],
    priority: "low",
    dueDate: "Jul 1",
    comments: 0,
    links: 2,
    subtodos: [],
    attachments: [{ id: "a1", name: "shipping-policy-v3.pdf", kind: "pdf", meta: "1.1 MB" }],
    timeline: [{ id: "t1", kind: "created", text: "created this task", actorInitials: "PN", at: "3 days ago" }],
  },
  {
    id: "NT-8",
    title: "Creative refresh: social-proof angle",
    description: "Produce three social-proof creative variants based on the research teardown.",
    statusId: "backlog",
    assigneeIds: ["tm-sam"],
    labelIds: ["marketing"],
    priority: "medium",
    dueDate: "Jul 3",
    comments: 1,
    links: 5,
    subtodos: [],
    attachments: [],
    timeline: [{ id: "t1", kind: "created", text: "created this task", actorInitials: "SO", at: "3 days ago" }],
  },
  {
    id: "NT-9",
    title: "Investigate failed outbound send (RUN-882)",
    description: "Inbox connector timed out twice. Add retry on a healthy connector and verify delivery.",
    statusId: "in-progress",
    assigneeIds: ["tm-tomas", "tm-priya"],
    labelIds: ["cs"],
    priority: "high",
    dueDate: "Jun 22",
    comments: 5,
    links: 1,
    subtodos: [sub("s1", "Reproduce timeout", true), sub("s2", "Add fallback connector", false)],
    attachments: [],
    timeline: [{ id: "t1", kind: "created", text: "created this task", actorInitials: "PN", at: "yesterday" }],
  },
  {
    id: "NT-10",
    title: "Quarterly margin review deck",
    description: "Assemble the contribution-margin review with drivers and reconciliation notes.",
    statusId: "to-do",
    assigneeIds: ["tm-lena", "tm-ava"],
    labelIds: ["finance"],
    priority: "medium",
    dueDate: "Jun 30",
    comments: 2,
    links: 0,
    subtodos: [sub("s1", "Pull margin trend", false), sub("s2", "Driver analysis", false), sub("s3", "Draft slides", false)],
    attachments: [],
    timeline: [{ id: "t1", kind: "created", text: "created this task", actorInitials: "AB", at: "2 days ago" }],
  },
  {
    id: "NT-11",
    title: "Returns triage automation rules",
    description: "Define routing rules so damaged-on-arrival returns auto-route to refund approval.",
    statusId: "technical-review",
    assigneeIds: ["tm-priya"],
    labelIds: ["cs", "operations"],
    priority: "medium",
    dueDate: "Jun 26",
    comments: 3,
    links: 2,
    subtodos: [sub("s1", "Define triggers", true), sub("s2", "Map to approvals", true), sub("s3", "QA scenarios", false)],
    attachments: [],
    timeline: [{ id: "t1", kind: "created", text: "created this task", actorInitials: "PN", at: "2 days ago" }],
  },
  {
    id: "NT-12",
    title: "Automate payout reconciliation",
    description: "Connect the payout source and validate variance reporting automatically.",
    statusId: "paused",
    assigneeIds: ["tm-lena"],
    labelIds: ["finance", "operations"],
    priority: "low",
    dueDate: "Jul 5",
    comments: 1,
    links: 3,
    subtodos: [sub("s1", "Connect Stripe UK", false)],
    attachments: [],
    timeline: [{ id: "t1", kind: "created", text: "created this task", actorInitials: "LF", at: "4 days ago" }],
  },
];

export function progressOf(task: BoardTask): { completed: number; total: number } {
  return { completed: task.subtodos.filter((s) => s.done).length, total: task.subtodos.length };
}

export function personById(id: string): BoardPerson | undefined {
  return BOARD_PEOPLE.find((p) => p.id === id);
}

export function labelById(id: string): BoardLabel | undefined {
  return BOARD_LABELS.find((l) => l.id === id);
}
