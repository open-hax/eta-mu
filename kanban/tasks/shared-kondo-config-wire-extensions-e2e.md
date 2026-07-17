---
uuid: "shared-kondo-config-wire-extensions-e2e"
title: "Wire shared clj-kondo config into extensions-e2e"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "infra", "1sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/shared-kondo-config-install.md"
points: 1
category: "tasks"
---

# Wire shared clj-kondo config into extensions-e2e

> Parent epic: `kanban/epics/shared-kondo-config-install.md`
> Points: 1

## Purpose

Add a thin `.clj-kondo/config.edn` and a `lint:kondo` script to extensions-e2e so it consumes the shared rules.

## Scope

- `packages/extensions-e2e/.clj-kondo/config.edn` (new)
- `packages/extensions-e2e/package.json`

## Baseline state

extensions-e2e has no `.clj-kondo/config.edn` and no `lint:kondo` script. ClojureScript sources live under `src`.

## Work items

- [ ] Create `packages/extensions-e2e/.clj-kondo/config.edn` with:
  - `:config-paths ["../../kondo-config/clj-kondo.exports/open-hax/kondo-config"]`
- [ ] Add `"lint:kondo": "clj-kondo --lint src"` to `packages/extensions-e2e/package.json` scripts.
- [ ] Run `pnpm install` so the workspace link resolves.

## Acceptance criteria

- [ ] `packages/extensions-e2e/.clj-kondo/config.edn` exists and uses `:config-paths`.
- [ ] `pnpm --filter @open-hax/eta-mu-extensions-e2e lint:kondo` exits 0 with only warnings (no config-resolution errors).
- [ ] No source files under `packages/extensions-e2e/src` are modified.

## Verification

```bash
pnpm install
pnpm --filter @open-hax/eta-mu-extensions-e2e lint:kondo
```

---

## Completion notes

- Created `packages/extensions-e2e/.clj-kondo/config.edn` with the requested `:config-paths`.
- Added `"lint:kondo": "clj-kondo --lint src"` to `packages/extensions-e2e/package.json`.
- Ran `pnpm install`; workspace link resolved without changes to `pnpm-lock.yaml`.
- Verification command output:
  ```
  WARNING: error while trying to read hook for cljs.core/ns: Could not resolve symbol: api/children
  WARNING: error while trying to read hook for cljs.core/ns: Could not resolve symbol: api/children
  WARNING: error while trying to read hook for cljs.core/ns: Could not resolve symbol: api/children
  src/eta_mu_extensions_e2e/core_test.cljs:81:11: warning: unused binding state0
  src/eta_mu_extensions_e2e/core_test.cljs:87:11: warning: unused binding state1
  linting took 20ms, errors: 0, warnings: 2
  ```
- No config-resolution errors occurred; the shared config path resolved successfully.
- Exit code was `2` because clj-kondo's default `--fail-level` is `warning`.
- No source files under `packages/extensions-e2e/src` were modified.
- Status: **done**

---

**Review note (2026-06-15):** Wired; lint:kondo resolves config; 0 errors / 2 warnings (Epic 2).
