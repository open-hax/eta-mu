# Agent Workflows: Kanban → GitHub → OpenCode → Review Gates

This repository participates in the shared OpenHax / Octave Commons automation stack. Agents working here should understand the following workflow before opening or reviewing PRs.

## GitHub event visibility

GitHub events are mirrored to Discord through `.github/workflows/github-events-discord.yml` using the `DISCORD_REVIEW_WEBHOOK_URL` secret.

Mirrored events include:

- issues and issue comments
- pull request lifecycle events
- pull request reviews
- releases
- pushes to `main`, `master`, `dev`, and `device/**`
- selected workflow completions for OpenCode review workflows

Do not print or copy webhook URLs, bot tokens, GitHub tokens, provider keys, or other secrets into logs, issues, PR comments, or commits.

## Kimi issue agent

`.github/workflows/opencode-issue-agent.yml` runs OpenCode with Kimi For Coding on issue events and on a daily schedule.

Kimi may:

- triage new, reopened, or edited issues;
- ask for clarification when an issue is underspecified;
- close issues that are clearly irrelevant, spam, duplicates, or out of scope, with a concise reason;
- open a linked PR for a small safe fix.

Kimi must not close ambiguous issues or make broad/destructive changes.

## MiMo evidence-first PR review

`.github/workflows/opencode-code-review.yml` reviews non-draft, same-repository pull requests with the project-local `github-reviewer` OpenCode agent and the `opencode/mimo-v2.5-free` model.

The workflow has three bounded stages:

1. **Deterministic evidence** — install from the committed lockfile, then run the repository lint, test, and build gates. Exit codes and logs are serialized under `.opencode/review-evidence/`. A failed environment or dependency install is evidence about the run, not automatically evidence of a code defect.
2. **Review-context compilation** — check out pinned revisions of `octave-commons/muse` and `riatzukiza/.agents`. Muse compiles a review-specific OpenCode projection containing only observer tools; the `.agents` repository is packaged as the global skill source. Both revisions and the skill inventory are recorded in the context artifact.
3. **One model review pass** — map the change, reconstruct relevant contracts and invariants, generate candidate findings, attempt to disprove each candidate, and publish only findings that survive the evidence threshold.

The reusable workflow has one stable terminal check, **OpenCode evidence review
gate**. Configure that job as the required check in callers. It runs under
`always()` and fails closed unless deterministic execution, context compilation,
and review publication all succeeded.

Every reusable caller must pass `pr_head_sha` as the immutable
`${{ github.event.pull_request.head.sha }}` value. Both workflow checkouts,
deterministic command environment, evidence summary, and review bind to that
input. Direct `pull_request` execution uses the same event-head value without a
reusable input. A missing reusable input is a workflow contract error; a
non-commit or mismatched value fails the checkout guards. Both guards also
compare the selected revision with the event's actual pull-request head, so a
valid stale or merge commit supplied by a caller cannot become review authority.

Deterministic Java, Clojure, Babashka, clj-kondo, and pnpm setup is enabled when a direct
`pull_request` trigger has no reusable-workflow inputs and by the
`workflow_call` default. A reusable caller may explicitly set
`setup_eta_mu_toolchain: false` when its evidence script supplies a compatible
toolchain; the workflow distinguishes an absent input key from a present
boolean before applying its value, independently of the inherited event name.
Default eta-mu gates use the repository GitHub App to mirror the pinned
Katamorph and event-ledger repositories into runner-temporary storage. Bounded
`insteadOf` rewrites exist only for deterministic execution and are removed by
an exit trap; missing credentials remain a recorded deterministic failure.

For draft or fork pull requests, that same stable job runs and reports the
review as explicitly not applicable. Those events are outside the workflow's
supported review boundary, so their intentionally skipped prerequisites do not
block branch protection. Eligible non-draft, same-repository runs retain the
fail-closed behavior.

Deterministic command failures do not suppress their evidence or the review
attempt. The command step records every exit, the summary reports
`result: failure`, and artifacts are uploaded; the model may still inspect that
failure. The terminal check is what makes the reusable caller red. This split is
intentional: retaining diagnostics must never turn a failed gate green.

Eta-mu's build refreshes explicit tracked generated outputs: the legacy model
catalog plus the contracts CLI bundle and source map. The default gate requires
every listed path to match `HEAD` before the build, archives changed bytes and
SHA-256 evidence under their repository-relative paths, and restores the exact
checked-out bytes afterward. The build exit remains authoritative, and every
other tracked or untracked mutation still fails the clean-tree proof. A missing
or already dirty listed path is never restored or hidden.

Evidence schema `open-hax.review-evidence/v2` distinguishes the event's
`expected_head_sha` from the independently observed `executed_sha` and
`completion_sha`. Both deterministic execution and model review explicitly
check out the pull-request head and require the same clean revision before and
after their work. `head_sha` is populated only after those values agree; run-ID
artifact names avoid claiming an exact revision before that proof exists.

### Muse observer projection

Muse remains the compatibility/compiler boundary. The workflow does not treat its bootstrap actor implementation as canonical runtime authority.

The review projection exposes only existing-state observers:

- Muse/phase listings and phase ledger reads;
- actor lists, mailbox reads, and condition watches;
- task and background-agent status/listing.

It does not expose actor or agent spawning, message sending, task execution, ledger append, receipt mutation, skill promotion, web search, or shell access. Multiplexed tools such as `receipt_river`, `edn_ledger`, and `session_mycology` are omitted because their action schemas include writes even when some actions are read-only.

### Global skills

The workflow mounts the pinned `riatzukiza/.agents` checkout at `~/.agents`, which is OpenCode's external skill discovery location. Skills provide process, environment classification, and domain-specific method. They do not count as evidence and cannot lower the finding threshold.

The reviewer is deliberately read-only:

- file edits are denied;
- shell execution is denied;
- web access is denied;
- subagent spawning is denied;
- session sharing is disabled;
- GitHub write permission exists only so the OpenCode integration can publish the final review.

A reportable inline finding must:

- be introduced or exposed by changed code;
- attach to a changed line;
- identify supporting repository context;
- provide an independently plausible failure trace;
- survive adversarial validation;
- be marked confirmed with confidence of at least `0.85`.

Test gaps and unresolved questions belong in one concise non-blocking summary. If no candidate survives validation, the agent leaves a short passing summary instead of inventing comments.

The reviewer runs `opencode/mimo-v2.5-free` over OpenCode's anonymous public-provider path, so no `OPENCODE_API_KEY` secret is required — when no OpenCode credential is connected, OpenCode supplies the public credential and disables only models with a non-zero input cost. Inline review comments are mirrored to Discord by the workflow's final notification step.

## CodeRabbit and review gates

CodeRabbit may add inline review comments. Repositories with branch protection enabled require review-thread resolution before merge when GitHub permits `required_conversation_resolution`.

Agent rules:

1. Do not merge while actionable inline review threads remain unresolved.
2. Resolve CodeRabbit/OpenCode comments by patching the code or explicitly explaining why no change is needed.
3. Prefer small targeted commits over broad rewrites.
4. Re-run or wait for required checks after pushing fixes.

## Kanban → GitHub issue sync

Markdown Kanban cards are the local planning source. GitHub issues are the collaboration and automation surface.

The eta-mu CLI supports syncing Kanban cards to GitHub issues:

```bash
eta-mu kanban sync github --tasks-dir <kanban-dir> --repo <owner/repo> --dry-run
eta-mu kanban sync github --tasks-dir <kanban-dir> --repo <owner/repo> --max-writes 25 --write-delay-ms 5000
```

The underlying package command is also available:

```bash
openhax-kanban sync github --tasks-dir <kanban-dir> --repo <owner/repo>
```

Sync behavior:

- Issues are keyed by an idempotent marker: `<!-- openhax-kanban-sync uuid="..." -->`.
- Labels include `kanban`, `status:<status>`, `priority:<priority>`, and task frontmatter labels.
- Existing issues are updated when the Kanban title/body/status/labels change.
- Existing issues are closed when the task becomes `done` or `rejected`.
- New issues are not created for tasks already marked `done` or `rejected`.

GitHub enforces secondary content-creation limits. Always dry-run first and use `--max-writes` plus `--write-delay-ms` for live syncs.

## Kanban label vocabulary

Typical labels produced by sync:

- `kanban`
- `status:icebox`, `status:incoming`, `status:accepted`, `status:breakdown`, `status:blocked`, `status:ready`, `status:todo`, `status:in_progress`, `status:review`, `status:document`, `status:done`, `status:rejected`
- `priority:P0`, `priority:P1`, `priority:P2`, `priority:P3`
- task-specific frontmatter labels, normalized for GitHub

## Agent expectations

When working on this repo:

1. Look for local Kanban cards before creating new issues.
2. If an issue has an `openhax-kanban-sync` marker, treat the synced Kanban card as the source of truth.
3. Keep status labels consistent with actual task progress.
4. Mention or link the synced issue/PR relationship when opening fixes.
5. Preserve auditability: receipts, PR descriptions, and comments should explain what changed and why.
