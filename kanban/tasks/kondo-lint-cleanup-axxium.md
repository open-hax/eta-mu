---
uuid: "kondo-lint-cleanup-axxium"
title: "Clean up clj-kondo findings in axxium"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "quality", "2sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/kondo-lint-cleanup.md"
points: 2
category: "tasks"
---

# Clean up clj-kondo findings in axxium

> Parent epic: `kanban/epics/kondo-lint-cleanup.md`
> Points: 2

## Purpose

Run the shared clj-kondo rules against axxium and resolve every finding per the epic fix policy.

## Scope

- `packages/axxium/src/cljs/**/*.cljs`

## Baseline pre-lint signal

From `docs/kondo-config-baseline.md`:

| File | Promise-chain hits | Likely long fns | js-await usage | File length flag |
|------|--------------------|-----------------|----------------|------------------|
| `src/cljs/axxium/db.cljs` | 0 | 1 | 0 |  |
| `src/cljs/axxium/routes/auth.cljs` | 0 | 1 | 0 |  |

No promise-chain or `js-await` signals. Two files contain likely long functions.

## Work items

- [ ] Run `pnpm --filter @open-hax/axxium lint:kondo` and capture the full output.
- [ ] For every error: fix the source.
- [ ] For every warning: either fix, annotate with `#_:clj-kondo/ignore` + explanatory comment, or open a follow-on task and reference it.
- [ ] If new shared-rule findings appear in files not listed above, resolve them too.

## Acceptance criteria

- [ ] `pnpm --filter @open-hax/axxium lint:kondo` exits with zero errors.
- [ ] All warnings are either fixed or annotated with a justification comment.
- [ ] No new `#_:clj-kondo/ignore` appears without a comment.
- [ ] No `js-await`/`js-await*` usage remains in source or test trees.

## Verification

```bash
pnpm install
pnpm --filter @open-hax/axxium lint:kondo
```

---

## Completion

- **Status**: done
- **Files modified**:
  - `packages/axxium/src/cljs/axxium/db.cljs`
  - `packages/axxium/src/cljs/axxium/auth/token.cljs`
  - `packages/axxium/src/cljs/axxium/auth/session.cljs`
  - `packages/axxium/src/cljs/axxium/routes/actor.cljs`
  - `packages/axxium/src/cljs/axxium/routes/auth.cljs`
  - `packages/axxium/src/cljs/axxium/routes/health.cljs`
  - `packages/axxium/src/cljs/axxium/server.cljs`
- **Verification output**:

```
> @open-hax/axxium@0.1.0 lint:kondo /home/err/devel/orgs/open-hax/eta-mu/packages/axxium
> clj-kondo --lint src/cljs

linting took 64ms, errors: 0, warnings: 0
```

- **Notes**: All 47 initial warnings were resolved by converting promise chains to `^:async`/`await`, removing unused requires/private vars (`axxium.schema`, `clojure.string` in token, `body-map` and `secret-key` private helpers), and extracting route handlers into named `^:async` functions. No `#_:clj-kondo/ignore` annotations were needed. No `js-await` usage remains. `pnpm --filter @open-hax/axxium typecheck` and `pnpm --filter @open-hax/axxium test` also pass.

---

**Review note:** Verified clean by parent agent — `lint:kondo` exits 0 errors, 0 warnings.
