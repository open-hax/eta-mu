---
category: "tasks"
labels: "rheos, ledger, agent-operations"
type: "task"
write-id: "1786043453824-0.5jb9puaqlgxgsyp0o24"
points: "5"
title: "A board write from a worktree should say which tree it wrote"
priority: "P1"
status: "incoming"
uuid: "a-board-write-from-a-worktree-should-say-which-tree-it-wrote"
created_at: "2026-08-06T19:10:39.791Z"
---

# A board write from a worktree should say which tree it wrote

## Outcome

A state-writing Rheos command run from a git worktree either refuses, or
reports the absolute path it wrote to. Silent misrouting into a sibling
checkout stops being possible.

## The evidence

On 2026-08-06, with five worktrees registered, a persistent shell cwd sent two
side-effecting operations into the wrong tree:

- `pnpm -C packages/rheos build` built the `docs/agent-operating-standard`
  worktree instead of the primary tree.
- `rheos comment rheos-cli-card-lifecycle-authority --text …` wrote the card
  comment **and a ledger event** into that same worktree — on a branch that had
  already been committed and pushed.

The comment returned:

```json
{ "ok": true, "uuid": "rheos-cli-card-lifecycle-authority", "comment": "…" }
```

Nothing in that payload names a path. `git status` in the primary tree stayed
clean, so the natural check said "nothing happened". The write was only found
by grepping for the comment text and getting zero hits in the tree that was
supposed to own it, then one hit in a tree nobody was looking at.

## Why it matters

The ledger under `kanban/.events/` is the authority the board projects from,
and PR #158 deepens that. An event appended to the wrong worktree lands on the
wrong branch, and from there either merges into an unrelated PR or is discarded
with the worktree — a lost event that no fold can recover, because nothing
records that it should exist.

The command was not wrong; it did exactly what it was told. The problem is that
its success payload is indistinguishable between the intended tree and any
other, so an agent cannot tell correct from misrouted without a separate check.

## Scope

- `rheos` state-writing verbs (`create`, `create-subtask`, `move`,
  `status-update`, `comment`, `add-comment`, `frontmatter`) report the absolute
  path of the card file and the ledger they wrote.
- Detect a linked worktree (`.git` is a *file*, not a directory; or
  `git rev-parse --git-common-dir` differs from `--git-dir`).
- Decide the policy: warn on stderr and proceed, or refuse without an explicit
  opt-in flag. Refusing is safer for ledger appends; warning may be enough for
  card edits. This is the open question on this card.
- Consider whether the same reporting belongs on `eta-mu receipt append`, which
  has the identical hazard against the root `receipts.edn`.

## Acceptance criteria

- A test runs a write verb from a linked worktree and asserts the chosen
  behaviour (refusal, or a path in the output naming the worktree).
- The success payload of every mutating verb names the file it wrote.
- The behaviour is documented wherever the verbs are documented, so it is
  discoverable before it is needed rather than after.

## Non-goals

- Preventing legitimate work in worktrees. Worktrees are the house pattern for
  branch source edits; this card only makes the write target visible.

## Notes

Incubated as spore
`.ημ/session-mycology/spores/20260806-190500-worktree-cwd-write-targeting.md`,
which carries the fuller pattern including the interaction with per-branch
`dist/cli.cjs` artifacts. Related to the existing stale-binary finding
("verify the binary, not the source") — same failure family, different axis:
that one is *which build answered*, this one is *which tree it wrote to*.

---
Scope refinement, observed while creating this card: `rheos create` **already** reports the absolute path it wrote —

```text
created task <uuid> [incoming] <title>
  /home/err/spaces/eta-mu/kanban/tasks/<uuid>.md
```

so the pattern this card wants already exists and does not need designing. The gap is that `comment` does not; its payload is `{"ok": true, "uuid": …, "comment": …}` with no path, which is the exact call that misrouted. Treat this as "bring the other mutating verbs up to what `create` already does", which makes it smaller than the 5 points suggest — re-size at breakdown.

Worktree detection is still open and is the real design question, since `create` reports its path but would happily report a worktree path just as confidently.

---
