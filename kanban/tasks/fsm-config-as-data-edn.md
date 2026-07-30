---
category: "tasks"
labels: ["tasks", "cljs", "fsm", "kanban", "reconciliation", "config-as-data"]
parent: "fsm-engine"
write-id: "1785355407594-0.riw8d8ba1rqhjcu7hwo"
points: "5"
source: "kanban/epics/fsm-engine.md"
title: "FSM: absorb .kanban config into .eta-mu edn"
priority: "P1"
status: "rejected"
uuid: "fsm-config-as-data-edn"
created_at: "2026-06-17T00:00:00Z"
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

---
Rescope record 2026-07-29. Successor: [Workflow DSL — Katamorph language, Rheos interpreter, Kanban reference workflow](../epics/workflow-dsl-kanban-reference.md). Preserve portable, versioned workflow resources and trigger/action contracts; split Katamorph declarations from Rheos runtime bindings instead of absorbing all board and runtime concerns into one universal config.
---