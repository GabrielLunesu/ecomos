/**
 * Ask Ecom-OS conversation fixtures.
 *
 * The full-page chat (`/chat`) is the single Ask Ecom-OS surface. Responses and
 * citations are deterministic — no model call is made in this phase
 * (PAGE-BLUEPRINTS § Chat). Conversation management (new / rename / archive /
 * delete) runs against the in-memory chat store.
 */

export type ChatRole = "user" | "assistant";

export type ChatCitation = {
  label: string;
  href: string;
};

/** A chain-of-thought step shown above an assistant answer. */
export type ChatStep = {
  label: string;
  description?: string;
  status?: "complete" | "active" | "pending";
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  citations?: ChatCitation[];
  /** Collapsible "thinking" shown before the answer (AI Elements Reasoning). */
  reasoning?: string;
  /** Step-by-step plan (AI Elements ChainOfThought). */
  steps?: ChatStep[];
  /** Reasoning duration in seconds, for the Reasoning header. */
  reasoningSeconds?: number;
};

/** Lucide icon key shown beside a conversation in the list. */
export type ConversationIcon =
  | "margin"
  | "recap"
  | "trace"
  | "campaign"
  | "operations"
  | "message";

export type Conversation = {
  id: string;
  title: string;
  icon: ConversationIcon;
  messages: ChatMessage[];
  isArchived: boolean;
};

/** Seeded conversations grounded in the Northstar Goods fixture brand. */
export const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-margin",
    title: "Why is contribution margin down?",
    icon: "margin",
    isArchived: false,
    messages: [
      {
        id: "conv-margin-m1",
        role: "user",
        content: "Why is contribution margin down this week?",
      },
      {
        id: "conv-margin-m2",
        role: "assistant",
        reasoningSeconds: 6,
        reasoning:
          "The operator is asking about a week-over-week margin drop. I should compute estimated contribution margin for the current vs previous window, decompose the drivers (revenue, ad spend, refunds, COGS), and flag any data-quality caveats before answering.",
        steps: [
          { label: "Pulled contribution margin for both windows", description: "Current vs previous 7-day window from order records." },
          { label: "Decomposed the change into drivers", description: "Isolated ad spend, refunds, and COGS contributions." },
          { label: "Checked data quality", description: "COGS missing for 42 orders → margin is partial." },
          { label: "Composed the answer with citations", status: "complete" },
        ],
        content:
          "Estimated contribution margin is down 6.4% week-over-week. The dominant driver is Meta prospecting spend (ROAS 1.9×) rising without a matching revenue lift, compounded by refunds from the Aurora Supply delay. COGS is missing for 42 orders, so this figure is partial.",
        citations: [
          { label: "Finance overview", href: "/finance" },
          { label: "Meta · Prospecting", href: "/marketing/campaigns" },
          { label: "Aurora exception", href: "/operations/exceptions" },
        ],
      },
    ],
  },
  {
    id: "conv-recap",
    title: "Morning business recap",
    icon: "recap",
    isArchived: false,
    messages: [
      {
        id: "conv-recap-m1",
        role: "user",
        content: "Give me the morning recap.",
      },
      {
        id: "conv-recap-m2",
        role: "assistant",
        content:
          "Yesterday: revenue €8.4k across 38 orders, CS automation rate 71%. One incident is active (Aurora Supply shipment delay) and two approvals are waiting on you.",
        citations: [{ label: "Daily Brief", href: "/command-center/daily-brief" }],
      },
    ],
  },
  {
    id: "conv-trace",
    title: "Trace: why a discount was issued",
    icon: "trace",
    isArchived: false,
    messages: [
      {
        id: "conv-trace-m1",
        role: "user",
        content: "Why did an agent propose a discount on ORD-1042?",
      },
      {
        id: "conv-trace-m2",
        role: "assistant",
        reasoningSeconds: 4,
        reasoning:
          "This is a traceability question about a specific proposed action. I should locate the agent run that produced the discount on ORD-1042, read its trace (trigger → evidence → decision → approval), and report the current approval state without implying the discount was applied.",
        steps: [
          { label: "Found the run that targeted ORD-1042", description: "RUN-915 · CS Copilot." },
          { label: "Read the agent trace", description: "VIP affected by Aurora delay; policy allows ≤15% goodwill." },
          { label: "Checked the approval state", description: "apr-discount-1042 is still pending — nothing applied." },
        ],
        content:
          "The CS Copilot proposed a 15% goodwill discount on ORD-1042 for a VIP affected by the Aurora Supply delay. It is awaiting your approval — no discount has been applied yet.",
        citations: [
          { label: "Approval apr-discount-1042", href: "/inbox/approvals" },
          { label: "Agent trace", href: "/activity/agent-traces" },
        ],
      },
    ],
  },
  {
    id: "conv-campaigns",
    title: "Compare campaign ROAS",
    icon: "campaign",
    isArchived: true,
    messages: [
      {
        id: "conv-campaigns-m1",
        role: "user",
        content: "Which campaigns have the best ROAS?",
      },
      {
        id: "conv-campaigns-m2",
        role: "assistant",
        content:
          "Google Brand leads at 4.6× ROAS, followed by Meta Retargeting at 3.1×. Meta Prospecting is the laggard at 1.9× and is the main drag on blended MER this week.",
        citations: [{ label: "Spend & ROAS", href: "/finance/spend-roas" }],
      },
    ],
  },
];
