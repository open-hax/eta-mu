---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "ai"]
write-id: "1784221873729-0.fo4ee8n6mirnw8ke47h"
points: "5"
source: "kanban/epics/ai-cljs-rewrite.md"
title: "Eta-mu OpenAI Extern — SSE Streaming"
priority: "P0"
status: done
uuid: "ai-cljs-rewrite-phase-3-extern-openai"
created_at: "2026-06-15T00:00:00Z"
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

Board triage 2026-07-15: retitled to match the 2026-07-12 re-scope — this card is now only 'SSE streaming in eta-mu.extern.openai (packages/eta-mu)'. Verified today the client is still non-streaming (openai.cljs:7-8 documents the synchronous single-shot stream). Definition of done, made explicit: (1) responses render incrementally in both the tui-repl and --plain REPL; (2) tool-call deltas are accumulated correctly across chunks; (3) turn-processor lifecycle events fire per-delta or per-message without changing the loop's public contract; (4) mock-SSE unit tests + an e2e case in test-e2e; (5) kondo 0/0 and all existing 80 tests stay green. Stays ready — this is the top P0 after agent tools landed.

Starting implementation 2026-07-15. Researching exact stream-event shape (loop.cljs partial/type conventions) and TUI/REPL delta consumption before writing the SSE parser.

Implemented 2026-07-15: eta-mu.extern.openai now streams SSE chat-completions (stream:true + stream_options.include_usage) instead of a single synchronous fetch.

- New SSE parser (buffered \n\n block splitting, data: payload extraction, [DONE] sentinel) folds deltas into an accumulator and emits :start/:text_start/:text_delta/:text_end/:toolcall_start/:toolcall_delta/:toolcall_end stream events matching turn-processor.infra.loop's existing next()/result() contract — no changes to loop.cljs needed.
- Tool-call argument fragments are concatenated across deltas and parsed once complete; the final message is built by reshaping the accumulator into the existing OpenAI non-streaming response shape and feeding it through the already-tested shape.message/openai-response->assistant-message converter (DRY, no new conversion logic to trust).
- Wired real incremental rendering: eta-mu.infra.cli.repl (--plain) now writes text deltas directly to process.stdout as they arrive (bypassing println, since this runtime's *print-fn* is console.log-based and would inject a stray newline per call) and falls back to the old whole-message print when a stream produces no deltas (e.g. error/no-provider stream, or any stream-fn double that still returns {done:true} immediately — keeps back-compat with existing non-streaming test doubles). eta-mu.infra.cli.tui-repl streams raw text via the terminal boundary and only falls back to the boxed/wrapped renderer when nothing was streamed.
- Manually verified real incremental delivery against a mock SSE server with artificial delays between chunks: chunks printed at ~300ms/~600ms/~900ms marks, not buffered until turn end.

Tests: packages/eta-mu/test/cljs/eta_mu/extern/openai_test.cljs rewritten for SSE mocks (success w/ incremental events, tool-call accumulation, split-across-network-reads buffering, local proxy, no-provider, api-error) + agent_test.cljs updated to mock a streaming Response and capture process.stdout.write. New e2e case in test-e2e/.../agent_cli_e2e.cljs (agent-cli-sse-streaming-e2e-test) spawns the real built CLI against a mock server that writes multiple separate SSE data: chunks and asserts the reassembled final text.

Verification: pnpm -C packages/eta-mu test (82/82 green), pnpm -C packages/eta-mu lint:kondo (0/0), pnpm -C packages/eta-mu test:e2e (2/2 green), pnpm -C packages/turn-processor test (unaffected, 38/38 green).

Moved in_progress -> testing -> in_review per FSM (no shortcut edges) — ready for human review.
---