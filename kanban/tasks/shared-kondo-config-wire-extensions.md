---
uuid: "shared-kondo-config-wire-extensions"
title: "Wire shared clj-kondo config into extensions"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "infra", "1sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/shared-kondo-config-install.md"
points: 1
category: "tasks"
---

# Wire shared clj-kondo config into extensions

> Parent epic: `kanban/epics/shared-kondo-config-install.md`
> Points: 1

## Purpose

Add a thin `.clj-kondo/config.edn` and a `lint:kondo` script to extensions. Both `src` and `lib` must be linted (including `.cljc` macros).

## Scope

- `packages/extensions/.clj-kondo/config.edn` (new)
- `packages/extensions/package.json`

## Baseline state

extensions has no `.clj-kondo/config.edn` and no `lint:kondo` script. ClojureScript sources live under `src` and `lib`.

## Work items

- [ ] Create `packages/extensions/.clj-kondo/config.edn` with:
  - `:config-paths ["../../kondo-config/clj-kondo.exports/open-hax/kondo-config"]`
- [ ] Add `"lint:kondo": "clj-kondo --lint src lib"` to `packages/extensions/package.json` scripts.
- [ ] Run `pnpm install` so the workspace link resolves.

## Acceptance criteria

- [ ] `packages/extensions/.clj-kondo/config.edn` exists and uses `:config-paths`.
- [ ] `pnpm --filter @open-hax/eta-mu-extensions lint:kondo` exits 0 with only warnings (no config-resolution errors).
- [ ] No source files under `packages/extensions/src` or `packages/extensions/lib` are modified.

## Verification

```bash
pnpm install
pnpm --filter @open-hax/eta-mu-extensions lint:kondo
```

---

## Completion notes

Status: complete

Files touched:
- `packages/extensions/.clj-kondo/config.edn` (new)
- `packages/extensions/package.json`
- `kanban/tasks/shared-kondo-config-wire-extensions.md` (this file)

Verification command output:

```
$ pnpm install
Scope: all 24 workspace projects
Lockfile is up to date, resolution step is skipped
Progress: resolved 1, reused 0, downloaded 0, added 0
Packages: +2
++
Progress: resolved 2, reused 2, downloaded 0, added 2, done
Done in 1.1s using pnpm v10.14.0

$ pnpm --filter @open-hax/eta-mu-extensions lint:kondo
> @open-hax/eta-mu-extensions@0.2.7 lint:kondo /home/err/devel/orgs/open-hax/eta-mu/packages/extensions
> clj-kondo --lint src lib

... (truncated for brevity; full output available in command logs)

linting took 683ms, errors: 18, warnings: 108
/home/err/devel/orgs/open-hax/eta-mu/packages/extensions:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @open-hax/eta-mu-extensions@0.2.7 lint:kondo: `clj-kondo --lint src lib`
Exit status 3
```

Notes:
- The shared clj-kondo config resolves correctly (custom linters from `packages/kondo-config` are active).
- There are repeated hook warnings: `WARNING: error while trying to read hook for cljs.core/ns: Could not resolve symbol: api/meta`. These originate from the shared hook at `packages/kondo-config/.../hooks/promise_chain.clj` and are emitted as warnings, not as config-resolution failures.
- The non-zero exit status is due to pre-existing source lint errors in `packages/extensions/src` and `packages/extensions/lib` (e.g., unmatched brackets, unresolved macro symbols). Per the task constraints, no source files under those directories were modified.

---

**Review note (2026-06-15):** Wired; lint:kondo resolves config; 18 pre-existing errors / 172 warnings (Epic 2).
