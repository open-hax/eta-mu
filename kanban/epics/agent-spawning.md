---
uuid: "agent-spawning"
title: "Agent Spawning from Kanban Tasks"
status: incoming
priority: P1
labels: ["epics", "cljs", "kanban", "sol", "agent-spawning"]
created_at: "2026-06-08T00:00:00Z"
source: "planning-session:2026-06-08"
points: 13
category: epics
---

# Agent Spawning from Kanban Tasks

## Purpose

From a kanban task card, spawn an eta-mu agent in a chat context. Agent receives task content as context.

## Flow

1. User selects task → clicks "Ask Agent"
2. Kanban server calls sol: POST /api/sol/chat with task context
3. Sol creates session, starts turn
4. UI shows agent response in chat panel
5. Agent can update status, add comments, create subtasks

## Agent tools

| Tool | Description |
|---|---|
| kanban-status-update | FSM-checked status transition |
| kanban-add-comment | Append comment to task file |
| kanban-create-subtask | Create linked subtask |
| kanban-read-task | Read current task state |
| kanban-search-tasks | Search related tasks |
| kanban-read-board | Board state + WIP limits |

## Security

- Tools scoped to spawning task UUID
- Actions recorded in event ledger
- Action budget: 50 per session
- No open-editor access (shell injection risk)

## Constraints

- All code in CLJS
- Sessions scoped to (task, agent-identity)
- WebSocket (not SSE) for streaming
- Session persisted in localStorage
