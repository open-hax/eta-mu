---
category: "tasks"
labels: ["tasks", "cljs", "sol", "settings", "2sp"]
write-id: "1784325680236-0.hey6vky6kmupqlkrzx9"
points: "2"
source: "kanban/epics/sol-turn-processor-cutover.md"
title: "Sol — Settings/Auth/Model Decoupling (kill SettingsManager, AuthStorage, ModelRegistry, ResourceLoader)"
priority: "P0"
status: "done"
uuid: "sol-settings-model-decoupling"
created_at: "2026-07-17T00:00:00Z"
---

# Sol — Settings/Auth/Model Decoupling

> Parent epic: `kanban/epics/sol-turn-processor-cutover.md`
> Pairs with `sol-turn-processor-session-adapter` (the adapter consumes the
> plain config this card produces).

## Purpose

`sol/extern/eta_mu.cljs`'s `setup-runtime!` exists to construct four legacy
SDK objects: `SettingsManager` (compaction/retry policy), `AuthStorage`
(per-provider runtime keys), `ModelRegistry` (models.json catalog),
`DefaultResourceLoader` (prompt/resource assembly). The new stack has no
such objects — settings are `settings.edn`, keys are env/flags, models are
plain config, and prompts are assembled in plain code. Replace the
construction with data, and re-implement `ensure-runtime!` /
`resolve-model` against it.

## Scope

- Compaction + retry policy moves into sol's own config map (same defaults:
  enabled, reserveTokens 16384, keepRecentTokens 20000, retry maxRetries 1)
  and is consumed by the session adapter's context management, not an SDK.
- Provider auth: keep the existing behavior — `:proxx-auth-token` from
  config plus per-provider env vars from `:provider-auth-tokens` — but read
  them into a plain config map passed to the openai extern per call
  (`:api-key` / `:base-url`), replacing `.setRuntimeApiKey`.
- `models.json` writing stays (sol already fetches proxx model ids);
  `resolve-model` becomes a plain lookup over that data with the same
  fallback chain (explicit provider → proxx → proxx fallback id).
- `DefaultResourceLoader.reload()` is dropped; document in a card comment
  what it actually fed the session (system prompt / resources) and where
  that assembly now lives.
- `runtimeDir` (`:agent-dir`) stays as sol's data dir; session persistence
  points at `eta-mu.infra.session`-compatible EDN artifacts if sessions are
  persisted there (else record why sol keeps its own store).

## Definition of done

- [x] `ensure-runtime!` and `resolve-model` are re-implemented without any
      legacy SDK class; their behavior is covered by CLJS tests (fallback
      chain, env token resolution, compaction defaults).
- [x] A comment on this card records the ResourceLoader audit (what it
      loaded, and the replacement home for each item).
- [x] `pnpm --filter @open-hax/sol test` / `lint:kondo` green.

## Verification

```bash
pnpm --filter @open-hax/sol test
pnpm --filter @open-hax/sol lint:kondo
```

---
ResourceLoader audit + decoupling record (implemented 2026-07-17).

WHAT DefaultResourceLoader.reload() FED THE SESSION (legacy/coding-agent resource-loader.ts, sdk.ts, agent-session.ts):
1. getSystemPrompt — base system prompt; sol overrode it per session via :system-prompt. Replacement home: plain assembly — agent-spec-system-prompt in infra/agent/session.cljs, turn_session :system-prompt dep; default text is config :agent-system-prompt.
2. getAppendSystemPrompt — append-prompt list; sol passed the opt through but never populated it. Replacement: :append-system-prompt pass-through (unchanged, plain data).
3. getAgentsFiles — AGENTS.md/CLAUDE.md from agentDir + cwd ancestors injected into the system prompt. Replacement: dropped; sol never surfaced them beyond SDK defaults. If context files are wanted later they belong in front of the turn as plain prompt assembly (context injection), not a resource loader.
4. getSkills — slash-command skill prompts in the system prompt. Not used by sol's HTTP turn surface; dropped.
5. getPrompts — prompt templates (slash commands). Sol has no slash-command surface; dropped.
6. getExtensions — extension runtime/tools. Replacement: sol tools are explicit — name allowlist + MCP custom tools (infra/agent/mcp_tools.cljs); new tool shape is card sol-mcp-tools-new-tool-shape.
7. getThemes — interactive TUI only; never used by sol; dropped.
8. SettingsManager handle inside the loader — replaced by plain policy data: domain.agent.settings/context-policy (compaction defaults enabled/16384/20000, retry maxRetries 1 preserved).

AUTH + REGISTRY REPLACEMENT: AuthStorage/.setRuntimeApiKey -> domain.agent.settings/provider-auth: plain {provider-id {:api-key :base-url}} map (proxx from :proxx-auth-token, per-provider env vars from :provider-auth-tokens resolved via extern.process/env-var), shaped for the openai extern per call. ModelRegistry.find -> domain.models/find-model, a plain lookup over the models.json data ensure-runtime! writes, same fallback chain (explicit provider -> proxx -> proxx fallback id).

SESSION PERSISTENCE (runtimeDir bullet): :agent-dir stays sol's data dir (models.json only — auth.json died with AuthStorage). Sessions were never persisted under agent-dir (legacy SessionManager was .inMemory); sol's persisted session/run state lives in its own EDN store at .ημ/sol/sessions/ (infra/agent/session_store.cljs) because that store serves the /api/agent/* control plane (KnoxxRun wire shape + event ledgers), not turn-processor transcripts — that is why sol keeps its own store. eta-mu.infra.session EDN artifacts remain the CLI transcript format; adopting them is the provider-swap card's call.

BOUNDARY FOLLOW-UP RESOLVED 2026-07-25: `domain/models.cljs` no longer reads
`js/process.env`. `enrich-config` accepts an injected environment lookup;
`infra/core.cljs` and `bootstrap.cljs` supply `extern.process/env-var`, and
domain tests use deterministic lookup maps.

### Interim state

extern/create-session! no longer passes authStorage/modelRegistry/resourceLoader/settingsManager to legacy createAgentSession (resolved model now goes as clj->js data); legacy session construction is degraded until sol-provider-swap-legacy-drop wires the turn-processor adapter in.
