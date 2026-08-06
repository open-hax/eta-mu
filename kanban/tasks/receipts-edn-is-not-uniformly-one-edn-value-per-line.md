---
uuid: "receipts-edn-is-not-uniformly-one-edn-value-per-line"
title: "receipts.edn is not uniformly one EDN value per line"
status: "incoming"
type: "task"
priority: "P2"
points: "3"
labels: "ledger, receipts, data-integrity"
category: "tasks"
write-id: "1786043439510-0.o9vmftolnrlznl7mtgp"
created_at: "2026-08-06T19:10:39.510Z"
---

# receipts.edn is not uniformly one EDN value per line

## Outcome

Either every line of `receipts.edn` reads as one EDN value, or the format
states plainly that it does not and every consumer is written to survive the
exception.

## The evidence

Validating the ledger during a merge on 2026-08-06:

```
receipts.edn lines: 155 unparseable: 6
  [102 Invalid number: 2026-07-12T053333Z]
  [103 Invalid token: branch:]
  [104 Invalid token: tag:]
```

Lines 102–107 are a single human-readable fork-tax block, not EDN maps:

```
[2026-07-12T053333Z] :fork-tax
  branch: device/yoga
  tag: Π/2026-07-12T053333Z/device-yoga
  ts-lines: 173622 (down from 174500 baseline)
  files: 33 changed (2324+/374-)
  note: terminal-ui CLJS package, session-mycology spore, kanban updates
```

Confirmed **pre-existing** — the same six lines are unparseable in the merge
base, so no merge introduced them. Every other line in the file is a
`:receipt-river/receipt-recorded` envelope on one line.

## Why it matters

The receipt ledger is described as the source of truth for significant state
transitions. A line-oriented reader — the obvious way to read an append-only
log — throws on line 102 and either dies or, worse, skips. A reader that skips
silently drops a `:fork-tax` record, which is exactly the kind of event most
worth keeping.

This is a sibling of `ledger-event-id-not-unique`: both are cases where the
ledger's real shape is narrower than the shape consumers assume, and both fail
quietly rather than loudly.

## Scope

- Decide: migrate the legacy block into a proper envelope (preserving its
  content and timestamp), or declare the file heterogeneous and specify how a
  reader must skip non-EDN regions.
- Historical entries cannot be rewritten casually — if migrating, keep the
  original text recoverable.
- Audit readers of `receipts.edn`: `receipt tail`, `receipt validate`,
  `receipt audit discover`, and anything in `@eta-mu/receipt-river`. Note that
  `receipt validate` apparently does not currently reject this file.
- Note the timestamp form `2026-07-12T053333Z` is itself non-standard (no
  separators) and overlaps the existing
  `converge-receipt-timestamps-on-one-type` card — check for overlap before
  starting.

## Acceptance criteria

- A test reads the committed `receipts.edn` end to end and asserts the chosen
  rule holds for every line.
- If the file stays heterogeneous, a test asserts a reader encountering the
  legacy block neither throws nor silently drops it.
- `receipt validate` agrees with the stated rule — it currently passes a file
  containing six lines it cannot parse.
- The rule is written where the receipt format is documented, not only here.

## Notes

Found while resolving the `receipts.edn` conflict on PR #170 during the
2026-08-06 second-pass PR sweep. The merge itself was unaffected: both sides
were pure appends and the whole-line union preserved all 155 lines.
