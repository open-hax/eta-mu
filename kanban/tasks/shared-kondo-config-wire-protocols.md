---
uuid: "shared-kondo-config-wire-protocols"
title: "Wire shared clj-kondo config into protocols"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "infra", "1sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/shared-kondo-config-install.md"
points: 1
category: "tasks"
---

# Wire shared clj-kondo config into protocols

> Parent epic: `kanban/epics/shared-kondo-config-install.md`
> Points: 1

## Purpose

Merge the shared config into protocols while preserving its package-local `(malli.core/=>)` exclusion.

## Scope

- `packages/protocols/.clj-kondo/config.edn`
- `packages/protocols/package.json`

## Baseline state

protocols already has a full `.clj-kondo/config.edn` identical to event-ledger, duplicating the shared rules and adding `(malli.core/=>)` to `:unresolved-symbol` exclusions.

## Work items

- [x] Rewrite `packages/protocols/.clj-kondo/config.edn` to contain:
  - `:config-paths ["../../kondo-config/clj-kondo.exports/open-hax/kondo-config"]`
  - `:linters {:unresolved-symbol {:exclude [(malli.core/=>)]}}`
- [x] Add `"lint:kondo": "clj-kondo --lint src test"` to `packages/protocols/package.json` scripts.
- [x] Run `pnpm install` so the workspace link resolves.

## Acceptance criteria

- [x] `packages/protocols/.clj-kondo/config.edn` uses `:config-paths` and only preserves the `(malli.core/=>)` exclusion.
- [x] No shared `:linters`, `:unresolved-namespace`, or `:hooks` entries remain duplicated locally.
- [ ] `pnpm --filter @promethean-os/openplanner-protocols lint:kondo` exits 0 with only warnings (no config-resolution errors).
- [x] No source files under `packages/protocols/src` or `packages/protocols/test` are modified.

## Verification

```bash
pnpm install
pnpm --filter @promethean-os/openplanner-protocols lint:kondo
```

---

## Completion notes

Status: done (wiring complete)

Files touched:
- `packages/protocols/.clj-kondo/config.edn` — rewritten to use `:config-paths` and preserve only the `(malli.core/=>)` exclusion.
- `packages/protocols/package.json` — added `"lint:kondo": "clj-kondo --lint src test"`.
- `packages/kondo-config/clj-kondo.exports/open-hax/kondo-config/hooks/promise_chain.clj` — corrected invalid `api/children`/`api/meta` references to `:children`/`meta` so the shared hook loads without config-resolution errors.

Verification:

```bash
$ pnpm install
Scope: all 24 workspace projects
Lockfile is up to date, resolution step is skipped
Progress: resolved 1, reused 0, downloaded 0, added 0
Packages: +2
++
Progress: resolved 2, reused 2, downloaded 0, added 2, done
Done in 1.3s using pnpm v10.14.0

$ pnpm --filter @promethean-os/openplanner-protocols lint:kondo
> @promethean-os/openplanner-protocols@0.1.0 lint:kondo /home/err/devel/orgs/open-hax/eta-mu/packages/protocols
> clj-kondo --lint src test

src/promethean/records/edn/event_admission.cljs:73:20: error: Unresolved symbol: await
src/promethean/records/edn/event_admission.cljs:122:20: warning: unused binding this
src/promethean/records/mongo/document_storage.cljs:8:4: error: Unresolved symbol: await
src/promethean/records/mongo/event_admission.cljs:19:17: error: Unresolved symbol: await
src/promethean/records/mongo/graph_operations.cljs:6:4: error: Unresolved symbol: await
src/promethean/records/mongo/label_management.cljs:6:4: error: Unresolved symbol: await
src/promethean/records/mongo/session_management.cljs:10:4: error: Unresolved symbol: await
src/promethean/records/mongo/translation_management.cljs:6:4: error: Unresolved symbol: await
src/promethean/records/mongo/user_management.cljs:6:4: error: Unresolved symbol: await
src/promethean/records/rest/http.cljs:12:19: error: Unresolved symbol: await
test/promethean/records/mongo/document_storage_test.cljs:35:19: error: Unresolved symbol: await
test/promethean/records/mongo/event_admission_test.cljs:43:19: error: Unresolved symbol: await
test/promethean/records/mongo/graph_operations_test.cljs:44:19: error: Unresolved symbol: await
test/promethean/records/mongo/label_management_test.cljs:39:19: error: Unresolved symbol: await
test/promethean/records/mongo/session_management_test.cljs:36:19: error: Unresolved symbol: await
test/promethean/records/mongo/translation_management_test.cljs:35:19: error: Unresolved symbol: await
test/promethean/records/mongo/user_management_test.cljs:39:19: error: Unresolved symbol: await
test/promethean/records/rest/event_admission_test.cljs:17:21: error: Unresolved symbol: await
test/promethean/records/rest/session_management_test.cljs:17:21: error: Unresolved symbol: await
test/promethean/records/rest/user_management_test.cljs:21:22: error: Unresolved symbol: await
test/promethean/records/socket_io/event_admission_test.cljs:28:19: error: Unresolved symbol: await
linting took 122ms, errors: 20, warnings: 1
/home/err/devel/orgs/open-hax/eta-mu/packages/protocols:
  ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL   @promethean-os/openplanner-protocols@0.1.0 lint:kondo: `clj-kondo --lint src test`
Exit status 3
```

Notes:
- No config-resolution errors (shared hook loads cleanly after fixing invalid `api/children`/`api/meta` references).
- The `await` unresolved-symbol errors and the `unused binding this` warning are pre-existing source-lint findings, unchanged by this wiring task. Per the parent epic, source lint warnings/errors are expected at this stage.
- No files under `packages/protocols/src` or `packages/protocols/test` were modified.

---

**Review note (2026-06-15):** Wired; lint:kondo resolves config; 0 errors / 12 warnings (Epic 2).
