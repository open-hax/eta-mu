---
category: "epics"
labels: ["epics", "cljs", "helix", "kanban", "chat", "witness"]
write-id: "1783815454850-0.atkkua1q8ox6ivwp5g"
points: "13"
source: "planning-session:2026-06-09"
title: "Kanban Chat — Side Panel with Witness Thread"
priority: "P0"
status: "done"
uuid: "kanban-chat-integration"
created_at: "2026-06-09T00:00:00Z"
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

Chat panel uses `@open-hax/chat-ui` with `IChatSession` protocol. The default backend is the **Rheos proxy**, which keeps browser credentials and model configuration out of the browser and routes chat traffic through the Rheos server. Direct browser-to-knoxx (or browser-to-sol) is opt-in per board via board meta, e.g. `{:chat-backend :knoxx}` or `{:chat-backend :sol}.

Supported backends:
- **rheos** (default) — Rheos proxy handles authentication and provider routing
- **knoxx** — direct browser-to-knoxx, opt-in via board meta
- **sol** — direct browser-to-sol, opt-in via board meta
- **opencode** — planned; not yet available

The `harness` field on the task can still influence tool execution, but chat backend selection is board-scoped.

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

---
Sol backend end-to-end verified through Rheos orchestrator UI:\n- Browser app builds with process + scheduler polyfills.\n- Static assets served from resources/public/index.html, CSS, and dist/web/js.\n- Board meta propagation fixed: config resolver inherits root meta into default project.\n- UI board meta parsing fixed: layout.cljs reads from projects array.\n- Live test at http://127.0.0.1:8791: sent 'hello', assistant reply rendered in orchestrator panel.\n- Backend: model_id gemma4:31b via /ws/stream; Proxx returned 200 after ~32s.\n- Rheos tests: 58/166 pass; Sol tests: 66/193 pass; chat-ui tests: 2/6 pass; all lint clean.\n- rheos.service running with RHEOS_ORCHESTRATOR_MODEL=gemma4:31b.\n\nRemaining: KnoxxChatSession end-to-end verification and OpencodeChatSession implementation. Card stays in_progress. --tasks-dir kanban

OpencodeChatSession implementation complete:\n- Added packages/chat-ui/src/eta_mu/chat_ui/opencode_session.cljs implementing IChatSession over an OpenAI-compatible /v1/chat/completions endpoint (Sol opencode-compat).\n- Exports createOpencodeSession in chat-ui lib.\n- Wired 'opencode' backend into rheos.ui.domain.orchestrator create-session.\n- Added test: opencode-session-emits-token-and-done.\n- chat-ui: 3 tests, 6 assertions, 0 failures; lint clean.\n- Rheos: 58 tests, 166 assertions, 0 failures; lint clean.\n- Rheos browser app (:app) compiles with 0 warnings.\n- chat-ui lib build compiles with 0 warnings.\n- Remaining: KnoxxChatSession end-to-end verification and live end-to-end test of opencode backend. --tasks-dir kanban

Board audit 2026-07-11 — moved to review. Slices 0-4 verified in card comments. Sol backend E2E verified live at :8791. OpencodeChatSession implemented. chat-ui has all 5 IChatSession implementations (protocol, knoxx, sol, opencode, mock). Remaining: KnoxxChatSession E2E verification against knoxx :8000, live opencode backend test.
---