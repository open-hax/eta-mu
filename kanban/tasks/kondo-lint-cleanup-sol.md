---
uuid: "kondo-lint-cleanup-sol"
title: "Clean up clj-kondo findings in sol"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "quality", "5sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/kondo-lint-cleanup.md"
points: 5
category: "tasks"
---

# Clean up clj-kondo findings in sol

> Parent epic: `kanban/epics/kondo-lint-cleanup.md`
> Points: 5

## Purpose

Run the shared clj-kondo rules against sol and resolve every finding per the epic fix policy. Preserve the package-local `defroute` hook.

## Scope

- `packages/sol/src/cljs/**/*.cljs`
- `packages/sol/test/cljs/**/*.cljs`
- `packages/sol/test/clj/**/*.clj`

## Baseline pre-lint signal

From `docs/kondo-config-baseline.md`:

| File | Promise-chain hits | Likely long fns | js-await usage | File length flag |
|------|--------------------|-----------------|----------------|------------------|
| `src/cljs/open_hax/sol/domain/agent/agent_templates.cljs` | 0 | 1 | 0 | yes |
| `src/cljs/open_hax/sol/domain/contracts/loader.cljs` | 0 | 0 | 0 | yes |
| `src/cljs/open_hax/sol/domain/contracts/resolve.cljs` | 0 | 0 | 0 | yes |
| `src/cljs/open_hax/sol/domain/models.cljs` | 0 | 0 | 0 | yes |
| `src/cljs/open_hax/sol/domain/text.cljs` | 0 | 3 | 0 | yes |
| `src/cljs/open_hax/sol/extern/agent_message.cljs` | 0 | 1 | 0 |  |
| `src/cljs/open_hax/sol/infra/agent/stream.cljs` | 0 | 0 | 0 | yes |
| `src/cljs/open_hax/sol/infra/agent/turn.cljs` | 0 | 2 | 0 | yes |
| `src/cljs/open_hax/sol/law/contracts.cljs` | 0 | 0 | 0 | yes |
| `src/cljs/open_hax/sol/shape/app_shapes.cljs` | 0 | 1 | 0 |  |

No promise-chain or `js-await` signals. Multiple files exceed 300 lines and/or contain likely long functions.

## Work items

- [x] Run `pnpm --filter @open-hax/sol lint:kondo` and capture the full output.
- [x] For every error: fix the source.
- [x] For every warning: either fix, annotate with `#_:clj-kondo/ignore` + explanatory comment, or open a follow-on task and reference it.
- [x] Preserve the local `knoxx.backend.macros/defroute` hook in `.clj-kondo/config.edn`.
- [x] If new shared-rule findings appear in files not listed above, resolve them too.

## Acceptance criteria

- [x] `pnpm --filter @open-hax/sol lint:kondo` exits with zero errors.
- [x] All warnings are either fixed or annotated with a justification comment.
- [x] No new `#_:clj-kondo/ignore` appears without a comment.
- [x] No `js-await`/`js-await*` usage remains in source or test trees.

## Verification

```bash
pnpm install
pnpm --filter @open-hax/sol lint:kondo
```

---

## Completion

**Status:** Done.

**Lint result:**
```text
$ pnpm --filter @open-hax/sol lint:kondo
linting took 720ms, errors: 0, warnings: 0
```

**Build/test result:**
- `pnpm --filter @open-hax/sol build` — completed with 0 warnings.
- `pnpm --filter @open-hax/sol test` — 66 tests, 193 assertions, 0 failures, 0 errors.

**Summary of changes:**
- Converted `p/let` promise bindings to `^:async` helper functions + `await` in:
  - `packages/sol/src/cljs/open_hax/sol/extern/fetch.cljs`
  - `packages/sol/src/cljs/open_hax/sol/domain/contracts/client.cljs`
  - `packages/sol/src/cljs/open_hax/sol/infra/http.cljs`
- Converted `.catch` promise chain to async/await in `packages/sol/src/cljs/open_hax/sol/infra/agent/turn.cljs`.
- Converted `.finally` promise chain to async/await in `packages/sol/src/cljs/open_hax/sol/extern/eta_mu.cljs`.
- Removed unused private vars, unused bindings, and unused namespace requires across the touched files.
- Annotated two deprecated-schema references in `packages/sol/src/cljs/open_hax/sol/law/contracts.cljs` with `#_:clj-kondo/ignore` and explanatory comments.
- Preserved `packages/sol/.clj-kondo/config.edn` and the local `knoxx.backend.macros/defroute` hook / `packages/sol/.clj-kondo/hooks/defroute.clj`.
- Did not modify `packages/sol/package.json` or `packages/sol/.clj-kondo/config.edn` except for preserving the defroute hook.

**Remaining `js-await`/`js-await*`: none in `src/cljs` or `test/cljs`.

---

**Review note:** Verified clean by parent agent — `lint:kondo` exits 0 errors, 0 warnings.
