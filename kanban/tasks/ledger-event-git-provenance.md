---
category: "tasks"
labels: "ledger, git, provenance, branch, projection, cljs"
parent: "agent-operating-standard"
type: "task"
points: "8"
source: "user-request:2026-07-30"
title: "Ledger events record the branch and HEAD they ran under"
priority: "P0"
status: "incoming"
uuid: "ledger-event-git-provenance"
created_at: "2026-07-30T18:05:00Z"
---

# Ledger events record the branch and HEAD they ran under

## Outcome

Every event appended to `kanban/.events/ledger.edn` carries the git ref and HEAD SHA it
was written under. The board becomes a projection *filtered by git context*: checking out
a branch shows the board as that branch's work leaves it, and two branches appending
concurrently produce a log whose complete records can be attributed and reconciled rather
than silently interleaved.

## Why

The ledger is a single append-only log with no git provenance, so switching branches
desynchronises the board from the work actually present in the checkout.

Observed 2026-07-30: a GitKraken auto-stash (`stash@{0}`, taken before a merge of
`feature/rheos-edn-config` into `origin/main`) held a ledger with 2724 events while
`main` held 2552. Recovery was lossless only because `main`'s log turned out to be a
**literal prefix** of the stashed one — 172 pure appends, zero divergence. That was luck.
Nothing in the format asserts prefix-extension, and nothing would have flagged it had two
branches each appended their own 100 events from the same base.

## Current state

- Append path: `packages/protocols/src/open_hax/records/edn/event_admission.cljs:83`
  (`append-to-file!`), entered via `append-event-impl!` (`:108`) and
  `append-events-impl!` (`:118`).
- Emit path: `packages/rheos/src/rheos/backend/domain/events.cljs:65` (`record!`).
- Ledger handle constructed at `packages/rheos/src/rheos/backend/infra/ledger.cljs:16`.
- No emitter reads git state. Correlation is by `write-id` nonce only, per the
  `kanban-event-ledger` epic (done).

## Scope

- [ ] Extend the event envelope with git provenance — at minimum the ref name and HEAD
      SHA at append time. Decide and record whether the worktree path belongs there too.
- [ ] Make the ledger append boundary atomic or serialized for concurrent writers. Each
      append must preserve one complete, individually parseable EDN record; two writers
      must never interleave bytes within a record.
- [ ] Read git state through a new `extern.*` namespace, not inline in `domain.*`;
      the boundary check in `scripts/check-ledger-extern-boundaries.mjs` must stay green.
      Git discovery failure is data, not a failed precondition: non-git directories,
      empty repositories, and detached HEAD append successfully with unknown provenance
      (retaining a HEAD SHA where one exists).
- [ ] Treat provenance as absent-not-invalid for the 2552 pre-existing events. Do **not**
      rewrite history to backfill. The default branch-scoped projection includes these
      legacy events once as a shared baseline; it does not attribute them to any branch.
- [ ] Fold/projection reads a git context and scopes the board to it, with an explicit
      escape hatch for "show me every branch". The escape hatch also includes the shared
      provenance-unknown baseline once.
- [ ] Unit tests for: append under a named branch; append under detached HEAD, an empty
      repository, and a non-git directory; two divergent concurrent writers preserving
      complete parseable records; legacy unknown events included as shared baseline;
      projection filtered by ref; and a divergent two-branch log being detected rather
      than merged.
- [ ] Zero clj-kondo warnings; `pnpm -C packages/rheos test` green.

## Done when

Appending an event on a branch and then checking out `main` no longer shows that event in
the default board projection, concurrent writers cannot corrupt record boundaries, and a
divergent (non-prefix) ledger is reported as divergence instead of being silently unioned.

## Open questions

- Provenance at append time only, or also the merge commit that later carried the event
  into `main`? Append-time is enough for branch-scoped projection; merge-time would let
  the board explain "this event arrived via PR #167".
- When a branch is deleted, are its events archived by the projection or dead weight in
  the log?

## Related

- `ledger-recorded-content-hash-gate-results` (incoming) already assumes gate proofs are
  "git-visible and branch-scoped" — it depends on this card's provenance model.
- `fsm-ledger-fold-accepted-state` and `fsm-event-cascade-derivation` (both rejected)
  covered fold-as-source-of-truth; their invariants moved to
  `workflow-dsl-kanban-reference`.
