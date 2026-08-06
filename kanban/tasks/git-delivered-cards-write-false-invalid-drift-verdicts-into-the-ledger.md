---
uuid: "git-delivered-cards-write-false-invalid-drift-verdicts-into-the-ledger"
title: "Git-delivered cards write false invalid drift verdicts into the ledger"
status: "incoming"
type: "task"
priority: "P1"
points: "3"
labels: "rheos, ledger, watcher, drift"
category: "tasks"
write-id: "1786050712783-0.uel1v4qc59nbxz7tf5"
created_at: "2026-08-06T21:11:52.783Z"
---

# Git-delivered cards write false `invalid` drift verdicts into the ledger

## Outcome

A card that arrives on disk through a git operation does not append a
drift verdict asserting it is invalid. The authoritative ledger records drift
that happened, not drift the watcher raced.

## The evidence

In `kanban/.events/ledger.edn`, **10 of 339** `kanban.drift-protocol-rerun`
events carry `:status nil` and `:result "invalid"`. Every other verdict in the
file pairs a real status with `"valid"`:

```text
status,result                 count
"in_progress", valid           58
"done",        valid           57
"ready",       valid           50
"rejected",    valid           45
"incoming",    valid           45
"review",      valid           41
"breakdown",   valid           15
nil,           invalid         10   <-- these
```

## The diagnosis is not "new cards"

Review on #170 read these as freshly created cards racing their own frontmatter
write. That is not what the ledger shows. **None of the ten task-ids has a
`task-created` event at all** — they never went through `rheos create`.

Their timestamps line up with git operations instead:

```text
2026-08-06T20:55:22.467Z  rheos-ledger-authoritative-projections
2026-08-06T20:55:22.477Z  rheos-git-commit-attribution-and-branch-fold
2026-08-06T20:55:22.479Z  rheos-canonical-task-fold-and-snapshots
2026-08-06T20:55:22.479Z  rheos-edn-config-and-card-selection
2026-08-06T20:55:22.479Z  rheos-markdown-projection-push-pull-sync
```

Five cards, same millisecond bracket — that is `git merge` of PR #158 landing
five card files at once, with a watcher running. The 2026-07-30 and earlier
2026-08-06 entries match the same shape.

So the trigger is **cards appearing through git**, not through Rheos: merge,
checkout, rebase, or a branch switch that adds card files. `chokidar` fires
`add`, the drift probe reads the file, gets no status, and records `invalid`.
`awaitWriteFinish` is already enabled, so it is not simply a partial-write race
— worth confirming whether the probe reads before parse or parses a file git
has not finished renaming into place.

## Why it matters

PR #158 makes the ledger the authority that markdown cards project *from*. A
ledger that accumulates false `invalid` verdicts every time a branch merges is
recording noise in the thing that is supposed to be truth — and `rheos drift`
is how an operator decides whether a card was edited behind the tool's back.
Ten false positives is already enough to teach people to ignore the signal.

## Scope

- Reproduce: with a watcher running, `git merge` a branch that adds card files,
  and observe the verdicts.
- Decide the correct behaviour. A card arriving via git is not drift — it is a
  projection catching up. Options: suppress verdicts when no status parses and
  retry until stable; ignore `add` events for files that parse as valid cards;
  or mark git-delivered arrivals as their own event type rather than as drift.
- Whatever is chosen, `:status nil` must never be recorded as `invalid` — an
  unreadable status is an unknown, not a violation.
- Consider whether the watcher should be quiescent during a git operation at
  all (`.git/MERGE_HEAD` and friends are detectable).

## Acceptance criteria

- A test lands card files into a watched task root the way git does and asserts
  no `invalid` drift verdict is appended.
- A test asserts a genuine out-of-band edit still produces a drift verdict —
  the fix must not silence real drift.
- No verdict in the ledger pairs `:status nil` with `:result "invalid"`.
- The ten existing entries are left in place; they are history, and the ledger
  is append-only.

## Notes

Raised by CodeRabbit on PR #170 against `kanban/.events/ledger.edn`. The bot's
observation was right and its causal story was wrong; the correction is
recorded above so the reproduction starts from the real trigger.
