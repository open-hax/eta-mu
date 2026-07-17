---
category: "tasks"
labels: ["tasks", "cljs", "sol", "decoupling", "2sp"]
points: "2"
source: "kanban/epics/sol-turn-processor-cutover.md"
title: "Sol — Provider Swap and Legacy Dependency Drop"
priority: "P0"
status: "blocked"
uuid: "sol-provider-swap-legacy-drop"
created_at: "2026-07-17T00:00:00Z"
---

# Sol — Provider Swap and Legacy Dependency Drop

> Parent epic: `kanban/epics/sol-turn-processor-cutover.md`
> Blocked on: `sol-turn-processor-session-adapter`,
> `sol-settings-model-decoupling`, `sol-mcp-tools-new-tool-shape`.

## Purpose

Wire the new turn-processor-backed provider into sol's
`IAgentProviderAdapter` in place of the legacy adapter, delete the legacy
boundary namespaces, and remove `@open-hax/eta-mu-cli` from
`packages/sol/package.json` — the moment sol stops being a consumer of
`packages/legacy/coding-agent`.

## Scope

- New provider adapter record (suggested:
  `open-hax.sol.infra.agent.provider.turn-processor`) implementing
  `IAgentProviderAdapter` over the session adapter and the decoupled
  config; swap it in at the provider construction site
  (`infra.agent.runtime` / wherever `eta-mu-provider` is built).
- Delete `open-hax/sol/extern/eta_mu.cljs` and
  `open-hax/sol/infra/agent/provider/eta_mu.cljs` (the legacy boundary),
  after a final grep confirms no other sol namespace references them.
- Remove the `@open-hax/eta-mu-cli` dependency from
  `packages/sol/package.json`; `pnpm install` stays green.
- Media materialization hook (`media-materialize-hook` in the legacy
  boundary) is re-homed next to the session adapter if sol still uses it —
  check `infra.agent.stream`/turn for callers first; do not silently drop
  media support.

## Definition of done

- [ ] `git grep -c "eta-mu-cli" -- packages/sol` → 0.
- [ ] sol gates green: `pnpm --filter @open-hax/sol test` / `lint:kondo`;
      repo root `pnpm build` / `pnpm test` green.
- [ ] `sol-backend` restarts under pm2 with the new stack and answers a
      health check (recorded in a card comment).
- [ ] A comment on `coding-agent-cljs-rewrite-cutover-ratchet` records
      that sol is no longer a legacy/coding-agent consumer.

## Verification

```bash
pnpm install
pnpm --filter @open-hax/sol test && pnpm --filter @open-hax/sol lint:kondo
pnpm build && pnpm test
pm2 restart sol-backend && pm2 describe sol-backend | head -20
git grep -c "eta-mu-cli" -- packages/sol  # → 0
```
