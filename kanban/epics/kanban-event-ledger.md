---
uuid: "kanban-event-ledger"
title: "Kanban Event Ledger + File Watcher + Drift Detection"
status: "in_progress"
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

---

**Session 2026-06-14 (chat-integration Slice 1 — ledger→SSE).** Two things landed here:
- **File watcher fixed.** Root cause found: chokidar v4 (the pinned `^4.0.3`) DROPPED glob support, so `chokidar.watch("<dir>/**/*.md")` was treated as a literal path and matched nothing — the watcher had been firing ZERO file events. Now watches the tasks-dir directly and filters `.md` in the handlers. Verified: an external file create produces a `file-changed` (and, with no correlated write-id, a `drift-detected`) event in the ledger within ~2s. So file-watcher → drift detection now actually works end-to-end. (write-id injection into frontmatter for correlation is still NOT wired, so every external edit reads as drift — that piece remains.)
- **Live event stream added.** A new in-process pub/sub bus routes every emission through one `record!` chokepoint (append-to-ledger + publish), exposed as SSE at `GET /api/events/stream`. This is the spine for live UI updates: any actor's mutation (HTTP, drag-drop, or external/CLI edit caught by the watcher) pushes to subscribed browsers, which refetch the board. Verified via a live SSE `data:` event on a frontmatter PATCH. The future Mongo `EventAdmission` will feed the same bus.

---

**Session 2026-06-16.** write-id correlation fully wired:
- Every mutation (status, frontmatter, comment) generates a `write-id` nonce, registers it with the watcher, injects it into the task file frontmatter, writes the file, and emits the source event.
- The file watcher extracts the `write-id` on `change`/`add`/`unlink`, matches it against pending writes, and emits `kanban.file-changed` with `correlation/status: correlated` or `kanban.drift-detected` with `correlation/status: drift` for unmatched edits.
- Storage path is confirmed as `<board>/.events/ledger.edn`; the original `events.jsonl` mention was a spec drift and is now corrected.

Remaining: define and implement `drift:protocol-rerun` behavior (currently only `drift-detected` is emitted).