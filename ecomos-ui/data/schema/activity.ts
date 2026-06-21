/**
 * Cross-cutting activity domain: activity events, alerts/insights, approvals,
 * and tasks.
 *
 * Pages: /activity/timeline, /activity/actions, /command-center/alerts,
 * /command-center/insights, /inbox/approvals, /tasks/*.
 */

import type {
  EntityId,
  IsoTimestamp,
  Actor,
  ActorKind,
  EntityRef,
  Department,
  Severity,
  Money,
} from "./shared";

/** A unified activity-timeline event (human / agent / system / connector). */
export interface ActivityEvent {
  id: EntityId;
  actorKind: ActorKind;
  actorRef: EntityRef | null;
  /** Verb describing what happened, e.g. "resolved", "approved", "synced". */
  action: string;
  targetRef: EntityRef | null;
  /** Outcome summary. */
  result: string;
  department: Department | null;
  storeId: EntityId | null;
  at: IsoTimestamp;
}

export const ALERT_STATES = [
  "new",
  "investigating",
  "accepted",
  "dismissed",
  "converted",
] as const;
export type AlertState = (typeof ALERT_STATES)[number];

/**
 * An alert or insight. Shared shape — `kind` distinguishes an operational alert
 * from a cross-department insight.
 */
export interface Alert {
  id: EntityId;
  kind: "alert" | "insight";
  title: string;
  severity: Severity;
  /** Where the finding originated. */
  sourceActorKind: ActorKind;
  /** Scope label, e.g. "Marketing · Meta Ads", "Operations". */
  scope: string;
  firstSeen: IsoTimestamp;
  lastSeen: IsoTimestamp;
  ownerId: EntityId | null;
  state: AlertState;
  relatedTraceId: EntityId | null;
  /** Supporting evidence ids. */
  evidence: EntityId[];
  recommendation: string;
  /** Affected entities to drill into. */
  relatedEntityIds: EntityId[];
}

/** Alias: an Insight is structurally an Alert with kind === "insight". */
export type Insight = Alert;

export const APPROVAL_STATES = [
  "pending",
  "approved",
  "rejected",
  "expired",
] as const;
export type ApprovalState = (typeof APPROVAL_STATES)[number];

/** One entry in an approval's history. */
export interface ApprovalHistoryEntry {
  at: IsoTimestamp;
  actor: Actor;
  /** What changed, e.g. "proposed", "approved", "rejected", "expired". */
  event: string;
  note: string | null;
}

/** An approval request referencing an exact proposed action. */
export interface Approval {
  id: EntityId;
  /** Exact proposed action description. */
  proposedAction: string;
  /** The entity the action would affect. */
  targetRef: EntityRef;
  /** Monetary/customer impact summary. */
  impact: string;
  /** Estimated monetary impact in MAJOR units; null when non-monetary. */
  impactAmount: Money | null;
  /** Supporting evidence ids. */
  evidence: EntityId[];
  /** How the proposal compares to policy. */
  policyComparison: string;
  /** Who/what requested approval. */
  requester: Actor;
  expiresAt: IsoTimestamp;
  history: ApprovalHistoryEntry[];
  state: ApprovalState;
  /** Action type for grouping, e.g. "discount", "refund", "message", "config". */
  actionType: "discount" | "refund" | "message" | "config" | "other";
}

export const TASK_STATUSES = [
  "todo",
  "in-progress",
  "blocked",
  "done",
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

/** A single checklist item within a task. */
export interface ChecklistItem {
  id: EntityId;
  label: string;
  done: boolean;
}

/** A task in My Tasks / Team / Completed. */
export interface Task {
  id: EntityId;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  /** Assignee team-member id; null when unassigned. */
  assigneeId: EntityId | null;
  dueDate: IsoTimestamp | null;
  department: Department;
  /** Linked entities (orders, tickets, insights…). */
  linkedEntityRefs: EntityRef[];
  /** Who created the task. */
  creatorKind: ActorKind;
  checklist: ChecklistItem[];
  createdAt: IsoTimestamp;
  completedAt: IsoTimestamp | null;
  /** Task ids this task is blocked by. */
  blockedBy: EntityId[];
}
