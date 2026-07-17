---
uuid: "output-contract-gate-cljs-rewrite-conversion-tests"
title: "Output Contract Gate CLJS Rewrite — Conversion Tests"
status: "rejected"
priority: "P2"
labels: ["tasks", "cljs", "rewrite", "output-contract-gate"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/output-contract-gate-cljs-rewrite.md"
points: 3
category: "tasks"
---

# Output Contract Gate CLJS Rewrite — Conversion Tests

> Parent epic: `kanban/epics/output-contract-gate-cljs-rewrite.md`
> Points: 3

## Purpose

Add conversion and surface-parity tests that prove the CLJS implementation matches the legacy TypeScript behavior.

## Deliverables

- EDN→CLJS IR conversion tests.
- Markdown AST shape conversion tests.
- Artifact JSON shape conversion tests.
- TS facade round-trip tests (call TS wrapper, verify CLJS-backed result).
- Blocker registry for any semantic divergence discovered.

## Verification gate

- [ ] Conversion tests cover every public export path from `src/index.ts`.
- [ ] At least one test asserts byte-for-byte equivalence of generated reports (where deterministic).
- [ ] Any divergence from legacy behavior is documented with a `blocker:` comment and linked issue.
- [ ] Tests run under the CLJS test target without failure.

---
> Blocked by `output-contract-gate-cljs-rewrite-domain-core`, `output-contract-gate-cljs-rewrite-extern-adapters`, `output-contract-gate-cljs-rewrite-infra-artifacts`, `output-contract-gate-cljs-rewrite-generation`, and `output-contract-gate-cljs-rewrite-review`.
---
