# Test evidence

Record evidence by phase and commit. Do not write “passed” without the exact command/result.

## Baseline UI

- Commit: `659cd48` at start of branch `build/production-ecomos`; docs/runtime setup changes not yet committed when baseline ran
- Environment:
  - macOS `15.3.1` (`24D70`), Darwin `24.3.0`, arm64 Apple M1
  - RAM: `8589934592` bytes, CPU cores: `8`
  - Disk: `/System/Volumes/Data` had ~`2.1GiB` free before runtime install and ~`3.3GiB` free after smoke cleanup
  - Node: `v22.22.3`; npm: `10.9.8`; pnpm: `10.26.2`
  - Docker: unavailable (`docker: command not found`)
- `npm run typecheck`: pass (`tsc --noEmit`, exit 0)
- `npm run lint`: pass with warnings (`eslint`, exit 0)
  - `components/data-table/data-table.tsx:59`: React Compiler skipped TanStack `useReactTable()` memoization due incompatible-library warning
  - `components/uilayouts/liquid-gradient.tsx:206`: `buttonType` unused arg warning
- `npm run build`: pass (`next build`, exit 0)
  - Next.js `16.2.6` with Turbopack
  - Compiled successfully in `9.2s`
  - Generated `69/69` static pages
- `npm run check:fixtures`: pass (`tsx data/validate.ts`, exit 0)
  - `40 checks passed`
  - `All fixture integrity checks passed.`

## Phase 1A / OpenClaw local smoke

- Commit: uncommitted working tree on `build/production-ecomos`
- Environment:
  - OpenClaw package: `openclaw@2026.6.9`
  - Install path: `.runtime/openclaw-cli` (gitignored)
  - State/config/secrets: `.runtime/openclaw-state`, `.runtime/openclaw-config`, `.runtime/openclaw-secrets` (gitignored)
- Commands:
  - `npm view openclaw@2026.6.9 version dist.unpackedSize dist.tarball bin --json`: package exists, version `2026.6.9`, unpacked size `86608026`, bin `openclaw`
  - `npm view openclaw@2026.6.9 engines dependencies --json`: requires Node `>=22.19.0`
  - `npm install --prefix .runtime/openclaw-cli openclaw@2026.6.9 --no-audit --no-fund`: pass, `297 packages` added
  - `.runtime/openclaw-cli/node_modules/.bin/openclaw --version`: `OpenClaw 2026.6.9 (c645ec4)`
  - `openclaw config set gateway.mode local`; `gateway.port 18789`; `gateway.bind loopback`; `tools.elevated.enabled false`: pass
  - `openclaw config validate`: pass
  - `openclaw doctor --lint --json --non-interactive`: exit 1 with warnings for default allowed skills missing optional host binaries/env; no critical doctor failure was shown
  - `openclaw security audit --json`: pass, `critical: 0`, `warn: 1`, `info: 1`; elevated tools initially enabled
  - `openclaw security audit --deep --json` after hardening and Gateway start: pass, `critical: 0`, `warn: 2`, `info: 1`; `tools.elevated: disabled`
  - `openclaw gateway run --auth token --bind loopback --port 18789 --ws-log compact`: pass, Gateway reached `ready`; stopped with SIGINT and clean shutdown
  - `openclaw gateway status`: pass, Gateway reachable at `ws://127.0.0.1:18789`, version `2026.6.9`, capability `connected-no-operator-scope`
  - `openclaw gateway health`: pass, `OK (23ms)`
  - `openclaw gateway call health`: pass, `ok: true`, default agent `main`, zero sessions
  - `openclaw agents list`: pass, default `main`
  - `openclaw sessions list`: pass, zero sessions
- Results:
  - Partial Phase 1A smoke passed for pinned install, config, loopback Gateway, health/status/basic RPC surfaces.
  - Full Phase 1A conformance is blocked: agent run/wait/stream/abort and private MCP smoke require safe model/runtime credentials and a completed EcomOS MCP/conformance harness.
- Cleanup:
  - Gateway foreground session stopped with SIGINT and reported clean shutdown.
  - `lsof -nP -iTCP:18789 -sTCP:LISTEN` returned no listener.
  - Runtime directories were reset to chmod `700`.
- Gate verdict: blocked; see `BLOCKERS.md`.

## Host prerequisite progress

- Commit: recorded before commit creation on `build/production-ecomos`; final response records the resulting commit hash
- Generated cleanup:
  - Removed ignored/rebuildable `ecomos-ui/.next` (~`1.2G`)
  - Removed ignored/rebuildable `references/dashboard-inspo/node_modules` (~`526M`)
  - `git status --short --ignored` shows these no longer present; tracked source was not modified by cleanup
- Disk:
  - After cleanup: `df -h .` reported ~`5.0GiB` free
  - After `postgresql@16` install: `df -h .` reported ~`4.4GiB` free
- PostgreSQL 16:
  - `brew install postgresql@16`: pass
  - Installed formula: `postgresql@16 16.14`
  - `/opt/homebrew/opt/postgresql@16/bin/psql --version`: `psql (PostgreSQL) 16.14 (Homebrew)`
  - Bounded smoke command: `LC_ALL="en_US.UTF-8" /opt/homebrew/opt/postgresql@16/bin/postgres -D /opt/homebrew/var/postgresql@16 -p 55432`
  - Query: `/opt/homebrew/opt/postgresql@16/bin/psql -h 127.0.0.1 -p 55432 -d postgres -Atc 'select version();'`
  - Result: `PostgreSQL 16.14 (Homebrew) on aarch64-apple-darwin24.6.0`
  - Cleanup: temporary server stopped with SIGINT; `lsof -nP -iTCP:55432 -sTCP:LISTEN` returned no listener
- Container runtime:
  - `docker --version`: `zsh:1: command not found: docker`
  - `docker compose version`: `zsh:1: command not found: docker`
  - `command -v colima`: no result
  - `command -v podman`: no result
  - `ls -d /Applications/Docker.app`: no Docker Desktop app at that path
  - `brew cleanup -n`: would free approximately `174.2MB`
  - `df -h /`: ~`4.6GiB` free
- Gate verdict: still blocked for Docker/Compose and dedicated account/runtime credential gates.

## Host container runtime completion

- Commit: recorded before commit creation on `build/production-ecomos`; final response records the resulting commit hash
- Trigger: owner instructed to proceed with install after previous host blocker
- Disk:
  - Before install: `df -h /` reported ~`24GiB` free
  - After Colima start: `df -h /` reported ~`21GiB` free
- Install:
  - `brew install docker docker-compose colima`: pass
  - Installed Docker CLI: `29.6.0`
  - Installed Docker Compose plugin: `5.1.4`
  - Installed Lima: `2.1.3`
  - Installed Colima: `0.10.3`
- Configuration:
  - Created `~/.docker/config.json` with `cliPluginsExtraDirs` pointing to `/opt/homebrew/lib/docker/cli-plugins`
  - `docker compose version`: `Docker Compose version 5.1.4`
- Colima:
  - `colima start --cpu 2 --memory 4 --disk 20 --runtime docker`: pass
  - `docker context ls`: current context `colima`, endpoint `unix:///Users/gabriellunesu/.colima/default/docker.sock`
  - `colima status`: running with macOS Virtualization.Framework, architecture `aarch64`, runtime `docker`, mount type `virtiofs`
  - `docker info`: daemon reachable, server `29.5.2`, `2` CPUs, ~`4GiB` memory, architecture `aarch64`, Compose plugin loaded
- Container smoke:
  - `docker run --rm hello-world`: pass
  - Result: Docker pulled `hello-world:latest` for `arm64v8`, created the container, streamed `Hello from Docker!`, and removed the container
- Gate verdict: Docker/Compose host prerequisite resolved; Phase 1 remains blocked for dedicated connector accounts/OAuth and safe OpenClaw model/runtime conformance.

## Phase evidence template

### Phase X / slice

- **Commit:**
- **Environment:** OS, Node, pnpm, Postgres, OpenClaw, provider account classification
- **Commands:**
- **Results:**
- **Real sandbox resources:** safe IDs only
- **Failures/skips:**
- **Artifacts/screenshots/logs:**
- **Cleanup:**
- **Gate verdict:** pass / blocked / fail
