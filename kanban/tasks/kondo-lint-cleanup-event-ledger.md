---
uuid: "kondo-lint-cleanup-event-ledger"
title: "Clean up clj-kondo findings in event-ledger"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "quality", "1sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/kondo-lint-cleanup.md"
points: 1
category: "tasks"
---

# Clean up clj-kondo findings in event-ledger

> Parent epic: `kanban/epics/kondo-lint-cleanup.md`
> Points: 1

## Purpose

Run the shared clj-kondo rules against event-ledger and resolve every finding per the epic fix policy.

## Scope

- `packages/event-ledger/src/**/*.cljs`
- `packages/event-ledger/test/**/*.cljs`

## Baseline pre-lint signal

From `docs/kondo-config-baseline.md`:

No files flagged in the pre-lint scan. This package already had the shared rules installed locally, so it is likely close to clean.

## Work items

- [ ] Run `pnpm --filter @promethean-os/event-ledger lint:kondo` and capture the full output.
- [ ] For every error: fix the source.
- [ ] For every warning: either fix, annotate with `#_:clj-kondo/ignore` + explanatory comment, or open a follow-on task and reference it.
- [ ] Preserve the `(malli.core/=>)` exclusion in `.clj-kondo/config.edn`.

## Acceptance criteria

- [ ] `pnpm --filter @promethean-os/event-ledger lint:kondo` exits with zero errors.
- [ ] All warnings are either fixed or annotated with a justification comment.
- [ ] No new `#_:clj-kondo/ignore` appears without a comment.
- [ ] No `js-await`/`js-await*` usage remains in source or test trees.

## Verification

```bash
pnpm install
pnpm --filter @promethean-os/event-ledger lint:kondo
```

---

## Completion

- `pnpm --filter @promethean-os/event-ledger lint:kondo` baseline confirmed: 0 errors, 0 warnings.
- No source changes required.
- `(malli.core/=>)` exclusion preserved in `packages/event-ledger/.clj-kondo/config.edn`.
- No new `#_:clj-kondo/ignore` annotations added.
- Completed 2026-06-15.

---

**Review note:** Verified clean by parent agent — `lint:kondo` exits 0 errors, 0 warnings.
