---
uuid: "agent-cljs-rewrite-phase-1-inventory-contracts"
title: "Agent CLJS Rewrite — Inventory and Contract Map"
status: "done"
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "agent"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/agent-cljs-rewrite.md"
points: 2
category: "tasks"
---

# Agent CLJS Rewrite — Inventory and Contract Map

> Parent epic: `kanban/epics/agent-cljs-rewrite.md`
> Phase: 1
> Points: 2

## Purpose

Catalog every source file and public export in `packages/legacy/agent` and classify them into the target namespace taxonomy before any porting begins.

## Scope

- `src/agent.ts` (agent facade and orchestration)
- `src/agent-loop.ts` (turn loop and state machine)
- `src/proxy.ts` (proxy wrapper and interception)
- `src/types.ts` (runtime type contracts)
- `src/index.ts` (public package exports)
- `test/agent.test.ts`, `test/agent-loop.test.ts`, `test/e2e.test.ts`

## Work items

- [ ] Produce a file-by-file inventory in `docs/agent-cljs-rewrite-inventory.md`.
- [ ] Classify each module as `domain`, `shape`, `law`, `infra`, `extern`, or `cli`.
- [ ] Map public exports from `src/index.ts` to their CLJS facade targets.
- [ ] Document the proxy behavior contract and agent-loop state machine.
- [ ] Identify every consumer inside `packages/legacy` for each public export.

## Acceptance criteria

- [ ] Every `src/**/*.ts` file has a proposed CLJS namespace destination.
- [ ] Public exports from `src/index.ts` are mapped to stable CLJS facades.
- [ ] Proxy behavior contract and agent-loop state machine are documented.
- [ ] Dependencies on `eta-mu-cljs-runtime-rewrite` and `eta-mu-cljs-rewrite-boundary-adapters` are explicit.

## Verification

```bash
ls docs/agent-cljs-rewrite-inventory.md
pnpm --filter @open-hax/eta-mu-agent-core typecheck
```

---
Ready for breakdown: `eta-mu-cljs-rewrite-runtime-core` is done and core boundary adapters (`eta-mu-cljs-rewrite-boundary-adapters`) have established extern conventions. Inventory can classify against the existing domain/shape/law/extern taxonomy while documenting remaining adapter dependencies.
---

**Phase 1 deliverable completed:** `docs/agent-cljs-rewrite-inventory.md` now catalogs all source and test files in `packages/legacy/agent`, maps every public export to a proposed CLJS namespace (`eta_mu.agent.domain.*`, `eta_mu.agent.shape.*`, `eta_mu.agent.law.*`, `eta_mu.agent.extern.*`, `eta_mu.agent.infra.*`, `eta_mu.agent.cli.*`), documents consumers inside `packages/legacy` (primarily `coding-agent`), lists raw JS interop surfaces, and records dependencies on the runtime core and boundary adapters.

**Next recommended task:** Create the Phase 2 task for boundary adapters (`eta_mu.agent.extern.proxy` fetch/SSE reconstruction and Malli schema replacements for TypeBox in `eta_mu.agent.law.types`) and begin porting with conversion regression tests.
