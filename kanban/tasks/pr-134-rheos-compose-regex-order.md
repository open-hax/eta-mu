---
uuid: "pr-134-rheos-compose-regex-order"
title: "PR #134: Fix regex clause detection order in Rheos compose"
status: "todo"
priority: "P1"
labels: ["tasks", "rheos", "cljs", "pr-134", "2sp"]
created_at: "2026-06-16T12:30:00Z"
source: "CodeRabbit review on PR #134"
points: 2
category: "tasks"
---

# PR #134: Fix regex clause detection order in Rheos compose

In `packages/Rheos/src/rheos/backend/domain/compose.cljs` (lines 47-59), the operator detection order checks `" in "` and `" contains "` before the regex check (`" ~ "`). This misclassifies regex clauses that contain those substrings. Reorder so regex is checked first.

## Acceptance
- Regex clauses are routed to `:regex` before generic operator checks.
- Existing compose tests pass; add a regression test if none exists.
