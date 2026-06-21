# Reference reuse policy

## OpenClaw Mission Control snapshot

`references/openclaw-mission-control/` is a read-only implementation reference. It is useful for:

- Gateway RPC method discovery;
- device-signing concepts;
- agent lifecycle ideas;
- task/approval use cases;
- webhook security patterns;
- installer/CI lessons;
- known failure modes and regression tests.

It is not EcomOS's backend or runtime dependency.

## Never copy without redesign

- per-RPC new WebSocket connections;
- tokens embedded in workspace Markdown;
- raw Gateway tokens in database/API responses/URLs;
- broad gateway host shell defaults;
- Redis list jobs for consequential actions;
- shallow activity/approval models;
- assumption that any newer OpenClaw version is compatible;
- provisioning that patches runtime config while relying on the same connection remaining alive.

## Reuse ledger

Any copied/adapted unit must be recorded with:

- upstream repository and commit;
- original path;
- EcomOS destination;
- license;
- changes and security review;
- tests added;
- maintainer/owner.

Retain MIT notices for substantial copied portions.

## Build exclusion

The reference folder is excluded from:

- production images;
- package workspaces;
- application imports;
- lint/typecheck/coverage;
- generated API clients;
- secret scans only if the scanner still separately audits it for accidental sensitive files.
