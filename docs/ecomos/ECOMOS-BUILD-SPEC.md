# EcomOS production build specification

## Execution rule

The Codex lead follows phases in order. It may split a phase into vertical slices but must not pass a phase gate without recorded evidence. External credentials/consent are expected stop-and-ping gates.

## Phase 0 — Repository and product freeze

Deliver:

- read `AS-BUILT.md` and all production docs;
- inventory repo and references;
- remove/ignore obsolete contradictory docs;
- root pnpm workspace and standard commands planned;
- living docs initialized;
- branch and baseline commit recorded.

Gate:

- current UI checks pass;
- `AS-BUILT.md` remains unchanged unless owner directs;
- no runtime/provider secrets in repo.

## Phase 1 — Real local OpenClaw and connector smoke environment

### 1A OpenClaw

- Detect OS and prerequisites.
- Install exact OpenClaw `2026.6.9`.
- Configure gitignored persistent state, loopback token auth, hardened tool baseline.
- Start Gateway.
- Run doctor, health/status and deep security audit.
- Create a minimal persistent Gateway client/conformance harness.
- Prove session, stream, abort, restart/reconnect, agent and MCP smoke.

### 1B Test connector accounts

Build the minimum connector/secrets scaffolding required to prove:

- Shopify development-store read/write round trip;
- Outlook test-mailbox read/send/reply round trip;
- Google Ads test-account query/create/update/pause round trip.

Codex stops and requests OAuth/account values when interactive authorization is required.

Gate:

- test environment classification recorded;
- refresh/restart persistence tested;
- no live account connected;
- evidence in living docs.

## Phase 2 — Monorepo and platform skeleton

Deliver:

- `apps/api`, `apps/worker`, shared packages;
- Fastify, contracts, Drizzle/Postgres, pg-boss/outbox;
- structured logging, correlation IDs, OpenTelemetry skeleton;
- health/readiness;
- root scripts and Docker development topology;
- generated typed UI client path.

Gate:

- empty DB migration and realistic migration test;
- API/worker restart tests;
- no UI regression.

## Phase 3 — Owner authentication and RBAC

Deliver:

- one-time owner bootstrap;
- Better Auth integration or superseding ADR;
- sessions, invitations, user management;
- permission registry and role templates;
- server-side authorization middleware/use-case service;
- UI login/team/role visibility integration.

Gate:

- full permission matrix tests;
- direct API bypass tests;
- session/CSRF/rate-limit tests;
- owner/admin/CS/finance browser E2E.

## Phase 4 — Durable core: inbox, outbox, jobs, actions, approvals, traces

Deliver:

- event inbox/dedup;
- transactional outbox and leased jobs;
- action/attempt/receipt/reconciliation state machines;
- exact approvals;
- trace/evidence/audit models;
- global autonomy/write kill switches;
- UI activity/approval primitives backed by real data.

Gate:

- crash/retry/duplicate/uncertain-outcome tests;
- no network call in DB transactions;
- trace completeness tests.

## Phase 5 — Shopify commerce vertical slice

Deliver:

- production connector adapter;
- products/customers/orders/lines/fulfilments/discounts/refunds projections;
- webhook verification, sync/reconciliation;
- Commerce Orders dataset and record drawer;
- test action through shared pipeline;
- OpenClaw read/propose tools.

Gate:

- real dev-store E2E;
- duplicate/out-of-order webhooks;
- missed-event recovery;
- provider write verified and traced.

## Phase 6 — Outlook customer-service vertical slice

Deliver:

- Graph OAuth/subscriptions/delta sync;
- message/thread/ticket models;
- CS Tickets dataset/drawer;
- reply proposal/send action;
- sticky escalation;
- automation/prompt versioning foundation;
- OpenClaw CS agent tools/session.

Gate:

- real test-mailbox WISMO-style conversation;
- duplicate send prevention;
- follow-up/escalation;
- prompt-injection test corpus;
- trace and approval journey.

## Phase 7 — Chat, agents, schedules, channels

Deliver:

- full-page Chat uses real OpenClaw sessions/events;
- session mapping/history/cancel;
- agent desired/observed state UI;
- tools/permissions/autonomy;
- schedules and native channel delivery;
- daily-brief prototype with real runtime.

Gate:

- reconnect/restart continuity;
- child-agent trace linkage;
- tool grant denial;
- schedule/channel test delivery.

## Phase 8 — Tasks, Inbox, approvals, activity journeys

Deliver:

- replace task fixture store with Postgres while preserving UI behavior;
- unified Inbox read model;
- approval decisions and action updates;
- Activity & Traces full datasets/drawers;
- cross-entity navigation.

Gate:

- current task-board UX regression suite;
- role/object-scope E2E;
- approval mutation invalidation;
- complete incident investigation journey.

## Phase 9 — Finance

Deliver:

- cost/evidence model;
- order-level contribution margin;
- fees/refunds/payouts/reconciliation;
- Finance overview and subpages backed by real records;
- explainable formula/freshness.

Gate:

- totals reconcile to fixtures/dev records;
- missing/estimated data states;
- large-data query benchmarks;
- finance permissions/export tests.

## Phase 10 — Google Ads and Marketing

Deliver:

- Google Ads sync/query/mutation adapter;
- campaigns/budgets/ad groups/assets projections;
- Campaigns dataset/drawer;
- read/propose/bounded actions;
- analytics from recorded datasets with explicit test-account caveat.

Gate:

- real test-account lifecycle E2E;
- rate-limit/partial failure tests;
- campaign actions traced/reconciled;
- no claim of real test-account serving metrics.

## Phase 11 — Operations, Knowledge, Settings and remaining pages

Deliver remaining approved route families against real modules and states, including suppliers/returns/exceptions, knowledge/SOPs/research, integrations/team/runtime/settings.

Gate:

- route/state/permission completeness;
- loading/empty/stale/error/read-only review;
- responsive/accessibility review.

## Phase 12 — Autonomous workflows

Deliver versioned workflow definitions for selected end-to-end cases:

- WISMO;
- customer escalation;
- daily brief;
- margin anomaly investigation;
- fulfilment exception;
- campaign monitoring.

Roll out observe → propose → bounded autonomous. Unrestricted mode is implemented only after all action invariants pass.

Gate:

- shadow comparisons;
- adversarial tests;
- kill switches;
- no critical authorization/idempotency/reconciliation failures.

## Phase 13 — Production packaging and recovery

Deliver:

- one-command self-hosted install;
- exact container/release manifest;
- hidden OpenClaw provisioning;
- migrations, backup/restore, updates;
- health/telemetry/support bundle;
- security scans and hardening.

Gate:

- clean-machine install smoke;
- N-1 upgrade;
- full restore drill;
- OpenClaw/runtime recovery;
- critical E2E suite.

## Phase 14 — Controlled production pilot

- Connect one explicitly approved non-critical/real store in read-only shadow mode.
- Compare records/metrics/actions with provider UIs.
- Enable selected writes one capability at a time.
- Record operational runbook findings before general release.

No agent autonomously promotes a test or shadow environment to production.
