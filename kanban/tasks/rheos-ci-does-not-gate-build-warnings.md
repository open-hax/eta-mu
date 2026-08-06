---
uuid: "rheos-ci-does-not-gate-build-warnings"
title: "rheos CI does not gate build warnings"
status: "incoming"
type: "task"
priority: "P2"
points: "2"
labels: "rheos, ci, quality"
category: "tasks"
write-id: "1786049737260-0.02lts6yjtu1qxx3uvl4l"
created_at: "2026-08-06T20:55:37.260Z"
---

# rheos CI does not gate build warnings

## Outcome

A shadow-cljs compiler warning in `packages/rheos` fails CI, the way it already
does for `sol` and `axxium`.

## The evidence

On 2026-08-06 a `:infer-warning` reached `main`:

```
------ WARNING #1 - :infer-warning ------
 task_store.cljs:101:9
 Cannot infer target type in expression (. st isSymbolicLink)
```

It was introduced by the symlink-containment fix on #158, merged, and only
found afterwards. Under `:advanced` the call compiles to a munged name.

Nothing gates it:

- the `rheos` job (`rheos.yml`) runs `test` and `lint:kondo` — it never builds;
- `rheos-github-sync` does run `pnpm --dir packages/rheos build`, but ignores
  compiler warnings entirely.

Both `sol-ci.yml` and `axxium-ci.yml` already do the right thing — they `tee`
the build log and fail on any `WARNING` line. rheos is the outlier, and
`CLAUDE.md` states the repo-wide expectation of zero warnings.

## Scope

- Add a build step to the `rheos` job that fails on `WARNING`, matching the
  pattern sol and axxium use.
- Decide whether `rheos-github-sync` should also gate, or whether one gating
  job is enough now that `rheos` builds.
- Remove the deliberate divergence note in `scripts/ci-gates.bb`, whose rheos
  gate currently checks build warnings *because* CI does not. Once CI gates,
  the local runner goes back to being a plain mirror.

## Acceptance criteria

- Reintroducing the `^js` hint removal on `entry-kind` fails the `rheos` CI job.
- A clean build still passes, with all four targets at 0 warnings.
- `pnpm gates --only rheos` and the `rheos` CI job agree on the same result.

## Notes

Found by `pnpm gates` after the local rheos gate was given a warning check.
The fix for the warning itself is #178.
