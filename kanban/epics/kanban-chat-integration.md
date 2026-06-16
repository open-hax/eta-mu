---
uuid: "kanban-chat-integration"
title: "Kanban Chat — Side Panel with Witness Thread"
status: "in_progress"
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


---

**Board audit 2026-06-12 — bounced done → review.** NOT done — UI shell only. The sidebar renders a chat panel, but it is backed by a hard-coded MOCK session (`create-mock-session` in `ui/sidebar.cljs`) that replies with a canned "connect a real backend" string. None of the agent tools (status-update, comment, subtask, search, read-board) exist; witness-thread context injection, per-task localStorage persistence, and harness-based backend switching are all absent. Every acceptance criterion in the card is still unchecked. Remaining: real IChatSession backend(s), tool wiring, context injection, persistence.

---

**Session 2026-06-13.** Sidebar chat panel shell exists (mock only). REMAINING: real backend, the 6 agent tools (status-update/comment/subtask/search/read-board), witness-thread context injection, per-task localStorage persistence, harness-based backend switching. Moved review → todo.

---

**Session 2026-06-14 — DESIGN REVISED + Slice 2 done.** The owner reframed this card: chat is NOT a right, task-bound witness-thread panel. It is a **standalone board-scoped "task orchestrator"** mounted on the **LEFT**, decoupled from task selection — "I talk to it and its actions update the UI." The mechanism is the event ledger as the spine (see [[kanban-event-ledger]] Slice 1, done): the agent is just another actor; its mutations hit the ledger and the UI updates via SSE. Delivery is sliced: 0=Rheos layer reorg, 1=ledger→SSE live updates (DONE), 2=decouple chat→left orchestrator (THIS — DONE), 3=board tools for the agent via the `eta-mu kanban` CLI, 4=real `KnoxxChatSession` against the running knoxx (:8000). Slice 2: removed chat from the right sidebar (`rheos.ui.domain.sidebar` is now pure task detail); added `rheos.ui.domain.orchestrator` (collapsible left panel, chat-ui `ChatPanel`, MOCK session for now). NOTE: the per-task witness-thread + localStorage + the 6 tools described above are being reshaped — the orchestrator is board-scoped, and tools come via the CLI in Slice 3.

---

**Session 2026-06-16.** Slices 3 and 4 delivered:
- Board tools exposed via Rheos CLI (`status-update`, `add-comment`, `create-subtask`, `read-task`, `search-tasks`, `read-board`) and MCP endpoint.
- `KnoxxChatSession` wired into the orchestrator as one of multiple possible backends (default remains the safer Rheos proxy; direct browser-to-knoxx is opt-in via board meta).
- Sol backend remains supported as a distinct implementation — sol and knoxx coexist; Knoxx is the working runtime to verify first, but Sol is not sunset or deprecated.

Remaining: verify `KnoxxChatSession` end-to-end against knoxx `:8000`; add `OpencodeChatSession`; decide whether to route new Rheos subcommands through the legacy `eta-mu kanban` dispatcher.