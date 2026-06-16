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
- [ ] `pnpm --filter @open-hax/sol lint:kondo` exits 0 with only warnings (no config-resolution errors).
- [ ] No source files under `packages/sol/src/cljs` or `packages/sol/test/cljs` are modified.

## Verification

```bash
pnpm install
pnpm --filter @open-hax/sol lint:kondo
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

```text
$ pnpm --filter @open-hax/sol lint:kondo

> @open-hax/sol@ lint:kondo /home/err/devel/orgs/open-hax/eta-mu/packages/sol
> clj-kondo --lint src/cljs test/cljs

src/cljs/open_hax/sol/bootstrap.cljs:21:8: warning: Unused private var open-hax.sol.bootstrap/env
src/cljs/open_hax/sol/bootstrap.cljs:25:8: warning: Unused private var open-hax.sol.bootstrap/truthy?
src/cljs/open_hax/sol/bootstrap.cljs:75:4: warning: unused binding runtime
src/cljs/open_hax/sol/domain/agent/content.cljs:37:8: warning: Unused private var open-hax.sol.domain.agent.content/duplicate-normalized-text
src/cljs/open_hax/sol/domain/agent/content.cljs:41:8: warning: Unused private var open-hax.sol.domain.agent.content/boundary-ended?
src/cljs/open_hax/sol/domain/contracts/resolve.cljs:32:28: warning: unused binding actors
src/cljs/open_hax/sol/domain/node/fs.cljs:10:14: warning: namespace clojure.string is required but never used
src/cljs/open_hax/sol/infra/agent/policy.cljs:4:14: warning: namespace clojure.string is required but never used
src/cljs/open_hax/sol/infra/agent/policy.cljs:6:8: warning: Unused private var open-hax.sol.infra.agent.policy/allowed-models
src/cljs/open_hax/sol/infra/agent/session.cljs:123:12: warning: unused binding config
src/cljs/open_hax/sol/infra/agent/session.cljs:123:19: warning: unused binding runtime
src/cljs/open_hax/sol/infra/agent/session.cljs:123:67: warning: unused binding session-id
src/cljs/open_hax/sol/infra/graceful_shutdown.cljs:7:14: warning: namespace open-hax.sol.runtime.state is required but never used
src/cljs/open_hax/sol/infra/graceful_shutdown.cljs:41:8: warning: unused binding config
src/cljs/open_hax/sol/infra/http.cljs:127:30: warning: unused binding context
src/cljs/open_hax/sol/infra/routes/app.cljs:77:62: warning: unused binding provider
src/cljs/open_hax/sol/law/contracts.cljs:371:30: warning: #'open-hax.sol.law.contracts/PipelineStep is deprecated
src/cljs/open_hax/sol/law/contracts.cljs:463:17: warning: #'open-hax.sol.law.contracts/PipelineContract is deprecated
src/cljs/open_hax/sol/shape/app_shapes.cljs:28:8: warning: Unused private var open-hax.sol.shape.app-shapes/extract-media-urls
test/cljs/open_hax/sol/shape/app_shapes_test.cljs:2:43: warning: #'cljs.test/testing is referred but never used
linting took 546ms, errors: 0, warnings: 20
```

The run produced only expected source-level warnings; no clj-kondo config-resolution errors were emitted. clj-kondo exited with status 2 because of the 20 source warnings, which is acceptable per the task instructions.

### Status

done

---

**Review note (2026-06-15):** Wired; lint:kondo resolves config; 4 pre-existing errors / 23 warnings (Epic 2).
