---
uuid: "a-merged-fix-to-a-mutation-surface-is-not-in-force-until-dist-cli-is-rebuilt"
title: "A merged fix to a mutation surface is not in force until dist-cli is rebuilt"
status: "incoming"
type: "task"
priority: "P1"
points: "2"
labels: "tasks, kanban, bug, tooling"
category: "tasks"
write-id: "1786069788146-0.h1yaveqmftwnqnrxarm"
created_at: "2026-08-07T02:29:48.146Z"
---

# A merged fix to a mutation surface is not in force until dist-cli is rebuilt

## Symptom

PR #182 fixed `eta-mu kanban comment --text` silently recording the literal
string `--text` as the comment body while returning `{"ok": true}`. The fix
merged to `main` on 2026-08-06.

The very next session, on `main`, the first comment attempt reproduced the bug
exactly — `"comment": "--text"`, `ok: true`, real text lost. The fix was
correct; it simply was not running. `eta-mu-beta` is a global pnpm symlink to
`packages/eta-mu/dist-cli/index.cjs`, a build artifact that `git pull` does not
touch. Rebuilding (`pnpm -C packages/rheos build && pnpm -C packages/eta-mu build`)
made `--text` bind correctly.

## Why it matters

This is a silent-data-loss bug that returns success, on the sanctioned
mechanism for annotating a settled card. It was already found once, diagnosed,
fixed, merged, and receipted — and it still bit the next session, because
nothing connects "merged" to "in force" for the binary agents actually invoke.
Any agent reading the receipts would reasonably conclude the bug was gone.

The general shape: **for any CLI whose fix lands in a build artifact, merging
is not shipping.** The same trap applies to every mutation verb rheos exposes,
not just `comment`.

## Scope

Pick the smallest thing that makes staleness *visible* rather than silent:

- [ ] Have the CLI compare its built-in version/commit against the repo HEAD it
      is running inside, and warn (or refuse mutations) when the artifact is
      older than the source tree.
- [ ] Alternatively/additionally: a post-merge or post-checkout hook that
      rebuilds `dist-cli`, or a `pnpm gates` check that fails when `dist-cli`
      is older than `packages/*/src`.
- [ ] Document the rebuild step wherever agents are told to use `eta-mu-beta`
      (`CLAUDE.md`, `AGENTS.md`) — necessary but *not sufficient*; docs without
      a gate regress, per the roadmap's own rule.

## Verification

Check out a commit whose CLI source differs from the built `dist-cli` and run a
mutating verb. It must not silently run the old code.
