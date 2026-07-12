---
uuid: "ai-cljs-rewrite-phase-3-extern-openai"
title: "AI CLJS Rewrite — OpenAI Family Extern Adapters"
status: ready
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
Status updated to blocked: waiting for Phase 2 canonical message model and shared boundary-adapter conventions (core boundary-adapters task is done as of 2026-07-10).

## State of affairs (2026-07-12)

**Partially implemented in a different package.** The core OpenAI chat-completions client already exists in `packages/eta-mu/src/cljs/eta_mu/extern/openai.cljs` (the eta-mu CLI package), not in a dedicated `eta_mu.ai.extern.openai` namespace.

### What exists now
- `eta-mu.extern.openai` — synchronous (non-streaming) OpenAI-compatible chat-completions client
  - Configurable base URL via `OPENAI_BASE_URL` env var or `:base-url` option (defaults to `https://api.openai.com/v1/chat/completions`)
  - Configurable auth via `OPENAI_AUTH_TOKEN` / `OPENAI_API_KEY` env vars or `:api-key` option (nil = no auth header, supports local proxies)
  - Model passed as `{:id string :provider string}` map
  - Handles text responses and tool_calls, converts to canonical `AssistantMessage` shape
  - Returns a turn-processor-compatible stream object (synchronous single-shot, not SSE streaming)
- `eta-mu.turn-processor` — the turn loop that consumes the stream, handles tool execution, and emits lifecycle events
- `eta-mu.infra.cli.commands.agent` — CLI `agent` command wiring model/key/base-url from flags and env

### What is NOT implemented
- No SSE streaming (full response fetched in one shot)
- No `eta_mu.ai.extern.openai` namespace hierarchy (the work landed in `eta-mu.extern.openai` instead)
- No responses API, completions API, Codex, or Azure adapters
- No provider SDK construction — raw `js/fetch` only
- No multi-provider catalog or registry

### Proxy support
Works with any OpenAI-compatible endpoint (Ollama, LM Studio, vLLM, etc.):
```
export OPENAI_BASE_URL="http://localhost:11434/v1/chat/completions"
export OPENAI_AUTH_TOKEN="your-token"
eta-mu agent --model gemma4:31b "Hello"
```

### Test status
54 tests, 101 assertions, 0 failures in `packages/eta-mu`. Lint clean (0 warnings).

### Recommendation
This card's original scope (covering the full `packages/legacy/ai` provider surface) is much larger than what was implemented. The delivered slice is a working CLI-grade OpenAI-compatible client. The remaining scope (responses API, Azure, Codex, streaming, provider SDK) should be broken into follow-up cards if needed.

Triage 2026-07-12: delivered slice (non-streaming OpenAI-compatible client with proxy support, 54 tests green) is real but landed in eta-mu.extern.openai, not the scoped eta_mu.ai.extern.openai hierarchy. Undelivered: SSE streaming, responses API, completions-vs-responses split, Codex, Azure. Recommend re-scoping this card to 'SSE streaming for eta-mu.extern.openai' (needed for a usable coding agent) and cutting responses/Azure/Codex to icebox follow-up cards unless the coding-agent migration needs them. Stays in breakdown pending re-scope approval.

Re-scoped 2026-07-12 per decision: implement SSE streaming in eta-mu.extern.openai (packages/eta-mu) so responses render incrementally like the published CLI. Original responses-API/Azure/Codex/SDK scope is dropped — proxy covers provider routing. No TS interop requirements. Moving to ready.
---
