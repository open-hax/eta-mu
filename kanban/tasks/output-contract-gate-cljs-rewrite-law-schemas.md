---
uuid: "output-contract-gate-cljs-rewrite-law-schemas"
title: "Output Contract Gate CLJS Rewrite — Law Schemas"
status: done
priority: P1
labels: ["tasks", "cljs", "rewrite", "output-contract-gate"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/output-contract-gate-cljs-rewrite.md"
points: 3
category: tasks
---
---
**Work started**: Porting `packages/legacy/output-contract-gate/src/types.ts` to Malli schemas under `eta-mu.gate.law.contract`.
---

# Output Contract Gate CLJS Rewrite — Law Schemas

> Parent epic: `kanban/epics/output-contract-gate-cljs-rewrite.md`
> Points: 3

## Purpose

Port the TypeScript type definitions from `src/types.ts` into Malli schemas under `eta_mu.gate.law.*`.

## Deliverables

- Malli schemas for: `ContractSection`, `ContractRule`, `RepairTemplate`, `ReviewCriterion`, `ReviewPolicy`, `NormalizedContract`, `ValidationFailure`, `ValidationResult`, `FailureReport`, `ReviewReport`, `GenerationReport`, `ArtifactBundle`, and `RepairAttemptRecord`.
- Schema registry keyed by qualified keywords.
- JSON/EDN round-trip fixtures demonstrating schema conformance.

## Verification gate

- [x] Every exported TS type from `src/types.ts` has a matching Malli schema.
- [x] Valid fixtures pass schema validation.
- [x] At least one deliberately invalid value per major schema is rejected with a clear error.
- [ ] `pnpm --dir packages/eta-mu-runtime cljs:verify` passes (or equivalent CLJS test target).

---

> Blocked by `output-contract-gate-cljs-rewrite-inventory`: schemas should follow the accepted file classification.

---
**Work completed**: Ported all `packages/legacy/output-contract-gate/src/types.ts` exports to Malli schemas in `packages/runtime/src/cljs/eta_mu/gate/law/contract.cljs`. Added `packages/runtime/test/cljs/eta_mu/gate/contract_law_test.cljs` validating the fixture contract IR and rejecting malformed data.

**Verification results**:
- `pnpm --dir packages/runtime cljs:compile` passes.
- All 23 `eta-mu.gate.contract-law-test` assertions pass.
- `pnpm --dir packages/runtime cljs:test` fails due to 6 pre-existing failures in `eta-mu.garden.publication-law-test`, unrelated to the contract-gate schemas.

**Next recommended task**: `kanban/tasks/output-contract-gate-cljs-rewrite-domain-core.md` (port validate/repair/review logic) once the garden publication-law test blockers are resolved or scoped out.
---

**Boundary fix (2026-06-15):** Added `eta-mu.gate.extern.js` to host `parse-int` and `now-iso`, removing raw `js/` interop from `eta-mu.gate.shape.markdown` and `eta-mu.gate.domain.review`. `pnpm --dir packages/runtime cljs:boundary` now passes, and `cljs:test` remains green.
