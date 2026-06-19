# @open-hax/eta-mu-github

> [!WARNING]
> **DEPRECATED — legacy TypeScript.** This package lives under `packages/legacy/`
> and is no longer the direction of travel. The eta-mu monorepo is ClojureScript-first;
> all new work happens in CLJS packages. This TS surface is being rewritten to CLJS.
> See the rewrite inventory and namespace map:
> [`docs/github-cljs-rewrite-inventory.md`](../../../docs/github-cljs-rewrite-inventory.md)
> (parent epic: `kanban/epics/github-cljs-rewrite.md`). Do not add new TypeScript here.

Pi-based GitHub automation bot and review gate for PRs, issues, and mentions.

- **Package:** `@open-hax/eta-mu-github` (v0.1.2, published — `private: false`)
- **Location:** `packages/legacy/github`
- **Bin:** `eta-mu-github` → `dist/cli.js`
- **License:** GPL-3.0-only (declared in `package.json`; no `LICENSE` file is checked into this package — the declared SPDX id is the source of truth)

## What is here

- `eta-mu-github review-gate` — inspects unresolved review threads and can publish an app-owned check run (default name: `eta-mu-review-gate`)
- `eta-mu-github run-event` — classifies an event, builds GitHub context, runs a pi session, and either replies, upserts state, or autofixes a PR branch
- `eta-mu-github classify-event` — classifies an event without acting on it
- workflow templates under `templates/workflows/` (`eta-mu.yml`, `eta-mu-review-gate.yml`)
- GitHub App setup notes under [`docs/github-app.md`](docs/github-app.md)

Source lives under `src/` (`cli.ts`, `autofix.ts`, `config.ts`, `ensure-pr.ts`,
`event-classifier.ts`, `github.ts`, `pi-agent.ts`, `review-gate.ts`,
`runtime-batch.ts`, `types.ts`).

## Dependencies

Workspace dependencies (`workspace:*`): `@open-hax/eta-mu-runtime`,
`@open-hax/eta-mu-ai`, `@open-hax/eta-mu-cli`. External: `@octokit/rest`, `dotenv`.
The `prebuild` / `pretest` / `pretypecheck` hooks each build
`@open-hax/eta-mu-runtime` first.

## CLI

Run via the `dev` script (`tsx src/cli.ts`) or the built bin:

```bash
pnpm dev review-gate --repo open-hax/voxx --pr 1 --publish-check
pnpm dev run-event --repo open-hax/voxx --event-name issue_comment --event-path /tmp/event.json --cwd /path/to/repo
```

## Autofix behavior

Eta-mu can push directly to the PR head branch when:

- the event targets a pull request
- eta-mu decides the request should be handled as `mode=autofix`
- the PR head repository is the same repository where eta-mu is installed
- the GitHub token has `contents: write`

For fork PRs, eta-mu currently comments with a skip reason instead of pushing into the fork.

## GitHub workflow model

Each target repository keeps a tiny local wrapper workflow that:

1. checks out the target repo
2. checks out `open-hax/eta-mu`
3. installs `packages/legacy/github` dependencies from the monorepo
4. runs either `review-gate` or `run-event`

This preserves stable, repo-local triggers while keeping the logic centralized in the eta-mu monorepo.

## Promotion model

The eta-mu monorepo moves through the same branch contract as other long-lived automation surfaces:

- feature branch → PR into `staging`
- push to `staging` runs post-merge CI
- PR from `staging` into `main`
- push to `main` is the production logic ref consumed by target repositories

Repo-local wrapper workflows can choose a staged eta-mu ref for staging-bound events via:

- `ETA_MU_REF_STAGING`
- `ETA_MU_REF_MAIN`

For compatibility during migration, the wrappers still accept the legacy `ETA_MU_GITHUB_REF_*` variables as fallbacks.

Default behavior is:

- staging-bound events → `eta-mu@staging`
- main/other events → `eta-mu@main`

## Build & test

This is a TypeScript package (vitest + tsc). Run from this directory with pnpm:

```bash
pnpm build       # tsc -p tsconfig.json (prebuild builds eta-mu-runtime)
pnpm test        # vitest run (pretest builds eta-mu-runtime)
pnpm typecheck   # tsc -p tsconfig.json --noEmit
pnpm dev         # tsx src/cli.ts
```
