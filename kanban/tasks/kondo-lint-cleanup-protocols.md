---
uuid: "kondo-lint-cleanup-protocols"
title: "Clean up clj-kondo findings in protocols"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "quality", "1sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/kondo-lint-cleanup.md"
points: 1
category: "tasks"
---

# Clean up clj-kondo findings in protocols

> Parent epic: `kanban/epics/kondo-lint-cleanup.md`
> Points: 1

## Purpose

Run the shared clj-kondo rules against protocols and resolve every finding per the epic fix policy.

## Scope

- `packages/protocols/src/**/*.cljs`
- `packages/protocols/test/**/*.cljs`

## Baseline pre-lint signal

From `docs/kondo-config-baseline.md`:

No files flagged in the pre-lint scan. This package already had the shared rules installed locally, so it is likely close to clean.

## Work items

- [ ] Run `pnpm --filter @promethean-os/openplanner-protocols lint:kondo` and capture the full output.
- [ ] For every error: fix the source.
- [ ] For every warning: either fix, annotate with `#_:clj-kondo/ignore` + explanatory comment, or open a follow-on task and reference it.
- [ ] Preserve the `(malli.core/=>)` exclusion in `.clj-kondo/config.edn`.

## Acceptance criteria

- [x] `pnpm --filter @promethean-os/openplanner-protocols lint:kondo` exits with zero errors.
- [x] All warnings are either fixed or annotated with a justification comment.
- [x] No new `#_:clj-kondo/ignore` appears without a comment.
- [x] No `js-await`/`js-await*` usage remains in source or test trees.

## Notes

- Converted promise chains in `packages/protocols/src/promethean/records/edn/event_admission.cljs` to `^:async`/`await` helpers.
- Removed the unused `this` binding in `append-events!`.
- Preserved the `(malli.core/=>)` exclusion in `packages/protocols/.clj-kondo/config.edn`.
- `pnpm --filter @promethean-os/openplanner-protocols compile:lib` succeeds.
- Pre-existing test failures in `promethean.records.mongo.user-management-test` exist on HEAD and are unrelated to this change.

---

Completed: 2026-06-15

## Verification

```bash
pnpm install
pnpm --filter @promethean-os/openplanner-protocols lint:kondo
```

---

**Review note:** Verified clean by parent agent — `lint:kondo` exits 0 errors, 0 warnings.
