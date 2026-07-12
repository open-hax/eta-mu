---
uuid: "ai-cljs-rewrite-phase-6-cutover-ratchet"
title: "AI CLJS Rewrite — Cutover Ratchet and TS Line-Count Reduction"
status: icebox
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "ai"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/ai-cljs-rewrite.md"
points: 1
category: "tasks"
---
# AI CLJS Rewrite — Cutover Ratchet and TS Line-Count Reduction

> Parent epic: `kanban/epics/ai-cljs-rewrite.md`
> Phase: 6
> Points: 1

## Purpose

Remove obsolete TypeScript provider modules only after parity tests pass and ensure the TS line count for `packages/legacy/ai` decreases monotonically.

## Scope

- Obsolete provider modules identified by earlier phases.
- Line-count tracking per provider family.
- Pre-commit TS line-count guard.

## Work items

- [ ] Delete TS provider modules that have CLJS replacements with passing tests.
- [ ] Record per-provider TS line-count reduction.
- [ ] Verify the pre-commit hook (`scripts/pre-commit-ts-guard.sh`) does not reject the commit.

## Acceptance criteria

- [ ] TypeScript line count for `packages/legacy/ai` decreases monotonically.
- [ ] No provider is removed before its parity tests pass.
- [ ] `node scripts/ts-line-count.mjs packages/legacy/ai` reports a reduced count.

## Verification

```bash
node scripts/ts-line-count.mjs packages/legacy/ai
pnpm --filter @open-hax/eta-mu-ai test
pnpm --filter @open-hax/eta-mu-ai typecheck
```

---
Status updated to blocked: waiting for Phase 5 CLI/test parity.
---
