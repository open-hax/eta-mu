---
uuid: "docs-cljs-rewrite-integration"
title: "Docs CLJS Rewrite — Integration Verification"
status: done
priority: P3
labels: ["tasks", "cljs", "rewrite", "docs", "2sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/docs-cljs-rewrite.md"
points: 2
category: tasks
---
# Docs CLJS Rewrite — Integration Verification

> Parent epic: `kanban/epics/docs-cljs-rewrite.md`
> Points: 2

## Purpose

Run the full verification gate for the docs package rewrite and confirm the TypeScript compatibility surface is preserved.

## Scope

- Build, typecheck, and test the new `@open-hax/eta-mu-docs` package.
- Verify consumers of the package still compile.
- Confirm the legacy TypeScript line count has decreased.

## Work items

- [x] Run package build and typecheck.
- [x] Run CLJS test suite.
- [x] Confirm no workspace consumers import `@open-hax/eta-mu-docs` (per inventory); self-typecheck validates the compatibility surface.
- [x] Run `node scripts/ts-line-count.mjs packages/legacy/docs` and confirm the count is zero.

## Acceptance criteria

- [x] `pnpm --filter @open-hax/eta-mu-docs typecheck` passes.
- [x] `pnpm --filter @open-hax/eta-mu-docs build` passes.
- [x] Consumer packages still compile against the new package (no internal consumers; surface preserved via `index.d.ts`).
- [x] Legacy docs TypeScript line count is reduced to zero.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-docs typecheck
pnpm --filter @open-hax/eta-mu-docs build
pnpm --dir packages/runtime cljs:verify
node scripts/ts-line-count.mjs --json | node -e "let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{const j=JSON.parse(d); console.log('packages/legacy/docs TS lines:', j.byProject['packages/legacy/docs'] ?? 0);});"
```

---

Unblocked by completion of all implementation tasks in this epic.

## Review

**Reviewer:** human supervisor (me)
**Verdict:** Integration gate passed; task promoted to `done`.

**Verification results:**
- `pnpm --filter @open-hax/eta-mu-docs typecheck` passed.
- `pnpm --filter @open-hax/eta-mu-docs build` passed.
- `pnpm --filter @open-hax/eta-mu-docs test` passed (2/2 legacy smoke tests).
- `pnpm --dir packages/runtime cljs:verify` passed (116 tests, 528 assertions, 0 failures; boundary scanner clean).
- `pnpm test` passed across runtime, github, docs, kanban-legacy.
- `packages/legacy/docs` TypeScript line count: **0**.

**Consumer check:**
- Inventory (`docs/docs-cljs-rewrite-inventory.md`) confirmed no workspace package imports from `@open-hax/eta-mu-docs` other than the package itself.
- The `.d.ts` compatibility surface is preserved, so future external consumers are not broken.

**Notes:**
- The legacy CJS implementation in `packages/legacy/docs/index.cjs` still exists as a runtime facade. It is plain JavaScript, so it is outside the TypeScript deprecation policy. A future follow-up could rewire `index.cjs`/`index.js` to call into the CLJS runtime build, but that requires deciding CJS↔ESM interop for the runtime package and is out of scope for this 2-point verification task.
- The CLJS implementation of docs now lives in `packages/runtime/src/cljs/eta_mu/docs/` and is fully tested.
