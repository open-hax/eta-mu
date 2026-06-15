---
uuid: "ai-cljs-rewrite-phase-3-extern-openai"
title: "AI CLJS Rewrite — OpenAI Family Extern Adapters"
status: "ready"
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "ai"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/ai-cljs-rewrite.md"
points: 5
category: "tasks"
---

# AI CLJS Rewrite — OpenAI Family Extern Adapters

> Parent epic: `kanban/epics/ai-cljs-rewrite.md`
> Phase: 3
> Points: 5

## Purpose

Create the `eta_mu.ai.extern.openai` namespaces covering the OpenAI responses, completions, Codex responses, and Azure OpenAI adapters.

## Scope

- OpenAI SDK client construction, fetch wrappers, and streaming.
- OpenAI responses provider (`src/providers/openai-responses.ts`, `src/providers/openai-responses-shared.ts`).
- OpenAI completions provider (`src/providers/openai-completions.ts`).
- OpenAI Codex responses provider (`src/providers/openai-codex-responses.ts`).
- Azure OpenAI responses provider (`src/providers/azure-openai-responses.ts`).
- Shared helpers (`src/providers/simple-options.ts`, `src/providers/github-copilot-headers.ts`).

## Work items

- [ ] Implement `eta_mu.ai.extern.openai.client` for SDK construction and raw HTTP interop.
- [ ] Implement `eta_mu.ai.extern.openai.responses` for the responses API adapter.
- [ ] Implement `eta_mu.ai.extern.openai.completions` for the completions API adapter.
- [ ] Implement `eta_mu.ai.extern.openai.codex` for Codex-specific behavior.
- [ ] Implement `eta_mu.ai.extern.openai.azure` for Azure OpenAI behavior.
- [ ] Add conversion regression tests for every OpenAI-family adapter used by tests.

## Acceptance criteria

- [ ] All OpenAI-family tests pass against CLJS-backed implementation or blockers are recorded.
- [ ] No raw JS interop leaks outside `extern.*` namespaces.
- [ ] Azure, Codex, completions, and responses paths each have passing regression tests.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-ai test -- --grep "openai|azure|codex"
node scripts/ts-line-count.mjs packages/legacy/ai
```

---
Status updated to blocked: waiting for Phase 2 canonical message model and shared boundary-adapter conventions (core boundary-adapters task is still in_progress).
---
