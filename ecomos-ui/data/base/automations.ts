/**
 * Customer-service automations. Each references a current prompt version
 * (see prompts.ts) and is owned by a CS team member.
 */

import type { Automation } from "@/data/schema";
import { daysAgo } from "./_seed";

export const AUTOMATIONS: Automation[] = [
  {
    id: "auto-wismo",
    name: "WISMO auto-responder",
    trigger: "Order shipped + 'where is my order' question",
    scope: ["wismo"],
    status: "enabled",
    volume: 142,
    successRate: 0.91,
    escalationRate: 0.06,
    failureRate: 0.03,
    lastChangedAt: daysAgo(11),
    ownerId: "tm-priya",
    currentPromptVersionId: "pv-wismo-3",
  },
  {
    id: "auto-returns",
    name: "Return eligibility triage",
    trigger: "Return or refund request received",
    scope: ["return", "refund"],
    status: "enabled",
    volume: 63,
    successRate: 0.78,
    escalationRate: 0.18,
    failureRate: 0.04,
    lastChangedAt: daysAgo(5),
    ownerId: "tm-priya",
    currentPromptVersionId: "pv-returns-2",
  },
  {
    id: "auto-address",
    name: "Address-change handler",
    trigger: "Address change before fulfilment",
    scope: ["address-change"],
    status: "enabled",
    volume: 28,
    successRate: 0.86,
    escalationRate: 0.1,
    failureRate: 0.04,
    lastChangedAt: daysAgo(18),
    ownerId: "tm-tomas",
    currentPromptVersionId: "pv-address-1",
  },
  {
    id: "auto-product-qa",
    name: "Product question answering",
    trigger: "Pre-sale product question",
    scope: ["product-question"],
    status: "draft",
    volume: 0,
    successRate: 0,
    escalationRate: 0,
    failureRate: 0,
    lastChangedAt: daysAgo(2),
    ownerId: "tm-tomas",
    currentPromptVersionId: "pv-product-1",
  },
];
