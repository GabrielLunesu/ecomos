# Blockers

### BLOCK-001 — Host prerequisites block Docker/Compose and full local platform gate

- **Phase/slice:** Phase 1A/2 local runtime and platform skeleton
- **Detected at:** 2026-06-21 during Phase 0/1 inventory
- **Current safe state/commit:** Branch `build/production-ecomos`; Gateway stopped; port `18789` free; local OpenClaw state remains under gitignored `.runtime/`
- **Evidence:**
  - `docker --version`: `command not found`
  - `docker compose version`: `command not found`
  - `df -h .`: workspace volume still ~`98%` used, ~`4.4GiB` free after cache cleanup and Postgres 16 install
  - Rebuildable ignored caches removed: `ecomos-ui/.next`, `references/dashboard-inspo/node_modules`
  - `postgresql@16` installed: `/opt/homebrew/opt/postgresql@16/bin/psql --version` -> `psql (PostgreSQL) 16.14 (Homebrew)`
  - Bounded Postgres 16 smoke: `/opt/homebrew/opt/postgresql@16/bin/psql -h 127.0.0.1 -p 55432 -d postgres -Atc 'select version();'` returned `PostgreSQL 16.14`; temporary server stopped and port `55432` is free
  - Host: macOS `15.3.1`, Apple M1, 8 GB RAM
- **Why work cannot safely continue:** Phase 2 requires a Docker development topology and enough disk to run images/services reliably. Postgres 16 is now available locally, but Docker/Compose are still unavailable and free disk remains below the safe threshold for a VM/container stack.
- **Options considered:**
  - Continue without Docker/Compose: rejected because topology/restart tests would be fake.
  - Install Docker/Colima now: rejected because Docker is absent and available disk is too low for a safe VM/image setup.
  - Use local Postgres 16 only: accepted as partial prerequisite progress, but not sufficient for the documented Docker topology gate.
- **Recommended option:** Free at least 10-15 GiB and install Docker Desktop/CLI with Compose or an approved Colima/Docker CLI stack.
- **Exact owner action/value required:** Confirm Docker is installed and available on PATH, or approve/provide a safe container-runtime setup after freeing disk.
- **Resume command/step:** Re-run `docker --version`, `docker compose version`, then continue Phase 2 platform topology setup.
- **Secrets note:** do not paste a database password into this file.

### BLOCK-002 — Dedicated connector test accounts and OAuth credentials are required

- **Phase/slice:** Phase 1B test connector accounts
- **Detected at:** 2026-06-21 before any provider connection attempt
- **Current safe state/commit:** No Shopify, Microsoft, or Google Ads account has been connected; no provider write attempted
- **Evidence:**
  - `TEST-ACCOUNT-RUNBOOK.md` requires dedicated Shopify development store, Microsoft 365 test tenant/mailbox, and Google Ads test manager/client hierarchy.
  - `INTEGRATION-STATE.md` records all three providers as disconnected.
- **Why work cannot safely continue:** OAuth consent, account creation, developer tokens, client secrets, callback configuration, and test-environment verification are explicit stop-and-ping gates. Connecting an unknown account risks live-store, live-mailbox, billable, or customer-facing side effects.
- **Options considered:**
  - Use any local/browser account found on the machine: rejected as live-account risk.
  - Build fake connectors only: rejected because Phase 1B gate explicitly requires real sandbox connectivity.
  - Stop and request dedicated test metadata/credentials: accepted.
- **Recommended option:** Create/confirm dedicated test accounts and provide credentials through a safe local secret mechanism, not Markdown.
- **Exact owner action/value required:**
  - Shopify: development store identifier, app/custom app credentials, approved localhost callback/webhook setup, and confirmation the store cannot process real transactions.
  - Microsoft: test tenant/mailbox IDs, Entra app registration, localhost redirect URI, delegated OAuth consent for `offline_access`, identity basics, `Mail.ReadWrite`, and `Mail.Send`.
  - Google Ads: test manager/client customer IDs, OAuth client, developer token with test-account access, and confirmation no billing/production hierarchy is connected.
- **Resume command/step:** Populate the local uncommitted secret mechanism requested by the implementation, then run the Phase 1B connector smoke suite serially.
- **Secrets note:** do not paste tokens, client secrets, OAuth codes, cookies, or refresh tokens into this file.

### BLOCK-003 — Full OpenClaw conformance needs safe model/runtime credentials and MCP harness

- **Phase/slice:** Phase 1A OpenClaw conformance harness
- **Detected at:** 2026-06-21 after pinned Gateway smoke
- **Current safe state/commit:** OpenClaw Gateway smoke passed and was shut down cleanly; no model prompt or agent run was executed
- **Evidence:**
  - `openclaw gateway status`: Gateway reachable, version `2026.6.9`, capability `connected-no-operator-scope`
  - `openclaw gateway call health`: `ok: true`, default model reported by Gateway logs as `openai/gpt-5.5`
  - The required conformance list includes agent run/wait, streaming/history/abort, restart/reconnect, and private MCP tool smoke.
- **Why work cannot safely continue:** Running agent prompts may use configured model/provider credentials and may be billable or tied to a live account. Private MCP smoke also requires the EcomOS MCP tool surface that has not yet been built.
- **Options considered:**
  - Run a model prompt with whatever credentials OpenClaw can find: rejected as live/billable account risk.
  - Claim conformance from Gateway health only: rejected because the spec requires session/agent/MCP behavior.
  - Stop after honest partial smoke evidence: accepted.
- **Recommended option:** Provide or approve a dedicated model/runtime test credential and allow the conformance harness to perform a minimal tagged test prompt after the MCP echo/read tool exists.
- **Exact owner action/value required:** Confirm a dedicated non-production model credential/account may be used for OpenClaw conformance, or provide one via a safe local secret mechanism.
- **Resume command/step:** Build `packages/openclaw` conformance harness after Phase 2 skeleton, then run the tagged runtime suite against `ws://127.0.0.1:18789`.
- **Secrets note:** do not paste API keys or runtime tokens into this file.

## Blocker template

### BLOCK-XXX — Title

- **Phase/slice:**
- **Detected at:**
- **Current safe state/commit:**
- **Evidence:**
- **Why work cannot safely continue:**
- **Options considered:**
- **Recommended option:**
- **Exact owner action/value required:**
- **Resume command/step:**
- **Secrets note:** do not paste a secret into this file.
