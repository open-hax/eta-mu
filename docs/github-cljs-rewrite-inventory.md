# GitHub Package CLJS Rewrite — Inventory & Namespace Map

Date: 2026-06-15
Package: `packages/legacy/github` (`@open-hax/eta-mu-github`)
Parent epic: `kanban/epics/github-cljs-rewrite.md`
Kanban task: `kanban/tasks/github-cljs-rewrite-inventory.md`

## Purpose

Catalog every TypeScript source and test file in the legacy GitHub package and assign each to the target CLJS namespace map before any code is ported.

Target ownership categories (from the epic):

- `eta_mu.github.domain.*` — PR/issue decisions, review state machine
- `eta_mu.github.shape.*` — GitHub API↔canonical transforms
- `eta_mu.github.law.*` — Malli schemas for payloads and actions
- `eta_mu.github.extern.*` — Octokit/fetch, auth, raw JS interop
- `eta_mu.github.infra.*` — batch orchestration, event classification
- `eta_mu.github.cli.*` — stable JS facade and CLI exports

## Source count snapshot

| Path | Files | TS lines (approx) |
|---|---|---:|
| `src/*.ts` | 10 | ~1,363 |
| `tests/*.test.ts` | 5 | ~363 |
| `vitest.config.ts` | 1 | — |

Total package: ~1,726 TS lines (slightly below the epic’s 2,076 line estimate because the count excludes build/config and checked-in `dist/`).

## Package dependencies

| Dependency | Used in | Role |
|---|---|---|
| `@open-hax/eta-mu-runtime` | `src/runtime-batch.ts`, `src/cli.ts` | Action-batch schema, belief factory, planning-context types |
| `@open-hax/eta-mu-cli` | `src/pi-agent.ts` | Agent session, tools, model registry, extension runtime |
| `@open-hax/eta-mu-ai` | (none) | Declared in `package.json`; no direct import found |
| `@octokit/rest` | `src/github.ts` | REST + GraphQL GitHub API client |
| `dotenv` | `src/cli.ts` | Load `.env` before CLI dispatch |
| Node `fs/promises`, `fs`, `os`, `path`, `child_process`, `util` | `src/cli.ts`, `src/autofix.ts`, `src/pi-agent.ts` | File system, temp dirs, git subprocesses |

## File-by-file classification

### Source files

#### `src/types.ts`

- **Proposed CLJS namespace:** `eta_mu.github.law.types` (Malli schemas) and `eta_mu.github.shape.types` (canonical records)
- **Public exports:** `RepoSlug`, `EtaMuConfig`, `EtaMuTrigger`, `EventClassification`, `ReviewThreadCommentSummary`, `ReviewThreadSummary`, `ReviewGateResult`, `EventCommentContext`, `PullRequestRefContext`, `GitHubEventContext`, `EtaMuAgentDecision`, `EtaMuActionBatchRecord`, `AutofixResult`
- **Consumers inside `packages/legacy`:** All other `src/*.ts` files in this package; test suite. No cross-package consumers found.
- **Raw JS interop surfaces:** None (pure data definitions).
- **Runtime/boundary dependencies:** None.

#### `src/config.ts`

- **Proposed CLJS namespace:** `eta_mu.github.infra.config`
- **Public exports:** `loadConfig`, `normalizeLogin`
- **Consumers inside `packages/legacy`:** `src/cli.ts` (entry point), `src/event-classifier.ts`, `src/review-gate.ts`, `tests/event-classifier.test.ts`
- **Raw JS interop surfaces:** `process.env` for all `ETA_MU_*` configuration variables.
- **Runtime/boundary dependencies:** None.

#### `src/event-classifier.ts`

- **Proposed CLJS namespace:** `eta_mu.github.infra.event-classifier`
- **Public exports:** `classifyGithubEvent`
- **Consumers inside `packages/legacy`:** `src/cli.ts` (`classify-event` and `run-event` commands)
- **Raw JS interop surfaces:** None; operates on plain payload maps.
- **Runtime/boundary dependencies:** `config.ts` (`normalizeLogin`, `EtaMuConfig`).

#### `src/review-gate.ts`

- **Proposed CLJS namespace:** `eta_mu.github.domain.review-gate`
- **Public exports:** `findTrackedUnresolvedThreads`, `findAllUnresolvedThreads`
- **Consumers inside `packages/legacy`:** `src/cli.ts` (`review-gate` command), `tests/review-gate.test.ts`
- **Raw JS interop surfaces:** None.
- **Runtime/boundary dependencies:** `config.ts` (`normalizeLogin`), `types.ts`.

#### `src/github.ts`

- **Proposed CLJS namespaces:**
  - `eta_mu.github.extern.github-client` — Octokit creation and all REST/GraphQL calls
  - `eta_mu.github.shape.github` — pure transforms (`parseRepoSlug`, `inferPRTitle`, `formatReviewGateOutput`)
- **Public exports:** `parseRepoSlug`, `createGitHubClient`, `fetchEventContext`, `createIssueComment`, `upsertStickyComment`, `formatReviewGateOutput`, `publishCheckRun`, `listBranchesWithoutPRs`, `BranchWithoutPR`, `createPullRequest`, `inferPRTitle`, `fetchBranchCommits`
- **Consumers inside `packages/legacy`:**
  - `src/index.ts` re-exports `parseRepoSlug`, `createGitHubClient`, `fetchEventContext`, `formatReviewGateOutput`, `publishCheckRun`
  - `src/cli.ts` uses `createGitHubClient`, `fetchEventContext`, `formatReviewGateOutput`, `parseRepoSlug`, `publishCheckRun`, plus non-exported `createIssueComment` and `upsertStickyComment`
  - `src/ensure-pr.ts` uses `createGitHubClient`, `createPullRequest`, `fetchBranchCommits`, `inferPRTitle`, `listBranchesWithoutPRs`, `parseRepoSlug`
  - `tests/github.test.ts` tests `formatReviewGateOutput` and `inferPRTitle`
- **Raw JS interop surfaces:**
  - `@octokit/rest` (`Octokit`) for REST + GraphQL
  - `process.env.GITHUB_SERVER_URL`, `GITHUB_REPOSITORY`, `GITHUB_RUN_ID` for action-run links
- **Runtime/boundary dependencies:** `types.ts`.

#### `src/ensure-pr.ts`

- **Proposed CLJS namespace:** `eta_mu.github.domain.ensure-pr`
- **Public exports:** `ensurePRs`
- **Consumers inside `packages/legacy`:** `src/cli.ts` (`ensure-pr` command), `tests/ensure-pr.test.ts`
- **Raw JS interop surfaces:** None directly; drives `extern.github-client`.
- **Runtime/boundary dependencies:** `src/github.ts` (client + PR helpers), `types.ts`.

#### `src/autofix.ts`

- **Proposed CLJS namespace:** `eta_mu.github.domain.autofix`
- **Public exports:** `runAutofixForEvent`
- **Consumers inside `packages/legacy`:** `src/cli.ts` (`run-event` command), `src/index.ts` (re-export)
- **Raw JS interop surfaces:**
  - `node:fs/promises` (`mkdtemp`, `rm`, `writeFile`)
  - `node:os` (`tmpdir`)
  - `node:path`
  - `node:child_process` (`execFile`) for `git clone/config/add/commit/rev-parse/push`
  - `process.env` passed through to git subprocess
- **Runtime/boundary dependencies:** `src/pi-agent.ts` (`runEtaMuAutofix`), `src/types.ts`.

#### `src/pi-agent.ts`

- **Proposed CLJS namespace:** `eta_mu.github.extern.pi-agent`
- **Public exports:** `runEtaMuPrompt`, `runEtaMuAutofix`
- **Consumers inside `packages/legacy`:** `src/cli.ts` (`run-event` command), `src/autofix.ts`
- **Raw JS interop surfaces:**
  - `node:fs` (`existsSync`)
  - `node:path`
  - `process.env.PI_CODING_AGENT_DIR`, `HOME`, `USERPROFILE`
- **Runtime/boundary dependencies:** `@open-hax/eta-mu-cli` (agent session, model registry, tools, extension runtime, settings, auth storage).

#### `src/runtime-batch.ts`

- **Proposed CLJS namespace:** `eta_mu.github.infra.runtime-batch`
- **Public exports:** `buildPlanningContext`, `parseActionBatch`, `formatActionBatchMarkdown`, `mapActionBatchToDecision`, `buildDraftActionBatch`, `publishActionBatch`
- **Consumers inside `packages/legacy`:** `src/cli.ts` (`run-event` command), `src/index.ts` (re-exports), `tests/runtime-batch.test.ts`
- **Raw JS interop surfaces:** `fetch` (control-plane POST to `controlPlaneUrl`).
- **Runtime/boundary dependencies:** `@open-hax/eta-mu-runtime` (`createActionBatch`, `createEtaBelief`, `etaMuActionBatchSchema`, `EtaMuActionBatch`, `EtaMuPlanningContextInput`, `MuCandidate`, `PanelName`), `types.ts`.

#### `src/cli.ts`

- **Proposed CLJS namespace:** Keep as the thin TypeScript compatibility shell in `src/cli.ts`, dispatching into `eta_mu.github.cli.*` CLJS namespaces. Equivalent CLJS namespaces: `eta_mu.github.cli.entry` / `eta_mu.github.cli.commands`.
- **Public exports:** None (Node binary entry point).
- **Consumers inside `packages/legacy`:** Invoked by `package.json` `bin` (`eta-mu-github`) and by `pnpm dev`.
- **Raw JS interop surfaces:**
  - `dotenv/config`
  - `node:fs/promises` (`readFile`)
  - `node:child_process` (`execSync`)
  - `process.argv`, `process.env.GITHUB_TOKEN`/`GH_TOKEN`
- **Runtime/boundary dependencies:** `@open-hax/eta-mu-runtime` (`etaMuActionBatchSchema`), all local `src/*.ts` modules.

#### `src/index.ts`

- **Proposed CLJS namespace:** `eta_mu.github.cli.index` (stable JS facade)
- **Public exports:** Re-exports from `autofix.ts`, `config.ts`, `event-classifier.ts`, `runtime-batch.ts`, `github.ts`, `pi-agent.ts`, `review-gate.ts`, plus type-only re-exports from `types.ts`.
- **Consumers inside `packages/legacy`:** No cross-package consumers found. The package’s own `src/cli.ts` is the primary runtime consumer.
- **Raw JS interop surfaces:** None.
- **Runtime/boundary dependencies:** Aggregates all local source modules.

### Test files

| Test file | Verifies | Proposed CLJS test target |
|---|---|---|
| `tests/ensure-pr.test.ts` | `ensurePRs` dry-run, creation, and error paths | `eta_mu.github.domain.ensure-pr` |
| `tests/review-gate.test.ts` | `findTrackedUnresolvedThreads`, `findAllUnresolvedThreads` | `eta_mu.github.domain.review-gate` |
| `tests/github.test.ts` | `formatReviewGateOutput`, `inferPRTitle` | `eta_mu.github.shape.github` |
| `tests/event-classifier.test.ts` | `classifyGithubEvent` | `eta_mu.github.infra.event-classifier` |
| `tests/runtime-batch.test.ts` | `buildPlanningContext`, `buildDraftActionBatch`, `mapActionBatchToDecision` | `eta_mu.github.infra.runtime-batch` |

## Public exports from `src/index.ts` and their consumers

| Export | Source module | Internal consumer | External consumer in `packages/legacy` |
|---|---|---|---|
| `runAutofixForEvent` | `src/autofix.ts` | `src/cli.ts` (run-event) | none found |
| `loadConfig` | `src/config.ts` | `src/cli.ts`, `tests/event-classifier.test.ts` | none found |
| `normalizeLogin` | `src/config.ts` | `src/event-classifier.ts`, `src/review-gate.ts` | none found |
| `classifyGithubEvent` | `src/event-classifier.ts` | `src/cli.ts` | none found |
| `buildDraftActionBatch` | `src/runtime-batch.ts` | `src/cli.ts` | none found |
| `buildPlanningContext` | `src/runtime-batch.ts` | `src/cli.ts`, `tests/runtime-batch.test.ts` | none found |
| `formatActionBatchMarkdown` | `src/runtime-batch.ts` | `src/cli.ts` (via `mapActionBatchToDecision`) | none found |
| `mapActionBatchToDecision` | `src/runtime-batch.ts` | `src/cli.ts` | none found |
| `parseActionBatch` | `src/runtime-batch.ts` | `src/cli.ts` | none found |
| `publishActionBatch` | `src/runtime-batch.ts` | `src/cli.ts` | none found |
| `createGitHubClient` | `src/github.ts` | `src/cli.ts`, `src/ensure-pr.ts` | none found |
| `fetchEventContext` | `src/github.ts` | `src/cli.ts` | none found |
| `formatReviewGateOutput` | `src/github.ts` | `src/cli.ts` | none found |
| `parseRepoSlug` | `src/github.ts` | `src/cli.ts`, `src/ensure-pr.ts` | none found |
| `publishCheckRun` | `src/github.ts` | `src/cli.ts` | none found |
| `runEtaMuAutofix` | `src/pi-agent.ts` | `src/autofix.ts` | none found |
| `runEtaMuPrompt` | `src/pi-agent.ts` | `src/cli.ts` | none found |
| `findTrackedUnresolvedThreads` | `src/review-gate.ts` | `src/cli.ts` | none found |
| Type re-exports | `src/types.ts` | all consumers | none found |

## Raw JS interop boundary summary

| Boundary | File | JS surface | CLJS home |
|---|---|---|---|
| GitHub REST/GraphQL | `src/github.ts` | `@octokit/rest` (`Octokit`) | `eta_mu.github.extern.github-client` |
| Control-plane HTTP | `src/runtime-batch.ts` | `fetch` | `eta_mu.github.extern.control-plane` or `eta_mu.github.extern.http` |
| Agent session runtime | `src/pi-agent.ts` | `@open-hax/eta-mu-cli` APIs | `eta_mu.github.extern.pi-agent` |
| Git subprocess / FS | `src/autofix.ts` | `node:child_process`, `node:fs/promises`, `node:os` | `eta_mu.github.extern.git`, `eta_mu.github.extern.fs` |
| CLI environment | `src/config.ts`, `src/cli.ts`, `src/pi-agent.ts`, `src/github.ts` | `process.env.*` | `eta_mu.github.extern.config` / `eta_mu.github.cli.entry` |
| File/child-process helpers | `src/cli.ts` | `node:fs/promises`, `node:child_process` | `eta_mu.github.extern.fs`, `eta_mu.github.extern.process` |

## Types requiring Malli schemas under `law.*`
The following interfaces from `src/types.ts` should become Malli schemas in `eta_mu.github.law.*`:

- `RepoSlug`
- `EtaMuConfig`
- `EtaMuTrigger` (enum/closed set)
- `EventClassification`
- `ReviewThreadCommentSummary`
- `ReviewThreadSummary`
- `ReviewGateResult`
- `EventCommentContext`
- `PullRequestRefContext`
- `GitHubEventContext`
- `EtaMuAgentDecision`
- `EtaMuActionBatchRecord`
- `AutofixResult`

Additionally, the `EtaMuActionBatch` shape already has a runtime schema in `@open-hax/eta-mu-runtime`; the GitHub package should reuse it rather than redefine it.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-github test
pnpm --filter @open-hax/eta-mu-github typecheck
node scripts/ts-line-count.mjs packages/legacy/github
```

## Open decisions

1. Whether `src/github.ts` should split into one namespace per API domain (`extern.pulls`, `extern.issues`, `extern.checks`, etc.) or a single `extern.github-client` facade.
2. Whether `formatReviewGateOutput` belongs in `shape.github` or `domain.review-gate`.
3. Whether `@open-hax/eta-mu-ai` should be removed from `package.json` dependencies or used by a future `pi-agent.ts` refactor.
4. Whether `autofix.ts` git subprocess calls should move behind a reusable `eta_mu.github.extern.git` adapter shared with other packages.

## Recommended next task

Create the `eta_mu.github.extern.github-client` namespace (and its conversion regression tests) as the first boundary slice. It is the largest raw-JS surface and unblocks `domain.ensure-pr`, `domain.review-gate`, and the `run-event` CLI path.
