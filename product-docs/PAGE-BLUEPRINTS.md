# Ecom-OS page blueprints

## How to use this document

Each route is defined by:

- **Question** — what the operator should be able to answer;
- **Primary composition** — the information hierarchy;
- **Primary actions** — interactions worth making prominent;
- **Drill-downs** — where summaries lead;
- **Required seeded states** — variants needed for review.

These are product blueprints, not mandatory card layouts. Components should be composed to fit the work.

---

# Command Center

## `/command-center` — Overview

**Question:** What is happening across the brand, and what needs my attention now?

**Primary composition**

1. Daily status strip: store scope, date, data freshness, connection health.
2. Attention queue: critical exceptions, approvals, overdue tasks, failed agent runs.
3. Business pulse: estimated contribution margin, revenue, ad spend, orders, refund impact.
4. Trend workspace: profit/revenue/spend with semantic series controls.
5. Department summaries: CS, marketing, operations, finance.
6. Recent human/agent activity timeline.
7. Today’s priorities and suggested investigations.

**Primary actions**

- Ask Ecom-OS about today;
- acknowledge/assign an alert;
- create a task;
- open Daily Brief;
- change store/date context.

**Drill-downs**

Every metric opens its source records or related department. Alerts open the affected entity and trace.

**Seeded states**

Healthy day, margin decline, fulfilment incident, disconnected ad account, no data/new brand.

## `/command-center/daily-brief`

**Question:** What happened yesterday, what matters today, and what should the team do?

Composition:

- concise executive narrative;
- yesterday versus comparison period;
- wins, losses, anomalies, customer-service summary;
- agent work completed;
- today’s tasks and deadlines;
- unresolved questions/data gaps;
- channel-delivery preview.

Actions: regenerate fixture variant, copy/share, convert item to task, ask follow-up, inspect evidence.

## `/command-center/insights`

Cross-department findings ranked by impact, confidence, freshness, and status. Each insight shows evidence, affected entities, recommendation, owner, and whether it came from a person, rule, or agent.

Views: New, Investigating, Accepted, Dismissed, Converted to task.

## `/command-center/alerts`

Operational alert inbox with severity, source, affected scope, first/last seen, owner, state, and related trace. Supports saved views, bulk acknowledgement, assignment, and detail drawer.

---

# Inbox

## `/inbox` — All

**Question:** Which items require a person’s attention?

Unified list of customer tickets, approvals, mentions, assignments, finance/data warnings, and system failures. Use type-specific preview content without forcing every item into identical columns.

Actions: claim, assign, snooze, mark handled, open source record.

## `/inbox/customer-tickets`

Focused attention queue, not the full CS dataset. Shows escalated, reopened, VIP, negative sentiment, overdue, and failed-automation tickets.

## `/inbox/approvals`

Cards/table grouped by action type: discounts, refunds, exceptional messages, configuration changes, and other simulated actions. Each item shows exact proposal, reason, evidence, risk, expiry, and requester.

Actions are simulated approve/reject flows with confirmation and timeline updates.

## `/inbox/mentions`

Human/agent mentions, assigned comments, and requested reviews. Show conversation context and linked record.

## `/inbox/system-alerts`

Connector, data freshness, queue, runtime, scheduled-job, and delivery problems. Provide impact and recommended next step rather than raw technical errors only.

---

# My Tasks

## `/tasks` or `/tasks/my-work`

**Question:** What do I need to do, by when, and why?

Views: List, Board, Today. Task fields: title, status, priority, assignee, due date, department, linked entities, creator type, checklist progress.

Actions: create, assign, change state, set due date, link record, convert insight/alert into task.

## `/tasks/team`

Team workload and blocked tasks. Use grouped list/board plus workload summary, not employee surveillance metrics.

## `/tasks/completed`

Searchable task history with outcome and related records.

---

# Customer Service

## `/customer-service` — Overview

**Question:** Is customer service healthy, and where is automation failing?

Composition:

- attention summary: escalations, overdue, failed sends, approvals;
- volume and automation rate;
- first-response and resolution time;
- reopen/escalation/negative-sentiment trends;
- issue-topic distribution;
- automation performance;
- recent risky/poor outcomes;
- representative/agent workload.

Primary actions: open tickets, run quality review fixture, create automation, ask about a trend.

## `/customer-service/tickets`

Dense table/queue with saved views:

- All;
- New;
- Auto-handling;
- Awaiting customer;
- Needs representative;
- Resolved;
- Reopened;
- Failed.

Core columns: customer, subject/topic, order, status, priority, sentiment, owner/agent, age, last activity, SLA. Row opens a detail drawer.

Ticket drawer:

- conversation timeline;
- customer and order context;
- agent/human activity;
- evidence and policy references;
- approvals/actions;
- related trace;
- reply composer mock;
- assign/escalate/resolve simulation.

## `/customer-service/automations`

Automation cards/table with trigger, scope, enabled state, volume, success, escalation, failure, last changed, and owner. Selecting one opens a visual flow/workflow editor mock with steps, branches, prompts, tools, and preview scenarios.

## `/customer-service/prompts`

Prompt library grouped by automation and step. Show current version, usage volume, quality indicators, last editor, and test cases. Editing is local-only and clearly marked prototype.

## `/customer-service/approvals`

Same approval entities as Inbox but with CS context, history, policy comparison, and cohort filters.

## `/customer-service/quality`

Sampled conversations, reopened tickets, policy deviations, incorrect classifications, hallucination/grounding issues, and customer dissatisfaction. Review flow supports Pass, Needs improvement, Critical, comment, and task creation.

---

# Finance

## `/finance` — Overview

**Question:** What is the brand actually earning, and how trustworthy is the number?

Composition:

1. Estimated contribution margin with formula and confidence/freshness.
2. Revenue, COGS, ad spend, payment fees, discounts, refunds, shipping costs.
3. Profit bridge/waterfall.
4. Trend and comparison.
5. Margin by store/product/channel.
6. Missing-cost and reconciliation warnings.
7. Largest positive/negative drivers.
8. Recent finance-related agent insights/actions.

Avoid calling contribution margin “accounting profit.”

## `/finance/profit`

Contribution-margin trends, breakdown by cost/revenue component, period comparison, and driver analysis. Clicking a segment filters underlying orders/campaigns.

## `/finance/orders-margin`

Order-level margin table. Columns: order, date, customer, store, revenue, discounts, COGS, ad allocation, fees, shipping, refunds, contribution margin, confidence/data status.

Drawer shows line items, cost evidence, attribution, related fulfilment/tickets/refunds, and source timestamps.

## `/finance/spend-roas`

Campaign/ad-set/channel table with spend, attributed revenue, contribution margin, ROAS, MER, CAC, conversion, freshness, and attribution caveat. Chart supports semantic comparison, not arbitrary series.

## `/finance/costs-fees`

Cost catalog and trends: product/supplier costs, shipping, payment fees, marketplace/app costs, discounts, chargebacks. Missing/estimated values are prominent.

## `/finance/payouts`

Payout schedule and reconciliation timeline: expected, pending, paid, failed, variance. Detail connects payout transactions to orders/refunds/fees.

## `/finance/reconciliation`

Data trust workspace. Panels:

- source connections and last sync;
- unmatched transactions;
- missing COGS;
- currency/FX gaps;
- attribution gaps;
- totals mismatch;
- unresolved items and owners.

---

# Marketing

## `/marketing` — Overview

**Question:** Which growth activities are creating profitable demand, and what is deteriorating?

Composition:

- spend, attributed revenue, contribution margin, ROAS/MER, CAC;
- channel and campaign comparison;
- winners/decliners;
- creative fatigue and budget anomalies;
- recent research/agent recommendations;
- content calendar snapshot.

## `/marketing/campaigns`

Campaign table with hierarchy support: channel → campaign → ad set → ad. Columns include status, budget, spend, revenue, margin, ROAS, CAC, conversion, frequency, trend, freshness.

Drawer: performance trend, creatives, audience, attributed products/orders, changes, insights, and related actions.

## `/marketing/creatives`

Visual library with list/grid toggle. Fields: asset, hook, format, channel, campaigns, spend, revenue, ROAS, thumb-stop/click metrics where relevant, fatigue, usage rights placeholder, status.

## `/marketing/content`

Calendar and pipeline: idea, drafting, review, scheduled, published. Content detail links campaign, product, channel, owner/agent, prompt/source research, and performance.

## `/marketing/audiences`

Audience/segment definitions, channel usage, size, overlap, spend, performance, and freshness. This is not a customer data export surface in the prototype.

## `/marketing/research`

Competitor, trend, offer, creative, and market research reports. Each report shows source list, date, author/agent, confidence, extracted findings, recommendations, and linked tasks/campaigns.

---

# Commerce

## `/commerce` — Overview

**Question:** What is selling, to whom, and where are commercial outcomes changing?

Composition: orders/revenue/margin, product mix, new/returning customers, discounts/refunds, best/worst products, order exceptions, recent customer changes.

## `/commerce/orders`

Primary orders table with status, fulfilment, customer, store, total, margin, discount, risk/exception, tickets, date. Saved views for unfulfilled, refunded, low margin, ticket-linked, high value.

Order drawer: timeline, items, customer, payment/payout, fulfilment/tracking, margin breakdown, discounts/refunds, tickets, actions/traces.

## `/commerce/products`

Product table and comparison: revenue, units, margin, conversion, returns/refunds, ad spend, ROAS, stock status when enabled, supplier. Product detail combines commerce, marketing, and operations views.

## `/commerce/customers`

Customer list with orders, lifetime revenue/margin, last order, segment, ticket history, refund/chargeback risk, consent/channel placeholders. Customer drawer links all related records.

## `/commerce/discounts`

Codes and automatic discounts, source (human/agent/campaign), usage, revenue, margin impact, limits, status, and related approvals/actions.

---

# Operations

## `/operations` — Overview

**Question:** Can orders be fulfilled reliably, and which exceptions threaten customers or margin?

Composition: fulfilment status, late/missing tracking, returns, supplier issues, inventory risk if enabled, exception queue, connector/data problems.

## `/operations/fulfilment`

Fulfilment/order table with provider/supplier, status, promised date, shipment date, tracking, delay, customer/ticket linkage, and exception. Cohort timeline and ageing distribution.

## `/operations/returns`

Return/refund request flow with reason, item, value, margin impact, status, owner, customer, and related approval. UI-only actions simulate triage and approval routing.

## `/operations/suppliers`

Supplier scorecards based on seeded delivery, defect, cost, communication, and issue data. Supplier detail links products, orders, incidents, cost changes, and tasks.

## `/operations/inventory`

Optional module. Stock, incoming, sell-through, days cover, reorder point, risk, and locations. Hidden by default through fixture config.

## `/operations/exceptions`

Central operational queue: late fulfilment, missing tracking, failed update, duplicate/uncertain action, supplier delay, return anomaly, connector failure. Items have severity, impact, owner, age, recommended response, and trace.

---

# Agents

## `/agents` — Overview

**Question:** What are the agents doing, how well are they performing, and where do they need supervision?

Composition:

- active agents and current activity;
- runs/actions today;
- completion, escalation, and failure rates;
- action value/impact summaries with caveats;
- recent failures and risky actions;
- scheduled work;
- top active agents by meaningful work, not gamified score alone.

## `/agents/list`

Agent cards/table: name, purpose, status, autonomy mode, tools, schedule, current task, last run, success/failure, owner. Detail view includes configuration mock, recent runs, tools, memory access, and related workflows.

## `/agents/runs`

Run table: agent, trigger, start/duration, status, target entity, tools, actions, approvals, result, cost placeholder, trace completeness. Run drawer presents structured stages and evidence.

## `/agents/tools-permissions`

Matrix by agent and capability. Supports local visual modes: denied, read, bounded write, approval required, unrestricted/operator-owned. This phase does not enforce permissions but must make consequences and scope understandable.

## `/agents/memory`

Inspectable memory/knowledge-access concept: namespaces, entries/documents, source, last updated, access, referenced runs. Clearly distinguish Hermes-native runtime memory from Ecom-OS business records in later integration.

## `/agents/schedules`

Calendar/list of recurring runs and briefs. Fields: agent, job, cadence, next/last run, status, channel, scope, failures. Simulated enable/disable/edit flows.

---

# Knowledge

## `/knowledge` — Overview

Knowledge health, recently updated documents, missing policy areas, frequently referenced sources, research activity, and indexing/access placeholders.

## `/knowledge/brand-vault`

Document tree plus editor/viewer mock. Metadata: type, tags, visibility, effective date, owner, status, references. Support search and backlinks in fixtures.

## `/knowledge/sops`

SOP library with department, status, version, effective date, linked automations/agents, and test/checklist status.

## `/knowledge/research`

Shared research repository. Marketing Research is a department-filtered lens over these records, not necessarily duplicated data.

## `/knowledge/documents`

All files/documents with source, type, processing/indexing state, visibility, references, and freshness.

---

# Activity & Traces

## `/activity` or `/activity/timeline`

Unified event timeline with actor type, action, target, result, department, store, and timestamp. Filters distinguish human, agent, system, connector, approval, and data-sync events.

## `/activity/agent-traces`

Trace explorer with stages:

```text
Trigger
→ context assembled
→ evidence retrieved
→ decision/proposal summary
→ tool calls
→ permission/approval state
→ external outcome
→ final result
```

Trace detail includes IDs, timestamps, linked records, source excerpts, tool arguments/results with safe fixture data, uncertainty, errors, and follow-up.

## `/activity/actions`

Action ledger concept: proposed, authorized, awaiting approval, executing, succeeded, failed, outcome uncertain, reconciled. Every action links to actor, target, run, approval, and result.

## `/activity/errors`

Failures grouped by user impact and subsystem, not just stack trace. Show first/last seen, recurrence, affected records, status, owner, and related runs/actions.

---

# Settings

## `/settings` — Overview

System/brand setup summary, connection status, team, appearance, runtime mode, and outstanding configuration items.

## `/settings/stores`

Store cards with domain/name, status, currency, timezone, channels, data freshness, and default scope. Add/edit interactions are local mocks.

## `/settings/integrations`

Connections grouped by commerce, inbox, ads, payments, communication, and channels. States: connected, degraded, expired, action required, disconnected. Never display real credentials.

## `/settings/team`

Members, roles, invite status, departments, and activity status. Local role-preview switcher may link here.

## `/settings/notifications`

Rules for in-app, email, and Hermes channel delivery, including daily brief destinations. UI only.

## `/settings/appearance`

Theme, density, sidebar behavior, number/currency/date formats, and reduced-motion preview.

## `/settings/runtime`

Hermes integration concept: endpoint/profile status, version, channel availability, schedule health, and conformance status. This page must not claim a real connection in the UI-only prototype.

---

# Chat

## `/chat`

Full-page Ask Ecom-OS experience.

Composition:

- session list;
- conversation;
- cited records/documents;
- current context scope;
- suggested questions;
- referenced entity inspector;
- trace/details tab;
- composer and attachment placeholder.

Seeded sessions demonstrate:

- morning business recap;
- explaining a margin decline;
- investigating a poor CS outcome;
- comparing campaigns;
- tracing why an agent issued a discount;
- finding missing data.

No live model call is permitted in this phase.

---

# Cross-page requirements

Every analytical page includes:

- explicit date/context;
- freshness/source status;
- comparison basis;
- semantic series labels;
- drill-down path;
- populated, empty, stale, partial, and error variants.

Every record table includes:

- search;
- filters;
- sorting where useful;
- selection only when bulk actions are meaningful;
- saved-view concept where recurring work exists;
- row-detail access;
- URL/shareable-state design consideration, even if local-only initially;
- mobile representation.

Every action simulation includes:

- clear actor;
- exact target;
- consequence copy;
- confirm/cancel where risky;
- success/failure feedback;
- timeline/trace update in seed state;
- no suggestion that real external work occurred.