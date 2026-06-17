---
uuid: "pr-134-staging-promotion-gate-blocker"
title: "PR #134: Staging promotion gate requires branch ancestry to staging"
status: "blocked"
priority: "P0"
labels: ["tasks", "ci", "process", "pr-134", "blocker"]
created_at: "2026-06-16T18:30:00Z"
source: "CI failure on PR #134"
points: 1
category: "tasks"
---

# PR #134: Staging promotion gate requires branch ancestry to staging

The `staging-promotion-gate` job in `main-pr-gate.yml` fails because this PR branch (`chore/ts-cljs-rewrite`) is not an ancestor of `origin/staging`:

```
git merge-base --is-ancestor "${PR_HEAD_SHA}" origin/staging
```

This is a process gate, not a code defect. The PR targets `main`, but the workflow enforces that main-targeting PRs must descend from staging and have successful `deploy-staging` / `staging-live-verify` checks.

## Acceptance
- Branch `chore/ts-cljs-rewrite` is merged/rebased onto `origin/staging`, OR
- This PR is retargeted to `staging` and the staging checks run successfully, OR
- Project policy is updated to exempt this branch from the promotion gate.

## Notes
- Do not fix this with code changes to the feature; only process/branch movement can resolve ancestry.
- Once ancestry is established, `deploy-staging` and `staging-live-verify` must also succeed.
