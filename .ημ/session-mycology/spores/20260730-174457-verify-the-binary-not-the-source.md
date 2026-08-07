---
status: incubating
created: 2026-07-30T22:44:57.197411449Z
source-session: /home/err/spaces/eta-mu/.claude/worktrees/agent-operating-standard
source-task: Verify packages/eta-mu has the receipts subcommands; retract findings made against the published binary
p-efficiency: 0.5
p-friction: 0.5
p-skill-candidate: 0.95
promoted-to: ""
rejected-reason: ""
---

## Problem
Asked whether a package had certain subcommands, I tested 'eta-mu' from PATH. That was a volta shim to the PUBLISHED eta-mu@1.1.1 while the workspace source was also 1.1.1 with a different command surface. Top-level receipt/session/fork-tax exist in source but only under the git group in the published build. I concluded the docs were wrong and that create-subtask was broken (random UUIDs, wrong directory, no ledger event) and hand-wrote four cards to work around it. All of it was false. The stale program answered instead of failing, and its answers were internally consistent.

## Pattern
Any question of the form 'does this package/repo have X' answered by running a globally-installed CLI. Monorepos with a published npm twin at the same version are the acute case, but the general trap is: the artifact on PATH is not the working tree. Related tells — 'Unknown command: X' falling through to a different handler and surfacing as a config/API-key error; a build artifact directory that is gitignored, so a fresh checkout or worktree has no build and only the global shim answers.

## Candidate skill outline
- Name suggestion
- Trigger phrases
- Key steps or rules
- Anti-patterns to avoid

## Better path
Answer capability questions from SOURCE first: find the command registry and read it. Then, to test behaviour, resolve what would actually run — readlink -f $(which <cli>), compare against the package bin and version, and state which one you are exercising. Build from the installed root and invoke the artifact by path (node packages/<pkg>/dist-cli/index.cjs), never the bare name. Treat exit code 0 as insufficient: grep the build log for warning counts, because a worktree build lacking node_modules exited 0 with 163 undeclared-var warnings and produced a binary that threw at runtime. When a finding is retracted, append a :refutation receipt rather than editing the earlier one.

## Second sighting, 2026-08-06 — the sharper form
The original framing was "the stale artifact answers capability questions wrongly." The stronger version: **a merged, verified, receipted fix is not in force until the artifact is rebuilt.** PR #182 fixed `eta-mu kanban comment --text` silently recording the literal string `--text` while returning `ok: true`. It merged. The next session, on `main`, the first comment attempt reproduced it exactly and corrupted a card. The fix was correct; `eta-mu-beta` symlinks to `packages/eta-mu/dist-cli/index.cjs`, a gitignored build artifact that `git pull` does not touch. `pnpm -C packages/rheos build && pnpm -C packages/eta-mu build` made it bind correctly.

The aggravating factor is evidential, not mechanical: the receipt and the closed card both said the bug was fixed, so an agent reading the ledger would reasonably stop suspecting it — the record actively argues against re-testing. Same trap for every mutation verb, not just `comment`.

Additions to the better path: after pulling or switching branches, rebuild `dist-cli` before invoking any mutating verb, and probe once with a disposable value before sending real content to a mutation surface — the probe here cost one line to clean up; the real comment would have cost a paragraph. Do not let a receipt asserting "fixed" substitute for observing the fixed behaviour in the binary you are about to run. Carded as `a-merged-fix-to-a-mutation-surface-is-not-in-force-until-dist-cli-is-rebuilt` (incoming), which is where the durable enforcement belongs.

## Receipt refs
- 2026-08-07T02:28:38.522Z
