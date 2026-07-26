---
uuid: "sol-turn-session-late-control-messages"
title: "Sol TurnSession drops steer/follow-up messages queued late in a turn"
status: "incoming"
priority: "P2"
labels: ["tasks", "sol", "turn-processor", "cljs", "2sp"]
created_at: "2026-07-25T00:00:00Z"
source: "CodeRabbit review on PR #142 (turn_session.cljs 162-171)"
points: 2
category: "tasks"
---

# Sol TurnSession drops steer/follow-up messages queued late in a turn

`run-queued-turn!` in
`packages/sol/src/cljs/open_hax/sol/infra/agent/turn_session.cljs` clears both
control queues in its `finally`. A `steer!` or `follow-up!` that lands *after*
the run-loop's last `get-steering-messages` / `get-follow-up-messages` drain but
*before* the turn settles therefore resolves `nil` while its message is silently
discarded — no turn ever sees it.

This is a genuine lost-write window, not a lint nit: the caller gets a
successful-looking resolution for a message that was thrown away.

## Scope

- [ ] Re-enqueue leftover queue contents as a fresh turn instead of clearing
      them, or reject the late `steer!`/`follow-up!` promise so the caller
      learns its message was not accepted. Silently resolving `nil` is the one
      option to rule out.
- [ ] Decide the semantics deliberately and record it: a late steer arguably
      *should* start a new turn (that is what the caller asked for), whereas a
      late follow-up may be safe to drop if the turn already ended.
- [ ] Test the race directly: queue a control message after the final drain and
      assert it is either delivered to a subsequent turn or explicitly rejected.

## Notes

Related to the abort-boundary work in
`packages/turn-processor/src/cljs/eta_mu/turn_processor/infra/loop.cljs`, where
`drain-continuation` now declines to consume the control queues once the abort
signal has fired — deliberately leaving queued messages intact rather than
draining and discarding them. The session side should be equally careful.

## Definition of done

- [ ] No code path resolves a `steer!`/`follow-up!` promise with the message
      discarded.
- [ ] `pnpm --filter @eta-mu/sol test` / `lint:kondo` green.

## Verification

```bash
pnpm --filter @eta-mu/sol test
pnpm --filter @eta-mu/sol lint:kondo
```
