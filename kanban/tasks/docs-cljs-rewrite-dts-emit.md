---
uuid: "docs-cljs-rewrite-dts-emit"
title: "Docs CLJS Rewrite — TypeScript Declaration Emit"
status: done
priority: P3
labels: ["tasks", "cljs", "rewrite", "docs", "3sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/docs-cljs-rewrite.md"
points: 3
category: tasks
---
# Docs CLJS Rewrite — TypeScript Declaration Emit

<!-- status=in_progress: work started on hand-curated .d.ts, package.json exports/build scripts, and smoke test. -->

---

> Parent epic: `kanban/epics/docs-cljs-rewrite.md`
> Points: 3

## Purpose

Configure the new `@open-hax/eta-mu-docs` CLJS package to emit TypeScript declarations that preserve the original `index.d.ts` compatibility surface.

## Scope

- shadow-cljs `:npm-module` or `:esm` target configuration
- TypeScript declaration generation (manual `.d.ts` or via build tool)
- `package.json` `main`, `module`, `types`, and `exports` fields
- Re-export of public functions/types

## Work items

- [x] Set up package structure under `packages/eta-mu-docs/` (or reuse `packages/legacy/docs/` if chosen).
- [x] Configure shadow-cljs build to emit JS and optionally `.d.ts` stubs.
- [x] Write/hand-curate `index.d.ts` that mirrors the legacy exports.
- [x] Update `package.json` so consumers resolve the new entry points.

## Acceptance criteria

- [x] `pnpm --filter @open-hax/eta-mu-docs build` succeeds.
- [x] `pnpm --filter @open-hax/eta-mu-docs typecheck` passes.
- [x] Consumer packages that import `@open-hax/eta-mu-docs` still typecheck.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-docs build
pnpm --filter @open-hax/eta-mu-docs typecheck
node scripts/ts-line-count.mjs packages/legacy/docs
```

---

Blocked by `docs-cljs-rewrite-inventory` and `docs-cljs-rewrite-schemas`: declaration emit depends on the chosen package shape and on the finalized public types/Malli schemas.

---

<!-- status=review: delivered hand-curated index.d.ts mirroring the legacy public surface and the new CLJS record shapes; updated package.json with typecheck/build scripts and typescript devDependency; added public-API smoke test. Verification: pnpm typecheck/build/test all pass; TS line count unchanged. Next recommended task: docs-cljs-rewrite-io-indexing (unblocked now that dts-emit and markdown-parser can land). -->
