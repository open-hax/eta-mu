# Shared clj-kondo config baseline inventory

> Generated: 2026-06-15T00:00:00Z
> Branch: `feat/kanban-comments-parity`
> Scope: every package under `packages/*`

## 1. Package classification table

| Package | Classification | Has `.clj-kondo`? | Has `lint:kondo` script? | Notes |
|---------|---------------|-------------------|--------------------------|-------|
| Rheos | `cljs` | Yes (`packages/Rheos/.clj-kondo/config.edn`) | No (has `lint`) | shadow-cljs + deps (`src`, `test`) |
| axxium | `cljs` | No | No | shadow-cljs + deps.edn; sources under `src/cljs` |
| chat-ui | `cljs` | No | No | shadow-cljs; sources under `src`, `test` |
| event-ledger | `cljs` | Yes | No (has `lint`) | shadow-cljs; sources under `src`, `test` |
| extensions | `cljs` | No | No | shadow-cljs; sources under `src`, `lib` |
| extensions-e2e | `cljs` | No | No | shadow-cljs; sources under `src` |
| kanban-orchestrator | `config-only` | No | No | contracts only; no source files |
| katamorph | `cljs` | No | No (has `lint`) | shadow-cljs + deps.edn; sources under `src/cljs`, `test/cljs` |
| legacy | `ts-only` | No | No | meta-directory of TS subpackages; no root package.json or CLJS build config |
| mcp-contracts | `cljs` | No | No | single `src/eta_mu/mcp_contracts.cljs` consumed as source-path by `sol`; no shadow-cljs/deps.edn of its own |
| protocols | `cljs` | Yes | No (has `lint`) | shadow-cljs; sources under `src`, `test` |
| runtime | `cljs` | No | No | shadow-cljs; sources under `src/cljs`, `test/cljs` |
| sol | `cljs` | Yes | No (has `lint`) | shadow-cljs + deps.edn; sources under `src/cljs`, `test/cljs` |
| sol-staging | `unknown` | No | No | large `src/cljs` and `test/cljs` tree but no `package.json`, no `shadow-cljs.edn`, and not a pnpm workspace package |
| tsconfig | `config-only` | No | No | shared TypeScript base config only |

**CLJS packages to wire (11):** Rheos, axxium, chat-ui, event-ledger, extensions, extensions-e2e, katamorph, mcp-contracts, protocols, runtime, sol.

## 2. CLJS packages — lint surface

| Package | Lint paths | Existing config conflict / duplication |
|---------|------------|----------------------------------------|
| Rheos | `src`, `test` | Has local `:lint-as` for `js-await` and `:linters` for unresolved symbols / discouraged vars. These duplicate shared rules and should be removed after `:config-paths` is added. No hooks installed. |
| axxium | `src/cljs` | No existing config; clean install. |
| chat-ui | `src`, `test` | No existing config; clean install. |
| event-ledger | `src`, `test` | Existing config already installs the shared promise-chain hooks and linters. Must be merged/preserved; do not duplicate the `:hooks` block. |
| extensions | `src`, `lib` | No existing config; clean install. Note `lib/` contains `.cljc` macros. |
| extensions-e2e | `src` | No existing config; clean install. |
| katamorph | `src/cljs`, `test/cljs` | No existing config; clean install. |
| mcp-contracts | `src` | No existing config; clean install. |
| protocols | `src`, `test` | Existing config already installs the shared promise-chain hooks and linters. Must be merged/preserved. |
| runtime | `src/cljs`, `test/cljs` | No existing config; clean install. |
| sol | `src/cljs`, `test/cljs` | Existing config installs the shared promise-chain hooks and linters, plus a package-local `knoxx.backend.macros/defroute` hook. The defroute hook must stay local; the rest should be removed from the local file and inherited from the shared config. |

## 3. Existing kondo gaps

### Rheos (`packages/Rheos/.clj-kondo/config.edn`)

```edn
{:lint-as {shadow.cljs.modern/js-await  clojure.core/let
           shadow.cljs.modern/js-await* clojure.core/let}
 :linters
 {:unresolved-symbol
  {:exclude [js/console js/Promise js/Error js/JSON js/Object
             js/Array js/fetch js/parseInt js/parseFloat js/Boolean
             js/clearTimeout js/setTimeout js/setInterval js/clearInterval
             js/process js/Buffer js/Symbol js/Date js/Math js/Number
             js/String js/Uint8Array js/ArrayBuffer js/TextDecoder
             js/TextEncoder js/structuredClone js/URL js/URLSearchParams
             js/require js/module js/exports js/__dirname js/__filename]}
  :discouraged-var
  {shadow.cljs.modern/js-await  {:level :error
                                 :message "js-await is deprecated; use bare (await ...) inside ^:async fn."}
   shadow.cljs.modern/js-await* {:level :error
                                 :message "js-await* is deprecated; use bare (await ...) inside ^:async fn."}}}}

```

- `:lint-as` duplicates the shared config — remove local copy.
- `:linters` entries for `:unresolved-symbol` and `:discouraged-var` duplicate shared rules — remove local copy.
- No package-local hooks; safe to replace with a thin `:config-paths` wrapper.

### event-ledger (`packages/event-ledger/.clj-kondo/config.edn`)

```edn
{:linters
 {:unresolved-symbol
  {:exclude [js/console js/Promise js/Error js/JSON js/Object
             js/Array js/fetch js/parseInt js/parseFloat js/Boolean
             js/clearTimeout js/setTimeout js/setInterval js/clearInterval
             js/process js/Buffer js/Symbol js/Date js/Math js/Number
             js/String js/Uint8Array js/ArrayBuffer js/TextDecoder
             js/TextEncoder js/structuredClone js/URL js/URLSearchParams
             js/require js/module js/exports js/__dirname js/__filename
             js->clj clj->js number js
             (malli.core/=>)]}
  :promise-chain/prefer-async-workflow {:level :warning}
  :fn-length/long                     {:level :warning}
  :fn-length/too-long                 {:level :error}
  :file-length/long                   {:level :warning}
  :file-length/too-long               {:level :error}
  :complexity/high                    {:level :warning}
  :complexity/too-complex             {:level :error}}
 :unresolved-namespace {:exclude [js]}
 :hooks
 {:analyze-call
  {cljs.core/ns       hooks.promise-chain/check-ns
   cljs.core/->       hooks.promise-chain/check
   cljs.core/->>      hooks.promise-chain/check
   cljs.core/do       hooks.promise-chain/check
   cljs.core/let      hooks.promise-chain/check
   cljs.core/when     hooks.promise-chain/check
   cljs.core/when-let hooks.promise-chain/check
   cljs.core/if       hooks.promise-chain/check
   cljs.core/defn     hooks.promise-chain/check-defn
   cljs.core/defn-    hooks.promise-chain/check-defn}}}

```

- Entire file duplicates the shared config **except** `(malli.core/=>)` in `:unresolved-symbol` exclusions.
- Preserve `(malli.core/=>)` locally; remove all duplicated `:linters`, `:unresolved-namespace`, and `:hooks` entries.

### protocols (`packages/protocols/.clj-kondo/config.edn`)

Identical to event-ledger above, including the `(malli.core/=>)` exclusion.

- Preserve `(malli.core/=>)` locally; remove all shared duplicates.

### sol (`packages/sol/.clj-kondo/config.edn`)

```edn
{:lint-as {shadow.cljs.modern/js-await  clojure.core/let
           shadow.cljs.modern/js-await* clojure.core/let}
 :linters
 {:unresolved-symbol
  {:exclude [js/console js/Promise js/Error js/JSON js/Object
             js/Array js/fetch js/parseInt js/parseFloat js/Boolean
             js/clearTimeout js/setTimeout js/setInterval js/clearInterval
             js/process js/Buffer js/Symbol js/Date js/Math js/Number
             js/String js/Uint8Array js/ArrayBuffer js/TextDecoder
             js/TextEncoder js/structuredClone js/URL js/URLSearchParams
             js/require js/module js/exports js/__dirname js/__filename]}
  :promise-chain/prefer-async-workflow {:level :warning}
  :fn-length/long                     {:level :warning}
  :fn-length/too-long                 {:level :error}
  :file-length/long                   {:level :warning}
  :file-length/too-long               {:level :error}
  :complexity/high                    {:level :warning}
  :complexity/too-complex             {:level :error}
  :discouraged-var
  {shadow.cljs.modern/js-await  {:level :error
                                 :message "js-await is the deprecated async form in Knoxx; use a bare (await ...) inside a ^:async fn/defn — it compiles directly to ES async/await."}
   shadow.cljs.modern/js-await* {:level :error
                                 :message "js-await* is the deprecated async form in Knoxx; use a bare (await ...) inside a ^:async fn/defn — it compiles directly to ES async/await."}}}
 :hooks
 {:analyze-call
  {knoxx.backend.macros/defroute hooks.defroute/defroute
   cljs.core/ns       hooks.promise-chain/check-ns
   cljs.core/->       hooks.promise-chain/check
   cljs.core/->>      hooks.promise-chain/check
   cljs.core/do       hooks.promise-chain/check
   cljs.core/let      hooks.promise-chain/check
   cljs.core/when     hooks.promise-chain/check
   cljs.core/when-let hooks.promise-chain/check
   cljs.core/if       hooks.promise-chain/check
   cljs.core/defn     hooks.promise-chain/check-defn
   cljs.core/defn-    hooks.promise-chain/check-defn}}}

```

- `knoxx.backend.macros/defroute` hook is **package-local and knoxx-specific** — preserve it.
- `hooks.defroute/defroute` is not part of the eta-mu shared config; keep the local `hooks/defroute.clj` file and hook wiring.
- All other `:lint-as`, `:linters`, and `:hooks` entries duplicate the shared config and should be removed.

## 4. Known rule violations (pre-lint signal)

Methodology: regex scan of every `.cljs`/`.cljc`/`.clj` file under each CLJS package's source/test paths.
- Promise-chain hits: count of `.then(` and `.catch(`.
- Likely long functions: top-level `(defn` / `(defn-` forms whose body spans > 40 lines (paren-count heuristic; comment/docstring included).
- js-await usage: string match for `js-await` / `js-await*` / `shadow.cljs.modern/js-await` (comment occurrences noted).
- File length flag: total lines > 300.

> **Caveat:** these are coarse signals. The actual clj-kondo run (Epic 2) may report different or additional findings.

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

## 5. Risk flags

1. **Hook overlap with shared config**
   - `event-ledger`, `protocols`, and `sol` already register `hooks.promise-chain/check` and `hooks.promise-chain/check-defn` for `cljs.core/->`, `->>`, `do`, `let`, `when`, `when-let`, `if`, `defn`, `defn-`, plus `hooks.promise-chain/check-ns` for `cljs.core/ns`.
   - If the wiring task merges local and shared configs naively, kondo will error on duplicate hook registration. The task must **remove** these entries from the local config and rely on `:config-paths`.

2. **Package-local hooks that must survive**
   - `sol` has `knoxx.backend.macros/defroute` mapped to `hooks.defroute/defroute`. This is not part of the eta-mu shared config and must remain in `packages/sol/.clj-kondo/config.edn`.
   - `event-ledger` and `protocols` each add `(malli.core/=>)` to `:unresolved-symbol` exclusions. This must be preserved in the local config.

3. **No `src/` directory at package root**
   - `axxium`: sources are under `src/cljs`; lint script must use `src/cljs`.
   - `katamorph`: sources under `src/cljs` and `test/cljs`.
   - `runtime`: sources under `src/cljs` and `test/cljs`.
   - `sol`: sources under `src/cljs` and `test/cljs`.
   - `sol-staging`: sources under `src/cljs` and `test/cljs`, but no workspace package.json; excluded from wiring until build ownership is clarified.

4. **Non-standard relative path risk**
   - `Rheos/shadow-cljs.edn` includes source paths outside the package (`../../../openplanner/...`). The clj-kondo `:config-paths` for Rheos is still the standard `../../kondo-config/clj-kondo.exports/open-hax/kondo-config` from `packages/Rheos/.clj-kondo/config.edn` because the config file itself lives at the normal depth.
   - All other wired packages live at `packages/<name>` and use the same two-level `../../kondo-config/...` relative path.

5. **`legacy` classification boundary**
   - `packages/legacy` is `ts-only` at the root; its subpackages are not individually evaluated here. If any subpackage contains CLJS, it should be handled in a follow-up task, not Epic 1.

6. **Existing `lint` scripts vs new `lint:kondo` scripts**
   - Rheos, event-ledger, katamorph, protocols, and sol already have a `lint` script that invokes clj-kondo. Epic 1 adds a `lint:kondo` script (it does not rename or delete the existing `lint` script). A future cleanup task may decide whether to unify them.
