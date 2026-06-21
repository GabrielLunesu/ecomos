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

## Shopify

- Environment: required `test` development store
- Account/store ID: TBD
- Scopes: TBD/reviewed during connection
- Connected: no
- Last health/E2E: blocked pending dedicated development-store credentials and OAuth/app setup

## Microsoft Outlook

- Environment: required test tenant/mailbox
- Tenant/mailbox ID: TBD
- Delegated scopes: expected Mail.ReadWrite + Mail.Send + offline_access
- Connected: no
- Last health/E2E: blocked pending dedicated test tenant/mailbox, Entra app/OAuth consent, and safe callback setup

## Google Ads

- Environment: required test manager/client hierarchy
- Customer IDs: TBD
- Connected: no
- Serving metrics available: no by design
- Last health/E2E: blocked pending dedicated Google Ads test manager/client hierarchy, OAuth client, developer token, and customer IDs
