---
category: "tasks"
labels: "review, workflow, timeout"
dependency: []
type: "task"
write-id: "1792975168364-0.5jtjp5d7vdw7tz1hg2c"
points: "2"
title: "Ensure native assessment step timeouts are numeric"
priority: "P1"
status: "review"
uuid: "1728ae7d-41fd-4cb7-ba0f-4c802515257c"
created_at: "2026-10-25T12:16:09.959Z"
---

## Context

Native actionability run https://github.com/open-hax/eta-mu/actions/runs/40178755460 targeted Proxx #445. At 09:00:20Z GitHub reported an invalid step-timeout template with an unexpected string `120`, then allowed the assessment process to run. The invocation was still active beyond 180 minutes and was explicitly cancelled; native readback confirms assessment and publisher cancelled, with no qualifying judgment or publication. The original log and failure remain evidence.

Current protected main `7ec3ae2d7ed7cc9e45151c76642e339aaee3b869` retains the same expression in actionability, rejection and positive-cohort assessment workflows. Dispatch values can arrive as strings; numeric comparisons do not make the selected original string a number. Existing tests assert the expression text and headroom without checking its resulting value type.

## Outcome

Every accepted native assessment request provides an actual numeric step timeout, preserving the existing 60–180 minute input bound and 240-minute job envelope. Invalid requests refuse before model execution.

## Scope

- Normalize the model-step timeout value to a number at the workflow boundary for actionability, rejection and positive-cohort. Reuse existing validated input and numeric conversion; do not create another policy engine.
- Replace assertions that merely bless the broken expression with meaningful coverage of numeric and dispatch-string inputs, including 60, 120 and 180; retain malformed input refusal and verification/upload headroom.
- Retain a bounded source-error regression from the actual failed run and require a fresh native workflow qualification after reviewed source adoption.

## Non-goals

No model, credential, reviewer identity, protected source pin, native publication, body-intent/classifier, settlement or merge-policy change. No rerun of scoped assessments and no approval or judgment reconstructed from failed/cancelled traces. No fleet cutover.

## Acceptance criteria

- For both typed `workflow_call` inputs and raw `workflow_dispatch` string inputs, 60/120/180 requests produce numeric 60/120/180 timeout values; omitted input retains the enrolled default.
- Empty, non-numeric, fractional, below-bound and above-bound inputs are refused by existing `prepare` admission before numeric conversion and before the model job starts.
- All three assessment routes use the same reviewed numeric boundary and retain 240-minute job, 30-minute verification and 5-minute always-upload limits.
- Local contract tests cannot pass solely by comparing YAML expression text; the original failure produces a reproducible failing check.
- Native post-adoption qualification records actual run/head/workflow, accepted numeric timeout, bounded lifecycle and retained artifacts. A source or local test pass alone does not declare the hosted defect resolved.

## Verification

Use the owning registered command `bb scripts/test.bb --only assessment-workflows` (equivalent to `bb scripts/test-assessments.bb`). Its six suites are `actionability-node`, `actionability-nbb`, `rejection-node`, `rejection-nbb`, `positive-cohort-node` and `positive-cohort-nbb`. The three Node suites are `.github/scripts/opencode-{actionability,rejection,positive-cohort}-assessment-workflow.test.mjs`; their paired NBB suites are `.github/scripts/opencode_{actionability,rejection,positive_cohort}_assessment_test.cljs`. Reuse the harness's actual pinned canonical sources, source-built Muse verifiers, credential-free/network-denied fixture processes and kernel ancestry audit. Every suite must complete successfully; missing prerequisites, skipped/incomplete suites, unexpected denied calls or failed custody checks fail the command. Do not replace it with an unqualified direct invocation.

Use GitHub's official [`@actions/expressions`](https://github.com/actions/languageservices/tree/main/expressions) evaluator, pinned to version `0.3.61` with dependency integrity during implementation. Evaluate the actual model-step expression with `inputs.review_timeout_minutes` set to numeric `120` and string `"120"`: the original expression returns a string for the latter, which must fail the numeric-result assertion. Cover all accepted and refused cases above; do not translate the expression into JavaScript or compare only its text. This library exercises expression typing; it does not replace native workflow-template or lifecycle qualification. GitHub's [documented `fromJSON` timeout conversion](https://docs.github.com/en/actions/reference/workflows-and-actions/expressions#fromjson) is the boundary reference.

Also run the registered adjacent recovery contracts with `bb scripts/test.bb --only review-workflow`, the owning full lint gate `bb scripts/lint.bb` (including its registered `pnpm typecheck` task), scoped structural workflow validation and `git diff --check`. Preserve all deterministic gates already selected by `scripts/test.bb` and `scripts/lint.bb`; run additional owner checks required by any touched executable boundary. Require zero warnings from clj-kondo, type checks and every test suite; any warning, failure, error or incomplete suite blocks implementation qualification. Require current-head native review and required CI. After merge, use fresh stable native input and a new dispatch; never rerun the cancelled run.

## Risks

GitHub workflow_dispatch and workflow_call input typing differ. Expression conversion must preserve deliberate validated bounds and job reserve, and must not silently coerce malformed input into admission. Runtime source authentication hashes require coordinated adoption if an existing manifest binds changed workflow bytes.


The existing upstream Rheos card `ledger-events-persist-absolute-source-paths-from-the-writer-s-checkout` separately owns path-carrying event writers and historical compatibility. This timeout plan does not modify those emitters or rewrite native event history. The historical absolute `:source-path` remains provenance, not proof of a replay/writeback failure in this PR.

---
Planning review roots4371049014/4371049020: use registered full bb scripts/lint.bb including pnpm typecheck; explicitly require zero warnings for kondo, types and every suite. Added append-only observation correcting the two historical planning records miscategorized test-run, with original native event IDs/raw line hashes/whole prefix hash. Historical rows unchanged; no executable test or hosted fix credit. Card remains incoming pending current-head planning review.

Planning PR367 is actually merged at ddc5a0c30da871705f87c7a7819864e08e04cae6 after current-head canonical PASS on f3b82db, MiMo approval, all11 native checks and all5 settled threads. Implement the accepted bounded numeric timeout correction on a new branch. Retain registered six-suite/source-built verifier/network-denial gates and actual hosted qualification after adoption; cancelled40178755460 remains failed evidence.

Implementation RED77a01c16 reproduced the real dispatch typing defect through the pinned official evaluator: registered six-suite gate completed with7type assertion failures in actionability-node, other5suitesPASS. Candidate now wraps the existing3deadline expressions with fromJSON(format(...)), retaining all prepare bounds and job/verifier/upload reserves. GREEN actual registered6suitesPASS202.7s: Node37/23/7tests; NBB1265checks,8tests319assertions,6tests57assertions;377network-control testsPASS and actual pinned Muse builds0warnings. Adjacent340testsPASS, fullrecursive/gate/assessmentkondoPASS0warnings, syntax/diffPASS. Rawactionlint has18identical accepted-base job.workflow_sha/ref diagnostics and0introduced; not claimed rawPASS. Source is not protected adoption or hosted lifecycle qualification; current native review/CI and a new stable post-adoption dispatch are still required. Existing cancelled40178755460 retains no judgment/publication credit.

Actual native move in_progress->review was REFUSED by the configured pnpm build gate. It invoked all26workspace application builds; missing per-package dependencies produced failures. After failure was established, stopped only the remaining owned build descendants; no board rule/command was bypassed, card stays in_progress. Two generated tracked contracts/output artifacts were restored only because they were clean before this owned build. The targeted assessment/recovery/kondo checks remain passing but are not a successful full repository build or completed task. Preparing reviewable source PR with this build limitation and required hosted lifecycle qualification explicit.

Readable correction to the verification notes recorded in native ledger lines 3311–3312. The registered assessment command completed all six suites successfully in 202.7 seconds. The Node suites ran 37, 23 and 7 tests. The NBB suites completed 1,265 checks; 8 tests with 319 assertions; and 6 tests with 57 assertions. All 377 network-boundary and trusted-fixture controls passed. The final adjacent recovery suite passed 340 tests. Clojure lint passed with zero errors and zero warnings. Separately, the move to review was refused: the configured repository build attempted 26 application packages and encountered missing package dependencies and failed builds. Remaining processes belonging to that failed build were stopped. The card is still in_progress. Passing the targeted suites does not mean the full repository build or hosted lifecycle qualification passed. These sentences clarify the earlier compressed wording; the original comments and event bytes are retained.

Readable verification correction: the actual RED run had 7 type assertion failures in the actionability suite; the other 5 suites passed. The final ClojureScript fix passed all 6 assessment suites in 187.9 seconds and all 340 adjacent tests in 39.8 seconds, with zero Clojure lint errors or warnings. Raw actionlint reports the same 18 diagnostics at the accepted base and candidate, with 0 introduced diagnostics; it is not claimed passing. The reviewable source PR explicitly documents both the earlier full-build limitation and the required new hosted lifecycle qualification. A full frozen workspace install has now allowed the full application build and full lint/typecheck gate to pass. The local full test run encountered Babashka 1.12.207 missing java.util.HexFormat in Clio. The repository-pinned Babashka 1.13.219 archive hash was verified and its targeted Clio run passed 29 tests with 182 assertions. Full native review and the complete pinned-toolchain gate remain required before completion. Prior comments and ledger events are retained byte-for-byte.

---