---
uuid: "fsm-build-gate-rewrites-a-checked-in-generated-file-from-live-network-data"
title: "FSM build gate rewrites a checked-in generated file from live network data"
status: "incoming"
type: "task"
priority: "P1"
points: "2"
labels: "tasks, kanban, bug"
category: "tasks"
write-id: "1786069771683-0.jmiuilvqnvj3v55uejy"
created_at: "2026-08-07T02:29:31.683Z"
---

# FSM build gate rewrites a checked-in generated file from live network data

## Symptom

Moving any card `in_progress -> review` runs the promethean FSM's build gate
(`pnpm build`, `pnpm lint`, `pnpm test` — see `rheos.backend.law.fsm/promethean-fsm`).
`pnpm test` regenerates `packages/legacy/ai/src/models.generated.ts` from live
provider data, leaving the working tree dirty with a +2541/-982 diff in a
package unrelated to whatever the card touched.

Observed 2026-08-06 while moving `kanban-cli-status-validation-bug` to review.

## Why it matters

1. **Every agent that moves a card inherits unrelated churn.** The house rule
   is to leave the primary tree clean; the sanctioned transition mechanism
   makes that impossible without a manual `git checkout --` afterwards, which
   an agent only knows to do if it already knows about this.
2. **It violates the TypeScript deprecation policy.** `packages/legacy/` must
   not increase in total line count; the gate grows it by ~1500 lines on every
   transition.
3. **The output is nondeterministic.** It depends on what providers published
   that day, so the checked-in file's contents are a function of when someone
   last moved a card — not of any decision anyone made.

## Scope

- [ ] Make the generator write to a build artifact, or gate regeneration behind
      an explicit flag (`UPDATE_MODELS=1`), so `pnpm test` is read-only with
      respect to the working tree.
- [ ] Add a check that fails if `pnpm test` leaves the tree dirty — the
      enforcement, without which this regresses.

## Related

`pnpm gates` already scrubs provider env vars so gates see CI's empty
environment; the FSM build gate does **not**, so an exported `OPENAI_API_KEY`
independently refuses the transition. Same surface, likely the same fix — see
`scripts/ci-gates.bb` `scrub-patterns`. Both were noted in PR #182 and not
fixed. Card the scrubbing half separately if the fixes diverge.

## Verification

```bash
git status --short                       # clean
eta-mu kanban status-update <card> --to review
git status --short                       # must still be clean
```
