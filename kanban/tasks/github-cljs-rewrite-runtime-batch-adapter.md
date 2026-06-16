---
uuid: "github-cljs-rewrite-runtime-batch-adapter"
title: "GitHub CLJS Rewrite — Runtime Batch Adapter"
status: "blocked"
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "github"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/github-cljs-rewrite.md"
points: 2
category: "tasks"
---

# GitHub CLJS Rewrite — Runtime Batch Adapter

> Parent epic: `kanban/epics/github-cljs-rewrite.md`
> Scope: `packages/legacy/github/src/runtime-batch.ts`
> Points: 2

## Purpose

Port the GitHub runtime batching orchestrator to CLJS and wire it to the CLJS runtime state primitives.

## Scope

- Batch request grouping and scheduling
- Runtime state primitive integration
- Existing `runtime-batch.test.ts` parity

## Work items

- [ ] Implement `eta_mu.github.infra.batch` mirroring the TS batch scheduler.
- [ ] Wire batch state to CLJS runtime atoms/records instead of TS promises.
- [ ] Add CLJS tests covering batch flush, reorder, and error propagation.
- [ ] Keep `src/runtime-batch.ts` as a thin compatibility wrapper during the transition.

## Acceptance criteria

- [ ] `infra.batch` schedules and flushes batches identically to the TS version.
- [ ] Batch errors propagate to callers without unhandled rejections.
- [ ] Existing `runtime-batch.test.ts` passes against the CLJS-backed wrapper.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-github test -- runtime-batch
pnpm --filter @open-hax/eta-mu-github typecheck
```

---
**Status note:** Blocked by `github-cljs-rewrite-inventory`, `github-cljs-rewrite-extern-adapters` (needs fetch/client adapter), `eta-mu-cljs-rewrite-boundary-adapters` (runtime state primitive patterns still in progress), and `fetch-timeout-abort-controller` (target file `runtime-batch.ts` is the one being modified).
---
