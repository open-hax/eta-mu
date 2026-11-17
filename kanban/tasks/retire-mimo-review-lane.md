---
title: Retire MiMo review execution and retain deterministic evidence
uuid: dcc70c7d-6233-493c-b9e8-f422951fe5dd
category: tasks
labels: review, workflow, retirement
priority: P1
---

## Outcome
Owner: Codex, isolated branch fix/retire-mimo-review-20261117.
Aaron directed removal of MiMo across projects on 2026-11-17. Replace the reusable
review route with deterministic-only evidence; independent Codex review remains
separate, not a forged hosted approval.

## Scope and acceptance
- Preserve deterministic producer, exact/clean revision checks, artifacts and failure behavior.
- Remove MiMo review/context jobs and MiMo-only assessment execution routes.
- Keep inert legacy call inputs for phased caller pin migration.
- Retain historical security regressions as explicitly non-runnable fixtures.
- Add executable-gate regression tests and obtain independent review.
- No branch protection changes, merge, or rewriting historical findings/receipts.

## Ownership and rollout
PRs #363 and #385 are older waiver/diagnostic proposals; their branches stay untouched.
Consumers must move immutable pins to the reviewed replacement; old immutable pins
are not retroactively disabled. The three retired assessment workflows implement
model-specific input preparation/publication, not standalone project test gates.
Their validators/history remain available; no replacement assessment publisher is claimed.
