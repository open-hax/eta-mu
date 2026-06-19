# eta-mu-extensions-e2e

Package: `@open-hax/eta-mu-extensions-e2e`

Shadow-cljs `:node-test` harness that exercises `contract-runtime-v2` flows end-to-end. It compiles the contract-runtime source straight from the canonical `packages/extensions` tree (via `shadow-cljs.edn` source-paths `../extensions/src` and `../extensions/lib`) and runs the tests against it.

## Scope

- Drives the policy gate (`evaluate-policies`) and fulfillment (`evaluate-fulfillments`) paths of `eta-mu.extensions.contract-runtime-v2.core`.
- Fixtures are plain Clojure maps keyed with **namespaced keywords**, not Pi 0.67.1 JS field names. Contracts use `:contract/kind`, `:contract/id`, `:policy/match`, `:policy/action`, `:policy/reason`, `:fulfillment/match`, `:fulfillment/mode`, `:fulfillment/message`, `:fulfillment/level`. Tool-call/tool-result events use `:tool/name`, `:tool/params`, `:tool/error`, and the `:tool/error?` predicate. See `src/eta_mu_extensions_e2e/fixture_contracts.cljs` and the inline fixtures in `src/eta_mu_extensions_e2e/core_test.cljs`.
- A scriptable mock OpenAI server (`src/eta_mu_extensions_e2e/mock_openai.cljs`) emits standard chat-completion shapes (`:choices` / `:message` / `:tool_calls` / `:finish_reason`) so an agent loop can be advanced step by step.
- Harness stays local to the monorepo under `packages/`.

## Run

From the repo root:

```bash
pnpm -C packages/extensions-e2e test
```

or by package name:

```bash
pnpm --filter @open-hax/eta-mu-extensions-e2e test
```

`test` runs `shadow-cljs compile e2e-test && node out/node-tests.cjs`. The `:e2e-test` build targets `:node-test`, collects namespaces matching `-test$`, writes `out/node-tests.cjs`, and autoruns.

Watch mode:

```bash
pnpm -C packages/extensions-e2e test:watch
```

Lint:

```bash
pnpm -C packages/extensions-e2e lint:kondo
```

Local clj-kondo config lives at `.clj-kondo/config.edn` and inherits the shared exports from `@open-hax/kondo-config`.
