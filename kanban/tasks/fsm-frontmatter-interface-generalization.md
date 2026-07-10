---
uuid: "fsm-frontmatter-interface-generalization"
title: "FSM: frontmatter-as-interface (per-field ports)"
status: "incoming"
priority: "P2"
labels: ["tasks", "cljs", "fsm", "kanban", "reconciliation"]
created_at: "2026-06-17T00:00:00Z"
source: "kanban/epics/fsm-engine.md"
points: 5
category: "tasks"
parent: "fsm-engine"
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
