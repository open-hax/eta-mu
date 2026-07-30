---
category: "tasks"
labels: ["tasks", "cljs", "fsm", "kanban", "pluggable-checks"]
parent: "fsm-engine"
write-id: "1785355410761-0.ej1qw3khv9b4i7sh6ie"
points: "3"
source: "kanban/epics/fsm-engine.md"
title: "FSM Check: markdown-score"
priority: "P1"
status: "rejected"
uuid: "fsm-check-markdown-score"
created_at: "2026-06-17T00:00:00Z"
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

---
Rescope record 2026-07-29. Successor: [Workflow DSL — Katamorph language, Rheos interpreter, Kanban reference workflow](../epics/workflow-dsl-kanban-reference.md). This card is genuinely obsolete as an authoritative transition gate: headers, length, and code-block heuristics do not establish readiness. Any surviving implementation is advisory lint evidence only.
---