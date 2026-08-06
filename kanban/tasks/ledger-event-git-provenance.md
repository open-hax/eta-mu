---
category: "tasks"
labels: "ledger, git, provenance, branch, projection, cljs"
parent: "agent-operating-standard"
type: "task"
write-id: "1786050655160-0.sg268itfgkildb2q65"
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

---
Two contract gaps raised in review on #170, both worth settling before implementation.

**Atomic append is unspecified.** The outcome promises two branches appending concurrently can be attributed and reconciled, but the current writer is Nodes `fs.appendFile`, which gives no ordering or atomicity guarantee across processes. Two agents in two worktrees appending at once can interleave *within* a line and produce an unparseable record — and this ledger is already read line-by-line. Decide the guarantee (O_APPEND with single-writer-per-line, a lock file, or a serialized writer), write it down, and cover it with a divergent-two-writer test that asserts record integrity rather than just event count.

**Legacy events have no branch policy.** The card treats preexisting events as provenance-unknown but never says what a branch-scoped projection does with them: include, exclude, or mark ambiguous. Every event written before this lands is in that category, so the default decides whether the board looks empty on day one. State the compatibility rule and test it before implementing the default projection.

**Non-Git fallback belongs in the adapter contract.** The card requires appends to succeed outside a repo, in an empty repo, and under detached HEAD. Make the `extern.*` Git adapter return an explicit unknown-provenance value in those cases rather than treating Git discovery failure as a failed precondition — otherwise the ledger stops accepting writes in exactly the environments where it is least recoverable.

Related and already owned here: the `eta-mu-beta version` item on `link-local-eta-mu-cli-for-development` covers the sibling complaint that receipts record `command: "eta-mu receipt append"` and version 1.1.1 regardless of which binary ran. Provenance in the receipt envelope and provenance in the ledger event want the same answer — git SHA plus dirty state — so settle them together.
---