/**
 * Knowledge fixtures: documents, SOPs, and research reports.
 * Includes a private founder doc (permission-state review), a superseded doc,
 * and a stale-effective-date doc.
 */

import type { KnowledgeDocument, ResearchReport, SOP } from "@/data/schema";
import { daysAgo } from "@/data/base/_seed";

export const KNOWLEDGE_DOCS: KnowledgeDocument[] = [
  { id: "DOC-shipping", title: "Shipping policy", type: "policy", tags: ["shipping", "cs"], visibility: "team", effectiveDate: daysAgo(40), ownerId: "tm-priya", status: "active", references: ["DOC-returns"], supersededById: null, updatedAt: daysAgo(3) },
  { id: "DOC-returns", title: "Returns & refund policy", type: "policy", tags: ["returns", "cs"], visibility: "team", effectiveDate: daysAgo(40), ownerId: "tm-priya", status: "active", references: ["DOC-shipping"], supersededById: null, updatedAt: daysAgo(5) },
  { id: "DOC-tone", title: "Tone-of-voice guide", type: "guide", tags: ["brand", "cs"], visibility: "team", effectiveDate: daysAgo(90), ownerId: "tm-ava", status: "active", references: [], supersededById: null, updatedAt: daysAgo(12) },
  { id: "DOC-escalation", title: "CS escalation SOP", type: "guide", tags: ["cs", "sop"], visibility: "department", effectiveDate: daysAgo(60), ownerId: "tm-priya", status: "active", references: ["SOP-escalation"], supersededById: null, updatedAt: daysAgo(8) },
  { id: "DOC-supplier-sop", title: "Supplier issue SOP", type: "guide", tags: ["operations", "sop"], visibility: "department", effectiveDate: daysAgo(50), ownerId: "tm-jonas", status: "active", references: [], supersededById: null, updatedAt: daysAgo(20) },
  { id: "DOC-product-facts", title: "Product facts — linen range", type: "product-fact", tags: ["product"], visibility: "team", effectiveDate: daysAgo(30), ownerId: "tm-sam", status: "active", references: [], supersededById: null, updatedAt: daysAgo(15) },
  { id: "DOC-founder", title: "Founder margin targets (confidential)", type: "note", tags: ["finance", "private"], visibility: "private", effectiveDate: daysAgo(20), ownerId: "tm-ava", status: "active", references: [], supersededById: null, updatedAt: daysAgo(20) },
  { id: "DOC-shipping-v2", title: "Shipping policy (v2 — superseded)", type: "policy", tags: ["shipping"], visibility: "team", effectiveDate: daysAgo(180), ownerId: "tm-priya", status: "superseded", references: [], supersededById: "DOC-shipping", updatedAt: daysAgo(45) },
  { id: "DOC-promo-old", title: "2025 promo calendar", type: "note", tags: ["marketing"], visibility: "team", effectiveDate: daysAgo(220), ownerId: "tm-sam", status: "stale", references: [], supersededById: null, updatedAt: daysAgo(200) },
];

export const SOPS: SOP[] = [
  { id: "SOP-escalation", title: "Customer-service escalation", department: "customer-service", status: "active", version: 3, effectiveDate: daysAgo(60), linkedAutomationIds: ["auto-wismo"], linkedAgentIds: ["ag-cs"], steps: ["Detect negative sentiment or VIP", "Attach order + history", "Offer within-policy remedy", "Escalate to a human if unresolved"], ownerId: "tm-priya" },
  { id: "SOP-supplier", title: "Supplier delay response", department: "operations", status: "active", version: 2, effectiveDate: daysAgo(50), linkedAutomationIds: [], linkedAgentIds: ["ag-ops"], steps: ["Confirm scope of affected orders", "Obtain revised ETA", "Notify customers proactively", "Escalate to supplier account manager"], ownerId: "tm-jonas" },
  { id: "SOP-refund", title: "Refund approval", department: "finance", status: "active", version: 4, effectiveDate: daysAgo(70), linkedAutomationIds: [], linkedAgentIds: ["ag-returns"], steps: ["Verify evidence", "Check policy ceiling", "Route to lead for money-touching actions", "Reconcile against payout ledger"], ownerId: "tm-lena" },
];

export const RESEARCH_REPORTS: ResearchReport[] = [
  { id: "RES-competitor", title: "Competitor pricing — linen category", kind: "competitor", authorRef: "ag-marketing", authoredByAgent: true, publishedAt: daysAgo(7), sources: ["competitor-a.example", "competitor-b.example"], confidence: "estimated", findings: ["Competitors average 8% lower on entry linen", "Free returns is now table stakes"], recommendations: ["Hold price; emphasise quality and returns"], linkedTaskIds: [], linkedCampaignIds: ["CAMP-Meta-Retargeting"] },
  { id: "RES-trend", title: "Summer home-textile demand trend", kind: "trend", authorRef: "ag-marketing", authoredByAgent: true, publishedAt: daysAgo(14), sources: ["trends.example"], confidence: "partial", findings: ["Search interest up 12% MoM for linen throws"], recommendations: ["Increase Shopping budget on linen SKUs"], linkedTaskIds: ["TASK-3"], linkedCampaignIds: ["CAMP-Google-Shopping"] },
  { id: "RES-creative", title: "Creative angle teardown", kind: "creative", authorRef: "tm-sam", authoredByAgent: false, publishedAt: daysAgo(3), sources: ["internal"], confidence: "confirmed", findings: ["‘Loved by 12,000 homes’ outperforms discount hooks"], recommendations: ["Produce 3 social-proof variants"], linkedTaskIds: [], linkedCampaignIds: ["CAMP-Meta-Retargeting"] },
];
