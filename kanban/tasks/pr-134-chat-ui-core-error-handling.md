---
uuid: "pr-134-chat-ui-core-error-handling"
title: "PR #134: Add error handling to chat-ui core.cljs"
status: "done"
priority: "P1"
labels: ["tasks", "chat-ui", "cljs", "pr-134", "3sp"]
created_at: "2026-06-16T12:30:00Z"
source: "CodeRabbit review on PR #134"
points: 3
category: "tasks"
---

# PR #134: Add error handling to chat-ui core.cljs

CodeRabbit flagged two issues in `packages/chat-ui/src/eta_mu/chat_ui/core.cljs`:

1. The Connect button's `onClick` creates a session without catching errors from `sol/create-sol-session`, `knoxx/create-knoxx-session`, or `mock/create-mock-session`. Wrap the `case` in error handling and surface user-facing feedback.
2. `init` retrieves `#root` and passes it straight to `createRoot` without a nil check. Add a null check and either throw a helpful error or log and return early.

## Acceptance
- Session creation failures are caught and surfaced in the UI.
- Missing root element is handled gracefully.
- Tests still pass (`pnpm --filter @open-hax/chat-ui test`).
