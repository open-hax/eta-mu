---
uuid: "kanban-event-ledger"
title: "Kanban Event Ledger + File Watcher + Drift Detection"
status: "todo"
priority: P0
labels: ["epics", "cljs", "kanban", "event-ledger", "file-watcher", "drift-detection"]
created_at: "2026-06-08T00:00:00Z"
source: "planning-session:2026-06-08"
points: 13
category: epics
---

# Kanban Event Ledger + File Watcher + Drift Detection

## Purpose

Every mutation recorded. File watcher detects changes. Drift detection catches manual overrides.

## Event Sources

| Source | Event type | When |
|---|---|---|
| CLI | cli:status-change, cli:frontmatter, cli:comment | User/agent runs eta-mu kanban |
| File watcher | file:changed, file:created, file:deleted | eta-mu kanban serve detects change |
| Drift detector | drift:detected, drift:protocol-rerun | File event without correlated CLI event |

## Correlation

CLI events emit BEFORE file writes (optimistic). Write-id nonce injected into file frontmatter. File watcher extracts write-id and correlates. Unmatched file events trigger protocol rerun.

## Storage

EDN file per board: `<board>/.events/events.jsonl`. Append-only. Async mutex for concurrent writes.

## Relationship to OpenPlanner Event Ledger

File-backed implementation of same concept as `promethean.event-ledger`. Different backing store, simpler schema. Future adapter can bridge to Mongo ledger.

## Constraints

- All code in CLJS
- Chokidar (not fs.watch — known inode bugs)
- Async mutex for concurrent write safety
- Correlation by write-id nonce (not content hash)


---

**Board audit 2026-06-12 — bounced done → review.** NOT done (P0). The DoD is "every mutation recorded," but `events/get-ledger` reached for `globalThis.promethean.records.edn.event_admission` — a namespace nothing ever required — so it threw, `/api/events` returned an error, and no `.events/ledger.edn` was ever created. Zero events were recorded. write-id correlation is generated but never injected into file frontmatter, so the watcher cannot correlate file edits to CLI events and drift detection is non-functional. Storage path in the card (`events.jsonl`) does not match the implementation (`ledger.edn`). Fix for the load bug is staged in the working tree but not yet shipped/verified. Remaining: ship ledger load fix, wire write-id correlation + drift, reconcile storage path, verify events persist.

---

**Session 2026-06-13 progress.** NOW DONE: ledger loads (require fix), the mutex bug is fixed, and every status change is recorded in `.events/ledger.edn` + queryable via /api/events and `kanban events` (source-tagged web/cli). REMAINING for done: file watcher → drift detection (file edit with no correlated CLI event), and write-id injected into frontmatter + watcher correlation. Moved review → todo (core recording done, drift/watcher not).
