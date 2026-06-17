---
uuid: "pr-134-rheos-agent-tools-delegate"
title: "PR #134: Delegate agent tool comment/subtask to task-edit and watcher"
status: "done"
priority: "P1"
labels: ["tasks", "rheos", "cljs", "pr-134", "3sp"]
created_at: "2026-06-16T12:30:00Z"
source: "CodeRabbit review on PR #134"
points: 3
category: "tasks"
---

# PR #134: Delegate agent tool comment/subtask to task-edit and watcher

CodeRabbit flagged issues in `packages/Rheos/src/rheos/backend/infra/agent_tools.cljs`:

1. `tool-kanban-add-comment` is missing the `text` parameter in its `emit-comment!` call and duplicates logic already in `task-edit/append-comment!`. Refactor it to delegate to `task-edit/append-comment!`.
2. `tool-kanban-create-subtask` does not register a write-id, causing the watcher to emit spurious drift when the new file is created. Add `watcher` to the requires and call `watcher/register-cli-event!` before writing the file.

## Acceptance
- `tool-kanban-add-comment` delegates correctly.
- `tool-kanban-create-subtask` registers a pending write and avoids drift.
- Rheos tests pass.
