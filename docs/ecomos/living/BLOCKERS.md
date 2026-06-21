# Blockers

### BLOCK-001 — RESOLVED: Host prerequisites blocked Docker/Compose and full local platform gate

- **Phase/slice:** Phase 1A/2 local runtime and platform skeleton
- **Detected at:** 2026-06-21 during Phase 0/1 inventory
- **Resolved at:** 2026-06-21 after owner authorized install and disk was freed
- **Current safe state/commit:** Branch `build/production-ecomos`; Colima is running with Docker context `colima`; Gateway stopped; port `18789` free; local OpenClaw state remains under gitignored `.runtime/`
- **Evidence:**
  - Before resolution, `docker`, Docker Compose, Colima, and Podman were unavailable.
  - Before resolution, free disk was too low for a safe VM/container stack.
  - `df -h /` before install: ~`24GiB` free after owner-side disk cleanup.
  - `brew install docker docker-compose colima`: installed Docker `29.6.0`, Docker Compose `5.1.4`, Lima `2.1.3`, and Colima `0.10.3`.
  - `~/.docker/config.json` configured `cliPluginsExtraDirs` for `/opt/homebrew/lib/docker/cli-plugins`.
  - `docker --version`: `Docker version 29.6.0`
  - `docker compose version`: `Docker Compose version 5.1.4`
  - `colima start --cpu 2 --memory 4 --disk 20 --runtime docker`: completed and selected Docker context `colima`.
  - `docker info`: Docker daemon reachable, context `colima`, server `29.5.2`, `2` CPUs, ~`4GiB` memory.
  - `docker run --rm hello-world`: passed; Docker pulled and ran the `arm64v8` hello-world image, then removed the container.
  - `df -h /` after install/start: ~`21GiB` free.
  - Rebuildable ignored caches removed: `ecomos-ui/.next`, `references/dashboard-inspo/node_modules`
  - `postgresql@16` installed: `/opt/homebrew/opt/postgresql@16/bin/psql --version` -> `psql (PostgreSQL) 16.14 (Homebrew)`
  - Bounded Postgres 16 smoke: `/opt/homebrew/opt/postgresql@16/bin/psql -h 127.0.0.1 -p 55432 -d postgres -Atc 'select version();'` returned `PostgreSQL 16.14`; temporary server stopped and port `55432` is free
  - Host: macOS `15.3.1`, Apple M1, 8 GB RAM
- **Why work cannot safely continue:** Resolved for Docker/Compose. Phase 1 still cannot pass because BLOCK-002 and BLOCK-003 remain.
- **Options considered:**
  - Continue without Docker/Compose: rejected because topology/restart tests would be fake.
  - Install Docker/Colima after disk was freed: accepted.
  - Use local Postgres 16 only: accepted as partial prerequisite progress, but not sufficient for the documented Docker topology gate.
- **Recommended option:** Keep Colima available for local development with `colima start` when needed and `colima stop` when finished.
- **Exact owner action/value required:** None for Docker/Compose.
- **Resume command/step:** Continue with connector/test-account and OpenClaw conformance prerequisites.
- **Secrets note:** do not paste a database password into this file.

### BLOCK-002 — Provider OAuth works, but dedicated test-account/write safety is not proven

- **Phase/slice:** Phase 1B test connector accounts
- **Detected at:** 2026-06-21 before any provider write/send attempt
- **Current safe state/commit:** Composio OAuth connections are active for Outlook, Shopify, and Google Ads; read-only Composio tool calls passed; no provider write/send/update/delete was attempted
- **Evidence:**
  - `ecomos-ui/.env.local` contains `COMPOSIO_API_KEY` (value not printed or documented).
  - Composio Connected Accounts API returned active OAuth accounts for `outlook`, `shopify`, and `googleads` under a `pg-test-*` Composio user ID.
  - Read-only Composio tool execution passed:
    - Outlook: `OUTLOOK_GET_PROFILE` returned profile-shaped data.
    - Shopify: `SHOPIFY_GET_PRODUCTS_PAGINATED` returned one product page and pagination metadata.
    - Google Ads: `GOOGLEADS_LIST_ACCESSIBLE_CUSTOMERS` returned five accessible customer resource names.
  - Read-only classification checks did not prove safe test environments:
    - Shopify GraphQL shop classification returned `partnerDevelopment: false`.
    - Google Ads GAQL classification returned one `ENABLED` customer row with `customer.test_account` not true.
  - `TEST-ACCOUNT-RUNBOOK.md` requires dedicated Shopify development store, Microsoft 365 test tenant/mailbox, and Google Ads test manager/client hierarchy.
- **Why work cannot safely continue:** OAuth connectivity is now proven, but Phase 1B write/send E2E would create live-account risk unless the connected Shopify and Google Ads resources are replaced with dedicated test resources or explicitly authorized for bounded non-production testing. Outlook is read-authenticated, but send/reply E2E still requires a confirmed dedicated test recipient/mailbox policy.
- **Options considered:**
  - Treat active OAuth as sufficient: rejected because the spec requires safe dedicated test accounts and read/write round trips.
  - Run writes/sends against the connected accounts: rejected because Shopify and Google Ads classification evidence indicates live-account risk.
  - Record OAuth/read-only progress and request safe test-account correction/authorization: accepted.
- **Recommended option:** Reconnect Composio to dedicated test resources, or explicitly confirm the current connected resources are safe for bounded writes despite the classification results.
- **Exact owner action/value required:**
  - Shopify: connect a Shopify development store where `partnerDevelopment`/store classification proves non-production, or explicitly authorize bounded test writes to the current connected shop.
  - Microsoft: confirm the Outlook account is a dedicated test mailbox and provide/approve a test recipient address for send/reply round trip.
  - Google Ads: connect a Google Ads test manager/client hierarchy where GAQL reports `customer.test_account = true`, or explicitly authorize bounded mutations to the current connected customer despite `ENABLED`/non-test classification.
- **Resume command/step:** Re-run the Composio connected-account/read-only classification probe, then run the Phase 1B connector smoke suite serially only against resources confirmed safe for writes.
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
