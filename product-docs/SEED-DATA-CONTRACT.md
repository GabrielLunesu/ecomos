# Seed-data contract

## Goal

Seed data must make the prototype behave like one coherent ecommerce business. It is not decorative filler. Values, records, relationships, alerts, traces, and page summaries must agree across routes.

## Principles

1. **Deterministic** — no unseeded randomness during rendering.
2. **Cross-linked** — related entities share stable IDs.
3. **Internally consistent** — page totals reconcile to underlying records within documented assumptions.
4. **Scenario-driven** — healthy, attention, incident, empty, partial, stale, and offline variants are explicit.
5. **Realistic volume** — enough records to exercise tables, filters, pagination, long content, and edge cases.
6. **Safe** — no real customer, credential, email, token, or private business data.
7. **Typed** — domain models and fixture builders are TypeScript-first.
8. **Explainable** — estimated metrics identify their assumptions and missing inputs.

## Brand fixture

Use one fictional brand with multiple stores to test aggregation without implying multi-tenancy.

Suggested baseline:

```text
Brand: Northstar Goods
Primary model: dropshipping-first
Currency: EUR
Timezone: Europe/Amsterdam
Stores:
  - Northstar Home (EU)
  - Northstar Living (UK)
Channels:
  - Shopify
  - Meta Ads
  - Google Ads
  - Gmail support inbox
Hermes channels:
  - Telegram daily brief
  - Slack operations alerts
```

Names may change before build, but one coherent fixture brand must be used everywhere.

## Core entity graph

```text
Brand
├── Stores
│   ├── Orders ── Customers
│   │   ├── Order lines ── Products ── Suppliers
│   │   ├── Fulfilments
│   │   ├── Discounts
│   │   ├── Refunds / returns
│   │   ├── Fees / payouts
│   │   └── Tickets
│   ├── Campaigns ── Creatives / Audiences
│   └── Source health snapshots
├── Team members
├── Agents
│   ├── Runs
│   ├── Tool calls
│   ├── Actions
│   └── Schedules
├── Tasks
├── Alerts / Insights
├── Approvals
├── Knowledge documents / SOPs / Research
└── Activity events / Traces
```

## Required TypeScript domains

### Brand and context

```ts
type Brand = {
  id: string;
  name: string;
  currency: string;
  timezone: string;
  businessModel: "dropshipping" | "stock" | "hybrid";
  inventoryEnabled: boolean;
};

type Store = {
  id: string;
  brandId: string;
  name: string;
  domain: string;
  currency: string;
  timezone: string;
  status: "healthy" | "degraded" | "disconnected";
};
```

### Commerce

Seed:

- 75–150 orders across at least 45 days;
- 25–50 customers;
- 12–20 products;
- 4–8 suppliers;
- order lines, fulfilments, tracking, discounts, refunds, returns, fees, payouts;
- high-value, low-margin, refunded, late, ticket-linked, and ordinary orders.

Order records require IDs stable enough to link across Finance, Commerce, Operations, Customer Service, Agents, and Activity.

### Finance

Each order should support an explainable contribution-margin model:

```text
net revenue
- COGS
- allocated ad spend
- payment/platform fees
- shipping/fulfilment cost
- refunds/chargebacks
= estimated contribution margin
```

Include:

- confirmed costs;
- estimated costs;
- missing COGS;
- partial ad attribution;
- multi-currency example;
- payout mismatch;
- one cohort causing a visible decline.

Summary values must be calculated by fixture selectors or generated at fixture-build time, not separately typed into each page.

### Customer service

Seed 35–60 tickets with:

- messages;
- topic/classification;
- sentiment;
- status;
- priority;
- order/customer links;
- agent/human ownership;
- evidence references;
- automation and prompt version;
- approval/action links;
- trace IDs.

Required cases:

- normal autonomous WISMO resolution;
- sticky human escalation;
- reopened ticket;
- failed outbound send;
- incorrect agent outcome flagged in Quality;
- refund approval;
- VIP/high-value customer;
- customer message containing prompt-injection-like text represented safely as fixture data;
- ticket without matched order.

### Marketing

Seed:

- Meta and Google accounts;
- 8–15 campaigns;
- nested ad sets/ads where useful;
- 20–30 creatives;
- audiences;
- daily spend and attributed outcomes;
- winning, declining, fatigued, paused, learning, and disconnected cases;
- campaign/product/order linkage;
- research reports and agent insights.

Attribution is explicitly a fixture model and should show caveats.

### Operations

Seed:

- fulfilment timelines;
- supplier performance;
- late and missing tracking cases;
- return requests;
- uncertain/duplicate-action case;
- optional inventory data even though the default brand hides Inventory;
- cross-department incident linking a supplier delay to WISMO volume and refund/margin impact.

### Agents and traces

Seed 6–10 agents representing:

- brand/operator copilot;
- customer service;
- analytics/finance;
- marketing research;
- operations monitoring;
- daily brief.

Agent records include purpose, status, autonomy mode, tools, schedule, owner, and recent performance.

Seed 40–80 runs with:

- trigger;
- start/end/duration;
- context records;
- evidence;
- tool calls;
- proposals/actions;
- approval state;
- outcome;
- error/uncertainty;
- related entity IDs.

Required trace examples:

1. successful WISMO reply;
2. proposed discount requiring/avoiding approval depending on mode;
3. failed send;
4. outcome-uncertain connector call;
5. finance insight from missing COGS;
6. daily brief delivery;
7. operator asks why a bad ticket outcome occurred.

### Knowledge

Seed:

- shipping policy;
- returns/refund policy;
- tone-of-voice guide;
- CS escalation SOP;
- supplier issue SOP;
- marketing research documents;
- product facts;
- founder/private example for permission-state review;
- superseded document/version;
- document with stale effective date.

### Team, tasks, approvals, notifications

Use a small team with distinct roles. Include assignments, overdue work, completed work, agent-created tasks, and blocked dependencies.

Approvals must reference the exact seeded proposal and target entity.

## Scenario definitions

### `healthy-day`

- sources healthy and recent;
- margin stable/improving;
- ordinary ticket volume;
- no critical failures;
- some routine tasks and low-severity attention.

### `attention-day`

- contribution margin down;
- one campaign spending inefficiently;
- several late orders;
- two approvals pending;
- one agent quality concern;
- source data otherwise available.

### `incident-day`

One coherent supplier/fulfilment incident:

- supplier shipment delay;
- 14 affected orders;
- rising WISMO tickets;
- negative sentiment;
- refund requests;
- estimated margin impact;
- operations alert;
- failed/uncertain outbound action;
- tasks and brief items;
- linked agent traces.

### `empty-brand`

Brand exists but has no commerce or channel records. Show setup/education states without pretending that errors occurred.

### `partial-data`

- orders and revenue available;
- COGS missing for a cohort;
- Meta data stale;
- payout source disconnected;
- contribution margin labelled estimated/partial.

### `stale-data`

Last-good records remain but timestamps are old. Some actions are disabled pending refresh.

### `offline`

Application shell and fixtures remain navigable, but connections/system status shows offline/degraded and execution simulations are unavailable.

## Fixture architecture

Suggested structure:

```text
ecomos-ui/data/
├── schema/
│   ├── brand.ts
│   ├── commerce.ts
│   ├── finance.ts
│   ├── customer-service.ts
│   ├── marketing.ts
│   ├── operations.ts
│   ├── agents.ts
│   ├── knowledge.ts
│   └── activity.ts
├── base/
│   ├── brand.ts
│   ├── stores.ts
│   ├── products.ts
│   ├── customers.ts
│   └── ...
├── scenarios/
│   ├── healthy-day.ts
│   ├── attention-day.ts
│   ├── incident-day.ts
│   ├── empty-brand.ts
│   ├── partial-data.ts
│   ├── stale-data.ts
│   └── offline.ts
├── selectors/
│   ├── command-center.ts
│   ├── finance.ts
│   ├── cs.ts
│   └── ...
└── scenario-store.ts
```

Generic components receive typed data through props. They do not import scenario fixtures directly.

## Local mutations

Simulated interactions may mutate an in-memory/local Zustand store:

- approve/reject proposal;
- assign ticket/task;
- change task status;
- acknowledge alert;
- enable/disable schedule;
- edit local prompt/automation draft;
- send simulated reply;
- change agent autonomy preview;
- mark quality review result.

A reset-scenario action restores deterministic state. Local mutations should append linked activity entries where the real product would be traceable.

## Data formatting

Centralize:

- currency;
- percentage;
- date/time;
- relative time;
- duration;
- compact numbers;
- status labels;
- source/freshness labels.

Do not store display-formatted strings such as `"€67,024"` as the canonical fixture value.

## Validation

Add fixture integrity checks during the build phase:

- all relationship IDs resolve;
- summary totals match selectors;
- order margin components reconcile;
- campaign-linked orders exist;
- tickets reference valid customers/orders where IDs are present;
- actions reference valid actors/targets;
- approvals reference exact valid proposals;
- trace stage ordering is valid;
- scenario timestamps use one deterministic reference time;
- no duplicate IDs;
- no actual secrets or real customer data.

## Seed-data acceptance criteria

- the same order displays consistent values across Finance, Commerce, Operations, CS, and Activity;
- the incident scenario visibly propagates across affected departments;
- summary metrics derive from records;
- filters and pagination have enough data to be meaningful;
- empty/partial/stale states are explicit scenario variants;
- fixture changes do not require editing page components;
- local simulated actions can be reset;
- no page independently invents conflicting totals.