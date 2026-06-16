---
uuid: "pr-134-chat-ui-session-stream-restoration"
title: "PR #134: Restore chat-ui streams after abort/close/reconnect"
status: "todo"
priority: "P1"
labels: ["tasks", "chat-ui", "cljs", "pr-134", "5sp"]
created_at: "2026-06-16T12:30:00Z"
source: "CodeRabbit review on PR #134"
points: 5
category: "tasks"
---

# PR #134: Restore chat-ui streams after abort/close/reconnect

CodeRabbit flagged stream connectivity issues in `knoxx_session.cljs` and `sol_session.cljs`:

- `knoxx_session.cljs` (lines 84-100): `send-message` should reopen the stream if absent; `subscribe` should lazily initialize streams for existing session/conversation IDs; `abort` and `close` should clear the stale `:stream`.
- `sol_session.cljs` (lines 79-95): existing-conversation `send` path should reopen the WebSocket if `:ws` is missing.
- Both `post-json` functions should reject on non-2xx responses.

## Acceptance
- Streams are lazily re-initialized after abort/close.
- Non-2xx HTTP responses are rejected in both sessions.
- Tests pass; no regressions in mock session test.
