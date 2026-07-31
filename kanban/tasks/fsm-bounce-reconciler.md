---
category: "tasks"
labels: ["tasks", "cljs", "fsm", "kanban", "reconciliation"]
parent: "fsm-engine"
write-id: "1785355409179-0.4q3pdzsxwfnurgmcztd"
points: "3"
source: "kanban/epics/fsm-engine.md"
title: "FSM: bounce reconciler"
priority: "P1"
status: "rejected"
uuid: "fsm-bounce-reconciler"
created_at: "2026-06-17T00:00:00Z"
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

---
Rescope record 2026-07-29. Successor: [Workflow DSL — Katamorph language, Rheos interpreter, Kanban reference workflow](../epics/workflow-dsl-kanban-reference.md). Preserve reconciliation to the accepted fixpoint, reframed as a typed rejection/conflict event followed by canonical projection rematerialization. Appending reasons to card bodies is not universal controller behavior.

---