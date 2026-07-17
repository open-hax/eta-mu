---
uuid: "pr-134-rheos-store-persistence-race"
title: "PR #134: Fix Rheos store persistence ordering and races"
status: "done"
priority: "P1"
labels: ["tasks", "rheos", "cljs", "pr-134", "5sp"]
created_at: "2026-06-16T12:30:00Z"
source: "CodeRabbit review on PR #134"
points: 5
category: "tasks"
---

# PR #134: Fix Rheos store persistence ordering and races

In `packages/rheos/src/rheos/backend/infra/store.cljs` (lines 27-47), `write-doc!` updates the atom before the async file write completes and returns success even on write failure. This allows in-memory/disk divergence and races between concurrent `-put!` calls.

Fix by:
- Updating the atom only after successful file write.
- Propagating write failures (throw/reject promise).
- Serializing concurrent writes (queue or lock) so overlapping `-put!` calls don't overwrite each other with stale data.

## Acceptance
- Atom is updated only after persistence succeeds.
- Failed writes propagate errors.
- Concurrent writes are serialized.
- Store tests pass and include a reload-from-disk assertion.
