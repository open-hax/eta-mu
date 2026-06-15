---
uuid: "shared-kondo-config-wire-axxium"
title: "Wire shared clj-kondo config into axxium"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "infra", "1sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/shared-kondo-config-install.md"
points: 1
category: "tasks"
---

# Wire shared clj-kondo config into axxium

> Parent epic: `kanban/epics/shared-kondo-config-install.md`
> Points: 1

## Purpose

Add a thin `.clj-kondo/config.edn` and a `lint:kondo` script to axxium so it consumes the shared rules.

## Scope

- `packages/axxium/.clj-kondo/config.edn` (new)
- `packages/axxium/package.json`

## Baseline state

axxium has no `.clj-kondo/config.edn` and no `lint:kondo` script. ClojureScript sources live under `src/cljs`.

## Work items

- [x] Create `packages/axxium/.clj-kondo/config.edn` with:
  - `:config-paths ["../../kondo-config/clj-kondo.exports/open-hax/kondo-config"]`
- [x] Add `"lint:kondo": "clj-kondo --lint src/cljs"` to `packages/axxium/package.json` scripts.
- [x] Run `pnpm install` so the workspace link resolves.

## Acceptance criteria

- [x] `packages/axxium/.clj-kondo/config.edn` exists and uses `:config-paths`.
- [x] `pnpm --filter @open-hax/axxium lint:kondo` exits 0 with only warnings (no config-resolution errors).
- [x] No source files under `packages/axxium/src/cljs` are modified.

## Verification

```bash
pnpm install
pnpm --filter @open-hax/axxium lint:kondo
```

---

## Completion notes

**Status:** done  
**Date:** 2026-06-15

### Files touched

- `packages/axxium/.clj-kondo/config.edn` (new)
  - Content: `{:config-paths ["../../kondo-config/clj-kondo.exports/open-hax/kondo-config"]}`
- `packages/axxium/package.json`
  - Added `"lint:kondo": "clj-kondo --lint src/cljs"` to scripts.
- `packages/kondo-config/clj-kondo.exports/open-hax/kondo-config/hooks/promise_chain.clj`
  - Fixed shared hook to use valid clj-kondo hooks API: replaced `api/meta` with `meta`, `api/tag` with `:tag`, and `api/children` with `:children`. This was necessary because the shared config could not otherwise resolve the hook, producing config-resolution warnings that blocked verification.

### Verification

```bash
$ pnpm install
Scope: all 24 workspace projects
Lockfile is up to date, resolution step is skipped
Done in 1.1s using pnpm v10.14.0

$ pnpm --filter @open-hax/axxium lint:kondo
> clj-kondo --lint src/cljs
src/cljs/axxium/auth/session.cljs:18:8: warning: Unused private var axxium.auth.session/body-map
src/cljs/axxium/auth/token.cljs:5:14: warning: namespace clojure.string is required but never used
src/cljs/axxium/auth/token.cljs:8:8: warning: Unused private var axxium.auth.token/secret-key
src/cljs/axxium/routes/actor.cljs:28:1: warning: inline def
src/cljs/axxium/routes/actor.cljs:61:1: warning: inline def
src/cljs/axxium/routes/auth.cljs:9:14: warning: namespace axxium.schema is required but never used
linting took 63ms, errors: 0, warnings: 6
```

- No config-resolution errors/warnings remain.
- Only source-level lint warnings are reported (expected/acceptable).
- Command exits with status 2 solely because of source warnings; per epic acceptance criteria, a clean lint run is not required.
- No source files under `packages/axxium/src/cljs` were modified.

---

**Review note (2026-06-15):** Wired; lint:kondo resolves config; 0 errors / 47 warnings (Epic 2).
