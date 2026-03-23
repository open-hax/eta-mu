---
name: pr-promotion-workflows
description: Set up PR-based branch promotion workflows with tiered CI gates, staging/main deploy hooks, and explicit GitHub branch-protection follow-through.
license: GPL-3.0
compatibility:
  - opencode
  - codex
---

# Skill: PR Promotion Workflows

## Goal
Create or revise a `PR -> staging -> PR -> main` style promotion pipeline with honest gate tiers and deploy hooks.

## Use This Skill When
- A repo needs branch promotion instead of direct-to-main merges.
- The user wants lighter checks for `staging` and heavier checks for `main`.
- You need to add deploy-on-push hooks for staging and production branches.
- You need a reusable pattern for new repos, not a one-off CI tweak.

## Do Not Use This Skill When
- The repo only needs a single-branch CI workflow.
- There is no agreed branch model yet.
- The repo has no meaningful test surface and the task is just to copy generic YAML blindly.

## Inputs
- Repo branch model (`staging`, `main`, or equivalents).
- Real test/build surface: typechecks, unit tests, integration tests, E2E tests, lint, packaging.
- Deploy targets, secrets, and environment-variable conventions.
- Existing workflows under `.github/workflows/`.

## Steps
1. Inventory the repo's actual checks.
   - Separate cheap checks from expensive/environment checks.
   - Do not call something E2E unless it really exercises the integrated system.
2. Define the promotion contract.
   - PRs into `staging`: typechecks + unit tests only.
   - PRs into `main`: lint + full suite + integration/E2E + packaging/schema/build checks.
   - Push to `staging`: deploy staging.
   - Push to `main`: deploy production.
3. Encode branch-specific GitHub Actions workflows.
   - Use separate workflow names/check names for `staging` and `main` PR gates.
   - Add a guard if `main` PRs must come specifically from `staging`.
4. Parameterize deployment honestly.
   - Keep production/staging host, user, and deploy path in repo/environment vars and secrets when possible.
   - Fail early with a clear message when required secrets/vars are missing.
5. Preserve a post-merge smoke path.
   - Optionally keep a push-based smoke workflow for merged branches, but do not rely on it as the PR gate.
6. Document the GitHub-settings follow-through.
   - Required status checks.
   - Protected branches.
   - Environment approvals/secrets.
   - Any source-branch restriction (`staging` -> `main`).
7. Verify locally.
   - Run the exact commands used by the workflows.
   - Parse workflow YAML to catch syntax errors.

## Output
- Branch-specific PR workflows for `staging` and `main`.
- Deploy workflows for `staging` and `main` push events.
- A short note stating what still must be configured in GitHub settings.

## Checklist
- `staging` PR checks are lightweight and fast.
- `main` PR checks are the real full gate.
- Deployment is triggered by branch pushes, not PR open events.
- Required secrets/vars are validated explicitly.
- Branch protection/settings gaps are called out, not hand-waved.
