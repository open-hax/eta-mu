# @open-hax/katamorph

The contract/resource runtime: **data as interpreter**. A resource is a plain
EDN map; katamorph parses the manifest grammar, validates each map against its
kind-specific Malli schema, and interprets its facets (actions, stores,
policies, …) at runtime. There is no codegen — the namespace file *is* the
program.

Consumed two ways:

- **CLJS source-path** — other packages (e.g. `sol`) add
  `../katamorph/src/cljs` to their `:source-paths` and require `katamorph.*`
  namespaces directly. This is the primary consumption path.
- **ESM `:lib` build** — for external JS consumers, exposing the manifest
  grammar front door (`isNamespaceFile`, `namespaceFileDefinitions`,
  `qualifiedId`, `entryKinds`, …).

## Build & test

This package builds with `shadow-cljs`; run scripts via pnpm from the monorepo.

```bash
# from the monorepo root (/home/err/devel)
pnpm -C orgs/open-hax/eta-mu/packages/katamorph build      # shadow-cljs release lib -> dist/lib
pnpm -C orgs/open-hax/eta-mu/packages/katamorph test       # compile :test then node dist/test.cjs
pnpm -C orgs/open-hax/eta-mu/packages/katamorph watch      # shadow-cljs watch test
pnpm -C orgs/open-hax/eta-mu/packages/katamorph lint:kondo # clj-kondo --lint src/cljs test/cljs
```

`test` compiles the `:node-test` build (`ns-regexp "-test$"`, output
`dist/test.cjs`) and runs it under Node. The `.cjs` extension is deliberate:
`package.json` is `"type": "module"`, so the test output is emitted as
CommonJS. Tests live under `test/cljs/katamorph/` (manifest, schema, policy
eval/fulfillment/gate, store law/memory, agent reasoning/text-delta/turn-guards,
law/url).

Dependency: `metosin/malli` (declared in both `deps.edn` and `shadow-cljs.edn`).

## Public surface

All source is under `src/cljs/katamorph/`.

### Manifest grammar — `katamorph.manifest`

Pure parsing of namespace resource files. A namespace file groups resources
under one `:namespace`:

```clojure
{:namespace :ussyverse
 :resources [{:trigger/id :social-replies
              :trigger/action {:action/fn ...}}]}
```

The grammar distinguishes **registration** (`:K/id` registers a resource of
kind K, identified by namespace + local id, e.g. `:ussyverse/social-replies`),
**composite** entries (one entry registers several kinds; each interpreter
reads only its own `:K/*` keys), **anonymous facets** (`:K/<field>` without
`:K/id` — read in place, never registered, e.g. `:action/fn` on a trigger), and
**references** (kept under the owning kind's namespace). Public fns:
`namespace-file?`, `namespace-file-definitions`, `qualified-id`,
`qualified-id-str`, `entry-kinds`, `facet-kinds`, `anonymous-facets`. These are
also the ESM `:lib` exports.

### Schema & validation — `katamorph.schema`

Malli schemas for every contract kind, keyed by `:contract/kind` value, in
`registry` (agent, sub-agent, actor, role, capability, policy, policy-gate,
fulfillment, strategy, action, trigger, store, namespace, generator, schedule,
source, model-family, model, ingest_source). Public API:

- `schema-for` — look up the schema for a kind (throws if unknown).
- `infer-contract-class` — infer the kind from a parsed map (falls back to
  `:agent`).
- `validate` — returns `{:ok true/false :value v :errors [{:path [...] :message _} ...]}`;
  infers the kind when `contract-class` is nil.
- `assert!` — validate and throw on failure (use at ingest boundaries).
- `coerce` — run the value through the schema's default-value transformer,
  returning the coerced value or nil.

### Store protocol & backends — `katamorph.store.*`

`store.protocol` defines `IStore` with `-insert`/`-find`; the public helpers
are `insert!` (returns `Promise<doc>`) and `find-docs` (field-equality query
map, `:limit` caps results, returns `Promise<vector>`). Store instances are
callable: `(store query)` is shorthand for `find-docs`.

- `store.memory` — `MemoryCollection`, the default process-local backend.
  Build one from a store resource definition with `memory-collection`.
- `store.registry` — `register-store!`, `registered-store`, `store-ids`,
  `reset-stores!`, and `get-store!` (resolves a store by id, lazily
  instantiating a memory-backed store from its resource definition).
- `store.law` — schema-guard compilation used to validate documents on insert.

A `mongo` backend referenced in the package purpose is registered through this
same protocol/registry seam (stores are resolved by id, so the calling
convention is identical across backends).

### Action interpreter — `katamorph.action.interpreter`

`execute!` runs the `:action/*` facet of a resource, returning a Promise.
Resolution order: inline `:action/fn` (anonymous, never registered) →
registered action kinds → EDN action resources matched by `:action/id`
(expanded and re-executed). Before execution the action's `:action/scope`
declaration is resolved into a flat scope map of action fns, filter fns, and
store instances, injected into `ctx` as `:scope`. Runtime dependencies are
injected via `:contract-runtime/deps` in config (`:run-action!`, `:get-action`,
`:get-scope-declaration`, `:filter-fn`, `:load-resources`, `:get-store`).

### Registries — `katamorph.registry.resource` & `katamorph.{condition,driver,filter}.registry`

`registry.resource` builds EDN-backed registries per resource kind
(`actions-registry`, `triggers-registry`, `actors-registry`, `agents-registry`,
`capabilities-registry`, `roles-registry`, `workflows-registry`,
`schedules-registry`, `sources-registry`, …) plus `registry`/`catalog` lookups.
`condition.registry`, `driver.registry`, and `filter.registry` hold the
pluggable predicate/driver/filter handlers referenced from contracts.

### Policy engine — `katamorph.policy.*`

`policy.eval` (eval-node interpreter), `policy.fulfillment`, and `policy.gate`
evaluate the policy/fulfillment/gate contracts defined in `katamorph.schema`.

### Agent utilities — `katamorph.agent.*`

`agent.context`, `agent.reasoning`, `agent.text_delta`, `agent.tool_lifecycle`,
`agent.turn_guards` — helpers for an agent runtime turn (reasoning capture,
streamed text deltas, tool-call lifecycle, per-turn guard rails).

### Misc — `katamorph.law.url`

URL helpers used by store/resource resolution.
