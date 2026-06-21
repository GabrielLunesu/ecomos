# 06 — OpenClaw runtime specification

## Runtime pin

Initial verified runtime:

```text
OpenClaw: 2026.6.9 stable
Gateway protocol: 4 only after conformance verification
```

The pin is recorded in code/config and release manifests. “Latest” is forbidden in production and CI.

## Product integration

EcomOS uses two native OpenClaw surfaces:

1. **Gateway WebSocket/RPC** for runtime control, sessions, agents, events, schedules, usage, approvals, and health.
2. **MCP** for exposing typed EcomOS business tools to OpenClaw agents.

EcomOS does not import OpenClaw internal packages and does not rely on Mission Control runtime code.

## Local development installation

Codex may install OpenClaw on the developer machine. Preferred setup:

- exact package version;
- Node 24;
- gitignored repository-local state through `$OPENCLAW_STATE_DIR=.runtime/openclaw-state` when supported;
- workspace root `.runtime/openclaw-workspaces`;
- loopback binding on port 18789;
- generated long token auth;
- no public exposure;
- daemon or supervised local process with repo scripts;
- state directory persisted between restarts.

OpenClaw state and tokens never enter Git.

## Production topology

OpenClaw runs as a dedicated service/container or OS user in the EcomOS deployment. It is reachable only by the EcomOS API/worker network identity.

The merchant never receives a raw Gateway token or OpenClaw configuration UI.

## Persistent Gateway client

The owned client must support:

- one long-lived WebSocket connection;
- challenge/connect handshake;
- exact protocol negotiation;
- token auth and negotiated scopes;
- request ID multiplexing;
- concurrent in-flight RPCs;
- event subscription and ordered sequence handling;
- heartbeat/tick monitoring;
- payload and buffer policy limits from `hello-ok`;
- reconnect with jitter/backoff;
- startup-sidecar retry handling;
- explicit cancellation/timeouts;
- schema validation for responses/events;
- connection generation to reject stale replies;
- telemetry and safe redaction.

## Startup conformance

Record and validate `hello-ok`:

- server version;
- protocol;
- negotiated role/scopes;
- methods and events;
- payload policy;
- connection ID.

Minimum required methods are verified against the actual release. Initial categories:

- health/status/diagnostics;
- agents list/create/update/delete/files;
- sessions list/preview/patch/reset/delete/compact;
- chat send/history/abort;
- agent and agent.wait;
- cron list/status/add/update/remove/run/runs;
- models and usage;
- execution approval surfaces used by EcomOS;
- channel status and direct send where enabled.

Required event families include agent, chat/tool-result, health/heartbeat, cron, approval, and connection lifecycle events.

The app fails readiness—not liveness—when the runtime is incompatible.

## Agent desired/observed state

EcomOS stores a desired specification:

- stable EcomOS agent ID;
- OpenClaw agent ID;
- name/purpose;
- model profile;
- workspace;
- sandbox/tool profile;
- EcomOS MCP tool grants;
- schedules;
- channel routes;
- autonomy mode;
- configuration generation.

A worker reconciles OpenClaw and records observed state, runtime version, last event, error, and generation.

Provisioning is idempotent. Partial success is detected and reconciled rather than repeated blindly.

## Tool model

Normal store-operating agents receive:

- EcomOS MCP tools explicitly granted by agent/capability;
- no host shell by default;
- no unrestricted filesystem;
- no raw provider credentials;
- no ability to rewrite EcomOS permissions;
- no raw Gateway admin tools.

Research/development agents may receive broader sandboxed tools through an explicit owner grant and separate traceable profile.

## MCP boundary

The private MCP server:

- authenticates the OpenClaw service/agent identity;
- exposes only granted tools;
- validates schemas;
- maps each call to an EcomOS command and trace;
- returns stable business errors;
- never performs provider writes outside the action pipeline;
- includes intent, side-effect, permission, approval, and idempotency metadata.

## Sessions and chat

- OpenClaw owns runtime session continuity.
- EcomOS maps sessions to users, agents, workflows, and UI conversations.
- Agent/chat/tool events are normalized into EcomOS traces and UI message projections.
- EcomOS never treats a session key as authorization.
- Cancellation uses runtime abort plus EcomOS job/action cancellation where possible.

## Subagents

The parent trace records child session/run IDs and completion events. Tool grants for a child are explicit and cannot exceed the parent/workflow grant selected by EcomOS.

## Schedules and channels

OpenClaw native cron/channels may deliver daily briefs and alerts. EcomOS remains authoritative for schedule intent and delivery records; the reconciler creates/updates runtime schedules.

## Security baseline

- Gateway loopback/private bind.
- Token auth.
- Dedicated host user/container.
- Sandbox scope per agent or session.
- Workspace access none/read-only by default.
- Exec denied for store-operating agents.
- Elevated disabled.
- Explicit plugin/skill allowlist.
- Regular `openclaw security audit --deep`.
- Persist and protect `$OPENCLAW_STATE_DIR`.

## Conformance test suite

The real-runtime suite proves:

- install and exact version;
- restart persistence;
- handshake/scopes/features;
- concurrent RPC/event handling;
- chat streaming/history/abort;
- agent lifecycle;
- child runs;
- schedules;
- MCP tools and permission denial;
- reconnect after Gateway restart;
- payload/error behavior;
- trace ingestion;
- backup/restore of runtime state.

No OpenClaw upgrade is accepted until this suite passes.
