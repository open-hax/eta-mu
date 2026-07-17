# Shared clj-kondo config baseline inventory

> Generated: 2026-06-15 (original baseline) · Refreshed: 2026-06-19 against source
> Scope: every package under `packages/*`

> **Status update (2026-06-19): the wiring described as future work in this doc is DONE.**
[Omitted long matching line]

## 1. Package classification table

Verified 2026-06-19. "Has `.clj-kondo`?" / "Has `lint:kondo`?" reflect current source state, not the pre-wiring baseline.

| Package | Classification | Has `.clj-kondo`? | Has `lint:kondo` script? | Notes |
|---------|---------------|-------------------|--------------------------|-------|
| Rheos | `cljs` | Yes (`:config-paths` + nothing local) | Yes (also has legacy `lint`) | shadow-cljs + deps (`src`, `test`) |
| axxium | `cljs` | Yes (`:config-paths` only) | Yes (also has `boundary:check`) | shadow-cljs + deps.edn; sources under `src/cljs` |
| chat-ui | `cljs` | Yes (`:config-paths` only) | Yes | shadow-cljs; sources under `src`, `test` |
| event-ledger | `cljs` | Yes (`:config-paths` + local `(malli.core/=>)` exclude) | Yes (also has legacy `lint`) | shadow-cljs; sources under `src`, `test` |
| extensions | `cljs` | Yes (`:config-paths` only) | Yes | shadow-cljs; sources under `src`, `lib` |
| extensions-e2e | `cljs` | Yes (`:config-paths` only) | Yes | shadow-cljs; sources under `src`; lint scope is `src` only |
| kanban-orchestrator | `config-only` | No | No | contracts (EDN) only; no `.cljs`/`.clj` source, no shadow-cljs |
| katamorph | `cljs` | Yes (`:config-paths` only) | Yes (also has legacy `lint`) | shadow-cljs + deps.edn; sources under `src/cljs`, `test/cljs` |
| kondo-config | `config-only` (rule owner) | n/a (it IS the shared config) | No | `@open-hax/kondo-config`: ships `clj-kondo.exports/open-hax/kondo-config/config.edn` + `hooks/promise_chain.clj`. Source of the rules every other package inherits. |
| legacy | `ts-only` | No | No | meta-directory of TS subpackages; no root package.json or CLJS build config |
| mcp-contracts | `cljs` | Yes (`:config-paths` only) | Yes | single `src/eta_mu/mcp_contracts.cljs` consumed as source-path by `sol`; no shadow-cljs/deps.edn of its own |
| protocols | `cljs` | Yes (`:config-paths` + local `(malli.core/=>)` exclude) | Yes (also has legacy `lint`) | shadow-cljs; sources under `src`, `test` (namespace root `promethean.*`) |
| runtime | `cljs` | Yes (`:config-paths` only) | Yes | shadow-cljs; sources under `src/cljs`, `test/cljs` |
| sol | `cljs` | Yes (`:config-paths` + local `defroute` hook) | Yes (also has legacy `lint`) | shadow-cljs + deps.edn; sources under `src/cljs`, `test/cljs` |
| sol-staging | `unmanaged-cljs` | No | No | large `src/cljs`/`test/cljs` tree (~265 cljs, `knoxx.backend.*`) but no `package.json`, no `shadow-cljs.edn`; built only via `packages/sol`. Not separately wired. |
| tsconfig | `config-only` | No | No | shared TypeScript base config only |

**CLJS packages wired (11, all done):** Rheos, axxium, chat-ui, event-ledger, extensions, extensions-e2e, katamorph, mcp-contracts, protocols, runtime, sol. Each has a `.clj-kondo/config.edn` and a `lint:kondo` script. `kondo-config` is the rule owner and `sol-staging` is unmanaged (built through `sol`); neither is in the wired-package count.

## 2. CLJS packages — lint surface (current)

The `lint:kondo` script in each package determines the lint scope. All local configs now reduce to `{:config-paths ["../../kondo-config/clj-kondo.exports/open-hax/kondo-config"]}` plus the per-package exceptions noted in the last column. The duplication-cleanup that the original baseline anticipated is complete.

| Package | `lint:kondo` scope | Local config beyond `:config-paths` |
|---------|--------------------|--------------------------------------|
| Rheos | `src test` | None (previously-duplicated `:lint-as`/`:linters` removed). |
| axxium | `src/cljs test/cljs` | None. (Separately has a `boundary:check` script: `scripts/check-js-boundary.mjs`.) |
| chat-ui | `src test` | None. |
| event-ledger | `src test` | `:linters {:unresolved-symbol {:exclude [(malli.core/=>)]}}` preserved. |
| extensions | `src lib` | None. `lib/` holds the `.cljc` macros (`event.cljc`, `state.cljc`, `tool.cljc`). |
| extensions-e2e | `src` (only) | None. Sources are all under `src`; no `test/` root. |
| katamorph | `src/cljs test/cljs` | None. |
| mcp-contracts | `src` | None. |
| protocols | `src test` | `:linters {:unresolved-symbol {:exclude [(malli.core/=>)]}}` preserved. |
| runtime | `src/cljs test/cljs` | None. |
| sol | `src/cljs test/cljs` | Package-local `defroute` hook in `:hooks :analyze-call` (see §3 — the hook key is **stale** and needs fixing). Also imports under `.clj-kondo/imports/` for promesa/malli/rewrite-clj. |

## 3. Shared-rule ownership and current local configs

### Rule owner: `@open-hax/kondo-config`

All shared rules live in one place: `packages/kondo-config/clj-kondo.exports/open-hax/kondo-config/`. That export directory holds:

- `config.edn` — the shared rule set, applied to every consumer via `:config-paths`. It provides:
  - `:lint-as` — `shadow.cljs.modern/js-await` + `js-await*` → `let`; `helix.core/defnc` → `defn`.
  - `:linters` levels for `:fn-length/{long,too-long}`, `:file-length/{long,too-long}`, `:complexity/{high,too-complex}`, and `:promise-chain/prefer-async-workflow` (warning).
  - A large `:unresolved-symbol :exclude` JS-interop allowlist (`js/console`, `js/Promise`, …).
  - `:discouraged-var` entries for `js-await`/`js-await*`.
  - `:hooks :analyze-call` wiring the promise-chain hook into `ns`, `->`, `->>`, `do`, `let`, `when`, `when-let`, `if`, `defn`, `defn-`.
- `hooks/promise_chain.clj` (ns `hooks.promise-chain`) — the only shared hook implementation.

> Caveat: `:fn-length/*`, `:file-length/*`, and `:complexity/*` are **non-standard clj-kondo keys**. `kondo-config` only sets their *levels*; it does not implement those linters (no source for them exists anywhere in the repo). They depend on an external/forked clj-kondo that recognizes them. Stock clj-kondo will ignore those keys.

Consumers reference the export by relative path in their own `.clj-kondo/config.edn`:

```edn
{:config-paths ["../../kondo-config/clj-kondo.exports/open-hax/kondo-config"]}
```

Root lint command: `pnpm lint:kondo` = `pnpm -r --no-bail --if-present lint:kondo` (fans out to each package's `lint:kondo`).

### Packages with the bare wrapper (no local additions)

`axxium`, `chat-ui`, `extensions`, `extensions-e2e`, `mcp-contracts`, `runtime`, `Rheos` — each `.clj-kondo/config.edn` is exactly the `:config-paths` wrapper above. The duplicated `:lint-as`/`:linters`/`:discouraged-var` blocks that the original baseline showed for Rheos and sol have been removed and are now inherited.

### Packages with a preserved local exception

**event-ledger** and **protocols** — wrapper plus one local exclusion:

```edn
{:config-paths ["../../kondo-config/clj-kondo.exports/open-hax/kondo-config"]
 :linters {:unresolved-symbol {:exclude [(malli.core/=>)]}}}
```

The `(malli.core/=>)` exclusion is intentionally local (not pushed to the shared config) and is preserved.

**sol** — wrapper plus a package-local `defroute` hook:

```edn
{:config-paths ["../../kondo-config/clj-kondo.exports/open-hax/kondo-config"]
 :hooks {:analyze-call {knoxx.backend.macros/defroute hooks.defroute/defroute}}}
```

The hook implementation lives at `packages/sol/.clj-kondo/hooks/defroute.clj` and is correctly local (it is not part of the shared eta-mu config). sol also ships `.clj-kondo/imports/` configs for `funcool/promesa`, `metosin/malli`, and `rewrite-clj`.

> **DRIFT FLAG (needs fixing): the sol defroute hook key is stale.** The hook is wired for `knoxx.backend.macros/defroute`, but sol's `defroute` macro now lives in **`open-hax.sol.macros`** (`packages/sol/src/cljs/open_hax/sol/macros.cljc`, ns `open-hax.sol.macros`; used by `infra/routes/app.cljs` and `shape/app_shapes.cljs`). The `knoxx.backend.macros` namespace no longer exists in sol — that name survives only in `packages/sol-staging`. The `:analyze-call` key should be changed to `open-hax.sol.macros/defroute` so the hook actually fires; right now it analyzes a namespace sol no longer defines.

## 4. Known rule violations (pre-lint signal)

Methodology: regex scan of every `.cljs`/`.cljc`/`.clj` file under each CLJS package's source/test paths.
- Promise-chain hits: count of `.then(` and `.catch(`.
- Likely long functions: top-level `(defn` / `(defn-` forms whose body spans > 40 lines (paren-count heuristic; comment/docstring included).
- js-await usage: string match for `js-await` / `js-await*` / `shadow.cljs.modern/js-await` (comment occurrences noted).
- File length flag: total lines > 300.

> **Caveat:** these are coarse regex signals from the original baseline, not a clj-kondo run, and they predate the wiring. They are retained as a historical pre-lint snapshot. Now that every CLJS package is wired (§1–§3), run `pnpm lint:kondo` for authoritative findings. Note the `sol-staging` rows below are informational only — that tree has no `package.json` and is not separately linted.

| Package | File | Promise-chain hits | Likely long fns | js-await usage | File length flag |
|---------|------|--------------------|-----------------|----------------|------------------|
| Rheos | src/rheos/backend/infra/http_server.cljs | 0 | 0 | 0 | yes |
| axxium | src/cljs/axxium/db.cljs | 0 | 1 | 0 |  |
| axxium | src/cljs/axxium/routes/auth.cljs | 0 | 1 | 0 |  |
| chat-ui | src/eta_mu/chat_ui/protocol.cljs | 0 | 1 | 0 |  |
| chat-ui | src/eta_mu/chat_ui/stream.cljs | 0 | 1 | 0 |  |
| extensions | src/eta_mu/contracts/core.cljs | 0 | 1 | 0 | yes |
| extensions | src/eta_mu/extensions/contract_runtime.cljs | 0 | 0 | 0 | yes |
| extensions | src/eta_mu/extensions/contract_runtime_v2.cljs | 0 | 0 | 0 | yes |
| extensions | src/eta_mu/extensions/custom_providers.cljs | 0 | 1 | 0 |  |
| extensions | src/eta_mu/extensions/graph_memory.cljs | 0 | 0 | 0 | yes |
| extensions | src/eta_mu/extensions/opencode_global_instructions.cljs | 0 | 3 | 0 | yes |
| extensions | src/eta_mu/extensions/opmf_contract_gate.cljs | 0 | 6 | 0 | yes |
| extensions | src/eta_mu/extensions/opmf_contract_gate_test.cljs | 0 | 0 | 0 | yes |
| extensions | src/eta_mu/extensions/receipt_river.cljs | 0 | 2 | 0 | yes |
| extensions | src/eta_mu/extensions/session_mycology.cljs | 0 | 2 | 0 | yes |
| extensions | src/eta_mu/build/opencode/opmf_contract_gate.cljs | 0 | 1 | 0 |  |
| katamorph | src/cljs/katamorph/agent/reasoning.cljs | 0 | 1 | 0 |  |
| katamorph | src/cljs/katamorph/agent/text_delta.cljs | 0 | 1 | 0 |  |
| katamorph | src/cljs/katamorph/policy/eval.cljs | 0 | 1 | 0 |  |
| katamorph | src/cljs/katamorph/schema.cljs | 0 | 0 | 0 | yes |
| runtime | src/cljs/eta_mu/ai/shape/message.cljs | 0 | 1 | 0 |  |
| runtime | src/cljs/eta_mu/coding/domain/session.cljs | 0 | 1 | 0 |  |
| runtime | src/cljs/eta_mu/coding/extern/process_exec.cljs | 0 | 1 | 0 |  |
| runtime | src/cljs/eta_mu/coding/shape/session.cljs | 0 | 2 | 0 |  |
| runtime | src/cljs/eta_mu/garden/shape/block.cljs | 0 | 1 | 0 |  |
| runtime | src/cljs/eta_mu/gate/domain/validate.cljs | 0 | 1 | 0 |  |
| runtime | src/cljs/eta_mu/gate/shape/markdown.cljs | 0 | 1 | 0 | yes |
| runtime | src/cljs/eta_mu/runtime/domain/planner.cljs | 0 | 1 | 0 |  |
| runtime | src/cljs/eta_mu/runtime/shape/message.cljs | 0 | 2 | 0 | yes |
| runtime | test/cljs/eta_mu/coding/domain/session_test.cljs | 0 | 0 | 0 | yes |
| runtime | test/cljs/eta_mu/gate/contract_law_test.cljs | 0 | 0 | 0 | yes |
| sol | src/cljs/open_hax/sol/domain/agent/agent_templates.cljs | 0 | 1 | 0 | yes |
| sol | src/cljs/open_hax/sol/domain/contracts/loader.cljs | 0 | 0 | 0 | yes |
| sol | src/cljs/open_hax/sol/domain/contracts/resolve.cljs | 0 | 0 | 0 | yes |
| sol | src/cljs/open_hax/sol/domain/models.cljs | 0 | 0 | 0 | yes |
| sol | src/cljs/open_hax/sol/domain/text.cljs | 0 | 3 | 0 | yes |
| sol | src/cljs/open_hax/sol/extern/agent_message.cljs | 0 | 1 | 0 |  |
| sol | src/cljs/open_hax/sol/infra/agent/stream.cljs | 0 | 0 | 0 | yes |
| sol | src/cljs/open_hax/sol/infra/agent/turn.cljs | 0 | 2 | 0 | yes |
| sol | src/cljs/open_hax/sol/law/contracts.cljs | 0 | 0 | 0 | yes |
| sol | src/cljs/open_hax/sol/shape/app_shapes.cljs | 0 | 1 | 0 |  |
| sol-staging | src/cljs/knoxx/backend/domain/action/invoke_sub_agent.cljs | 0 | 2 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/domain/action/registry.cljs | 0 | 0 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/domain/action/run_state.cljs | 0 | 2 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/domain/actor/mailbox.cljs | 0 | 1 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/domain/actor/tools.cljs | 0 | 1 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/domain/bluesky/bluesky.cljs | 0 | 0 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/domain/control/catalog.cljs | 0 | 0 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/domain/discord/discord_io.cljs | 0 | 1 | 0 |  |
| sol-staging | src/cljs/knoxx/backend/domain/discord/gateway.cljs | 0 | 0 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/domain/discord/source.cljs | 0 | 1 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/domain/discord/tools.cljs | 0 | 0 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/domain/discord/voice_tools.cljs | 0 | 0 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/domain/media.cljs | 0 | 1 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/domain/media/blaze.cljs | 0 | 2 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/domain/music.cljs | 0 | 0 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/domain/nrepl.cljs | 0 | 2 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/domain/openutau/openutau.cljs | 0 | 0 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/domain/sandbox_container.cljs | 0 | 1 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/domain/session_mycology.cljs | 0 | 1 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/domain/voice/tools.cljs | 0 | 0 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/infra/auth/session.cljs | 0 | 0 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/infra/core_memory.cljs | 0 | 0 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/infra/db/policy.cljs | 0 | 0 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/infra/document_state.cljs | 0 | 1 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/infra/eta_mu_session_ingester.cljs | 0 | 2 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/infra/openplanner/memory.cljs | 0 | 3 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/infra/openplanner/tools.cljs | 0 | 0 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/infra/routes/studio/discord_scan.cljs | 0 | 0 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/infra/routes/tools/proxy.cljs | 0 | 0 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/infra/stores/mongo_policy_directory.cljs | 0 | 0 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/infra/stores/mongo_policy_roles.cljs | 0 | 0 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/infra/stores/mongo_session_store.cljs | 0 | 0 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/infra/stores/session_titles.cljs | 0 | 0 | 0 | yes |
| sol-staging | src/cljs/knoxx/backend/infra/tooling.cljs | 0 | 1 | 0 |  |
| sol-staging | test/cljs/knoxx/backend/agent_turns_test.cljs | 0 | 0 | 1* |  |
| sol-staging | test/cljs/knoxx/backend/shape_agent_schemas_test.cljs | 0 | 0 | 0 | yes |

`*` `js-await` hit in `sol-staging/test/cljs/knoxx/backend/agent_turns_test.cljs` is inside a comment only (`;; ... causing js-await ...`). No actual deprecated-form usage was found.

**Summary of pre-lint signal by package:**

| Package | Files flagged | Long-fn files | >300-line files | js-await actual |
|---------|---------------|---------------|-----------------|-----------------|
| Rheos | 1 | 0 | 1 | 0 |
| axxium | 2 | 2 | 0 | 0 |
| chat-ui | 2 | 2 | 0 | 0 |
| event-ledger | 0 | 0 | 0 | 0 |
| extensions | 7 | 5 | 6 | 0 |
| extensions-e2e | 0 | 0 | 0 | 0 |
| katamorph | 3 | 3 | 1 | 0 |
| mcp-contracts | 0 | 0 | 0 | 0 |
| protocols | 0 | 0 | 0 | 0 |
| runtime | 8 | 8 | 3 | 0 |
| sol | 11 | 5 | 9 | 0 |
| sol-staging | 32 | 18 | 29 | 0 |

## 5. Risk flags (current state)

1. **Stale sol defroute hook (open, needs fixing).**
   - `packages/sol/.clj-kondo/config.edn` wires `knoxx.backend.macros/defroute → hooks.defroute/defroute`, but sol's `defroute` macro is now `open-hax.sol.macros/defroute`. The hook never matches and the `defroute` forms in `infra/routes/app.cljs` / `shape/app_shapes.cljs` go un-analyzed. Fix: rename the `:analyze-call` key to `open-hax.sol.macros/defroute`. The `knoxx.backend.macros` name only still exists in `packages/sol-staging`. (See §3.)

2. **Hook overlap with shared config — RESOLVED.**
   - The pre-wiring local configs that duplicated `hooks.promise-chain/check`/`check-defn`/`check-ns` have been removed; those hooks are now inherited via `:config-paths` only. No duplicate-registration risk remains.

3. **Package-local exceptions that intentionally survive.**
   - `sol`: the local `defroute` hook (keep — but fix its key per flag 1).
   - `event-ledger` and `protocols`: `(malli.core/=>)` in `:unresolved-symbol :exclude`. Preserved locally on purpose.

4. **Non-`src/`-root lint scopes (handled correctly by each `lint:kondo`).**
   - `axxium`, `katamorph`, `runtime`, `sol`: sources under `src/cljs` (+`test/cljs`); each `lint:kondo` targets those paths.
   - `extensions-e2e`: sources only under `src`; lint scope is `src` (no `test/`).
   - `sol-staging`: `src/cljs`/`test/cljs` but no workspace `package.json`, so it has no `lint:kondo` of its own and is not separately wired; it is linted only insofar as `sol` pulls it in.

5. **Rheos source paths — corrected.**
   - The original baseline noted `Rheos/shadow-cljs.edn` reaching `../../../openplanner/...`. That is no longer true: Rheos source-paths are now sibling monorepo packages (`../protocols/src`, `../event-ledger/src`, `../chat-ui/src`). The `:config-paths` value is the standard `../../kondo-config/...` (config file lives at normal depth).

6. **`legacy` classification boundary.**
   - `packages/legacy` is `ts-only`; its subpackages are not individually evaluated here. No CLJS lint wiring applies.

7. **Legacy `lint` vs `lint:kondo`.**
   - Rheos, event-ledger, katamorph, protocols, and sol carry both a legacy `lint` script and the canonical `lint:kondo`. The root `lint:kondo` fan-out only invokes `lint:kondo`. A future cleanup may unify or drop the legacy `lint` aliases.
