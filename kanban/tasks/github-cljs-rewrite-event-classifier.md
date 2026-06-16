---
uuid: "github-cljs-rewrite-event-classifier"
title: "GitHub CLJS Rewrite — Event Classifier"
status: "blocked"
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "github"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/github-cljs-rewrite.md"
points: 2
category: "tasks"
---

# GitHub CLJS Rewrite — Event Classifier

> Parent epic: `kanban/epics/github-cljs-rewrite.md`
> Scope: `packages/legacy/github/src/event-classifier.ts`
> Points: 2

## Purpose

Port the GitHub webhook/event classifier to CLJS as a data-in/data-out `infra` namespace.

## Scope

- Event type extraction from GitHub webhook payloads
- Payload normalization and routing tags
- `event-classifier.test.ts` parity

## Work items

- [ ] Implement `eta_mu.github.infra.events` for event classification.
- [ ] Define `eta_mu.github.law.events` Malli schemas for known payloads.
- [ ] Add regression tests for each event type in `event-classifier.test.ts`.
- [ ] Keep `src/event-classifier.ts` as a thin TS wrapper.

## Acceptance criteria

- [ ] All classified event types from the legacy classifier are preserved.
- [ ] Schemas reject unknown or malformed event shapes.
- [ ] Existing `event-classifier.test.ts` passes against the CLJS-backed wrapper.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-github test -- event-classifier
pnpm --dir packages/eta-mu-runtime cljs:verify
```

---
**Status note:** Blocked by `github-cljs-rewrite-inventory`, `github-cljs-rewrite-extern-adapters` (needs webhook payload schemas), and `eta-mu-cljs-rewrite-boundary-adapters` (boundary patterns still in progress).
---
