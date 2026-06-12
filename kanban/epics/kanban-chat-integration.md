---
uuid: "kanban-chat-integration"
title: "Kanban Chat — Side Panel with Witness Thread"
status: done
priority: P0
labels: ["epics", "cljs", "helix", "kanban", "chat", "witness"]
created_at: "2026-06-09T00:00:00Z"
source: "planning-session:2026-06-09"
points: 13
category: epics
---

# Kanban Chat — Side Panel with Witness Thread

## Purpose

Left-mounted side panel in the kanban UI that lets the user chat with an agent about the currently selected task. The task is pinned as context (witness thread) — the agent always knows what task the user is looking at.

## Design

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [🔍 search] [domain ▾] [org ▾] [status ▾] [priority ▾] [🏷] │
├────────────────────────────────┬────────────────────────────┤
│  Board columns                 │  Chat Panel                │
│  ─────────────                 │  ──────────                │
│  Icebox │ Incoming │ Ready     │  Agent: How can I help     │
│  ────── │ ──────── │ ─────     │  with this task?           │
│  card   │ card     │ card      │                            │
│  card   │ card     │ card      │  User: What's blocking?    │
│  card   │          │ card      │                            │
│         │          │           │  Agent: Looking at the     │
│         │          │           │  task, the blocker is...   │
│         │          │           │                            │
│         │          │           │  ┌──────────────────────┐ │
│         │          │           │  │ Type a message...  ➤ │ │
│         │          │           │  └──────────────────────┘ │
└────────────────────────────────┴────────────────────────────┘
```

### Witness thread

When a task is selected:
1. Chat panel opens (or updates if already open)
2. System prompt includes the full task context:

```
You are helping with this kanban task:

Title: Fix login redirect bug
Status: in_progress
Priority: P1
Labels: bug, auth, frontend
Source: orgs/open-hax/proxx/kanban/tasks/fix-login-redirect.md

## Task body
The login redirect is broken when...

## Current board context
- 3 tasks in review
- 2 tasks blocked
- WIP limit for in_progress: 10 (currently 7)
```

3. Agent can reference the task, suggest transitions, propose subtasks
4. If user switches tasks, chat context updates (new witness thread)
5. Previous chat history is preserved per-task (session persisted in localStorage keyed by task UUID)

### Agent tools exposed to chat

| Tool | Description |
|---|---|
| kanban-status-update | Propose FSM-checked transition |
| kanban-add-comment | Write comment to task file |
| kanban-create-subtask | Create linked subtask |
| kanban-read-task | Re-read current task state |
| kanban-search-tasks | Search related tasks |
| kanban-read-board | Board state + WIP limits |

### Backend

Chat panel uses `@open-hax/chat-ui` with `IChatSession` protocol. Backend can be:
- knoxx (default, during migration)
- sol (when available)
- opencode (when available)

The `harness` field on the task determines which backend to use.

### Implementation

```clojure
;; In kanban UI
(defnc app []
  (let [[selected set-selected] (helix.hooks/useState nil)
        [chat-open set-chat-open] (helix.hooks/useState false)]
    (d/div {:class "app-layout"}
      (header)
      (board-view {:on-select (fn [task] (set-selected task))})
      (when (and selected chat-open)
        (chat-panel {:task selected
                     :on-close #(set-chat-open false)})))))
```

## Constraints

- All code in CLJS (Helix)
- Uses `@open-hax/chat-ui` for chat components
- Witness thread includes full task context (frontmatter + body + board state)
- Session persisted in localStorage keyed by task UUID
- Chat history survives page reload
- No direct knoxx imports — uses IChatSession protocol

## Dependencies

- `@open-hax/chat-ui` package (chat-ui-extraction epic)
- Global projection frontend (need board view to attach chat to)
- Sol or knoxx backend for agent responses

## Acceptance criteria

- [ ] Chat panel opens when task is selected
- [ ] Task context (frontmatter + body) injected as witness thread
- [ ] Agent can reference the task and suggest actions
- [ ] Agent tools work (status update, comment, subtask, search)
- [ ] Chat history persisted per-task in localStorage
- [ ] Switching tasks shows previous chat for that task
- [ ] Backend switchable via harness field
- [ ] No knoxx-specific imports in the kanban package
