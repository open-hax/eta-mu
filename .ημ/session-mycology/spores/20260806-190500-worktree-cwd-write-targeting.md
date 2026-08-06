---
status: incubating
created: 2026-08-06T19:05:00Z
source-session: /home/err/spaces/eta-mu
source-task: Second-pass PR sweep — bind 5 open PRs to cards, resolve conflicts on #158/#169/#170, fix #157's workspace guard, correct the roadmap
p-efficiency: 0.7
p-friction: 0.55
p-skill-candidate: 0.85
promoted-to: ""
rejected-reason: ""
---

## Problem

In a repo with five active worktrees, a **persistent shell cwd** silently
retargeted two side-effecting operations into the wrong tree:

1. `pnpm -C packages/rheos build` — built the `docs/agent-operating-standard`
   worktree instead of the primary tree.
2. `rheos comment <uuid> --text …` — wrote a board comment and a ledger event
   into that same worktree, on a branch already committed and pushed.

Both **reported success**. The comment returned `{"ok": true, …}` with the full
text echoed back. `git status` in the primary tree was clean. The only signal
that anything was wrong was a `grep` for the comment text finding zero hits in
the tree I believed I had just written to.

The misreading then propagated into a user-facing claim: I reported "the primary
tree has no `node_modules` and produces 276 warnings, and that is what the global
`eta-mu-beta` symlink points at." The 276 warnings were real — in the *other*
worktree. The primary tree was installed and clean. A wrong cwd turned a correct
observation into a false claim about a different directory.

Compounding it: `packages/rheos/dist/cli.cjs` differs per worktree *and* per
branch. Invoking it from the primary tree printed the legacy
`OpenHax Kanban (CLJS)` help, which looked like the known stale-binary trap but
was actually correct for that branch — the registry help lives in unmerged #169.
Two different explanations for the same symptom, both plausible.

## Pattern

Any harness where **cwd persists across tool calls** plus **N worktrees of the
same repo** plus **commands that write state** (builds, ledger appends, board
mutations, receipts) equals silent misrouting. The failure is invisible because:

- the command succeeds and prints a success payload;
- the wrong tree is a *valid* checkout, so nothing errors;
- `git status` in the tree you are thinking about stays clean;
- per-branch build artifacts make "wrong output" indistinguishable from
  "correct output for a different branch".

This is the same family as the existing `verify-the-binary-not-the-source`
finding — a program answering *incorrectly but consistently* — with the axis
changed from "which build" to "which tree".

## Candidate skill outline

**Name suggestion**: `worktree-write-targeting`

**Trigger phrases**: multiple worktrees, `git worktree list` non-trivial,
"why didn't my change land", ledger/receipt/board writes, `pnpm -C`, any
build-then-invoke sequence.

**Key rules**:

- Prefix every state-writing command with an explicit absolute `cd`, or pass an
  absolute path. Never rely on inherited cwd for a command that writes.
- After any ledger/board/receipt write, **verify in the intended tree** —
  `git status --short` there must be dirty, and the written text must `grep`.
  A success payload is not evidence of where it landed.
- Before invoking a built artifact, check `ls -la` on it: mtime and size. A
  build you just ran must have a current mtime in the tree you expect.
- When output looks stale, distinguish *stale artifact* from *correct artifact
  for a different branch* before naming a cause. Check what the branch actually
  contains.
- State-writing work belongs in the primary tree; worktrees are for branch
  source edits. Do not append to shared ledgers from a worktree.

**Anti-patterns**:

- Reading a `{"ok": true}` payload as proof of persistence.
- Reporting a `node_modules` / warning-count observation without naming the
  absolute directory it came from.
- Running `cd <worktree> && …` and then issuing follow-up commands that assume
  the primary tree.

## Better path

Open each worktree's work as a self-contained block that begins with an absolute
`cd` and ends by returning to the primary tree, and verify every board or ledger
write with a `grep` in the tree that is supposed to own it — before reporting it
done. Name the absolute directory in any claim about install or build state.

## Receipt refs

- 2026-08-06T19:05:19.774Z — `:decision`, second-pass PR sweep (records the
  self-correction and the reverted stray write)
- 2026-08-06T16:40:21.778Z — `:decision`, #158 revival
