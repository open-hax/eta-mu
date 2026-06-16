---
uuid: "agent-cljs-rewrite-phase-2-extern-adapters"
title: "Agent CLJS Rewrite — Boundary Adapters"
status: "blocked"
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "agent"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/agent-cljs-rewrite.md"
points: 3
category: "tasks"
---

# Agent CLJS Rewrite — Boundary Adapters

> Parent epic: `kanban/epics/agent-cljs-rewrite.md`
> Phase: 2
> Points: 3

## Purpose

Create the `eta_mu.agent.extern.*` boundary layer so provider SDK payloads, HTTP streams, timers, and other raw JavaScript surfaces are isolated from the pure agent domain.

## Scope

- Provider SDK payload adapters (request/response shape conversion)
- HTTP stream adapters for agent-loop network I/O
- Timer and scheduling adapters
- Raw JS interop helpers used by `infra.*` and `cli.*`

## Work items

- [ ] Define `extern.*` namespaces for provider SDK payloads.
- [ ] Define `extern.*` namespaces for HTTP streams and timers.
- [ ] Add conversion regression tests for each extern adapter.
- [ ] Verify no raw JS interop leaks outside `extern.*` namespaces.
- [ ] Document opaque handle rules for SDK objects that must stay in JS land.

## Acceptance criteria

- [ ] Every effectful agent path has an `extern.*` adapter.
- [ ] Each adapter has at least one conversion regression test.
- [ ] Boundary scanner reports no disallowed raw JS interop outside `extern.*`.
- [ ] Adapters expose CLJS-first APIs: maps, vectors, scalars, or opaque handles.

## Verification

```bash
pnpm --dir packages/eta-mu-runtime cljs:boundary
pnpm --filter @open-hax/eta-mu-agent-core test
node scripts/ts-line-count.mjs packages/legacy/agent
```

---
Blocked by `agent-cljs-rewrite-phase-1-inventory-contracts`: the inventory must finish classifying which surfaces need agent-specific extern adapters. Also blocked by core program `eta-mu-cljs-rewrite-boundary-adapters` (status: in_progress) until shared extern conventions are finalized.
---
