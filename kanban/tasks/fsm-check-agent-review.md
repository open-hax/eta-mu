---
category: "tasks"
labels: ["tasks", "cljs", "fsm", "kanban", "pluggable-checks"]
parent: "fsm-engine"
write-id: "1785355409977-0.bj8ky9s8pzccrvjf8sl"
points: "5"
source: "kanban/epics/fsm-engine.md"
title: "FSM Check: agent-review"
priority: "P1"
status: "rejected"
uuid: "fsm-check-agent-review"
created_at: "2026-06-17T00:00:00Z"
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

---
Rescope record 2026-07-29. Successor: [Workflow DSL — Katamorph language, Rheos interpreter, Kanban reference workflow](../epics/workflow-dsl-kanban-reference.md). Preserve agent review as a referenced workflow action that emits typed evidence and verdict events. Do not hardwire generic prose metrics as an authoritative FSM gate.

---