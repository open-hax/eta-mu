---
uuid: "rheos-card-body-lock-after-breakdown"
title: "Lock card bodies on leaving breakdown; route later updates through comments"
status: incoming
type: task
priority: P0
points: 5
labels: rheos, cli, lifecycle, policy, fsm, drift
category: tasks
parent: "rheos-cli-card-lifecycle-authority"
created_at: "2026-07-30T00:00:00Z"
---

# Lock card bodies on leaving breakdown; route later updates through comments

## Outcome

A card body is mutable while it is being scoped and frozen once it is agreed.
After a card leaves `breakdown`, its body is the contract; everything after that
— findings, decisions, progress, scope questions — is appended as a comment.
Bouncing a card back to `breakdown` re-opens the body.

## Rationale

Today nothing distinguishes "this card is being written" from "this card is
being worked". Post-breakdown body edits silently rewrite agreed scope with no
record of what changed or who changed it, while the comment log — which *is*
append-only and ledger-backed — sits unused for exactly the updates it was built
for.

## Model

- **Locked region**: all body sections *except* comment sections. `append-comment`
  in `packages/rheos/src/rheos/backend/shape/content_parser.cljs:107` appends or
  extends a trailing `comment` section, so the lock hash must be computed over
  non-comment sections only or every comment would trip it.
- **Lock lifecycle**: leaving `breakdown` records a body hash on the card;
  entering `breakdown` clears it. Under the `promethean` FSM
  (`packages/rheos/src/rheos/backend/law/fsm.cljs:30`) the re-opening edges are
  `ready → breakdown`, `blocked → breakdown`, `in_progress → breakdown`, and
  `accepted → breakdown`; the locking edges are `breakdown → ready` and
  `breakdown → blocked`. A card that has never reached `breakdown`
  (`icebox` / `incoming` / `accepted`) is unlocked.
- **Frontmatter split**: `status` always stays mutable — the FSM owns it.
  Planning-owned keys (`points`, `title`, `priority`, `labels`, `parent`,
  `dependency`) lock with the body. Operational keys (`write-id`, checkpoints,
  assignment) stay mutable.
- **Scope of enforcement**: Rheos's own write surfaces — CLI `frontmatter`,
  `PATCH /api/task/:uuid/frontmatter`, the UI sidebar, and MCP tools. Direct
  file edits on disk cannot be prevented; they are *reported*.

## Scope

- Add the body-hash field to the card. It must be the **same** checkpoint /
  content-hash mechanism [[rheos-markdown-projection-push-pull-sync]]
  introduces, not a second parallel field. If that card has not landed, define
  the field so it is forward-compatible and say so in the code.
- Compute and store the hash inside `transition/move-task!` on locking edges;
  clear it on re-opening edges. Emit a ledger event for both (`body-locked` /
  `body-unlocked`) so the lock state is reconstructible.
- Enforce in `task-edit/update-frontmatter!` and any body-write path: a locked
  card refuses the write and returns a reason naming `rheos comment <uuid>
  --text …`. Surface as exit code `3` per
  [[rheos-cli-lifecycle-verb-completeness]].
- Teach the watcher to classify an out-of-band body change on a locked card as a
  distinct `body-lock-violation`, not a generic `drift-detected`, preserving both
  the recorded hash and the observed content.
- Add `--force` (plus a reason recorded to the ledger) for the legitimate
  emergency edit, so the policy is enforced but not a trap.
- Make the UI sidebar reflect lock state rather than silently failing writes.
- Document the policy in `PROCESS.md` next to the breakdown gate and in the
  Rheos CLI reference.

## Non-goals

- Locking prose files that are not cards (READMEs, design docs, `AGENTS.md`
  under the board root).
- Preventing filesystem edits.
- Rewriting the comment format — see
  [[kanban-comment-writer-setext-delimiter]] for the delimiter defect.

## Acceptance criteria

- A card in `ready`, `todo`, `in_progress`, `testing`, `review`, or `document`
  refuses a body/planning-key write through every Rheos surface, with a message
  naming the comment verb.
- `rheos comment <uuid> --text …` succeeds on a locked card and does not trip the
  lock hash.
- Moving `ready → breakdown` re-opens the body; moving `breakdown → ready`
  re-locks it against the new content.
- An out-of-band body edit on a locked card produces a `body-lock-violation`
  event carrying both the recorded and observed hashes.
- `--force` writes succeed and leave a ledger event with the supplied reason.
- Lock/unlock state is reconstructible from the ledger alone.
- Existing cards without a hash are treated as unlocked until their next locking
  transition — no retroactive freeze, no migration outage.
- `pnpm -C packages/rheos test` and `lint:kondo` pass with zero warnings.

## Open question for the ready gate

`review → in_progress` and `in_progress → todo` are backward edges that do *not*
pass through `breakdown`. Decision needed before this leaves breakdown: does a
review bounce re-open the body, or must a reviewer's scope change go through
`breakdown` explicitly? Recommendation: keep it locked — a review bounce that
needs new scope should be routed `in_progress → breakdown`, which the FSM already
allows.
