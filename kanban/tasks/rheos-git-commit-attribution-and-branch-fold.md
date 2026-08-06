---
uuid: "rheos-git-commit-attribution-and-branch-fold"
title: "Rheos Git commit attribution and branch-worldline fold"
status: incoming
type: task
priority: P0
points: 5
labels: rheos, git, ledger, worldlines, projection
category: tasks
parent: "rheos-ledger-authoritative-projections"
dependency: "rheos-event-store-git-worldline-adr, rheos-canonical-task-fold-and-snapshots"
---

# Rheos Git commit attribution and branch-worldline fold

## Outcome

The board projected for a checked-out branch reflects events attributable to commits
reachable from that branch's `HEAD`, plus pending events owned by the active
worktree/worldline.

## Scope

- Capture base commit, symbolic ref, worktree ID, worldline ID, actor, and causal
  parents when events are authored.
- Represent pre-commit events as append-only `:attribution :pending` facts.
- Append commit-attribution events mapping canonical event IDs to resulting Git
  commits; never rewrite original events.
- Resolve committed visibility through Git ancestry, not branch-name equality.
- Scope pending visibility to the active worktree/worldline.
- Produce explicit conflicts for unordered incompatible accepted facts after merge.

## Non-goals

- Markdown projection rendering/reconciliation.
- Automatically resolving semantic conflicts.
- Treating wall-clock order as causal order.

## Acceptance criteria

- Switching branches changes the board fold without editing the canonical active
  event store.
- A committed event appears on descendant branches and not on branches whose HEAD
  cannot reach its commit.
- Pending events do not appear in another worktree or unrelated branch worldline.
- Branch rename does not change committed visibility.
- Rebase attribution behavior is specified and tested.
- Merge tests cover compatible histories and explicit incompatible-fact conflicts.
