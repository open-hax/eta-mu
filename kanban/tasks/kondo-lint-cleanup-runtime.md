---
uuid: "kondo-lint-cleanup-runtime"
title: "Clean up clj-kondo findings in runtime"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "quality", "2sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/kondo-lint-cleanup.md"
points: 2
category: "tasks"
---

# Clean up clj-kondo findings in runtime

> Parent epic: `kanban/epics/kondo-lint-cleanup.md`
> Points: 2

## Purpose

Run the shared clj-kondo rules against runtime and resolve every finding per the epic fix policy.

## Scope

- `packages/runtime/src/cljs/**/*.cljs`
- `packages/runtime/test/cljs/**/*.cljs`

## Baseline pre-lint signal

From `docs/kondo-config-baseline.md`:

| File | Promise-chain hits | Likely long fns | js-await usage | File length flag |
|------|--------------------|-----------------|----------------|------------------|
| `src/cljs/eta_mu/ai/shape/message.cljs` | 0 | 1 | 0 |  |
| `src/cljs/eta_mu/coding/domain/session.cljs` | 0 | 1 | 0 |  |
| `src/cljs/eta_mu/coding/extern/process_exec.cljs` | 0 | 1 | 0 |  |
| `src/cljs/eta_mu/coding/shape/session.cljs` | 0 | 2 | 0 |  |
| `src/cljs/eta_mu/garden/shape/block.cljs` | 0 | 1 | 0 |  |
| `src/cljs/eta_mu/gate/domain/validate.cljs` | 0 | 1 | 0 |  |
| `src/cljs/eta_mu/gate/shape/markdown.cljs` | 0 | 1 | 0 | yes |
| `src/cljs/eta_mu/runtime/domain/planner.cljs` | 0 | 1 | 0 |  |
| `src/cljs/eta_mu/runtime/shape/message.cljs` | 0 | 2 | 0 | yes |
| `test/cljs/eta_mu/coding/domain/session_test.cljs` | 0 | 0 | 0 | yes |
| `test/cljs/eta_mu/gate/contract_law_test.cljs` | 0 | 0 | 0 | yes |

No promise-chain or `js-await` signals. Multiple files contain likely long functions and/or exceed 300 lines.

## Work items

- [x] Run `pnpm --filter @open-hax/eta-mu-runtime lint:kondo` and capture the full output.
- [x] For every error: fix the source.
- [x] For every warning: either fix, annotate with `#_:clj-kondo/ignore` + explanatory comment, or open a follow-on task and reference it.
- [x] If new shared-rule findings appear in files not listed above, resolve them too.

## Acceptance criteria

- [x] `pnpm --filter @open-hax/eta-mu-runtime lint:kondo` exits with zero errors.
- [x] All warnings are either fixed or annotated with a justification comment.
- [x] No new `#_:clj-kondo/ignore` appears without a comment.
- [x] No `js-await`/`js-await*` usage remains in source or test trees.

## Verification

```bash
pnpm install
pnpm --filter @open-hax/eta-mu-runtime lint:kondo
```

---
## Completion

- Completed at: 2026-06-15
- `pnpm --filter @open-hax/eta-mu-runtime lint:kondo`: 0 errors, 0 warnings.
- `pnpm --filter @open-hax/eta-mu-runtime cljs:test`: 152 tests, 683 assertions, 0 failures, 0 errors.
- Fixed: unused requires/bindings, redundant let, promise chains converted to `^:async` + `await`.
- No `#_:clj-kondo/ignore` annotations added.
- No changes to `.clj-kondo/config.edn` or `package.json`.
---

**Review note:** Verified clean by parent agent — `lint:kondo` exits 0 errors, 0 warnings.

---
Board audit 2026-07-12: regression — packages/runtime lint now emits 23 unused-binding warnings in test/cljs/eta_mu/coding/**, independent of the broken shared kondo config. Zero-warning gate does not hold.
---
