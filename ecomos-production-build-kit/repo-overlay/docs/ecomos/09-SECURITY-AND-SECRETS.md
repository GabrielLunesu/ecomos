# 09 — Security and secrets

## Trust model

One deployment represents one store and one cooperative team. Humans can have different permissions, but OpenClaw is not treated as an adversarial multi-tenant isolation boundary.

The Gateway, backend, worker, database, and secrets belong to one store trust boundary. OpenClaw remains private and is never exposed as a public user API.

## Primary threats

- stolen human session;
- over-privileged team member;
- prompt injection in email, order notes, documents, ads, or web research;
- stolen OAuth/provider/runtime token;
- malicious dependency/plugin/skill;
- duplicate or ambiguous external action;
- exposed Gateway/database;
- unsafe backup/log/diagnostic handling;
- compromised agent workspace or broad shell access.

## Network baseline

- One public HTTPS origin through reverse proxy.
- API and web same origin.
- OpenClaw loopback/private network only.
- Postgres private only.
- MCP private only.
- Explicit proxy/origin configuration.
- No direct public OpenClaw Control UI in production.

## Secrets

Secret values are:

- encrypted at rest with an instance master key outside the database;
- write-only through admin APIs;
- resolved only inside the process/adapter needing them;
- represented by handles/metadata elsewhere;
- rotated/revoked with audit;
- excluded from logs, traces, errors, fixtures, prompts, and workspaces.

OpenClaw `$OPENCLAW_STATE_DIR` may contain secrets and transcripts. Protect its filesystem permissions and include it in encrypted backup policy.

## Key hierarchy

- Instance master key from Docker/host secret.
- Per-secret data-encryption key or authenticated encryption envelope.
- Key version recorded for rotation.
- Database dump alone cannot decrypt secrets.
- Recovery procedure requires both encrypted backup and protected key material.

## Prompt/content injection

External content is tainted:

- email bodies and attachments;
- Shopify notes/messages;
- product/supplier content;
- ad/creative text;
- research pages/documents;
- webhook payloads.

Controls:

- preserve raw source separately;
- sanitize active content;
- extract structured facts with provenance;
- never allow external content to grant a tool, alter permissions, install plugins, change runtime configuration, or write authoritative policy;
- all side effects pass deterministic EcomOS validation;
- domain-specific tool sets are narrow;
- agents do not hold raw provider credentials.

## OpenClaw hardening

- exact pinned version and shrinkwrapped package;
- `openclaw security audit --deep` at install and release gates;
- loopback token auth;
- dedicated OS user/container;
- explicit plugin/skill allowlist;
- sandbox scope `agent` or stricter;
- workspace access none/read-only by default;
- store-operating agents: exec denied, elevated disabled;
- no broad home-directory mounts;
- logs/transcripts redacted and retained deliberately.

## Application hardening

- secure cookies and CSRF protection;
- rate limits on auth, OAuth, webhooks, actions, and tool endpoints;
- body-size limits;
- strict input validation;
- safe response headers;
- CSP for the web app;
- SSRF-aware URL fetching;
- attachment/content-type validation;
- prepared queries/ORM parameterization;
- dependency and container scanning;
- non-root containers;
- read-only filesystems where practical.

## PII

- Collect only fields needed for operations.
- Permission-gate customer PII.
- Mask in logs and low-privilege views.
- Restrict exports.
- Support customer-data lookup/anonymization/deletion workflows.
- Document retention and backup deletion limits.

## Audit and alerts

Alert on:

- repeated auth failures;
- role/permission changes;
- secret access/rotation;
- connector reauthorization;
- autonomy/tool-grant changes;
- unusual action volume/value;
- OpenClaw version/config drift;
- runtime security-audit findings;
- reconciliation failures;
- backup/restore failures.

## Security tests

- authorization matrix and direct API bypass attempts;
- CSRF/session fixation/revocation;
- webhook signature/replay/body limits;
- secret redaction snapshots;
- prompt-injection corpus;
- MCP tool grant denial;
- shell/filesystem denial for operational agents;
- SSRF and unsafe URL tests;
- dependency/secret scanning;
- restore with and without encryption key;
- runtime exposed-port checks.
