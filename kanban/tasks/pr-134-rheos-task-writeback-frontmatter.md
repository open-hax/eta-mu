---
uuid: "pr-134-rheos-task-writeback-frontmatter"
title: "PR #134: Use structured frontmatter update in Rheos task writeback"
status: "done"
priority: "P1"
labels: ["tasks", "rheos", "cljs", "pr-134", "3sp"]
created_at: "2026-06-16T12:30:00Z"
source: "CodeRabbit review on PR #134"
points: 3
category: "tasks"
---

# PR #134: Use structured frontmatter update in Rheos task writeback

`packages/Rheos/src/rheos/backend/infra/task_writeback.cljs` (lines 18-20) uses raw line scanning via `update-frontmatter-status`, which can corrupt task body or comment lines containing `status:`. Replace with a structured frontmatter update that only touches the YAML frontmatter block.

## Acceptance
- Only the frontmatter `status` field is modified.
- Body/comment `status:` lines are preserved.
- Existing tests pass; add a regression test.
