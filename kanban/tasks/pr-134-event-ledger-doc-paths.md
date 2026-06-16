---
uuid: "pr-134-event-ledger-doc-paths"
title: "PR #134: Fix event ledger epic storage path and unlink handling"
status: "todo"
priority: "P1"
labels: ["tasks", "docs", "kanban", "pr-134", "2sp"]
created_at: "2026-06-16T12:30:00Z"
source: "CodeRabbit review on PR #134"
points: 2
category: "tasks"
---

# PR #134: Fix event ledger epic storage path and unlink handling

CodeRabbit flagged two inconsistencies in `kanban/epics/kanban-event-ledger.md`:

1. The Storage table references `<board>/.events/events.jsonl` but the implementation/session note uses `<board>/.events/ledger.edn`. Update the table to the correct path.
2. The description claims the file watcher correlates unlink events, but the watcher reads file contents before emitting events, which fails for deleted files. Either remove unlink from the listed operations or add a note that deletion handling needs a separate path.

## Acceptance
- Storage table path matches the actual implementation (`ledger.edn`).
- Unlink behavior is documented accurately (removed or annotated as future work).
- No markdown lint errors.
