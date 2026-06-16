---
uuid: "pr-134-rheos-watcher-unlink-correlation"
title: "PR #134: Fix Rheos watcher unlink and task-id correlation"
status: "done"
priority: "P1"
labels: ["tasks", "rheos", "cljs", "pr-134", "5sp"]
created_at: "2026-06-16T12:30:00Z"
source: "CodeRabbit review on PR #134"
points: 5
category: "tasks"
---

# PR #134: Fix Rheos watcher unlink and task-id correlation

CodeRabbit flagged two issues in `packages/Rheos/src/rheos/backend/infra/watcher.cljs`:

1. The "unlink" event handler routes deleted files to `handle-file-event!`, which tries to read them and fails. Either remove the unlink handler or create delete-specific logic that does not read the file.
2. `handle-file-event!` treats any correlated write-id as valid without checking that the write's `task-id` matches the UUID extracted from file content. Add task-id validation and emit drift when they mismatch.

## Acceptance
- Unlink events are handled without read errors.
- Task-id mismatch is detected as drift.
- Watcher tests pass and include a mismatch regression test.
