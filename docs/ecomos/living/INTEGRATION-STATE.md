# Integration state

Metadata only. Never place credentials or refresh tokens here.

## OpenClaw

- Version: `2026.6.9 (c645ec4)`
- Installed: yes, repo-local under `.runtime/openclaw-cli`
- State directory: `.runtime/openclaw-state` (gitignored, chmod `700` after smoke)
- Config path: `.runtime/openclaw-config/openclaw.json`
- Gateway endpoint: `ws://127.0.0.1:18789`
- Auth: token supplied from `.runtime/openclaw-secrets/gateway-token` at process invocation; secret value is not documented
- Conformance: partial only
  - `openclaw --version`: passed
  - `openclaw config validate`: passed
  - `openclaw gateway run --auth token --bind loopback --port 18789`: started and stopped cleanly
  - `openclaw gateway status`: reachable, Gateway version `2026.6.9`, capability `connected-no-operator-scope`
  - `openclaw gateway health`: `OK`
  - `openclaw gateway call health`: returned `ok: true`, default agent `main`, zero sessions
  - `openclaw agents list`: returned default `main`
  - `openclaw sessions list`: returned zero sessions
  - Not run: agent prompt/run/wait, streaming, abort, restart/reconnect conformance, private MCP tool smoke
- Security audit: partial pass
  - `openclaw security audit --deep --json`: `critical: 0`
  - Warning retained: loopback reverse-proxy/trusted-proxy note, not relevant while Control UI remains local-only
  - State dir permission warning was remediated with `chmod 700`

## Local data services

- PostgreSQL 16: installed via Homebrew `postgresql@16`
- Version: `PostgreSQL 16.14 (Homebrew)`
- Default cluster: `/opt/homebrew/var/postgresql@16`
- Service state: not started persistently by EcomOS
- Smoke: started manually on `127.0.0.1:55432`, `select version()` returned `PostgreSQL 16.14`, then stopped cleanly
- Cleanup: `lsof -nP -iTCP:55432 -sTCP:LISTEN` returned no listener
- Docker/Compose: available through Homebrew Docker CLI, Compose plugin, and Colima
- Docker client: `Docker version 29.6.0`
- Docker server: Colima context `colima`, Docker server `29.5.2`
- Docker Compose: `Docker Compose version 5.1.4`
- Colima: `0.10.3`, running with macOS Virtualization.Framework, Docker runtime, `2` CPUs, `4GiB` memory, `20GiB` disk
- Docker socket: `unix:///Users/gabriellunesu/.colima/default/docker.sock`
- Smoke: `docker run --rm hello-world` passed and removed its container

## Shopify

- Environment: owner-authorized bounded test writes against current connected shop
- Account/store ID: redacted in docs
- Composio connected account: active OAuth2 account present; ID and secret values omitted from docs
- Read-only smoke: `SHOPIFY_GET_PRODUCTS_PAGINATED` returned one product page and pagination metadata
- Classification: Shopify GraphQL shop classification returned `partnerDevelopment: false`
- Write smoke: draft test product was created, fetched, deleted, and confirmed absent with post-delete `Not Found`
- Connected: OAuth and bounded write verified
- Last health/E2E: bounded create/delete smoke passed; broader Shopify vertical slice still pending first-party adapter and pipeline implementation

## Microsoft Outlook

- Environment: owner-authorized bounded test writes against current connected mailbox
- Tenant/mailbox ID: redacted in docs
- Delegated scopes: expected Mail.ReadWrite + Mail.Send + offline_access
- Composio connected account: active OAuth2 account present; ID and secret values omitted from docs
- Read-only smoke: `OUTLOOK_GET_PROFILE` returned profile-shaped Microsoft Graph data
- Write smoke: self-addressed email send passed; sent copy and delayed inbox copy were deleted; final Deleted Items sweep found no matching message
- Connected: OAuth and bounded send/delete verified
- Last health/E2E: bounded send cleanup passed; full CS reply journey still pending first-party ticket/action pipeline

## Google Ads

- Environment: owner-authorized bounded test writes against current connected customer
- Customer IDs: redacted in docs
- Composio connected account: active OAuth2 account present; ID and secret values omitted from docs
- Read-only smoke: `GOOGLEADS_LIST_ACCESSIBLE_CUSTOMERS` returned five accessible customer resource names
- Classification: GAQL classification returned one `ENABLED` customer row with `customer.test_account` not true
- Write smoke: validate-only campaign name update passed; campaign name was temporarily marked and restored; final status remained `ENABLED`
- Exact create gate: passed through Composio proxy execution for the missing CampaignBudget API path
  - Created an explicitly shared tiny disposable campaign budget
  - Created a disposable Search campaign in `PAUSED` status
  - Verified the campaign stayed `PAUSED`
  - Validate-only updated the campaign, applied the update while keeping it `PAUSED`, and verified it
  - Removed the campaign, then removed the disposable campaign budget
- Connected: OAuth, bounded update/restore, and bounded create/update/pause/remove cleanup verified
- Serving metrics available: not relied on
- Last health/E2E: query, reversible update/restore, and disposable create/update/pause/remove cleanup passed
