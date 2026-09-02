---
category: "tasks"
labels: "github, webhook, review, gitops"
dependency: []
parent: "opencode-mimo-evidence-review-agent"
type: "task"
write-id: "1788380902170-0.qabc3n0sf4rhogzyn1k"
title: "Admit exact-head code reviews through signed webhooks"
priority: "P0"
status: "review"
uuid: "eta-mu-webhook-review-controller"
created_at: "2026-09-01T17:18:15.630Z"
---

# Admit exact-head code reviews through signed webhooks

## Outcome

A small eta-mu controller accepts authenticated GitHub App webhook commands and dispatches the existing evidence-first review workflow against the pull request's independently re-fetched current head.

## Scope

- Admit only signed, allowlisted `pull_request:labeled` deliveries for `eta-mu:review`.
- Durably receipt and deduplicate delivery IDs before returning `202`.
- Re-fetch current pull-request state and authorize the sender through an Axxium-shaped authority port backed provisionally by repository permission.
- Dispatch `opencode-code-review.yml` with PR number, exact head SHA, and command/delivery ID.
- Record dispatch receipts and replay incomplete work without duplicate review runs.
- Ship a GPL-3.0-or-later image and health/readiness contract for Services.

## Acceptance criteria

- Invalid signatures, disallowed installations/repositories, wrong events/actions/labels, stale or unsafe PRs, and unauthorized actors are refused without queue effects.
- Duplicate delivery IDs never produce duplicate dispatches.
- Workflow dispatch revalidates current PR state and refuses head mismatch, drafts, closed PRs, and forks.
- No webhook body, App key, webhook secret, or authorization value appears in logs or receipts.
- Deterministic readiness does not depend on Sol, Proxx, or live Axxium.
- Package tests, lint, build, container smoke, and exact-head workflow structural tests pass.

---
Implementation evidence: signed raw-body HMAC admission, dual allowlists, exact command-label policy, current PR/repository refetch, numeric actor rebinding, trusted default-branch workflow dispatch, and revision-bound inputs are implemented. Durable delivery/outbox/completion projections use atomic no-replace publication with fsync, startup reconciliation, policy-bound replay, uncertainty holding, fatal effect gates, and per-partition/ledger readiness. Controller gates pass 25 tests / 132 assertions, zero failures; clj-kondo 0 errors/warnings; release build 0 warnings. The hardened reusable review workflow passes 53/53 structural tests. A live compiled-process smoke reported ready and acknowledged an authentic unrelated event with effect-free 202. Docker is unavailable locally, so a dedicated exact-head CI job now builds the frozen runtime image before review.

Final review evidence: controller admission and publication remain exact-head for source, while merge authority is now bound to the independently re-fetched default-base SHA and GitHub test-merge SHA. Controller-owned gate checks use v2 delivery/PR/head/base/merge identities; review and PR lifecycle webhooks invalidate stale gates without model dispatch; workflow_run completion can only terminalize the exact correlated run after a fresh authority lease. Replay, uncertain non-idempotent dispatch, newer-intent ordering, and same-head cross-PR reuse are covered. Independent verification: 62 tests / 489 assertions, 0 failures/errors; clj-kondo 0 warnings; release build 0 warnings; review/Sol workflow contracts 68/68; YAML parse and diff check clean. Independent audit found no controller P0/P1; production activation is fail-closed pending the Services full branch-protection posture proof and live GitHub App canary.

Review evidence for exact hosted head 63fddcaa778d231f9a7e3240c89ade13d4e5a175: controller 99 tests / 793 assertions; review and Sol workflow contracts 80/80; clj-kondo 0 errors and 0 warnings; release build 0 warnings; 13 review findings resolved. The sole retained blocker is Sol PR-time test/build: its private event-ledger dependency cannot be consumed by an unprivileged exact-head PR job without a separately approved public dependency or protected trust-promotion boundary. Card remains in review; production and mutation activation stay fail-closed.

---