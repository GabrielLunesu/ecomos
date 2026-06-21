# 01 — System architecture

## Architecture style

EcomOS is a **modular monolith** with multiple processes from one codebase:

```text
Browser
  │ HTTPS / same origin
  ▼
Reverse proxy
  ├── Next.js web application (`ecomos-ui/`)
  └── EcomOS API (`apps/api`)
          │
          ├── Postgres 16 — canonical business state
          ├── EcomOS worker (`apps/worker`) — durable jobs/outbox
          ├── OpenClaw Gateway — private agent runtime
          └── Provider APIs — Shopify, Google Ads, Microsoft Graph
```

The modular monolith gives strong boundaries and one transactional database without adding distributed-service deployment and tracing complexity to every self-hosted store.

## Repository target

Preserve the existing UI directory:

```text
/
├── ecomos-ui/                   # approved Next.js application
├── apps/
│   ├── api/                     # Fastify API and auth entrypoint
│   └── worker/                  # jobs, sync, reconciliation
├── packages/
│   ├── contracts/               # Zod schemas, API/event/tool contracts
│   ├── db/                      # Drizzle schema, migrations, repositories
│   ├── core/                    # commands, authorization, actions, traces
│   ├── domains/                 # domain modules and use cases
│   ├── openclaw/                # persistent Gateway client and MCP bridge
│   ├── connectors/              # provider ports and adapters
│   └── testing/                 # fixtures, fakes, test harnesses
├── references/                  # read-only upstream snapshots
└── docs/ecomos/
```

A root pnpm workspace owns exact dependency versions and scripts. Node 24 is the preferred runtime.

## Layering

Each domain follows:

```text
Transport/API
  ↓ validates request shape and identity
Application/use cases
  ↓ coordinates one business operation
Domain
  ↓ pure rules, state transitions, policies
Ports
  ↓ abstract persistence/runtime/provider needs
Adapters
  ↓ Postgres, OpenClaw, Shopify, Google Ads, Graph
```

Import direction points inward. Domain modules do not import Fastify, Drizzle, OpenClaw, or provider SDKs.

## Core platform modules

### Identity

Authentication, sessions, invitation and owner bootstrap.

### Authorization

Permission registry, role grants, object-level constraints, and decision evidence.

### Command bus

One entrypoint for user commands, agent tool calls, scheduled commands, and webhook-triggered commands.

### Action pipeline

Validates and executes external side effects. It owns idempotency, approval, attempts, receipts, uncertainty, and reconciliation.

### Event inbox/outbox

- Inbox persists and deduplicates inbound provider/runtime events.
- Outbox commits future work in the same Postgres transaction as business changes.
- Worker claims, leases, retries, and dead-letters jobs durably.

### Trace service

Builds normalized traces connecting trigger, actor, context, evidence, decision, tool calls, action, provider result, and final outcome.

### Connector registry

Resolves store connector configuration, capabilities, credentials, health, sync cursors, and adapters.

### OpenClaw runtime integration

Persistent Gateway connection, runtime conformance, agent/session lifecycle, event ingestion, channel delivery, and private MCP tools.

### Secrets

Encrypted-at-rest secret values, write-only management, rotation metadata, and process-scoped resolution.

## Domain modules

- Tasks
- Customer Service
- Finance
- Marketing
- Commerce
- Operations
- Agents
- Knowledge
- Activity
- Settings
- Chat

These are code modules, not independent network services. Each owns its tables/use cases and publishes typed domain events.

## Single sources of truth

| Concern | Canonical source | EcomOS treatment |
|---|---|---|
| Users, roles, permissions | Postgres | authoritative |
| Orders/customers/products | Shopify | normalized projections + sync metadata |
| Ads campaigns/config | Google Ads | normalized projections + sync metadata |
| Mail messages/folders | Microsoft Graph | normalized messages/tickets + provider IDs |
| Tasks/tickets/workflows | Postgres | authoritative |
| Proposed/executed actions | EcomOS action ledger | authoritative |
| Human approvals | Postgres | authoritative |
| Agent runtime sessions | OpenClaw | mapped and event-mirrored for UI/trace |
| Business traces | Postgres | authoritative normalized record |
| Raw agent transcript | OpenClaw state | backed up; referenced from traces |
| Knowledge documents | Postgres/object storage | authoritative |
| Connector credentials | encrypted secret store | authoritative |

No module invents a second writable truth for another module's aggregate.

## Chain of responsibility for commands

```text
Authenticate actor
→ resolve permission context
→ validate command schema
→ authorize resource/action
→ load fresh aggregate state
→ evaluate domain policy/caps
→ create action/proposal and digest
→ obtain approval when required
→ reserve idempotency key
→ commit business change + outbox
→ worker executes external call
→ normalize provider receipt
→ update action state
→ reconcile uncertain or asynchronous outcomes
→ append trace/audit events
→ update projections/UI
```

User UI actions and OpenClaw MCP tool calls enter the same chain.

## Chain of responsibility for inbound events

```text
Receive raw request/event
→ authenticate/verify signature
→ enforce size/rate limits
→ persist raw inbox event
→ deduplicate by provider event key
→ acknowledge provider
→ normalize in worker
→ apply domain transition transactionally
→ emit outbox jobs/events
→ project read models
→ optionally start or wake an OpenClaw workflow
```

## Network boundaries

- The browser sees only the reverse proxy.
- OpenClaw binds to loopback or a private Docker network.
- Postgres is not publicly exposed.
- Provider callbacks terminate at EcomOS, not OpenClaw.
- The private MCP endpoint is reachable only from the OpenClaw process/network identity.
- Production connector and runtime credentials never enter browser bundles.

## Local topology

Local development runs the same logical components, with OpenClaw installed at an exact version and state stored in a gitignored `$OPENCLAW_STATE_DIR`. Real connector tests use dedicated test accounts.

## Scale posture

One instance should comfortably support at least:

- 100k orders in active projections;
- 100k mailbox messages;
- 25k tickets;
- 1m activity/trace events with partition/retention strategy;
- several thousand agent runs per month;
- bursty webhooks and sync jobs without duplicate actions.

Optimize measured bottlenecks. Preserve correctness and recoverability before horizontal distribution.
