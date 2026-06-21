# 02 — Technical decisions

A decision remains active until a later ADR explicitly supersedes it.

## ADR-001 — Single store per deployment

**Decision:** One EcomOS deployment represents one store and one cooperative team trust boundary.

**Reason:** This matches the approved UI, simplifies currency, connectors, permissions, OpenClaw isolation, backups, and support.

## ADR-002 — OpenClaw is the single runtime

**Decision:** EcomOS supports one runtime: OpenClaw. Initial verified pin is `2026.6.9`.

**Consequences:** No runtime abstraction whose only purpose is switching frameworks. We still isolate OpenClaw behind an owned adapter so protocol changes do not leak through the product.

## ADR-003 — EcomOS is the product, OpenClaw is internal infrastructure

Users see agent health, sessions, schedules, tools, permissions, traces, and outcomes in EcomOS language. They do not manage Gateway URLs, pairing, raw config, workspace Markdown, or runtime upgrades.

## ADR-004 — External app integration through Gateway RPC

The EcomOS backend controls OpenClaw through its WebSocket Gateway protocol. It does not import OpenClaw internals or plugin SDK code into the EcomOS process.

Private EcomOS capabilities are exposed to agents through MCP. Gateway RPC controls runtime lifecycle; MCP exposes business tools.

## ADR-005 — Exact runtime compatibility, fail closed

Startup validates:

- exact supported OpenClaw release;
- negotiated protocol;
- required operator scopes;
- required methods/events;
- response-schema conformance.

Newer versions are not assumed compatible. Runtime upgrades require a dedicated pull request and conformance evidence.

## ADR-006 — TypeScript modular monolith

Use one pnpm TypeScript workspace:

- existing Next.js UI;
- Fastify API;
- worker process;
- shared typed packages.

Reason: shared contracts with the UI, natural integration with the Node-based OpenClaw ecosystem, and fewer languages/toolchains in each self-hosted installation.

## ADR-007 — Postgres 16 as the business system of record

Use Drizzle migrations and repositories. Postgres stores business state, action/trace ledgers, auth, connectors, events, and job/outbox state.

## ADR-008 — Postgres-backed durable jobs

Use a Postgres-backed job system (initial target: pg-boss) plus a transactional outbox. Do not depend on an at-most-once Redis list for consequential work.

## ADR-009 — Better Auth for authentication primitives

Initial target: Better Auth, pinned and reviewed, for email/password sessions, account/session management, administrator operations, rate limiting, and optional 2FA/passkeys.

EcomOS retains its own permission registry and authorization decisions. Auth-library roles are not the sole business authorization model.

If the auth spike discovers a blocking self-hosted or integration constraint, Codex must write a superseding ADR before choosing another maintained library. No hand-written password/session cryptography.

## ADR-010 — First-party connector adapters

Initial Shopify, Google Ads, and Microsoft Graph integrations are owned adapters behind EcomOS ports. A connector broker may be added later without changing domain contracts, but production correctness must not rely on an agent directly calling arbitrary third-party tools.

## ADR-011 — Business tools through private MCP

OpenClaw agents call typed EcomOS tools, not provider APIs and not arbitrary EcomOS REST endpoints. Tool schemas carry intent, side effects, required permissions, approval behavior, and idempotency semantics.

## ADR-012 — One command/action path

Human actions, agent actions, schedules, and event-triggered actions share one server-side command/action pipeline. There is no privileged “agent shortcut.”

## ADR-013 — Approval is bound to an immutable proposal

Approvals reference a cryptographic digest of exact action type, target, parameters, policy version, and expiry. Changing the action invalidates the approval.

## ADR-014 — Traceability over hidden reasoning

EcomOS stores a concise decision summary, evidence, tool calls, inputs/outputs, policies, and outcomes. It does not require or expose private model chain-of-thought.

## ADR-015 — Desired/observed runtime state

Agent provisioning/configuration is reconciled:

- EcomOS records desired state.
- Worker applies it to OpenClaw.
- EcomOS records observed state and retries until converged or terminally blocked.

No provider/runtime network call occurs inside a long database transaction.

## ADR-016 — Production UI evolves from `ecomos-ui/`

The approved UI remains in place. Backend integration replaces fixture selectors gradually behind typed data-access boundaries. Rebuilding the visual shell is out of scope unless `AS-BUILT.md` is explicitly revised.

## ADR-017 — Test accounts before feature development

A real local OpenClaw runtime and dedicated Shopify, Google Ads, and Outlook test connectivity are phase-zero/phase-one gates. No live merchant account is used by autonomous tests.
