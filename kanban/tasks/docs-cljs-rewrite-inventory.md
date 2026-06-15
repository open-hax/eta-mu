---
uuid: "docs-cljs-rewrite-inventory"
title: "Docs CLJS Rewrite — Consumer Inventory"
status: done
priority: P3
labels: ["tasks", "cljs", "rewrite", "docs", "2sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/docs-cljs-rewrite.md"
points: 2
category: tasks
---
# Docs CLJS Rewrite — Consumer Inventory

> Parent epic: `kanban/epics/docs-cljs-rewrite.md`
> Points: 2

## Purpose

Map every consumer of `@open-hax/eta-mu-docs` so the rewrite preserves the public TypeScript compatibility surface and does not break downstream builds.

## Scope

- `packages/legacy/docs/index.d.ts`
- Workspace-wide imports of `@open-hax/eta-mu-docs`
- `package.json` exports (`main`, `types`, `exports`)

## Work items

- [ ] Search the workspace for imports from `@open-hax/eta-mu-docs`.
- [ ] Record which exported types and functions are actively used.
- [ ] Decide whether the new package is a pure CLJS library with `.d.ts` emit, a TS shim, or a hybrid.
- [ ] Document the consumer inventory and the chosen package shape in `docs/docs-cljs-rewrite-plan.md`.

## Acceptance criteria

- [ ] Consumer inventory lists every package/file that imports `@open-hax/eta-mu-docs`.
- [ ] Decision record explains the chosen compatibility strategy.
- [ ] No code porting begins in this task.

## Verification

```bash
rg --type ts --type js '"@open-hax/eta-mu-docs"' packages/ services/ -l
ls docs/docs-cljs-rewrite-plan.md
```

---

Ready to decompose: this is Phase 1 of the epic. No dependencies on other docs tasks and the core CLJS runtime spine (`eta-mu-cljs-runtime-rewrite`) is already established, so consumer search and package-shape decision can proceed.

---

Produced `docs/docs-cljs-rewrite-inventory.md` with the consumer map, per-type CLJS namespace destinations, and the pure-CLJS-with-`.d.ts`-emit decision. Next recommended task: `kanban/tasks/docs-cljs-rewrite-schemas.md` (Malli schemas + CLJS records).
