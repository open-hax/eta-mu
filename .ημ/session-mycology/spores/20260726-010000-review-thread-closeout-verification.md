---
status: incubating
created: 2026-07-26T01:00:00Z
source-session: /home/err/spaces/eta-mu
source-task: "PR #142 review closeout — 20 bot-review threads across two waves, driven to merge"
p-efficiency: 0.75
p-friction: 0.55
p-skill-candidate: 0.85
promoted-to: ""
rejected-reason: ""
---

## Problem

"Push this PR to completion" on a PR with 28 open-looking bot findings reads as a
large implementation task. It was not. 14 of the 15 unresolved threads were
**already fixed in code** by earlier commits on the same branch — the merge was
blocked solely by `required_conversation_resolution`, because nobody had replied
to or resolved the threads. Planning fixes before verifying state would have
meant re-implementing work that already existed, or worse, "fixing" it twice.

Three compounding traps:

1. **The local worktree was 6 commits behind the branch tip.** Any file read from
   disk described code that had already been superseded. Subagents sent to verify
   findings had to be explicitly told to read blobs via
   `git show origin/<branch>:<path>` and *not* to read from disk.
2. **The bots' own fix commits left gates red.** `scripts/ultra_test.bb`'s
   `git-commit-is-path-scoped` — the test that *evidenced* the path-scoped-commit
   fix — stubbed `p/process` with a `delay`, which cannot satisfy the 3-arity
   `(deref p ms default)`, so it died with a `ClassCastException` instead of
   asserting anything. A review-fix commit's evidence can itself be failing.
3. **The red gates were invisible to CI.** Neither `pnpm lint` nor sol's
   `lint:kondo` runs in any workflow, so 2 Biome formatting errors and 2
   promise-chain kondo warnings rode to `main` through a PR whose every visible
   check was green. They only surfaced when the kanban FSM's `review` transition
   gate ran `pnpm build && pnpm lint`.

## Pattern

Any "close out the review on PR N" task where an automated reviewer has posted
multiple waves. Bot reviewers re-review each push, so findings accumulate faster
than they are resolved, and later commits silently fix earlier findings without
resolving their threads. The residue looks like a mountain of work and is mostly
bookkeeping — but the small genuine residue is buried in it, so it cannot be
skipped either.

Also generalizes: whenever a repo has quality gates that CI does not run, "CI is
green" is not the same as "the gates pass."

## Candidate skill outline

- **Name suggestion**: `pr-review-thread-closeout`
- **Trigger phrases**: "check the review comments on PR N", "push this PR to
  completion", "resolve the review feedback", "why is this PR blocked"
- **Key steps**:
  1. Determine the *actual* merge blocker first, before reading any finding:
     `gh pr view N --json mergeStateStatus,reviewDecision`, then
     `gh api repos/O/R/branches/main/protection` **and**
     `gh api repos/O/R/rulesets` (rulesets carry rules the legacy protection
     endpoint returns as null — `required_conversation_resolution`, required
     contexts, approval count). BLOCKED with all checks passing and 0 required
     approvals almost always means unresolved conversations.
  2. Enumerate threads via GraphQL `reviewThreads` with `isResolved` — the REST
     comments endpoint cannot tell you what is resolved. Note that
     `/pulls/{pr}/comments/{id}` 404s; the per-comment path is
     `/pulls/comments/{id}`.
  3. `git fetch` and compare the worktree to the branch tip. If behind, either
     fast-forward first or read every file as `git show origin/<branch>:<path>`.
  4. Verify **every** finding against the tip before planning any fix. Correlate
     each thread's `created_at` against commit timestamps to guess which commit
     addressed it, then confirm in the code. Expect most to be already fixed.
  5. Run the repo's own gates, not just CI. Diff the gate list in
     `CLAUDE.md`/`AGENTS.md` against the workflow files; anything only in the
     docs is a gate that can be red without CI noticing.
  6. For each thread: reply naming the fixing commit and the mechanism, *then*
     `resolveReviewThread`. A bare resolve destroys the audit trail that made the
     finding worth filing.
  7. Re-check for a new wave after each push — bot quota resets mid-task, and a
     fresh wave re-blocks the merge.
- **Anti-patterns to avoid**:
  - Planning fixes before verifying which findings are live.
  - Reading files from disk when the worktree is behind the tip.
  - Resolving threads without a reply (or replying without naming the commit).
  - Accepting a bot finding as stated when its own analysis chain contradicts it
    — two here were wrong (a `git ls-remote` that succeeded but was overridden by
    a web search; a claim that two ledger rows were missing when both existed).
    Disagree in the reply, with the evidence, and resolve.
  - Committing build side-effects. Full-monorepo gate runs regenerated
    `packages/legacy/ai/src/models.generated.ts` twice (+810/-483 of generated
    churn that would also have raised the legacy TS line count). Check
    `git status` after every gate run, not just before committing.

## Better path

Front-load a single verification pass over all threads against the branch tip,
in parallel, before touching any code. Expect the answer to be "mostly already
fixed, plus a small real residue," and budget the effort as bookkeeping plus a
handful of fixes. Then confirm which of the repo's documented gates CI actually
runs — the gap is where the real bugs are hiding.

## Related

Shares a root with `20260715-152351-review-card-code-verification.md` ("cards in
review claim gates green, but claims drift from code"). Same underlying lesson —
**re-verify the claim against the code before acting on it** — but a different
surface: that spore is about kanban card claims and the `eta-mu kanban` CLI, this
one is about PR review threads, merge blockers, and `gh`/GraphQL. If a reviewer
promotes both, the shared step ("re-run the stated gate, grep for the claimed
symbols, then decide") is the piece worth factoring out.

## Receipt refs

- 2026-07-25T23:55:00Z `:test-run` pr-142-review-should-fix-batch (gates before push)
- 2026-07-26T00:40:00Z `:test-run` pr-142-review-should-fix-batch (second wave)
- 2026-07-26T00:30:00Z `:push-truth` pr-142-review-should-fix-batch (merge)
