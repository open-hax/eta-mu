---
uuid: "output-contract-gate-cljs-rewrite-review"
title: "Output Contract Gate CLJS Rewrite — Review Logic"
status: "rejected"
priority: "P2"
labels: ["tasks", "cljs", "rewrite", "output-contract-gate"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/output-contract-gate-cljs-rewrite.md"
points: 4
category: "tasks"
---

# Output Contract Gate CLJS Rewrite — Review Logic

> Parent epic: `kanban/epics/output-contract-gate-cljs-rewrite.md`
> Points: 4

## Purpose

Port the stub and GPT review logic from `src/review.ts` into pure CLJS domain code plus extern wrappers for HTTP.

## Deliverables

- `eta_mu.gate.domain.review.stub`: deterministic scoring for contract-fidelity, shortcutting-risk, context-alignment, and actionability.
- `eta_mu.gate.domain.review.gpt`: prompt builders and output normalizers.
- `eta_mu.gate.extern.openai`: thin fetch wrapper for OpenAI-compatible chat completions.
- `eta_mu.gate.domain.review`: orchestration with GPT→stub fallback.

## Verification gate

- [ ] Stub reviewer produces a passing report for `VALID_FIVE_SECTION_RESPONSE`.
- [ ] Stub reviewer detects actionable deltas when Evidence/Frames/Next are terse.
- [ ] GPT reviewer message JSON matches the shape expected by existing tests.
- [ ] GPT reviewer fallback to stub works when the extern call throws.
- [ ] No raw JS interop outside `extern.*` namespaces.

---
> Blocked by `output-contract-gate-cljs-rewrite-law-schemas`, `output-contract-gate-cljs-rewrite-domain-core` (contract/markdown parsing), and `output-contract-gate-cljs-rewrite-extern-adapters` (extern.openai fetch wrapper).
---
