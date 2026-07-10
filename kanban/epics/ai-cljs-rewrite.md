---
uuid: "ai-cljs-rewrite"
title: "AI Package CLJS Rewrite"
status: "in_progress"
priority: "P0"
labels: ["epics", "cljs", "rewrite", "legacy-ts", "ai"]
created_at: "2026-06-15T00:00:00Z"
source: "user-request:2026-06-15"
points: 34
category: "epics"
---

# AI Package CLJS Rewrite

> Package: `packages/legacy/ai` (`@open-hax/eta-mu-ai`)
> Current size: ~46,456 TS lines across 117 files
> Scope: provider adapters, streaming, OAuth, model registry, transforms, CLI

## Purpose

Rewrite the `@open-hax/eta-mu-ai` provider and model layer into ClojureScript while preserving provider contracts and stream semantics. This is the largest boundary surface in the legacy tree; success here unblocks the coding-agent rewrite and centralizes provider-specific JS interop under `extern.*` namespaces.

## Public compatibility surfaces

- Package exports: `src/index.ts`, `src/models.ts`
- Generated model catalog: `src/models.generated.ts`
- Providers: `src/providers/*`
- OAuth helpers: `src/utils/oauth/*`
- Streaming/validation utilities: `src/stream.ts`, `src/utils/validation.ts`
- CLI entry: `src/cli.ts`
- Tests: `test/*.test.ts`

## Target namespace map

```text
eta_mu.ai.domain.*        message/content-part decisions, model selection
eta_mu.ai.shape.*         provider↔canonical message transforms
eta_mu.ai.law.*           Malli schemas for provider payloads and responses
eta_mu.ai.extern.*        provider SDKs, fetch, streams, OAuth, raw JS interop
eta_mu.ai.infra.*         provider registration, retries, caching
eta_mu.ai.cli.*           stable JS facade and CLI exports
```

## Non-goals

- Do not regenerate the model catalog during this epic; preserve the generated artifact.
- Do not add new providers.
- Do not unify provider protocols with `packages/protocols` unless explicitly scoped.

## Phases

### Phase 1 — Inventory and provider contract map

- Catalog provider files and classify into domain/shape/law/infra/extern/cli.
- Map every provider's request/response shape to a canonical CLJS representation.
- Identify streaming, OAuth, and retry boundaries.

### Phase 2 — Canonical message model and law

- Port canonical message/content-part types to CLJS maps and Malli schemas.
- Add round-trip tests for each provider's request/response transforms.
- Preserve audio/image/text content-part extensibility.

### Phase 3 — Provider extern adapters

- Create `extern.*` namespaces per provider family (openai, anthropic, google, etc.).
- Isolate SDK client construction, fetch, streaming, and OAuth flows.
- Add conversion regression tests for every adapter used by tests.

### Phase 4 — Infra and registry

- Port provider registration, model resolution, retries, and caching to `infra.*`.
- Keep the generated model catalog accessible via CLJS-backed lookup.

### Phase 5 — CLI facade and test parity

- Maintain `src/cli.ts` as a thin TS compatibility layer.
- Run all `test/*.test.ts` against CLJS-backed implementation.
- Mark provider-specific gaps explicitly.

### Phase 6 — Cutover ratchet

- Remove obsolete TS provider modules only after parity tests pass.
- Track TS line-count reduction per provider.

## Acceptance criteria

- [ ] Provider inventory classifies every source file and public export.
- [ ] Canonical message model exists in `law.*` with Malli schemas.
- [ ] Every active provider has an `extern.*` adapter with conversion tests.
- [ ] Existing AI test suite passes or explicit blockers are recorded.
- [ ] TypeScript line count for `packages/legacy/ai` decreases monotonically.
- [ ] `pnpm --filter @open-hax/eta-mu-ai test` passes.

## Verification gates

```bash
pnpm --filter @open-hax/eta-mu-ai test
pnpm --filter @open-hax/eta-mu-ai typecheck
node scripts/ts-line-count.mjs packages/legacy/ai
pnpm --dir packages/eta-mu-runtime cljs:verify
```

## Dependencies

- `eta-mu-cljs-runtime-rewrite` (runtime core and envelope patterns)
- `eta-mu-cljs-rewrite-boundary-adapters` (shared extern conventions)

---
## Scheduling review (2026-06-15)

- 1 task ready for breakdown: `ai-cljs-rewrite-phase-1-inventory`.
- 9 tasks blocked: Phase 2 awaits inventory; Phase 3 provider extern adapters await Phase 2 canonical model + core `boundary-adapters`; Phase 4 awaits extern adapters; Phase 5/6 await infra.
- Current bottleneck: core program `eta-mu-cljs-rewrite-boundary-adapters` (in_progress) and completion of the Phase 1 inventory.
- Concurrency: once Phase 2 canonical model is done, provider extern adapters (OpenAI, Anthropic, Google, Bedrock, Auxiliary) can proceed in parallel.
---

## Inventory review (2026-06-15)

**Reviewer:** human supervisor (me)
**Verdict:** `ai-cljs-rewrite-phase-1-inventory` accepted; inventory doc `docs/ai-cljs-rewrite-inventory.md` produced.

**Key findings from the inventory:**
- `packages/legacy/ai` is the largest boundary surface: 46 source files, ~46,456 TS lines, 117 files total.
- Public entry points: `src/index.ts` (main API), `src/models.ts` (model catalog), `src/oauth.ts`, `src/cli.ts` (`pi-ai` binary), `src/bedrock-provider.ts` (subpath).
- Provider families requiring `extern.*` adapters: OpenAI chat completions, OpenAI responses, Anthropic, Google/Gemini/Vertex, Amazon Bedrock, Mistral, plus auxiliary (Cloudflare, GitHub Copilot headers, faux provider).
- Canonical message/content-part model must be established first; all provider transforms depend on it.
- `src/models.generated.ts` must be preserved and made consumable from CLJS without regeneration.
- OAuth flows (`src/utils/oauth/*`) are a dedicated extern cluster.
- Raw JS interop is concentrated in provider SDKs, `fetch`, streams, and OAuth; no raw interop should leak outside `eta_mu.ai.extern.*`.
- Primary internal consumer is `packages/legacy/coding-agent`.

**Updated scheduling after inventory:**
- Phase 1 → `review` (done).
- Phase 2 (`canonical-model`) can move to `ready` immediately; it depends only on the inventory and runtime core patterns (done).
- Phase 3 provider extern adapters remain blocked by Phase 2 and core `boundary-adapters`.
- Phase 4/5/6 remain sequentially blocked.

**Recommended next action:** Move `ai-cljs-rewrite-phase-2-canonical-model` to `ready` and begin canonicalizing `Message`, content parts, `Context`, `Tool`, and `Model` in CLJS with Malli schemas.

---
## Canonical model review (2026-06-15)

**Reviewer:** human supervisor (me)
**Verdict:** `ai-cljs-rewrite-phase-2-canonical-model` accepted and promoted to `done`.

**Delivered:**
- `packages/runtime/src/cljs/eta_mu/ai/law/message.cljs` — Malli schemas for canonical messages, content parts, `ToolCall`, `ToolResultMessage`, `Usage`, `StopReason`, `Context`, `Tool`.
- `packages/runtime/src/cljs/eta_mu/ai/domain/message.cljs` — pure constructors/predicates.
- `packages/runtime/src/cljs/eta_mu/ai/shape/message.cljs` — canonical↔JS DTO conversions.
- `packages/runtime/src/cljs/eta_mu/ai/extern/js.cljs` — isolated `js->clj`/`clj->js` boundary helpers.
- `packages/runtime/test/cljs/eta_mu/ai/message_test.cljs` — round-trip and schema-rejection tests.

**Verification:**
- `pnpm --dir packages/runtime cljs:verify` passed (compile, test, smoke, boundary).
- `pnpm test` passed.
- Boundary scanner: 53 files checked, 9 extern namespaces, 0 violations.

**Updated scheduling after canonical model:**
- Phase 2 → `done`.
- Phase 3 provider extern adapters (`openai`, `anthropic`, `google`, `bedrock`, `auxiliary`) are now unblocked by Phase 2 but remain blocked by core `eta-mu-cljs-rewrite-boundary-adapters` (in_progress).
- Phase 4 infra/registry, Phase 5 CLI parity, and Phase 6 cutover remain sequentially blocked.

**Recommended next action:** Drive core `eta-mu-cljs-rewrite-boundary-adapters` to completion, then move `ai-cljs-rewrite-phase-3-extern-openai` to `ready` as the first provider adapter.
---
