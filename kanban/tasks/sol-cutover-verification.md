---
category: "tasks"
labels: ["tasks", "cljs", "sol", "e2e", "1sp"]
write-id: "1784340393207-0.sa5uhgenghjzduk605z"
points: "1"
source: "kanban/epics/sol-turn-processor-cutover.md"
title: "Sol Cutover Verification and Cutover-Ratchet Unblock"
priority: "P1"
status: "done"
uuid: "sol-cutover-verification"
created_at: "2026-07-17T00:00:00Z"
---

# Sol Cutover Verification and Cutover-Ratchet Unblock

> Parent epic: `kanban/epics/sol-turn-processor-cutover.md`
> Blocked on: `sol-provider-swap-legacy-drop`, `eta-mu-sol-command`.

## Purpose

Close the loop on the sol cutover with adversarial and end-to-end evidence,
and mark the legacy retirement card unblocked on its sol blocker.

## Scope

- Run an ultracode adversarial review wave (`.ημ/workflows/`, single-card
  variant) over the sol decoupling diff before promoting
  `sol-provider-swap-legacy-drop` to done; fix confirmed findings first.
- End-to-end proof recorded on this card:
  - `eta-mu sol agent` turn against the mock SSE server with the full
    event stream captured (tool call + streamed reply),
  - `sol-backend` under pm2 restarted on the new stack, health check green,
  - death-spiral guard exercised once against a scripted runaway turn
    (abort actually halts it) — the one behavior that must never regress.
- Update `coding-agent-cljs-rewrite-cutover-ratchet`: comment that the sol
  blocker is resolved; the only remaining blockers are the CI automation
  migrations recorded there.

## Definition of done

- [ ] Review wave result written to `.ημ/runs/` with zero confirmed
      findings outstanding (or findings fixed and re-verified).
- [ ] The three e2e proofs are recorded as card comments with artifacts.
- [ ] Cutover-ratchet card updated; this epic's acceptance criteria all
      checked.

## Verification

```bash
bb scripts/ultra.bb run .ημ/workflows/review-sol-cutover.edn
pm2 restart sol-backend && curl -s <sol health endpoint>
git grep -c "eta-mu-cli" -- packages/sol  # → 0
```