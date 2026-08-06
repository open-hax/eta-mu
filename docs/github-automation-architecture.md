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

**Triggers**: PR activity, review submission, review comment creation
**Inputs**:
- `pr`: pull request number
- `strict`: when true, blocks on any unresolved thread (default: true)

**Logic**: Fetches all review threads via GraphQL. In strict mode, it fails if any thread is unresolved.

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

**Triggers**: Non-draft, same-repository pull requests opened, updated, reopened, or marked ready.

**Logic**:
1. Run deterministic dependency, lint, test, and build gates and serialize their exit codes and logs.
2. Check out pinned revisions of `octave-commons/muse` and `riatzukiza/.agents`.
3. Use Muse to compile a review-only OpenCode projection containing observer tools over existing Muse, phase, actor, task, and agent state.
4. Package the compiled tools, source revisions, checksums, and external skill inventory into a review-context artifact.
5. Mount the `.agents` checkout at `~/.agents`, OpenCode's external skill discovery root.
6. Invoke one read-only OpenCode primary agent.
7. Map changed contracts and risk zones.
8. Generate candidate defects and test gaps.
9. Attempt to disprove every candidate.
10. Publish only confirmed changed-line defects meeting the evidence threshold.
11. Keep uncertain questions and test gaps in a non-blocking summary.

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
Creates PRs for branches without existing PRs to the base branch.

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

### `review-resolution-gate.yml`
```yaml
on:
  pull_request: [types: [opened, reopened, synchronize, edited, ready_for_review]]
  pull_request_review: [types: [submitted, dismissed]]
  pull_request_review_comment: [types: [created]]
jobs:
  review-gate:
    uses: open-hax/eta-mu/.github/workflows/review-resolution-gate.yml@main
    with:
      pr: ${{ github.event.pull_request.number }}
      strict: true
    secrets: inherit
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
For the review gate to block merges, branch protection rules must require the `review-resolution-gate` check to pass before merging.

## Testing

All core logic in `packages/eta-mu-github` has tests:
- `tests/review-gate.test.ts` (4 tests)
- `tests/ensure-pr.test.ts` (3 tests)
- `tests/github.test.ts` (6 tests)
- `tests/event-classifier.test.ts` (3 tests)
- `tests/runtime-batch.test.ts` (3 tests)

Total: 19 tests, all passing.
