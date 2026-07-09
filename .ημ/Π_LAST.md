# Π Fork Tax — 2026-07-09T21:12:00Z

## Branch
`main`

## Base SHA
`6bd3e6cf1605995f0dc0a21bb16070a70284dda2`

## What Changed
eta-mu CLJS rewrite handoff — new CLI/contract/terminal/turn CLJS packages, legacy gate removal, extension bridge updates, and workspace reorganization.

### New packages
- `packages/contracts/` — ClojureScript contracts package skeleton
- `packages/terminal-ui/` — terminal UI CLJS package skeleton
- `packages/turn-processor/` — turn processor CLJS package skeleton
- `packages/eta-mu/src/cljs/eta_mu/extern/openai.cljs`, `readline.cljs`, `infra/cli/repl.cljs`
- `packages/eta-mu/test/cljs/eta_mu/extern/...`
- `packages/eta-mu/test/cljs/eta_mu/infra/cli/commands/agent_test.cljs`
- `packages/legacy/coding-agent/src/core/extensions/cljs-extension-compiler.js`
- `packages/legacy/coding-agent/test/extensions-cljs.test.js`

### Removed packages/files
- `packages/legacy/output-contract-gate/` entire TypeScript package
- `packages/runtime/src/cljs/eta_mu/gate/` entire CLJS package
- `packages/runtime/test/cljs/eta_mu/gate/` tests

### Modified
- `packages/eta-mu/dist-cli/index.cjs` + `.map` rebuilt
- `packages/eta-mu/package.json`, `shadow-cljs.edn`
- `packages/eta-mu/src/cljs/eta_mu/extern/child_process.cljs`
- `packages/eta-mu/src/cljs/eta_mu/infra/cli/commands/{agent,doctor}.cljs`
- `packages/eta-mu/src/cljs/eta_mu/infra/cli/router.cljs`
- `packages/extensions/lib/eta_mu/core.cljc`, `package.json`
- `packages/legacy/ai/src/models.generated.ts`
- `packages/legacy/coding-agent/src/core/extensions/loader.ts`
- `packages/legacy/output-contract-gate/package.json`
- `pnpm-lock.yaml`, `pnpm-workspace.yaml`
- `receipts.edn`
- `kanban/tasks/eta-mu-cljs-rewrite-architecture-inventory.md`

### New docs/kanban
- `docs/design/eta-mu-base-cli-router.md`
- `docs/design/legacy-package-reorganization.md`
- `docs/design/turn-processor-cljs-package.md`
- `docs/design/user-clojurescript-extensions.md`
- `docs/notes/2026.07.08.14.15.47.md`
- `kanban/tasks/contracts-output-cljs-package.md`
- `kanban/tasks/eta-mu-base-cli-package.md`
- `kanban/tasks/legacy-package-reorganization.md`
- `kanban/tasks/terminal-ui-cljs-package.md`
- `kanban/tasks/turn-processor-cljs-package.md`

## Excluded from Commit
- `EOF` — empty stray file (untracked)
- `.ημ/session-reflections.edn` — test reflection artifact (untracked)

## Verification Status
- `pnpm -C packages/extensions test`: **PASS** (72 tests, 195 assertions, 0 failures)
- `pnpm -C packages/legacy/coding-agent test`: **FAIL** (1 failed) — `test/tools.test.ts:520` `executeBash should persist full output when truncation happens by line count only` (expected full output to contain `1\n2\n3`, received empty string)
- `node scripts/ts-line-count.mjs`: **PASS** — global TS line count decreased from ~174,500 to 172,809

## Commit
`<filled post-commit>` on `main`

## Tag
`Π/eta-mu-cljs-rewrite/2026-07-09T211200Z`

## Notes
- Workspace treated as shared per concurrent-agent guardrails; all owned repo-relevant changes staged.
- Left generated `dist-cli` rebuilds and lockfile/package changes in place because they belong to the same handoff.
