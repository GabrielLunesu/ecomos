/**
 * Execution traces — the seven required exemplars. Stages always follow the
 * canonical TRACE_STAGES order (validated in data/validate.ts).
 */

import type { Trace, TraceStageRecord } from "@/data/schema";
import { minutesAgo, hoursAgo } from "@/data/base/_seed";

function stage(
  s: TraceStageRecord["stage"],
  at: string,
  summary: string,
  extra: Partial<TraceStageRecord> = {},
): TraceStageRecord {
  return { stage: s, timestamp: at, summary, excerpts: [], evidenceIds: [], uncertainty: null, error: null, ...extra };
}

export const TRACES: Trace[] = [
  {
    id: "TR-wismo-success",
    runId: "RUN-901",
    stages: [
      stage("trigger", minutesAgo(14), "Ticket TKT-2003 created: ‘Where is my order?’"),
      stage("context", minutesAgo(14), "Loaded order ORD-1042 and customer history (VIP)."),
      stage("evidence", minutesAgo(13.8), "Retrieved tracking status and shipping policy.", { excerpts: ["Tracking shows in transit, ETA 2 days", "Shipping policy v3 · EU 3–5 business days"], evidenceIds: ["mem-1"] }),
      stage("decision", minutesAgo(13.7), "Confident WISMO case — reply with ETA, no discount needed."),
      stage("tool-calls", minutesAgo(13.5), "Called send-reply with the wismo-eta template."),
      stage("approval", minutesAgo(13.5), "No approval required under current autonomy mode."),
      stage("external-result", minutesAgo(13.4), "Reply delivered to customer inbox."),
      stage("final-result", minutesAgo(13.4), "Ticket auto-resolved; customer satisfied."),
    ],
  },
  {
    id: "TR-discount-approval",
    runId: "RUN-915",
    stages: [
      stage("trigger", minutesAgo(19), "Escalation: VIP frustrated by delay on ORD-1042."),
      stage("context", minutesAgo(19), "Loaded order, customer lifetime value, prior goodwill."),
      stage("evidence", minutesAgo(18.8), "Policy permits up to 15% goodwill for VIP delays.", { evidenceIds: ["mem-1"] }),
      stage("decision", minutesAgo(18.7), "Propose 15% goodwill code; requires approval (money-touching)."),
      stage("tool-calls", minutesAgo(18.6), "Called propose-discount → routed to apr-discount-1042."),
      stage("approval", minutesAgo(18.5), "Awaiting operator approval.", { uncertainty: "Pending human decision; not yet applied." }),
      stage("external-result", minutesAgo(18.5), "No external action taken yet."),
      stage("final-result", minutesAgo(18.5), "Held pending approval."),
    ],
  },
  {
    id: "TR-failed-send",
    runId: "RUN-882",
    stages: [
      stage("trigger", hoursAgo(1.5), "WISMO ticket TKT-2002 for a delayed Aurora order."),
      stage("context", hoursAgo(1.5), "Loaded order and the active Aurora delay exception."),
      stage("evidence", hoursAgo(1.49), "Revised ETA available from ops exception."),
      stage("decision", hoursAgo(1.48), "Send proactive delay notice with revised ETA."),
      stage("tool-calls", hoursAgo(1.47), "send-reply failed twice (connector timeout).", { error: "Inbox connector timeout (8.2s) after 2 retries" }),
      stage("approval", hoursAgo(1.46), "Not applicable."),
      stage("external-result", hoursAgo(1.46), "Message not delivered.", { error: "No delivery confirmation received" }),
      stage("final-result", hoursAgo(1.45), "Run failed; ticket flagged for human handling."),
    ],
  },
  {
    id: "TR-uncertain-connector",
    runId: "RUN-930",
    stages: [
      stage("trigger", minutesAgo(48), "Scheduled payout reconciliation."),
      stage("context", minutesAgo(48), "Pulled last 7 days of payouts and refunds."),
      stage("evidence", minutesAgo(47.8), "Refund REF-ORD-1188 present in two payout pages."),
      stage("decision", minutesAgo(47.7), "Possible duplicate refund — do not auto-correct."),
      stage("tool-calls", minutesAgo(47.5), "read-payouts returned a partial page.", { uncertainty: "Source paginated mid-sync; totals may be incomplete." }),
      stage("approval", minutesAgo(47.5), "Not applicable."),
      stage("external-result", minutesAgo(47.4), "Outcome uncertain — reconciliation needed.", { uncertainty: "Retry could double-refund; route to human." }),
      stage("final-result", minutesAgo(47.4), "Raised reconciliation item; no write performed."),
    ],
  },
  {
    id: "TR-finance-insight",
    runId: "RUN-940",
    stages: [
      stage("trigger", hoursAgo(5), "Scheduled campaign efficiency scan."),
      stage("context", hoursAgo(5), "Loaded campaign spend, attributed revenue, and order COGS."),
      stage("evidence", hoursAgo(4.9), "Meta prospecting ROAS 1.9× with COGS missing for 42 orders.", { uncertainty: "Margin is estimated; COGS missing for a cohort." }),
      stage("decision", hoursAgo(4.8), "Flag prospecting inefficiency as a margin driver."),
      stage("tool-calls", hoursAgo(4.8), "No external tool calls (read-only insight)."),
      stage("approval", hoursAgo(4.8), "Not applicable."),
      stage("external-result", hoursAgo(4.8), "Insight published to Command Center."),
      stage("final-result", hoursAgo(4.8), "Created insight INS-margin with evidence."),
    ],
  },
  {
    id: "TR-daily-brief",
    runId: "RUN-970",
    stages: [
      stage("trigger", hoursAgo(2), "Scheduled 08:00 daily brief."),
      stage("context", hoursAgo(2), "Aggregated yesterday vs prior period across departments."),
      stage("evidence", hoursAgo(1.98), "Margin, CS health, and the Aurora incident summarised."),
      stage("decision", hoursAgo(1.97), "Compose brief; highlight incident and two approvals."),
      stage("tool-calls", hoursAgo(1.96), "compose + deliver to Telegram and Slack."),
      stage("approval", hoursAgo(1.96), "Auto mode — no approval required for delivery."),
      stage("external-result", hoursAgo(1.95), "Delivered to both channels."),
      stage("final-result", hoursAgo(1.95), "Brief delivered; open rate pending."),
    ],
  },
  {
    id: "TR-ops-incident",
    runId: "RUN-960",
    stages: [
      stage("trigger", hoursAgo(22), "Fulfilment SLA monitor detected a cluster of late orders."),
      stage("context", hoursAgo(22), "14 orders share supplier Aurora Supply."),
      stage("evidence", hoursAgo(21.9), "Aurora on-time rate dropped to 61%; no tracking issued."),
      stage("decision", hoursAgo(21.8), "Raise supplier-delay exception EXC-aurora."),
      stage("tool-calls", hoursAgo(21.8), "notify ops channel (Slack)."),
      stage("approval", hoursAgo(21.8), "Approve mode — notification only, no customer action."),
      stage("external-result", hoursAgo(21.7), "Slack alert delivered to operations."),
      stage("final-result", hoursAgo(21.7), "Exception open; remediation task created."),
    ],
  },
];

export function getTrace(id: string): Trace | undefined {
  return TRACES.find((t) => t.id === id);
}
