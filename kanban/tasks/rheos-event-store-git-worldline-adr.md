---
uuid: "rheos-event-store-git-worldline-adr"
title: "Rheos event-store and Git-worldline ADR"
status: incoming
type: task
priority: P0
points: 3
labels: rheos, ledger, git, adr, worldlines
category: tasks
parent: "rheos-ledger-authoritative-projections"
---

# Rheos event-store and Git-worldline ADR

## Outcome

An accepted ADR selects where active board events live and how durable event
segments synchronize through Git without putting one mutable canonical ledger file
in every checked-out branch.

## Scope

- Compare `.git/eta-mu` state plus dedicated refs, external repo-keyed state plus
  dedicated refs, Git notes, and other viable Git-native layouts.
- Define repository identity, worktree identity, worldline identity, clone/bootstrap,
  backup, fetch/push, retention, and garbage-collection behavior.
- Specify security and portability boundaries for local pending events.
- Test branch switch, multiple worktrees, rebase, merge, detached HEAD, and clone.
- Record rejected alternatives and migration from `<tasks-dir>/.events/ledger.edn`.

## Non-goals

- Implementing the full task fold or Markdown projection sync.
- Selecting a remote database adapter for Knoxx.
- Treating branch names as stable identity.

## Acceptance criteria

- The selected active store is not rewritten merely by checking out a branch.
- Committed event history can be reconstructed in a new clone.
- Pending events cannot leak between unrelated worktrees/worldlines.
- Attribution survives branch rename and identifies commits by SHA/ancestry.
- Merge and rebase semantics are explicit and testable.
- The ADR states how current ledgers are imported without losing provenance.
