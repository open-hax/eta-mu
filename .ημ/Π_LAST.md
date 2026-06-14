# Π Last Handoff — feat/kanban-comments-parity snapshot

- timestamp: 20260614T021717Z
- branch: feat/kanban-comments-parity
- pre-commit-head: b6a81a461bfa4b75ba25d944a0058402b0a61dd7
- scope: kanban comments parity + lint gate + docs noise cleanup + formatter normalization
- verification: packages/kanban tsc --noEmit pass

## What's in this Π

**Lint gate (new):**
- `biome.json` — Biome linter config covering all eta-mu packages
- `scripts/lint.mjs` — lint runner script
- `package.json` — added `lint` + `lint:fix` npm scripts
- `.github/workflows/main-pr-gate.yml` + `staging-pr.yml` — added `eta-mu-lint` job
- `.github/workflows/eta-mu-extensions-tests.yml` — added validate-paths + CLI smoke steps

**Extension validation:**
- `packages/eta-mu-extensions/scripts/validate-extension-paths.mjs` — new
- `packages/eta-mu-extensions/scripts/cli-smoke-test.mjs` — new
- `packages/eta-mu-extensions/package.json` — added `validate-paths` + `smoke` scripts + `postbuild` hook

**Kanban ledger:**
- `kanban/.events/ledger.edn` — new event ledger backing the board
- `kanban/.kanban/board.json` — updated board state
- `kanban/tasks/eta-mu-quality-ratchet-cli-startup-smoke.md` + `lint-gates.md` — updated tasks
- `packages/kanban/src/` — kanban comments parity feature work (board, cli, sync, tasks, types, etc.)

**Docs noise cleanup:**
- `.gitignore` — added `docs/agentd-api/assets/` + `docs/opencode-reactant-api/js/` ignores
- Staged deletions: 8 generated doc asset files removed from index

**Formatter normalization:**
- `.prettierrc` — `useTabs: true`, `printWidth: 120`
- `.editorconfig` — tabs for code, spaces for YAML, no trim for markdown
- ~700 files of Prettier tabs→spaces noise restored to HEAD before this snapshot

**Dependency:**
- `pnpm-lock.yaml` — ws 8.20.1, new `packages/chat-ui`

**agentd:**
- `services/agentd/src/` — type import fixes + test/config updates

## Concurrent dirt
None — workspace clean before commit.
