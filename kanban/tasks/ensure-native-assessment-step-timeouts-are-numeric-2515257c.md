---
uuid: "1728ae7d-41fd-4cb7-ba0f-4c802515257c"
title: "Ensure native assessment step timeouts are numeric"
status: "incoming"
type: "task"
priority: "P1"
points: "2"
labels: "review, workflow, timeout"
dependency: []
category: "tasks"
write-id: "1792930569959-0.9mimji1himff7em6gr"
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

- Numeric and string 60/120/180 requests produce numbers 60/120/180 respectively in the actual GitHub expression semantics; omitted input retains the enrolled default.
- Malformed, fractional and out-of-range requests are refused by the existing prepare admission before the model job.
- All three assessment routes use the same reviewed numeric boundary and retain 240-minute job, 30-minute verification and 5-minute always-upload limits.
- Local contract tests cannot pass solely by comparing YAML expression text; the original failure produces a reproducible failing check.
- Native post-adoption qualification records actual run/head/workflow, accepted numeric timeout, bounded lifecycle and retained artifacts. A source or local test pass alone does not declare the hosted defect resolved.

## Verification

Run the three existing native assessment workflow contract suites with their real dependencies, scoped structural workflow validation and diff checks. Run additional owner checks required by any touched executable boundary. Require current-head native review and deterministic gates. After merge, use a fresh stable native input and new dispatch; never rerun the cancelled run.

## Risks

GitHub workflow_dispatch and workflow_call input typing differ. Expression conversion must preserve deliberate validated bounds and job reserve, and must not silently coerce malformed input into admission. Runtime source authentication hashes require coordinated adoption if an existing manifest binds changed workflow bytes.
