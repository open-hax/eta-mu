# eta-mu GitHub Automation Architecture

## Overview

This document describes the centralized GitHub automation system owned by `open-hax/eta-mu` and consumed by all `open-hax/*` and `octave-commons/*` repositories.

## Philosophy

- **Centralized logic** lives in `open-hax/eta-mu` packages and reusable workflows
- **Consumer repos** get thin wrapper workflows (10-30 lines each)
- **All repos share** the same behavioral patterns: branch→PR→review→merge→release
- **Review comments block merge** until explicitly resolved by a human

## Reusable Workflows (in `open-hax/eta-mu/.github/workflows/`)

### 1. `ensure-pr-to-staging.yml`
**Purpose**: Automatically create PRs from dangling branches to staging

**Triggers**: Schedule (30min), workflow_dispatch, create
**Inputs**:
- `base`: target branch (default: staging)
- `repo`: repository slug
- `branch-patterns`: comma-separated patterns (default: `fix/*,feat/*,chore/*,docs/*,refactor/*,test/*,perf/*`)

**Logic**: Lists branches matching patterns, filters out those with existing PRs to base, creates PRs with inferred titles from branch names.

### 2. `review-resolution-gate.yml`
**Purpose**: Block merge until ALL review comments are resolved

**Triggers**: PR activity, review submission, review comment creation
**Inputs**:
- `pr`: pull request number
- `strict`: when true, blocks on ANY unresolved thread (default: true)

**Logic**: Fetches all review threads via GraphQL. In strict mode, fails if ANY thread is unresolved. Previously only blocked on tracked actors (CodeRabbit, etc).

### 3. `auto-merge.yml`
**Purpose**: Enable GitHub auto-merge when checks pass

**Triggers**: PR opened/ready, check suite completed
**Inputs**:
- `pr`: pull request number
- `merge-method`: MERGE | SQUASH | REBASE (default: SQUASH)

**Logic**: Uses GitHub GraphQL `enablePullRequestAutoMerge` mutation. Skips if PR not open or auto-merge already enabled.

### 4. `release-and-publish.yml`
**Purpose**: Create GitHub release and publish to npm on merge to main

**Triggers**: Called by consumer on PR merge to main
**Inputs**:
- `pr`: merged pull request number
- `tag-prefix`: release tag prefix (default: "v")
- `create-release`: boolean
- `publish-npm`: boolean (requires `NPM_TOKEN` secret)

**Logic**:
1. Detects changed packages using `detect-packages` command
2. Creates GitHub release with tag based on timestamp
3. Optionally publishes changed packages to npm

## CLI Commands (in `packages/eta-mu-github`)

### `eta-mu review-gate --repo owner/repo --pr N [--strict]`
Checks for unresolved review threads. With `--strict`, blocks on ALL unresolved threads regardless of actor.

### `eta-mu ensure-pr --repo owner/repo --base staging [--pattern fix/*] [--dry-run]`
Creates PRs for branches without existing PRs to the base branch.

### `eta-mu auto-merge --repo owner/repo --pr N [--merge-method SQUASH]`
Enables GitHub auto-merge via GraphQL API.

### `eta-mu detect-packages --base origin/main [--workspace-glob packages/*/]`
Detects which packages in a monorepo have changed files compared to base branch.

### `eta-mu release --repo owner/repo --pr N [--tag-prefix v] [--create-release] [--publish-npm]`
Creates GitHub release (and optionally publishes to npm) for a merged PR.

## Consumer Repo Wrappers

Each consumer repo gets 3-4 thin wrapper workflows:

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
1. Detect changed packages (done via `detect-packages`)
2. Bump version in each changed package's `package.json`
3. Run `npm publish` (or `pnpm publish`) for each
4. Handle workspace dependencies and versioning strategy

### Kimi Inline Comments
The `opencode-code-review.yml` prompt already instructs Kimi to "Submit concrete findings as GitHub PR inline review comments on the exact changed lines." If this is not working, the issue may be with the pinned opencode action version (`anomalyco/opencode/github@385cb69`). Consider updating to a newer version that supports inline review comments.

### Branch Protection
For the review gate to actually block merges, branch protection rules must require the `review-resolution-gate` check to pass before merging.

## Testing

All core logic in `packages/eta-mu-github` has tests:
- `tests/review-gate.test.ts` (4 tests)
- `tests/ensure-pr.test.ts` (3 tests)
- `tests/github.test.ts` (6 tests)
- `tests/event-classifier.test.ts` (3 tests)
- `tests/runtime-batch.test.ts` (3 tests)

Total: 19 tests, all passing.
