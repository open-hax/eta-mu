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

`.github/workflows/opencode-code-review.yml` reviews non-draft, same-repository pull requests with the project-local `github-reviewer` OpenCode agent and the `opencode/mimo-v2.5-free` model. It has no native `pull_request` trigger. A signed, allowlisted `pull_request:labeled` webhook for the exact `eta-mu:review` command is admitted by the eta-mu GitOps controller, which dispatches the workflow file from the repository's trusted default branch with the pull-request number, exact head SHA, exact default-base SHA, exact synthetic merge SHA, and durable command ID. Consumer repositories expose only a default-branch `workflow_dispatch` wrapper for that contract. Each repository must define the administrator-controlled `ETA_MU_CONTROLLER_APP_LOGIN` Actions variable as the dedicated controller App's exact `name[bot]` login; a reusable wrapper forwards that variable through the required `controller_app_login` call input, while eta-mu's direct dispatch reads its own repository variable. The resolver requires both the inherited `github.actor` and `github.triggering_actor` to equal that value, so neither a manual dispatch nor a human-triggered rerun can bypass controller admission. This controller identity is intentionally distinct from the App used later for review publication.

The workflow has four bounded stages plus an exact-merge telemetry projection:

1. **Deterministic evidence** — execute without App credentials or private repository bytes. The eta-mu default installs from the committed lockfile with package lifecycle scripts disabled, then invokes fixed tools directly for only the public webhook-controller scope: the review-workflow contract plus gitops-controller lint, test, and build. Exit codes and logs are serialized in a freshly emptied runner-temporary directory and sealed with an exact SHA-256 manifest; they never merge into the pull-request checkout. A failed environment or dependency install is evidence about the run, not automatically evidence of a code defect. A caller may supply another bounded script, but that job still receives no privileged token.
2. **Review-context compilation** — validate immutable commit syntax, then check out pinned revisions of `octave-commons/muse` and `riatzukiza/.agents`. Muse compiles a review-specific OpenCode projection containing only observer tools; the `.agents` repository is packaged as the global skill source. Both revisions and the skill inventory are recorded in the context artifact. The review job downloads that artifact and deterministic evidence into freshly emptied runner-temporary directories, then rejects checksum mismatches, symbolic links, and every unmanifested file or directory before installing anything.
3. **Isolated model review with omission-only recovery** — archive the exact pull-request tree as read-only evidence under a fresh runner-temporary `source/` directory, outside the repository checkout and without project-local OpenCode configuration at the execution root. Pull-request `opencode.json`, `.opencode/**`, `AGENTS.md`, `CLAUDE.md`, and plugins remain inert source evidence. The OpenCode child receives an explicit environment allowlist, excluding GitHub Actions workflow-command paths, artifact/cache tokens, OIDC endpoints, and arbitrary runner secrets. The reviewer maps the change, reconstructs relevant contracts and invariants, generates candidate findings, and attempts to disprove each candidate. A completed first invocation that leaves a missing `review_submit` artifact receives exactly one corrective model invocation. The recovery starts the state machine again and must finish with a real tool-written submission; it never synthesizes a review from free-form output. A malformed submission does not consume the recovery attempt, and malformed or repeatedly missing submissions fail closed before publication.
4. **Fresh-runner publication** — upload only the digest-bound submission, then start a separate job with no checkout or model workspace. That job freshly empties its runner-temporary input directories, independently downloads and exactly verifies the normalized pull-request context, checksummed trusted review machinery, and strict submission artifact before it mints a narrowly scoped GitHub App token. It re-fetches the pull request, requires it to remain open, same-repository, mergeable, and targeted at the repository's current default branch, and refuses any head, base, or synthetic-merge drift before publishing. This is the only workflow job that receives the review-publication App credentials.

The trusted resolver also creates an in-progress **eta-mu-opencode-evidence**
telemetry check directly on the admitted synthetic merge commit. Its `external_id` binds the
durable command ID, workflow run, attempt, pull-request number, head SHA, default-base SHA, and merge SHA;
its `details_url` must bind the same run and attempt. The finalizer lists
same-name checks with `filter: all`, updates only the newest check on that exact
merge commit, and leaves a superseded run unchanged. An older success therefore cannot
hide a newer pending or failed review command.

The two model invocations write separate response and stderr files plus a small
`recovery.json` decision record. The attempt artifact therefore preserves the
first response even when the corrective invocation succeeds or fails.
An invocation that rejects is recorded once with a null exit code before its
original error is rethrown; both stream files are finalized, and that failure
never consumes the omission-only corrective attempt.
The bounded runner itself travels in the checksummed review-context artifact.
That is required for reusable callers: their review job checks out the caller's
pull-request tree, which does not contain eta-mu's repository-local scripts.

A GitHub failed-job re-run is a different boundary from the in-job corrective
invocation. GitHub retains the original run and re-runs failed jobs and their
dependents; successful prerequisite jobs may remain from attempt 1. The review
job downloads the immutable artifact names its prerequisite jobs emitted through
job outputs, rather than rebuilding names from the new `github.run_attempt`.
Consequently a review-only re-run reuses the original deterministic evidence and
compiled context. A full workflow re-run executes those prerequisites again and
emits new attempt-scoped names.

The reusable workflow has one stable terminal job, **OpenCode evidence review
gate**, and projects its outcome as the exact-merge
**eta-mu-opencode-evidence** check. That check is diagnostic evidence, not
branch-protection authority. The controller correlates its exact workflow run
into the later lifecycle gate; branch protection requires only the
controller-App-owned **eta-mu-review-gate**. A `workflow_dispatch` job check is
attached to the selected trusted ref, not implicitly to the input pull-request
SHA. The job runs under `always()` and the projected evidence check fails closed
unless deterministic execution, context compilation, and review publication
all succeeded.

Every reusable caller must be a `workflow_dispatch` wrapper, pass
`controller_app_login: ${{ vars.ETA_MU_CONTROLLER_APP_LOGIN }}`, and forward the
controller-supplied `pr_number`, `pr_head_sha`, `pr_base_sha`, `pr_merge_sha`, and `command_id` inputs. Both
workflow checkouts, deterministic command environment, evidence summary, and
review bind to that immutable head/base/merge tuple. Missing inputs, a non-dispatch caller,
or a stale or malformed revision fails before review execution. The resolver also
re-fetches the pull request and requires it to be open, mergeable, same-repository,
targeted at the current default branch, and still equal to the supplied tuple.

Deterministic Java, Clojure, Babashka, clj-kondo, and pnpm setup is enabled by
the `workflow_call` default. A reusable `workflow_dispatch` wrapper may explicitly set
`setup_eta_mu_toolchain: false` when its evidence script supplies a compatible
toolchain; the workflow distinguishes an absent input key from a present
boolean before applying its value, independently of the inherited event name.
Default eta-mu review gates deliberately do not execute Sol, Rheos, or any gate
that needs the private Katamorph or event-ledger repositories. Those bytes and
their read credentials must never enter a job that executes pull-request code.
Changes in that scope require the repository's native exact-head
**Sol CI / verify** (and the corresponding native Rheos checks when applicable)
as separate evidence in addition to **eta-mu-opencode-evidence**. The webhook
review is evidence and commentary, not a replacement for those native checks.
On pull requests, **Sol CI / verify** checks out the immutable head and runs only
public-source lint; it has no App credential, private dependency source, test, or
build step. Full Sol test/build with Katamorph and event-ledger runs only on
trusted `main`/`staging` push revisions. That deferred integration is an explicit
pre-merge evidence gap, not a full-test success hidden behind a green PR check.

Draft, closed, and fork pull requests are refused by the controller before
dispatch. The workflow repeats that current-state check so a race after webhook
admission fails closed. A reusable call inherited from `pull_request`, `push`,
`merge_group`, or any event other than `workflow_dispatch` is a caller contract
failure, and the terminal gate remains red.

Review lifecycle changes are separate signed-webhook commands. The admitted set
is `pull_request_review:submitted|dismissed`,
`pull_request_review_comment:created`, and
`pull_request_review_thread:resolved|unresolved`; GitHub Actions has no native
trigger for the last pair. The controller durably admits each event, re-fetches
the live pull request, binds the current head, and dispatches the target
repository's configured default-branch gate wrapper with `pr_number`,
`pr_head_sha`, `pr_base_sha`, `pr_merge_sha`, `command_id`, the exact
controller-owned `gate_check_id`, and the
durably correlated `evidence_run_id`/`evidence_command_id`. The wrapper forwards
`controller_app_login: ${{ vars.ETA_MU_CONTROLLER_APP_LOGIN }}` as a required
reusable-workflow input; direct eta-mu dispatch reads the same protected
repository variable. Because third-party review bots may not be
repository collaborators, a verified GitHub signature plus installation and
repository allowlists authorizes only this defensive gate recomputation. It does
not authorize a model review. The called workflow requires both actor
identities to be the protected controller App login, re-fetches the same open,
same-repository default-base/head/test-merge tuple, polls the exact correlated
evidence workflow run, and
requires a current acceptable exact-head review from the protected publication
App. It never accepts a generic same-name Check Run or an `evidence_complete`
assertion as authority. A webhook dispatch always runs the review-thread gate
in strict mode with read-only Actions, Checks, Contents, and Pull requests
permissions. On `workflow_run:completed`, the controller refetches and validates
the exact run and then terminally updates its own original
`eta-mu-review-gate` Check Run. The workflow receives no controller private key.

Signed, allowlisted `pull_request:opened|reopened|synchronize|ready_for_review`
events and base-changing `pull_request:edited` events take a narrower defensive
path: the controller creates a new pending required gate on the current
mergeable synthetic merge commit and dispatches no workflow or model. This
prevents a prior PR lifecycle's success from being reused after revision or
base changes.

For transport-only ingress verification, a human may apply the exact
`eta-mu:probe` label to a pull request. It traverses signature verification,
installation and repository allowlists, live pull-request lookup, and actor
authorization, then records one durable `probed` completion for the delivery
GUID.

The Services observe-only proof applies `eta-mu:probe` to a canonical open
issue instead. The controller uses repository-scoped Issues, Contents, and
Metadata read tokens to re-fetch the issue, repository, and default-branch ref;
requires exactly one canonical Rheos task marker; and records a deterministic
revision-bound project plan with `effects: []`. Both probes remain terminal and
write-free: neither creates an outbox, invokes a workflow, consults Sol, mutates
Git or Rheos, or depends on deployment effect-lease state.

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
