# Π Fork Tax — 2026-07-10T08:06:21Z

## Branch
`docs/discovery-sweep-update`

## Base SHA
`18e8ffc46d06890b2ce15e756f8bcfec7a61298f`

## What Changed

Continuation of the `docs/discovery-sweep-update` branch from the 2026-06-19 Π snapshot. This handoff absorbs the previously-excluded "concurrent dirt" plus new discovery output.

### Previously-excluded concurrent dirt (now owned and committed)
- **Root PM2 ecosystem** — `ecosystem.config.cjs` rewritten as an aggregator that discovers and requires every `packages/*/ecosystem.config.cjs`.
- **Kanban ledger** — `kanban/.events/ledger.edn` appended with drift-detected events for the 13 docs tasks, the `fsm-engine` epic, and all 12 FSM subtask cards.
- **FSM engine epic** — `kanban/epics/fsm-engine.md` updated to `breakdown` status with a reconciliation-architecture section (event cascade, invariants, config-as-data, frontmatter-as-interface) and 12 linked subtask cards.
- **Rheos UI** — `packages/Rheos/src/rheos/ui/domain/board.cljs` task-item height adjusted; `packages/Rheos/src/rheos/ui/domain/sidebar.cljs` DOMPurify import fixed for ESM module shape.
- **chat-ui** — `packages/chat-ui/src/eta_mu/chat_ui/message.cljs` DOMPurify import fixed for ESM module shape.
- **Receipts** — `receipts.edn` updated with the last work log.

### New discovery output
- `.dir-locals.el` — Emacs local variables.
- `docs/notes/2026.07.10.03.00.16.md` — long-form note (prompt-wizard / perplexity space material).
- `openhax.kanban.json` — kanban config stub (`tasksDir`, `boardFile`, `fsm: promethean`).
- `kanban/tasks/` — 28 new task cards: 13 docs-cleanup, 12 FSM breakdown, 1 ops-fix-root-package-json-scripts.
- `packages/eta-mu-extensions/kanban/.events/ledger.edn` — stub ledger for the old extensions package.

### Not tracked
- `cljs-rewrite/` — empty directory; git does not track empty directories.

## Verification Status
- **Rheos tests**: Passed — 58 tests, 164 assertions, 0 failures.
- **chat-ui tests**: Passed — 2 tests, 6 assertions, 0 failures.
- **clj-kondo**: Passed — 0 errors, 0 warnings in both modified packages.
- **TypeScript line count**: No `.ts/.tsx` files added or modified; global total unchanged at 174,564 lines.
- **Secret scan**: No suspicious patterns in changed or untracked files.

## Commit
`<filled post-commit>` on `docs/discovery-sweep-update`

## Tag
`Π/docs-discovery-sweep-update/2026-07-10T080621`

## Notes
- Workspace treated as shared per concurrent-agent guardrails. This snapshot intentionally absorbs all currently stageable paths; no other concurrent dirt was left unstaged.
- The `docs/notes/2026.07.10.03.00.16.md` file appears to be external prompt-wizard material; included in the snapshot as-is because it is part of the current working tree.
