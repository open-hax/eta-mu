---
uuid: "agent-spawning"
title: "Agent Spawning from Kanban Tasks"
status: icebox
priority: "P1"
labels: ["epics", "cljs", "kanban", "sol", "agent-spawning"]
created_at: "2026-06-08T00:00:00Z"
source: "planning-session:2026-06-08"
points: 13
category: "epics"
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

---
## QA Review (2026-06-12)

### Sub-agent findings
- **Not started.** Status is `incoming`. No implementation code exists.
- Prerequisites substantial: chat-ui-extraction (done), kanban-chat-integration (done)
- Sidebar has working chat panel with mock session
- IChatSession protocol defined in chat-ui/protocol.cljs
- Knoxx has agents.spawn tool (tools.cljs:87-101) and invoke_sub_agent.cljs (390 lines)

### Self-verification
- Confirmed sidebar.cljs:15-34 has `create-mock-session` using `reify chat-protocol/IChatSession`
- Confirmed no real IChatSession implementation exists (KnoxxChatSession, SolChatSession)
- Confirmed sol-extraction (primary dependency) has zero implementation

### Gaps
- **No acceptance criteria.** Epic has zero `[ ]` checkboxes.
- No harness field in sidebar's frontmatter-keys
- No localStorage session persistence
- No agent tool implementations
- No witness thread system prompt injection

### Recommendation
Add AC checkboxes. Decide: wait for sol or build KnoxxChatSession as interim (~50 lines). Knoxx is already running.

Board audit 2026-07-11 — moved to ready. sol-extraction is done; packages/sol/ is running. Prerequisites (chat-ui-extraction, kanban-chat-integration) are done. Card was blocked on sol which now exists. Ready to implement.
---
