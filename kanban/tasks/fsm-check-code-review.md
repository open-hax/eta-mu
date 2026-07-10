---
uuid: "fsm-check-code-review"
title: "FSM Check: code-review"
status: "rejected"
priority: "P1"
labels: ["tasks", "cljs", "fsm", "kanban", "pluggable-checks"]
created_at: "2026-06-17T00:00:00Z"
source: "kanban/epics/fsm-engine.md"
points: 5
category: "tasks"
parent: "fsm-engine"
---

# FSM Check: code-review

Implement the `code-review` transition check for `review -> done`.

## Acceptance

- [ ] Define what constitutes a passing code-review gate.
- [ ] Implement as `:agent`-type check that inspects linked branch/PR or task diff.
- [ ] Gate fails with actionable feedback if review criteria not met.
- [ ] Tests for pass/fail cases; zero clj-kondo warnings.
- [ ] Document harness field expectations.
