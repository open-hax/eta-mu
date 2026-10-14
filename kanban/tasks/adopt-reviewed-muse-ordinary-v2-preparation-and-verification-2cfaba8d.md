---
uuid: "0f14b89b-35f6-4caa-9a21-57d02cfaba8d"
title: "Adopt reviewed Muse ordinary v2 preparation and verification"
status: "incoming"
type: "task"
priority: "P1"
points: "3"
labels: "review, ordinary-v2, adoption, 3sp"
parent: "4761fda2-3e10-4b05-bc33-f02057b70424"
dependency: ["2c921c9e-08b3-4a18-b740-c19d2ffbf08b"]
category: "tasks"
write-id: "1791971968236-0.5hrn5szhep6s1idukk4"
created_at: "2026-10-14T09:59:28.236Z"
---

# Adopt reviewed Muse ordinary v2 preparation and verification

License: GPL-3.0-or-later.

## Context

Eta-mu local child of `4761fda2-3e10-4b05-bc33-f02057b70424`. External prerequisite: reviewed Muse assessment `2c921c9e-08b3-4a18-b740-c19d2ffbf08b`, which depends on Muse transport 757e5c1d-3d68-4521-a4bd-65061b106697. The future v2 API is not implemented or accepted by this plan. This three-point slice is 1 point for immutable selection, 1 point for compiled public API/registry compatibility proof and 1 point for full source-owner qualification/review.

## Outcome

A candidate ordinary workflow selects one reviewed immutable Muse v2 implementation at all existing pin sites and proves that source's shared preparation/verification exports are loadable and backwards compatible. This source adoption slice is independently closable before actual provider qualification.

## Scope

After normal accepted Muse source review, update the ordinary workflow `muse_revision` default (current line 37), checkout fallback at line 589 and assembly `MUSE_REVISION` fallback at line 748 together with the current-selection passage of `docs/agent-workflows.md` (current lines 70–80) and their assertions in `.github/scripts/opencode-code-review-workflow.test.mjs` lines 399–406. The documented current revision must equal all three workflow selections; preserve earlier Muse PR20/source/tree facts as explicitly historical provenance rather than relabeling them as v2. Extend the existing workflow contract with a narrow documentation-consistency assertion. Compile the actual existing profile and test its public preparation/verification export identities, exact eight-tool registry and ordinary-v1/native compatibility with the reviewed Muse tests and normal eta-mu owner fixtures. Record exact source/profile/verifier digests. This slice owns selection and compatibility; caller v2 descriptor/origin/output controls belong to `57edfa75-0612-46bc-a1bb-0893bf5c0b43`. Hold downstream caller activation until parent/native exit, even if this source commit is reviewed. This plan selects no future accepted revision and does not change today's correct c136 workflow/documentation pins.

## Non-goals

No source schema/codec reimplementation, receiver v2 workflow logic, model/native qualification, publisher change, foreign parent or provider fallback. Any additional tool/export/transport contract requirement returns the slice to split/re-estimate rather than being counted as these three points.

## Acceptance criteria

- [ ] Exactly one reviewed immutable Muse source is selected at all three workflow sites, the current operator-documentation passage and matching contract assertions; full source custody proves the real compiled exports/profile/registry and inherited compatibility. Historical source provenance remains intact and distinctly historical.
- [ ] All required source-owner gates below complete normally; unavailable setup or unsupported API keeps the task incomplete.
- [ ] Publish an independently reviewable source-selection/compatibility change with actual local/hosted results and normal review/adoption; no native complete-support claim is included.
- [ ] Local parent/dependency links and historical ledger bytes are preserved through canonical Rheos; closure requires this concrete exit, never completion of the native child.

## Verification

In the existing workflow contract, keep all three workflow pins equal while deliberately leaving the documented current selection stale; require the consistency assertion to fail for that mismatch. Its corrected case must agree on the selected reviewed immutable revision without rejecting preserved historical references. This is a future implementation control inside the existing owner suite, not a test executed by this planning edit.

For each implementation slice changing `.github/workflows/opencode-code-review.yml` (including the compiled profile or encoded runner), `.github/scripts/run-opencode-review-recovery.mjs`, their ordinary tests, or the assessment scripts/shared `eta-mu.extern.actionability-host` boundary, run both registered owners with `bb scripts/test.bb --only review-workflow,assessment-workflows` and full `bb scripts/lint.bb`. This planned adoption/control scope reaches that predicate, so both are mandatory here. `assessment-workflows` invokes `scripts/test-assessments.bb`: all six actionability/rejection/positive-cohort Node and NBB suites, real canonical fixtures, all three pinned Muse builds and complete kernel-bound network audits. Do not substitute a single-route fixture or guessed suite label.

If the owned source manifest additionally changes `packages/eta-mu/` or an imported eta-mu package source, add `pnpm -C packages/eta-mu test` and `pnpm -C packages/eta-mu lint:kondo`; if it changes `packages/extensions/` or an imported extension source, add `pnpm -C packages/extensions test`. Any further package source in the closure requires its actual registered owner from `scripts/test.bb`; unknown closure or unavailable tools keep the slice incomplete. Documentation-only planning authoring is verified as a diff and canonical card readback; it does not claim execution of these implementation gates.

Preserve ordinary v1 and all three native assessment schemas; the existing eight exact review tools and five successful ordered stages; raw-diff-only source locations; strict UTF-8/JSON; actual read-before-assess and irreversible reread invalidation; failed-call STOP; host-owned MAX2; Bash true-only; credential-free dynamically selected latest free OpenCode MiMo; native publisher identity; exact submission/source custody; and all historical failure/receipt bytes. Local fixtures supply no native approval, round or accepted source adoption.

## Risks

Muse v2 source availability is a real external prerequisite, while provider latency belongs to the later native child. Changing any additional pin surface or requiring a new interface triggers scoped re-planning. Future source-selection bytes and actual cold outputs must be qualified; existing c136 source compatibility is not v2 qualification.
