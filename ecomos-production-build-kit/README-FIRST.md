# EcomOS production build kit

This kit turns the approved UI prototype into a production, single-store, self-hosted EcomOS powered internally by one pinned OpenClaw runtime.

## Before launching Codex

1. Extract this kit outside the repository.
2. Copy `repo-overlay/` into the root of the `ecomos` repository.
3. Confirm these remain present and unchanged:
   - `ecomos-ui/docs/AS-BUILT.md`
   - `ecomos-ui/`
   - `references/openclaw-mission-control/`
4. Do not restore the deleted `IMPLEMENTATION-NOTES.md`; `AS-BUILT.md` is the UI/product truth.
5. Commit the documentation overlay before production code begins.

Suggested copy command from the repository root:

```bash
rsync -av /path/to/ecomos-production-build-kit/repo-overlay/ ./
git add AGENTS.md docs/ecomos agent-prompts
git commit -m "docs(ecomos): establish production OpenClaw build contract"
```

## Launch Codex

Launch one Codex session from the repository root and paste:

```text
Read AGENTS.md and agent-prompts/CODEX-PRODUCTION-LEAD.md completely. Treat ecomos-ui/docs/AS-BUILT.md as the product/UI truth. Execute the production build autonomously in the documented phase order. You may install and configure the pinned local OpenClaw runtime and required development dependencies. Use only dedicated test accounts until I explicitly authorize otherwise. If an external credential, interactive consent, irreversible decision, or invariant conflict blocks you, write the blocker into docs/ecomos/living/BLOCKERS.md, stop safely, and ping me with the exact action or value required to resume.
```

## Important execution model

- One Codex lead owns architecture, integration, migrations, and the active branch.
- The lead may launch a maximum of three bounded subagents for research, focused tests, or isolated modules.
- Subagents do not merge, edit shared architecture concurrently, or make product decisions.
- Targeted tests run per slice; full checks run at phase gates to avoid exhausting the development machine.
