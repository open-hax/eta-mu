---
uuid: "shared-kondo-config-wire-runtime"
title: "Wire shared clj-kondo config into runtime"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "infra", "1sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/shared-kondo-config-install.md"
points: 1
category: "tasks"
---

# Wire shared clj-kondo config into runtime

> Parent epic: `kanban/epics/shared-kondo-config-install.md`
> Points: 1

## Purpose

Add a thin `.clj-kondo/config.edn` and a `lint:kondo` script to runtime so it consumes the shared rules.

## Scope

- `packages/runtime/.clj-kondo/config.edn` (new)
- `packages/runtime/package.json`

## Baseline state

runtime has no `.clj-kondo/config.edn` and no `lint:kondo` script. ClojureScript sources live under `src/cljs` and `test/cljs`.

## Work items

- [ ] Create `packages/runtime/.clj-kondo/config.edn` with:
  - `:config-paths ["../../kondo-config/clj-kondo.exports/open-hax/kondo-config"]`
- [ ] Add `"lint:kondo": "clj-kondo --lint src/cljs test/cljs"` to `packages/runtime/package.json` scripts.
- [ ] Run `pnpm install` so the workspace link resolves.

## Acceptance criteria

- [ ] `packages/runtime/.clj-kondo/config.edn` exists and uses `:config-paths`.
- [ ] `pnpm --filter @open-hax/eta-mu-runtime lint:kondo` exits 0 with only warnings (no config-resolution errors).
- [ ] No source files under `packages/runtime/src/cljs` or `packages/runtime/test/cljs` are modified.

## Verification

```bash
pnpm install
pnpm --filter @open-hax/eta-mu-runtime lint:kondo
```

---

## Completion notes

- Created `packages/runtime/.clj-kondo/config.edn` with the required `:config-paths`.
- Added `"lint:kondo": "clj-kondo --lint src/cljs test/cljs"` to `packages/runtime/package.json`.
- Ran `pnpm install`; workspace link resolved without changes.
- `pnpm --filter @open-hax/eta-mu-runtime lint:kondo` runs and resolves the shared config.
- Command exited with status 2 because clj-kondo treats source warnings as exit 2; there were 0 errors and 17 source warnings.
- Repeated WARNING lines about `cljs.core/ns` hook reading (`Could not resolve symbol: api/meta`) were emitted. These originate from the shared `packages/kondo-config/clj-kondo.exports/open-hax/kondo-config/hooks/promise_chain.clj` implementation, not from runtime's config path resolution.
- No source files under `packages/runtime/src/cljs` or `packages/runtime/test/cljs` were modified.

### Files touched

- `packages/runtime/.clj-kondo/config.edn` (new, currently untracked due to `**/.clj-kondo/` in `.gitignore`; use `git add -f` to track)
- `packages/runtime/package.json`
- `kanban/tasks/shared-kondo-config-wire-runtime.md` (this file)

### Verification output

```text
> @open-hax/eta-mu-runtime@0.1.3 lint:kondo /home/err/devel/orgs/open-hax/eta-mu/packages/runtime
> clj-kondo --lint src/cljs test/cljs

WARNING: error while trying to read hook for cljs.core/ns: Could not resolve symbol: api/meta
... (repeated for each ns form)

src/cljs/eta_mu/coding/domain/session.cljs:3:14: warning: namespace eta-mu.coding.law.session is required but never used
src/cljs/eta_mu/coding/extern/fs.cljs:2:14: warning: namespace clojure.string is required but never used
src/cljs/eta_mu/coding/extern/fs_watch.cljs:2:14: warning: namespace eta-mu.coding.extern.fs is required but never used
src/cljs/eta_mu/coding/extern/lockfile.cljs:3:14: warning: namespace eta-mu.coding.extern.path is required but never used
src/cljs/eta_mu/docs/shape/docs.cljs:23:8: warning: Unused private var eta-mu.docs.shape.docs/assoc-when-some
src/cljs/eta_mu/gate/domain/review.cljs:89:14: warning: unused binding contract
src/cljs/eta_mu/gate/domain/review.cljs:133:5: warning: unused binding contract
src/cljs/eta_mu/gate/domain/validate.cljs:19:4: warning: unused binding contract
src/cljs/eta_mu/gate/shape/markdown.cljs:50:11: warning: Redundant let expression.
test/cljs/eta_mu/coding/domain/diagnostics_test.cljs:4:14: warning: namespace eta-mu.coding.law.session is required but never used
test/cljs/eta_mu/coding/extern/fs_test.cljs:2:43: warning: #'cljs.test/testing is referred but never used
test/cljs/eta_mu/coding/extern/fs_watch_test.cljs:2:43: warning: #'cljs.test/testing is referred but never used
test/cljs/eta_mu/coding/extern/git_test.cljs:2:43: warning: #'cljs.test/testing is referred but never used
test/cljs/eta_mu/coding/extern/lockfile_test.cljs:2:43: warning: #'cljs.test/testing is referred but never used
test/cljs/eta_mu/coding/extern/process_exec_test.cljs:2:43: warning: #'cljs.test/testing is referred but never used
test/cljs/eta_mu/coding/infra/boundary_test.cljs:2:43: warning: #'cljs.test/testing is referred but never used
test/cljs/eta_mu/docs/indexer_test.cljs:3:14: warning: namespace clojure.string is required but never used
linting took 582ms, errors: 0, warnings: 17
```

### Status

Done. Config path resolves; source warnings are the only findings.

---

**Review note (2026-06-15):** Wired; lint:kondo resolves config; 0 errors / 46 warnings (Epic 2).
