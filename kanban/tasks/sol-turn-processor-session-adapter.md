---
category: "tasks"
labels: ["tasks", "cljs", "sol", "turn-processor", "3sp"]
write-id: "1784323539243-0.f8t0q65xcbq0ppghlg4"
points: "3"
source: "kanban/epics/sol-turn-processor-cutover.md"
title: "Sol — Turn-Processor Session Adapter (IAgentSession over run-loop)"
priority: "P0"
status: "done"
uuid: "sol-turn-processor-session-adapter"
created_at: "2026-07-17T00:00:00Z"
---

# Sol — Turn-Processor Session Adapter (IAgentSession over run-loop)

> Parent epic: `kanban/epics/sol-turn-processor-cutover.md`
> Foundation card — every later card assumes this adapter exists.

## Purpose

`sol/shape/agent.cljs`'s `IAgentSession` is currently implemented only by
`sol/extern/eta_mu.cljs`'s `EtaMuSession`, a wrapper over the legacy SDK's
session object. Build the replacement: a stateful agent session whose turns
are driven by `@eta-mu/turn-processor`'s `infra.loop/run-loop`, so sol's
agent runtime no longer needs the legacy SDK's session machinery at all.

## Scope

- New `open-hax.sol.infra.agent.session-store`-adjacent namespace
  (suggested: `open-hax.sol.infra.agent.turn-session`) implementing
  `IAgentSession` on data + atoms:
  - message history as a CLJS atom of turn-processor-law-valid messages
    (no JS session object anywhere above the extern seam),
  - `send-user-message!` / `follow-up!` / `steer!` enqueue work onto a
    serialized turn queue (one in-flight turn; follow-ups append to the
    in-flight context, matching legacy semantics as observed, not the TS
    internals),
  - `streaming?` / `current-turn` reflect the in-flight turn future,
  - `abort!` cancels the in-flight turn (the death-spiral guard depends on
    this — it must actually halt the tool/generation loop, so the loop
    needs an abort signal threaded through run-loop: check first whether
    turn-processor's run-loop already accepts one; if not, add it there as
    a minimal, tested extension),
  - `subscribe!` fans run-loop emit events out to sol handlers,
  - `set-thinking-level!` / `set-active-tools!` update session config used
    by subsequent turns.
- Provider streaming goes through `packages/eta-mu`'s `extern.openai`
  stream-fn (same one `eta-mu agent` uses); model/auth arrive as plain
  config, not SDK singletons.

## Definition of done

- [ ] The adapter passes a CLJS test suite against a mock stream-fn:
      send → streamed turn → messages appended; follow-up mid-turn;
      steer mid-turn; abort halts a turn that would otherwise continue
      calling tools; subscribe receives the same events run-loop emits.
- [ ] No import of `@open-hax/eta-mu-cli` in the new namespace (kondo +
      a grep assertion in the test or a card comment).
- [ ] If run-loop needed an abort extension, it lands in
      `packages/turn-processor` with its own tests and green gates there.
- [ ] `pnpm --filter @eta-mu/sol test` / `lint:kondo` green;
      `pnpm -C packages/turn-processor test` green.

## Verification

```bash
pnpm --filter @eta-mu/sol test
pnpm --filter @eta-mu/sol lint:kondo
pnpm -C packages/turn-processor test

# No legacy runtime imports left in the adapter. `git grep` exits 1 on no match
# and >1 on a real error, so assert the no-match exit explicitly rather than
# swallowing every failure with `|| true`.
git grep -q "eta-mu-cli" -- packages/sol/src/cljs/open_hax/sol/infra/agent/turn_session.cljs; \
  test $? -eq 1 || { echo "legacy eta-mu-cli import still present (or grep failed)"; false; }
```