# 11 — Operations and recovery

## Production deployment

One release bundle contains exact versions for:

- reverse proxy;
- EcomOS web;
- EcomOS API;
- EcomOS worker;
- Postgres 16;
- OpenClaw 2026.6.9;
- migrations and release manifest.

OpenClaw is installed/configured by EcomOS deployment automation. The user never performs separate runtime onboarding.

## Persistent state

Back up together:

- Postgres;
- `$OPENCLAW_STATE_DIR`;
- uploaded/knowledge files or object storage;
- encrypted secret payload metadata;
- instance master key through a separate protected procedure;
- release/config manifest.

A Postgres-only backup is not a complete EcomOS backup.

## Health

### Liveness

Process event loop is alive. It does not depend on providers.

### Readiness

Checks:

- Postgres and migrations;
- worker/job system;
- secrets key access;
- OpenClaw handshake/conformance;
- required internal contracts.

Provider outages degrade features but do not necessarily make the whole API unready.

### Dependency health

Expose safe summaries for:

- Shopify;
- Outlook/Graph;
- Google Ads;
- OpenClaw;
- jobs/backlog;
- last backups;
- storage/disk.

## Observability

- Structured logs.
- OpenTelemetry traces from HTTP → command → job → OpenClaw/MCP/provider.
- Metrics for request latency/errors, job backlog, event lag, connector rate limits, runtime reconnects, action states, reconciliation age, and autonomy activity.
- Product health UI consumes normalized EcomOS health, not raw OpenClaw diagnostics.

## Backups

- Automated encrypted daily backup minimum.
- Retention tiers configurable.
- Verify checksums and restoreability.
- Periodic full restore drill.
- Backup job and result visible in Settings/Activity.

## Restore

1. Enter maintenance mode.
2. Stop external writes and workers.
3. Restore matching release/config.
4. Restore Postgres.
5. Restore OpenClaw state and files.
6. Restore/provide instance master key.
7. Run migration/compatibility checks without writes.
8. Start OpenClaw and conformance probe.
9. Start API/worker.
10. Reconcile jobs/actions/connectors before resuming automation.

## Updates

- Exact signed/tagged EcomOS release.
- Exact OpenClaw version in release manifest.
- Pre-update backup and validation.
- Maintenance/drain mode.
- Expand-compatible migrations.
- Start new release and run health/conformance/E2E smoke.
- Resume jobs/actions.
- Rollback code only when database compatibility permits.

OpenClaw is never updated independently or through its own automatic channel in production.

## Runtime recovery

On OpenClaw disconnect:

- mark runtime degraded;
- stop starting new agent runs;
- preserve user/provider workflows in durable queues;
- reconnect with backoff;
- validate new `hello-ok` generation;
- reconcile active sessions/runs/actions;
- surface uncertainty instead of inventing completion.

## Provider recovery

- Keep last-good projections with freshness warning.
- Pause writes for invalid auth or sustained failures.
- Retry rate-limit/temporary failures within policy.
- Reauthorize through admin flow.
- Run incremental reconciliation after recovery.

## Maintenance controls

- global write pause;
- global autonomy pause;
- per-connector pause;
- job drain;
- event ingestion continues where safe;
- read-only UI mode;
- backup/restore CLI;
- support bundle export with redaction.

## Disaster scenarios

Runbooks/tests cover:

- corrupted/missing OpenClaw state;
- database loss;
- lost secret key;
- expired connector OAuth;
- stuck/poison job;
- disk exhaustion;
- incompatible OpenClaw upgrade;
- partially executed external action;
- compromised user account.

## Supportability

A sanitized support bundle includes:

- EcomOS/OpenClaw versions;
- configuration shape without secrets;
- health summary;
- migration state;
- recent error codes/correlation IDs;
- job/action counts;
- security audit summary;
- no customer bodies, tokens, or full transcripts by default.
