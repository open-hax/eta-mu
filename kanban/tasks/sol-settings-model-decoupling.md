---
category: "tasks"
labels: ["tasks", "cljs", "sol", "settings", "2sp"]
points: "2"
source: "kanban/epics/sol-turn-processor-cutover.md"
title: "Sol — Settings/Auth/Model Decoupling (kill SettingsManager, AuthStorage, ModelRegistry, ResourceLoader)"
priority: "P0"
status: "breakdown"
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

- [ ] `ensure-runtime!` and `resolve-model` are re-implemented without any
      legacy SDK class; their behavior is covered by CLJS tests (fallback
      chain, env token resolution, compaction defaults).
- [ ] A comment on this card records the ResourceLoader audit (what it
      loaded, and the replacement home for each item).
- [ ] `pnpm --filter @open-hax/sol test` / `lint:kondo` green.

## Verification

```bash
pnpm --filter @open-hax/sol test
pnpm --filter @open-hax/sol lint:kondo
```
