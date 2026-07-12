# eta-mu-e2e

Package: `@open-hax/eta-mu-e2e`

Monorepo-wide end-to-end test harness for cross-package interactions. Tests that exercise long-distance seams between packages live here.

## Scope

- **Extension contract flows**: policy gate (`evaluate-policies`) and fulfillment (`evaluate-fulfillments`) paths of `eta-mu.extensions.contract-runtime-v2.core`.
- **Runtime ↔ Coding integration**: Tests that verify the CLJS runtime correctly orchestrates coding-agent domain, shape, law, and infra layers.
- **Cross-package seams**: Settings load → session creation → tool dispatch → extension event emission.

Fixtures are plain Clojure maps keyed with **namespaced keywords**. Contracts use `:contract/kind`, `:contract/id`, `:policy/match`, `:policy/action`, `:policy/reason`, `:fulfillment/match`, `:fulfillment/mode`, `:fulfillment/message`, `:fulfillment/level`. Tool-call/tool-result events use `:tool/name`, `:tool/params`, `:tool/error`, and the `:tool/error?` predicate. See `src/eta_mu_e2e/fixture_contracts.cljs` and the inline fixtures in `src/eta_mu_e2e/core_test.cljs`.

A scriptable mock OpenAI server (`src/eta_mu_e2e/mock_openai.cljs`) emits standard chat-completion shapes (`:choices` / `:message` / `:tool_calls` / `:finish_reason`) so an agent loop can be advanced step by step.

## Run

From the repo root:

```bash
pnpm -C packages/e2e test
```

or by package name:

```bash
pnpm --filter @open-hax/eta-mu-e2e test
```

`test` runs `shadow-cljs compile e2e-test && node out/node-tests.cjs`. The `:e2e-test` build targets `:node-test`, collects namespaces matching `-test$`, writes `out/node-tests.cjs`, and autoruns.

Watch mode:

```bash
pnpm -C packages/e2e test:watch
```

Lint:

```bash
pnpm -C packages/e2e lint:kondo
```

Local clj-kondo config lives at `.clj-kondo/config.edn` and inherits the shared exports from `@open-hax/kondo-config`.
