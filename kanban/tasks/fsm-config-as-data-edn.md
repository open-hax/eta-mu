---
uuid: "fsm-config-as-data-edn"
title: "FSM: absorb .kanban config into .eta-mu edn"
status: "rejected"
priority: "P1"
labels: ["tasks", "cljs", "fsm", "kanban", "reconciliation", "config-as-data"]
created_at: "2026-06-17T00:00:00Z"
source: "kanban/epics/fsm-engine.md"
points: 5
category: "tasks"
parent: "fsm-engine"
---

# FSM: absorb .kanban config into .eta-mu edn

Move kanban/FSM/workflow config into `.eta-mu` as edn. FSM states/transitions/
checks and trigger/action contracts are all data; frontmatter stays the only live
mutable surface.

## Acceptance

- [ ] FSM definitions (states/transitions/checks) live as edn under `.eta-mu`.
- [ ] Trigger/action contracts expressed as edn data (not hardcoded).
- [ ] `.kanban` config absorbed/migrated; loader reads from `.eta-mu`.
- [ ] Board attaches its FSM via config — no hardcoded FSM.
- [ ] Migration note + back-compat path for existing boards.
- [ ] Unit tests: config load and FSM attach.
- [ ] Zero clj-kondo warnings; Rheos tests pass.
