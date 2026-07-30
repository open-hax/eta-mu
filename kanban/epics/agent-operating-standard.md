---
uuid: "agent-operating-standard"
title: "Agent Operating Standard — branch-aware ledgers, turn discipline, and an installable skill surface"
status: "incoming"
priority: "P0"
labels: ["epics", "ledger", "git", "provenance", "skills", "cli", "process", "21sp"]
created_at: "2026-07-30T18:00:00Z"
source: "user-request:2026-07-30"
points: "21"
category: "epics"
---

# Agent Operating Standard — branch-aware ledgers, turn discipline, and an installable skill surface

> Source: user request, 2026-07-30
> Process: one PR per child task, worktree per task branched from current `origin/main`

## Outcome

An agent working in this repo cannot silently lose work or silently corrupt the board.
The ledgers know which branch they were written on, the turn loop is written down and
enforced, the ledger protocol packages are actually reachable from the CLI, and the
skills that describe all of this can be installed at global or project scope with one
command.

## Why

On 2026-07-30 a prior session ended with five worktrees registered under a dead
session's scratchpad and two GitKraken auto-stashes holding board history that existed
on **no branch at all** — the 2026-07-29 FSM rescope decisions, the capability-schema
decision record, and the whole `workflow-dsl-kanban-reference` epic. Recovery was only
lossless by luck: `stash@{0}`'s ledger happened to be a literal prefix-extension of
`main`'s (2552 events + 172 appended), so the two logs could be unioned by taking the
longer one. Nothing in the ledger format guaranteed that, and nothing would have
detected it if it were false.

Three separate gaps produced that outcome:

1. **The ledger has no git provenance.** `kanban/.events/ledger.edn` is one append-only
   log with no branch or HEAD on its events, so the board cannot be projected per
   branch, and concurrent appends on two branches are indistinguishable from a clean
   append.
2. **The turn loop was convention, not contract.** Nothing required a commit or a
   mycology run at each turn boundary, so work accumulated in the working tree until a
   merge tool swept it into a stash.
3. **The ledger packages are unreachable.** `packages/receipt-river`,
   `packages/session-mycology`, and `packages/fork-tax` shipped
   (`ledger-protocol-packages-first-vertical-slice`, done) but the global skills still
   describe hand-editing files, the CLI help does not mention the ledgers, `eta-mu git`
   is documented only as a "temporary compatibility path", and there is no way to
   install any of the skills.

## Thesis

> A ledger without git provenance is not a record of the work — it is a record of
> whichever checkout happened to be mounted. The board is a projection, and a projection
> needs to know what it is projecting from.

## Children

| Card | Slice |
|---|---|
| `ledger-event-git-provenance` | branch + HEAD on every ledger event; board reads as a branch-scoped projection |
| `agent-turn-loop-standard-and-skills` | write the turn loop down; update the global `receipt-river` and `session-mycology` skills to it and route them through the packages |
| `eta-mu-install-skills-command` | `eta-mu install skills` with a global / project scope picker |
| `ledger-cli-surface-documentation` | CLI help explains the three ledgers; `eta-mu git` gets real docs and a skill |

Static-analysis parity with `../Truth` and `../epiphany` is tracked separately under
the `eta-mu-quality-ratchet` epic as `clojure-static-analysis-parity` — it shares the
"enforce mechanically instead of by convention" motive but none of the ledger surface.

## Field evidence — `create-subtask`, 2026-07-30

The four child cards below were first created with
`eta-mu kanban create-subtask agent-operating-standard --title ... --status incoming`.
All four were then deleted and hand-written, because the CLI output is not usable on this
board. Observed, on top of what `rheos-cli-create-card` (review) already records:

- **Random UUID identity.** Cards were stamped `uuid: "bc474e41-e5dc-44f4-a169-48a10854ca64"`.
  Every other card on this board uses a semantic kebab-case uuid, and cards reference each
  other by it.
- **Wrong directory.** Task-shaped children of an epic landed in `kanban/epics/`, because
  the path is `dirname(parent-source-path)`. The filename was the full title slugified —
  `document-the-ledger-cli-surface-help-text-eta-mu-git-docs-and-a-git-skill.md`.
- **`labels: [""]`** — an empty-string label, not an empty list.
- **No `category`, `type`, or `points` keys** were written at all.
- **Zero ledger events.** The ledger sat at 2724 events before and after four card
  creations, confirming the `rheos-cli-create-card` finding that `create-subtask` emits no
  `task-created` event and only registers a watcher CLI event.

This belongs on `rheos-cli-create-card`, which is at status `review` on the
`feat/rheos-card-creation` branch. It is recorded here instead of commented onto that card
precisely to avoid a cross-branch board edit — which is the failure mode this epic exists
to fix.

## Constraints

- ClojureScript is canonical; no new TypeScript.
- The ledger is append-only. Provenance is added as new keys on new events; existing
  events stay readable and are treated as provenance-unknown rather than rewritten.
- One PR per child task, path-scoped staging, zero clj-kondo warnings.

## Open questions

- Does a ledger event record the branch at append time only, or also the merge commit
  that later carried it into `main`? The first is cheap and enough for branch-scoped
  projection; the second would let the board explain "this event arrived via PR #167".
- When a branch is deleted, do its events become dead weight in the log, or does the
  projection treat unknown refs as archived?
