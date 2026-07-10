---
uuid: "fsm-check-markdown-score"
title: "FSM Check: markdown-score"
status: "incoming"
priority: "P1"
labels: ["tasks", "cljs", "fsm", "kanban", "pluggable-checks"]
created_at: "2026-06-17T00:00:00Z"
source: "kanban/epics/fsm-engine.md"
points: 3
category: "tasks"
parent: "fsm-engine"
---

# FSM Check: markdown-score

Implement the `markdown-score` transition check for `incoming -> breakdown`.

## Acceptance

- [ ] Define `law.fsm-check` schema for check specs.
- [ ] Implement `markdown-score` as a pure domain function in `rheos.backend.domain.fsm-checks`.
- [ ] Heuristic scores headers, objectives, acceptance criteria, and code blocks.
- [ ] Wire `markdown-score` into `fsm.cljs` so `evaluate-transition` resolves it instead of `:always-allow`.
- [ ] Unit tests in `rheos.backend.domain.fsm-checks-test`.
- [ ] Zero clj-kondo warnings; Rheos tests pass.
