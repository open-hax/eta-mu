---
uuid: "pr-134-architecture-inventory-heading-style"
title: "PR #134: Convert setext heading to ATX in architecture inventory"
status: "todo"
priority: "P2"
labels: ["tasks", "docs", "lint", "pr-134", "1sp"]
created_at: "2026-06-16T12:30:00Z"
source: "CodeRabbit review on PR #134"
points: 1
category: "tasks"
---

# PR #134: Convert setext heading to ATX in architecture inventory

`kanban/tasks/eta-mu-cljs-rewrite-architecture-inventory.md` line 53 uses a setext-style heading that markdownlint-cli2 flags. Convert it to ATX style (`##`) for consistency.

## Acceptance
- Line 53 uses ATX heading syntax.
- Markdown lint passes on the file.
