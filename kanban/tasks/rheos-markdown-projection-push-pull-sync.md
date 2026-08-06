---
uuid: "rheos-markdown-projection-push-pull-sync"
title: "Rheos Markdown projection pull, push, and sync"
status: incoming
type: task
priority: P0
points: 5
labels: rheos, projection, markdown, sync
category: tasks
parent: "rheos-ledger-authoritative-projections"
dependency: "rheos-canonical-task-fold-and-snapshots, rheos-git-commit-attribution-and-branch-fold"
---

# Rheos Markdown projection pull, push, and sync

## Outcome

Markdown cards are deterministic discoverability/editing projections that can be
materialized from the active branch fold and reconciled back into canonical events
without becoming a second source of truth.

## Scope

- Add projection checkpoint metadata: last event, worldline, Git head, and content
  hash.
- Implement `pull`: active ledger/worldline fold to configured Markdown paths.
- Implement `push`: edited card plus checkpoint to validated canonical events, then
  re-materialize accepted state.
- Implement `sync`: three-way reconciliation of checkpoint, edited projection, and
  current branch fold.
- Preserve unrelated prose below the board root.
- Convert watcher events into projection-input proposals rather than generic drift.
- Provide a dry-run/conflict report and explicit adjudication path.

## Non-goals

- Last-write-wins conflict resolution.
- Treating generated `board.json` as authority.
- Replacing all Markdown editors or the Rheos UI.

## Acceptance criteria

- `pull` can recreate all cards after deleting only materialized card paths.
- `push` emits events and never directly blesses edited frontmatter as accepted
  state.
- `sync` automatically accepts non-overlapping edits and reports overlapping facts
  with both claims preserved.
- Re-running `pull` without new events is idempotent.
- README/AGENTS/design documents beneath the board root remain untouched.
- Existing boards can bootstrap checkpoints and events before strict reconciliation
  is enabled.
