---
status: incubating
created: 2026-07-30T22:32:34.346861065Z
source-session: /home/err/spaces/eta-mu/.claude/worktrees/agent-operating-standard
source-task: Recover stashed board history, prune dead worktrees, record the agent operating standard
p-efficiency: 0.5
p-friction: 0.5
p-skill-candidate: 0.85
promoted-to: ""
rejected-reason: ""
---

## Problem
The user described the repo as dirty; git status showed a clean tree on main. The dirt had been swallowed by two GitKraken auto-stashes taken during merges, and stash@{0} held the ONLY copy of kanban/epics/workflow-dsl-kanban-reference.md plus ten 2026-07-29 rescope records. Nothing in the working tree, the branch list, or the PR list pointed at it. It surfaced only because the user volunteered 'I used gitkraken and it stashed it as I was doing merges'.

## Pattern
VCS GUIs (GitKraken, SourceTree, IDE merge helpers) auto-stash silently before merges and rebases. Any cleanup task framed as 'the repo is dirty' or 'tidy this up' must treat stashes as first-class state. The same turn also had to prove five worktrees and six merged branches were safe to remove — the general shape is: never destroy or dismiss VCS state until each artifact's content is proven present elsewhere.

## Candidate skill outline
- Name suggestion
- Trigger phrases
- Key steps or rules
- Anti-patterns to avoid

## Better path
Open every repo-hygiene task with: git status --porcelain, git worktree list, git stash list, git branch -vv. For each stash, resolve landed-ness mechanically instead of by eye — for f in $(git stash show --name-only stash@{N}); do compare git rev-parse stash@{N}:$f against the same path on main and every open PR branch. Report UNMATCHED paths and recover those; never git stash drop on the agent's own judgement. For append-only logs, confirm prefix-extension by byte comparison (head -n <count> of the longer log vs the shorter) before treating a union as lossless — a non-prefix log is divergence, not an append. Verify worktrees are clean AND have zero unpushed commits before git worktree remove.

## Receipt refs
- none
