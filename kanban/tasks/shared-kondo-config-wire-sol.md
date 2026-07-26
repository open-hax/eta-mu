---
uuid: "shared-kondo-config-wire-sol"
title: "Wire shared clj-kondo config into sol"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "infra", "1sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/shared-kondo-config-install.md"
points: 1
category: "tasks"
---

# Wire shared clj-kondo config into sol

> Parent epic: `kanban/epics/shared-kondo-config-install.md`
> Points: 1

## Purpose

Merge the shared config into sol while preserving its package-local `knoxx.backend.macros/defroute` hook.

## Scope

- `packages/sol/.clj-kondo/config.edn`
- `packages/sol/.clj-kondo/hooks/defroute.clj` (preserve; do not move)
- `packages/sol/package.json`

## Baseline state

sol already has a full `.clj-kondo/config.edn` that duplicates the shared `:lint-as`, `:linters`, and promise-chain `:hooks`. It also registers a local hook for `knoxx.backend.macros/defroute` backed by `hooks/defroute.clj`. The defroute hook is knoxx-specific and must stay local.

## Work items

- [ ] Rewrite `packages/sol/.clj-kondo/config.edn` to contain:
  - `:config-paths ["../../kondo-config/clj-kondo.exports/open-hax/kondo-config"]`
  - `:hooks {:analyze-call {knoxx.backend.macros/defroute hooks.defroute/defroute}}`
- [ ] Ensure `packages/sol/.clj-kondo/hooks/defroute.clj` is preserved.
- [ ] Add `"lint:kondo": "clj-kondo --lint src/cljs test/cljs"` to `packages/sol/package.json` scripts.
- [ ] Run `pnpm install` so the workspace link resolves.

## Acceptance criteria

- [ ] `packages/sol/.clj-kondo/config.edn` uses `:config-paths` and only preserves the `defroute` hook.
- [ ] No shared `:lint-as`, `:linters`, or promise-chain `:hooks` entries remain duplicated locally.
- [ ] `pnpm --filter @eta-mu/sol lint:kondo` exits 0 in full — the script now chains
      `clj-kondo` with the contract guard, so the whole command must succeed, with no
      clj-kondo errors and no config-resolution failure. (clj-kondo itself exits 2 on
      warnings, so "exits 0 with only warnings" was never a satisfiable condition.)
- [ ] No source files under `packages/sol/src/cljs` or `packages/sol/test/cljs` are modified.

## Verification

```bash
pnpm install
pnpm --filter @eta-mu/sol lint:kondo
```

---

## Completion notes

- Rewrote `packages/sol/.clj-kondo/config.edn` to use `:config-paths` pointing to the shared kondo-config export and to preserve only the local `knoxx.backend.macros/defroute` hook.
- Preserved `packages/sol/.clj-kondo/hooks/defroute.clj` (no changes).
- Added `"lint:kondo": "clj-kondo --lint src/cljs test/cljs"` to `packages/sol/package.json` scripts.
- Ran `pnpm install`; workspace link resolved.
- No source files under `packages/sol/src/cljs` or `packages/sol/test/cljs` were modified.

### Files touched

- `packages/sol/.clj-kondo/config.edn`
- `packages/sol/package.json`

### Verification output

Original run (2026-06-15, before the package rename and the sol lint cleanup)
recorded 0 errors / 20 source warnings, so clj-kondo exited 2 — no
config-resolution errors, which was the point being evidenced.

Re-run 2026-07-25 under the current package name and lint script:

```text
$ pnpm --filter @eta-mu/sol lint:kondo

> @eta-mu/sol@0.1.1 lint:kondo /home/err/spaces/eta-mu/packages/sol
> clj-kondo --lint src/cljs test/cljs && node ../../scripts/contract-guard.mjs src/cljs test/cljs

linting took 792ms, errors: 0, warnings: 0
contract-guard OK (src/cljs, test/cljs)
$ echo $?
0
```

The acceptance criterion is now fully met: the whole chained command exits 0,
with no clj-kondo errors, no source warnings, and no config-resolution failure.

### Status

done

---

**Review note (2026-06-15):** Wired; lint:kondo resolves config; 4 pre-existing errors / 23 warnings (Epic 2).
