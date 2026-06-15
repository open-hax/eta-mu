# Π Fork Tax — 2026-06-15

## Branch
`feat/kanban-comments-parity`

## Base SHA
`44844e3fc0bf5082beb19086c3b006d50ecc0ddf`

## What Changed

### Rheos board-chat wiring
- `packages/Rheos/ecosystem.config.cjs`
  - Added `RHEOS_ORCHESTRATOR_MODEL` defaulting to `mimo-v2.5-pro`.
  - Defaulted `KANBAN_CONFIG` to `../kanban/openhax.kanban.json`.
- `packages/Rheos/src/rheos/backend/infra/chat_proxy.cljs`
  - Forward the configured orchestrator model to Sol.
  - Return `js/undefined` from SSE handlers to stop spurious `FST_ERR_REP_ALREADY_SENT`.
- `packages/Rheos/src/rheos/backend/infra/http_server.cljs`
  - Return `js/undefined` from the health/SSE stream handler.
  - Enable `forceCloseConnections: true` so hot-reload can reclaim the port.
  - Add `listen-with-retry!` for transient `EADDRINUSE` on reload.

### Sol agent turn streaming
- `packages/sol/src/cljs/open_hax/sol/infra/agent/turn.cljs`
  - Stream assistant text deltas to the realtime WS `tokens` channel.
  - Handle both incremental and cumulative provider delta shapes.
  - Broadcast `run_started` / `run_completed` / `run_failed` lifecycle events on the `events` channel with the flat `:type` shape the board client expects.
- `packages/sol/test/cljs/open_hax/sol/infra/agent/turn_stream_test.cljs`
  - Regression tests for token streaming, cumulative-delta suffixing, message-end flush, and conversation-scoped broadcasts.

### Notes
- `docs/notes/2026.06.14.22.24.55.md` — katamorph runtime / FSM-as-resources next steps.

## Excluded from Commit
- `packages/sol/dist-dev/` — build artifacts
- `packages/Rheos/dist-dev/` — build artifacts
- `pnpm-lock.yaml` — stale, regenerate on next install
- `.#migrating-sol.md` — Emacs lock file
- `migrating-sol.md` — session scratch note

## Verification Status
- **Rheos tests**: Passed — 34 tests, 85 assertions
- **Rheos build**: Passed — `shadow-cljs compile server`
- **Sol build**: Passed — `shadow-cljs compile server`
- **Sol tests**: Blocked — missing `open-hax.contracts.policy.eval` required by `open_hax/contracts/policy/eval_test.cljs`
- **Sol lint**: Blocked — pre-existing EOF error in `test/cljs/open_hax/sol/shape/parse_test.cljs`
- **TS line count**: Unchanged at 174,537 lines

## Commit
`82d283a` on `feat/kanban-comments-parity`

## Tag
`Π/feat-kanban-comments-parity/2026-06-15T050647`

## Notes
- No concurrent agent dirt detected; excluded paths are generated/runtime/scratch.
- Pre-commit TypeScript guard hook is not installed locally.
