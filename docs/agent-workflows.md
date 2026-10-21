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

`.github/workflows/opencode-code-review.yml` reviews non-draft, same-repository pull requests with the project-local `github-reviewer` OpenCode agent and a freshly discovered, active, tool-capable, zero-cost MiMo Flash model from OpenCode's anonymous public provider.

### Anonymous producer interface and caller migration

The candidate in [eta-mu #361](https://github.com/open-hax/eta-mu/pull/361)
removes all `workflow_call.secrets` declarations and all App/Discord credential
custody from the ordinary producer. It retains full-input verification,
bounded recovery, raw evidence and final read-only envelope/location checks.
The existing [2-point producer card](../kanban/tasks/produce-anonymous-review-evidence-without-publication-credentials-c7d20dbb.md)
is followed by the separate [5-point trusted publisher](../kanban/tasks/independently-admit-and-publish-review-evidence-from-trusted-default-code-1c707551.md)
and [3-point hosted proof](../kanban/epics/prove-reusable-review-gate-red-path-in-a-fixture-caller.md); this producer change does not complete
either successor or activate a target. Those successors remain held.

Read-only source recovery on October 21, 2026 found these two existing callers.
Both currently use older callees that still declare every forwarded name, so
these observations establish a future migration requirement, not a current
caller failure or exhaustive constellation enrollment inventory.

| Caller source (`.github/workflows/eta-mu-review.yml`) | Current eta-mu pin | Forwarded names to remove before advancing to the producer interface |
| --- | --- | --- |
| [Services at `48c9cc252341d49b7d0e3b5ed20b774ca66e55d4`](https://github.com/open-hax/services/blob/48c9cc252341d49b7d0e3b5ed20b774ca66e55d4/.github/workflows/eta-mu-review.yml) | `4eaa34d18b5e07d9f26f0ebe4d20cf7e65ef9a41` | `ETA_MU_APP_ID`, `ETA_MU_APP_PRIVATE_KEY` |
| [Uxx at `a31cbbc96a6f46a659e1a522d1e7579e440d4387`](https://github.com/open-hax/uxx/blob/a31cbbc96a6f46a659e1a522d1e7579e440d4387/.github/workflows/eta-mu-review.yml) | `d98ab446d56ddfd24542df49b102b851f2a767fa` | `ETA_MU_APP_ID`, `ETA_MU_APP_PRIVATE_KEY`, `DISCORD_REVIEW_WEBHOOK_URL` |

Before a caller advances, recover its then-current source and remove **all**
producer secret mappings in the same reviewed change that selects an accepted
immutable revision. Do not substitute `secrets: inherit` or move credentials
into candidate command inputs/environment. Preserve the caller's other inputs,
read-only execution boundary and immutable event-head binding. Validate the
caller against the selected callee's actual interface; an undeclared secret
mapping is invalid even if that secret would be empty on a fork event.

Pin advancement, required-check adoption, trusted publication and deployment
remain held pending the existing publisher/hosted-proof and per-target setup
owners. Qualification must bind current head, base and tested merge candidate;
an unsupported fork-event producer success proves no inference, publication or
required-review result. This document changes neither caller nor pin.

Direct pull requests and reusable callers default to a 120-minute review job.
Reusable callers may set numeric `review_timeout_minutes` to a whole number from
60 through 180 to select a budget for a complete diff. The job timeout is
bounded to that range, and its first step rejects an invalid raw request before
checkout or reviewer setup. An absent inputs context or timeout property selects
120; an explicitly supplied null, zero or fractional timeout is invalid. Reusable
caller input is honored even when the caller's event is `pull_request`.
This budget includes setup and both possible model
invocations; a timeout never establishes review completion or authorizes partial
scope publication. The deterministic evidence, context compilation and terminal
gate budgets remain 60, 45 and 5 minutes respectively.

The ordinary Linux review reserves 30 minutes of that job budget for setup,
bounded process cleanup, verification and evidence retention, and divides
the remainder equally between the existing two possible invocations. The
validated first step derives the host-owned `REVIEW_ATTEMPT_TIMEOUT_MS` output:
15 minutes per attempt for a 60-minute job, 45 for the default 120-minute job,
and 75 for a 180-minute job. Each invocation owns a private process group. At
its wall deadline the supervisor requests TERM, escalates after two seconds
when needed, and allows at most five seconds for cleanup and capture drain.
Partial response, stderr, actual exit/signal and deadline metadata remain
inspectable; expiry is a failed lifecycle, never a completed passing review.
Only a first expiry with complete cleanup, closed captures, no submission and
the unchanged canonical `healthy-unfinished-review` / `missing-review-submit`
verdict may consume the existing sole corrective invocation. A HOST failure
(including the denied bash in the original PR30 trace), provider/quota error,
unfinished or unknown trace, present/malformed submission, cleanup failure or
second expiry remains terminal. These controls do not change assessment-route
budgets, canonical Muse law or the shared maximum of two invocations. Updating
ETA main cannot alter a consumer's immutable workflow pin; caller adoption
still requires its own qualified source update and fresh native evidence.

The workflow has three bounded stages:

1. **Deterministic evidence** — install from the committed lockfile, then run the repository lint, test, and build gates. Exit codes and logs are serialized under `.opencode/review-evidence/`. A failed environment or dependency install is evidence about the run, not automatically evidence of a code defect.
2. **Review-context compilation** — check out pinned revisions of `octave-commons/muse` and `riatzukiza/.agents`. Muse compiles a review-specific OpenCode projection containing only observer tools; the `.agents` repository is packaged as the global skill source. Both revisions and the skill inventory are recorded in the context artifact.
3. **Model review with bounded recovery** — map the change, reconstruct relevant contracts and invariants, generate candidate findings, attempt to disprove each candidate, and retain only findings that survive the evidence threshold in the tool-written submission. A completed first invocation that leaves a missing `review_submit` artifact receives exactly one corrective model invocation. An invocation that exits 1 without a submission after the host invalid-tool doom-loop rejection, with two distinct completed unavailable-review-tool events followed by the terminal session error can use that same corrective invocation. Structured OpenCode JSON events must bind the calls and terminal permission error to one session, and the corrected `review_` name must exist in the checksummed staged registry. A quoted tool error, an unknown tool mapping, mixed sessions, malformed events, provider quota/authentication failure, spawn rejection, or a failed invocation with any submission does not authorize recovery. The recovery starts the state machine again and must finish with a real tool-written submission; it never synthesizes a review from free-form output. A malformed submission does not consume the recovery attempt, and malformed or repeatedly missing submissions fail closed before final evidence retention.

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
verification command again, before final schema and changed-line validation
and evidence retention. The ordinary producer neither mints an App token nor
publishes a GitHub review. The first verification exports its receipt SHA-256 as a step
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
exact submitted bytes in runner-temporary storage; the read-only final
validators and retained evidence consume that copy. The supervisor exports a trusted step digest of
the selected attempt binding after the child closes. The final Git check binds
that digest to the retained response, submission, compiled verifier and prepared
context bytes, then repeats the same canonical Muse verification and compares
the complete verdict before freezing the submission. The child does not receive
the supervisor's `GITHUB_OUTPUT` path.

`submission-verification.json` records the input,
context and submission digests. It does not add missing model metadata, decide
the review event, implement Muse's review state machine or prove cognitive
review quality. The producer reuses Muse's pure envelope and actual changed-line
validators without invoking its publication adapter. The compiled machinery
filename `publish-opencode-review.cjs` and model tool stage `publish` do not
imply a GitHub publication effect.

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

The candidate ordinary workflow terminates with **OpenCode producer evidence**.
It runs under `always()` and fails closed for supported events unless
deterministic execution, context compilation and anonymous evidence production
all succeeded. This check supplies no trusted publication or required-review
qualification. Callers still requiring **OpenCode evidence review gate** must
retain their merge hold until the separate trusted publisher and hosted proof
are accepted; a renamed producer success cannot satisfy that requirement.

Workflow execution receipts use the existing Receipt River package API,
`eta-mu.receipt-river.api/build-event`, and its package-owned payload builder.
Validate each prospective line with `validate-line` before appending. The local
law requires repository identity (`:repo`) and UTC timestamps ending in `Z`;
the generic flat template alone does not satisfy this repository's law. New
records use the existing versioned `:receipt-river/receipt-recorded` envelope.
Preserve historical bytes. Current-time `:adjudication` records may identify
an old invalid line and its source/hash, but establish no automatic supersession,
retroactive validity or approval of its execution claims. Keep whole-history
validation failures visible and distinguish them from a valid newly appended
suffix. Never weaken the validator to make old evidence pass.

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
The ordinary producer has no private-repository mirror or App credential setup.
Its deterministic commands run with read-only permissions and no signing or
deployment secrets. A dependency that is unavailable anonymously remains an
explicit failed deterministic gate; it is not replaced with a privileged fetch.

For draft or fork pull requests, the producer terminal job runs and reports the
review as explicitly not applicable. Those events are outside the workflow's
supported review boundary, so their intentionally skipped prerequisites yield
a producer-only success. That success supplies no required-review qualification. Eligible non-draft, same-repository runs retain the
fail-closed behavior. A reusable call from `push`, `merge_group`, or any other
event without a pull-request payload is a caller contract failure, not an
unsupported pull request, and the terminal gate fails closed.

Deterministic command failures do not suppress their evidence or the review
attempt. The command step records every exit, the summary reports
`result: failure`, and artifacts are uploaded; the model may still inspect that
failure. The producer terminal check is what makes a supported reusable caller red. This split is
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
- the ordinary producer has read-only GitHub permissions and no publication credentials.

A reportable inline finding must:

- be introduced or exposed by changed code;
- attach to a changed line;
- identify supporting repository context;
- provide an independently plausible failure trace;
- survive adversarial validation;
- be marked confirmed with confidence of at least `0.85`.

Test gaps and unresolved questions belong in one concise non-blocking summary. If no candidate survives validation, the agent leaves a short passing summary instead of inventing comments.

The reviewer uses OpenCode's anonymous public-provider path, so no `OPENCODE_API_KEY` secret is required. The installed CLI version, raw public catalog fetched from `https://models.opencode.ai/api.json` over bounded HTTPS, and verbose CLI catalog run against the same file via `OPENCODE_MODELS_PATH` with `OPENCODE_DISABLE_MODELS_FETCH=true` are retained before review. The run is refused if the effective CLI selection differs from the raw-catalog selection. Empty `model` input selects the unique latest eligible MiMo Flash release/version; an exact caller-selected ID must also be present, active, tool-capable and wholly zero-cost in that catalog. Version, catalog or selection failures stop before inference, and the same selected ID/proof digest binds both allowed review attempts and final evidence checks. Catalog eligibility is distinct from provider health: inference failures still fail the producer terminal check. The ordinary producer has no GitHub publication or Discord notification step; the separate GitHub-event visibility workflow above retains its own scope.

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

The host adapter may admit one fresh whole process only for the exact terminal deterministic-stage refusal before any successful stage, when all full-input pages were read and only the final page was not assessed. The original stopped invocation, complete bytes and canonical stage-order refusal remain failed. A separate retained DERIVED projection omits only that refused final call; the unchanged pinned Muse callback must return healthy-unfinished-review with null acceptance and no violations. This is retry eligibility only. Earlier/unknown failures, later calls, changed input or custody, a submission, contradictory projection and a second failure do not authorize another process. Every recovery cause shares MAX2; a healthy accepted review runs once. The fresh process must independently satisfy all existing input/SOURCE/HOST/LAST/five-stage/submission/publication guards. This is unpublished local preparation; no native approval, source adoption or original-review acceptance is supplied.

## Native actionability assessment source preparation

`opencode-actionability-assessment.yml` is a separate three-job route: collect
complete native context and immutable changed source, assess the fixed full input
with Muse, then publish one canonical issue comment in the protected
`actionability-publication` environment. It supports `workflow_call` and direct
`workflow_dispatch` through the same implementation. Direct use requires the
fresh protected eta default branch; a called workflow must match its actual
native run reference and an ancestor of that protected branch. The required
`workflow_call` input `eta_revision` identifies a called route; a manually
dispatched caller retains that route even though GitHub supplies its
`workflow_dispatch` event to the called workflow. Bootstrap and the host use the
same input signal. Host run/caller coordinates remain separate from target
repository/PR/thread coordinates.

The actionability route accepts public `open-hax/*` target repositories and the
additional exact public `riatzukiza/knoxx` repository: database ID `1401249297`,
node ID `R_kgDOU4VeEQ`. Other personal repositories are not admitted. The separate
rejection route remains limited to public `open-hax/*` targets.
Every job reads native repository metadata before checkout and requires the exact
configured repository name/database ID, `visibility: public` and `private: false`;
actionability also checks the retained node ID for the additional personal fork.
Unknown, private, internal or contradictory metadata refuses before target source
or App credentials are made available. No cross-repository private read credential
is provided. After protected-source and public-target preflight, prepare and assess
mint separate App installation tokens for exactly the selected target with only
Metadata, pull-request and issue read grants. Native target context and author
permission checks use these tokens; owning-workflow run/provenance reads retain
`github.token` through `HOST_RUN_READ_TOKEN`. Unavailable target installation or
read grants fail closed. The separate publication token remains scoped to the
selected target; model input and its process environment remain credential-free.

Start a fresh workflow run for this route. Whole-job and failed-job reruns are
refused by every job before native reads, checkout, artifact downloads or App
token creation. Input, profile and result artifact names bind the run ID and
attempt; publication also requires successful prepare and assess jobs in that
same actual attempt. Reusing older-attempt jobs is unsupported. This does not
change the bounded corrective model invocations within one fresh run.

The actionability workflow and host source lock pin canonical
`8497afdd329c3dcaefb78eec36d8e629a59d9eb2` and Muse
`45c7a8d572bf44202f52cae2aa8c0f771736a617`. The unchanged rejection workflow and
host retain canonical `5cea3e51a15d19277bd642147292c11b82de5369` and Muse
`b7e4f98f550780a7b484b1525f53ad2934e29dad`. Pins alone grant no execution or
publication authority: the eta successor must receive protected review/merge,
and actual checkout, complete applicable history and native provenance guards
still apply. Local controls use inert transport and supply no native assessment,
review, merge or production credit.

Effective App installation and read/publication grants remain unproven by this
source qualification. Live use still requires those grants and a fresh,
independently admitted native assessment after protected ETA adoption.

The Node-adjacent host uses NBB1.5.211, canonical collector/permission/history/law
namespaces and the actual selected source-built Muse CJS verifier. It does not
import operational `pr.cljs`, implement another protocol parser, or grant
eligibility from supplied booleans. Canonical `native-context-law/select-fresh-context`
owns the structural fresh snapshot and exact target selection. The host invokes
canonical classification separately; structural selection grants no admission.
Every non-added preimage (removed, modified, type-changed, and the source path
of renamed or copied files) is read from the unique merge base of the exact
native head and base commits, with that preimage commit and its byte hashes
retained in the source manifest. Above GitHub's 3,000-file API cap, the changed
inventory comes from an immutable merge-base Git diff. Missing or ambiguous ancestry refuses rather than substituting
the advancing base tip. NBB asynchronous orchestration uses a single
awaited body and explicit awaited recursive function boundaries; an asynchronous
`doseq` or `loop` must not be treated as completed sequential work.

The complete protected canonical receipt text is hashed and decoded by the
canonical history reader. This is a scoped source binding, not proof that the
checkout contains all private/local observations used by another CLI. Enabling
this route requires explicit qualification of the whole applicable authoritative
history source and its custody. Missing or invalid history refuses; there is no
healthy-empty fallback. Complete native records, original bodies/hunks, source
bytes, proposal/body digests and every page remain in the model input.

Protected host token-minting steps receive the existing App secrets; prepare and
assess request read-only tokens, while only the separate publisher requests issue
write access. Its built-in RSA boundary signs an ephemeral AppJWT, reads actual
App and installation metadata, checks the actual issue-write grant, installation
outputs and token repository access, then passes the native Bot tuple to canonical
identity admission. A label, `/user` assumption or requested grant does not
authenticate the principal. JWT, private key and token never enter the model
environment or output artifacts.

The native `gh` reader directs complete stdout to an exclusively created file in
an owned private temporary directory, so paginated API responses are not cut off
by a 16 MiB process capture buffer. Paginated reads have a 120-second whole-read
budget and other reads keep 15 seconds; a genuine timeout refuses as
`native-read-timeout` before status or JSON parsing. It keeps the HTTP/JSON
refusal behavior, buffers only stderr, and closes/removes its temporary
resources on success or failure. Canonical input byte/page limits still apply;
this does not guarantee arbitrary input fits available memory or disk.

The model receives a fresh private HOME/XDG tree and an explicit environment
allowlist, without host credentials or GitHub output channels. This is a bounded
host boundary, not a kernel sandbox. Protected job outputs bind input, profile,
verifier and accepted invocation bytes outside the child. Publication rechecks
fresh native context, source, permissions, proposal, history and run/job provenance.

There is at most one issue-comment write intent, with redirects disabled and no
application retry. A transport timeout or HTTP 5xx response triggers complete
paginated readback because a server failure can follow a committed write;
zero, multiple or mismatched records remain uncertain. An existing exact record
is verified with its native GET and canonical disposition instead of duplicated.
The actionability host retains the actual one-shot outcome, HTTP status and native
POST response coordinates even if later recollection or GET fails. It writes an
unestablished terminal result before exiting unsuccessfully, and the workflow
uploads that result with `always()`. Pre-write refusal records say no intent was
attempted; the workflow's startup fallback says the effect is unknown if the host
cannot produce a terminal result. Neither failure record supplies admission or
permission to retry the write.
The actual record's ID, principal, creation/edit times and current context determine
admission. A context race can invalidate a comment; GitHub supplies no context
compare-and-swap. The route never posts an ordinary pull review, replies inline,
resolves a conversation, merges, writes a ledger, or enables deployment. Unresolved
informational context remains unsettled and all-thread merge-blocking.

Final-page recovery uses the same fixed full-input file selected for canonical
context preparation: `actionability-input.txt` for this route and `basehead.diff`
for ordinary review. It rechecks those exact bytes and the original manifest; a
legacy diff cannot replace the native carrier. A failed original trace remains
refused, and only a separately checked projection can authorize the existing
sole fresh complete invocation.


The local assessment test preload resolves stable executable aliases using the
captured child PATH/cwd and physical Node executable identity. It retains the
original native command/argv and options validation. A single guard in
NODE_OPTIONS precedes CLI requires; without it the first CLI require must be
the guard. A preceding unknown require refuses before dispatch. TCP listeners
through net.Server.prototype.listen, including HTTP/HTTPS and ESM Server views,
are denied before binding. These are bounded Linux Node public-API controls,
not an OS sandbox or a guarantee against changed executable files, alternate
runtimes or arbitrary launchers. The inert non-Node controls require executable
Python 3 at /usr/bin/python3; the registered driver checks it before controls.


### Separate positive-cohort assessment (source qualification pending)

The proposed `opencode-positive-cohort-assessment.yml` adapter consumes the
canonical positive Bot-thread cohort contract at merged revision
`b23845012508fd598a56dea34d6be38ede5c7136` and Muse full-input transport at
merged revision `b9e47da4f445106310c7b9dc98fe3a3ef9ea50d5`. These immutable
dependency pins do not adopt this adapter or establish a live assessment. The
called eta-mu workflow retains its existing protected-source authentication;
no Muse GitHub branch-protection requirement is added by private author wording.

Prepare, assess and publish retain complete all-thread/issue/review/source/test
and history input. Accepted anonymous dynamic OpenCode MiMo inference does not
itself publish or qualify a judgment. Only the canonical accepted-summary API,
authentic distinct native App grants and an exact sole issue-comment append
and readback can supply the cohort assessment record. The adapter never replies,
resolves, approves or merges. Unknown or mixed members, edits, lost history,
same-App model aliases and uncertain effects remain refused, with no write retry.
The existing registered assessment and lint gates own qualification.

This source composition preserves the current reviewed pagination, cancellation,
ordinary verifier and Node boundary repairs. The new purpose is a fixed literal
enrollment in the current runner, whose workflow mirror is rebuilt from its
exact bytes; the new inert fixture binds the current preload digest. Normal
source-built Muse and canonical controls, actual native App custody and fresh
complete invocation evidence remain required before live use. Historical source
preparations, failed controls and author-only results remain retained.
