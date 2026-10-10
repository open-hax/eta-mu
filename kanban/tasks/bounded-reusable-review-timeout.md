---
category: tasks
title: Allow a bounded reusable review timeout for complete large diffs
uuid: "213cf28c-f14a-45de-a014-a77558022f8c"
status: incoming
priority: P1
labels: github, review, automation, timeout
source: "OpenHax services deployment operator request, 2026-10-10"
created_at: "2026-10-10T14:17:10Z"
---

# Allow a bounded reusable review timeout for complete large diffs

## Outcome

Reusable callers can select a finite whole-minute review budget from 60 through
180 without changing the free model, review scope, canonical acceptance or
publication guards. Direct pull requests and callers that omit the new input
retain 60 minutes.

## Evidence and scope

Website PR #4 at `c576643230ba124abf10be66f008f767229007d6` used the shared
workflow pinned to Eta-Mu `d98ab446d56ddfd24542df49b102b851f2a767fa`.
Native run `38024652523`, review job `114133059839`, was cancelled at the
one-hour limit. Its retained trace contains successful reads and assessments
for pages 1 through 161 of 232 across the complete 494-file input. It contains
no completed submission, and final verification and publication were skipped.
The timeout is not review acceptance or a reason to exclude unfinished scope.

Add the numeric `workflow_call` input `review_timeout_minutes`, default 60,
clamp the review job timeout to 60 through 180 and reject invalid raw requests
in the first review step. Verify the authored timeout selection and validation,
including zero, fractional, out-of-range, malformed and opaque input controls.
Document that the budget includes setup and both possible model invocations.

Native PR #349 head `397357dc36474d6d8c7f39d5145d40f34e510bea`, run
`38059635545`, review job `114237079301`, exposed a direct-route validation
defect: the absent timeout property serialized as JSON `null`, while the
validator assumed an empty string. Repair only that boundary by reading the
complete inputs context, defaulting when the timeout property is absent and
rejecting an explicitly present invalid value. Preserve caller input when the
caller event is also `pull_request`, and falsify the native serialization
regression against the published failing validator before the repair.

## Non-goals

Changing models or provider payment routes, shrinking diff scope, altering
canonical Muse review law, changing recovery attempts or relaxing exact-head,
input, submission, publisher custody or terminal gates is outside this card.
Website adoption of a reviewed upstream SHA and a 120-minute request is a
separate caller change. Board transitions and native review admission remain
owning operational work.

## Acceptance criteria

- The optional reusable input is numeric and defaults to 60.
- Direct pull requests still select 60; valid whole-minute requests in the
  closed range 60 through 180 select their requested finite budget.
- Zero, fractions, values outside that range and invalid input fail before
  checkout or reviewer setup. Errors do not execute or echo opaque input.
- All original deterministic, context and terminal budgets remain unchanged.
- Every original workflow field and step remains identical after removing
  only the new input, timeout selection and first validation step.
- The configured review-workflow selector and actionlint pass locally.
- New source still requires full native review and normal owning publication.

## Verification

The focused tests execute the actual authored validator and timeout expression.
They fail against the original workflow: three failures and one existing
publication-guard pass. The candidate passes all four focused tests, then all
285 tests in `bb scripts/test.bb --only review-workflow` with zero failures,
skips or cancellations. Actionlint and diff hygiene pass. A structural check
confirms every other authored workflow value is identical to the original.
These are local checks; this card claims no hosted completion or approval.

Receipt River and the session reflection retain the exact source base, native
run identifiers, preserved review artifact and local verification provenance.
The manually authored initial card is not a board transition or board
validation claim.

The native direct-route correction first reproduces the published validator's
failure on the observed JSON `null`. The repaired validator passes all five
focused controls and all 286 configured review-workflow tests with zero failures,
skips or cancellations. Actionlint, Node syntax and diff hygiene pass; parsed
workflow equality against the failed `397357` revision confirms that every
field outside the first timeout validation step is unchanged. These local
checks preserve the failed native review and terminal-gate outcomes; hosted
qualification remains pending for the successor.
