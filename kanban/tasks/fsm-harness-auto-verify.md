---
category: "tasks"
labels: ["tasks", "cljs", "fsm", "kanban", "pluggable-checks"]
parent: "fsm-engine"
write-id: "1785355411516-0.zho6xy62vfiv55z86d3"
points: "3"
source: "kanban/epics/fsm-engine.md"
title: "FSM Harness Auto-Verification"
priority: "P2"
status: "rejected"
uuid: "fsm-harness-auto-verify"
created_at: "2026-06-17T00:00:00Z"
---

# FSM Harness Auto-Verification

Auto-verify known harnesses and warn on unknown ones.

## Acceptance

- [ ] Known harness list: `opencode`, `eta-mu`, `pi`, `claude`, `hermes`, `codex`.
- [ ] Parse `harness` + `session-id` fields from task body or frontmatter.
- [ ] Built-in check warns if harness is `other` or missing `session-id`.
- [ ] Integrate warning into `agent-review` and `code-review` flows.
- [ ] Tests; zero clj-kondo warnings.

---
Rescope record 2026-07-29. Successor: [Workflow DSL — Katamorph language, Rheos interpreter, Kanban reference workflow](../epics/workflow-dsl-kanban-reference.md). Preserve provenance verification through runtime manifests, capabilities, signed or causal receipts, attestations, and evidence contracts. The hardcoded harness-name list remains rejected.
---