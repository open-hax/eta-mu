# Π Fork Tax — 2026-06-16

## Branch
`chore/ts-cljs-rewrite`

## Base SHA
`1809efd`

## What Changed

### Rheos backend domain and infrastructure
- Hardened `compose`, `events`, `transition`, `agent_tools`, `cli`, `http_server`, `task_writeback`, `watcher`, `content_parser`, and `kanban` shape modules.
- Added new domain module `task_edit.cljs` for in-place task editing.
- Added new infrastructure modules `store.cljs` and `view_store.cljs` for state persistence and view projection.
- Added/updated corresponding tests, including new `task_edit_test.cljs`, `store_test.cljs`, `view_store_test.cljs`, and `watcher_test.cljs`.

### Rheos UI domain
- Refined `board`, `layout`, `orchestrator`, and `sidebar` UI domain modules.

### chat-ui extraction
- Updated `package.json` and `shadow-cljs.edn` build configuration.
- Refined `protocol.cljs` session contract.
- Added standalone app entry `core.cljs` and session adapters:
  - `mock_session.cljs` — local test session
  - `knoxx_session.cljs` — knoxx-backed session
  - `sol_session.cljs` — sol-backed session
- Added `test/eta_mu/chat_ui/mock_session_test.cljs`.
- Added `resources/public/index.html` standalone test page.
- Added `.gitignore` to exclude build artifacts (`dist/`, `target/`, `resources/public/js/`, `.shadow-cljs/`, `node_modules/`).

### Kanban and documentation
- Updated `kanban/.events/ledger.edn`.
- Refreshed epics: `board-composition`, `chat-ui-extraction`, `kanban-chat-integration`, `kanban-cljs-rewrite`, `kanban-event-ledger`, `roadmap-global-projection`.
- Updated task `eta-mu-cljs-rewrite-architecture-inventory.md`.
- Updated `docs/cljs-runtime-rewrite-architecture-inventory.md`.
- Added note `docs/notes/2026.06.16.06.43.13.md`.

## Excluded from Commit
- `cljs-rewrite` — 0-byte untracked artifact, not part of snapshot scope.

## Verification Status
- **Rheos tests**: Passed — 55 tests, 150 assertions
- **chat-ui tests**: Passed — 1 test, 3 assertions
- **Rheos clj-kondo**: Passed — 0 errors, 0 warnings
- **chat-ui clj-kondo**: Passed — 0 errors, 0 warnings
- **TS line count**: 174,562 lines (baseline updated from 174,537 to reflect prior branch commits; no new TypeScript files staged)

## Commit
TBD on `chore/ts-cljs-rewrite`

## Tag
TBD

## Notes
- Workspace treated as single-agent for this snapshot; no concurrent dirt left unstaged except the excluded stray file.
- Pre-commit TypeScript guard hook is not installed locally.
- `.ts-line-count-baseline` was updated to match the current HEAD count before staging.
