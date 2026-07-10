---
uuid: "fsm-harness-auto-verify"
title: "FSM Harness Auto-Verification"
status: "incoming"
priority: "P2"
labels: ["tasks", "cljs", "fsm", "kanban", "pluggable-checks"]
created_at: "2026-06-17T00:00:00Z"
source: "kanban/epics/fsm-engine.md"
points: 3
category: "tasks"
parent: "fsm-engine"
---

# FSM Harness Auto-Verification

Auto-verify known harnesses and warn on unknown ones.

## Acceptance

- [ ] Known harness list: `opencode`, `eta-mu`, `pi`, `claude`, `hermes`, `codex`.
- [ ] Parse `harness` + `session-id` fields from task body or frontmatter.
- [ ] Built-in check warns if harness is `other` or missing `session-id`.
- [ ] Integrate warning into `agent-review` and `code-review` flows.
- [ ] Tests; zero clj-kondo warnings.
