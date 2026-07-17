# AI Package CLJS Rewrite — File-by-File Inventory

> Source package: `packages/legacy/ai` (`@open-hax/eta-mu-ai`)
> Generated: 2026-06-15
> Parent epic: `kanban/epics/ai-cljs-rewrite.md`

## 1. Executive Summary

`packages/legacy/ai` contains **46 TypeScript source files** (including `scripts/`). The public surface is split between the main package entry `src/index.ts`, the model catalog entry `src/models.ts`, the OAuth subpath `src/oauth.ts` (re-exporting `utils/oauth/*`), the CLI entry `src/cli.ts`, and several provider subpaths declared in `package.json`.

The rewrite target taxonomy maps cleanly to:

| TS Area | Proposed CLJS Namespace | Notes |
|---|---|---|
| Canonical message/content types | `eta_mu.ai.domain.*` | `Message`, content parts, `Context`, `Tool` |
| Provider request/response transforms | `eta_mu.ai.shape.*` | One namespace per provider family |
| Malli schemas | `eta_mu.ai.law.*` | Payload, response, model, options schemas |
| Provider SDK/fetch/OAuth interop | `eta_mu.ai.extern.*` | `openai`, `anthropic`, `google`, `bedrock`, `mistral`, `oauth` |
| Registry, retries, streaming infra | `eta_mu.ai.infra.*` | `api-registry`, `event-stream`, env keys |
| Stable TS facade / CLI | `eta_mu.ai.cli.*` | `index`, `models`, `cli`, `oauth` re-exports |

## 2. Public Entry Points and Facade Targets

| TS File | Package Export | Proposed CLJS Target | Purpose |
|---|---|---|---|
| `src/index.ts` | `@open-hax/eta-mu-ai` | `eta_mu.ai.cli.index` | Public API facade: types, registry, providers, streaming, utils |
| `src/models.ts` | `@open-hax/eta-mu-ai` | `eta_mu.ai.cli.models` | Generated model catalog lookup + cost helpers |
| `src/oauth.ts` | `@open-hax/eta-mu-ai/oauth` | `eta_mu.ai.cli.oauth` | OAuth provider registry and flows |
| `src/cli.ts` | `bin: pi-ai` | `eta_mu.ai.cli.cli` | Node CLI for OAuth login/list |
| `src/bedrock-provider.ts` | `@open-hax/eta-mu-ai/bedrock-provider` | `eta_mu.ai.cli.bedrock-provider` | Browser-safe re-export of Bedrock provider module |

## 3. File-by-File Inventory

### 3.1 Domain (canonical model / message decisions)

| File | Public Exports | Consumers inside `packages/legacy` | Provider Family | Raw JS Interop | Runtime / Boundary Dependencies |
|---|---|---|---|---|---|
| `src/types.ts` | `KnownApi`, `Api`, `KnownProvider`, `Provider`, `ThinkingLevel`, `StreamOptions`, `SimpleStreamOptions`, `StreamFunction`, `ProviderResponse`, `Message` union, content part types (`TextContent`, `ImageContent`, `AudioContent`, `ThinkingContent`, `ToolCall`, `ToolResultMessage`), `Usage`, `StopReason`, `Context`, `Tool`, `Model`, compat settings (`OpenAICompletionsCompat`, `OpenAIResponsesCompat`, `AnthropicMessagesCompat`, `OpenRouterRouting`, `VercelGatewayRouting`) | `coding-agent` (heavy use of `Message`, `Model`, `AssistantMessage`, `Usage`, `Api`, `KnownProvider`, `InputContent`, `ImageContent`, `AudioContent`, `TextContent`, `AttachmentContent`, `Transport`) | — | None | Runtime envelope patterns (analogous) |

### 3.2 Shape (provider ↔ canonical transforms)

| File | Public Exports | Consumers inside `packages/legacy` | Provider Family | Raw JS Interop | Runtime / Boundary Dependencies |
|---|---|---|---|---|---|
| `src/providers/transform-messages.ts` | `transformMessages` | All providers via `providers/*.ts` | Cross-provider | None | Depends on domain types |
| `src/providers/simple-options.ts` | `buildBaseOptions`, `clampReasoning`, `adjustMaxTokensForThinking` | All `streamSimple` providers | Cross-provider | None | Domain types |
| `src/providers/github-copilot-headers.ts` | `buildCopilotDynamicHeaders`, `hasCopilotVisionInput`, `inferCopilotInitiator` | `openai-completions.ts`, `openai-responses.ts`, `anthropic.ts` | GitHub Copilot | None | Domain `Message` |
| `src/providers/cloudflare.ts` | `isCloudflareProvider`, `resolveCloudflareBaseUrl` | `openai-completions.ts`, `scripts/generate-models.ts` | Cloudflare | `process.env` substitution | None |
| `src/providers/openai-responses-shared.ts` | `convertResponsesMessages`, `convertResponsesTools`, `processResponsesStream`, `OpenAIResponsesStreamOptions` | `openai-responses.ts`, `azure-openai-responses.ts`, `openai-codex-responses.ts` | OpenAI / Azure / Codex | `openai` SDK types | Domain types, `utils/hash`, `utils/json-parse`, `utils/audio`, `utils/sanitize-unicode` |
| `src/providers/google-shared.ts` | `convertMessages`, `convertTools`, `isThinkingPart`, `mapStopReason`, `mapToolChoice`, `retainThoughtSignature`, `requiresToolCallId` | `google.ts`, `google-gemini-cli.ts`, `google-vertex.ts` | Google / Vertex / Cloud Code Assist | `@google/genai` types | Domain types, `utils/sanitize-unicode`, `transform-messages` |

### 3.3 Law (Malli schemas)

There is currently **no dedicated schema file**. TypeBox schemas are created inline and re-exported via `src/index.ts` (`Type`, `Static`, `TSchema`). The rewrite should introduce:

- `eta_mu.ai.law.message` — Malli schemas for `Message`, content parts, `Usage`, `ToolCall`
- `eta_mu.ai.law.model` — `Model` schema + `MODELS` catalog shape
- `eta_mu.ai.law.options` — `StreamOptions`, `SimpleStreamOptions`, provider option schemas
- `eta_mu.ai.law.provider` — per-provider request/response schemas (OpenAI chat completions, OpenAI responses, Anthropic messages, Gemini, Bedrock converse, Mistral)

### 3.4 Extern (raw JS interop / SDKs / fetch / OAuth)

| File | Public Exports | Consumers inside `packages/legacy` | Provider Family | Raw JS Interop | Runtime / Boundary Dependencies |
|---|---|---|---|---|---|
| `src/providers/openai-completions.ts` | `streamOpenAICompletions`, `streamSimpleOpenAICompletions`, `OpenAICompletionsOptions`, `convertMessages` | None direct; registered via `register-builtins.ts` | OpenAI-compatible (OpenAI, Groq, Cerebras, xAI, DeepSeek, OpenRouter, Vercel Gateway, z.ai, Cloudflare, etc.) | `openai` SDK (`OpenAI`, chat completions) | Domain, `models.calculateCost`, `env-api-keys`, `utils/audio`, `utils/event-stream`, `utils/headers`, `utils/json-parse`, `utils/sanitize-unicode`, `cloudflare`, `github-copilot-headers`, `simple-options`, `transform-messages` |
| `src/providers/openai-responses.ts` | `streamOpenAIResponses`, `streamSimpleOpenAIResponses`, `OpenAIResponsesOptions` | None direct; registered via `register-builtins.ts` | OpenAI Responses API | `openai` SDK (`OpenAI`, responses) | Domain, `models.supportsXhigh`, `utils/event-stream`, `utils/headers`, `openai-responses-shared`, `simple-options`, `github-copilot-headers` |
| `src/providers/openai-codex-responses.ts` | `streamOpenAICodexResponses`, `streamSimpleOpenAICodexResponses`, `OpenAICodexResponsesOptions` | None direct; registered via `register-builtins.ts` | OpenAI Codex (ChatGPT) | `fetch`, WebSocket, `node:os` (dynamic) | Domain, `models.supportsXhigh`, `utils/event-stream`, `utils/headers`, `openai-responses-shared`, `simple-options` |
| `src/providers/azure-openai-responses.ts` | `streamAzureOpenAIResponses`, `streamSimpleAzureOpenAIResponses`, `AzureOpenAIResponsesOptions` | None direct; registered via `register-builtins.ts` | Azure OpenAI | `openai` SDK (`AzureOpenAI`) | Domain, `models.supportsXhigh`, `utils/event-stream`, `utils/headers`, `openai-responses-shared`, `simple-options` |
| `src/providers/anthropic.ts` | `streamAnthropic`, `streamSimpleAnthropic`, `AnthropicOptions`, `AnthropicEffort`, `AnthropicThinkingDisplay` | `@open-hax/eta-mu-ai/anthropic` subpath | Anthropic + Anthropic-compatible (Fireworks, MiniMax, Kimi, GitHub Copilot Claude) | `@anthropic-ai/sdk` | Domain, `models.calculateCost`, `utils/event-stream`, `utils/headers`, `utils/json-parse`, `utils/sanitize-unicode`, `github-copilot-headers`, `simple-options`, `transform-messages` |
| `src/providers/google.ts` | `streamGoogle`, `streamSimpleGoogle`, `GoogleOptions` | `@open-hax/eta-mu-ai/google` subpath | Google Generative AI | `@google/genai` (`GoogleGenAI`) | Domain, `models.calculateCost`, `utils/event-stream`, `utils/sanitize-unicode`, `google-shared`, `simple-options` |
| `src/providers/google-gemini-cli.ts` | `streamGoogleGeminiCli`, `streamSimpleGoogleGeminiCli`, `GoogleGeminiCliOptions`, `GoogleThinkingLevel`, `buildRequest`, `extractRetryDelay` | `@open-hax/eta-mu-ai/google-gemini-cli` subpath | Google Cloud Code Assist / Antigravity | `fetch` (SSE), retry logic | Domain, `models.calculateCost`, `utils/event-stream`, `utils/headers`, `utils/sanitize-unicode`, `google-shared`, `simple-options` |
| `src/providers/google-vertex.ts` | `streamGoogleVertex`, `streamSimpleGoogleVertex`, `GoogleVertexOptions` | `@open-hax/eta-mu-ai/google-vertex` subpath | Google Vertex AI | `@google/genai` (`GoogleGenAI`) | Domain, `models.calculateCost`, `utils/event-stream`, `utils/sanitize-unicode`, `google-shared`, `simple-options` |
| `src/providers/amazon-bedrock.ts` | `streamBedrock`, `streamSimpleBedrock`, `BedrockOptions`, `BedrockThinkingDisplay` | `src/bedrock-provider.ts`; `@open-hax/eta-mu-ai/bedrock-provider` | Amazon Bedrock | `@aws-sdk/client-bedrock-runtime`, `@smithy/node-http-handler`, `proxy-agent` (dynamic) | Domain, `models.calculateCost`, `utils/event-stream`, `utils/json-parse`, `utils/sanitize-unicode`, `simple-options`, `transform-messages` |
| `src/providers/mistral.ts` | `streamMistral`, `streamSimpleMistral`, `MistralOptions` | `@open-hax/eta-mu-ai/mistral` subpath | Mistral | `@mistralai/mistralai` | Domain, `models.calculateCost`, `utils/event-stream`, `utils/hash`, `utils/json-parse`, `utils/sanitize-unicode`, `simple-options`, `transform-messages` |
| `src/providers/faux.ts` | `registerFauxProvider`, `fauxAssistantMessage`, `fauxText`, `fauxThinking`, `fauxToolCall`, related types | `coding-agent` tests (many) | Faux / test | None | Domain, `api-registry`, `utils/event-stream` |

### 3.5 Infra (registry, retries, streaming, env keys)

| File | Public Exports | Consumers inside `packages/legacy` | Provider Family | Raw JS Interop | Runtime / Boundary Dependencies |
|---|---|---|---|---|---|
| `src/api-registry.ts` | `registerApiProvider`, `getApiProvider`, `getApiProviders`, `unregisterApiProviders`, `clearApiProviders`, `ApiProvider`, `ApiStreamFunction`, etc. | `src/stream.ts`, `src/providers/register-builtins.ts`, `src/providers/faux.ts`; `coding-agent` (`getApiProvider`) | Cross-provider | None | Domain types |
| `src/providers/register-builtins.ts` | `registerBuiltInApiProviders`, `resetApiProviders`, `setBedrockProviderModule`, lazy `stream*` exports | `src/stream.ts` (side-effect import) | Cross-provider | Dynamic `import()` for lazy providers | `api-registry`, all provider modules |
| `src/stream.ts` | `stream`, `complete`, `streamSimple`, `completeSimple`, `getEnvApiKey` | `coding-agent` (`streamSimple`, `completeSimple`) | Cross-provider | None | `api-registry`, `register-builtins`, `env-api-keys`, domain |
| `src/env-api-keys.ts` | `getEnvApiKey`, `findEnvKeys` | `src/stream.ts`, all providers; `coding-agent` indirectly | Cross-provider | `process.env`, dynamic `node:fs/os/path` | None |
| `src/utils/event-stream.ts` | `EventStream`, `AssistantMessageEventStream`, `createAssistantMessageEventStream` | All providers, `faux.ts`, `coding-agent` tests | Cross-provider | None | Domain types |
| `src/utils/headers.ts` | `headersToRecord` | All fetch/SSE providers, OAuth | Cross-provider | `Headers` | None |
| `src/utils/hash.ts` | `shortHash` | `openai-responses-shared.ts`, `mistral.ts` | Cross-provider | None | None |
| `src/utils/json-parse.ts` | `parseStreamingJson`, `parseJsonWithRepair`, `repairJson` | All providers | Cross-provider | `partial-json` npm package | None |
| `src/utils/audio.ts` | `audioFormatFromMimeType`, `resolveAudioFormat`, `resolveOpenAIAudioFormat` | `openai-completions.ts`, `openai-responses-shared.ts`; `coding-agent` (`audioFormatFromMimeType`) | Cross-provider | None | Domain `AudioContent` |
| `src/utils/sanitize-unicode.ts` | `sanitizeSurrogates` | All providers + shared | Cross-provider | None | None |
| `src/utils/overflow.ts` | `isContextOverflow`, `getOverflowPatterns` | `coding-agent` (`isContextOverflow`) | Cross-provider | None | Domain `AssistantMessage` |
| `src/utils/validation.ts` | `validateToolCall`, `validateToolArguments` | `coding-agent` tests/tools (via index export) | Cross-provider | `typebox` (`Compile`, `Value`) | Domain `Tool`, `ToolCall` |
| `src/utils/typebox-helpers.ts` | `StringEnum` | `coding-agent` examples/extensions | Cross-provider | `typebox` | None |

### 3.6 OAuth Extern

| File | Public Exports | Consumers inside `packages/legacy` | Provider Family | Raw JS Interop | Runtime / Boundary Dependencies |
|---|---|---|---|---|---|
| `src/utils/oauth/types.ts` | `OAuthCredentials`, `OAuthProviderId`, `OAuthLoginCallbacks`, `OAuthProviderInterface`, etc. | `coding-agent` (`OAuthCredentials`, `OAuthProvider`) | Cross-provider | None | Domain `Api`, `Model` |
| `src/utils/oauth/index.ts` | Provider registry: `getOAuthProvider`, `registerOAuthProvider`, `getOAuthProviders`, `getOAuthApiKey`, refresh helpers | `coding-agent` (registry + refresh) | Cross-provider | None | OAuth provider modules |
| `src/utils/oauth/pkce.ts` | `generatePKCE` | All OAuth providers | Cross-provider | Web Crypto API (`crypto.subtle`) | None |
| `src/utils/oauth/oauth-page.ts` | `oauthSuccessHtml`, `oauthErrorHtml` | All local-callback OAuth providers | Cross-provider | None | None |
| `src/utils/oauth/anthropic.ts` | `anthropicOAuthProvider`, `loginAnthropic`, `refreshAnthropicToken` | `coding-agent` (via registry) | Anthropic | `node:http` callback server, `fetch` PKCE | OAuth types, PKCE, oauth-page |
| `src/utils/oauth/github-copilot.ts` | `githubCopilotOAuthProvider`, `loginGitHubCopilot`, `refreshGitHubCopilotToken`, `getGitHubCopilotBaseUrl`, `normalizeDomain` | `coding-agent` (via registry) | GitHub Copilot | `fetch` device flow | OAuth types, `models.getModels` |
| `src/utils/oauth/google-gemini-cli.ts` | `geminiCliOAuthProvider`, `loginGeminiCli`, `refreshGoogleCloudToken` | `coding-agent` (via registry) | Google Cloud Code Assist | `node:http` callback server, `fetch` OAuth + onboarding LRO | OAuth types, PKCE, oauth-page |
| `src/utils/oauth/google-antigravity.ts` | `antigravityOAuthProvider`, `loginAntigravity`, `refreshAntigravityToken` | `coding-agent` (via registry) | Google Antigravity | `node:http` callback server, `fetch` OAuth | OAuth types, PKCE, oauth-page |
| `src/utils/oauth/openai-codex.ts` | `openaiCodexOAuthProvider`, `loginOpenAICodex`, `refreshOpenAICodexToken` | `coding-agent` (via registry) | OpenAI Codex / ChatGPT | `node:http` callback server, `fetch` PKCE, dynamic `node:crypto` | OAuth types, PKCE, oauth-page |

### 3.7 CLI / Scripts

| File | Public Exports | Consumers inside `packages/legacy` | Provider Family | Raw JS Interop | Runtime / Boundary Dependencies |
|---|---|---|---|---|---|
| `src/cli.ts` | default CLI (login/list) | `bin: pi-ai` | OAuth | `node:readline`, `fs` | `utils/oauth/index`, `utils/oauth/types` |
| `scripts/generate-models.ts` | none (script) | Build-time only | Catalog generation | `fetch` (models.dev, OpenRouter, Vercel AI Gateway), `fs` | Domain types, `cloudflare` constant |
| `scripts/generate-test-image.ts` | none (script) | Test data generation | — | `canvas`, `fs` | None |
| `src/models.generated.ts` | `MODELS` constant | `src/models.ts` | Generated catalog | None | Domain `Model` type |

## 4. Provider Family Interop Surface Summary

| Family | Files | Streaming | Auth | Retry / Cache | Special Notes |
|---|---|---|---|---|---|
| **OpenAI** | `openai-completions.ts`, `openai-responses.ts`, `openai-codex-responses.ts`, `openai-responses-shared.ts`, `azure-openai-responses.ts` | `openai` SDK streaming + SSE fallback for Codex | API key / OAuth for Codex | SDK retries + custom Codex retry | Codex uses custom fetch + WebSocket; supports reasoning, tool streaming, service-tier pricing |
| **Anthropic** | `anthropic.ts` | SDK streaming (`messages.create({stream:true})`) | API key / OAuth (`sk-ant-oat`) | SDK retries | Beta headers for tool streaming + interleaved thinking; Claude Code identity for OAuth |
| **Google** | `google.ts`, `google-shared.ts`, `google-gemini-cli.ts`, `google-vertex.ts` | `@google/genai` streaming + SSE for Cloud Code Assist | API key / OAuth / ADC | Custom retry for Cloud Code Assist | Thought signatures, disabled-thinking edge cases, Vertex resource scope |
| **Bedrock** | `amazon-bedrock.ts`, `bedrock-provider.ts` | AWS SDK `ConverseStreamCommand` | AWS SigV4 / bearer token / IAM / ADC | SDK-level + proxy support | Node-only via dynamic import; browser entry via `bedrock-provider.ts` |
| **Mistral** | `mistral.ts` | `@mistralai/mistralai` `chat.stream` | API key | SDK retries disabled, custom handling | 9-char tool call ID normalization |
| **OAuth** | `utils/oauth/*.ts` | — | PKCE / device code / local callback server | Token refresh | Five providers: anthropic, github-copilot, google-gemini-cli, google-antigravity, openai-codex |
| **Faux** | `faux.ts` | In-process event stream | None | None | Test-only provider used heavily by `coding-agent` tests |

## 5. Public Export Map from `src/index.ts`

| Export | Source Module | Proposed CLJS Namespace | Notes |
|---|---|---|---|
| `Type`, `Static`, `TSchema` | `typebox` | `eta_mu.ai.law.typebox` | Re-exported TypeBox symbols; replace with Malli |
| `registerApiProvider`, `getApiProvider`, `getApiProviders`, `unregisterApiProviders`, `clearApiProviders` | `api-registry.ts` | `eta_mu.ai.infra.registry` | Provider registry |
| `getEnvApiKey`, `findEnvKeys` | `env-api-keys.ts` | `eta_mu.ai.infra.env-keys` | API key resolution |
| `getModel`, `getProviders`, `getModels`, `calculateCost`, `supportsXhigh`, `modelsAreEqual` | `models.ts` | `eta_mu.ai.cli.models` | Model catalog helpers |
| Provider option types | `providers/*.ts` | `eta_mu.ai.law.options.<provider>` | Type-only exports |
| `registerFauxProvider`, `faux*`, `Faux*` | `providers/faux.ts` | `eta_mu.ai.extern.faux` | Test provider |
| `registerBuiltInApiProviders`, `resetApiProviders`, `setBedrockProviderModule` | `providers/register-builtins.ts` | `eta_mu.ai.infra.builtins` | Built-in registration |
| `stream`, `complete`, `streamSimple`, `completeSimple` | `stream.ts` | `eta_mu.ai.cli.stream` | High-level streaming API |
| `AssistantMessageEventStream`, `EventStream`, `createAssistantMessageEventStream` | `utils/event-stream.ts` | `eta_mu.ai.infra.event-stream` | Streaming primitives |
| `validateToolCall`, `validateToolArguments` | `utils/validation.ts` | `eta_mu.ai.law.validation` | Tool argument validation |
| `isContextOverflow`, `getOverflowPatterns` | `utils/overflow.ts` | `eta_mu.ai.infra.overflow` | Context overflow detection |
| `StringEnum` | `utils/typebox-helpers.ts` | `eta_mu.ai.law.schemas` | TypeBox helper; replace with Malli |
| `audioFormatFromMimeType`, `resolveAudioFormat`, `resolveOpenAIAudioFormat` | `utils/audio.ts` | `eta_mu.ai.shape.audio` | Audio format mapping |
| `parseStreamingJson`, `parseJsonWithRepair`, `repairJson` | `utils/json-parse.ts` | `eta_mu.ai.infra.json-parse` | Streaming JSON repair |
| `headersToRecord` | `utils/headers.ts` | `eta_mu.ai.infra.headers` | Header conversion |
| `shortHash` | `utils/hash.ts` | `eta_mu.ai.infra.hash` | Deterministic shortening |
| `sanitizeSurrogates` | `utils/sanitize-unicode.ts` | `eta_mu.ai.shape.sanitize` | Unicode surrogate cleanup |
| OAuth types & registry | `utils/oauth/types.ts`, `utils/oauth/index.ts` | `eta_mu.ai.oauth.*` | See OAuth section |

## 6. Consumers inside `packages/legacy`

The primary consumer is **`packages/legacy/coding-agent`**.

| AI Export | Used By (examples) |
|---|---|
| `streamSimple`, `completeSimple` | `coding-agent/src/core/sdk.ts`, `coding-agent/src/core/compaction/*.ts` |
| `getModel` | Many tests + `coding-agent/src/cli/list-models.ts`, examples |
| `modelsAreEqual`, `supportsXhigh` | `coding-agent/src/main.ts`, `coding-agent/src/core/agent-session.ts` |
| `resetApiProviders` | `coding-agent/src/core/agent-session.ts` |
| `isContextOverflow` | `coding-agent/src/core/agent-session.ts` |
| `registerFauxProvider`, `fauxAssistantMessage`, `fauxToolCall`, `fauxThinking` | Extensive test harness |
| `registerOAuthProvider`, `getOAuthProviders`, `getOAuthProvider`, `getOAuthApiKey`, `resetOAuthProviders` | `coding-agent/src/core/auth-storage.ts`, `coding-agent/src/core/model-registry.ts` |
| `OAuthCredentials`, `OAuthProvider` | `coding-agent/test/utilities.ts` |
| `EventStream`, `AssistantMessageEvent` | `coding-agent/test/agent-session-retry.test.ts` |
| `StringEnum` | `coding-agent/examples/extensions/*.ts` |
| `Type` (TypeBox) | `coding-agent/examples/extensions/hello.ts`, `sdk-codex-cache-probe-tool-loop.ts` |
| `audioFormatFromMimeType` | `coding-agent/src/cli/file-processor.ts` |
| `bedrockProviderModule` | `coding-agent/src/bun/register-bedrock.ts` |

## 7. Generated Model Catalog Integration

- **File**: `src/models.generated.ts`
- **Produced by**: `scripts/generate-models.ts` (build-time)
- **Integration point**: `src/models.ts` imports `MODELS` and builds a runtime `Map`.
- **Rewrite policy** (per epic): Do **not** regenerate during the rewrite. Preserve the generated artifact and expose it through the CLJS-backed model lookup in Phase 4.

## 8. Raw JS Interop Surface Area

| Surface | Files | CLJS Target Strategy |
|---|---|---|
| `openai` SDK | `openai-completions.ts`, `openai-responses.ts`, `azure-openai-responses.ts` | `eta_mu.ai.extern.openai` namespace with `^js` interop |
| `@anthropic-ai/sdk` | `anthropic.ts` | `eta_mu.ai.extern.anthropic` |
| `@google/genai` | `google.ts`, `google-vertex.ts` | `eta_mu.ai.extern.google` |
| `@aws-sdk/client-bedrock-runtime` | `amazon-bedrock.ts` | `eta_mu.ai.extern.bedrock` |
| `@mistralai/mistralai` | `mistral.ts` | `eta_mu.ai.extern.mistral` |
| `fetch` + SSE | `openai-codex-responses.ts`, `google-gemini-cli.ts` | `eta_mu.ai.extern.http` shared helpers |
| WebSocket | `openai-codex-responses.ts` | `eta_mu.ai.extern.websocket` |
| `node:http` callback server | OAuth providers | `eta_mu.ai.extern.node-http` (Node-only) |
| `typebox` | `utils/validation.ts`, `utils/typebox-helpers.ts` | Replace with Malli in `eta_mu.ai.law.*` |
| `partial-json` | `utils/json-parse.ts` | Keep as npm dep or vendor in `eta_mu.ai.extern.json` |

## 9. Dependencies on Runtime Core / Boundary Adapters

`packages/legacy/ai` currently has **no direct imports** of `packages/runtime`, `packages/protocols`, or `packages/event-ledger`. It is a boundary package itself. The rewrite will depend on:

- **`eta-mu-cljs-runtime-rewrite`** — envelope patterns, bus events, error encoding conventions (analogous to current `AssistantMessageEventStream` semantics).
- **`eta-mu-cljs-rewrite-boundary-adapters`** — shared HTTP/SSE/OAuth conventions, header normalization, retry policies, and Node-only module loading patterns.

Both dependencies are **future CLJS modules**; the inventory identifies where their shared helpers should replace duplicated logic (e.g., retry backoff in `google-gemini-cli.ts` and `openai-codex-responses.ts`).

## 10. Recommended Phase 2+ Targets

1. **Phase 2 — Canonical model**: Port `src/types.ts` to `eta_mu.ai.domain.*` and `eta_mu.ai.law.*` Malli schemas.
2. **Phase 3 — Extern adapters**: Port one provider family at a time, starting with `faux` and `openai-completions`, then `anthropic`, `google`, `bedrock`, `mistral`.
3. **Phase 4 — Infra/registry**: Port `api-registry.ts`, `register-builtins.ts`, `stream.ts`, `event-stream.ts`, and model lookup.
4. **Phase 5 — CLI facade**: Keep `src/index.ts`, `src/models.ts`, `src/oauth.ts`, `src/cli.ts`, `src/bedrock-provider.ts` as thin TS re-exports over CLJS implementations for backward compatibility.
