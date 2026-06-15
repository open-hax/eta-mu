# Π Fork Tax — 2026-06-15

## Branch
`feat/kanban-comments-parity`

## Base SHA
`ea053df`

## What Changed

### CLJS runtime expansion
- Added new domain, extern, infra, law, and shape namespaces under `packages/runtime/src/cljs/eta_mu/`
  - `ai` — message/content canonical types, provider transforms, Malli schemas, extern adapters
  - `coding` — diagnostics, session, fs/git/path/shell/process externs, boundary infra
  - `docs` — frontmatter, markdown parsing, JSONL, indexing
  - `garden` — publication law and block/track shapes
  - `gate` — contract law, review/validate/repair domain
- Added corresponding test coverage under `packages/runtime/test/cljs/eta_mu/`

### Shared clj-kondo configuration
- New package `packages/kondo-config/` exporting shared hooks and config
- Rolled shared config out to `packages/Rheos`, `packages/axxium`, `packages/chat-ui`, `packages/event-ledger`, `packages/extensions`, `packages/katamorph`, `packages/mcp-contracts`, `packages/protocols`, `packages/runtime`, `packages/sol`
- Removed per-package `.clj-kondo/imports` directories now covered by shared config
- Added `docs/kondo-config-baseline.md` documenting baseline lint state

### Package updates
- Updated `package.json` and `pnpm-lock.yaml` to reflect dependency changes
- Added `.gitignore` entries for `**/.clj-kondo/.cache` and `**/.clj-kondo/imports`

### Kanban and process documentation
- Added `PROCESS.md`
- Added rewrite inventory docs under `docs/*-cljs-rewrite-inventory.md`
- Added kanban epics and tasks for the TS→CLJS rewrite phases and kondo cleanup
- Updated `kanban/.events/ledger.edn`

### Sol, Katamorph, Rheos, axxium, chat-ui, event-ledger, extensions, protocols
- Ongoing CLJS refinements and test updates across these packages

## Excluded from Commit
- `.cache/v1/lock` — runtime/build cache artifact
- `packages/Rheos/.cache/v1/**` — runtime/build cache artifact

## Verification Status
- **eta-mu-runtime tests**: Passed — 6 tests
- **eta-mu-github tests**: Passed — 19 tests
- **eta-mu-docs tests**: Passed — 2 tests
- **kanban-legacy tests**: Passed — 14 tests
- **eta-mu-extensions tests**: Passed — 72 tests, 195 assertions
- **Sol tests**: Passed — 66 tests, 193 assertions
- **Katamorph tests**: Passed — 102 tests, 253 assertions
- **TS line count**: Unchanged at 174,537 lines

## Commit
`TBD` on `feat/kanban-comments-parity`

## Tag
`Π/feat-kanban-comments-parity/2026-06-15T221359`

## Notes
- Workspace treated as single-agent for this snapshot; no concurrent dirt left unstaged.
- LSP diagnostics report unresolved symbols in several `packages/Rheos/src/rheos/ui/domain/*.cljs` files; these are pre-existing and did not fail the executed test suites.
- Pre-commit TypeScript guard hook is not installed locally.
