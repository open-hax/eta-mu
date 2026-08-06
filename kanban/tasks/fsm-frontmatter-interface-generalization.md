---
category: "tasks"
labels: ["tasks", "cljs", "fsm", "kanban", "reconciliation"]
parent: "fsm-engine"
write-id: "1785355409599-0.h7fu9vnd4qhnswb38pr"
points: "5"
source: "kanban/epics/fsm-engine.md"
title: "FSM: frontmatter-as-interface (per-field ports)"
priority: "P2"
status: "rejected"
uuid: "fsm-frontmatter-interface-generalization"
created_at: "2026-06-17T00:00:00Z"
---

# FSM: frontmatter-as-interface (per-field ports)

Generalize the cascade beyond `:status`. `doc.frontmatter-updated` carries the
full key diff and workflows subscribe to the keys they own — `:status` is just
one port, and the kanban board is the view bound to it. Done last, after the
status path is solid.

## Acceptance

- [ ] `doc.frontmatter-updated` carries the full changed-key diff (not status-only).
- [ ] Workflows declare which frontmatter keys they subscribe to.
- [ ] The kanban FSM is expressed as the `:status` subscriber among many.
- [ ] At least one non-status port demonstrated (e.g. `:harness` or `:assignee`).
- [ ] Unit tests: multi-key diff dispatches to the correct subscribers.
- [ ] Zero clj-kondo warnings; Rheos tests pass.

---
Rescope record 2026-07-29. Successor: [Workflow DSL — Katamorph language, Rheos interpreter, Kanban reference workflow](../epics/workflow-dsl-kanban-reference.md). Preserve the per-field port and subscription insight, including Kanban owning :status, but treat frontmatter as a Markdown command/projection adapter rather than the universal workflow interface or accepted source of truth.

---