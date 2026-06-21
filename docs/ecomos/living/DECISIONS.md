# Living decisions

Use this document for current implementation-level decisions not yet significant enough for a formal ADR. It is not a changelog.

| Topic | Current decision | Evidence/owner | Needs ADR? |
|---|---|---|---|
| Product/UI | `AS-BUILT.md` is authoritative | Owner | No |
| Runtime | OpenClaw 2026.6.9 | ADR-002/005 | No |
| Store model | One store/deployment | Owner + ADR-001 | No |
| Active branch | `build/production-ecomos` | `git switch -c build/production-ecomos` | No |
| Local runtime state path | `.runtime/openclaw-state`, config `.runtime/openclaw-config/openclaw.json`, workspace `.runtime/openclaw-workspaces` | `openclaw config file`, Gateway smoke | No |
| Local OpenClaw install | Repo-local npm prefix `.runtime/openclaw-cli`, exact package `openclaw@2026.6.9` | `openclaw --version` returned `OpenClaw 2026.6.9 (c645ec4)` | No |
| Gateway hardening baseline | Loopback bind, port `18789`, token auth at invocation, `tools.elevated.enabled=false` | `openclaw gateway status`, `openclaw security audit --deep --json` | Maybe before production packaging |
| Docker/Postgres | Not available on this host yet | `docker --version` not found | No |
| Auth package exact pin | TBD during Phase 3 spike | ADR-009 | If changed |
