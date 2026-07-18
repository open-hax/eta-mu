---
category: "tasks"
labels: ["tasks", "cljs", "sol", "decoupling", "2sp"]
write-id: "1784335049832-0.6ga39gsrob33t93e6cu"
points: "2"
source: "kanban/epics/sol-turn-processor-cutover.md"
title: "Sol — Provider Swap and Legacy Dependency Drop"
priority: "P0"
status: "done"
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

---
Scoped plan (implementation slice):
1. New open-hax.sol.infra.agent.provider.turn-processor: IAgentProviderAdapter over turn-session/make-session, wiring eta-mu.turn-processor.infra.loop/run-loop + eta-mu.extern.openai/stream-chat + shape.message/messages->openai + eta-mu.infra.tools.registry built-ins; model resolution via decoupled domain.models/models-config + provider-auth (settings card).
2. deps.edn gains ../turn-processor/src/cljs + ../eta-mu/src/cljs paths (classpath for the real run-loop/stream-fn).
3. Media hook re-homed to infra.agent.media as a tool-execute wrapper (run-loop after-tool-call is sync, materialize! is async); mcp-tools preserves image/audio items in :details :content-parts so the hook has its legacy contract.
4. infra.agent.session swaps provider construction; turn.cljs/transcript.cljs read the adapter's CLJS events/messages (keyword :type, turn-processor message maps); build-user-content emits CLJS input parts.
5. Delete extern/eta_mu.cljs, provider/eta_mu.cljs, extern/eta_mu_test.cljs, test/js stub; drop @open-hax/eta-mu-cli from package.json + shadow-cljs.edn keep-as-import/resolve; docs updated so git grep eta-mu-cli -> 0.
Known behavior deltas to record at completion: bash/read tools run in process cwd (no workspace-root threading); thinking-level is accepted but not forwarded to the wire (stream-chat has no reasoning knob); multimodal parts are text placeholders on the wire per turn-processor stance.

ATTEMPT 3 GATES GREEN 2026-07-17: turn-stream-test fixtures migrated to the CLJS run-loop event contract (:message_update with :assistant-message-event #js {:type text_delta :partial <cumulative cljs assistant message>}; :message_end with keyword :role :assistant) matching eta-mu.turn-processor.infra.loop + eta-mu.extern.openai. pnpm --filter @open-hax/sol test: 88 tests, 256 assertions, 0 failures. lint:kondo 0 errors 0 warnings. git grep eta-mu-cli -- packages/sol: 0 matches. Root pnpm build + pnpm test green. Ratchet-card comment recorded on coding-agent-cljs-rewrite-cutover-ratchet. PM2 CAVEAT (DoD item 3): the live pm2 sol-backend (id 3) runs from /home/err/devel/orgs/open-hax/eta-mu/packages/sol, a separate checkout that still carries the legacy stack; its /health answers ok but serves old code. Re-pointing pm2 at this workspace (pm2 delete + pm2 start packages/sol/ecosystem.config.cjs, needs a server-dev watch for dist-dev/server.js) is an operational decision left for the user — not claimed done here.
---