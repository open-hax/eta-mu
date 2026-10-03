---
uuid: "0dd12d60-d7ea-43d0-8b1e-87e14c4e61dd"
title: "Restore evidence review and catalog-dependent build"
labels: github, review, models, regression
---

## Outcome
Restore anonymous MiMo review and merge its shared workflow with passing checks.

## Scope
Use MiMo v2.6 Flash Free and the reviewed Muse profile. Keep compiler and diagnostic pins aligned. Repair supported-provider type lookup when the generated catalog omits providers. Update caller pins after merge and verify real CI reviews.

## Non-goals
No automatic switch to a paid provider, no changes to branch protections, no skipped deterministic gates.

## Acceptance and verification
- Anonymous reviewer submits successfully in GitHub Actions.
- Catalog omission regression fails on old types and passes on repaired types; listed model ids stay checked.
- Relevant workflow tests, build and CI pass before merging.
- Callers receive one reviewed workflow revision and report truthful gates.

## Evidence
eta-mu PR #339; Muse PR #17; successful reviewer run 36979654351. Build reproduced locally with TS2536 after live model generation. Board-state transitions remain pending availability of Rheos.

## PR #339 docstring coverage follow-up
Document the catalog lookup helpers and offline regression callback without changing behavior. Verify JSDoc presence and unchanged executable tokens, then run the offline catalog contract test.
