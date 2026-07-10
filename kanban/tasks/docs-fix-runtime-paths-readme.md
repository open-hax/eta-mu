---
uuid: "docs-fix-runtime-paths-readme"
title: "Fix packages/runtime README and stale eta-mu-runtime path references"
status: "ready"
priority: "P1"
labels: ["docs", "runtime", "paths", "3sp"]
created_at: "2026-06-17T00:00:00Z"
source: "docs discovery sweep 2026-06-16"
points: 3
category: "tasks"
---

# Fix packages/runtime README and stale eta-mu-runtime path references

## Context

The runtime package moved from `packages/eta-mu-runtime` to `packages/runtime`, but the old path still appears in the top-level README, kanban epics/tasks, and rewrite plan docs. The package README also only covers the original runtime-core surface and omits the expanded CLJS domains now in the package.

## Findings

- Top-level README lists `packages/eta-mu-runtime` and non-existent `services/eta-mu`.
- `packages/runtime/README.md` only documents `createSurfaceCommandResult` and the original belief/panel/envelope surface.
- Missing documentation for `eta_mu.ai.*`, `eta_mu.coding.*`, `eta_mu.docs.*`, `eta_mu.garden.*`, `eta_mu.gate.*`.
- Rewrite plan docs (`cljs-runtime-rewrite-runtime-core-plan.md`, etc.) still reference `packages/eta-mu-runtime`.
- No ownership resolution doc for `packages/runtime` vs `packages/sol` categories.

## Acceptance

- [ ] Update top-level README and rewrite plan docs to use `packages/runtime`; remove `services/eta-mu` references.
- [ ] Rewrite `packages/runtime/README.md` to document the full facade exports, `domain/law/shape/extern/infra` layout, expanded domains, and scripts (`test`, `typecheck`, `cljs:verify`, `cljs:boundary`).
- [ ] Add a short ADR or note resolving `packages/runtime` vs `packages/sol` ownership and explaining why non-runtime domains currently live in `packages/runtime`.
