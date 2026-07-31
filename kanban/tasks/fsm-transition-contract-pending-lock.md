---
category: "tasks"
labels: ["tasks", "cljs", "fsm", "kanban", "reconciliation"]
parent: "fsm-engine"
write-id: "1785355408386-0.cakguhz22bi9s0c9j36"
points: "5"
source: "kanban/epics/fsm-engine.md"
title: "FSM: transition contract + pending lock"
priority: "P1"
status: "rejected"
uuid: "fsm-transition-contract-pending-lock"
created_at: "2026-06-17T00:00:00Z"
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

---
Rescope record 2026-07-29. Successor: [Workflow DSL — Katamorph language, Rheos interpreter, Kanban reference workflow](../epics/workflow-dsl-kanban-reference.md). Split this card into workflow category validation, Katamorph contract adjudication, and executor serialization/concurrency policy. A declared edge and an admissible move are separate questions; reject-all concurrency is not universal law.

---