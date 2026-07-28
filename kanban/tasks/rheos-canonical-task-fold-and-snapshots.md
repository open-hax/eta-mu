---
uuid: "rheos-canonical-task-fold-and-snapshots"
title: "Rheos canonical task fold and EDN snapshots"
status: incoming
type: task
priority: P0
points: 5
labels: rheos, ledger, fold, snapshots
category: tasks
parent: "rheos-ledger-authoritative-projections"
dependency: "rheos-event-store-git-worldline-adr"
---

# Rheos canonical task fold and EDN snapshots

## Outcome

A pure deterministic fold reconstructs complete accepted task state from canonical
lifecycle events, with disposable EDN checkpoints for faster replay.

## Scope

- Define Malli laws for canonical task events and folded task state.
- Add complete task-created snapshots and accepted update/delete/archive events.
- Preserve actor, causal parents, board identity, and Git/worldline context.
- Implement a pure fold from ordered visible events to `tasks/by-id`.
- Implement versioned EDN snapshots with fold position, Git/worldline coordinates,
  event count, and projection hash.
- Bootstrap/import existing Markdown cards into explicit creation events.

## Non-goals

- Git ancestry filtering or commit attribution.
- Markdown `push`, `pull`, or `sync` commands.
- A remote Mongo projection.

## Acceptance criteria

- Replaying creation and mutation events reconstructs the complete task without
  reading its Markdown file.
- Deleting a snapshot and replaying events yields byte-equivalent normalized state.
- Duplicate event IDs are rejected or idempotently ignored by declared law.
- Delete/archive semantics are distinct and deterministic.
- Existing card imports retain source path/hash and import provenance.
- Tests cover multi-hop status history, comments, body/frontmatter changes, archive,
  deletion, snapshot resume, and invalid event ordering.
