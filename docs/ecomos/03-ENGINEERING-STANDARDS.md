# 03 — Engineering standards

## Build method

Work in vertical slices. A slice is complete only when it includes all relevant layers:

```text
migration/schema
→ domain rule/use case
→ authorization
→ API or MCP contract
→ worker/provider adapter
→ trace/action behavior
→ UI integration
→ tests
→ documentation/evidence
```

Do not accumulate a large backend and connect the UI at the end.

## Package boundaries

- `contracts` contains schemas and public event/tool contracts, no business implementation.
- `db` contains database schema, migrations, transaction helpers, and repository adapters.
- `core` contains platform services used by domains.
- `domains` contains module-owned aggregates and use cases.
- `connectors` contains provider ports and adapters.
- `openclaw` contains only runtime integration.
- API routes call use cases; they do not orchestrate providers.
- UI calls generated/typed API clients; no ad hoc fetch shapes.

Enforce boundaries through lint rules and dependency tests.

## Error contract

Every API error has:

- stable code;
- HTTP status;
- safe message;
- optional field issues;
- correlation/trace ID;
- retryability;
- no stack trace or secret.

Domain errors are distinct from transport/provider errors. Unknown external outcomes are not reported as ordinary failures.

## Transactions

- One use case controls one database transaction.
- Do not perform OpenClaw or provider network calls inside transactions.
- Commit state and outbox together.
- Use row/advisory locks for conflicting aggregate operations.
- Use unique constraints as final idempotency enforcement.

## Migrations

- One focused migration per slice where practical.
- Forward and rollback/compatibility strategy documented.
- Test empty database and realistic N-1 fixture upgrade.
- Use expand/migrate/contract for destructive changes.
- Never depend on auto-sync schema in production.

## Types and validation

- TypeScript strict mode everywhere.
- Runtime input validation with Zod.
- Avoid `any`; external SDK payloads are parsed at adapter boundaries.
- Monetary values use integer minor units plus currency.
- Percentages/ratios use explicit units.
- Store instants in UTC and retain store timezone separately.

## Observability

- Structured Pino logs.
- Correlation IDs across API, jobs, OpenClaw RPC, MCP, and provider calls.
- OpenTelemetry traces and metrics.
- Logs describe IDs and state—not customer bodies, tokens, or full tool payloads.
- Health differentiates liveness, readiness, and dependency degradation.

## Documentation

Living docs describe current state, remaining work, blockers, risks, and evidence. They are not chronological changelogs.

Each completed slice updates:

- `living/BUILD-STATUS.md`
- `living/TEST-EVIDENCE.md`
- `living/RISK-REGISTER.md` when relevant
- source-of-truth docs if behavior changed

## Commit discipline

- Conventional commits.
- One coherent slice per commit/PR.
- Include migration/test evidence.
- Never mix broad formatting with behavior changes.
- No generated secrets, runtime state, test-account tokens, or OpenClaw state in Git.

## Resource-aware validation

To avoid development-machine crashes:

- run focused unit/contract tests during implementation;
- run only the affected package typecheck/lint;
- serialize real connector tests;
- run full workspace checks once at phase gates;
- record skipped checks and reason;
- never claim “green” when a check was not run.

## Definition of done

A slice is done when:

- acceptance criteria are demonstrated;
- permission decisions are tested;
- idempotency and failure states are tested where applicable;
- logs and errors are secret-safe;
- migrations pass;
- real sandbox integration passes where relevant;
- trace/action records are complete;
- UI has loading/empty/error/read-only behavior;
- docs and test evidence are current.
