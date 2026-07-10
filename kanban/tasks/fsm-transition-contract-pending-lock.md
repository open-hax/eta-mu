---
uuid: "fsm-transition-contract-pending-lock"
title: "FSM: transition contract + pending lock"
status: "incoming"
priority: "P1"
labels: ["tasks", "cljs", "fsm", "kanban", "reconciliation"]
created_at: "2026-06-17T00:00:00Z"
source: "kanban/epics/fsm-engine.md"
points: 5
category: "tasks"
parent: "fsm-engine"
---

# FSM: transition contract + pending lock

Evaluate the transition contract over `workflow.transition-requested`, hold a
single in-flight lock per task-id, and emit pending/accepted/rejected.

## Acceptance

- [ ] `law.transition-contract` schema (trigger predicate + action).
- [ ] Contract evaluation: edge exists? gates/checks pass? (checks may be async).
- [ ] Single in-flight lock per task-id; emit `workflow.transition-pending`.
- [ ] Any status change while pending ⇒ immediate `workflow.transition-rejected`
      (no queue, no supersede).
- [ ] On success ⇒ `workflow.transition-accepted {from, to}`, with `ACCEPTED := to`
      landing in the fold before any workflow frontmatter write.
- [ ] `transition-accepted` is terminal — triggers no further transition (fixpoint).
- [ ] Unit tests including concurrent-edit-during-pending reject.
- [ ] Zero clj-kondo warnings; Rheos tests pass.
