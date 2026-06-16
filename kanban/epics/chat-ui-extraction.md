---
uuid: "chat-ui-extraction"
title: "Extract Chat UI from Knoxx into Reusable Helix Package"
status: "in_progress"
priority: P0
labels: ["epics", "cljs", "helix", "chat", "extraction", "knoxx"]
created_at: "2026-06-09T00:00:00Z"
source: "planning-session:2026-06-09"
points: 13
category: epics
---

# Extract Chat UI from Knoxx into Reusable Helix Package

## Purpose

Extract knoxx's chat UI into a standalone, reusable Helix package at `eta-mu/packages/chat-ui`. The package provides chat components (message list, input, streaming) that any eta-mu surface can consume — kanban, workbench, CLI, etc.

## What gets extracted from knoxx

Knoxx frontend chat components:
- `MessageBubble` — renders user/assistant messages with markdown
- `ChatComposer` — input field with send button, multiline support
- `ChatPanel` — scrollable message list + composer
- `useChat` hook — manages message state, streaming, send/receive
- Message streaming via WebSocket/SSE
- Markdown rendering (react-markdown + remark-gfm)
- Code block syntax highlighting
- Typing indicator
- Error display

## Package shape

```
eta-mu/packages/chat-ui/
├── src/eta_mu/chat_ui/
│   ├── core.cljs           ;; Helix components + hooks
│   ├── message.cljs        ;; MessageBubble component
│   ├── composer.cljs       ;; ChatComposer component
│   ├── panel.cljs          ;; ChatPanel (list + composer)
│   ├── stream.cljs         ;; Streaming connection management
│   ├── protocol.cljs       ;; ChatProtocol (IChatSession)
│   └── tokens.cljs         ;; uxx design tokens
├── shadow-cljs.edn
├── package.json
└── README.md
```

### ChatProtocol

The chat UI talks to a backend through a protocol, not directly to knoxx or sol:

```clojure
(defprotocol IChatSession
  (send-message [session text] "Send a user message")
  (subscribe [session callback] "Subscribe to streaming responses")
  (abort [session] "Abort current generation")
  (history [session] "Get message history")
  (close [session] "Close the session"))
```

Implementations:
- **KnoxxChatSession** — talks to knoxx's `/api/knoxx/chat` endpoint
- **SolChatSession** — talks to sol's `/api/sol/chat` endpoint
- **OpencodeChatSession** — talks to opencode's `/session/:id/prompt` endpoint
- **MockChatSession** — for testing

### Integration with kanban

The kanban imports `@open-hax/chat-ui` and creates a session:

```clojure
(defn create-task-session [task backend]
  (case backend
    :knoxx (knoxx-session task)
    :sol (sol-session task)
    :opencode (opencode-session task)))
```

The session carries the task context as a pinned system prompt (witness thread).

## Constraints

- All code in CLJS (Helix)
- No knoxx-specific imports — only the protocol
- uxx design tokens for theming
- WebSocket for streaming (same as knoxx frontend)
- Must work standalone (for testing) and embedded (in kanban sidebar)

## Dependencies

- uxx helix components (existing)
- Knoxx chat frontend (source to extract from)

## Acceptance criteria

- [ ] `@open-hax/chat-ui` exports ChatPanel, MessageBubble, ChatComposer, useChat
- [ ] IChatSession protocol with knoxx, sol, and mock implementations
- [ ] ChatPanel renders messages with markdown + code highlighting
- [ ] Streaming works via WebSocket
- [ ] Works standalone in a test page
- [ ] Works embedded in kanban sidebar
- [ ] No knoxx-specific imports in the package


---

**Board audit 2026-06-12 — bounced done → review.** PARTIAL. The `@open-hax/chat-ui` package exists and is consumed by the kanban sidebar, so extraction happened. But the only session implementation exercised is the MOCK; KnoxxChatSession / SolChatSession / OpencodeChatSession and WebSocket streaming are unverified, and the standalone test page is unconfirmed. All acceptance criteria in the card are unchecked. Remaining: implement + verify at least one real session and streaming, confirm standalone + embedded use.

---

**Session 2026-06-13.** Package extracted + consumed by the kanban sidebar, but only the MOCK IChatSession is wired. REMAINING: a real backend session (knoxx/sol/opencode), WebSocket streaming, standalone test page. Moved review → todo.

---

**Session 2026-06-16.** Knoxx is the working implementation and should NOT be cut. Sol is a separate runtime that happens to expose a compatible chat API; both coexist. Implementations delivered:
- `KnoxxChatSession` added/updated in `packages/chat-ui/src/eta_mu/chat_ui/knoxx_session.cljs`, implementing `IChatSession` directly against knoxx's `/api/knoxx/chat` + WebSocket stream.
- `SolChatSession` added in `packages/chat-ui/src/eta_mu/chat_ui/sol_session.cljs`, implementing `IChatSession` directly against sol's `/api/agent/chat/start` + WebSocket stream.
- `MockChatSession` extracted to its own namespace for standalone testing.
- Standalone test page wired (`packages/chat-ui/resources/public/index.html` + `:app` build target).
- WebSocket streaming plumbing generalized in `packages/chat-ui/src/eta_mu/chat_ui/stream.cljs`.

Remaining: end-to-end verification of `KnoxxChatSession` against the running knoxx on `:8000`; `SolChatSession` verification once a working model/provider config is available; `OpencodeChatSession` not yet implemented.