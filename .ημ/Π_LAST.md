# Π Fork Tax — 2026-07-10T14:42:17Z

## Branch
`device/yoga`

## Base SHA
`415b2f2811dbf4d42673530cf2927fd0b3789d14`

## What Changed
Continuation of the eta-mu CLJS rewrite on the `device/yoga` branch after the `docs/discovery-sweep-update` merge. This handoff absorbs contract-runtime-v2 migrations, kanban updates, eta-mu CLI readline/repl work, an extension macro change, and a legacy/github runtime-batch fix.

### Contract / workspace state
- **`.ημ/PRINCIPLE.edn`** — updated contract runtime content.
- **`AGENTS.md`** — updated Clojure house rules and project instructions.
- **`README.md`** — refreshed top-level project readme.
- **`agents/mindfuck/CONTRACT.edn`** — updated agent contract.
- **`biome.json`** — updated package paths to reflect legacy/ reorganization.
- **`operation-mindfuck/ημΠ.dev.v5.skill-graph.edn`** — updated skill-graph registry.
- **`operation-mindfuck/README.md`** — new readme for the operation-mindfuck directory.

### Kanban
- **`kanban/.events/ledger.edn`** — appended ledger events.
- **`kanban/tasks/*`** — 40+ task cards updated with new frontmatter/body edits across the CLJS rewrite portfolio (agent, ai, coding-agent, eta-mu, github, publication-components, tui, etc.).

### eta-mu CLI
- **`packages/eta-mu/package.json`** — updated scripts/deps.
- **`packages/eta-mu/README.md`** — updated package readme.
- **`packages/eta-mu/src/cljs/eta_mu/extern/readline.cljs`** — readline extern improvements.
- **`packages/eta-mu/src/cljs/eta_mu/infra/cli/repl.cljs`** — REPL infra updates.
- **`packages/eta-mu/test/cljs/eta_mu/extern/readline_test.cljs`** — new readline test.
- **`packages/eta-mu/dist-cli/index.cjs`** / **`packages/eta-mu/dist-cli/index.cjs.map`** — rebuilt CLI artifacts.

### Extensions
- **`packages/extensions/lib/eta_mu/macros/state.cljc`** — state macro changes.

### Legacy / GitHub
- **`packages/legacy/github/src/runtime-batch.ts`** — runtime-batch logic fix.
- **`packages/legacy/github/tests/runtime-batch.test.ts`** — matching regression test.

### Deleted
- **`packages/eta-mu-extensions/kanban/.events/ledger.edn`** — removed stale ledger stub.

### Docs notes
- **`docs/notes/INDEX.md`** — updated note index.

## Verification Status
- **packages/eta-mu tests**: Passed — 54 tests, 100 assertions, 0 failures, 0 errors.
- **packages/extensions tests**: Passed — 72 tests, 195 assertions, 0 failures, 0 errors.
- **packages/legacy/github tests**: Passed — 21 tests, 0 failures.
- **clj-kondo**: Passed — 0 errors, 0 warnings in `packages/eta-mu`.
- **TypeScript line count**: Global total 172,853 lines; net reduction from prior snapshot (no `.ts/.tsx` added).
- **Secret scan**: No plaintext secrets found; grep hits were build artifacts and feature descriptions.

## Commit
`a9c5f3952de66421dc6ccf5cc672bc2200a8bd34` on `device/yoga` (this artifact updated in a follow-up commit recording the snapshot SHA).

## Tag
`Π/device/yoga/2026-07-10T144217`

## Notes
- Workspace treated as shared per multi-agent guardrails. This snapshot intentionally absorbs all currently stageable paths; no other concurrent dirt was left unstaged.
- The `packages/eta-mu/dist-cli/index.cjs` and `.map` files are generated build artifacts committed because they are part of the current working tree.
