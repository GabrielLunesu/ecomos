# 12 — Domain modules

## Shared rule

Each module owns its schema, use cases, permissions, events, projections, and tests. Cross-module behavior uses typed IDs/events/use cases, not direct table mutation.

## Tasks

Owns tasks, subtasks, statuses, assignments, priorities, due dates, labels, comments, links, and activity. Preserve the approved Linear-style board behavior from `AS-BUILT.md`.

## Customer Service

Owns:

- tickets and messages;
- threading and provider message IDs;
- status/SLA/assignment;
- classification, sentiment and topics;
- automations/prompts/quality review;
- reply proposals/actions;
- sticky human escalation;
- links to customer/order/refund/action/trace.

Provider mailbox messages remain canonical externally; EcomOS stores the operational ticket projection.

## Commerce

Owns Shopify projections:

- store metadata;
- products/variants;
- customers;
- orders and line items;
- discounts;
- fulfilments/tracking;
- refunds/returns references;
- order timeline and relationships.

## Finance

Owns normalized financial facts and calculations:

- revenue/net sales;
- discounts/refunds;
- COGS and evidence/effective date;
- shipping/fulfilment costs;
- payment/platform fees;
- allocated ad spend;
- contribution margin;
- payouts and reconciliation;
- data quality/freshness.

All formulas are versioned and explainable.

## Marketing

Owns Google Ads projections and EcomOS records:

- accounts/campaigns/ad groups/ads/assets;
- budgets/statuses;
- daily metrics and attribution caveats;
- content/creative/research records;
- recommendations/insights;
- campaign actions and traces.

## Operations

Owns:

- fulfilment exceptions;
- suppliers and scorecards;
- returns workflow;
- inventory optional module;
- late/missing tracking;
- operational incidents;
- reconciliation/action links.

## Agents

Owns EcomOS agent definitions and desired state:

- purpose/configuration;
- OpenClaw mapping;
- grants/tools/autonomy;
- schedules/channels;
- runs and observed health;
- cost/usage summaries;
- memory access metadata.

OpenClaw owns raw runtime state.

## Knowledge

Owns documents, SOPs, research, versions, effective dates, visibility, tags, links, ingestion/index state, and references. Authoritative policies are explicit and versioned.

## Activity & Traces

Owns normalized timeline/read models over audit, actions, traces, provider events, humans, agents, jobs, and system health.

## Settings

Owns store profile, users/roles, connector configuration, notification destinations, appearance preferences, runtime desired settings, autonomy defaults, retention, and maintenance controls.

## Chat

Owns the EcomOS conversation mapping, UI sessions, citations, referenced entities, user permissions, and normalized message projection. It starts/waits/aborts OpenClaw sessions through the runtime module.

## Command Center and Inbox

These are cross-domain read models:

- Command Center summarizes attention and metrics from modules.
- Inbox normalizes actionable tickets, approvals, mentions, tasks, alerts, and failures.

They do not own source records and cannot mutate them directly; actions call the owning module use case.

## Initial module delivery order

1. Platform core and runtime.
2. Connector core.
3. Commerce/Shopify.
4. Customer Service/Outlook.
5. Tasks, actions, approvals, activity.
6. Chat/Agents/OpenClaw.
7. Finance.
8. Marketing/Google Ads.
9. Operations.
10. Knowledge, Settings and remaining read models.
