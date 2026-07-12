---
uuid: "output-contract-gate-cljs-rewrite-cli-facade"
title: "Output Contract Gate CLJS Rewrite — CLI Facade"
status: "rejected"
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "output-contract-gate"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/output-contract-gate-cljs-rewrite.md"
points: 4
category: "tasks"
---

# Output Contract Gate CLJS Rewrite — CLI Facade

> Parent epic: `kanban/epics/output-contract-gate-cljs-rewrite.md`
> Points: 4

## Purpose

Keep `src/cli.ts` as a thin TypeScript compatibility shell that delegates argument parsing and orchestration to the CLJS-backed implementation.

## Deliverables

- Refactored `src/cli.ts` that imports CLJS facades for validate, generate, review-stub, and review-gpt modes.
- Preserved CLI surface: flags, usage text, exit codes, JSON output shape.
- Preserved `bin` entry: `output-contract-gate`.
- `eta_mu.gate.cli.*` stable JS facade exposing public functions for TS callers.

## Verification gate

- [ ] `output-contract-gate --help` prints usage.
- [ ] Validate command exits 0 for valid response and writes artifacts.
- [ ] Validate command exits 1 for invalid response and emits repair prompt.
- [ ] Generate command runs fixture-valid and fixture-invalid modes end-to-end.
- [ ] Review-stub command appends review artifacts to a valid bundle.

---
> Blocked by `output-contract-gate-cljs-rewrite-domain-core`, `output-contract-gate-cljs-rewrite-extern-adapters`, `output-contract-gate-cljs-rewrite-infra-artifacts`, `output-contract-gate-cljs-rewrite-generation`, and `output-contract-gate-cljs-rewrite-review`.
---
