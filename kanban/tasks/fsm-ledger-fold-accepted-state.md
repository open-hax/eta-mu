---
uuid: "fsm-ledger-fold-accepted-state"
title: "FSM: ledger fold + frontmatter projection"
status: "incoming"
priority: "P1"
labels: ["tasks", "cljs", "fsm", "kanban", "reconciliation"]
created_at: "2026-06-17T00:00:00Z"
source: "kanban/epics/fsm-engine.md"
points: 3
category: "tasks"
parent: "fsm-engine"
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
