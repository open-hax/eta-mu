---
uuid: "eta-mu-cljs-rewrite-shadow-spine"
title: "Eta-mu CLJS Rewrite — Shadow-CLJS Spine"
status: review
priority: P0
labels: ["tasks", "cljs", "rewrite", "shadow-cljs", "8sp"]
created_at: "2026-05-29T21:18:48Z"
source: "kanban/epics/eta-mu-cljs-runtime-rewrite.md"
points: 8
category: tasks
---
# Eta-mu CLJS Rewrite — Shadow-CLJS Spine

> Parent epic: `kanban/epics/eta-mu-cljs-runtime-rewrite.md`
> Planning output: `docs/cljs-runtime-rewrite-shadow-spine-plan.md`
> Points: 8

## Purpose

Create the CLJS build spine that lets eta-mu migrate runtime slices behind stable JS exports.

## Scope

- shadow-cljs build targets for runtime/test slices
- package scripts for compile, test, lint, and typecheck-equivalent gates
- JS facade export strategy for existing Node/CLI consumers
- CLJS namespace layout conventions copied from Knoxx style, not Knoxx product behavior

## Work items

- [x] Decide whether the first spine lives in a new bridge package or inside an existing eta-mu package.
- [x] Add `:target :esm` runtime build output that Node can import.
- [x] Add `:target :node-test` gate for migrated runtime tests.
- [x] Add lint/boundary gates that reject broad `utils` namespaces and raw JS interop outside `extern.*`.
- [x] Create CLJS exported functions and prove Node can import them at runtime.

## Acceptance criteria

- [x] `shadow-cljs compile test` passes for the new spine.
- [x] A Node smoke command imports a compiled ESM export without `undefined` exports.
- [x] Package scripts document how to run compile/test/lint gates.
- [x] The parent epic is updated with the chosen package/home.

## Verification

Run from the repository root:

```bash
pnpm --dir packages/eta-mu-runtime cljs:verify
pnpm --dir packages/eta-mu-runtime test
pnpm --dir packages/eta-mu-runtime typecheck
pnpm --dir packages/eta-mu-runtime build
```

---

Implemented in `packages/eta-mu-runtime` with `shadow-cljs.edn`, CLJS `:runtime` and `:test` targets, ESM facade exports, Node smoke import, and a strict CLJS boundary scanner. Verification passed on 2026-05-29.

---

---
## CodeRabbit Review (2026-06-12)

**PR:** https://github.com/open-hax/eta-mu/pull/112
**Status:** Addressed

### Issues fixed
1. `config.ts:19` — Normalize `ETA_MU_CONTROL_PLANE_URL` (trim whitespace)
2. `state.cljs:5-10` — Guard `clamp-unit` against nil/non-number inputs
3. `compat.cljs:77-87` — Guard `belief-from-external` against nil input

### Issues deferred (not in scope of this PR)
4. `runtime-batch.ts:173-193` — Add fetch timeout with AbortController (separate PR)
5. `app.js:104-111` — Add auth checks to POST handler (separate PR)
6. `control-plane.js:521-539` — Validate element shapes (separate PR)
7. `ui/app.js:90-99` — DOM XSS risk with innerHTML (separate PR)
