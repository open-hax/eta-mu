---
category: "tasks"
labels: ["tasks", "cljs", "fsm", "kanban", "reconciliation"]
parent: "fsm-engine"
write-id: "1785355408796-0.otq0qc1xir9y8i8qtw"
points: "3"
source: "kanban/epics/fsm-engine.md"
title: "FSM: ledger fold + frontmatter projection"
priority: "P1"
status: "rejected"
uuid: "fsm-ledger-fold-accepted-state"
created_at: "2026-06-17T00:00:00Z"
---

# FSM: ledger fold + frontmatter projection

Make the ledger fold the source of truth for accepted state, and the memory used
to diff frontmatter changes (`prev-fm`).

## Acceptance

- [ ] Pure fold over `workflow.transition-accepted` events → accepted state per
      task-id.
- [ ] Project last-known frontmatter per task-id to supply `prev-fm` for
      `doc.frontmatter-updated` diffing.
- [ ] Retire `kanban.drift-detected`: callers read accepted state from the fold,
      drift is reframed as `transition-requested`.
- [ ] Optional opt-in `:status-accepted` stamp helper (workflow discretion; the
      fold remains the universal truth).
- [ ] Unit tests: fold correctness and projection across multi-hop histories.
- [ ] Zero clj-kondo warnings; Rheos tests pass.

---
Rescope record 2026-07-29. Successor: [Workflow DSL — Katamorph language, Rheos interpreter, Kanban reference workflow](../epics/workflow-dsl-kanban-reference.md). The accepted-state fold invariant survives, but this card is superseded operationally by rheos-canonical-task-fold-and-snapshots under rheos-ledger-authoritative-projections. Compose with that broader work instead of rebuilding a status-only fold.
---