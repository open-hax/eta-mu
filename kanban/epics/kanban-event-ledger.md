---
uuid: "kanban-event-ledger"
title: "Kanban Event Ledger + File Watcher + Drift Detection"
status: accepted
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
