# Build status

## Current phase

`Phase 1 — Real local OpenClaw and connector smoke environment` is blocked after Phase 0 completion and partial Phase 1A smoke.

## Product baseline

- Source of truth: `ecomos-ui/docs/AS-BUILT.md`
- Store model: single store
- Runtime: OpenClaw only
- Initial runtime pin: 2026.6.9
- UI: existing `ecomos-ui/` preserved

## Phase checklist

- [x] Phase 0 — repo/product freeze
- [ ] Phase 1 — local OpenClaw + test connectors
- [ ] Phase 2 — platform skeleton
- [ ] Phase 3 — auth/RBAC
- [ ] Phase 4 — durable actions/traces/jobs
- [ ] Phase 5 — Shopify commerce
- [ ] Phase 6 — Outlook CS
- [ ] Phase 7 — chat/agents/schedules/channels
- [ ] Phase 8 — tasks/inbox/approvals/activity
- [ ] Phase 9 — finance
- [ ] Phase 10 — Google Ads/marketing
- [ ] Phase 11 — remaining domains/pages
- [ ] Phase 12 — autonomous workflows
- [ ] Phase 13 — packaging/recovery
- [ ] Phase 14 — controlled pilot

## Active slice

Phase 1A/1B prerequisite gate.

- Branch: `build/production-ecomos`
- Repo root: `/Users/gabriellunesu/Git/ecomos`
- Product/UI truth: `ecomos-ui/docs/AS-BUILT.md`
- Production docs copied from `ecomos-production-build-kit/repo-overlay/` into active root `AGENTS.md`, `agent-prompts/`, and `docs/ecomos/`.
- Local OpenClaw CLI installed under `.runtime/openclaw-cli` at exact `2026.6.9`.
- Gateway smoke passed on loopback token auth, but full runtime conformance is not complete.
- Postgres 16.14 is installed and smoke-tested on an alternate local port.
- Docker/Compose and connector E2E are blocked by host prerequisites and external test-account credentials.

## Done

- Read `AS-BUILT.md`, production lead prompt, production invariant `AGENTS.md`, and every production doc under `docs/ecomos/`.
- Created branch `build/production-ecomos`.
- Added root `.gitignore` for local dependency/build/runtime/secrets/evidence state.
- Ran baseline UI checks; all required baseline commands exited 0, with two lint warnings recorded in `TEST-EVIDENCE.md`.
- Installed pinned local OpenClaw `2026.6.9` into gitignored repo-local runtime state.
- Configured OpenClaw Gateway for loopback port `18789`, token auth at invocation, repo-local state/config, and disabled elevated tool execution.
- Started Gateway, verified health/status/basic RPC surfaces, and shut it down cleanly.
- Removed rebuildable ignored caches `ecomos-ui/.next` and `references/dashboard-inspo/node_modules`, increasing free disk from ~`3.3GiB` to ~`5.0GiB` before Postgres 16 installation.
- Installed Homebrew `postgresql@16` (`16.14`) and smoke-tested it on `127.0.0.1:55432`; stopped the temporary process cleanly.

## Next

Owner action is required before the next phase gate can honestly pass. See `BLOCKERS.md`.
