---
uuid: "fsm-check-agent-review"
title: "FSM Check: agent-review"
status: "incoming"
priority: "P1"
labels: ["tasks", "cljs", "fsm", "kanban", "pluggable-checks"]
created_at: "2026-06-17T00:00:00Z"
source: "kanban/epics/fsm-engine.md"
points: 5
category: "tasks"
parent: "fsm-engine"
---

# FSM Check: agent-review

Implement the `agent-review` transition check for `breakdown -> ready`.

## Acceptance

- [ ] Design the agent harness interface for FSM gate invocation.
- [ ] Score task on consistency, clarity, completeness, conciseness.
- [ ] Gate passes only when all four metrics meet thresholds.
- [ ] Integrate into `fsm/run-gate` for `:agent`-type checks.
- [ ] Unit + integration tests; zero clj-kondo warnings.
- [ ] Document harness field expectations.
