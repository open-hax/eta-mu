---
category: "tasks"
labels: ["tasks", "cljs", "fsm", "kanban", "pluggable-checks"]
parent: "fsm-engine"
write-id: "1785355410393-0.busiq0alpnpecyy15ur"
points: "5"
source: "kanban/epics/fsm-engine.md"
title: "FSM Check: code-review"
priority: "P1"
status: "rejected"
uuid: "fsm-check-code-review"
created_at: "2026-06-17T00:00:00Z"
---

# FSM Check: code-review

Implement the `code-review` transition check for `review -> done`.

## Acceptance

- [ ] Define what constitutes a passing code-review gate.
- [ ] Implement as `:agent`-type check that inspects linked branch/PR or task diff.
- [ ] Gate fails with actionable feedback if review criteria not met.
- [ ] Tests for pass/fail cases; zero clj-kondo warnings.
- [ ] Document harness field expectations.

---
Rescope record 2026-07-29. Successor: [Workflow DSL — Katamorph language, Rheos interpreter, Kanban reference workflow](../epics/workflow-dsl-kanban-reference.md). Preserve code review as a reusable action or contract consuming commits, diffs, CI evidence, and reviewer authority. It is not a generic agent boolean embedded in the FSM engine.
---