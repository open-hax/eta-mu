---
uuid: "github-cljs-rewrite-cutover"
title: "GitHub CLJS Rewrite — Cutover"
status: icebox
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "github"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/github-cljs-rewrite.md"
points: 1
category: "tasks"
---
# GitHub CLJS Rewrite — Cutover

> Parent epic: `kanban/epics/github-cljs-rewrite.md`
> Scope: `packages/legacy/github`
> Points: 1

## Purpose

Delete obsolete TypeScript modules only after CLJS parity has been proven and documented.

## Scope

- Remove fully-migrated `src/*.ts` implementation files.
- Update `package.json` exports if needed.
- Preserve rollback path and record any blockers.

## Work items

- [ ] Confirm all upstream tasks have passing parity tests.
- [ ] Delete obsolete TS source files that are fully replaced by CLJS.
- [ ] Verify package still builds, typechecks, and passes tests.
- [ ] Record blockers for any TS files that cannot yet be removed.

## Acceptance criteria

- [ ] No obsolete TS implementation remains for migrated slices.
- [ ] `pnpm --filter @open-hax/eta-mu-github test` passes.
- [ ] `node scripts/ts-line-count.mjs packages/legacy/github` shows reduced TS line count.
- [ ] Rollback path is a single revert of the cutover commit.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-github test
pnpm --filter @open-hax/eta-mu-github typecheck
pnpm --filter @open-hax/eta-mu-github build
node scripts/ts-line-count.mjs packages/legacy/github
```

---
**Status note:** Blocked by all upstream GitHub rewrite tasks and core program dependencies (`eta-mu-cljs-rewrite-boundary-adapters`, `fetch-timeout-abort-controller`).
---
