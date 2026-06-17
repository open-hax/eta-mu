---
uuid: "pr-134-chat-integration-backend-default"
title: "PR #134: Reconcile default backend story in kanban-chat-integration epic"
status: "done"
priority: "P2"
labels: ["tasks", "docs", "kanban", "pr-134", "1sp"]
created_at: "2026-06-16T12:30:00Z"
source: "CodeRabbit review on PR #134"
points: 1
category: "tasks"
---

# PR #134: Reconcile default backend story in kanban-chat-integration epic

`kanban/epics/kanban-chat-integration.md` says the safe default is the Rheos proxy with direct knoxx opt-in, but an earlier backend section still lists knoxx as the default during migration. Update the older section so the document advertises a single default backend strategy.

## Acceptance
- Backend section documents Rheos proxy as default and direct browser-to-knoxx as opt-in via board meta.
