---
uuid: "fsm-bounce-reconciler"
title: "FSM: bounce reconciler"
status: "rejected"
priority: "P1"
labels: ["tasks", "cljs", "fsm", "kanban", "reconciliation"]
created_at: "2026-06-17T00:00:00Z"
source: "kanban/epics/fsm-engine.md"
points: 3
category: "tasks"
parent: "fsm-engine"
---

# FSM: bounce reconciler

Trigger over `workflow.transition-rejected` that restores frontmatter to the last
workflow-blessed status and appends the rejection reasons to the card body.

## Acceptance

- [ ] Bounce trigger over `workflow.transition-rejected`.
- [ ] Restore `:status` to the last blessed value: idle ⇒ accepted (`from`),
      pending ⇒ pending target (`to`), final reject ⇒ accepted.
- [ ] Append `reasons` to the card body (automate the hand-written bounce-note trail).
- [ ] Bounce write re-enters the cascade and dies at the `from == to` fixpoint.
- [ ] Unit tests: reject → bounce → fixpoint termination; reasons appended once
      (idempotent).
- [ ] Zero clj-kondo warnings; Rheos tests pass.
