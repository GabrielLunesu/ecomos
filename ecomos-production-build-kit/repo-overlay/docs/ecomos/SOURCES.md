# External sources and version date

Research date: **2026-06-21**.

Primary sources used for the runtime and test-environment decisions:

- OpenClaw official documentation — overview, installation, Gateway protocol, external applications, MCP, security, secrets, health, and observability.
- OpenClaw official GitHub releases — stable release `2026.6.9`; `2026.6.10-beta.1` is pre-release and not selected.
- Shopify developer documentation — development stores.
- Google Ads API documentation — test accounts.
- Microsoft Learn — Microsoft 365 developer sandbox and Microsoft Graph permissions.
- Better Auth official documentation — authentication, admin and access-control capabilities.
- `references/openclaw-mission-control/` — pinned read-only implementation reference and failure-mode corpus.

Important runtime facts captured in these docs:

- External applications should use OpenClaw Gateway WebSocket/RPC and pin the tested version.
- OpenClaw does not currently publish a public external npm client package.
- Gateway protocol negotiates versions/features and streams events.
- OpenClaw assumes one trusted operator boundary per Gateway, which aligns with one store per deployment.
- OpenClaw state directories contain secrets/transcripts and must be protected/backed up.
- Shopify dev stores cannot process real transactions.
- Google Ads test accounts have no billing/serving data and cannot interact with production.
- Microsoft developer sandboxes are development-only, eligibility-dependent, and can include Outlook/sample Graph data.
