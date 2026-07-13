# CLAUDE.md

Repo-specific bearings for Claude Code sessions in `eta-mu`.

## Quick orientation

- **Build system**: `pnpm` monorepo. Run commands from the repo root unless a
  task explicitly says otherwise.
- **Language policy**: **ClojureScript is canonical** for all new code. TypeScript
  is legacy-only in `packages/legacy/` and must not increase in total line count.
- **Board workflow**: Work from a kanban card. Use the `eta-mu kanban` CLI to
  list, count, comment, and change status. Never edit task frontmatter directly.
  See `AGENTS.md` § **Board Operations** and `PROCESS.md` for the FSM rules.
- **Process**: Follow `PROCESS.md` — Intake → Clarify & Scope → Breakdown & Size
  → Ready Gate → Implement → Review → Test → Document.
- **Architecture**: `law.*` → `shape.*` → `extern.*` → `domain.*` → `infra.*`.
  See `AGENTS.md` for the construction order and namespace rules.

## Harness-specific habits

- **Tests**: For CLI changes run `pnpm -C packages/eta-mu test` and
  `pnpm -C packages/eta-mu lint:kondo`. For extension changes run
  `pnpm -C packages/extensions test`. Never report a task done while a relevant
  suite is failing.
- **Lint**: `clj-kondo`, type checks, and tests must pass with **zero warnings**.
- **Receipts**: Use `receipt-river` skill  to append observations, decisions, test
  runs, and build results. The ledger is the source of truth for significant
  state transitions.
- **Mycology**: At the end of substantive turns, use the `session-mycology` skill to run a
  retrospective to capture reusable skill candidates.
- **Dev frontend**: `http://127.0.0.1:5197` (fixed port).
- **TS baseline**: If you must touch legacy TypeScript and the net change is a
  decrease, update the baseline with:
  ```bash
  node scripts/ts-line-count.mjs --global
  # then write the printed count to .ts-line-count-baseline
  ```
  See `AGENTS.md` § **TypeScript Deprecation Policy** for details.

## If in doubt

- See `AGENTS.md` for house rules, Clojure construction order, and testing gate.
- See `PROCESS.md` for the kanban FSM and workflow steps.
- See `DEVELOPMENT.md` for package-specific commands.
