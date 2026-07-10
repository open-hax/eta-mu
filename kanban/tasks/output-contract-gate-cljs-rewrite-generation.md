---
uuid: "output-contract-gate-cljs-rewrite-generation"
title: "Output Contract Gate CLJS Rewrite — Generation Logic"
status: "rejected"
priority: "P2"
labels: ["tasks", "cljs", "rewrite", "output-contract-gate"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/output-contract-gate-cljs-rewrite.md"
points: 4
category: "tasks"
---

# Output Contract Gate CLJS Rewrite — Generation Logic

> Parent epic: `kanban/epics/output-contract-gate-cljs-rewrite.md`
> Points: 4

## Purpose

Port the candidate generation logic from `src/generate.ts` into CLJS, covering fixture-valid, fixture-invalid, and openai-chat modes.

## Deliverables

- `eta_mu.gate.domain.generate`: prompt builders, generation report construction, and `generateCandidate`.
- `eta_mu.gate.domain.generate.fixture`: deterministic valid/invalid fixture candidates.
- `eta_mu.gate.domain.generate.openai`: chat-completion request builder.
- `eta_mu.gate.shape.generation`: TS-compatible DTO converters.

## Verification gate

- [ ] Fixture-valid mode returns a markdown candidate that passes structural validation.
- [ ] Fixture-invalid mode returns a candidate with deterministic failures.
- [ ] OpenAI-mode messages include system instructions, required headings, and repair context when provided.
- [ ] Generation report shape matches `GenerationReport` schema.
- [ ] Generation logic delegates HTTP to `extern.openai`.

---
> Blocked by `output-contract-gate-cljs-rewrite-extern-adapters` (needs extern.openai/extern.fetch) and `output-contract-gate-cljs-rewrite-law-schemas` (needs GenerationReport schema).
---
