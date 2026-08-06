---
uuid: "rheos-ledger-authoritative-projections"
title: "Rheos ledger-authoritative branch projections"
status: breakdown
type: epic
priority: P0
points: 13
labels: rheos, ledger, projections, git, worldlines
category: epics
---

# Rheos ledger-authoritative branch projections

## Outcome

Rheos board state is reconstructed from accepted EDN events visible on the active
Git branch/worldline. Markdown cards, board snapshots, CLI output, and UI state are
rebuildable projections rather than competing sources of truth.

## Authority

- Git ancestry defines the durable branch timeline.
- Accepted ledger events define board facts within that timeline.
- Pending events are scoped to one worktree/worldline until commit attribution.
- EDN snapshots accelerate replay but remain disposable.
- Markdown cards are discoverable/editable materialized views.

## Delivery passes

1. EDN config and card projection discovery.
2. Canonical task fold, snapshots, and Git/worldline attribution.
3. Markdown projection `pull`, `push`, and `sync` with conflict reporting.

## Constraints

- Preserve JSON and recursive Markdown compatibility during migration.
- Do not keep the canonical mutable event stream in the ordinary checked-out
  branch tree.
- Do not use wall-clock last-write-wins to reconcile divergent branches.
- Pure folds and transforms remain portable across CLJS, nbb, bb, and JVM Clojure.
- Host-specific Git/filesystem behavior remains infra.

## Acceptance criteria

- Deleting all materialized cards and snapshots does not destroy accepted board
  state.
- Checking out another branch produces the board implied by that branch's commit
  ancestry plus its own pending worktree events.
- A new clone can reconstruct a committed board projection from durable Git-backed
  event history.
- Edited card projections can be reconciled into canonical events without silently
  overwriting concurrent branch facts.
- Existing boards have an explicit, tested migration path.

## Design

See `docs/notes/design/rheos-ledger-authority-and-branch-projections.md`.
