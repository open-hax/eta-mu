---
uuid: "fsm-check-js-agent-shell-types"
title: "FSM Check: js/agent/shell check types"
status: "rejected"
priority: "P1"
labels: ["tasks", "cljs", "fsm", "kanban", "pluggable-checks"]
created_at: "2026-06-17T00:00:00Z"
source: "kanban/epics/fsm-engine.md"
points: 5
category: "tasks"
parent: "fsm-engine"
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
