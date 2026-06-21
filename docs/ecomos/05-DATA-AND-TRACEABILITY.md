# 05 — Data and traceability

## Data principles

- Postgres is the canonical EcomOS database.
- Provider data is stored as normalized projections with provider IDs, version/freshness, and raw-event references.
- External writes are represented in an append-oriented action ledger.
- Derived dashboard values are reproducible from stored records and source metadata.
- Raw sensitive payload retention is minimized and configurable.

## Core platform tables

### Identity

Auth-library tables plus:

- users_profile
- roles
- permissions
- role_permissions
- user_roles
- user_permission_overrides

### Store and connectors

- store
- connector_accounts
- connector_capabilities
- connector_secrets metadata
- connector_sync_cursors
- sync_runs
- sync_errors

### Durable processing

- event_inbox
- event_dedup_keys
- outbox_events
- job_runs
- dead_letters

### Agent/runtime

- agents
- agent_desired_state
- agent_observed_state
- runtime_sessions
- runtime_events
- schedules
- channel_destinations

### Actions and approvals

- action_requests
- action_attempts
- external_receipts
- approvals
- approval_decisions
- reconciliations

### Trace/evidence

- traces
- trace_spans
- evidence_items
- audit_events

## Domain records

Commerce, CS, finance, marketing, operations, tasks, knowledge, and chat tables are detailed in `12-DOMAIN-MODULES.md`.

## Monetary representation

- Integer minor units (`amount_minor`).
- ISO currency code on every amount or inherited only from a strictly single-currency aggregate.
- Never use binary floating point for money.
- Ratios and percentages have named units and precision.
- Contribution-margin formula/version is stored with each snapshot or calculation run.

## Provider projection metadata

Every projected provider record includes:

- provider/account ID;
- provider resource ID;
- source updated timestamp/version where available;
- EcomOS fetched timestamp;
- raw event/sync run reference;
- deleted/tombstoned state;
- data quality status.

## Event inbox

Inbound events store:

- internal event ID;
- provider and account;
- provider event ID/dedup key;
- verified status and signature metadata;
- received timestamp;
- bounded/redacted headers;
- encrypted or minimized raw payload when needed;
- normalization/processing state;
- attempts and terminal error.

A unique constraint enforces deduplication.

## Outbox and jobs

Business transactions insert outbox rows. A dispatcher publishes/claims work through the Postgres job system. Jobs use:

- stable type and schema version;
- aggregate/action ID;
- idempotency key;
- available-at time;
- lease owner/expiry;
- attempt count;
- retry policy;
- terminal state;
- trace ID.

## Action ledger

State machine:

```text
proposed
→ rejected_by_policy | awaiting_approval | authorized
→ queued
→ executing
→ succeeded | failed | outcome_uncertain
→ reconciled_succeeded | reconciled_failed | manually_resolved
```

Each action records:

- actor type/id (human, agent, schedule, event, system);
- exact action type and target;
- normalized parameters;
- cryptographic request digest;
- policy and tool versions;
- source evidence IDs;
- approval requirement and decision;
- idempotency key;
- provider attempts;
- safe request/response summaries;
- provider receipt IDs;
- final outcome.

## Approval record

An approval contains:

- exact action digest;
- proposer;
- eligible decision permissions;
- reason and evidence;
- expected financial/customer impact;
- creation/expiry;
- decision actor/time/reason;
- optional modified proposal (new action and new approval);
- result/action link.

## Trace model

A business trace is not private chain-of-thought. It is a structured reconstruction:

```text
Trigger
→ actor/session
→ context assembled
→ evidence retrieved
→ decision/proposal summary
→ tools/commands requested
→ authorization/policy result
→ approval result
→ provider/runtime attempts
→ outcome and reconciliation
→ related records/tasks/messages
```

OpenClaw events and session references are attached as evidence/spans. Raw transcripts remain protected runtime data.

## Audit model

Audit events are append-only and include:

- actor;
- operation;
- target;
- before/after field summary where safe;
- authorization decision;
- trace ID;
- request/correlation ID;
- timestamp and source IP/device metadata.

Secrets, passwords, raw tokens, full customer messages, and full provider payloads are excluded.

## Retention

Default policy proposal:

- business records: retained while store uses EcomOS;
- audit/action records: 24 months configurable;
- raw webhooks: 30–90 days unless needed for dispute/debug;
- normalized messages/tickets: configurable according to merchant policy;
- OpenClaw transcripts: bounded retention and backed up only when enabled;
- logs: short operational retention with redaction;
- deletion/anonymization jobs for customer privacy requests.

## Integrity tests

- foreign references resolve;
- projection/provider IDs are unique per account;
- action transitions are valid;
- approval digest matches action;
- idempotency produces one external effect;
- financial rollups reconcile to records;
- trace spans reference existing actors/actions/evidence;
- retries cannot create duplicate discounts/messages/refunds;
- raw events cannot be processed before verification/persistence.
