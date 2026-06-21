# Risk register

| Risk | Likelihood | Impact | Mitigation | Current evidence/state |
|---|---:|---:|---|---|
| OpenClaw protocol/release drift | High | High | Exact pin + conformance suite | Initial pin 2026.6.9 |
| Agent action duplicates | Medium | Critical | Action ledger, idempotency, reconciliation | Not implemented |
| OAuth token loss/leak | Medium | Critical | Encryption, write-only APIs, rotation, redaction | Not implemented |
| UI/backend contract drift | Medium | High | Shared schemas + vertical slices | UI contract exists |
| Test environment accidentally live | Low/Medium | Critical | Environment classification + hard write block | Runbook defined |
| Local machine resource exhaustion | Medium | Medium | One lead, max 3 subagents, staged checks | Build rule defined |
| Incomplete backup (DB without OpenClaw) | Medium | High | Unified backup/restore drill | Spec defined |
| Prompt injection reaches broad tools | Medium | Critical | Private MCP, narrow grants, deterministic action pipeline | Not implemented |
| Financial values misleading | Medium | High | Versioned contribution-margin formula + data quality | UI fixture baseline exists |
