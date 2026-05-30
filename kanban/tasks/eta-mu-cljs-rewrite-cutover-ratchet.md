---
uuid: "eta-mu-cljs-rewrite-cutover-ratchet"
title: "Eta-mu CLJS Rewrite — Cutover Ratchet"
status: todo
priority: P1
labels: ["tasks", "cljs", "rewrite", "cutover", "8sp"]
created_at: "2026-05-29T21:18:48Z"
source: "kanban/epics/eta-mu-cljs-runtime-rewrite.md"
points: 8
category: tasks
---

# Eta-mu CLJS Rewrite — Cutover Ratchet

> Parent epic: `kanban/epics/eta-mu-cljs-runtime-rewrite.md`
> Points: 8

## Purpose

Retire TypeScript/JavaScript runtime slices only after CLJS parity is proven, with no repo-wide destructive cleanup.

## Scope

- path-scoped replacement commits
- package export updates
- obsolete TS deletion after parity
- docs and service runner updates
- red-suite/blocker ledger maintenance

## Work items

- [ ] Define the cutover checklist every migrated slice must satisfy.
- [ ] Require parity tests before deleting or bypassing TS modules.
- [ ] Preserve package names, binary names, and service wiring until explicit compatibility evidence says otherwise.
- [ ] Record blockers for historical failures instead of hiding them in broad rewrites.
- [ ] Update kanban task status and comments after each verified slice.

## Acceptance criteria

- [ ] The first TS slice is deleted or demoted only after CLJS replacement tests pass.
- [ ] Package exports and docs point at the CLJS-backed implementation for the migrated slice.
- [ ] A rollback path exists for every cutover commit.
- [ ] No unrelated workspace dirt is staged or committed as part of cutover work.

## Verification

```bash
git diff --stat
pnpm --filter @open-hax/eta-mu-cli test
pnpm --dir packages/eta-mu-runtime cljs:verify
pnpm test
```
