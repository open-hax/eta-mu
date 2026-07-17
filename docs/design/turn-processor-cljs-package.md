# Turn Processor Package

> Package: `packages/turn-processor` (npm: `@eta-mu/turn-processor`)
> Purpose: General-purpose agent turn-loop engine without UI or provider-specific I/O.

## Scope

This package owns the agent turn-loop engine that drives a single model call,
tool execution, and result finalization. It is intentionally provider- and
UI-agnostic.

### In scope

- Canonical message, tool, and context schemas (`law.*`).
- Pure turn decisions: tool-call extraction, execution-mode selection,
  missing-tool handling, tool-result finalization, batch termination,
  next-action selection (`domain.turn`).
- Shape morphisms between canonical AgentMessages and OpenAI-compatible chat
  DTOs (`shape.message`, `shape.tool`).
- Async turn-loop orchestration (`infra.loop`).

### Out of scope

- LLM provider adapters (HTTP, streaming, token accounting details).
- Session persistence, TUI, or web UI.
- Agent workflow orchestration above a single loop.

## Namespace map

| Layer | Namespace | Responsibility |
|-------|-----------|----------------|
| law | `eta-mu.turn-processor.law.message` | Message/content schemas |
| law | `eta-mu.turn-processor.law.tool` | Tool descriptor schemas |
| law | `eta-mu.turn-processor.law.agent` | Agent context/config schemas |
| domain | `eta-mu.turn-processor.domain.turn` | Pure turn decisions |
| shape | `eta-mu.turn-processor.shape.message` | AgentMessage ↔ OpenAI DTO |
| shape | `eta-mu.turn-processor.shape.tool` | Tool descriptor ↔ OpenAI function |
| infra | `eta-mu.turn-processor.infra.loop` | Async turn-loop orchestration |

## Key contracts

### `run-loop` contract

```clojure
(run-loop context config emit stream-fn) -> Promise<AgentMessage[]>
```

- `context` — `AgentContext` with `:system-prompt`, `:messages`, `:tools`.
- `config` — map with `:model`, `:convert-to-llm`, optional `:tool-execution`,
  `:before-tool-call`, `:after-tool-call`, `:get-steering-messages`,
  `:get-follow-up-messages`, `:api-key`.
- `emit` — async event sink `(event -> Promise<nil>)`.
- `stream-fn` — `(model llm-context options) -> stream` where the stream has
  `.next()` and `.result()` methods returning promises.

### Stream contract

A stream is a JS object with:
- `.next()` -> `Promise<{done: boolean, value?: event}>`
- `.result()` -> `Promise<AssistantMessage>`

### Event types

- `:agent_start`, `:agent_end`
- `:turn_start`, `:turn_end`
- `:message_start`, `:message_end`, `:message_update`
- `:tool_execution_start`, `:tool_execution_update`, `:tool_execution_end`

### Execution mode

`domain.turn/execution-mode` selects `:sequential` or `:parallel` based on:
- explicit `:tool-execution` config value, or
- any tool in the batch declaring `:execution-mode :sequential`.

## Usage example

```clojure
(require '[eta-mu.turn-processor.infra.loop :as loop])
(require '[eta-mu.turn-processor.shape.message :as shape.msg])

(def stream-fn
  (fn [model llm-context options]
    ;; provider-specific stream implementation
    ))

(def context
  {:system-prompt "You are a helpful assistant."
   :messages [{:role :user :content "Hi" :timestamp 0}]
   :tools [{:name "echo" :label "Echo" :description "Echoes input" :parameters [:map]}]})

(def config
  {:model {:id "gpt-4o" :provider "openai"}
   :convert-to-llm shape.msg/messages->openai
   :api-key "sk-..."})

(println (await (loop/run-loop context config emit stream-fn)))
```

## Verification

```bash
pnpm --dir packages/turn-processor test
pnpm --dir packages/turn-processor build
pnpm --dir packages/turn-processor exec clj-kondo --lint src test
```

## Migration notes

This package replaces `packages/legacy/agent/src/agent-loop.ts` and
`packages/legacy/agent/src/types.ts`. The legacy `AgentLoopConfig` is split into:
- pure config passed to `run-loop`,
- provider-specific `stream-fn` supplied by the caller (e.g. `packages/eta-mu`
  or a future LLM-provider package).

No TypeScript remains in this package.
