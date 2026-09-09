---
category: "tasks"
labels: "github, webhook, review, gitops"
dependency: []
parent: "opencode-mimo-evidence-review-agent"
type: "task"
write-id: "1788989985924-0.42a3foxfu4afl7k7r9r"
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

Repair scope (2026-09-09, starting at d01b36685348505ce268cb1f2a1e628b56d0bfee): the preceding sole-blocker statement predates three additional unresolved review findings. Repair authenticated default-base push reconciliation without model dispatch, terminal cleanup after command-label removal while preserving exact gate identity and the current effect lease, and the remaining raw host operations outside extern. Address the two still-valid out-of-diff transport and installation-token scope findings. Preserve observe-only as the default and all Services activation obligations. Prepare a separate protected exact-SHA Sol pre-merge integration path; ordinary PR execution must receive neither dependency credentials nor private source, and private event-ledger publication is not authorized by this repair. Validate controller regressions, workflow contracts, lint, build, and fresh hosted reviews before resolving the associated threads. A protected trust-promotion approval and actual exact-head Sol evidence remain necessary before claiming that testing blocker resolved.

Repair work on 2026-09-09 reverified four unresolved threads and two out-of-diff security findings at d01b366. Controller lifecycle, extern ownership, scoped installation tokens and HTTPS transport repairs are implemented; first hardened wrapper run passes 115 tests / 944 assertions and controller release has zero warnings. A malformed-push classification follow-up is under regression verification. Sol pre-merge workflow bootstrap is separate from controller activation and requires actual protected exact-SHA human approval plus behavioral test/build evidence before its thread can resolve.

Final local controller verification after malformed-push correction: hardened package test wrapper completed 115 tests / 992 assertions, zero failures/errors; full package clj-kondo zero errors/warnings; combined review and Sol workflow contracts 88/88. The protected Sol workflow itself has no private behavioral evidence yet; its bootstrap remains separate and the Sol review thread stays open. No Services activation setting or production effect lease was enabled.

PR332 current-head GitHub review found three bootstrap anomalies: Octokit normalizes branch-policy pagination to an array; environment guard must explicitly reject administrator bypass; lint warnings were omitted from the protected zero-warning scan. Reopen implementation for minimal corrections and regressions on both branches. Actual private Sol evidence remains pending.

Current-head Codex review on56cf3e3 adds four concrete corrections: replace shape.edn String.includes host calls with CLJS includes?; terminalize an older verified gate on post-workflow strict-newer supersession; durably settle a signed base-push after default-branch rename; add independent controller CI triggers for sol-premerge-contract.yml. Scoped agents are repairing lifecycle paths with negative and replay regressions; parent owns the two small boundary edits.

Corrected current-head Codex findings: CLJS string predicate in shape; strict-newer verified completion cancels pending predecessor before durable settlement and retries failure; default-branch rename durably refuses signed parent without child admission; independent CI includes the Sol contract workflow. Also carries the three reviewed bootstrap guard fixes from PR332. Full controller119tests/1053assertions0fail0error; release0warnings; package kondo0errors0warnings; combined workflow contracts89/89. Sol actual protected test/build still awaits bootstrap merge/admin setup/human exact-head approval.

Protected Sol bootstrap PR332 merged as476b07bd66efb84566a4159556deacb1e9407e6f after current-head Codex review found no major issues, independent security review of corrections passed, required checks and standalone9tests passed, and all three review threads resolved. Integration preserves all ledger bytes/order and existing duplicate IDs; .github/packages/docs source is identical to tested2dde9ab. Controller119tests/1053assertions and workflow89tests evidence therefore applies to unchanged code. The only remaining original blocker is administrator sol-premerge environment setup/dedicated secrets, explicit human approval, and actual protected Sol test/build on the final candidate.

Final-head Codex review on7c0ce18 found one architecture correction: active-marker-deployment parses the LF-terminated wire marker and returns deployment data from law.effect-lease. Move that morphism to shape and keep law predicates only, preserving strict marker/lease semantics and existing negative regressions. No Services activation change is authorized or intended.

The layer audit confirms the parser is in law.webhook and finds four other exported transforms under the same boundary rule: command-type/capability normalization, gate-reconcile-source-id extraction, and review-gate-external-id construction. Move these externally consumed morphisms to shape in the same mechanical correction, preserving internal validation semantics and the declarative command-capability contract lookup. No behavior or activation change.

Completed the law/shape correction: marker parser moved from law.webhook to shape.effect-lease; law retains boolean validity predicates. Four exported data morphisms moved to shape.webhook and callers migrated; private normalization serves only independent law validation/static capability lookup. Exact LF, missing LF, CRLF, extra-line and invalid deployment IDs remain covered. Full controller120tests/1078assertions0fail0error; release0warnings; package kondo0errors0warnings. Workflow source is unchanged from the89/89 tested version. Sol protected test/build remains the sole operational blocker pending administrator setup and human approval of the new final SHA.

Current-head Codex review on91ac841 reports that documented workflow-run paths may include the expected owner/repository prefix, which current completion validation rejects. Verify primary GitHub schema/API behavior, then support the valid qualified form consistently in signed webhook and authoritative run checks while strictly enforcing repository, workflow and ref. Preserve existing forms; add real completion regression plus wrong-scope refusals.

Verified the official GitHub REST workflow-run.path schema documents owner/repository-qualified paths; real workflow_dispatch API data also uses bare paths. Controller ingress and authoritative completion now accept exactly bare workflow path, path@expected-ref, and expected-repository/path@expected-ref. The review-resolution workflow applies the same contract. Wrong repository, workflow, ref and lookalike paths remain refused; independent identity and revision checks remain intact. Real adapter/durable completion regression passes. Two independent review agents found no actionable defects. Full controller: 120 tests / 1141 assertions, zero failures/errors; release and clj-kondo: zero warnings; combined workflow contracts: 90/90. Protected Sol test/build still awaits administrator setup and explicit human approval of the final SHA; Services activation stays disabled.

Current-head Codex review on fb21f77 exposes four additional trust-boundary gaps. Verify and minimally correct: refresh issuer permission immediately before actor-authorized writes while keeping defensive terminal cleanup independent; require a parsed v2 identity bound to the same PR/base/head/merge revision before accepting a successor; finish bounded exact-check pagination so cross-page duplicates cannot appear unique; preserve and validate the literal foreign draft boolean instead of treating malformed values as non-draft. Add executable revocation, malformed identity, cross-page duplicate, and malformed draft regressions; preserve Services activation and protected Sol boundaries.

Related discovery: resolution workflow used the same under-scoped successor filter; corrected it alongside controller peer ordering, with a reproduced malformed-identity refusal regression. All four Codex corrections pass combined controller128tests/1385assertions and release0warnings; workflow contracts93/93. CodeRabbit reviewed fb21f77 and reported only an ambient-printer determinism concern in durable EDN encode: verify and bind printer controls if reproduced. Its docstring coverage suggestion and nested-Biome tool limitation are not repository merge gates and do not justify unrelated changes.

Completed the four verified Codex corrections and the reproduced CodeRabbit EDN data-loss fix. Every actor-authorized review write refreshes permission before the final lease; terminal and defensive cleanup remain issuer-independent. Successor selection requires a complete same-tuple v2 identity in controller and resolution workflow. Exact check lookup scans all bounded pages and refuses duplicates or incomplete evidence. Missing/nonboolean draft state fails the existing contract. Durable encode binds printer controls across canonical comparisons and printing, preserving distinct complex keys. Permission regression produced22failures on old code; workflow malformed successor regression reproduced red; EDN printer reproduction lost a distinct key. Final controller129tests/1399assertions0fail0error; release and kondo0warnings; unchanged workflow contracts93/93. Independent cross-review found no defects. Actual protected Sol test/build is still pending admin setup and explicit human approval; Services review-dispatch stays disabled.

Current-head Codex on b92a6fd reports three related boundary gaps: admit defensive cleanup for closed/converted_to_draft PR lifecycle events so in-flight gates terminalize; require literal false draft state across resolver/gate/publication workflow guards; validate successful Check Run page shapes before interpreting absence or authorizing creation. Verify each and apply the same contract across directly related readers/guards, with public adapter/workflow/worker regressions and no model execution from lifecycle cleanup. Existing Services activation and protected Sol trust boundaries remain unchanged.

All three corrections passed controller139tests/2092assertions and release0warnings; workflow96/96. Lifecycle audit found the same pending-gate leak when an admitted base-changing edited event retargets a PR away from the default branch. Extend the existing durable retirement decision to authoritative non-default-base state and the completion callback, preserving normal gate creation when retargeted to default and rechecking immediately before cancellation so a retarget-back race refuses the write. Add this state to the same lifecycle regression matrix; no new repository-event surface or activation change.

Completed the lifecycle, draft-guard, and Check Run page corrections. Closed, draft, and retargeted-away PRs retire only canonical same-PR gates, with a current eligibility recheck and final Services lease before each PATCH; completion uses the same cleanup, while retarget-to-default keeps normal gate creation. Thirty adapter scenarios cover lifecycle/completion, reopen or retarget-back races, retry, duplicate delivery, revoked lease, observe-only, and unrelated gates. Durable lookup validates canonical journals/projections and completed intents. All three workflow guards require literal false draft state. Both Check Run list readers validate page counts and consumed identity fields, preserving documented nullable foreign fields. Final controller: 139 tests / 2215 assertions, zero failures/errors. Release and clj-kondo: zero warnings. Workflow contracts: 96/96. Independent lifecycle and retarget reviews are clean. Protected Sol test/build remains pending the documented administrator setup verification and explicit human approval of the final SHA; Services activation remains disabled.

---