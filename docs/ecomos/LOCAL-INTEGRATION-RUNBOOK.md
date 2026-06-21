# Local integration runbook

This runbook is executed by the Codex production lead. It may install system/development dependencies with the owner's permission.

## 1. Inspect

Record:

- OS/version and architecture;
- Node/npm/pnpm versions;
- Docker/Compose availability;
- free disk/RAM;
- occupied ports;
- Git status and current branch;
- existing OpenClaw installation/state.

Do not overwrite existing OpenClaw state. Back up or use a dedicated state directory.

## 2. Create local private state

Suggested gitignored paths:

```text
.runtime/
├── openclaw-state/
├── openclaw-workspaces/
├── connector-fixtures/
└── logs/
```

Set restrictive permissions where supported. Add only directory placeholders or documentation to Git, never contents.

## 3. Install exact OpenClaw

Initial pin:

```text
2026.6.9
```

Use an official install method but request the exact package version, not `latest`. Prefer Node 24. Record:

- command;
- package integrity/version;
- executable path;
- state directory;
- config path.

## 4. Configure development Gateway

- mode local;
- bind loopback;
- port 18789 unless occupied;
- long random token auth;
- dedicated workspace root;
- no public Control UI exposure;
- store-operating agent tools denied/minimal initially;
- sandbox enabled where available;
- plugins/skills explicitly allowed only.

Keep token in gitignored process environment/secret file, not repo docs.

## 5. Verify runtime

Run and record:

```text
openclaw --version
openclaw doctor
openclaw gateway status
openclaw security audit --deep
```

Resolve critical findings before integration.

## 6. Build conformance harness

Create a small test program under `packages/openclaw` that:

- connects through Gateway protocol;
- validates server version/protocol/scopes/features/policy;
- multiplexes requests/events;
- calls health/status;
- creates/uses a test session;
- streams an agent turn and waits;
- retrieves history;
- aborts a long test turn;
- restarts/reconnects safely;
- exercises one private MCP echo/read tool;
- redacts credentials in logs.

## 7. Start local EcomOS platform

Bring up Postgres and the minimal API/worker skeleton. Prefer one root command such as:

```text
pnpm dev
```

The command should start or verify web, API, worker, Postgres, and OpenClaw without requiring the merchant to understand each component.

## 8. Connector OAuth/callbacks

Use localhost callback URLs where providers permit. If a provider requires a public callback, use an explicitly temporary development tunnel and never expose OpenClaw itself.

At interactive login/consent, stop and ping with:

- provider;
- exact URL/action;
- requested scopes;
- test account expected;
- how to confirm it is not production;
- resume command.

## 9. Environment classification

Every connector record must be `test`. Runtime UI/banner should indicate development/test mode. Provider writes are blocked if classification is unknown.

## 10. Cleanup

- Tag all created provider resources with a test run identifier.
- Remove/pause test resources after suite where appropriate.
- Revoke stale test tokens.
- Preserve only required local runtime state.
- Never commit `.runtime`, credentials, or provider payloads containing private data.
