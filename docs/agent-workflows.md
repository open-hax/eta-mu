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

`.github/workflows/opencode-code-review.yml` reviews non-draft, same-repository pull requests with the project-local `github-reviewer` OpenCode agent and the `opencode/mimo-v2.6-flash-free` model.

Direct pull requests and reusable callers default to a 60-minute review job.
Reusable callers may set numeric `review_timeout_minutes` to a whole number from
60 through 180 when a complete diff needs a longer pass. The job timeout is
bounded to that range, and its first step rejects an invalid raw request before
checkout or reviewer setup. This budget includes setup and both possible model
invocations; a timeout never establishes review completion or authorizes partial
scope publication. The deterministic evidence, context compilation and terminal
gate budgets remain 60, 45 and 5 minutes respectively.

The workflow has three bounded stages:

1. **Deterministic evidence** — install from the committed lockfile, then run the repository lint, test, and build gates. Exit codes and logs are serialized under `.opencode/review-evidence/`. A failed environment or dependency install is evidence about the run, not automatically evidence of a code defect.
2. **Review-context compilation** — check out pinned revisions of `octave-commons/muse` and `riatzukiza/.agents`. Muse compiles a review-specific OpenCode projection containing only observer tools; the `.agents` repository is packaged as the global skill source. Both revisions and the skill inventory are recorded in the context artifact.
3. **Model review with bounded recovery** — map the change, reconstruct relevant contracts and invariants, generate candidate findings, attempt to disprove each candidate, and publish only findings that survive the evidence threshold. A completed first invocation that leaves a missing `review_submit` artifact receives exactly one corrective model invocation. An invocation that exits 1 without a submission after the host invalid-tool doom-loop rejection, with two distinct completed unavailable-review-tool events followed by the terminal session error can use that same corrective invocation. Structured OpenCode JSON events must bind the calls and terminal permission error to one session, and the corrected `review_` name must exist in the checksummed staged registry. A quoted tool error, an unknown tool mapping, mixed sessions, malformed events, provider quota/authentication failure, spawn rejection, or a failed invocation with any submission does not authorize recovery. The recovery starts the state machine again and must finish with a real tool-written submission; it never synthesizes a review from free-form output. A malformed submission does not consume the recovery attempt, and malformed or repeatedly missing submissions fail closed before publication.

Diff staging preserves the complete Git merge-base/head bytes in `basehead.diff`
before making the 300,000-byte `pr.diff` preview. `input-manifest.json` records
the native base, independently computed merge base, exact head, full byte count,
SHA-256 and observed workflow/run identity. Missing bases and mismatched heads
fail staging; an empty diff is valid input rather than a reason to change bases.
The existing evidence artifact carries both files and the manifest unchanged.

The matching Muse review profile verifies the full input against that manifest.
Its read-only `review_read_diff_chunk` tool delivers bounded lossless pages, and
`review_assess_diff_chunk` records the reviewer's assessment of each delivered
page. Submission requires assessment of every page; a preview, successful read
or empty finding list cannot satisfy this requirement. Review every changed
hunk, reading unchanged surrounding code as needed to assess its contracts.
This does not require exhaustive proof or reading every unchanged file.

The workflow-call default and both direct-PR fallbacks select merged Muse
`c1369c223cf3c57e3e31934a6d746bfcdfe73f5a`, including context provenance.
Muse PR #20 merged normally with tree `9c01c3b1ad207c640922202d8d2047fe48e1f9e2`;
its branch was not natively protected. The candidate compiles both the observer
and canonical invocation verifier from that exact source. The verifier retains
strict LAST-read order, five actual ordered stages and refusal of failed HOST
calls; an APPROVED review alone cannot satisfy invocation acceptance.
This Eta candidate still requires native hosted qualification and its own
authorized merge. Production callers select it only through a separately
reviewed revision update. Existing callers and historical fixture provenance
retain their original source; this pin preparation activates no receiver.

The two model invocations write separate response (raw OpenCode JSON event stream) and stderr files plus a small
`recovery.json` decision record. The attempt artifact therefore preserves the
first response even when the corrective invocation succeeds or fails.
An invocation that rejects is recorded once with a null exit code before its
original error is rethrown; both stream files are finalized, and that failure
never consumes the corrective attempt. Unknown nonzero exit failures also remain terminal. A recognized unavailable-tool failure is retained with its original exit code, session and call IDs and exact tool-name correction; it is not a completed review. No tool alias, permission rule, stage or evidence guard is relaxed. The two-attempt bound applies across both recovery causes; attempt 2 cannot trigger another invocation.
The invocation-integrity repair extends that same two-attempt bound to a
completed first invocation whose canonical Muse verifier establishes a
successful read after assessment. The tool latches that violation; another
assessment, another `review_begin`, or a changed host session ID cannot erase
the history. The reviewer keeps returned pages for later stages and stops when
the tool reports `restart-required?`. The supervisor may start one fresh model
process over the whole unchanged input. A parseable rejected submission is
retained as `submission-attempt-1.json` before recovery. A tool error, including
failed removal of an old submission, establishes no successful returned reread
and cannot authorize this recovery path.

Muse owns the pure invocation decision and its compiled CJS boundary. The
supervisor prepares canonical page geometry from the actual full diff and
manifest before the child starts, and checks the completed structured host
stream against that context and the actual submission bytes. Acceptance needs
all page reads and assessments in the original last-read chronology, five
actual successful stage calls and the successful submit call. Generated
submission notes supply no missing stage calls. A healthy structured omission
can use the original corrective attempt; malformed or ambiguous output cannot.
These deterministic checks establish tool history and custody, while fresh
independent native qualification still assesses substantive review coverage.

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

The fresh review job binds the manifest's producer attempt to the passed-through
`review-evidence-<PR>-<run ID>-<producer attempt>` artifact name. It requires the
same native PR and run, a positive producer attempt no later than the current
verification attempt, and the unchanged repository, workflow, head, base and
independent Git byte/hash checks. Its review-owned `input-verification.json`
retains producer `provenance` and `evidence_artifact_name`, and separately records
the current consumer in `verification_provenance`; a reused artifact never
claims it was produced during the later verification attempt.

After the model and bounded recovery, the workflow runs the same Git input
verification command again, before final schema validation, App token creation
and publication. The first verification exports its receipt SHA-256 as a step
output; context installation exports the checksum-list SHA-256. The final check
requires the original receipt and manifest bytes, independently regenerated
Git diff, preview and provenance to match, and rechecks the original context
checksum list and its files. Replacing both a file and its local checksum list
cannot supply new authority. Producer and verification provenance remain
separate, including retained attempt 1 input verified during attempt 2.

The final check consumes Muse's tool-written `input-source`, `input-coverage`
and `input-assessments` unchanged. Source identity must match the verified
manifest, coverage counters must be complete, and nonblank assessment notes must
cover contiguous UTF-16 ranges from zero through the full decoded diff. Empty
input has zero chunks and an empty assessment vector. The workflow freezes the
exact submitted bytes in runner-temporary storage; both publisher validation and
publication read that copy. The supervisor exports a trusted step digest of
the selected attempt binding after the child closes. The final Git check binds
that digest to the retained response, submission, compiled verifier and prepared
context bytes, then repeats the same canonical Muse verification and compares
the complete verdict before freezing the submission. The child does not receive
the supervisor's `GITHUB_OUTPUT` path.

`submission-verification.json` records the input,
context and submission digests. It does not add missing model metadata, decide
the review event, implement Muse's review state machine or prove cognitive
review quality. The unchanged publisher still validates the envelope and actual
changed-line locations before submitting it through the App.

The final-boundary fixtures have serialized-shape provenance from the retained
native dc4 submission (artifact `11293745387`,
`review-attempt-340-37173972128-1`) generated by immutable Muse
`0b9a91492c8355e6933dc2164d35668cb76d9e60`. The local paired probe also runs the
actual retained compiled tools to generate submissions for empty, full large
Unicode, divergent-base, retained-attempt and recovery cases; fixture notes are
synthetic and are not native model reviews. Its genuine submission reports complete 13/13-page coverage of the 95,938-byte
Git-bound diff; the retained artifact records one completed invocation without
corrective recovery. The final-boundary local probe independently reconstructs
that Git input and accepts the exact unchanged native submission through the new
shared verifier. That retrospective fixture does not qualify a successor head.
The 54 workflow tests include the original 47, six final-boundary tests and one
fresh UTF-8 admission test. Negative execution cases mutate input,
manifest, receipt or context after the first guard and refuse absent, mismatched
or incomplete submission metadata before the publisher boundary.
The shared verifier also decodes the authoritative Git diff with fatal UTF-8
validation before writing the initial proof or allowing model execution. A real
Git text diff containing an invalid byte is refused at that boundary; the final
coverage check reuses the decoded text for its UTF-16 ranges. Valid Unicode,
empty input, recovery and retained-producer cases remain covered by the suite.

This repairs missing final transport validation. The inspected read-only tool
profile does not establish a reachable model-write exploit: the agent denies
edits and arbitrary Bash, and the fixed review tools write only review artifacts.
The literal producer marker
`[eta-mu review] diff truncated at 300000 bytes (was 400000).`
matches the immutable Muse domain marker and is refused as truncated input;
there is no producer/domain marker mismatch. The retained dc4 artifact records
a completed tool submission at that head and still predates this final boundary.
Earlier cancelled or incomplete attempts do not demonstrate completed full
review. This successor
requires parent publication and native qualification before held callers select
it; local probes do not qualify the pair or authorize production activation.

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
fail-closed behavior. A reusable call from `push`, `merge_group`, or any other
event without a pull-request payload is a caller contract failure, not an
unsupported pull request, and the terminal gate fails closed.

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
- shell commands are denied except the exact no-op `true`, which keeps the Bash tool registered for anonymous free-tier requests;
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

The reviewer runs `opencode/mimo-v2.6-flash-free` over OpenCode's anonymous public-provider path, so no `OPENCODE_API_KEY` secret is required — when no OpenCode credential is connected, OpenCode supplies the public credential and disables only models with a non-zero input cost. Inline review comments are mirrored to Discord by the workflow's final notification step.

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


### One fresh process after the known final submit-JSON transport diagnostic

The trusted supervisor may consume its sole remaining attempt when the stopped
first process exits zero, writes no submission, and emits exactly one final
completed `invalid` tool event requesting the exposed `review_submit` name with
the retained unterminated-string JSON parsing diagnostic. This is transport
failure before an actual review-submit executor call; it grants no same-process
repair or acceptance. Unknown diagnostics, actual failed review calls, later or
multiple invalid calls, malformed HOST history and changed evidence remain
terminal. The recorded failure alone is not retry authority.

The original whole trace and its canonical `unavailable-host-tool` refusal stay
unchanged. A separately retained DERIVED projection omits only that recognized
raw event line, keeping every other byte and the actual terminal stop. The same
unchanged Muse callback must return exactly `missing-review-submit` /
`healthy-unfinished-review`, with no violations or accepted invocation, before
the caller may start one fresh process over the complete unchanged input.
Projection custody records hashes and the omitted line; it is retry-eligibility
evidence, never an accepted review, stage/coverage proof or native approval.

The second whole invocation still needs the unchanged canonical verifier and
all SOURCE, HOST, LAST, five-stage, input, submission and final publication
guards. All recovery causes share MAX2; a second failure cannot start a third
process. No tool alias, executor, permissions, metadata, credential or token
ordering changes are made. Local tests prepare source; fresh native
qualification and parent publication remain separate.


### Final unassessed input-page recovery

The host adapter may admit one fresh whole process only for the exact terminal adversarial-validation refusal when all full-input pages were read and only the final page was not assessed. The original stopped invocation, complete bytes and canonical stage-order refusal remain failed. A separate retained DERIVED projection omits only that refused final call; the unchanged pinned Muse callback must return healthy-unfinished-review with null acceptance and no violations. This is retry eligibility only. Earlier/unknown failures, later calls, changed input or custody, a submission, contradictory projection and a second failure do not authorize another process. Every recovery cause shares MAX2; a healthy accepted review runs once. The fresh process must independently satisfy all existing input/SOURCE/HOST/LAST/five-stage/submission/publication guards. This is unpublished local preparation; no native approval, source adoption or original-review acceptance is supplied.
