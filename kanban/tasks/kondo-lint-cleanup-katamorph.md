---
uuid: "kondo-lint-cleanup-katamorph"
title: "Clean up clj-kondo findings in katamorph"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "quality", "1sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/kondo-lint-cleanup.md"
points: 1
category: "tasks"
---

# Clean up clj-kondo findings in katamorph

> Parent epic: `kanban/epics/kondo-lint-cleanup.md`
> Points: 1

## Purpose

Run the shared clj-kondo rules against katamorph and resolve every finding per the epic fix policy.

## Scope

- `packages/katamorph/src/cljs/**/*.cljs`
- `packages/katamorph/test/cljs/**/*.cljs`

## Baseline pre-lint signal

From `docs/kondo-config-baseline.md`:

| File | Promise-chain hits | Likely long fns | js-await usage | File length flag |
|------|--------------------|-----------------|----------------|------------------|
| `src/cljs/katamorph/agent/reasoning.cljs` | 0 | 1 | 0 |  |
| `src/cljs/katamorph/agent/text_delta.cljs` | 0 | 1 | 0 |  |
| `src/cljs/katamorph/policy/eval.cljs` | 0 | 1 | 0 |  |
| `src/cljs/katamorph/schema.cljs` | 0 | 0 | 0 | yes |

No promise-chain or `js-await` signals. Three files contain likely long functions and one file exceeds 300 lines.

## Work items

- [ ] Run `pnpm --filter @open-hax/katamorph lint:kondo` and capture the full output.
- [ ] For every error: fix the source.
- [ ] For every warning: either fix, annotate with `#_:clj-kondo/ignore` + explanatory comment, or open a follow-on task and reference it.
- [ ] If new shared-rule findings appear in files not listed above, resolve them too.

## Acceptance criteria

- [ ] `pnpm --filter @open-hax/katamorph lint:kondo` exits with zero errors.
- [ ] All warnings are either fixed or annotated with a justification comment.
- [ ] No new `#_:clj-kondo/ignore` appears without a comment.
- [ ] No `js-await`/`js-await*` usage remains in source or test trees.

## Verification

```bash
pnpm install
pnpm --filter @open-hax/katamorph lint:kondo
```

---

## Completion

- Ran `pnpm --filter @open-hax/katamorph lint:kondo`.
- Fixed all 22 warnings:
  - Removed unused private `known-kind?` and unused `run-action!` binding in `src/cljs/katamorph/action/interpreter.cljs`.
  - Removed deprecated `PipelineStep` / `PipelineContract` schemas and the `:pipeline` registry entry in `src/cljs/katamorph/schema.cljs`.
  - Removed unused `cljs.test/testing` requires from `test/cljs/katamorph/policy/gate_test.cljs` and `test/cljs/katamorph/schema_test.cljs`.
  - Converted promise chains to `^:async` / `await` in `test/cljs/katamorph/store/memory_test.cljs`.
- Final clj-kondo: `errors: 0, warnings: 0`.
- Ran `pnpm --filter @open-hax/katamorph test`: 102 tests, 253 assertions, 0 failures, 0 errors.
- Did not modify katamorph's `.clj-kondo/config.edn` or `package.json`.

---

**Review note:** Verified clean by parent agent — `lint:kondo` exits 0 errors, 0 warnings.
