---
uuid: "ledger-event-id-not-unique"
title: "Ledger event ids are not unique, so no fold may key on them"
status: "incoming"
type: "task"
priority: "P1"
points: "5"
category: "tasks"
write-id: "1786028060324-0.mf8t3kt3kuiliw1kd"
created_at: "2026-08-06T14:54:20.324Z"
---

# `:event/id` is not unique, so no fold may key on it

## Outcome

Either `:event/id` uniquely identifies an event, or every consumer that treats
it as a key is corrected and the ledger says plainly that it is not a key.

## The evidence

`kanban/.events/ledger.edn` emits drift pairs that share an id **and** a
timestamp, differing only in `:event/type`:

```clojure
{:event/type "kanban.drift-detected",       :event/id "eta-mu-rheos-cli-card-lifecycle-authority-1786025651864", :event/time "2026-08-06T14:14:11.864Z" ...}
{:event/type "kanban.drift-protocol-rerun", :event/id "eta-mu-rheos-cli-card-lifecycle-authority-1786025651864", :event/time "2026-08-06T14:14:11.864Z" ...}
```

The id is built as `<session>-<task>-<millis>`, and both events in a drift pair
are emitted inside the same millisecond, so the id collides by construction
rather than by accident. It is reproducible on any drift scan.

Found while resolving a ledger merge conflict between `main` and
`feat/rheos-card-creation`: a union keyed on `(event-id, event-time)` dropped 12
of 39 events and looked correct doing it. Whole-line dedup kept all 39.

## Why it matters

This is the concrete mechanism behind the "lossless only by luck" ledger merge
described in PR #170. That recovery survived because one log happened to be a
prefix of the other. Any fold, dedup, snapshot, or branch projection that keys
on `:event/id` silently discards one half of every drift pair — and silently is
the problem: the result is a well-formed ledger with events missing.

The `rheos-ledger-authoritative-projections` design (PR #158) makes the ledger
the authority that markdown cards project *from*. A non-unique key is a much
larger hazard under that model than under the current markdown-first read.

## Scope

- Decide: make ids unique (include `:event/type`, or a counter within the
  millisecond), or declare `:event/id` explicitly non-unique.
- If made unique, keep the old form readable — historical events cannot be
  rewritten.
- Audit consumers that key on `:event/id`: dedup paths, fold/snapshot code, the
  branch projection design, and any merge tooling.
- State the identity rule where the ledger format is documented.

## Acceptance criteria

- A test emits a drift pair and asserts the chosen identity rule holds for it.
- A test folds a ledger containing a drift pair and asserts both events survive.
- No consumer keys on `:event/id` unless uniqueness is guaranteed.
- The rule is written down next to the ledger format, not only in this card.

## Notes

Independent of the merge-conflict pain itself: even a single-branch fold over
today's ledger loses events if it dedups on the id.
