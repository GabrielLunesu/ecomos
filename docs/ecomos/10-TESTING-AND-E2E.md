# 10 — Testing and E2E strategy

## Principle

Tests prove invariants and real behavior; they are not a percentage target. Production readiness requires deterministic local tests, real OpenClaw conformance, and dedicated-provider-account E2E evidence.

## Test layers

### Unit

Pure domain rules, selectors, calculations, state machines, permission matching, canonical action digests, formatters, and retry classification.

### Contract

- API Zod/OpenAPI request and response schemas;
- MCP tool schemas;
- domain event versions;
- OpenClaw Gateway frames/events;
- provider payload parsers using recorded fixtures.

### Database integration

Run against real Postgres with migrations:

- repositories;
- transactions and locks;
- inbox/outbox atomicity;
- job leases/retries;
- unique idempotency constraints;
- action/approval transitions;
- realistic N-1 migration.

### Runtime conformance

Run against the exact local OpenClaw release. See `06-OPENCLAW-RUNTIME.md`.

### Connector sandbox integration

Serial tests against dedicated Shopify, Google Ads, and Microsoft sandbox accounts. Every test creates tagged resources and cleans them safely where possible.

### API/service integration

Exercise real modules with fake/recorded connectors for deterministic breadth, then sandbox connectors for critical paths.

### UI component and route

Preserve current fixture integrity checks and add Testing Library coverage for permission states, records, errors, drawers, and mutations.

### Browser E2E

Playwright through the full same-origin stack:

- owner bootstrap/login;
- role-based navigation/access;
- connector setup states;
- core journeys;
- approvals;
- chat/runtime streaming;
- restart/recovery behaviors.

## Critical E2E journeys

### Runtime

Install → start Gateway → EcomOS handshake → agent/session → stream response → abort → restart Gateway → reconnect → continue.

### Shopify commerce

Sync products/orders → receive verified webhook → update projection → inspect order → create bounded test discount/fulfilment action → verify provider → trace.

### Outlook customer service

Receive test email → create/thread ticket → agent drafts/proposes reply → send to test mailbox → receive customer follow-up → state/trace updates → escalation.

### Google Ads

Connect test hierarchy → query campaigns → create/update/pause tagged test campaign → verify changes → action trace. Analytics use recorded data because test accounts do not serve.

### Approval

Agent proposal → exact approval → execute → verify provider → trace. Then mutate proposal and prove old approval is rejected.

### Uncertain outcome

Inject connection loss after request send → mark uncertain → reconcile → avoid duplicate action.

### Permissions

Owner creates CS user → user sees only allowed pages/records → direct forbidden API/MCP calls fail → role update takes effect.

### Backup/restore

Create data/runtime session/action → backup → destroy local instance state → restore → verify DB, secrets, OpenClaw state, connector metadata, and action continuity.

## Failure and chaos tests

- Postgres restart;
- worker crash after job claim;
- OpenClaw restart during run;
- provider 429/5xx/timeouts;
- expired/revoked OAuth token;
- duplicate/out-of-order webhooks;
- queue lease expiry;
- partial provider response;
- disk-full/low-space warning where practical;
- clock/timezone edge cases.

## Performance tests

Representative dataset benchmarks:

- 100k orders;
- 100k messages;
- 25k tickets;
- 1m activity/trace rows.

Measure:

- common page/API p95;
- sync throughput;
- event backlog recovery;
- trace query performance;
- agent event ingestion;
- worker memory/CPU.

Set budgets from measured baseline; do not optimize invented bottlenecks.

## Test data

- No real customer data in fixtures.
- Provider sandbox resources use an `ecomos-test-<run-id>` marker.
- Recorded production-like metrics must be sanitized and explicitly fixture-labelled.
- Time is injectable/deterministic.

## Execution cadence

Per slice:

- focused unit/contract/integration tests;
- affected package typecheck/lint;
- one relevant E2E where affordable.

Per phase gate:

- full workspace checks;
- migration suite;
- runtime conformance if runtime-related;
- connector sandbox suite if connector-related;
- critical Playwright journeys.

## Evidence

For every phase record in `living/TEST-EVIDENCE.md`:

- commit SHA;
- environment versions;
- commands;
- result counts;
- sandbox resources created;
- failures/known skips;
- screenshots/log artifact locations;
- cleanup result.

Never summarize an unrun check as passing.
