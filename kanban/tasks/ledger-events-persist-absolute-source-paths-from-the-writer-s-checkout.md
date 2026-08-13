---
category: "tasks"
labels: "rheos, ledger, portability"
type: "task"
write-id: "1786059223060-0.q48zygzmpik2ef1c73s"
points: "3"
title: "Ledger events persist absolute source paths from the writer's checkout"
priority: "P2"
status: "incoming"
uuid: "ledger-events-persist-absolute-source-paths-from-the-writer-s-checkout"
created_at: "2026-08-06T23:19:42.580Z"
---

# Ledger events persist absolute source paths

## Outcome

A `kanban.task-created` event records where a card lives in the repository, not
where it lived on one machine.

## The evidence

Every `task-created` event carries an absolute `:source-path`:

```text
:source-path "/home/err/spaces/eta-mu/kanban/epics/github-actions-as-a-muse-projection-target-from-katamorph-workflow-contracts.md"
```

That path is valid only in the writer's checkout. It is wrong in a worktree, in
a fresh clone, in CI, and on anyone else's machine — and it embeds a home
directory into a file that is committed and shared.

## Why it matters

`rheos-ledger-authoritative-projections` makes the ledger the authority that
cards project *from*. A fold that trusts `:source-path` to locate a card will
find nothing outside the machine that wrote the event, which is every machine
except one.

It is also an unnecessary disclosure: the committed ledger publishes the
directory layout and username of whoever created each card.

## Scope

- Persist a repository-relative path (`kanban/epics/<uuid>.md`), or omit the
  path from the event and derive it from the uuid and card type at fold time.
- Decide which: a stored relative path survives a card being moved; a derived
  one cannot go stale. They are different trade-offs, not the same fix.
- Existing events keep their absolute paths — the ledger is append-only. A
  reader must therefore tolerate both forms, which is itself worth a test.
- Check the other writers for the same habit: `task-edit`, `transition`, and
  the drift events all carry paths.

## Acceptance criteria

- A newly created card's event contains no absolute path and no home directory.
- A fold locates a card written on another machine.
- A reader handles a historical absolute path without failing.
- A test asserts no event written after this change matches `^/`.

## Notes

Raised by CodeRabbit on PR #181 against `kanban/.events/ledger.edn`. Unrelated
to that PR's changes — it is how the writer has always behaved.

---
Acceptance criteria widened, raised in review on #181.

The scope named `task-edit`, `transition`, and the drift events as writers to audit, but the criteria only required a `task-created` test — so the card could pass while every other event still carried an absolute path. That is the failure mode the card exists to prevent, reproduced in its own definition.

Each path-carrying writer needs its own assertion:

- `kanban.task-created` — `:source-path`
- `kanban.task-edit` / frontmatter and comment writes
- `kanban.status-change` via `transition`
- `kanban.drift-detected` and `kanban.drift-protocol-rerun`

And one criterion that covers the class rather than the instances: **no event appended after this change has a value matching `^/`**, asserted over a freshly written ledger. Enumerating writers catches the four that exist; the regex catches the fifth someone adds later.

Historical events keep their absolute paths — the ledger is append-only — so the assertion is scoped to events written after the change, and a reader must still tolerate both forms.
---