# @open-hax/kondo-config

Shared clj-kondo configuration and hooks for the OpenHax ClojureScript packages in this monorepo. It centralizes lint level decisions and a custom promise-chain hook so every CLJS package lints against the same rules instead of duplicating config.

This is a config/tooling package: it ships no compiled code and has no build, test, or watch scripts of its own. Its only artifact is the exported clj-kondo config tree.

## Public surface

The package exports a single clj-kondo config directory (declared via the `files` field as `clj-kondo.exports`):

```
clj-kondo.exports/open-hax/kondo-config/
├── config.edn                    # shared linter levels, lint-as rules, hook wiring
├── hooks/promise_chain.clj       # custom analyze-call hook (ns hooks.promise-chain)
└── hooks/layer_boundaries.clj    # construction-order gate (ns hooks.layer-boundaries)
```

### What `config.edn` provides

- **`:lint-as`** — treats `shadow.cljs.modern/js-await` and `js-await*` as `let`, and `helix.core/defnc` as `defn`.
- **`:linters` levels — sets levels for the workspace's structural linters:
  - `:fn-length/long` (warning), `:fn-length/too-long` (error)
  - `:file-length/long` (warning), `:file-length/too-long` (error)
  - `:complexity/high` (warning), `:complexity/too-complex` (error)
  - `:promise-chain/prefer-async-workflow` (warning) — emitted by the hook below
  - `:layer-boundary/upward-require` (info), `:layer-boundary/host-require` (info) — emitted by the layer hook below
- **`:linters :unresolved-symbol :exclude`** — allowlists JS interop globals (`js/console`, `js/Promise`, `js/fetch`, `js/process`, `js/Buffer`, etc.) plus `clj->js` / `js->clj` / `await` so interop-heavy CLJS does not flag false positives.
- **`:discouraged-var`** — flags `shadow.cljs.modern/js-await` and `js-await*` with a message steering toward bare `(await ...)` inside an `^:async` fn.
- **`:hooks :analyze-call`** — wires the promise-chain hook into `ns`, `->`, `->>`, `do`, `let`, `when`, `when-let`, `if`, `defn`, and `defn-`.

### The promise-chain hook (`hooks/promise_chain.clj`)

`ns hooks.promise-chain` walks each analyzed form looking for `.then` / `.catch` / `.finally` method calls (both `(.then ...)` and `(. obj then ...)` forms) and registers a `:promise-chain/prefer-async-workflow` finding, nudging code toward the async/await workflow over promise chains.

### The layer-boundary hook (`hooks/layer_boundaries.clj`)

`ns hooks.layer-boundaries` reads each `ns` form's `:require` clauses and enforces the `law → shape → extern → domain → infra` construction order from `AGENTS.md`, so a layer violation is a lint finding at the require that causes it instead of something a reviewer has to notice:

| layer    | may require                          |
|----------|--------------------------------------|
| `law`    | nothing (validators only)            |
| `shape`  | `law`                                |
| `extern` | `law`, `shape`                       |
| `domain` | `law`, `shape`                       |
| `infra`  | everything below it                  |

Each layer may also require its own siblings. A **host require** — a string libspec such as `"node:fs/promises"`, `"chokidar"`, or `"fastify"` — is legal only in `extern.*` and `infra.*`, the layers allowed to touch the host at all; anywhere else it is a `:layer-boundary/host-require`. A require pointing up the order is a `:layer-boundary/upward-require`. Two types, so a package can tune them apart.

A namespace's layer is its last layer-named segment (`rheos.backend.domain.task-create` → `domain`). Namespaces with no layer segment are skipped, and so are `*-test` ones: a test is not part of the construction DAG, and a fixture that needs a temp directory to exercise a pure decision is not a violation. For a genuine false positive — a `domain` that means a DNS domain — turn it off for that namespace:

```clojure
:config-in-ns {your.dns.domain.parser
               {:linters {:layer-boundary/host-require {:level :off}}}}
```

**Both types ship at `:info`**, which prints but does not fail a lint run, so a package adopting this config is not blocked by debt it has not paid yet. A package that *has* paid raises them in its own `.clj-kondo/config.edn` and keeps them there:

```clojure
:linters {:layer-boundary/upward-require {:level :error}
          :layer-boundary/host-require {:level :error}}
```

Note that `cljs.core/ns` accepts exactly one `:analyze-call` hook. `hooks.layer-boundaries/check-ns` is wired there and delegates to `hooks.promise-chain/check-ns`, so both checks still run; a third `ns` check must extend that delegation rather than add a second wiring.

## How packages consume it

Each consuming package points its local `.clj-kondo/config.edn` at this export directory via `:config-paths` (relative path), for example `packages/runtime/.clj-kondo/config.edn`:

```clojure
{:config-paths ["../../kondo-config/clj-kondo.exports/open-hax/kondo-config"]}
```

clj-kondo merges the shared config first, so package-local overrides go in that same `.clj-kondo/config.edn` and take precedence over what is inherited here.

## Linting (run from consumers, not here)

This package has nothing to lint or build itself. Linting happens in the consuming packages, each of which exposes a `lint:kondo` script, e.g.:

```bash
# Lint a single consuming package
pnpm --filter @open-hax/runtime run lint:kondo

# Lint every workspace package that defines lint:kondo
pnpm run lint:kondo   # root: pnpm -r --no-bail --if-present lint:kondo
```

When you change `config.edn` or the hook, re-run a consumer's `lint:kondo` to confirm findings still register. Note that the `:config-paths` reference resolves at the consumer, so a moved or renamed export directory must be updated in every consumer's `.clj-kondo/config.edn`.
