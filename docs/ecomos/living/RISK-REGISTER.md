# Risk register

| Risk | Likelihood | Impact | Mitigation | Current evidence/state |
|---|---:|---:|---|---|
| OpenClaw protocol/release drift | High | High | Exact pin + conformance suite | Initial pin 2026.6.9 |
| Agent action duplicates | Medium | Critical | Action ledger, idempotency, reconciliation | Not implemented |
| OAuth token loss/leak | Medium | Critical | Encryption, write-only APIs, rotation, redaction | Not implemented |
| UI/backend contract drift | Medium | High | Shared schemas + vertical slices | UI contract exists |
| Test environment accidentally live | Low/Medium | Critical | Environment classification + hard write block | Runbook defined |
| Local machine resource exhaustion | High | High | One lead, max 3 subagents, staged checks; free disk before Docker/runtime downloads | Host has 8 GB RAM, Apple M1, and only ~4.4 GiB free after cache cleanup and Postgres 16 install |
| Incomplete backup (DB without OpenClaw) | Medium | High | Unified backup/restore drill | Spec defined |
| Prompt injection reaches broad tools | Medium | Critical | Private MCP, narrow grants, deterministic action pipeline | Not implemented |
| Financial values misleading | Medium | High | Versioned contribution-margin formula + data quality | UI fixture baseline exists |
| Missing local Docker/Compose | High | High | Install Docker Desktop/CLI or approved Colima/Docker CLI after freeing disk | Postgres 16.14 installed and smoke-tested; `docker --version` and `docker compose version` are not found on PATH |
| Runtime conformance incomplete | Medium | High | Run conformance with dedicated model/provider credentials and no live/billable account ambiguity | Gateway health passed, but agent run/wait/stream/abort and MCP smoke were not run |
