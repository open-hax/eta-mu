---
original_name: 'clojurescript runtimes_compilers.md'
title: 'DSL and Data Interpreter System Design'
summary: 'End-to-end design for a capability-driven DSL interpreter.'
category: 'dev'
created: '2026-07-10'
---

# Keep goin, let's just power through this DSL and data interpreter js system.

Yes. Let’s lock the center down: **ημ data is the only language your application code speaks; JavaScript is an external transport; the interpreter owns every crossing.** The DSL is not primarily a convenience layer—it is the mechanism that prevents framework-shaped thinking from spreading through the system.

OpenCode’s plugin runtime is inherently JS-shaped—plugin functions receive a host context and return hook objects, and tools are exposed through its helper—but that makes it a clean target for an adapter compiler rather than a reason to put host values in your domain.  ClojureScript’s `^:async` functions now compile to native JavaScript `async` functions, which gives boundary adapters direct Promise interoperability without changing your internal data model.[^8_1][^8_2]

## Runtime model

Make the runtime four explicit phases:

```text
host value
  -> decode
ημ ingress value
  -> validate
ημ command
  -> interpret
ημ result / effects
  -> validate
ημ egress value
  -> encode
host value
```

Every boundary must name all six things:

```clojure
{:boundary/id     :opencode/tool
 :ingress/schema  :ημ.schema/opencode-tool-input
 :command/schema  :ημ.schema/tool-command
 :result/schema   :ημ.schema/tool-result
 :egress/schema   :ημ.schema/opencode-tool-output
 :decode          :ημ.boundary.opencode/decode-tool-input
 :encode          :ημ.boundary.opencode/encode-tool-output}
```

The application never receives `request`, `reply`, `ctx`, `client`, `Promise`, a Node stream, a Zod schema, or an OpenCode object. It receives a validated command map and a constrained capability environment.

## Namespace topology

I’d make this the permanent layout:

```text
src/ημ/
  shape/                       ; data shapes and vocabulary
  law/                         ; schemas, contracts, invariants
  domain/                      ; pure decisions and state transforms
  application/                 ; use cases and effect planning
  infra/                       ; ημ-facing port implementations

  effect/
    interpreter.cljs           ; interprets declarative effects
    result.cljs                ; success/failure algebra
    capability.cljs            ; capability declarations

  boundary/
    js.cljs                    ; only primitive, audited conversions
    node/
      fs.cljs
      process.cljs
      path.cljs
    fastify.cljs
    opencode.cljs
    mcp.cljs
    library/
      discord.cljs
      playwright.cljs

  dsl/
    contract.clj
    tool.clj
    hook.clj
    route.clj
    plugin.clj
    registry.cljc
    normalize.cljc
    validate.cljc

  target/
    opencode.cljs
    fastify.cljs
    typescript.cljs
    json_schema.cljs

  runtime/
    node.cljs                  ; startup, process lifecycle
    opencode.cljs              ; compiled export OpenCode invokes
```

`.clj` macros build descriptors; `.cljc` holds pure, shareable IR transforms; `.cljs` holds executable Node output. `boundary.*` is the only tree permitted raw JS interop, while `target.*` turns the canonical DSL into host registration functions.

Your existing desire to keep Node-specific code behind explicit protocol/schema wrappers maps directly to this split.

## One canonical envelope

All calls, regardless of origin, should normalize into a single envelope:

```clojure
{:ημ/envelope :command
 :ημ/id       #uuid "a67c0fbd-4b8e-4b96-9fc5-6bb41f8dba74"
 :ημ/source   {:kind :opencode
               :session/id "ses_..."
               :project/id :knoxx}
 :ημ/target   :capability/research-search
 :ημ/input    {:query "ClojureScript native async await"
               :limit 10}
 :ημ/auth     {:grants #{:network/search}}
 :ημ/trace    {:trace/id "..."
               :parent/id nil}
 :ημ/time     {:submitted-at "2026-07-10T13:03:00Z"}}
```

And one result algebra:

```clojure
{:ημ/result :ok
 :ημ/value  {:findings [...]}
 :ημ/meta   {:effects [{:effect :network/request
                        :provider :brave
                        :duration-ms 214}]}}

{:ημ/result :rejected
 :ημ/error  {:kind :policy/denied
              :capability :network/search
              :reason "The active profile does not grant search."}}

{:ημ/result :failed
 :ημ/error  {:kind :network/unavailable
              :retryable? true
              :operation :search/query}}
```

This is the point where Fastify, OpenCode, MCP, a CLI command, a Discord command, or your browser bridge become interchangeable **sources**. Their request shapes differ; their meaning after decode does not.

## Capability vocabulary

Do not make a tool the primitive. A **capability** is the primitive; a tool, route, command, and MCP method are different presentations of it.

```clojure
{:ημ/kind        :capability
 :ημ/id          :research/search
 :ημ/input       :schema/research-search-input
 :ημ/output      :schema/research-search-output
 :ημ/effects     #{:network/search}
 :ημ/handler     'ημ.domain.research/search
 :ημ/errors      #{:policy/denied
                    :input/invalid
                    :network/unavailable}
 :ημ/docs        {:summary "Search configured public sources."}}
```

Expose it to OpenCode in `.ημ/config/opencode/plugins/research.edn`:

```clojure
{:tools
 [{:id          :opencode/research-search
   :capability  :research/search
   :name        "research_search"
   :description "Search configured public sources."
   :permissions #{:network/search}}]}
```

OpenCode itself supports controlling tools through allow, deny, and approval permissions, including wildcard rules; your compiler should render compatible host permissions but keep ημ’s capability grant check authoritative.[^8_3]

## The effect boundary

This is where you avoid the “Promisey domain” problem. Domain handlers return data describing what must happen; they do not call Node or return host Promises.

```clojure
(ns ημ.domain.research)

(defn search
  [{:keys [ημ/input]}]
  {:ημ/result :plan
   :ημ/effects
   [{:effect/id    :network/search
     :effect/input {:query (:query ημ/input)
                    :limit (or (:limit ημ/input) 10)}}]})
```

An application interpreter executes the plan:

```clojure
(ns ημ.effect.interpreter)

(defn ^:async run!
  [capabilities command]
  (let [plan (dispatch-domain command)]
    (if (= :plan (:ημ/result plan))
      (execute-effects! capabilities command plan)
      plan)))
```

Only `execute-effects!` needs to await external work. It calls a capability implementation that accepts and returns ημ values:

```clojure
{:network/search
 (fn ^:async [{:keys [query limit]}]
   ;; Internally delegates to ημ.boundary.library.brave.
   ;; Resolves to ημ search results, never a raw Response.
   ...)}
```

This gives you a functional core with an imperative shell. If an agent sees `ημ.domain.research/search`, there is literally no JS object or network client available to misuse.

## Context is capability injection

Do not pass a broad `ctx` with Node, OpenCode, or Fastify in it. Pass named, restricted capabilities:

```clojure
{:ημ/capabilities
 {:network/search search-capability
  :ledger/append  append-event!
  :clock/now      now
  :id/new         new-id}}
```

A handler only gets the subcontext it declares:

```clojure
(defcapability search
  {:requires #{:network/search :clock/now}
   :input    :schema/research-search-input
   :output   :schema/research-search-output}
  [{:keys [input capabilities]}]
  (let [query (:query input)]
    {:ημ/result :plan
     :ημ/effects [{:effect/id :network/search
                   :effect/input {:query query}}]}))
```

The interpreter resolves `:network/search`; the domain function does not. This makes permissions and effects inspectable before execution, which is particularly valuable for agent tools.

## DSL forms

Here is the smallest useful vocabulary:

```clojure
(defschema research-search-input
  [:map
   [:query :string]
   [:limit {:optional true} [:int {:min 1 :max 50}]]])

(defschema research-search-output
  [:map
   [:findings [:vector :research/finding]]])

(defcapability research-search
  {:id      :research/search
   :input   :schema/research-search-input
   :output  :schema/research-search-output
   :effects #{:network/search}
   :errors  #{:policy/denied :network/unavailable}}
  [command]
  (research/plan command))

(deftool research-search
  {:capability :research/search
   :expose     {:opencode {:name "research_search"
                           :description "Search configured sources."}
                :mcp      {:name "research.search"}}})
```

The `defcapability` macro should generate:

- An ordinary pure CLJS function.
- A fully serializable descriptor.
- A registration record in a local compile manifest.
- Optionally, a test helper that checks input, output, declared effects, and error variants.

`deftool` **must not contain tool behavior**. It associates an existing capability with an exposure target. That is how you prevent a future OpenCode-specific implementation fork.

## The compiler pipeline

```text
Macro descriptors               .ημ/config/opencode/**/*.edn
       |                                      |
       v                                      v
  capability registry ----------------> composition registry
                         |
                         v
                 link + normalize
                         |
                         v
              validate semantic laws
                         |
              ┌──────────┼─────────────┬──────────────┐
              v          v             v              v
       OpenCode module  Fastify      MCP schema       .d.ts
       + config JSON   routes       / manifests       types
```

Validation should reject:

- An exposure pointing to an unknown capability.
- A public tool whose input/output schema cannot be rendered to a wire schema.
- A capability with effects omitted from the active profile.
- Duplicate public tool names.
- A domain namespace importing `boundary.*`.
- An undeclared effect in a result plan.
- An implementation returning a result not covered by its declared output or errors.

That is the “agent proofing” part. Rather than trusting a model to maintain invisible conventions, make invalid architecture impossible to compile.

## Host adapter example

The OpenCode target compiles a linked tool definition into an adapter that owns all JS.

```clojure
(ns ημ.target.opencode
  (:require
   [ημ.boundary.opencode :as boundary]
   [ημ.effect.interpreter :as effect]
   [ημ.law.validate :as validate]))

(defn compile-tool
  [{:keys [name description input output capability]} runtime]
  #js {:description description
       :args        (boundary/schema->zod input)
       :execute
       (fn ^:async [js-args js-context]
         (let [command (boundary/decode-tool! capability js-args js-context)
               result  (await (effect/run! runtime command))
               _       (validate/result! capability result)]
           (boundary/encode-tool-result result)))})
```

That shape matches OpenCode’s model: plugins receive the runtime context and custom tools carry a description, argument schema, and execute function.  But none of that type shape escapes into your capability or domain code.[^8_2]

## Type and wire policy

Decide this early and write it into `law.wire`:


| ημ value | JSON / host wire representation |
| :-- | :-- |
| Keyword | String, normally `"namespace/name"` |
| UUID | Canonical string |
| Instant | RFC 3339 / ISO-8601 string |
| Set | Array with uniqueness validation |
| Map with keyword keys | Plain JS object with string keys |
| Tagged union | Object with explicit `kind` discriminator |
| `nil` | `null`, never silently omitted |
| Absent optional map key | Omitted / `undefined` at JS edge only |
| Function, protocol, lazy seq | Never crosses a wire boundary |
| JS Date, Error, Request, Response, stream | Host opaque; decode to ημ data or handle only in `boundary.*` |

This turns an endless collection of ad hoc conversions into a small, testable algebra. Your TypeScript declaration emitter, JSON Schema exporter, Malli validators, and all host adapters should be generated from this wire policy—not each reinventing it.

## First red/green ladder

Do this in an order that proves the design rather than generating a mountain of framework code.

1. **μ0 — Wire primitives:** implement `decode`/`encode` for strings, keywords, UUIDs, instants, vectors, maps, optional keys, and tagged unions.
2. **μ1 — Boundary guard:** add the linter rule: raw JS interop is illegal outside `ημ.boundary.*` and `ημ.runtime.*`.
3. **μ2 — Result algebra:** implement and validate `:ok`, `:rejected`, and `:failed`.
4. **μ3 — Capability descriptor:** `defschema` and `defcapability`, with a manifest test.
5. **μ4 — Effect interpreter:** execute one fake `:network/search` capability with a deterministic test double.
6. **μ5 — OpenCode projection:** `deftool` plus one generated plugin module whose `execute` decodes, validates, interprets, and encodes.
7. **μ6 — Fastify projection:** the same capability through `defroute`, proving the core is host-independent.
8. **μ7 — `.d.ts` projection:** emit types from the schemas and compile a minimal TypeScript consumer fixture.
9. **μ8 — Config linker:** read and compose `.ημ/config/opencode/**/*.edn`, link symbols through an allowlisted handler registry, and generate `.opencode/`.

The one thing I would deliberately postpone is a generic “arbitrary JS library adapter DSL.” First prove the boundary grammar against Fastify and OpenCode—the two awkward, higher-order, async-heavy hosts you actually need. Once both compile the same capability correctly, the common abstraction will be discovered rather than imagined.
<span style="display:none">[^8_10][^8_11][^8_12][^8_13][^8_14][^8_15][^8_4][^8_5][^8_6][^8_7][^8_8][^8_9]</span>

<div align="center">⁂</div>

[^8_1]: https://clojurescript.org/news/2026-05-07-release

[^8_2]: https://opencode.ai/docs/plugins/

[^8_3]: https://opencode.ai/docs/tools/

[^8_4]: https://www.youtube.com/watch?v=gAKhUR_wyAk

[^8_5]: https://byteiota.com/clojurescript-async-await-bridging-fp-and-javascript-2026/

[^8_6]: https://opencode.ai/docs/ko/plugins/

[^8_7]: https://news.hada.io/topic?id=29336

[^8_8]: https://dev.opencode.ai/docs/it/plugins/

[^8_9]: https://clojureverse.org/t/how-to-deal-with-js-async-and-js-await-in-clojurescript/10234

[^8_10]: https://github.com/active-group/cljs-async

[^8_11]: https://github.com/roman01la/cljs-async-await

[^8_12]: https://opencode.ai/docs/de/plugins/

[^8_13]: https://dev.opencode.ai/docs/th/plugins/

[^8_14]: https://dev.opencode.ai/docs/da/plugins/

[^8_15]: https://blog.jeaye.com/2017/09/30/clojurescript-promesa/