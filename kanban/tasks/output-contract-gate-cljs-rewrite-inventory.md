---
uuid: "output-contract-gate-cljs-rewrite-inventory"
title: "Output Contract Gate CLJS Rewrite — Inventory"
status: done
priority: P1
labels: ["tasks", "cljs", "rewrite", "output-contract-gate"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/output-contract-gate-cljs-rewrite.md"
points: 2
category: tasks
---
# Output Contract Gate CLJS Rewrite — Inventory

> Parent epic: `kanban/epics/output-contract-gate-cljs-rewrite.md`
> Points: 2

## Purpose

Catalog every source file in `packages/legacy/output-contract-gate` and classify each module into the target namespace taxonomy (domain, shape, law, extern, infra, cli).

## Deliverables

- Inventory document (e.g., `docs/output-contract-gate-cljs-rewrite-inventory.md`) listing all 16 source files.
- Classification per module: `law.*`, `domain.*`, `shape.*`, `extern.*`, `infra.*`, or `cli.*`.
- Documented contract rules currently enforced by `validate.ts` and `review.ts`.
- Identified inter-module dependencies and pure vs. effectful boundaries.

## Verification gate

- [ ] Every `src/*.ts` file is classified with a rationale.
- [ ] Every public export from `src/index.ts` maps to a target CLJS namespace.
- [ ] Inventory reviewed and accepted as input for `output-contract-gate-cljs-rewrite-law-schemas`.

---

> Produced: `docs/output-contract-gate-cljs-rewrite-inventory.md` cataloging all 16 source files, public exports, consumers, JS interop surfaces, enforced contract rules, and namespace classification into `domain/shape/law/infra/extern/cli`.
>
> Next recommended task: `output-contract-gate-cljs-rewrite-law-schemas` — port `src/types.ts` to Malli schemas under `eta_mu.gate.law.contract`.
