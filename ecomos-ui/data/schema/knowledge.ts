/**
 * Knowledge domain: documents, SOPs, and research (reused from marketing).
 *
 * Pages: /knowledge, /knowledge/brand-vault, /sops, /research, /documents.
 */

import type { EntityId, IsoTimestamp, Department } from "./shared";

// Research reports live in marketing.ts; re-export so /knowledge/research is a
// department-filtered lens over the same records rather than duplicated data.
export type { ResearchReport, ResearchReportKind } from "./marketing";
export { RESEARCH_REPORT_KINDS } from "./marketing";

export const KNOWLEDGE_DOC_TYPES = [
  "policy",
  "guide",
  "faq",
  "product-fact",
  "research",
  "note",
] as const;
export type KnowledgeDocType = (typeof KNOWLEDGE_DOC_TYPES)[number];

export const KNOWLEDGE_VISIBILITIES = [
  "team",
  "department",
  "private",
] as const;
export type KnowledgeVisibility = (typeof KNOWLEDGE_VISIBILITIES)[number];

export const KNOWLEDGE_STATUSES = [
  "draft",
  "active",
  "superseded",
  "stale",
] as const;
export type KnowledgeStatus = (typeof KNOWLEDGE_STATUSES)[number];

/** A document in the brand vault / documents index. */
export interface KnowledgeDocument {
  id: EntityId;
  title: string;
  type: KnowledgeDocType;
  tags: string[];
  visibility: KnowledgeVisibility;
  /** ISO date the document takes effect. */
  effectiveDate: IsoTimestamp;
  ownerId: EntityId;
  status: KnowledgeStatus;
  /** Backlink/reference ids (other docs, records). */
  references: EntityId[];
  /** Document id that supersedes this one, when status is "superseded". */
  supersededById: EntityId | null;
  updatedAt: IsoTimestamp;
}

/** A Standard Operating Procedure. */
export interface SOP {
  id: EntityId;
  title: string;
  department: Department;
  status: KnowledgeStatus;
  version: number;
  effectiveDate: IsoTimestamp;
  /** Automations/agents that implement or reference this SOP. */
  linkedAutomationIds: EntityId[];
  linkedAgentIds: EntityId[];
  /** Steps in the procedure. */
  steps: string[];
  ownerId: EntityId;
}
