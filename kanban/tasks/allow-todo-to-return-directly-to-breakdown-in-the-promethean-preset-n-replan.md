---
uuid: "rheos-todo-breakdown-replan"
title: "Allow Todo to return directly to Breakdown in the promethean preset"
status: "incoming"
type: "task"
priority: "P1"
points: "3"
labels: "rheos, fsm, lifecycle, planning"
parent: "rheos-cli-card-lifecycle-authority"
category: "tasks"
write-id: "1791338430178-0.w6gbcdnxf4mlda3hvye"
created_at: "2026-10-07T02:00:30.178Z"
---

# Allow Todo to return directly to Breakdown in the promethean preset

## Context

This is a proposed three-point upstream lifecycle correction. It is planning
only: this card remains Incoming until the planning process admits it, and its
creation does not activate a new transition in any runtime or consumer board.
The parent is [[rheos-cli-card-lifecycle-authority]]. Implementation belongs to
the extracted [open-hax/rheos](https://github.com/open-hax/rheos) repository,
not eta-mu's retained package copy or a Truth-local workflow.

At Rheos `ab6b227becd8585742b5130df9ae624d8744928e`, the
[promethean preset](https://github.com/open-hax/rheos/blob/ab6b227becd8585742b5130df9ae624d8744928e/src/rheos/backend/law/fsm.cljs#L38)
allows `ready`, `blocked`, and `in_progress` to return to `breakdown`.
Its `todo` row only permits `in_progress`, guarded by `:wip-available`.
Truth and eta-mu process diagrams include `Todo -> Breakdown`, while eta-mu's
[detailed rule and precedence statement](https://github.com/open-hax/eta-mu/blob/09a4454480baa67f6fdc40f6f73f5e48ef0457d1/PROCESS.md#L58)
defer to the runtime law. This is an observed source/document mismatch and a
proposed policy addition, not evidence of a recently regressed transition.

Truth's `star-substep-heating` readiness research exposed the practical need:
a queued card whose implementation recipe requires renewed planning should
return to planning without first claiming an execution slot. The
[recorded canonical refusal](https://github.com/octave-commons/Truth/blob/d0005096f4909df617bcee99e21de6477547e198/.%CE%B7%CE%BC/diagnostics/star-substep-triage/2026-10-07/transition-refusal.json)
preserves exit 3 and `No transition from 'todo' to 'breakdown'` from CLI SHA256
`83c6b397278d418d69ce6509b8c3d9fe87e88cca9141b28143d9efb5d78a75a7`.
That artifact records an earlier command transcript, not a fresh reproduction
or this card's automated RED. Truth's card stayed Todo5; no alternate route or
manual state edit was taken.

## Outcome

After upstream qualification and explicit consumer adoption, a queued Todo card
can return directly to Breakdown through the ordinary canonical move operation.
Execution capacity and review qualification remain governed by their existing
checks. The successful move preserves authored body/comment content and records
one ordinary status-change event.

## Scope

- Add exactly one separate promethean transition:
  `{:from ["todo"] :to ["breakdown"] :check :always-allow}`.
  Do not add `breakdown` to the existing WIP-guarded execution row.
- Preserve the default FSM, all other preset edges, check definitions, limits,
  and `:extends :promethean` build-command overlay behavior.
- Extend the existing pure FSM and real transition tests in standalone Rheos;
  reuse `resolve-fsm`, `evaluate-transition`, `valid-targets`,
  `domain.transition/decide-move`, and `infra.transition/move-task!`.
  No new policy framework, command surface, or write path.
- Update the standalone CLI reference's list of replanning sources when the
  runtime is qualified. Consumer process documentation must distinguish the
  running artifact from proposed or merged source until explicitly adopted.

## Non-goals

- Any other edge, including `review -> breakdown`, or a full process-diagram
  reconciliation.
- Card-body locks, body editing, force flags, WIP-limit changes, gate bypasses,
  consumer configuration overrides, or actual Truth card transitions.
- Event reconstruction/import, Git branch folds, concurrent comment merge,
  Markdown push/pull/sync, or changing ledger/event identity semantics.
- Stellar integration, controller or clock changes, gameplay completion, or
  treating research as an admitted implementation recipe.

## Acceptance criteria

- [ ] The proposed edge is offered by `valid-targets` and admitted by the pure
  verdict for both named promethean forms and the supported EDN `:extends`
  overlay. The returned check is `:always-allow`.
- [ ] Todo-to-Breakdown remains allowed when `in_progress` is at its existing
  WIP cap; Todo-to-In-Progress is still refused at that cap and succeeds below
  it. Other counts and limits retain existing behavior; do not invent a new
  capacity check for replanning.
- [ ] The overlay retains its exact configured build commands and cwd. The
  In-Progress-to-Review path still selects `:build-gate`; an actual failing
  configured gate leaves both card and ledger untouched, while a passing gate
  retains normal behavior. Replanning does not execute that command gate.
- [ ] On a temporary board, the real `move-task!` changes only status and
  engine-owned write metadata for Todo-to-Breakdown, preserving identity,
  descriptive frontmatter, and canonical body/comment section content.
  Existing serializer normalization is allowed; arbitrary byte identity of
  legacy delimiter formatting is not required.
- [ ] That move appends exactly one ordinary status-change event with the
  matching task UUID, `todo`/`breakdown` endpoints, source and new write ID, and
  preserves the complete prior ledger byte prefix. Repeating Breakdown-to-
  Breakdown is the existing no-op and appends nothing.
- [ ] Existing invalid-status and missing-edge refusals still write no card or
  ledger changes. The default FSM's targets and verdicts are unchanged.
- [ ] New behavior tests fail for the missing-edge reason on the pinned old
  source, then pass with the minimal preset addition. Existing tests remain
  passing, with zero lint/compiler warnings and a built-CLI smoke using the
  normal lifecycle to reach Todo on a disposable board.
- [ ] Publication records the qualified source and built artifact separately.
  No downstream policy activation or Truth status change is inferred from this
  planning card or from an upstream merge alone.

## Verification

After planning review and canonical admission, add the meaningful behavior
tests first in `test/rheos/backend/law/fsm_test.cljs` and
`test/rheos/backend/infra/transition_test.cljs`; use the existing domain tests
if required for the count boundary. Run the actual test runner on unchanged
source, preserve its observed RED, and checkpoint it before production edits.
The direct move must be tested, not a route through In Progress or an assertion
on a literal edge table alone.

Then add the separate preset row and qualify from the standalone Rheos root:
`pnpm test`, `pnpm lint:kondo`, and `pnpm build`, recording actual commands,
source hashes, exits and zero warnings. The built CLI smoke creates a scratch
Incoming card, walks Accepted -> Breakdown -> Ready -> Todo, and performs the
new direct Todo -> Breakdown move. Inspect its canonical readback and events;
do not exercise a live consumer card. Any unavailable gate remains an explicit
blocker rather than a pass. These are planned commands; none have run for this
card during planning.

Primary implementation references at the inspected source checkpoint:

- [FSM resolution and verdict](https://github.com/open-hax/rheos/blob/ab6b227becd8585742b5130df9ae624d8744928e/src/rheos/backend/law/fsm.cljs#L68).
- [Single move write path](https://github.com/open-hax/rheos/blob/ab6b227becd8585742b5130df9ae624d8744928e/src/rheos/backend/infra/transition.cljs#L16).
- [Existing pure tests](https://github.com/open-hax/rheos/blob/ab6b227becd8585742b5130df9ae624d8744928e/test/rheos/backend/law/fsm_test.cljs).
- [Existing real-transition refusal and success tests](https://github.com/open-hax/rheos/blob/ab6b227becd8585742b5130df9ae624d8744928e/test/rheos/backend/infra/transition_test.cljs).

## Risks and planning boundary

Three points cover one preset edge, its existing test seams, a narrow reference
update and disposable-CLI proof. This is not approval of the whole historical
process diagram. Review must confirm that queued work may explicitly return to
planning without consuming an execution slot. If reviewers require different
capacity semantics or broader policy changes, return to scoping rather than
quietly enlarging this card. Existing Incoming reconstruction/sync work has no
dependency on this edge and is neither included nor promoted by it.
