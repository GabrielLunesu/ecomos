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

- Environment: required `test` development store; current connected account is not proven safe for writes
- Account/store ID: redacted in docs
- Composio connected account: active OAuth2 account present; ID and secret values omitted from docs
- Read-only smoke: `SHOPIFY_GET_PRODUCTS_PAGINATED` returned one product page and pagination metadata
- Classification: Shopify GraphQL shop classification returned `partnerDevelopment: false`
- Connected: read-only OAuth verified
- Last health/E2E: write round trip blocked until a development store is connected or current shop is explicitly authorized for bounded test writes

## Microsoft Outlook

- Environment: required test tenant/mailbox; dedicated mailbox classification still requires owner confirmation
- Tenant/mailbox ID: redacted in docs
- Delegated scopes: expected Mail.ReadWrite + Mail.Send + offline_access
- Composio connected account: active OAuth2 account present; ID and secret values omitted from docs
- Read-only smoke: `OUTLOOK_GET_PROFILE` returned profile-shaped Microsoft Graph data
- Connected: read-only OAuth verified
- Last health/E2E: send/reply round trip blocked until owner confirms the mailbox and recipient are dedicated test resources

## Google Ads

- Environment: required test manager/client hierarchy; current connected account is not proven safe for mutations
- Customer IDs: redacted in docs
- Composio connected account: active OAuth2 account present; ID and secret values omitted from docs
- Read-only smoke: `GOOGLEADS_LIST_ACCESSIBLE_CUSTOMERS` returned five accessible customer resource names
- Classification: GAQL classification returned one `ENABLED` customer row with `customer.test_account` not true
- Connected: read-only OAuth verified
- Serving metrics available: not relied on
- Last health/E2E: create/update/pause round trip blocked until a test hierarchy is connected or current customer is explicitly authorized for bounded test mutations
