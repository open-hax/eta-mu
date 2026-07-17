---
original_name: 'clojurescript runtimes_compilers.md'
title: 'Keryx Package Proposal for OpenCode'
summary: 'Proposing a new packages/opencode workspace package for the interpreter.'
category: 'design'
created: '2026-07-10'
---

# https://github.com/open-hax/eta-mu@GitHub wrap your brains around this and begin designing a new package for the mono repo. It's a bit of chaos at the moment, but this will be the first feature built thinking about opencode first, rather than eta-mu's own harness. Progress, I think, considering the shapes from this direction like this.

Yes—this is progress. The new package should be **the OpenCode-first reference implementation of ημ’s interpreter model**, not another extension bundle that grows framework logic organically.

The repository already has an extensions package with OpenCode targets/builds, an `opencode.jsonc`, macro namespaces, adapters, and a substantial set of individual extension modules; it also contains a separate contract-output package organized as `shape`, `law`, `domain`, `infra`, and `extern`. That is enough existing precedent to make a new, clean package worthwhile rather than attempting a risky rewrite of the current extensions surface.[^9_1]

## Package proposal

Create:

```text
packages/opencode/
```

with the npm identity:

```json
{
  "name": "@open-hax/opencode",
  "private": true
}
```

I would **not** call it `eta-mu-opencode` initially. It is an OpenCode integration package owned by the monorepo, but its job is to prove and host the reusable ημ interpreter architecture—not to absorb every historical ημ extension.

```text
packages/opencode/
  README.md
  package.json
  shadow-cljs.edn
  deps.edn
  manifest.edn

  .ημ/
    PRINCIPLE.edn
    config/
      opencode/
        root.edn
        profiles.edn
        plugins/
          core.edn
          policy.edn
          research.edn
        permissions/
          local.edn
          ci.edn

  src/
    eta_mu/
      opencode/
        shape/
          ids.cljc
          wire.cljc
          envelope.cljc
          result.cljc
          descriptor.cljc

        law/
          schema.cljc
          capability.cljc
          boundary.cljc
          registry.cljc
          policy.cljc

        domain/
          registry.cljs
          invoke.cljs
          policy.cljs
          effects.cljs

        infra/
          config.cljs
          handler_registry.cljs
          ledger.cljs
          effect_interpreter.cljs

        boundary/
          js.cljs
          opencode.cljs
          node/
            fs.cljs
            path.cljs

        target/
          opencode.cljs
          json.cljs
          typescript.cljs
          json_schema.cljs

        dsl/
          core.clj
          tool.clj
          hook.clj
          plugin.clj
          config.cljc

        runtime/
          plugin.cljs
          compile.cljs

  test/
    eta_mu/
      opencode/
        shape/
        law/
        domain/
        infra/
        boundary/
        target/
        integration/

  generated/
    .gitkeep
```

The package must be small enough to understand from top to bottom. It should become the place where “what does an ημ capability mean at an agent-host boundary?” has a precise, tested answer.

## What it owns

This package owns five things:

1. **A canonical capability/tool IR** — Clojure data which says what exists.
2. **Boundary codecs** — the only translation between JS/OpenCode and ημ data.
3. **A data interpreter** — validates, authorizes, dispatches, and renders results.
4. **An OpenCode compiler** — turns `.ημ/config/opencode/*.edn` plus registered handlers into a host plugin.
5. **Generated projections** — `.opencode` artifact, JSON Schema, docs, and eventually `.d.ts`.

It does **not** own:

- The global ημ contract model, if that already lives in a general-purpose package.
- Your Pi target, except through the future shared IR.
- Generic Fastify routing.
- A collection of unrelated OpenCode “features.”
- Domain-specific research, browser, Discord, or Git behavior.

Those remain consumers of this system.

## The central abstraction

The package should have exactly one major abstraction:

```clojure
{:ημ/kind        :capability
 :ημ/id          :research/search
 :ημ/input       :schema/research-query
 :ημ/output      :schema/research-findings
 :ημ/errors      #{:input/invalid
                    :policy/denied
                    :network/unavailable}
 :ημ/effects     #{:network/search}
 :ημ/handler     'my.project.research/search
 :ημ/export      {:opencode {:name "research_search"
                             :description "Search configured sources."}}}
```

Everything else compiles from or interprets this descriptor.

- A **tool** is an OpenCode exposure of a capability.
- A **route** is an HTTP exposure of a capability.
- An **MCP tool** is an MCP exposure of a capability.
- A **CLI command** is a command-line exposure of a capability.
- A **hook** is an event-triggered capability invocation with no user-facing tool name.

That distinction prevents you from repeating “business behavior” in every host adapter.

## The first DSL

Keep the initial DSL intentionally narrow:

```clojure
(ns my.project.research
  (:require
   [eta-mu.opencode.dsl.core :refer-macros
    [defschema defcapability deftool]]))

(defschema search-input
  [:map
   [:query :string]
   [:limit {:optional true} [:int {:min 1 :max 50}]]])

(defschema search-output
  [:map
   [:findings
    [:vector
     [:map
      [:title :string]
      [:url :string]
      [:summary {:optional true} :string]]]]])

(defcapability search
  {:id      :research/search
   :input   ::search-input
   :output  ::search-output
   :effects #{:network/search}}
  [{:keys [ημ/input]}]
  {:ημ/result :plan
   :ημ/effects
   [{:effect/id    :network/search
     :effect/input {:query (:query ημ/input)
                    :limit (or (:limit ημ/input) 10)}}]})

(deftool opencode-search
  {:capability :research/search
   :opencode   {:name "research_search"
                :description "Search configured public sources."}})
```

`defcapability` creates the implementation plus a serializable descriptor. `deftool` creates an exposure descriptor only; it must not contain behavior.

That has two important consequences:

- Domains work in normal CLJS maps, vectors, keywords, UUID values, and errors.
- OpenCode’s JS objects, schemas, tool APIs, callbacks, hooks, and Promise conventions have nowhere to enter the domain.

OpenCode plugins are host modules that receive context and return hooks; custom tools are host-defined executable functions. This package should generate that outer host layer from the descriptors rather than make authors write it repeatedly.[^9_2][^9_3]

## The configuration layer

Put project-specific composition precisely where you proposed:

```text
.ημ/
  config/
    opencode/
      root.edn
      profiles.edn
      plugins/
        research.edn
        browser.edn
        policy.edn
```

Example:

```clojure
;; .ημ/config/opencode/root.edn
{:ημ/opencode-version 1
 :project/id :my-project

 :imports
 ["profiles.edn"
  "plugins/policy.edn"
  "plugins/research.edn"
  "plugins/browser.edn"]

 :profile :local}
```

```clojure
;; .ημ/config/opencode/plugins/research.edn
{:exposures
 [{:ημ/kind       :tool
   :ημ/id         :opencode/research-search
   :capability/id :research/search
   :opencode/name "research_search"}]}
```

```clojure
;; .ημ/config/opencode/profiles.edn
{:profiles
 {:local
  {:grant-effects #{:network/search :filesystem/read}
   :audit :verbose}

  :ci
  {:grant-effects #{:filesystem/read}
   :audit :strict}}}
```

The compiler pipeline is then straightforward:

```text
macro descriptors
  + .ημ/config/opencode fragments
  + approved handler registry
          |
          v
link and normalize
          |
          v
validate semantic laws
          |
          v
compile OpenCode plugin adapter
          |
          +--> generated/.opencode/opencode.json
          +--> generated/.opencode/plugins/eta-mu.mjs
          +--> generated/manifest.edn
          +--> generated/index.d.ts
```

The generated `.opencode/` output can be copied or symlinked into an actual project runtime directory. It should never become the hand-maintained source of truth.

## Boundary design

The package’s strongest contribution should be the boundary discipline.

```text
OpenCode JS input
      |
      v
eta-mu.opencode.boundary.opencode/decode-tool!
      |
      v
validated ημ command envelope
      |
      v
eta-mu.opencode.domain/invoke
      |
      v
ημ result algebra
      |
      v
eta-mu.opencode.boundary.opencode/encode-tool-result
      |
      v
OpenCode JS result
```

The canonical command:

```clojure
{:ημ/envelope :command
 :ημ/id       "..."
 :ημ/source   {:kind :opencode
               :session/id "..."
               :workspace/root "/repo"}
 :ημ/target   :research/search
 :ημ/input    {:query "..."
               :limit 10}
 :ημ/auth     {:grants #{:network/search}}
 :ημ/trace    {:trace/id "..."}}
```

The canonical result:

```clojure
{:ημ/result :ok
 :ημ/value  {:findings [...]}
 :ημ/meta   {:effects [...]}}
```

or:

```clojure
{:ημ/result :rejected
 :ημ/error  {:kind :policy/denied
              :effect :network/search}}
```

or:

```clojure
{:ημ/result :failed
 :ημ/error  {:kind :network/unavailable
              :retryable? true}}
```

A host adapter alone decides whether a rejection is an OpenCode error, a tool response, a Fastify `403`, an MCP error, or CLI stderr plus a process exit code.

## Build against reality

The repo appears to have both a mature extension surface and a contract-output package already using the `shape` / `law` / `domain` / `infra` split, as well as OpenCode-specific build targets and adapter scripts.  Do **not** migrate those first.[^9_1]

Instead, make `packages/opencode` prove the architecture with one new, low-risk OpenCode feature. Good candidates:

- `tool.inspect-config` — reports the resolved ημ OpenCode registry.
- `tool.validate-config` — validates `.ημ/config/opencode` before runtime.
- `tool.list-capabilities` — exposes exactly what is enabled, with input/output schemas and effects.
- A narrowly scoped `session_start` audit hook.
- A single `research_search`-style tool using a fake provider in tests.

`tool.inspect-config` is probably the correct μ0 feature. It has no external side effects, exercises macros, registry linking, config composition, result encoding, and OpenCode execution, and lets you inspect the interpreter’s own model while it develops.

## Initial work packages

### μ0: Create the shell

Deliverables:

- `packages/opencode/package.json`
- `shadow-cljs.edn`
- CLJS test target
- `README.md`
- `.ημ/PRINCIPLE.edn`
- Empty `shape`, `law`, `domain`, `infra`, `boundary`, `dsl`, `target`, and `runtime` namespaces

Acceptance:

```text
pnpm --filter @open-hax/opencode test
pnpm --filter @open-hax/opencode build
```

Both go green with no warnings.

### μ1: Shapes and laws

Deliverables:

- Command envelope schema.
- Result algebra schema.
- Capability descriptor schema.
- Tool exposure descriptor schema.
- Wire policy for keyword, UUID, instant, map, vector, set, union, `nil`, and optional keys.

Acceptance:

- Every valid fixture validates.
- Malformed host-like input is rejected.
- No JS interop appears in `shape.*` or `law.*`.


### μ2: Macro manifest

Deliverables:

- `defschema`
- `defcapability`
- `deftool`
- Local manifest/registry collection

Acceptance:

```clojure
(defcapability hello ...)
(deftool hello-tool ...)
```

produces descriptors that can be inspected as data, without loading OpenCode.

### μ3: Interpreter

Deliverables:

- Capability lookup.
- Profile grant checking.
- Input validation.
- Result validation.
- One deterministic fake effect interpreter.

Acceptance:

- A capability allowed by the active profile succeeds.
- An undeclared effect fails.
- A denied effect returns `:ημ/result :rejected`.
- A malformed implementation result fails loudly.


### μ4: OpenCode target

Deliverables:

- JS ingress decoder.
- OpenCode-result encoder.
- One compiled plugin export.
- An integration test that invokes the generated OpenCode-facing function with fixture JS objects.

Acceptance:

- An OpenCode-shaped call reaches the pure capability implementation.
- The pure result becomes an OpenCode-shaped result.
- No raw host object reaches `domain.*`.


### μ5: Config compiler

Deliverables:

- `.ημ/config/opencode/root.edn` reader.
- Recursive import resolver.
- Duplicate-ID detection.
- Profile transform.
- Allowlisted handler linking.
- `.opencode` artifact emission.

Acceptance:

- Three fragments compose deterministically.
- Duplicate public tool names fail.
- Unknown symbols fail.
- A profile cannot authorize an undeclared effect.


## One hard rule

Add the architectural lint rule before adding real features:

```text
Only eta-mu.opencode.boundary.* and eta-mu.opencode.runtime.*
may use JS interop, JavaScript imports, Promises, #js, js->clj,
clj->js, aget, aset, or property access forms.
```

`infra.*` must receive and return ημ data even when it is asynchronous. It may await a boundary operation, but it may never expose a raw `Response`, Fastify request, OpenCode client, Node error, stream, or JS object.

That is the difference between a framework wrapper and a reliable interpreter boundary. It makes the “right” code path shorter for both humans and agents.

## Migration posture

Treat existing `packages/extensions` OpenCode code as a **behavioral reference and compatibility test corpus**, not as the initial dependency graph. The monorepo’s current extensions package is documented as the constitutional runtime layer and source of `.ημ` contract runtimes used by Pi, OpenCode, and other agent frameworks, so it contains valuable established behavior even if its current organization is not the architecture you want to extend.[^9_1]

The first migration should be one-way:

```text
existing extension behavior
        |
        v
new capability + exposure descriptor
        |
        v
new OpenCode interpreter package
        |
        v
parity test
```

Only after two or three real extensions work through the new package should it become the backend for more general ημ / Pi / MCP targets. That keeps “OpenCode first” from becoming “OpenCode leaks into everything,” while still forcing the model to survive a real agent runtime immediately.
<span style="display:none">[^9_10][^9_11][^9_12][^9_13][^9_14][^9_15][^9_16][^9_17][^9_4][^9_5][^9_6][^9_7][^9_8][^9_9]</span>

<div align="center">⁂</div>

[^9_1]: https://libraries.io/npm/@open-hax%2Feta-mu-extensions

[^9_2]: https://opencode.ai/docs/plugins/

[^9_3]: https://opencode.ai/docs/tools/

[^9_4]: https://github.com/open-hax/eta-mu/security

[^9_5]: https://github.com/open-hax/eta-mu/activity

[^9_6]: https://github.com/open-hax/eta-mu/blob/main/clojure-lsp.edn

[^9_7]: https://github.com/open-hax/eta-mu/blob/main/CROSS_REFERENCES.md

[^9_8]: https://github.com/open-hax/eta-mu/blob/main/AGENTS.md

[^9_9]: https://github.com/open-hax

[^9_10]: https://pi.dev/packages/@open-hax/uxx?page=45

[^9_11]: https://github.com/erasmo-marin/open-hax

[^9_12]: https://github.com/orgs/haxtheweb/repositories

[^9_13]: https://github.com/cryspen/hax/releases

[^9_14]: http://github.com/topics/eta

[^9_15]: https://github.com/Mrrraou/waithax

[^9_16]: https://github.com/earendil-works/pi/issues/1209

[^9_17]: https://github.com/earendil-works/pi/issues/2567