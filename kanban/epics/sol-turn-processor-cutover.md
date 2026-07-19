---
category: "epics"
labels: ["epics", "cljs", "sol", "turn-processor", "decoupling"]
write-id: "1784485913107-0.o0uq4oy7aj4nb69en8"
points: "13"
source: "user-request:2026-07-17"
title: "Sol on the Turn Processor (eta-mu-cli Decoupling)"
priority: "P0"
status: "done"
uuid: "sol-turn-processor-cutover"
created_at: "2026-07-17T00:00:00Z"
---

# Sol on the Turn Processor (eta-mu-cli Decoupling)

> Unblocks: `kanban/tasks/coding-agent-cljs-rewrite-cutover-ratchet.md`
> (legacy/coding-agent cannot be deleted while sol depends on it).
> User directive 2026-07-17: sol must run on the new turn processor and be
> reachable through `eta-mu sol ...`.

## Purpose

`packages/sol` embeds the legacy `@open-hax/eta-mu-cli` SDK as its agent
runtime: `sol/extern/eta_mu.cljs` (251 LOC) builds SettingsManager,
AuthStorage, ModelRegistry, DefaultResourceLoader, SessionManager and calls
`createAgentSession`; `sol/infra/agent/mcp_tools.cljs` wraps MCP tools with
the legacy SDK's `defineTool`. This is the last hard source dependency
keeping `packages/legacy/coding-agent` alive.

Replace the legacy SDK boundary with the new stack —
`@eta-mu/turn-processor` (turn loop, law/shape) + `packages/eta-mu`
(extern.openai streaming, infra.session EDN persistence, infra.tools
registry, settings.edn) — behind sol's existing
`IAgentProviderAdapter`/`IAgentSession` protocols, and expose sol through
the eta-mu CLI as `eta-mu sol ...` (the way Rheos is exposed as
`eta-mu kanban ...`).

## Coupling inventory (verified 2026-07-17)

| Legacy surface | Used by | New-stack replacement |
|---|---|---|
| `SettingsManager` (inMemory, compaction/retry) | provider/ensure-runtime! | `settings.edn` in packages/eta-mu |
| `AuthStorage` (runtime api keys) | setup-runtime! | env tokens + settings, per openai client |
| `ModelRegistry` (+ models.json) | resolve-model | sol's own model config (proxx fetch stays) |
| `DefaultResourceLoader` (reload) | setup-runtime! | dropped (system prompt is plain assembly) |
| `SessionManager` | make-session-manager! | `eta-mu.infra.session` EDN artifacts |
| `createAgentSession` + session object | create-session! | **new turn-processor session adapter** |
| `defineTool` (TypeBox parameters) | mcp_tools.cljs | turn-processor/eta-mu tool descriptor shape |

## Task cards

1. `sol-turn-processor-session-adapter` (P0, 3sp) — IAgentSession over the
   turn-processor run-loop.
2. `sol-settings-model-decoupling` (P0, 2sp) — settings/auth/registry
   replacement; new `ensure-runtime!`.
3. `sol-mcp-tools-new-tool-shape` (P1, 1sp) — drop legacy `defineTool`.
4. `sol-provider-swap-legacy-drop` (P0, 2sp) — wire adapter in, delete the
   legacy boundary, drop the dependency.
5. `eta-mu-sol-command` (P1, 2sp) — `eta-mu sol ...` CLI surface.
6. `sol-cutover-verification` (P1, 1sp) — e2e/pty proof + cutover unblocked.

## Acceptance criteria

- [ ] No `@open-hax/eta-mu-cli` import anywhere in `packages/sol`
      (`git grep -c "eta-mu-cli" -- packages/sol` → 0).
- [ ] sol's agent sessions run on `@eta-mu/turn-processor`'s run-loop with
      the provider streamed through `packages/eta-mu`'s openai extern.
- [ ] `eta-mu sol ...` drives sol lifecycle and runs an agent turn.
- [ ] sol gates green (`pnpm --filter @open-hax/sol test` / `lint:kondo`);
      repo root build + test green; sol-backend restarts clean under pm2.
- [ ] `coding-agent-cljs-rewrite-cutover-ratchet`'s sol blocker resolved
      on the card.

---
Board triage 2026-07-19: all 6 child cards done (session-adapter, settings-model-decoupling, mcp-tools-new-tool-shape, provider-swap-legacy-drop, eta-mu-sol-command, cutover-verification). Acceptance criteria verified: git grep eta-mu-cli -- packages/sol -> 0 matches; sol runs on @eta-mu/turn-processor run-loop with eta-mu.extern.openai provider (commit 9b97958); eta-mu sol CLI surface landed (58019ae); cutover verification evidence + cutover-ratchet sol blocker resolved (d31fc99). Sol gates recorded green on child cards (88 tests / 256 assertions, kondo 0 warnings). Closing epic.
---