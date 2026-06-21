# AGENTS.md — EcomOS production invariants

You are building **EcomOS**, a production, self-hosted operating system for one ecommerce store. EcomOS is the product. OpenClaw is a pinned internal runtime and must be invisible as a setup burden to the end user.

## Source of truth

Precedence, highest first:

1. `ecomos-ui/docs/AS-BUILT.md` — approved product and UI truth.
2. The invariants in this file.
3. `docs/ecomos/02-TECHNICAL-DECISIONS.md`.
4. `docs/ecomos/01-SYSTEM-ARCHITECTURE.md` and `ECOMOS-BUILD-SPEC.md`.
5. Domain, security, runtime, connector, testing, and operations specs under `docs/ecomos/`.
6. Living documents under `docs/ecomos/living/`.
7. `references/` — read-only inspiration, never authority.

If code and source-of-truth documents disagree, fix the disagreement in the same slice. Never silently reinterpret the approved UI.

## Non-negotiable architecture

1. **Single store per deployment.** No multi-tenant or multi-store abstraction is introduced without a superseding ADR.
2. **OpenClaw is the only agent runtime.** Initial production pin: `2026.6.9`. No automatic runtime upgrades.
3. **EcomOS owns the business.** Postgres is authoritative for users, permissions, commerce projections, tickets, tasks, workflows, actions, approvals, traces, connector state, and jobs.
4. **OpenClaw owns runtime execution.** Raw runtime sessions/config/state remain OpenClaw-owned; EcomOS records mappings and normalized events needed for product behavior and traceability.
5. **The browser never talks directly to OpenClaw or external providers.** It talks only to the EcomOS API.
6. **Domain code never calls providers or OpenClaw directly.** Calls pass through owned ports/adapters and the shared command/action pipeline.
7. **Every external side effect is traceable.** It has a stable action ID, actor, target, request digest, idempotency key, state transitions, attempts, receipts, and reconciliation result.
8. **Every inbound event is durable before processing.** Verify, persist, deduplicate, then dispatch.
9. **Authorization is server-side.** Navigation visibility is UX, never enforcement.
10. **Secrets are never committed, placed in prompts/workspace Markdown, logged, returned by read APIs, or exposed to the browser.**
11. **Unrestricted autonomy may bypass human approval only when the owner explicitly enables it.** It never bypasses schema validation, authorization, idempotency, fresh-state checks, audit, or reconciliation.
12. **`references/openclaw-mission-control/` is read-only.** Never edit it, import it at runtime, package it, or copy its token-in-Markdown, per-call WebSocket, broad shell, or Redis-list durability assumptions.

## Production engineering rules

- Build a modular monolith, not networked microservices.
- Preserve `ecomos-ui/` and integrate it incrementally; do not restart the UI.
- One vertical slice at a time: schema → domain/use case → authorization → API → UI → trace → tests → docs.
- Database changes require reviewed migrations and realistic migration tests.
- Use a transactional outbox for jobs and external work.
- Do not hold database transactions open across network calls.
- Use exact dependency versions and committed lockfiles.
- No `latest` tags in production manifests.
- No destructive test against a live merchant, mailbox, or advertising account.
- Test accounts and development stores only until the owner explicitly changes the environment classification.
- Record each phase's evidence in `docs/ecomos/living/TEST-EVIDENCE.md`.

## OpenClaw rules

- Use Gateway WebSocket/RPC for EcomOS-to-OpenClaw control.
- Use a persistent, multiplexed client; do not open a new socket per call.
- Negotiate and validate protocol, scopes, methods, events, and response schemas at startup.
- Keep the Gateway loopback/private and authenticated.
- Persist `$OPENCLAW_STATE_DIR`; back it up with EcomOS.
- Give ecommerce agents private EcomOS tools through MCP. Do not make normal agents discover/curl the EcomOS API.
- Deny host shell/filesystem access by default for store-operating agents.
- Run the OpenClaw conformance suite before and after any runtime change.

## Autonomous lead-agent rules

- One lead agent owns the branch and integrates all work.
- At most three active subagents.
- Subagents receive bounded, non-overlapping tasks and return findings or isolated commits.
- The lead alone changes shared contracts, migrations, runtime integration, or source-of-truth docs.
- Run targeted checks per slice and the full suite only at phase gates.
- Commit after each accepted slice with tests and living docs updated.

## Stop and ping the owner when

- OAuth, MFA, account creation, consent, or an external credential is required.
- A target account appears to be production/live rather than a test environment.
- An operation could spend money, send to real customers, publish ads, or destroy data.
- The pinned OpenClaw runtime does not expose a required protocol feature.
- A source-of-truth conflict cannot be resolved without a product decision.
- A migration would be destructive or cannot be made rollback-compatible.
- A security invariant or critical E2E test fails.
- Host permissions, ports, or installation steps require manual intervention.

When blocked, update `docs/ecomos/living/BLOCKERS.md` with the exact state, evidence, safest options, and one precise request needed to resume. Stop in a clean, committed or clearly documented state.
