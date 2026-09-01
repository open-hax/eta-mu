# eta-mu GitOps controller

`@eta-mu/gitops-controller` admits five deterministic GitHub commands:

- applying the exact `eta-mu:review` label to an open, non-draft pull request
  dispatches the configured evidence-first review workflow;
- creating an inline review comment, submitting or dismissing a review, or
  resolving or unresolving a review thread dispatches the separately configured
  strict review-resolution gate so the exact test-merge required check can be
  recomputed;
- opening, reopening, synchronizing, marking ready, or retargeting the base of
  a pull request creates a fresh pending gate on the current test-merge commit
  without dispatching a workflow or model;
- applying the exact `eta-mu:probe` label produces a durable terminal ingress
  receipt and no GitHub, Git, Rheos, Sol, outbox, or workflow-dispatch effect.
- a signed `workflow_run:completed` event from one of the two configured
  controller-dispatched workflow IDs reconciles the exact controller-owned
  gate Check Run correlated to that run ID.

The controller verifies the webhook's raw bytes before decoding JSON, persists
an idempotent delivery receipt, re-fetches the pull request and repository,
authorizes the sender, and binds the exact default-base/head/test-merge tuple
after GitHub reports the pull request mergeable. Label commands must still
be present on the live pull request. Effecting commands dispatch only workflow
files from the repository's current default branch. A pull request's target
branch never selects executable workflow code.

The review workflow intentionally has no native `pull_request` trigger. In a
consumer repository, its thin wrapper must live on the protected default branch,
accept only `pr_number`, `pr_base_sha`, `pr_head_sha`, `pr_merge_sha`, and
`command_id`, and forward them to eta-mu's reusable workflow. The separate gate
wrapper accepts those inputs plus
`gate_check_id`, `evidence_run_id`, and `evidence_command_id`. Each repository
must define administrator-owned Actions variables for the exact controller App
login and slug, review-publication App login, numeric review workflow ID, and
exact review workflow `path@default-ref`. The resolver requires both the
inherited actor and triggering actor to equal the controller App login. This
leaves the signed webhook controller
as the only review-admission path; opening or updating a pull request, manually
dispatching the workflow, or manually rerunning it cannot mint publication
credentials or start a model review. The controller App must remain distinct
from the review-publication App.

Production activation is explicit. `observe-only` mode (the fail-closed
default) performs and records the complete plan but cannot call the workflow
dispatch endpoint. `review-dispatch` is the only mode with that effect.
Each admitted command carries the mode and a deterministic policy revision;
replay requires the same revision plus the current repository, installation,
label, and workflow policy, so a restart cannot promote observe-only evidence.

Services owns a second, dynamically read effect lease. Immediately before an
external call and again before the durable dispatch claim, a `review-dispatch`
worker must observe an active marker containing exactly its deployment ID, or
the command's delivery GUID must be in the deployment's exact canary set. A
missing, malformed, unreadable, or differently named marker leaves the command
pending with no outbox or completion. Marker changes take effect without a
restart, so atomic activation grants the lease and rollback revokes it. The
marker directory, not the marker file inode, must be mounted read-only into the
container so Services' atomic replacement remains visible. `eta-mu:probe`
always terminates effect-free and does not depend on this lease.

The controller does not run a model, mutate canonical Rheos state, edit labels,
or bypass branch protection. The existing evidence-first Actions workflow owns
review execution and publication. The target gate workflow is read-only: it
polls the exact durably correlated evidence run, verifies an exact-head review
from the protected publication App, and evaluates unresolved threads. Only the
controller App creates and terminally updates `eta-mu-review-gate`.

## Discovery and boundary decisions

- The repository already owns a reusable exact-revision review workflow. Dispatching
  that workflow preserves one review implementation instead of introducing a
  second agent path.
- Axxium is not in the deployed desired state yet. `infra.authority/github-port`
  implements the Axxium-shaped `authorize!` port using GitHub's current
  repository permission response and binds that response back to the webhook
  sender's numeric actor ID for review-label and probe commands. Review
  lifecycle events instead authorize only the bounded defensive gate-recompute
  capability from their already verified GitHub signature and allowlisted
  installation/repository provenance. This lets non-collaborator review bots
  invalidate a stale gate without granting them model-review authority.
- GitHub workflow dispatch does not offer an idempotency key. The controller
  writes a durable dispatch intent before the external call. If the process
  loses the response, the command is held as uncertain instead of risking a
  second review run. Uncertain intent recovery runs once, before the worker is
  marked ready; periodic replay cannot race a live dispatch. The deterministic
  `command_id` remains available to the workflow and receipts for operator
  reconciliation. Dispatch requests set `return_run_details: true`; the exact
  returned run ID and URLs are persisted before any secondary GitHub read.
  A legacy `204` or transport-ambiguous response is held fail-closed.

## HTTP surface

| Route | Purpose |
| --- | --- |
| `POST /hooks/eta-mu/github` | Signed, bounded GitHub webhook admission |
| `GET /health/live` | Process liveness only |
| `GET /health/ready` | Deterministic state/worker readiness; no network probe |
| `GET /health/dependencies` | Last observed GitHub dependency state |

Only `pull_request:labeled` with exact `eta-mu:review` or `eta-mu:probe`,
defensive `pull_request:opened|reopened|synchronize|ready_for_review` and
base-changing `pull_request:edited`,
`pull_request_review:submitted|dismissed`,
`pull_request_review_comment:created`, and
`pull_request_review_thread:resolved|unresolved`, plus trusted completion events
for the configured review and gate workflow IDs, are admitted. Repository and
installation allowlists are both mandatory. Other labels, including the
reserved `deploy` label, have no meaning to this application.

## Configuration

| Variable | Required | Meaning |
| --- | --- | --- |
| `ETA_MU_CONTROLLER_MODE` | no | `observe-only` (default) or `review-dispatch` |
| `ETA_MU_CONTROLLER_DEPLOYMENT_ID` | yes | Services deployment identity in exact positive `run-id-attempt` form |
| `ETA_MU_CONTROLLER_ACTIVE_MARKER_FILE` | yes | Absolute path to Services' read-only `.active-release` marker; exact bytes are `<deployment-id>\n` |
| `ETA_MU_CONTROLLER_CANARY_DELIVERY_IDS` | no | Comma-separated exact GitHub delivery GUIDs allowed to effect before activation |
| `ETA_MU_GITHUB_APP_ID` | yes | Numeric GitHub App ID |
| `ETA_MU_GITHUB_APP_PRIVATE_KEY_FILE` | preferred | Mounted RSA private-key PEM path; parsed before listen |
| `ETA_MU_GITHUB_APP_PRIVATE_KEY` | fallback | Inline RSA private-key PEM when a file mount is unavailable |
| `ETA_MU_GITHUB_WEBHOOK_SECRET_FILE` | preferred | Mounted webhook secret path; trimmed value must contain at least 32 characters |
| `ETA_MU_GITHUB_WEBHOOK_SECRET` | fallback | Inline nonblank webhook secret of at least 32 characters |
| `ETA_MU_GITHUB_INSTALLATION_ALLOWLIST` | yes | Comma-separated numeric installation IDs |
| `ETA_MU_GITHUB_REPOSITORY_ALLOWLIST` | yes | Exactly one `owner/repository` in the canary slice; workflow IDs are repository-scoped |
| `ETA_MU_CONTROLLER_STATE_ROOT` | no | Durable root; defaults to `/srv/open-hax/state/eta-mu-controller` |
| `ETA_MU_CONTROLLER_HOST` | no | Listen host; defaults to `0.0.0.0` |
| `ETA_MU_CONTROLLER_PORT` | no | Listen port; defaults to `8790` |
| `ETA_MU_WEBHOOK_BODY_LIMIT_BYTES` | no | Raw body ceiling; defaults to 1 MiB |
| `ETA_MU_GITHUB_REVIEW_LABEL` | no | Must remain the first-slice command label `eta-mu:review` |
| `ETA_MU_GITHUB_PROBE_LABEL` | no | Must remain the effect-free proof label `eta-mu:probe` |
| `ETA_MU_GITHUB_REVIEW_WORKFLOW` | no | Workflow file; defaults to `opencode-code-review.yml` |
| `ETA_MU_GITHUB_GATE_WORKFLOW` | no | Distinct gate workflow file; defaults to `review-resolution-gate.yml` |
| `ETA_MU_GITHUB_REVIEW_WORKFLOW_ID` | yes | Numeric ID of the allowlisted repository's review wrapper |
| `ETA_MU_GITHUB_GATE_WORKFLOW_ID` | yes | Distinct numeric ID of the allowlisted repository's gate wrapper |
| `ETA_MU_CONTROLLER_APP_LOGIN` | yes | Exact controller App bot login, for example `eta-mu-controller[bot]` |
| `ETA_MU_REPLAY_INTERVAL_MS` | no | Pending-delivery replay interval; defaults to 5 seconds |

The controller runtime needs Pull requests (read), Actions (write), Checks
(write), Metadata (read), and the repository permission needed to read a
collaborator's effective permission. The production App additionally grants
Administration (read) solely so Services can prove that branch protection pins
the required check to this App before activation; neither component receives an
administration write permission.
Subscribe only to pull-request, pull-request-review,
pull-request-review-comment, pull-request-review-thread, and workflow-run events
and point the app webhook at `/hooks/eta-mu/github`. The target gate wrapper
grants its workflow token only Actions, Checks, Contents, and Pull requests
read. It receives no controller App private key and never creates or updates a
Check Run.

Branch protection must require the exact `eta-mu-review-gate` context and pin it
to the controller App integration ID where GitHub exposes source binding. The
similarly named Actions job and `eta-mu-opencode-evidence` are informational,
not lifecycle authority. The controller creates the required Check Run on
GitHub's current synthetic test-merge SHA, while review publication remains
bound to the pull-request head SHA. Its immutable identity is
`eta-mu-review-gate/v2:<delivery>:<pr>:<head>:<base>:<merge>`.

The state root contains immutable `deliveries`, `outbox`, `gate-checks`,
`dispatch-calls`, `workflow-runs`, `gate-terminal-intents`, and `dispatches`
projections plus append-only NDJSON ledgers. Immutable files are published by durable,
same-directory, atomic no-replace operations. Startup reconciles a missing
projection or ledger append and refuses conflicting evidence; readiness stays
false until that recovery and writable probes for every state partition pass.
Stored records contain normalized command metadata; raw webhook bodies,
authorization headers, app tokens, and secrets are never persisted or logged.
Admission receipts use `webhook-admitted`. Every terminal command uses
`review-command-completed` under `dispatches/<delivery-guid>.json`; effecting
commands also use the corresponding staged projections. Results carry a stable
`command/type` (`code-review`, `review-gate-reconcile`,
`review-gate-invalidate`, `review-gate-completion`, or `ingress-probe`). A
probe result has `outcome: probed`, its event/action/label/repository/PR/head/
command fields, and no workflow or run fields.

The file-backed store assumes exactly one production controller process per
state root. Its same-process writer and in-flight sets do not provide a
cross-process lock; Services must fence the deployment to one replica. Startup
repairs missing matching ledger/projection evidence before replay. It may
quarantine only a provably unterminated final NDJSON tail; complete-line or
mid-file corruption is fatal and readiness remains false.

Only same-repository pull requests are dispatched in the first release. Fork
pull requests are refused because the existing review workflow's trust boundary
does not yet admit an untrusted head repository. A successful dispatch records
GitHub's `workflow_run_id`, API run URL, and browser URL from the versioned
`2026-03-10` response contract. GitHub HTTP calls default to a 10-second timeout
and cannot exceed 30 seconds at the transport boundary; transport errors retain
only a bounded error code.

The first mutating rollout is intentionally limited to one repository because
GitHub workflow numeric IDs are repository-scoped. Multi-repository activation
requires a versioned per-repository workflow binding map rather than reusing
one global ID pair.

## Local gates

```sh
pnpm -C packages/gitops-controller test
pnpm -C packages/gitops-controller lint:kondo
pnpm -C packages/gitops-controller build
```
