---
uuid: "github-cljs-rewrite-review-gate"
title: "GitHub CLJS Rewrite — Review Gate Domain"
status: "blocked"
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "github"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/github-cljs-rewrite.md"
points: 2
category: "tasks"
---

# GitHub CLJS Rewrite — Review Gate Domain

> Parent epic: `kanban/epics/github-cljs-rewrite.md`
> Scope: `packages/legacy/github/src/review-gate.ts`
> Points: 2

## Purpose

Port the review gate state machine and policy logic to CLJS without redesigning the policy.

## Scope

- Review state transitions (pending, approved, changes requested, dismissed)
- Merge eligibility decisions
- `review-gate.test.ts` parity

## Work items

- [ ] Implement `eta_mu.github.domain.review` for review state transitions.
- [ ] Implement `eta_mu.github.law.review` Malli schemas.
- [ ] Add regression tests matching `review-gate.test.ts` scenarios.
- [ ] Keep `src/review-gate.ts` as a thin TS wrapper.

## Acceptance criteria

- [ ] Review state transitions match the legacy implementation.
- [ ] Schemas validate review payloads and reject invalid state changes.
- [ ] Existing `review-gate.test.ts` passes against the CLJS-backed wrapper.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-github test -- review-gate
pnpm --filter @open-hax/eta-mu-github typecheck
```

---
**Status note:** Blocked by `github-cljs-rewrite-inventory`, `github-cljs-rewrite-extern-adapters` (needs review payload shapes), and `eta-mu-cljs-rewrite-boundary-adapters` (boundary patterns still in progress).
---
