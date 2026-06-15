# Π Fork Tax — 2026-06-14

## Branch
`feat/kanban-comments-parity`

## Base SHA
`4020a06a74d8c57d9004e88591f7358ae8caef42`

## What Changed

### knoxx → sol Migration (~72k lines removed)
- **Deleted**: All `packages/sol/src/cljs/knoxx/backend/` source files
- **Deleted**: All `packages/sol/test/cljs/knoxx/backend/` test files
- **Added**: New `packages/sol/src/cljs/open_hax/sol/` namespace tree
- **Added**: New `packages/sol/test/cljs/open_hax/` test tree
- **Modified**: `server.js`, `shadow-cljs.edn`, `package.json` (entrypoint rewrite)

### New Packages
- `packages/Rheos/` — Rheos UI (orchestrator, layout, law, infra layers)
- `packages/kanban-orchestrator/` — Kanban orchestration
- `packages/katamorph/test/` — Katamorph tests
- `packages/mcp-contracts/` — MCP contract definitions
- `packages/sol-staging/` — Sol staging area

### Scripts
- `scripts/pre-commit-ts-guard.sh` — TypeScript line-count guard
- `scripts/ts-line-count.mjs` — TS line counter

### Notes
- `docs/notes/2026.06.14.10.25.09.md`
- `docs/notes/2026.06.14.12.19.50.md`

## Excluded from Commit
- `packages/sol/dist-dev/` — build artifacts (gitignored in sol/.gitignore)
- `pnpm-lock.yaml` — stale, regenerate on next install

## Commit
`2f8d396` on `feat/kanban-comments-parity`

## Tag
`Π/feat-kanban-comments-parity/2026-06-15T033242`

## Verification Status
- **Tests**: Skipped — knoxx tests deleted, sol tests not yet wired
- **Build**: Skipped — shadow-cljs state is in excluded dist-dev
- **Lint**: Not run

## Notes
- No concurrent agent dirt detected
- dist-dev files were previously committed (pre-gitignore); they remain tracked but are excluded from this snapshot
