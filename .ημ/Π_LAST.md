# Π Last Handoff — feat/kanban-comments-parity (workspace build + test green)

- timestamp: 20260614T033718Z
- branch: feat/kanban-comments-parity
- pre-commit-head: f9bbf21489d092dbac7e4dabed74f551d358fd31
- scope: unbreak the full workspace build + tests after the kanban CLJS migration left it red
- verification: `pnpm build` exit 0 (all 26 projects); `pnpm test` + per-package tests green

## Why this Π

The kanban-cljs migration cards were marked **done** but the workspace `pnpm build`
was red in 7 places and `pnpm test` could not pass. This snapshot makes both green.

## Build/test fixes (owned this session)

- **kanban-cljs build** — fixed in the **openplanner** submodule (separate repo, PR #89,
  commit `a4774e8`): `create-edn-event-admission` used `(await (ensure-dir! …))` in a
  non-`^:async` factory whose callers consume the return value as the admission instance,
  not a promise. Swapped for synchronous `fs.mkdirSync` (also closes a dir-creation race);
  dropped the unused `ensure-dir!`.
- **coding-agent/src/core/model-resolver.ts** — removed orphaned `proxx: "mimo-v2.5-pro"`
  entry in `Record<KnownProvider, string>`. `proxx` is in neither `KnownProvider` nor the
  generated model registry; it was added in kanban migration commit `e985e66`.
- **tui/package.json** + **pods/package.json (@open-hax/pi)** — added missing `@types/node`
  (`^24.3.0`); both packages had zero node types, breaking every `process`/`fs`/`Buffer` ref.
- **chat-ui/package.json** — `marked ^12 → ^4.3.0`. marked ≥5 uses `#private` class fields
  that shadow-cljs's Closure compiler cannot parse. Call site `(marked content)` is
  API-compatible across v4/v12.
- **services/agentd/package.json** — aligned the lone fastify-v4 package to v5
  (`fastify ^5`, `@fastify/cors ^11`, `@fastify/websocket ^11`); v5 types from the other
  9 packages were leaking in and clashing with its v4 plugin types. Code uses only
  v4/v5-common APIs, so no source change.
- **eta-mu-github/src/cli.ts** — dropped invalid `shell: true` option on `execSync`
  (`shell` must be a string there; execSync always uses a shell anyway).
- **kanban-cljs/package.json** — test script ran a stale `target/test.cjs` (3 days old)
  while shadow now emits `dist/test.js`. Tests were actually passing via `:autorun`
  (32 tests / 79 assertions, 0 failures); fixed the path. Removed the stale artifact.
- **pnpm-lock.yaml** — reflects the dep changes above.

## Concurrent / pre-existing dirt absorbed (full-state snapshot per user request)

These were already modified at session start (not produced by the build/test work) and
are included because the user asked for a full working-state Π:

- `pnpm-workspace.yaml` — adds `@parcel/watcher`, `canvas`, `msgpackr-extract` to
  `onlyBuiltDependencies`.
- `packages/coding-agent/package.json` — version bump `0.70.16 → 0.70.17-beta`.
- `kanban/tasks/eta-mu-quality-ratchet-cli-startup-smoke.md` — card edit (+8/-3).
- `packages/opencode-reactant/resources/public/js/main.js` — 2-line tweak.
- `packages/ai/src/models.generated.ts` — 1968-line live-API regeneration churn
  (generated file; refreshed by the build's `generate-models` step).

## Test results

- root `pnpm test` chain: pass
- agentd: 5 passed · coding-agent: 1120 passed / 47 skipped · tui: 548 passed
- kanban-cljs: 32 tests / 79 assertions, 0 failures · chat-ui: builds, 0 tests defined
