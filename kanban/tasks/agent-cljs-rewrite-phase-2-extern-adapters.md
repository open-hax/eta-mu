---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "agent"]
write-id: "1783693258835-0.p1dtibid4bxkc4u5rx"
points: "3"
source: "kanban/epics/agent-cljs-rewrite.md"
title: "Agent CLJS Rewrite — Boundary Adapters"
priority: "P0"
status: "ready"
uuid: "agent-cljs-rewrite-phase-2-extern-adapters"
created_at: "2026-06-15T00:00:00Z"
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
Formerly blocked by `agent-cljs-rewrite-phase-1-inventory-contracts` and core program `eta-mu-cljs-rewrite-boundary-adapters`; both are done as of 2026-07-10, so this card is ready.
---