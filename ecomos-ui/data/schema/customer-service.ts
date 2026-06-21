/**
 * Customer service domain: tickets, messages, automations, prompts, quality.
 *
 * Pages: /customer-service, /customer-service/tickets, /automations, /prompts,
 * /approvals, /quality, and /inbox/customer-tickets.
 */

import type {
  EntityId,
  IsoTimestamp,
  Actor,
  Severity,
} from "./shared";

export const TICKET_STATUSES = [
  "new",
  "auto-handling",
  "awaiting-customer",
  "needs-representative",
  "resolved",
  "reopened",
  "failed",
] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export const TICKET_TOPICS = [
  "wismo",
  "return",
  "refund",
  "product-question",
  "complaint",
  "cancellation",
  "address-change",
  "other",
] as const;
export type TicketTopic = (typeof TICKET_TOPICS)[number];

export const SENTIMENTS = ["positive", "neutral", "negative"] as const;
export type Sentiment = (typeof SENTIMENTS)[number];

/** A single message in a ticket thread. */
export interface TicketMessage {
  id: EntityId;
  ticketId: EntityId;
  author: Actor;
  /** Message body (safe fixture text; injection-like content represented inertly). */
  body: string;
  sentAt: IsoTimestamp;
  /** True for outbound messages that failed to send. */
  sendFailed?: boolean;
}

/** A support ticket. */
export interface Ticket {
  id: EntityId;
  subject: string;
  customerId: EntityId;
  /** null for the no-matched-order case. */
  orderId: EntityId | null;
  status: TicketStatus;
  priority: TicketPriority;
  topic: TicketTopic;
  sentiment: Sentiment;
  owner: Actor;
  automationId: EntityId | null;
  promptVersionId: EntityId | null;
  /** Source/document/record references used to ground the response. */
  evidenceRefs: EntityId[];
  approvalId: EntityId | null;
  traceId: EntityId | null;
  slaDueAt: IsoTimestamp;
  createdAt: IsoTimestamp;
  lastActivityAt: IsoTimestamp;
}

export const AUTOMATION_STATUSES = ["enabled", "disabled", "draft"] as const;
export type AutomationStatus = (typeof AUTOMATION_STATUSES)[number];

/** A CS automation (workflow that resolves tickets). */
export interface Automation {
  id: EntityId;
  name: string;
  /** Trigger description, e.g. "Order shipped + WISMO question". */
  trigger: string;
  scope: TicketTopic[];
  status: AutomationStatus;
  /** Tickets handled in the current period. */
  volume: number;
  successRate: number;
  escalationRate: number;
  failureRate: number;
  lastChangedAt: IsoTimestamp;
  ownerId: EntityId;
  /** Current prompt version powering this automation. */
  currentPromptVersionId: EntityId;
}

/** A versioned prompt used by an automation step. */
export interface PromptVersion {
  id: EntityId;
  automationId: EntityId;
  /** Step within the automation this prompt belongs to. */
  step: string;
  version: number;
  /** The prompt text (local-only editable in the prototype). */
  body: string;
  isCurrent: boolean;
  usageVolume: number;
  /** Quality signal 0–1, or null when not yet measured. */
  qualityScore: number | null;
  lastEditedById: EntityId;
  lastEditedAt: IsoTimestamp;
}

export const QUALITY_RESULTS = ["pass", "needs-improvement", "critical"] as const;
export type QualityResult = (typeof QUALITY_RESULTS)[number];

/** A quality review of a sampled conversation / agent outcome. */
export interface QualityReview {
  id: EntityId;
  ticketId: EntityId;
  reviewerId: EntityId | null;
  result: QualityResult | null;
  /** What was wrong, e.g. "policy-deviation", "misclassification", "hallucination". */
  issueKind:
    | "none"
    | "policy-deviation"
    | "misclassification"
    | "hallucination"
    | "grounding"
    | "dissatisfaction";
  severity: Severity;
  comment: string | null;
  /** Task created from this review, if any. */
  taskId: EntityId | null;
  reviewedAt: IsoTimestamp | null;
}
