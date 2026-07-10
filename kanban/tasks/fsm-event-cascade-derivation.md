---
uuid: "fsm-event-cascade-derivation"
title: "FSM: event derivation cascade"
status: "rejected"
priority: "P1"
labels: ["tasks", "cljs", "fsm", "kanban", "reconciliation"]
created_at: "2026-06-17T00:00:00Z"
source: "kanban/epics/fsm-engine.md"
points: 5
category: "tasks"
parent: "fsm-engine"
---

# FSM: event derivation cascade

Implement the trigger-derivation chain that refines a raw file event into a
workflow transition request: `fs.changed` → `doc.frontmatter-updated` →
`workflow.transition-requested`. Each trigger is `(predicate, derivation)` data.

## Acceptance

- [ ] `fs.changed {path}` predicate: path is a markdown file with frontmatter.
- [ ] Derive `doc.frontmatter-updated {task-id, prev-fm, next-fm}` by diffing the
      new frontmatter against the `prev-fm` projection (see ledger-fold task).
- [ ] Predicate `:status ∈ changed-keys` derives
      `workflow.transition-requested {task-id, from, to}` with `from` = accepted
      (ledger fold) and `to` = proposed (frontmatter).
- [ ] Triggers are composable data, not hardcoded control flow.
- [ ] Unit tests for each derivation step and the status-key predicate.
- [ ] Zero clj-kondo warnings; Rheos tests pass.
