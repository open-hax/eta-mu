---
category: "tasks"
labels: "rheos, ledger, fold, snapshots"
dependency: "rheos-event-store-git-worldline-adr"
parent: "rheos-ledger-authoritative-projections"
type: "task"
write-id: "1786050440954-0.07c7ehdiqhr43ouy5pnn"
points: "5"
title: "Rheos canonical task fold and EDN snapshots"
priority: "P0"
status: "incoming"
uuid: "rheos-canonical-task-fold-and-snapshots"
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

---
Inherits an acceptance criterion from `rheos-cli-create-card` (done, PR #167), raised in review on #177.

That card closed with "folding the ledger from empty reproduces the created cards uuid, type, parent, initial status, and body" unmet — the `task-created` event carries the full payload, but nothing folds it back into a card. This card owns that proof.

Concretely, it should assert: create a card through `rheos create`, discard the markdown, fold the ledger from empty, and get back the same uuid, type, parent, initial status, and body. Until that test exists, ledger-authoritative projection is a design claim rather than a demonstrated property.
---