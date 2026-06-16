---
uuid: "pr-134-chat-ui-epic-endpoint-consistency"
title: "PR #134: Reconcile Sol endpoint reference in chat-ui extraction epic"
status: "todo"
priority: "P2"
labels: ["tasks", "docs", "kanban", "pr-134", "1sp"]
created_at: "2026-06-16T12:30:00Z"
source: "CodeRabbit review on PR #134"
points: 1
category: "tasks"
---

# PR #134: Reconcile Sol endpoint reference in chat-ui extraction epic

`kanban/epics/chat-ui-extraction.md` has an inconsistent Sol endpoint: the session note says `/api/agent/chat/start`, but an earlier design section references `/api/sol/chat`. Make the endpoint consistent so the epic has one canonical API.

## Acceptance
- All references to the Sol chat endpoint in the epic use `/api/agent/chat/start`.
