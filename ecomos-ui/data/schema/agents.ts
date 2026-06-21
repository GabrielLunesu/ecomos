/**
 * Agents domain: agents, runs, tool calls, actions, schedules, memory, and the
 * full execution trace model.
 *
 * Pages: /agents, /agents/list, /runs, /tools-permissions, /memory, /schedules,
 * /activity/agent-traces, /activity/actions.
 */

import type {
  EntityId,
  IsoTimestamp,
  Actor,
  EntityRef,
  StatusVariant,
} from "./shared";

export const AGENT_STATUSES = [
  "active",
  "idle",
  "paused",
  "error",
  "disconnected",
] as const;
export type AgentStatus = (typeof AGENT_STATUSES)[number];

/** How much autonomy an agent has when acting. */
export const AUTONOMY_MODES = ["suggest", "approve", "auto"] as const;
export type AutonomyMode = (typeof AUTONOMY_MODES)[number];

/** An autonomous agent. */
export interface Agent {
  id: EntityId;
  name: string;
  /** What the agent is for, e.g. "Resolve WISMO tickets". */
  purpose: string;
  status: AgentStatus;
  autonomyMode: AutonomyMode;
  /** Tool names the agent may call. */
  tools: string[];
  scheduleId: EntityId | null;
  ownerId: EntityId;
  /** Recent success rate 0–1. */
  recentSuccessRate: number;
  lastRunAt: IsoTimestamp | null;
}

export const AGENT_RUN_STATUSES = [
  "running",
  "succeeded",
  "failed",
  "awaiting-approval",
  "outcome-uncertain",
] as const;
export type AgentRunStatus = (typeof AGENT_RUN_STATUSES)[number];

/** State machine for a single proposed/executed action. */
export const ACTION_STATES = [
  "proposed",
  "authorized",
  "awaiting-approval",
  "executing",
  "succeeded",
  "failed",
  "outcome-uncertain",
  "reconciled",
] as const;
export type ActionState = (typeof ACTION_STATES)[number];

export const TOOL_CALL_STATUSES = [
  "succeeded",
  "failed",
  "outcome-uncertain",
  "timed-out",
] as const;
export type ToolCallStatus = (typeof TOOL_CALL_STATUSES)[number];

/** A single tool invocation within a run. Errors/uncertainty are preserved. */
export interface ToolCall {
  id: EntityId;
  runId: EntityId;
  name: string;
  /** Safe summary of the arguments (never raw secrets/PII). */
  argsSummary: string;
  status: ToolCallStatus;
  durationMs: number;
  resultSummary: string;
  retries: number;
  linkedActionId: EntityId | null;
}

/** A proposed or executed action by an agent. */
export interface AgentAction {
  id: EntityId;
  runId: EntityId;
  state: ActionState;
  actor: Actor;
  /** What the action targets (order, ticket, discount…). */
  targetRef: EntityRef;
  approvalId: EntityId | null;
  resultSummary: string;
  /** Status variant for badge rendering. */
  badge: StatusVariant;
}

/** A single execution of an agent. */
export interface AgentRun {
  id: EntityId;
  agentId: EntityId;
  /** What triggered the run, e.g. "schedule", "ticket-created", "operator-ask". */
  trigger: string;
  startedAt: IsoTimestamp;
  durationMs: number;
  status: AgentRunStatus;
  /** Primary entity the run operated on. */
  targetEntity: EntityRef | null;
  toolCallIds: EntityId[];
  actionIds: EntityId[];
  approvalState: "none" | "pending" | "approved" | "rejected";
  outcome: string;
  error: string | null;
  relatedEntityIds: EntityId[];
  traceId: EntityId | null;
}

export const SCHEDULE_STATUSES = ["enabled", "disabled", "failing"] as const;
export type ScheduleStatus = (typeof SCHEDULE_STATUSES)[number];

/** A recurring schedule for an agent (runs, briefs). */
export interface Schedule {
  id: EntityId;
  agentId: EntityId;
  /** Job description, e.g. "Daily brief", "Monitor late fulfilments". */
  job: string;
  /** Cadence expression / label, e.g. "Daily 08:00", "Every 30m". */
  cadence: string;
  nextRunAt: IsoTimestamp | null;
  lastRunAt: IsoTimestamp | null;
  /** Delivery channel, e.g. "Telegram", "Slack", "in-app". */
  channel: string;
  /** Scope label, e.g. "All stores", "Northstar Home". */
  scope: string;
  status: ScheduleStatus;
}

/** An inspectable memory/knowledge-access entry for an agent. */
export interface MemoryEntry {
  id: EntityId;
  /** Logical grouping, e.g. "cs/policies", "marketing/learnings". */
  namespace: string;
  /** Where the memory came from. */
  source: string;
  updatedAt: IsoTimestamp;
  /** Access level concept for the permissions view. */
  access: "read" | "write" | "operator-owned";
  /** Runs that referenced this entry. */
  referencedRunIds: EntityId[];
}

/** Ordered stages of an execution trace. */
export const TRACE_STAGES = [
  "trigger",
  "context",
  "evidence",
  "decision",
  "tool-calls",
  "approval",
  "external-result",
  "final-result",
] as const;
export type TraceStage = (typeof TRACE_STAGES)[number];

/** A piece of evidence retrieved during a run. */
export interface EvidenceItem {
  id: EntityId;
  /** Source name, e.g. "Shipping policy v3". */
  source: string;
  /** Short excerpt or summary (safe fixture text). */
  excerpt: string;
  timestamp: IsoTimestamp;
  /** Relevance 0–1, or null when not scored. */
  relevance: number | null;
  /** Linked record/document. */
  ref: EntityRef | null;
}

/** A single stage record within a trace. */
export interface TraceStageRecord {
  stage: TraceStage;
  timestamp: IsoTimestamp;
  /** Stage summary / decision narrative. */
  summary: string;
  /** Source excerpts surfaced at this stage. */
  excerpts: string[];
  evidenceIds: EntityId[];
  /** Uncertainty note where the stage was ambiguous. */
  uncertainty: string | null;
  /** Error encountered at this stage, if any. */
  error: string | null;
}

/** Full execution trace for a run (the trace explorer / TraceTimeline). */
export interface Trace {
  id: EntityId;
  runId: EntityId;
  /** Ordered stage records (validated to follow TRACE_STAGES order in fixtures). */
  stages: TraceStageRecord[];
}
