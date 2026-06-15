# Agent Package CLJS Rewrite — File-by-File Inventory

> Source package: `packages/legacy/agent` (`@open-hax/eta-mu-agent-core`)
> Parent epic: `kanban/epics/agent-cljs-rewrite.md`
> Generated: 2026-06-15

This document catalogs every source file and public export in `packages/legacy/agent` and classifies each into the target CLJS namespace taxonomy (`domain` / `shape` / `law` / `infra` / `extern` / `cli`) before porting begins.

---

## Namespace taxonomy

| Bucket | Responsibility | Proposed root |
|--------|----------------|---------------|
| `domain` | Pure turn decisions, belief updates, tool dispatch, queue logic | `eta_mu.agent.domain.*` |
| `shape`  | Message↔envelope transforms, DTO compatibility | `eta_mu.agent.shape.*` |
| `law`    | Malli schemas for agent-state and action contracts | `eta_mu.agent.law.*` |
| `extern` | SDK/provider/HTTP adapters, raw JS interop | `eta_mu.agent.extern.*` |
| `infra`  | Loop orchestration, session lifecycle, proxy wiring | `eta_mu.agent.infra.*` |
| `cli`    | Stable JS facade exports for Node consumers | `eta_mu.agent.cli.*` |

---

## Source files

### `src/types.ts` — 365 lines

| Field | Value |
|-------|-------|
| Proposed CLJS namespace | `eta_mu.agent.law.types` |
| Classification | `law` (with `shape` cross-references) |
| Public exports | `StreamFn`, `ToolExecutionMode`, `AgentToolCall`, `BeforeToolCallResult`, `AfterToolCallResult`, `BeforeToolCallContext`, `AfterToolCallContext`, `AgentLoopConfig`, `ThinkingLevel`, `CustomAgentMessages`, `AgentMessage`, `AgentState`, `AgentToolResult`, `AgentToolUpdateCallback`, `AgentTool`, `AgentContext`, `AgentEvent` |
| Raw JS interop surfaces | `import type { AssistantMessage, AssistantMessageEvent, ImageContent, InputContent, Message, Model, SimpleStreamOptions, streamSimple, Tool, ToolResultMessage } from "@open-hax/eta-mu-ai"`; `import type { Static, TSchema } from "typebox"` |
| Dependencies on runtime core / boundary adapters | Requires `eta-mu-cljs-runtime-rewrite` envelope/message primitives and `eta-mu-cljs-rewrite-boundary-adapters` for provider model/message adapters. TypeBox schemas (`TSchema`, `Static`) must be replaced by Malli schemas in `law.*`. |

**Notes**
- `AgentMessage = Message | CustomAgentMessages[keyof CustomAgentMessages]` is the extension point used by `coding-agent` to add `BashExecutionMessage` via TypeScript declaration merging. In CLJS this becomes a multimethod/protocol dispatch or an open schema registry in `law.types`.
- `AgentEvent` is the public lifecycle contract consumed by UIs and session managers; it must remain byte-for-byte compatible in the JS facade.
- `AgentState` accessor semantics (copy-on-assign for `tools`/`messages`) are state-machine concerns that land in `infra.agent` but are *typed* here.

---

### `src/agent-loop.ts` — 683 lines

| Field | Value |
|-------|-------|
| Proposed CLJS namespaces | `eta_mu.agent.domain.loop` (pure loop logic); `eta_mu.agent.infra.stream` (EventStream wrapper entry points) |
| Classification | `domain` + `infra` |
| Public exports | `AgentEventSink`, `agentLoop`, `agentLoopContinue`, `runAgentLoop`, `runAgentLoopContinue` |
| Raw JS interop surfaces | `import { AssistantMessage, Context, EventStream, streamSimple, ToolResultMessage, validateToolArguments } from "@open-hax/eta-mu-ai"` |
| Dependencies on runtime core / boundary adapters | Uses `EventStream` from the AI boundary adapter; `streamSimple`/`validateToolArguments` are provider-side concerns owned by `eta-mu-cljs-rewrite-boundary-adapters`. Tool execution concurrency is a runtime-core primitive. |

**Public export consumers inside `packages/legacy`**
- `src/agent.ts` imports `runAgentLoop`, `runAgentLoopContinue`.
- `test/agent-loop.test.ts` imports `agentLoop`, `agentLoopContinue`.
- No other legacy package imports the low-level loop functions directly.

**State machine contract**
- Outer `while (true)` loop: continues while tool calls or steering messages remain.
- Inner turn: inject steering messages, stream assistant response, execute tool batch, emit `turn_end`.
- Follow-up messages are polled only when the agent would otherwise stop.
- Tool execution strategies:
  - `sequential`: prepare → execute → finalize one tool call at a time.
  - `parallel`: prepare sequentially, then execute concurrently; `tool_execution_end` emitted in completion order, tool-result messages emitted in assistant source order.
- Termination: a tool batch terminates the agent only when **every** finalized result sets `terminate: true`.
- Error/aborted assistant turns are surfaced as assistant messages with `stopReason` `"error"` / `"aborted"`.

---

### `src/agent.ts` — 550 lines

| Field | Value |
|-------|-------|
| Proposed CLJS namespaces | `eta_mu.agent.infra.agent` (`Agent` class and lifecycle); `eta_mu.agent.domain.queue` (`PendingMessageQueue`); `eta_mu.agent.cli.facade` (stable `Agent` export) |
| Classification | `infra` + `domain` + `cli` |
| Public exports | `AgentOptions` interface, `Agent` class |
| Raw JS interop surfaces | `import { streamSimple, type SimpleStreamOptions, type Transport, type ThinkingBudgets, type Message, type Model, type AttachmentContent, type ImageContent, type InputContent } from "@open-hax/eta-mu-ai"`; `AbortController`, `Date.now()`, array mutation via getters/setters. |
| Dependencies on runtime core / boundary adapters | Delegates turn logic to `eta_mu.agent.domain.loop`. State snapshots use runtime-core envelope primitives. `streamSimple` and transport/thinking-budget options come from the AI boundary adapter. |

**Public export consumers inside `packages/legacy`**
- `packages/legacy/coding-agent` is the primary consumer:
  - `src/core/sdk.ts`: imports `Agent`, `AgentMessage`, `ThinkingLevel`.
  - `src/core/agent-session.ts`: imports `Agent`, `AgentEvent`, `AgentState`, `AppMessage`, `ThinkingLevel`, `Attachment`.
  - `src/core/messages.ts`: imports `AgentMessage`; extends `CustomMessages` via declaration merging with `BashExecutionMessage`.
  - `src/core/session-manager.ts`: imports `AgentState`, `AppMessage`.
  - `src/core/compaction/compaction.ts`: imports `AgentMessage`, `ThinkingLevel`.
  - `src/core/model-resolver.ts`: imports `ThinkingLevel`.
  - `src/cli/args.ts`: imports `ThinkingLevel`.
  - `src/modes/rpc/rpc-client.ts`: imports `AgentEvent`, `AgentMessage`, `ThinkingLevel`.
  - `src/modes/rpc/rpc-types.ts`: imports `AgentMessage`, `ThinkingLevel`.
  - `src/modes/interactive/interactive-mode.ts`: imports `AgentMessage`.
  - `src/modes/interactive/components/settings-selector.ts`, `thinking-selector.ts`: import `ThinkingLevel`.
  - `src/core/tools/*.ts` and `src/core/extensions/*.ts`: import `AgentTool`.
  - `test/*`: many test files import `Agent`, `AgentEvent`, `AgentTool`, `AgentMessage`, `ThinkingLevel`.
- `test/agent.test.ts` imports `Agent` from `src/index.js`.

**Queue behavior contract**
- `steeringQueue` (`steeringMode` default `"one-at-a-time"`): drained after the current assistant turn finishes; messages are injected before the next LLM call.
- `followUpQueue` (`followUpMode` default `"one-at-a-time"`): drained only when the agent would otherwise stop.
- `QueueMode` values: `"all"` | `"one-at-a-time"`.

**Agent lifecycle contract**
- `prompt()` starts a new run; rejects if a run is already active.
- `continue()` resumes from an existing transcript; rejects if last message is assistant unless queues provide messages.
- `subscribe()` listeners receive the active `AbortSignal` and are awaited in subscription order.
- `waitForIdle()` resolves after `agent_end` listeners settle.
- `abort()` cancels the active run via `AbortController`.
- `reset()` clears transcript, runtime state, and both queues.

---

### `src/proxy.ts` — 367 lines

| Field | Value |
|-------|-------|
| Proposed CLJS namespace | `eta_mu.agent.extern.proxy` |
| Classification | `extern` |
| Public exports | `ProxyAssistantMessageEvent`, `ProxyStreamOptions`, `streamProxy` |
| Raw JS interop surfaces | `fetch`, `ReadableStreamDefaultReader`, `TextDecoder`, `AbortSignal`/`AbortController`, `JSON.parse`, `console.warn`; `import { EventStream, parseStreamingJson, type AssistantMessage, type AssistantMessageEvent, type Context, type Model, type SimpleStreamOptions, type StopReason, type ToolCall } from "@open-hax/eta-mu-ai"` |
| Dependencies on runtime core / boundary adapters | `streamProxy` implements the same `StreamFn` contract as `streamSimple` from the AI boundary adapter. HTTP fetch/stream decoding is a boundary-adapter concern. Event reconstruction reuses provider message primitives. |

**Public export consumers inside `packages/legacy`**
- No internal legacy consumers import `streamProxy` directly. It is documented for browser/backend proxy use in `packages/legacy/agent/README.md` and is part of the public npm API.

**Proxy behavior contract**
- POSTs `{ model, context, options: ProxySerializableStreamOptions }` to `${proxyUrl}/api/stream`.
- Sends `Authorization: Bearer ${authToken}`.
- Server sends SSE-style `data:` lines with proxy events (partial field stripped).
- Client reconstructs the full `AssistantMessage` incrementally and emits `AssistantMessageEvent` objects compatible with the AI boundary adapter.
- Handles `text_*`, `thinking_*`, `toolcall_*`, `done`, and `error` events.
- On fetch/error/abort, pushes an `error` event with `stopReason` `"aborted"` or `"error"` and then ends the stream.

---

### `src/index.ts` — 8 lines

| Field | Value |
|-------|-------|
| Proposed CLJS namespace | `eta_mu.agent.cli.index` |
| Classification | `cli` |
| Public exports | Re-exports everything from `agent.js`, `agent-loop.js`, `proxy.js`, `types.js`. The public npm surface is therefore: `Agent`, `AgentOptions`, `agentLoop`, `agentLoopContinue`, `runAgentLoop`, `runAgentLoopContinue`, `streamProxy`, `ProxyStreamOptions`, `ProxyAssistantMessageEvent`, and all type interfaces from `types.ts`. |
| Raw JS interop surfaces | None (pure re-export barrel). |
| Dependencies on runtime core / boundary adapters | Aggregates `cli.facade`, `infra.stream`, `extern.proxy`, and `law.types`. |

**Public export consumers inside `packages/legacy`**
- All `coding-agent` imports from `"@open-hax/eta-mu-agent-core"` resolve through this barrel.
- `packages/legacy/agent/test/*.test.ts` import from `src/index.js` or `src/agent-loop.js`.

**Cutover plan**
- Keep `src/index.ts` as a thin TypeScript re-export facade during the rewrite.
- Each TS export delegates to the corresponding CLJS namespace via the shadow-cljs `:node-library` or `:esm` build target.
- Once all consumers are migrated and parity tests pass, delete the TS modules in path-scoped commits.

---

## Test files

### `test/agent.test.ts` — 502 lines

| Field | Value |
|-------|-------|
| Proposed CLJS namespace | `eta_mu.agent.infra.agent_test` |
| Classification | `infra` (tests) |
| Public exports under test | `Agent` (from `src/index.js`) |
| Covered behavior | Default/custom initial state, event subscription, async listener ordering, `waitForIdle`, stream-throw failure paths, abort signal forwarding, state mutators (copy-on-assign), steering/follow-up queues, concurrent-call rejection, `continue()` queue semantics, `sessionId` forwarding. |
| Dependencies | Mock `EventStream` from `@open-hax/eta-mu-ai`; requires CLJS-compatible mock stream utilities. |

### `test/agent-loop.test.ts` — 1,181 lines

| Field | Value |
|-------|-------|
| Proposed CLJS namespace | `eta_mu.agent.domain.loop_test` |
| Classification | `domain` (tests) |
| Public exports under test | `agentLoop`, `agentLoopContinue` (from `src/agent-loop.js`) |
| Covered behavior | AgentMessage event types, custom message filtering via `convertToLlm`, `transformContext` ordering, tool call execution, `beforeToolCall` mutation semantics, `prepareArguments`, parallel vs sequential execution ordering, `executionMode` per-tool override, steering message injection, terminate batch semantics, `afterToolCall` termination, `agentLoopContinue` validation. |
| Dependencies | `Type.Object`/`Type.String` from `typebox` for tool schemas; must migrate to Malli in test fixtures. |

### `test/e2e.test.ts` — 404 lines

| Field | Value |
|-------|-------|
| Proposed CLJS namespace | `eta_mu.agent.extern.e2e_test` |
| Classification | `extern` (tests) |
| Public exports under test | `Agent`, `AgentEvent` (from `src/index.js`) |
| Covered behavior | Basic prompt, tool execution, abort during streaming, lifecycle event ordering, multi-turn context, thinking content preservation, `continue()` validation and behavior from user/tool-result tails. |
| Dependencies | `registerFauxProvider`, `fauxAssistantMessage`, `fauxText`, `fauxThinking`, `fauxToolCall` from `@open-hax/eta-mu-ai`; test fixtures `calculateTool`, `getCurrentTimeTool`. |

### Test fixtures

| File | Proposed CLJS namespace | Classification | Notes |
|------|-------------------------|----------------|-------|
| `test/utils/calculate.ts` | `eta_mu.agent.test.fixtures.calculate` | `extern` (test) | Tool schema uses TypeBox; migrate to Malli. Uses `new Function` for math evaluation — keep in extern/unsafe test helper. |
| `test/utils/get-current-time.ts` | `eta_mu.agent.test.fixtures.get_current_time` | `extern` (test) | Tool schema uses TypeBox; migrate to Malli. Uses `Date`/`Intl` JS interop. |

---

## Cross-cutting dependencies on runtime core and boundary adapters

| Dependency | Where used | CLJS home / adapter needed |
|------------|------------|----------------------------|
| `@open-hax/eta-mu-ai` message/model types | `types.ts`, `agent.ts`, `agent-loop.ts`, `proxy.ts`, tests | `eta-mu-cljs-rewrite-boundary-adapters` — must expose `AssistantMessage`, `UserMessage`, `ToolResultMessage`, `Model`, `EventStream`, `streamSimple`, `validateToolArguments`, `parseStreamingJson`, faux-provider utilities. |
| `@open-hax/eta-mu-ai` provider stream events | `agent-loop.ts`, `proxy.ts` | Boundary adapter must provide `AssistantMessageEvent` union and reconstruction helpers. |
| `typebox` (`Type`, `Static`, `TSchema`) | `types.ts`, test fixtures, coding-agent tools | Replace with Malli schemas in `eta_mu.agent.law.*`; ensure `coding-agent` tool schemas can still conform to the same contract. |
| `AbortController` / `AbortSignal` | `agent.ts`, `agent-loop.ts`, `proxy.ts` | Runtime core must expose a JS-compatible cancellation primitive (or use `cljs.core.async` channels + `extern` adapter). |
| `fetch` / `ReadableStream` / `TextDecoder` | `proxy.ts` | `eta_mu.agent.extern.proxy` is the only allowed raw-JS location. |
| `Date.now()` | `agent.ts`, `agent-loop.ts`, `proxy.ts`, tests | Runtime core time utility or direct `js/Date.now` in extern/infra boundary. |

---

## Consumer heat map inside `packages/legacy`

| Consumer | Imports from `@open-hax/eta-mu-agent-core` | Notes |
|----------|----------------------------------------------|-------|
| `packages/legacy/coding-agent` (many files) | `Agent`, `AgentEvent`, `AgentMessage`, `AgentState`, `AgentTool`, `AgentToolResult`, `AppMessage`, `Attachment`, `ThinkingLevel`, `QueueMode` | Primary blocker for cutover. `AgentSession` wraps `Agent`; custom `BashExecutionMessage` extends `CustomAgentMessages`. |
| `packages/legacy/agent/test/agent.test.ts` | `Agent` | Can migrate to CLJS test runner once `Agent` facade is stable. |
| `packages/legacy/agent/test/agent-loop.test.ts` | `agentLoop`, `agentLoopContinue`; types | Domain-loop tests are the earliest parity signal. |
| `packages/legacy/agent/test/e2e.test.ts` | `Agent`, `AgentEvent` | Depends on faux provider in boundary adapters. |

---

## Recommended migration order

1. **`law.types`** — port type contracts to Malli; define `AgentMessage` extensibility hook.
2. **`extern.proxy`** — create fetch/SSE adapter with parity tests (no other raw JS allowed).
3. **`domain.loop`** — port pure loop logic; run `agent-loop.test.ts` equivalents against CLJS.
4. **`domain.queue`** — port `PendingMessageQueue`.
5. **`infra.agent`** — port `Agent` class; wire to CLJS loop and runtime state primitives.
6. **`cli.index`** — keep TS facade, delegate to CLJS builds.
7. **Cutover** — migrate `coding-agent` call sites only after parity tests pass.
