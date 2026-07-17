# @open-hax/kondo-config

Shared clj-kondo configuration and hooks for the OpenHax ClojureScript packages in this monorepo. It centralizes lint level decisions and a custom promise-chain hook so every CLJS package lints against the same rules instead of duplicating config.

This is a config/tooling package: it ships no compiled code and has no build, test, or watch scripts of its own. Its only artifact is the exported clj-kondo config tree.

## Public surface

The package exports a single clj-kondo config directory (declared via the `files` field as `clj-kondo.exports`):

```
clj-kondo.exports/open-hax/kondo-config/
├── config.edn                 # shared linter levels, lint-as rules, hook wiring
└── hooks/promise_chain.clj    # custom analyze-call hook (ns hooks.promise-chain)
```

### What `config.edn` provides

- **`:lint-as`** — treats `shadow.cljs.modern/js-await` and `js-await*` as `let`, and `helix.core/defnc` as `defn`.
- **`:linters` levels** — sets levels for the workspace's structural linters:
  - `:fn-length/long` (warning), `:fn-length/too-long` (error)
  - `:file-length/long` (warning), `:file-length/too-long` (error)
  - `:complexity/high` (warning), `:complexity/too-complex` (error)
  - `:promise-chain/prefer-async-workflow` (warning) — emitted by the hook below
- **`:linters :unresolved-symbol :exclude`** — allowlists JS interop globals (`js/console`, `js/Promise`, `js/fetch`, `js/process`, `js/Buffer`, etc.) plus `clj->js` / `js->clj` / `await` so interop-heavy CLJS does not flag false positives.
- **`:discouraged-var`** — flags `shadow.cljs.modern/js-await` and `js-await*` with a message steering toward bare `(await ...)` inside an `^:async` fn.
- **`:hooks :analyze-call`** — wires the promise-chain hook into `ns`, `->`, `->>`, `do`, `let`, `when`, `when-let`, `if`, `defn`, and `defn-`.

### The promise-chain hook (`hooks/promise_chain.clj`)

`ns hooks.promise-chain` walks each analyzed form looking for `.then` / `.catch` / `.finally` method calls (both `(.then ...)` and `(. obj then ...)` forms) and registers a `:promise-chain/prefer-async-workflow` finding, nudging code toward the async/await workflow over promise chains. This is the one piece of executable logic the package ships; the other linter keys are level configuration only.

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
