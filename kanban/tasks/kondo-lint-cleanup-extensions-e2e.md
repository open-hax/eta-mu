---
uuid: "kondo-lint-cleanup-extensions-e2e"
title: "Clean up clj-kondo findings in extensions-e2e"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "quality", "1sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/kondo-lint-cleanup.md"
points: 1
category: "tasks"
---

# Clean up clj-kondo findings in extensions-e2e

> Parent epic: `kanban/epics/kondo-lint-cleanup.md`
> Points: 1

## Purpose

Run the shared clj-kondo rules against extensions-e2e and resolve every finding per the epic fix policy.

## Scope

- `packages/extensions-e2e/src/**/*.cljs`

## Baseline pre-lint signal

From `docs/kondo-config-baseline.md`:

No files flagged in the pre-lint scan. The package is small; the actual run may still surface findings.

## Work items

- [ ] Run `pnpm --filter @open-hax/eta-mu-extensions-e2e lint:kondo` and capture the full output.
- [ ] For every error: fix the source.
- [ ] For every warning: either fix, annotate with `#_:clj-kondo/ignore` + explanatory comment, or open a follow-on task and reference it.

## Acceptance criteria

- [ ] `pnpm --filter @open-hax/eta-mu-extensions-e2e lint:kondo` exits with zero errors.
- [ ] All warnings are either fixed or annotated with a justification comment.
- [ ] No new `#_:clj-kondo/ignore` appears without a comment.
- [ ] No `js-await`/`js-await*` usage remains in source or test trees.

## Verification

```bash
pnpm install
pnpm --filter @open-hax/eta-mu-extensions-e2e lint:kondo
```

---

## Completion

- Status: `done`
- Completed: 2026-06-15
- Verification:
  - `pnpm --filter @open-hax/eta-mu-extensions-e2e lint:kondo`
  - Output: `linting took 18ms, errors: 0, warnings: 0`
- Changes:
  - Fixed two unused-binding warnings in `packages/extensions-e2e/src/eta_mu_extensions_e2e/core_test.cljs` by asserting the expected `:step` values on `state0` and `state1`.
- No `#_:clj-kondo/ignore` annotations were added.
- No `js-await`/`js-await*` usage remains in source or test trees.

---

**Review note:** Verified clean by parent agent — `lint:kondo` exits 0 errors, 0 warnings.
