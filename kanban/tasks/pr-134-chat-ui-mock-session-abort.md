---
uuid: "pr-134-chat-ui-mock-session-abort"
title: "PR #134: Fix chat-ui mock session abort and async metadata"
status: "todo"
priority: "P1"
labels: ["tasks", "chat-ui", "cljs", "pr-134", "2sp"]
created_at: "2026-06-16T12:30:00Z"
source: "CodeRabbit review on PR #134"
points: 2
category: "tasks"
---

# PR #134: Fix chat-ui mock session abort and async metadata

CodeRabbit flagged issues in `packages/chat-ui/src/eta_mu/chat_ui/mock_session.cljs`:

1. `send-message` is missing `^:async` metadata per coding guidelines.
2. `abort` does not resolve the Promise created in `send-message`, causing awaiting callers to hang. Store the resolve function in an atom and call it from `abort` with `{:ok false :aborted true}`.

## Acceptance
- `send-message` has `^:async` metadata.
- `abort` resolves the pending promise.
- Mock session test passes and covers abort behavior.
