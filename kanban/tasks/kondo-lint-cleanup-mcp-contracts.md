---
uuid: "kondo-lint-cleanup-mcp-contracts"
title: "Clean up clj-kondo findings in mcp-contracts"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "quality", "1sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/kondo-lint-cleanup.md"
points: 1
category: "tasks"
---

# Clean up clj-kondo findings in mcp-contracts

> Parent epic: `kanban/epics/kondo-lint-cleanup.md`
> Points: 1

## Purpose

Run the shared clj-kondo rules against mcp-contracts and resolve every finding per the epic fix policy.

## Scope

- `packages/mcp-contracts/src/**/*.cljs`

## Baseline pre-lint signal

From `docs/kondo-config-baseline.md`:

No files flagged in the pre-lint scan. The package contains a single source file.

## Work items

- [ ] Run `pnpm --filter @open-hax/mcp-contracts lint:kondo` and capture the full output.
- [ ] For every error: fix the source.
- [ ] For every warning: either fix, annotate with `#_:clj-kondo/ignore` + explanatory comment, or open a follow-on task and reference it.

## Acceptance criteria

- [ ] `pnpm --filter @open-hax/mcp-contracts lint:kondo` exits with zero errors.
- [ ] All warnings are either fixed or annotated with a justification comment.
- [ ] No new `#_:clj-kondo/ignore` appears without a comment.
- [ ] No `js-await`/`js-await*` usage remains in source or test trees.

## Verification

```bash
pnpm install
pnpm --filter @open-hax/mcp-contracts lint:kondo
```

---

## Completion

- [x] Ran `pnpm --filter @open-hax/mcp-contracts lint:kondo`.
- [x] Result: 0 errors, 0 warnings.
- [x] No `#_:clj-kondo/ignore` annotations required.
- [x] No `js-await`/`js-await*` usage remains in source or test trees.
- Status: done

---

**Review note:** Verified clean by parent agent — `lint:kondo` exits 0 errors, 0 warnings.
