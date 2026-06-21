/**
 * Quality reviews of sampled CS conversations / agent outcomes.
 * TKT-2004 is the "incorrect agent outcome" case (critical, hallucination).
 */

import type { QualityReview } from "@/data/schema";
import { daysAgo } from "./_seed";

export const QUALITY_REVIEWS: QualityReview[] = [
  {
    id: "qr-2004",
    ticketId: "TKT-2004",
    reviewerId: "tm-priya",
    result: "critical",
    issueKind: "hallucination",
    severity: "high",
    comment: "Agent claimed the vase was dishwasher safe; product facts say hand-wash only. Led to breakage and a refund. Prompt needs a grounding guardrail.",
    taskId: "task-quality-product-qa",
    reviewedAt: daysAgo(2),
  },
  {
    id: "qr-1188",
    ticketId: "TKT-1188",
    reviewerId: "tm-priya",
    result: "needs-improvement",
    issueKind: "policy-deviation",
    severity: "medium",
    comment: "Refund marked processed before the payment provider confirmed it, causing a reopen. Wait for payout confirmation before messaging.",
    taskId: null,
    reviewedAt: daysAgo(2),
  },
  {
    id: "qr-2001",
    ticketId: "TKT-2001",
    reviewerId: "tm-priya",
    result: "pass",
    issueKind: "none",
    severity: "info",
    comment: "Clean autonomous WISMO resolution, correct tracking and tone.",
    taskId: null,
    reviewedAt: daysAgo(1),
  },
  {
    id: "qr-1400",
    ticketId: "TKT-1400",
    reviewerId: null,
    result: null,
    issueKind: "none",
    severity: "info",
    comment: null,
    taskId: null,
    reviewedAt: null,
  },
  {
    id: "qr-2007",
    ticketId: "TKT-2007",
    reviewerId: "tm-priya",
    result: "pass",
    issueKind: "none",
    severity: "info",
    comment: "Agent correctly refused an injection-style instruction and escalated. Good guardrail behaviour.",
    reviewedAt: daysAgo(1),
    taskId: null,
  },
];
