/**
 * Marketing domain: ad accounts, campaign hierarchy, creatives, audiences,
 * and research reports.
 *
 * Pages: /marketing, /marketing/campaigns, /creatives, /content, /audiences,
 * /marketing/research, and /finance/spend-roas.
 */

import type {
  EntityId,
  IsoTimestamp,
  Money,
  CurrencyCode,
  Confidence,
  Trend,
  Freshness,
} from "./shared";

export const AD_PLATFORMS = ["meta", "google"] as const;
export type AdPlatform = (typeof AD_PLATFORMS)[number];

/** An ad platform account. */
export interface AdAccount {
  id: EntityId;
  platform: AdPlatform;
  name: string;
  currency: CurrencyCode;
  status: "connected" | "degraded" | "expired" | "disconnected";
  lastSyncAt: IsoTimestamp | null;
}

export const CAMPAIGN_LEVELS = ["channel", "campaign", "adset", "ad"] as const;
export type CampaignLevel = (typeof CAMPAIGN_LEVELS)[number];

export const CAMPAIGN_STATUSES = [
  "active",
  "learning",
  "paused",
  "fatigued",
  "declining",
  "disconnected",
] as const;
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

/**
 * A node in the marketing hierarchy (channel → campaign → adset → ad),
 * modelled via `level` + `parentId`.
 */
export interface Campaign {
  id: EntityId;
  accountId: EntityId;
  name: string;
  level: CampaignLevel;
  /** Parent node id; null for top-level channel nodes. */
  parentId: EntityId | null;
  status: CampaignStatus;

  spend: Money;
  attributedRevenue: Money;
  contributionMargin: Money | null;
  currency: CurrencyCode;

  /** Return on ad spend (attributedRevenue / spend). */
  roas: number | null;
  /** Marketing efficiency ratio (total revenue / spend). */
  mer: number | null;
  /** Customer acquisition cost. */
  cac: number | null;
  conversionRate: number | null;
  frequency: number | null;

  trend: Trend;
  freshness: Freshness;
  /** Caveat explaining the attribution model / its limits. */
  attributionCaveat: string;

  /** Linkage to attributed products/orders. */
  productIds: EntityId[];
  orderIds: EntityId[];
}

export const CREATIVE_FORMATS = ["image", "video", "carousel", "text"] as const;
export type CreativeFormat = (typeof CREATIVE_FORMATS)[number];

/** An ad creative. */
export interface Creative {
  id: EntityId;
  name: string;
  /** The hook / primary message. */
  hook: string;
  format: CreativeFormat;
  platform: AdPlatform;
  campaignIds: EntityId[];
  spend: Money;
  revenue: Money;
  roas: number | null;
  /** Thumb-stop / click metrics where relevant; null otherwise. */
  thumbStopRate: number | null;
  clickThroughRate: number | null;
  fatigue: "fresh" | "stable" | "fatiguing" | "fatigued";
  status: "active" | "paused" | "archived";
}

/** An advertising audience / segment. */
export interface Audience {
  id: EntityId;
  name: string;
  platform: AdPlatform;
  kind: "lookalike" | "interest" | "retargeting" | "custom";
  size: number | null;
  spend: Money;
  revenue: Money;
  /** Overlap percentage with other audiences (0–100); null when unknown. */
  overlapPct: number | null;
  freshness: Freshness;
}

export const RESEARCH_REPORT_KINDS = [
  "competitor",
  "trend",
  "offer",
  "creative",
  "market",
] as const;
export type ResearchReportKind = (typeof RESEARCH_REPORT_KINDS)[number];

/**
 * A research report. Surfaced in /marketing/research and reused by
 * /knowledge/research as a department-filtered lens (re-exported from knowledge.ts).
 */
export interface ResearchReport {
  id: EntityId;
  title: string;
  kind: ResearchReportKind;
  /** Author or agent that produced the report. */
  authorRef: EntityId;
  authoredByAgent: boolean;
  publishedAt: IsoTimestamp;
  /** Source names/links cited (safe fixture data). */
  sources: string[];
  confidence: Confidence;
  findings: string[];
  recommendations: string[];
  /** Linked tasks and campaigns. */
  linkedTaskIds: EntityId[];
  linkedCampaignIds: EntityId[];
}
