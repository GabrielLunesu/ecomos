/**
 * Versioned prompts powering the CS automations. Each automation's current
 * prompt is marked `isCurrent`; superseded versions remain for history.
 */

import type { PromptVersion } from "@/data/schema";
import { daysAgo } from "./_seed";

export const PROMPT_VERSIONS: PromptVersion[] = [
  // WISMO
  {
    id: "pv-wismo-2",
    automationId: "auto-wismo",
    step: "draft-reply",
    version: 2,
    body: "You are a customer-service assistant for Northstar Goods. Answer 'where is my order' questions using the shipping policy and the order's tracking record. Be concise and warm.",
    isCurrent: false,
    usageVolume: 410,
    qualityScore: 0.84,
    lastEditedById: "tm-priya",
    lastEditedAt: daysAgo(40),
  },
  {
    id: "pv-wismo-3",
    automationId: "auto-wismo",
    step: "draft-reply",
    version: 3,
    body: "You are a customer-service assistant for Northstar Goods. Answer 'where is my order' questions using the shipping policy and the order's tracking record. Always include the carrier and a realistic delivery window. If the order is delayed, acknowledge it and set expectations. Never invent a tracking number.",
    isCurrent: true,
    usageVolume: 142,
    qualityScore: 0.91,
    lastEditedById: "tm-priya",
    lastEditedAt: daysAgo(11),
  },
  // Returns
  {
    id: "pv-returns-2",
    automationId: "auto-returns",
    step: "eligibility-check",
    version: 2,
    body: "Triage return/refund requests against the returns policy. Confirm the order is within the 30-day window and the item is eligible. Propose a resolution but require human approval for refunds above the auto-approval limit.",
    isCurrent: true,
    usageVolume: 63,
    qualityScore: 0.79,
    lastEditedById: "tm-priya",
    lastEditedAt: daysAgo(5),
  },
  // Address change
  {
    id: "pv-address-1",
    automationId: "auto-address",
    step: "verify-and-update",
    version: 1,
    body: "Handle address-change requests received before fulfilment. Verify the order is still unfulfilled, confirm the new address with the customer, and update the shipping address.",
    isCurrent: true,
    usageVolume: 28,
    qualityScore: 0.86,
    lastEditedById: "tm-tomas",
    lastEditedAt: daysAgo(18),
  },
  // Product Q&A (draft automation, never measured)
  {
    id: "pv-product-1",
    automationId: "auto-product-qa",
    step: "answer",
    version: 1,
    body: "Answer pre-sale product questions using product facts and the tone-of-voice guide. Do not make claims that are not supported by product facts.",
    isCurrent: true,
    usageVolume: 0,
    qualityScore: null,
    lastEditedById: "tm-tomas",
    lastEditedAt: daysAgo(2),
  },
];

const PROMPT_INDEX = new Map(PROMPT_VERSIONS.map((p) => [p.id, p]));
export function getPromptVersion(id: string): PromptVersion | undefined {
  return PROMPT_INDEX.get(id);
}
