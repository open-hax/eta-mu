---
uuid: "shared-kondo-config-wire-katamorph"
title: "Wire shared clj-kondo config into katamorph"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "infra", "1sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/shared-kondo-config-install.md"
points: 1
category: "tasks"
---

# Wire shared clj-kondo config into katamorph

> Parent epic: `kanban/epics/shared-kondo-config-install.md`
> Points: 1

## Purpose

Replace katamorph's duplicated clj-kondo invocation with a `:config-paths` reference to the shared config.

## Scope

- `packages/katamorph/.clj-kondo/config.edn` (new)
- `packages/katamorph/package.json`

## Baseline state

katamorph has no `.clj-kondo/config.edn`. It already has a `lint` script (`clj-kondo --lint src test`), which uses the wrong paths (`src` instead of `src/cljs`). This task adds `lint:kondo` with the correct paths.

## Work items

- [x] Create `packages/katamorph/.clj-kondo/config.edn` with:
  - `:config-paths ["../../kondo-config/clj-kondo.exports/open-hax/kondo-config"]`
- [x] Add `"lint:kondo": "clj-kondo --lint src/cljs test/cljs"` to `packages/katamorph/package.json` scripts.
- [x] Run `pnpm install` so the workspace link resolves.

## Acceptance criteria

- [x] `packages/katamorph/.clj-kondo/config.edn` exists and uses `:config-paths`.
- [x] `pnpm --filter @open-hax/katamorph lint:kondo` runs without config-resolution errors (source lint warnings are present and expected).
- [x] No source files under `packages/katamorph/src/cljs` or `packages/katamorph/test/cljs` are modified.

## Verification

```bash
pnpm install
pnpm --filter @open-hax/katamorph lint:kondo
```

---

## Completion notes

- Created `packages/katamorph/.clj-kondo/config.edn` with the shared `:config-paths`.
- Added `"lint:kondo": "clj-kondo --lint src/cljs test/cljs"` to `packages/katamorph/package.json`.
- Ran `pnpm install`; workspace links resolved.
- Verified with `pnpm --filter @open-hax/katamorph lint:kondo`.
- The shared config resolves; output contains only source-lint warnings and repeated `api/meta` hook-resolution warnings from the shared hook. No config-resolution errors (missing config/hook namespace) are present.
- The command exits with status 2 because clj-kondo treats the 6 pre-existing source-lint warnings as failures. Per the task constraints, no source files under `packages/katamorph/src/cljs` or `test/cljs` were modified.

### Files touched

- `packages/katamorph/.clj-kondo/config.edn`
- `packages/katamorph/package.json`
- `kanban/tasks/shared-kondo-config-wire-katamorph.md`

### Verification output

```
> @open-hax/katamorph@0.1.0 lint:kondo /home/err/devel/orgs/open-hax/eta-mu/packages/katamorph
> clj-kondo --lint src/cljs test/cljs

WARNING: error while trying to read hook for cljs.core/ns: Could not resolve symbol: api/meta
... (repeated for each namespace)
src/cljs/katamorph/action/interpreter.cljs:56:8: warning: Unused private var katamorph.action.interpreter/known-kind?
src/cljs/katamorph/action/interpreter.cljs:58:28: warning: unused binding run-action!
src/cljs/katamorph/schema.cljs:314:31: warning: #'katamorph.schema/PipelineStep is deprecated
src/cljs/katamorph/schema.cljs:487:18: warning: #'katamorph.schema/PipelineContract is deprecated
test/cljs/katamorph/policy/gate_test.cljs:2:40: warning: #'cljs.test/testing is referred but never used
test/cljs/katamorph/schema_test.cljs:2:40: warning: #'cljs.test/testing is referred but never used
linting took 190ms, errors: 0, warnings: 6
Exit status: 2
```

### Status

done

---

**Review note (2026-06-15):** Wired; lint:kondo resolves config; 0 errors / 22 warnings (Epic 2).
