---
uuid: "kondo-lint-cleanup-Rheos"
title: "Clean up clj-kondo findings in Rheos"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "quality", "1sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/kondo-lint-cleanup.md"
points: 1
category: "tasks"
---

# Clean up clj-kondo findings in Rheos

> Parent epic: `kanban/epics/kondo-lint-cleanup.md`
> Points: 1

## Purpose

Run the shared clj-kondo rules against Rheos and resolve every finding per the epic fix policy.

## Scope

- `packages/Rheos/src/**/*.cljs`
- `packages/Rheos/test/**/*.cljs`

## Baseline pre-lint signal

From `docs/kondo-config-baseline.md`:

| File | Promise-chain hits | Likely long fns | js-await usage | File length flag |
|------|--------------------|-----------------|----------------|------------------|
| `src/rheos/backend/infra/http_server.cljs` | 0 | 0 | 0 | yes |

No promise-chain or `js-await` signals. One file exceeds 300 lines and is the primary watch surface.

## Work items

- [x] Run `pnpm --filter @open-hax/kanban-cljs lint:kondo` and capture the full output.
- [x] For every error: fix the source.
- [x] For every warning: either fix, annotate with `#_:clj-kondo/ignore` + explanatory comment, or open a follow-on task and reference it.
- [x] If new shared-rule findings appear in files not listed above, resolve them too.

## Acceptance criteria

- [x] `pnpm --filter @open-hax/kanban-cljs lint:kondo` exits with zero errors.
- [x] All warnings are either fixed or annotated with a justification comment.
- [x] No new `#_:clj-kondo/ignore` appears without a comment.
- [x] No `js-await`/`js-await*` usage remains in source or test trees.

## Verification

```bash
pnpm install
pnpm --filter @open-hax/kanban-cljs lint:kondo
```

---

## Completion log

### Files modified

- `packages/kondo-config/clj-kondo.exports/open-hax/kondo-config/config.edn` — added `helix.core/defnc` lint-as rule so component definitions resolve correctly.
- `packages/Rheos/src/rheos/backend/domain/events.cljs` — converted `record!` and `query-events` to `^:async` + bare `await`.
- `packages/Rheos/src/rheos/backend/infra/watcher.cljs` — converted `handle-file-change` to `^:async` + bare `await`; removed local `fs` alias binding.
- `packages/Rheos/src/rheos/ui/domain/layout.cljs` — converted `move-task!`, live refetch, and all mount/filter/detail effects to `^:async` + bare `await`.
- `packages/Rheos/src/rheos/ui/domain/sidebar.cljs` — converted `handle-save` to `^:async` + bare `await`.
- `packages/Rheos/src/rheos/ui/infra/api.cljs` — converted `fetch-json` to `^:async` + bare `await`.
- `packages/Rheos/src/rheos/ui/infra/chat_session.cljs` — converted `post-json` and `send-message` start flow to `^:async` + bare `await`.
- `packages/Rheos/test/rheos/backend/law/fsm_test.cljs` — converted `run-gate-passes-through-non-command-checks` to `^:async` + bare `await`.

### Verification

```bash
pnpm --filter @open-hax/kanban-cljs lint:kondo
```

Output:

```
> @open-hax/kanban-cljs@0.1.0 lint:kondo /home/err/devel/orgs/open-hax/eta-mu/packages/Rheos
> clj-kondo --lint src test

linting took 243ms, errors: 0, warnings: 0
```

### Status

Done. `clj-kondo` exits with zero errors and zero warnings. No `#_:clj-kondo/ignore` annotations were added.

---

**Review note:** Verified clean by parent agent — `lint:kondo` exits 0 errors, 0 warnings.
