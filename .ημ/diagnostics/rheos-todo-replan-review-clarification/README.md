# PR344 provenance clarification

(己, p=1.0) This is an append-only successor to the planning evidence at
`e8060a6b418ff7640a6cdd3b7ee716dd63c036b5`. It addresses the resolvable-reference
concern in [CodeRabbit review 5436829621](https://github.com/open-hax/eta-mu/pull/344#pullrequestreview-5436829621).
The original planning bundle, task card, task-created event, and all prior
receipt/reflection bytes remain unchanged. No board operation was performed.

## Exact receipt reference

(己, p=1.0) [Comment 4202360861](https://github.com/open-hax/eta-mu/pull/344#discussion_r4202360861),
thread `PRRT_kwDORu27H86puseT`, correctly observes that two receipts share the
origin `rheos-todo-breakdown-replan`. The reflection at
`2026-10-07T02:03:17.498016231Z` refers to the **catalog receipt at
`2026-10-07T02:03:17.473976854Z`** in `.ημ/receipts.edn`.
The earlier observation at `2026-10-07T02:00:14.909401034Z` is not the intended
supporting receipt. A new reflection records that exact timestamp and the
original reflection identity; the original entry is not edited.

## Historical source path

(己, p=0.99) The independent local [assessment](source-path-assessment.md)
recommends rejecting the requested rewrite of an already recorded canonical
event, while leaving any future path-format policy open to upstream design.
This is a local assessment, not a native reviewer agreement, settlement,
approval, or completed review round. Both native threads remain externally
unsettled until the coordinator follows the review process.

## Verification and scope

(己, p=1.0) `verification.json` records byte-prefix checks for the two appended
ledgers and exact equality for the task, event ledger, original four-file
diagnostic bundle, and legacy root receipts. It also binds the source/test
citations to immutable Rheos commit
`ab6b227becd8585742b5130df9ae624d8744928e` and verifies the inspected CLI's
SHA256 `83c6b397278d418d69ce6509b8c3d9fe87e88cca9141b28143d9efb5d78a75a7`.

(己, p=1.0) No implementation, proposed FSM edge, tests, build, service, board
transition, GitHub write, commit or push was executed for this clarification.
The prior Incoming/3 card is preserved byte-for-byte; its historical canonical
readback is not presented as a new read or admission. The coordinator owns
publication and fresh review. No new spore was created or promoted.
