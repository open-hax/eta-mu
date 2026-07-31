---
category: "tasks"
labels: ["tasks", "cljs", "fsm", "kanban", "reconciliation"]
parent: "fsm-engine"
write-id: "1785355407990-0.kpctb9ywu50sxj16ig"
points: "5"
source: "kanban/epics/fsm-engine.md"
title: "FSM: event derivation cascade"
priority: "P1"
status: "rejected"
uuid: "fsm-event-cascade-derivation"
created_at: "2026-06-17T00:00:00Z"
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

---
Rescope record 2026-07-29. Successor: [Workflow DSL — Katamorph language, Rheos interpreter, Kanban reference workflow](../epics/workflow-dsl-kanban-reference.md). Preserve composable trigger, predicate, and derivation semantics as Workflow DSL primitives. Filesystem change detection is one Rheos projection-ingress adapter, not the workflow core.

---