---
uuid: "pr-134-test-cleanup-reload-mismatch"
title: "PR #134: Improve store/view-store/watcher tests"
status: "done"
priority: "P1"
labels: ["tasks", "rheos", "cljs", "testing", "pr-134", "3sp"]
created_at: "2026-06-16T12:30:00Z"
source: "CodeRabbit review on PR #134"
points: 3
category: "tasks"
---

# PR #134: Improve store/view-store/watcher tests

CodeRabbit requested three test improvements:

1. `packages/Rheos/test/rheos/backend/infra/view_store_test.cljs`: wrap the test body in `try/finally` and move temp-dir cleanup into `finally`.
2. `packages/Rheos/test/rheos/backend/infra/store_test.cljs`: add a reload assertion that creates a new store against the same directory and verifies persistence.
3. `packages/Rheos/test/rheos/backend/infra/watcher_test.cljs`: add a regression test where `expect-write!` is registered for one task-id but the event carries a different write-id, expecting `drift-detected`.

## Acceptance
- All three test files updated.
- Rheos tests pass with new assertions.
