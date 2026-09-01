# eta-mu GitHub Automation Architecture

## Overview

This document describes the centralized GitHub automation system owned by `open-hax/eta-mu` and consumed by all `open-hax/*` and `octave-commons/*` repositories.

## Philosophy

- **Centralized logic** lives in `open-hax/eta-mu` packages and reusable workflows
- **Consumer repos** get thin wrapper workflows (10-30 lines each)
- **All repos share** the same behavioral patterns: branch→PR→review→merge→release
- **Review comments block merge** until explicitly resolved by a human
- **Review truth comes from evidence and validation**, not raw model consensus
- **Compatibility projections do not acquire semantic authority** merely because the reviewer can call them

## Reusable Workflows (in `open-hax/eta-mu/.github/workflows/`)

### 1. `ensure-pr-to-staging.yml`
**Purpose**: Automatically create PRs from dangling branches to staging

**Triggers**: Schedule (30min), workflow_dispatch, create
**Inputs**:
- `base`: target branch (default: staging)
- `repo`: repository slug
- `branch-patterns`: comma-separated patterns (default: `fix/*,feat/*,chore/*,docs/*,refactor/*,test/*,perf/*`)

**Logic**: Lists branches matching patterns, filters out branches with existing PRs to base, and creates PRs with inferred titles from branch names.

### 2. `review-resolution-gate.yml`
**Purpose**: Block merge until all review comments are resolved

**Triggers**: A trusted default-branch `workflow_dispatch` produced by the
eta-mu controller after a signed review submitted/dismissed, inline review
comment created, or review thread resolved/unresolved webhook. The reusable
workflow's `workflow_call` surface is used only by the target repository's
pinned thin wrapper; it inherits `workflow_dispatch`, and every controller-bound
validation step is unconditional.
**Inputs**:
- `pr_number`, `pr_head_sha`, `pr_base_sha`, `pr_merge_sha`, and `command_id`:
  pull request, exact head/default-base/synthetic-merge tuple, and durable
  lifecycle-webhook command
- `gate_check_id`: exact pending Check Run created by the controller App
- `evidence_run_id` and `evidence_command_id`: exact durably correlated review
  workflow run and originating review command
- `strict`: when true, blocks on any unresolved thread (default: true)

**Logic**: Fetches all review threads via GraphQL. In strict mode, it fails if
any thread is unresolved. A webhook dispatch is always strict and first requires
both GitHub actor identities to equal the configured controller App, re-fetches
the open same-repository pull request at the admitted default-base/head/test-
merge tuple, and independently
polls the exact `evidence_run_id`, and validates its protected workflow numeric
ID, exact `path@default-ref`, attempt, repository, controller actor, and terminal
success. It also requires a current acceptable exact-head review from the
protected review-publication App before evaluating all unresolved threads.
The workflow has read-only Actions, Checks, Contents, and Pull requests
permissions. It never receives controller App credentials and never creates or
updates a Check Run. Its signed `workflow_run:completed` event is correlated
back to the durable dispatch by the controller, which alone terminally updates
the same `gate_check_id`; only a successful gate run can produce success.
The required Check Run is created on the synthetic merge SHA with immutable
external identity
`eta-mu-review-gate/v2:<delivery>:<pr>:<head>:<base>:<merge>`; review
publication remains bound to the PR head.

### 3. `auto-merge.yml`
**Purpose**: Enable GitHub auto-merge when checks pass

**Triggers**: PR opened/ready, check suite completed
**Inputs**:
- `pr`: pull request number
- `merge-method`: MERGE | SQUASH | REBASE (default: SQUASH)

**Logic**: Uses the GitHub GraphQL `enablePullRequestAutoMerge` mutation. It skips PRs that are not open or already have auto-merge enabled.

### 4. `release-and-publish.yml`
**Purpose**: Create a GitHub release and publish to npm on merge to main

**Triggers**: Called by a consumer on PR merge to main
**Inputs**:
- `pr`: merged pull request number
- `tag-prefix`: release tag prefix (default: `v`)
- `create-release`: boolean
- `publish-npm`: boolean (requires `NPM_TOKEN`)

**Logic**:
1. Detect changed packages using `detect-packages`.
2. Create a GitHub release with a timestamp-derived tag.
3. Optionally publish changed packages to npm.

### 5. `opencode-code-review.yml` reference implementation
**Purpose**: Produce a bounded, evidence-first pull-request review with OpenCode and `opencode/mimo-v2.5-free`.

**Triggers**: Trusted default-branch `workflow_dispatch` only, produced by the eta-mu GitOps controller after admission of a signed, allowlisted `pull_request:labeled` webhook carrying the exact `eta-mu:review` command. Consumer repositories use a default-branch dispatch wrapper and forward the controller's pull-request number, exact head SHA, exact default-base SHA, exact synthetic merge SHA, and durable command ID plus `controller_app_login: ${{ vars.ETA_MU_CONTROLLER_APP_LOGIN }}`. The called workflow validates that administrator-controlled value's exact `name[bot]` shape and requires both the inherited actor and triggering actor to match it; manual collaborator dispatches and human reruns fail closed. The controller App is separate from the review-publication App.

**Logic**:
1. Re-fetch the pull request and require it to remain open, same-repository, mergeable, and targeted at the repository's current default branch with the exact admitted head/base/merge tuple. Create an in-progress diagnostic `eta-mu-opencode-evidence` check on that synthetic merge commit, bound to the command ID, workflow run/attempt, pull-request number, and all three revisions.
2. Run the public webhook-controller deterministic scope without App credentials or private dependency bytes and serialize its exit codes and logs. The separate exact-head `Sol CI / verify` PR check is public-source lint only; private-dependency Sol test/build runs on trusted canonical pushes and remains an explicit pre-merge evidence gap.
3. Check out pinned revisions of `octave-commons/muse` and `riatzukiza/.agents`.
4. Use Muse to compile a review-only OpenCode projection containing observer tools over existing Muse, phase, actor, task, and agent state.
5. Package the compiled tools, source revisions, checksums, and external skill inventory into a review-context artifact.
6. Mount the `.agents` checkout at `~/.agents`, OpenCode's external skill discovery root.
7. Archive the pull-request tree as inert, read-only `source/` evidence in a fresh execution directory with no pull-request OpenCode configuration at its root.
8. Invoke one read-only OpenCode primary agent without GitHub App or publication credentials.
9. Map changed contracts and risk zones.
10. Generate candidate defects and test gaps.
11. Attempt to disprove every candidate.
12. Upload only a schema-bound submission, then verify and publish it from a fresh privileged job with no checkout or model workspace.
13. Publish only confirmed changed-line defects meeting the evidence threshold.
14. Finalize only the newest same-name check on the exact synthetic merge commit after listing with `filter: all`; a stale older success cannot satisfy a newer pending or failed command.
15. Keep uncertain questions and test gaps in a non-blocking summary.

The Muse projection intentionally omits write/network-capable multiplexed tools such as `receipt_river`, `edn_ledger`, `session_mycology`, and web search. It also omits actor/agent spawn, actor tell, task execution/control, and phase recording. Observer tools do not make Muse the owner of actor, event, policy, session, or workflow semantics.

The reviewer cannot edit files, execute shell commands, browse the web, or spawn subagents. Skills provide process and environment adaptation, but never count as defect evidence. This avoids same-model consensus theater and limits free-tier quota use. The workflow needs no OpenCode credential — `opencode/mimo-v2.5-free` uses the anonymous public-provider path — and disables public session sharing.

The initial pins are explicit inside the workflow so review runs are revision-bound:

- Muse: `76c57712a48ef48100259231a2e9d54069c2b14a`
- `.agents`: `7fd3252e7663ad5e68be5e90429d126aa66c38c8`

The first implementation is intentionally eta-mu-specific because its deterministic gates are pnpm workspace commands. Extract a reusable workflow only after the evidence schema, Muse projection, skill discovery, and publication behavior pass the canary PR; consumer repositories may require different deterministic gate commands.

## CLI Commands (in `packages/eta-mu-github`)

### `eta-mu review-gate --repo owner/repo --pr N [--strict]`
Checks for unresolved review threads. With `--strict`, it blocks on all unresolved threads regardless of actor.

### `eta-mu ensure-pr --repo owner/repo --base staging [--pattern fix/*] [--dry-run]`
Creates PRs only for matching branches that have commits ahead of the base and no
open PR. A closed or merged PR suppresses recreation while its recorded head SHA
still matches the branch. Only pull requests whose head repository is the target
repository participate in open or terminal suppression, so a same-named fork head
cannot hide a repository branch. Advancing the branch beyond its terminal head makes
it eligible again when the new head remains ahead of the base. Base-divergence
checks run inside the per-branch processing boundary: a branch with unrelated or
malformed history is reported as an error without preventing another eligible
branch from being projected.

### `eta-mu auto-merge --repo owner/repo --pr N [--merge-method SQUASH]`
Enables GitHub auto-merge via GraphQL API.

### `eta-mu detect-packages --base origin/main [--workspace-glob packages/*/]`
Detects which packages in a monorepo have changed files compared to the base branch.

### `eta-mu release --repo owner/repo --pr N [--tag-prefix v] [--create-release] [--publish-npm]`
Creates a GitHub release and optionally publishes to npm for a merged PR.

## Consumer Repo Wrappers

Each consumer repo gets three or four thin wrapper workflows:

### `ensure-pr-to-staging.yml`
```yaml
on:
  schedule: [cron: "*/30 * * * *"]
  workflow_dispatch:
  create:
jobs:
  ensure-pr:
    if: ${{ github.ref_type == 'branch' && !contains(fromJson('["staging","main","master","production","prod"]'), github.ref_name) || github.event_name != 'create' }}
    uses: open-hax/eta-mu/.github/workflows/ensure-pr-to-staging.yml@main
    with:
      base: staging
    secrets: inherit
```

### `opencode-code-review.yml`
```yaml
on:
  workflow_dispatch:
    inputs:
      pr_number:
        required: true
        type: number
      pr_head_sha:
        required: true
        type: string
      pr_base_sha:
        required: true
        type: string
      pr_merge_sha:
        required: true
        type: string
      command_id:
        required: true
        type: string
jobs:
  evidence-review:
    permissions:
      checks: write
      contents: read
      pull-requests: read
    uses: open-hax/eta-mu/.github/workflows/opencode-code-review.yml@<pinned-commit>
    with:
      controller_app_login: ${{ vars.ETA_MU_CONTROLLER_APP_LOGIN }}
      pr_number: ${{ inputs.pr_number }}
      pr_head_sha: ${{ inputs.pr_head_sha }}
      pr_base_sha: ${{ inputs.pr_base_sha }}
      pr_merge_sha: ${{ inputs.pr_merge_sha }}
      command_id: ${{ inputs.command_id }}
    secrets: inherit
```

### `review-resolution-gate.yml`
```yaml
on:
  workflow_dispatch:
    inputs:
      pr_number:
        required: true
        type: number
      pr_head_sha:
        required: true
        type: string
      pr_base_sha:
        required: true
        type: string
      pr_merge_sha:
        required: true
        type: string
      command_id:
        required: true
        type: string
      gate_check_id:
        required: true
        type: string
      evidence_run_id:
        required: true
        type: string
      evidence_command_id:
        required: true
        type: string
jobs:
  review-gate:
    permissions:
      actions: read
      checks: read
      contents: read
      pull-requests: read
    uses: open-hax/eta-mu/.github/workflows/review-resolution-gate.yml@<pinned-commit>
    with:
      pr_number: ${{ inputs.pr_number }}
      strict: true
      pr_head_sha: ${{ inputs.pr_head_sha }}
      pr_base_sha: ${{ inputs.pr_base_sha }}
      pr_merge_sha: ${{ inputs.pr_merge_sha }}
      command_id: ${{ inputs.command_id }}
      gate_check_id: ${{ inputs.gate_check_id }}
      evidence_run_id: ${{ inputs.evidence_run_id }}
      evidence_command_id: ${{ inputs.evidence_command_id }}
```

### `auto-merge.yml`
```yaml
on:
  pull_request: [types: [opened, ready_for_review]]
  check_suite: [types: [completed]]
jobs:
  auto-merge:
    if: ${{ github.event.pull_request.draft == false && github.event.pull_request.head.repo.full_name == github.repository }}
    uses: open-hax/eta-mu/.github/workflows/auto-merge.yml@main
    with:
      pr: ${{ github.event.pull_request.number }}
      merge-method: SQUASH
    secrets: inherit
```

## Rollout Status

All `open-hax/*` and `octave-commons/*` repos with existing `.github/workflows/` directories have received the three core wrapper workflows:

- axxium, commanoxx, daimoi, depenoxx, eros-eris-field, eros-eris-field-app
- eta-mu-sol, fork_tales, gates-of-aker, lineara_conversation_export, lyrical-engine
- openplanner, privaxxy, promethean, promethean-agent-system, proxx
- shibboleth, simulacron, uxx, vexx

## Remaining Work

### NPM Publishing
The `release` command has a `--publish-npm` flag but the actual per-package `npm publish` logic is not yet implemented. To complete:
1. Detect changed packages.
2. Bump each changed package's version.
3. Run `npm publish` or `pnpm publish` for each package.
4. Handle workspace dependencies and versioning strategy.

### Evidence-review rollout
Before adding thin wrappers to consumer repositories:
1. Run the eta-mu canary against its own review-agent PR.
2. Inspect the deterministic evidence artifact and verify environment failures are not misreported as code defects.
3. Inspect the review-context artifact and verify the pinned Muse and `.agents` revisions, skill inventory, and checksums.
4. Confirm the Muse profile exposes only the intended observer projection.
5. Confirm inline findings attach to changed lines and satisfy the finding contract.
6. Confirm a clean PR produces a short passing summary rather than synthetic criticism.
7. Parameterize deterministic commands for JVM-only, npm, pnpm, and mixed workspaces.

### Branch Protection
For the review gate to block merges, branch protection rules must require the
controller-App-owned `eta-mu-review-gate` check to pass before merging. No
generic GitHub Actions job check or evidence check is lifecycle authority. Pin
the required status check to the controller App's integration ID where the
ruleset or branch-protection API exposes that binding.

## Testing

All core logic in `packages/eta-mu-github` has tests:
- `tests/review-gate.test.ts` (4 tests)
- `tests/ensure-pr.test.ts` (3 tests)
- `tests/github.test.ts` (6 tests)
- `tests/event-classifier.test.ts` (3 tests)
- `tests/runtime-batch.test.ts` (3 tests)

Total: 19 tests, all passing.
