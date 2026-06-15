# Π Fork Tax — 2026-06-15

## Branch
`feat/kanban-comments-parity`

## Base SHA
`2bf6329`

## What Changed

### Test isolation and hygiene
- `packages/sol/shadow-cljs.edn`
  - Fixed `:ns-regex` → `:ns-regexp "open-hax\\.sol\\..*-test$"` so Sol tests only run Sol namespaces.
- `packages/sol/test/cljs/open_hax/katamorph/agent/`
  - Moved reasoning, text-delta, and turn-guard tests to `packages/katamorph/test/cljs/katamorph/agent/`.
- `packages/sol/test/cljs/open_hax/contracts/policy/eval_test.cljs`
  - Removed duplicate test; canonical test lives in `packages/katamorph/test/cljs/katamorph/policy/eval_test.cljs`.

### Katamorph policy evaluator
- `packages/katamorph/src/cljs/katamorph/policy/eval.cljs`
  - `resolve-symbol` now looks up arbitrary symbols by symbol key, then keyword key.
  - `eval-form` returns raw results, preserving `false` instead of normalizing to `nil`.
- `packages/katamorph/test/cljs/katamorph/policy/eval_test.cljs`
  - Updated assertions to expect `false` for false results.

### Katamorph agent helpers
- `packages/katamorph/src/cljs/katamorph/agent/reasoning.cljs`
  - Always emit an empty `:reasoning` delta when closing `</think>`.
- `packages/katamorph/src/cljs/katamorph/agent/text_delta.cljs`
  - Handle duplicated-prefix glitch with leading boundary characters.
  - Treat `replay-offset` `0` as active replay.
- `packages/katamorph/test/cljs/katamorph/agent/turn_guards_test.cljs`
  - Fixed loop count typo (4 iterations to reach streak 4).

### Sol agent templates and content
- `packages/sol/src/cljs/open_hax/sol/domain/agent/agent_templates.cljs`
  - Evaluate vector literals element-wise before keyword-call dispatch.
  - Symbol lookup falls back to keyword env keys.
  - `render-prompt` exposes both `ctx` and top-level template context values.
  - Added `mod` and `rem` operators.
  - `discord-message-template-context` falls back to `:messageId` from `event`.
- `packages/sol/test/cljs/open_hax/sol/domain/agent/agent_templates_test.cljs`
  - Fixed map/filter expectations and render-prompt arity.
- `packages/sol/src/cljs/open_hax/sol/domain/agent/content.cljs`
  - Added `"input_audio"` to `tool-result-media-type` audio case.

### Kanban record
- `kanban/tasks/sol-test-failure-triage-2026-06-15.md`
  - Task card documenting investigation, resolution strategy, and verification.

## Excluded from Commit
- `pnpm-lock.yaml` — stale lock state
- `migrating-sol.md` — session scratch note
- `docs/*-cljs-rewrite-inventory.md` — untracked docs from concurrent rewrite planning
- `kanban/epics/*-cljs-rewrite.md` and related tasks — concurrent kanban epic/task creation

## Verification Status
- **eta-mu-cli tests**: Passed — 1120 tests, 47 skipped
- **Katamorph tests**: Passed — 102 tests, 253 assertions
- **Sol tests**: Passed — 66 tests, 193 assertions
- **TS line count**: Unchanged at 174,537 lines

## Commit
`2bf6329` on `feat/kanban-comments-parity`

## Tag
`Π/feat-kanban-comments-parity/2026-06-15T152316`

## Notes
- No concurrent agent dirt detected in the target scope.
- Pre-commit TypeScript guard hook is not installed locally.
