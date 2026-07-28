---
uuid: "rheos-event-store-git-worldline-adr"
title: "Rheos event-store and Git-worldline ADR"
status: "incoming"
type: "task"
priority: "P0"
points: 3
labels: "rheos, ledger, git, adr, worldlines"
category: "tasks"
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

---
Candidate review (2026-07-28): the local worktree/branch-switch spike goes to repository-local state under the Git directory plus dedicated refs.

Rationale. The Git directory already gives the two-tier scoping this ADR needs without a synthesized identity scheme: the common dir (git rev-parse --git-common-dir) is shared across worktrees and holds committed event segments; the per-worktree git dir (git rev-parse --git-dir, e.g. .git/worktrees/<name>/ with its own HEAD, index, and logs) holds pending events, so worktree isolation is structural and git worktree remove reclaims pending state. Nothing under the Git directory is rewritten by checkout, so the primary acceptance criterion holds by construction. Durable segments under refs/eta-mu/events/* are real refs, so objects survive gc and a clone reconstructs via an explicit fetch refspec.

Rejected as active store: external state dir keyed by repository identity. Git has no stable repo UUID; identity synthesized from root-commit SHA plus remote URL is ambiguous under fork, remote rename, and two clones on one machine, and a fresh clone gets nothing.

Rejected as active store, retained as an optional attribution index: Git notes. Notes attach to commits, so pending events cannot be represented and a hybrid is forced. refs/notes/* is not fetched or pushed by default and rebase drops notes unless notes.rewriteRef is set.

Spike seam: rheos.backend.infra.ledger/get-ledger is the entire storage seam today (it joins <board-dir>/.events). Redirect that path to a Git-directory-derived location, then exercise branch switch, second worktree, rebase, merge, detached HEAD, and clone.

Full review recorded in docs/notes/design/rheos-ledger-authority-and-branch-projections.md.
---
