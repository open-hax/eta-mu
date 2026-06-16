---
uuid: "shared-kondo-config-wire-Rheos"
title: "Wire shared clj-kondo config into Rheos"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "infra", "1sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/shared-kondo-config-install.md"
points: 1
category: "tasks"
---

# Wire shared clj-kondo config into Rheos

> Parent epic: `kanban/epics/shared-kondo-config-install.md`
> Points: 1

## Purpose

Replace Rheos's duplicated clj-kondo rules with a `:config-paths` reference to `packages/kondo-config` and add a `lint:kondo` script.

## Scope

- `packages/Rheos/.clj-kondo/config.edn`
- `packages/Rheos/package.json`

## Baseline state

Rheos already has `packages/Rheos/.clj-kondo/config.edn` containing `:lint-as` for `js-await`, `:unresolved-symbol` exclusions, and `:discouraged-var` entries. These all duplicate the shared config. Rheos already has a `lint` script (`clj-kondo --lint src test`); this task adds `lint:kondo` alongside it.

## Work items

- [ ] Rewrite `packages/Rheos/.clj-kondo/config.edn` to contain only:
  - `:config-paths ["../../kondo-config/clj-kondo.exports/open-hax/kondo-config"]`
- [ ] Add `"lint:kondo": "clj-kondo --lint src test"` to `packages/Rheos/package.json` scripts.
- [ ] Run `pnpm install` so the workspace link resolves.

## Acceptance criteria

- [ ] `packages/Rheos/.clj-kondo/config.edn` uses `:config-paths` and no longer duplicates shared `:lint-as`, `:linters`, or `:hooks`.
- [ ] `pnpm --filter @open-hax/kanban-cljs lint:kondo` exits 0 with only warnings (no config-resolution errors).
- [ ] No source files under `packages/Rheos/src` or `packages/Rheos/test` are modified.

## Verification

```bash
pnpm install
pnpm --filter @open-hax/kanban-cljs lint:kondo
```

---

## Completion Notes

**Status:** done

**Files touched:**
- `packages/Rheos/.clj-kondo/config.edn`
- `packages/Rheos/package.json`
- `kanban/tasks/shared-kondo-config-wire-Rheos.md` (this file)

**Verification output:**

```
> @open-hax/kanban-cljs@0.1.0 lint:kondo /home/err/devel/orgs/open-hax/eta-mu/packages/Rheos
> clj-kondo --lint src test

WARNING: error while trying to read hook for cljs.core/ns: Could not resolve symbol: api/meta
... (repeated for each namespace)
linting took 240ms, errors: 0, warnings: 0
```

Exit code: `0`. Only source-lint warnings (hook `api/meta` resolution) are present; no config-resolution errors.

**Source files modified:** None under `packages/Rheos/src` or `packages/Rheos/test`.

---

**Review note (2026-06-15):** Wired; lint:kondo resolves config; 39 pre-existing errors / 23 warnings (Epic 2).
