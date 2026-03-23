# eta-mu-github

Pi-based GitHub automation for PRs, issues, review coordination, and autonomous PR fixes.

## Goals

- Give the GitHub automation surface a stable bot identity: **eta-mu**
- Trigger on PR changes, issue creation, and explicit mentions
- Debounce noisy event bursts with GitHub Actions concurrency groups
- Interact with CodeRabbit, other review agents, and humans via issue/PR comments
- Provide an authoritative merge-status check for unresolved review threads
- Auto-fix same-repo PR branches when reviews or mentions ask for concrete changes

## What is here

- `eta-mu review-gate` — inspects unresolved review threads and can publish an app-owned check run (default name: `eta-mu-review-gate`)
- `eta-mu run-event` — classifies an event, builds GitHub context, runs a pi session, and either replies, upserts state, or autofixes a PR branch
- workflow templates under `templates/workflows/`
- GitHub App setup notes under `docs/github-app.md`

## CLI

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
2. checks out `open-hax/eta-mu-github`
3. installs eta-mu dependencies
4. runs either `review-gate` or `run-event`

This preserves stable, repo-local triggers while keeping the logic centralized in this repo.

## Promotion model

`eta-mu-github` itself should move through the same branch contract as other long-lived automation surfaces:

- feature branch -> PR into `staging`
- push to `staging` runs post-merge CI
- PR from `staging` into `main`
- push to `main` is the production logic ref consumed by target repositories

Repo-local wrapper workflows can choose a staged eta-mu logic ref for staging-bound events via:

- `ETA_MU_GITHUB_REF_STAGING`
- `ETA_MU_GITHUB_REF_MAIN`
- `ETA_MU_PI_REF_STAGING`
- `ETA_MU_PI_REF_MAIN`

Default behavior is:

- staging-bound events -> `eta-mu-github@staging`
- main/other events -> `eta-mu-github@main`
- eta-mu-pi defaults to `main` unless an explicit staging ref is configured

## Verification

```bash
pnpm test
pnpm build
```
