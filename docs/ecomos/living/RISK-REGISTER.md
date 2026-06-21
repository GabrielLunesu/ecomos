# Risk register

| Risk | Likelihood | Impact | Mitigation | Current evidence/state |
|---|---:|---:|---|---|
| OpenClaw protocol/release drift | High | High | Exact pin + conformance suite | Initial pin 2026.6.9 |
| Agent action duplicates | Medium | Critical | Action ledger, idempotency, reconciliation | Not implemented |
| OAuth token loss/leak | Medium | Critical | Encryption, write-only APIs, rotation, redaction | Not implemented |
| UI/backend contract drift | Medium | High | Shared schemas + vertical slices | UI contract exists |
| Test environment accidentally live | Medium | Critical | Environment classification + hard write block | Owner authorized bounded writes; Outlook/Shopify cleanup passed; Google Ads reversible update was restored; Google Ads disposable paused campaign and disposable budget were removed. Continue to avoid unbounded sends, enabled campaigns, spend, or customer-facing mutations |
| Local machine resource exhaustion | Medium | High | One lead, max 3 subagents, staged checks; keep Colima bounded and stop it when idle | Host has 8 GB RAM, Apple M1; after owner-side disk cleanup and Colima start, `df -h /` reports ~21 GiB free; Colima configured with 2 CPUs, 4 GiB memory, 20 GiB disk |
| Incomplete backup (DB without OpenClaw) | Medium | High | Unified backup/restore drill | Spec defined |
| Prompt injection reaches broad tools | Medium | Critical | Private MCP, narrow grants, deterministic action pipeline | Not implemented |
| Financial values misleading | Medium | High | Versioned contribution-margin formula + data quality | UI fixture baseline exists |
| Missing local Docker/Compose | Low | High | Use Homebrew Docker CLI + Compose plugin + Colima context for local platform topology | Resolved: Docker CLI 29.6.0, Compose 5.1.4, Colima 0.10.3 running; `docker run --rm hello-world` passed |
| Runtime conformance incomplete | Medium | High | Run conformance with dedicated model/provider credentials and no live/billable account ambiguity | Gateway health passed, but agent run/wait/stream/abort and MCP smoke were not run |
| Google Ads exact create gate lacks budget path | Low | Medium | Use first-party CampaignBudget adapter in production slices; keep Composio proxy execution evidence for Phase 1 only | Resolved for Phase 1: proxy `campaignBudgets:mutate` created and removed a disposable explicitly shared budget, and a paused disposable campaign was created, updated, verified, and removed |
