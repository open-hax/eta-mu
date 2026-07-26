---
uuid: "ultra-workflow-failure-signalling"
title: "ultra.bb: signal workflow failure through exit code and pre-dispatch FSM hops"
status: "incoming"
priority: "P2"
labels: ["tasks", "ultra", "babashka", "workflow", "1sp"]
created_at: "2026-07-25T00:00:00Z"
source: "PR #142 review verification (pr-142-review-should-fix-batch)"
points: 1
category: "tasks"
---

# ultra.bb: signal workflow failure through exit code and pre-dispatch FSM hops

Two failure-signalling gaps in `scripts/ultra.bb`, found while verifying the
PR #142 review findings. Both are adjacent to findings that were fixed there
(`:failed-dispatch` / `:failed-commit` / `:failed-promotion` statuses and the
`run-stages` early halt), but neither was itself part of the reviewed set.

## Scope

1. **`run-workflow` always exits 0.** It prints per-stage statuses and writes the
   result EDN, but never sets a non-zero exit code — so a halted or failed run is
   indistinguishable from a clean one to any caller (CI, a wrapper script, a
   parent agent). Exit non-zero when any stage output has a `failed-*` status.

2. **Pre-dispatch `card-fsm!` hops discard their return values.** The
   `ready` → `todo` → `in_progress` hops before dispatch are called for effect
   only; `card-fsm!` returns `false` on a rejected transition or timeout, and a
   rejection is logged but does not stop the stage. The post-implementation hops
   (`review` → `document` → `done`) already gate on their return values via
   `:failed-promotion`. Make the pre-dispatch hops consistent: a rejected
   `in_progress` transition means the card is not in a state the workflow may
   implement against, so the stage should fail rather than proceed.

## Definition of done

- [ ] A workflow run containing any `failed-*` stage exits non-zero.
- [ ] A rejected pre-dispatch FSM hop fails the stage instead of only logging.
- [ ] `scripts/ultra_test.bb` covers both (exit code and rejected pre-hop).

## Verification

```bash
bb scripts/ultra_test.bb
```
