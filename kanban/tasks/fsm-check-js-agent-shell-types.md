---
category: "tasks"
labels: ["tasks", "cljs", "fsm", "kanban", "pluggable-checks"]
parent: "fsm-engine"
write-id: "1785355411139-0.ncqk48vqtp9yhrecsjf"
points: "5"
source: "kanban/epics/fsm-engine.md"
title: "FSM Check: js/agent/shell check types"
priority: "P1"
status: "rejected"
uuid: "fsm-check-js-agent-shell-types"
created_at: "2026-06-17T00:00:00Z"
---

# FSM Check: js/agent/shell check types

Implement the three extensible check runtimes described in the FSM epic.

## Acceptance

- [ ] `:js` — load a CLJS module via shadow-cljs exports and invoke a known function.
- [ ] `:agent` — call out to the configured harness (sol / opencode / etc.).
- [ ] `:shell` — run arbitrary shell command and use exit code as gate result.
- [ ] Schema for each check spec type.
- [ ] Extend `fsm/run-gate` to dispatch on `:type`.
- [ ] Tests for each type; zero clj-kondo warnings.

---
Rescope record 2026-07-29. Successor: [Workflow DSL — Katamorph language, Rheos interpreter, Kanban reference workflow](../epics/workflow-dsl-kanban-reference.md). Preserve extensible execution, but replace host-shaped js, agent, and shell check types with semantic capability, action, guard, and evidence references whose implementations and grants are injected per runtime.

---