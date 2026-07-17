---
original_name: 'clojurescript runtimes_compilers.md'
title: 'JavaScript ClojureScript Boundary Discipline'
summary: 'Establishing strict JS/CLJS boundary layers and wire contracts.'
category: 'dev'
created: '2026-07-10'
---

# you bring up a problem we have to address early on, in js/clj data type interop can get messy if you don't establish those boundries early, and enforce them cleanly.

I'd like for the macros to consume cljs data types, and handle where the translations need to happen, so I can operate with out thinking about the issue.

I really... don't know the long term real solution to this, at least when dealing with agents. They will just do the conversions and add annotations everywhere until they get confused enough they can't reason about it any more.

I was working with something like a `boundries.js` `boundries.node.*` `boundries.library-name` kind of scheme,

What do you think? I would like for `domain.*` and `infra.*` to never have any js types, but.... promises can kinda make that odd, fastify made it kinda wierd, it's high order functions handed us js types, and expected js types.

I didn't design a DSL for that until most my rest api was already written the last time, I think wrapping those sorts of frameworky things in macros to make them make sense in clojure is the way to go.

Yes. I think this has to be an architectural law, not an aspiration:

> **Domain and infrastructure operate on ημ values. Boundary namespaces alone may see JavaScript values, promises, callbacks, or host objects.**

That is the long-term solution to agents spraying `js->clj`, `clj->js`, `#js`, `aget`, and type annotations across the codebase: make those operations structurally illegal outside a narrow anti-corruption layer, then give people—and agents—a pleasant DSL so they never need to reach for raw interop.

ClojureScript can directly consume Promise APIs and its current compiler can emit native JavaScript `async` functions from `^:async` definitions, so there is no need to contaminate the domain just because Node libraries happen to be asynchronous.[^7_1][^7_2]

## The boundary law

I would draw the line slightly differently than “no JS in `domain.*` and `infra.*`.”


| Namespace family | JS values allowed? | Promise allowed? | Responsibility |
| :-- | --: | --: | :-- |
| `shape.*`, `law.*`, `domain.*` | Never | Never | Pure contracts, transformations, decisions |
| `application.*` | Never | Prefer no | Use-case orchestration, effect descriptions |
| `infra.*` | Never directly | Never directly | Port implementations expressed in ημ data |
| `boundaries.*` | Yes | Yes | Node/npm/framework translation |
| `runtime.*` | Yes | Yes | Process startup, adapter composition, lifecycle |
| Generated OpenCode adapter | Yes | Yes | Host-specific glue only |

The key correction is that `infra.*` should mean **infrastructure semantics**, not “whatever framework code touches the network.” A Fastify implementation is a Node boundary adapter; a persistent repository port that accepts and returns ημ values is `infra.*`.

So this:

```text
domain → application → infra → boundaries.node.fastify → Fastify
```

is preferable to this:

```text
domain → infra.fastify → Fastify
```

Your existing instinct to put explicit Node wrappers around libraries and enforce a CLJS/JS separation is exactly the right basis.

## Name boundaries by vendor

Your proposed naming scheme is good, with one refinement: use `boundaries` as a **plural package**, and name namespaces by the external vocabulary they isolate.

```text
src/
  ημ/
    shape/
    law/
    domain/
    application/
    infra/

    boundaries/
      js.cljs                 ; minimal primitive conversions
      node/
        fs.cljs
        path.cljs
        process.cljs
        streams.cljs
      fastify.cljs
      opencode.cljs
      npm/
        zod.cljs
        pino.cljs
      library/
        playwright.cljs
        discord_js.cljs

    runtime/
      server.cljs
      opencode_plugin.cljs
```

I would avoid a generic `boundaries.library-name` flat namespace once the codebase grows. Group by host/runtime first where it gives useful policy (`node/*`, `browser/*`), then by individual library.

```clojure
(ημ.boundaries.fastify/listen! app {:port 3000})
(ημ.boundaries.node.fs/read-text! path)
(ημ.boundaries.opencode/register-plugin! registry)
```

The important part is that **no one imports npm directly outside `ημ.boundaries.*`**. Shadow CLJS can import npm modules normally, but the ability to import them should not become permission for every domain namespace to depend on their object models.[^7_3][^7_4]

## Do not use raw `js->clj`

A global unconstrained `js->clj` is a leaky and ambiguous conversion. It does not know whether a JavaScript object represents:

- A request body to decode.
- An opaque Fastify request.
- A Node stream.
- A callback-bearing capability.
- An `Error`.
- An array that should become a vector.
- An object whose prototype and methods must be retained.

Instead, encode and decode named **wire contracts** at each boundary.

```clojure
(ns ημ.boundaries.fastify
  (:require
   [malli.core :as m]
   [ημ.wire.http :as http]
   ["fastify" :as Fastify]))

(defn decode-request
  [request]
  {:http/method  (keyword (.-method request))
   :http/path    (.-url request)
   :http/headers (js->clj (.-headers request))
   :http/params  (js->clj (.-params request) :keywordize-keys true)
   :http/query   (js->clj (.-query request) :keywordize-keys true)
   :http/body    (js->clj (.-body request) :keywordize-keys true)})

(defn encode-response
  [{:http/keys [status headers body]}]
  {:status  (or status 200)
   :headers (or headers {})
   :body    (clj->js body)})
```

Then only the boundary has permission to touch raw Fastify request/reply objects. The rest sees:

```clojure
{:http/method :post
 :http/path "/contracts"
 :http/headers {"content-type" "application/json"}
 :http/params {}
 :http/query {}
 :http/body {:contract/id :agent/research}}
```

Validate at that point—before the object gets any deeper:

```clojure
(defn decode-request!
  [request]
  (let [value (decode-request request)]
    (if (m/validate http/request value)
      value
      (throw (ex-info "Invalid inbound HTTP request"
                      {:boundary :fastify
                       :explain  (m/explain http/request value)})))))
```

That is the difference between “we convert JS to Clojure” and “we enforce an ingress contract.”

## Promise is not domain data

You are right that Promises make this feel weird. The rule is simple:

> A Promise is a transport implementation detail, not a domain value.

A boundary function may return a JS Promise because Fastify/OpenCode/Node demand it. But immediately after the await point, restore ημ data.

ClojureScript now supports native `await` inside `^:async` functions, which lets an adapter look direct and ordinary without spreading `.then` chains across your system.  If you use `core.async`, `<p!` can consume a JS Promise inside a `go` block, but that changes the API to a channel; do that only if channels are actually your internal concurrency model.[^7_2][^7_1]

```clojure
(ns ημ.boundaries.node.fs
  (:require
   ["node:fs/promises" :as fs]
   [ημ.boundaries.js :as jsb]))

(defn ^:async read-text!
  [path]
  (try
    (await (.readFile fs path "utf8"))
    (catch :default cause
      (throw (ex-info "Unable to read file"
                      {:boundary :node.fs
                       :path path}
                      cause)))))
```

The boundary returns `Promise<string>` to satisfy its host integration. An application adapter may await it and then turn it into a domain result:

```clojure
(ns ημ.infra.contract-store
  (:require
   [ημ.boundaries.node.fs :as fs]
   [ημ.domain.contract :as contract]))

(defn ^:async load-contract!
  [path]
  (let [text  (await (fs/read-text! path))
        value (reader/read-string text)]
    (contract/validate! value)))
```

There are still no JS objects, `#js` literals, or JS property accesses in `infra.contract-store`; it only coordinates asynchronous effects and handles ημ representations.

If you want the strictest version, call that layer `application.async` or `adapters.*`, and permit native async only in `boundaries.*` plus `runtime.*`. The core remains fully synchronous and referentially transparent.

## Macros should generate adapters

Your macros should accept domain shapes and produce all ingress/egress machinery. This is the useful part of `deftool`, `defhook`, `defroute`, and eventually `defplugin`.

```clojure
(defroute create-contract
  {:method :post
   :path   "/contracts"

   :input  [:map
            [:contract ημ.contract/contract]]
   :output [:map
            [:contract ημ.contract/contract]]

   :errors {:invalid-input 400
            :not-found     404
            :forbidden     403}}
  [{:keys [contract]} context]
  (contracts/create! context contract))
```

The macro should generate a Fastify-specific handler only at the outermost edge:

```clojure
(fn [js-request js-reply]
  (try
    (let [input   (fastify/decode-input! request-schema js-request)
          context (fastify/decode-context js-request)
          result  (await (create-contract input context))
          output  (validate-output! response-schema result)]
      (fastify/send! js-reply output))
    (catch :default error
      (fastify/send-error! js-reply
                           (errors/normalize error)))))
```

Your hand-written body sees only validated CLJS data. It does not know Fastify has `reply.code`, `request.raw`, overloaded callback APIs, serializers, or plugin decorators.

That means an agent cannot “helpfully” toss in a `js->clj` conversion within a route body, because it has no raw JS request in scope to convert.

## Use explicit port contracts

For durable boundaries, define ports as protocols or ordinary operation maps. The domain receives a capability with a data-oriented signature:

```clojure
{:contracts/read!
 (fn [contract-id]
   ;; Promise<ημ contract>, never Promise<JS object>
   ...)

 :ledger/append!
 (fn [event]
   ;; Promise<ημ receipt>
   ...)}
```

Or:

```clojure
(defprotocol ContractStore
  (fetch-contract! [store contract-id])
  (save-contract! [store contract]))
```

The protocol itself must specify ημ values only. The Node-backed implementation can delegate to `ημ.boundaries.node.fs`, PostgreSQL, HTTP, or a future JVM implementation. This aligns with your contract-first approach: schemas and protocols make valid boundary crossings explicit rather than relying on convention.

For effects, I would return a small explicit result algebra instead of framework exceptions or arbitrary callback values:

```clojure
{:ημ/result :ok
 :value      contract}

{:ημ/result :error
 :error      {:kind :contract/not-found
              :id contract-id}}

{:ημ/result :error
 :error      {:kind :io/unavailable
              :operation :contracts/read
              :retryable? true}}
```

At the Fastify boundary, that becomes status + JS response. At OpenCode, it becomes the host’s tool-result format. At MCP, it becomes an MCP error or structured result. The core never has to learn those differences.

## Enforce it mechanically

The architecture fails if enforcement is merely a README. Add a `clj-kondo` custom linter or hooks that reject JS interop forms outside approved namespaces.

Policy:

```text
Forbidden except in ημ.boundaries.*, ημ.runtime.*, ημ.generated.*:
- js*
- js-obj
- js->clj
- clj->js
- aget, aset, alength
- goog.object/*
- direct npm-string requires: ["fastify" :as ...]
- #js literals
- .- / .? member access
- ^js and other raw JS type hints
```

You already have a shared `clj-kondo` setup and have used custom hooks to encode project-level structural rules, so this is a very appropriate house rule rather than an exotic new toolchain.[^7_5]

Also require these conditions in CI:

- `domain.*`, `shape.*`, and `law.*` have no imports from `ημ.boundaries.*`.
- Only `ημ.boundaries.*` can require npm package strings.
- Every decoder has an input contract and tests for malformed external values.
- Every encoder has output contract tests and round-trip or golden tests.
- The generated OpenCode/Fastify callbacks are integration-tested at least once.


## One warning about macros

Macros should make framework APIs feel Clojure-shaped, but do **not** let them hide semantic operations.

Good macro:

```clojure
(defroute list-contracts
  {:get "/contracts"
   :query [:map [:status {:optional true} :keyword]]}
  [input ctx]
  ...)
```

Bad macro:

```clojure
(with-fastify request reply
  ;; arbitrary JS operations everywhere
  ...)
```

The first declares a contract and produces a boundary adapter. The second just launders JavaScript through a nicer spelling.

Start with three narrow adapters:

1. `defroute` — Fastify request decode, response encode, error translation.
2. `deftool` — OpenCode input decode, tool-result encode, permissions/context normalization.
3. `defcommand` — CLI argv/env decode and process exit/error translation.

Once these demonstrate the pattern, `defhook`, WebSocket, filesystem watchers, streams, and browser APIs can follow the same ingress → validate → ημ operation → validate → egress form.
<span style="display:none">[^7_10][^7_11][^7_12][^7_13][^7_14][^7_15][^7_16][^7_6][^7_7][^7_8][^7_9]</span>

<div align="center">⁂</div>

[^7_1]: https://clojurescript.org/guides/promise-interop

[^7_2]: https://clojurescript.org/news/2026-05-07-release

[^7_3]: https://shadow-cljs.github.io/docs/UsersGuide.html

[^7_4]: https://clojureverse.org/t/guide-on-how-to-use-import-npm-modules-packages-in-clojurescript/2298

[^7_5]: https://www.perplexity.ai/search/e94d8a76-23ab-4117-9111-087b0ce3d945

[^7_6]: https://cljdoc.org/d/clojure-interop/cljs-web-api/1.0.10/api/js.Promise

[^7_7]: https://clojureverse.org/t/how-to-deal-with-js-async-and-js-await-in-clojurescript/10234

[^7_8]: https://ask.clojure.org/index.php/9609/documentation-issues-on-clojurescript-promises-interop

[^7_9]: https://clojurescript.org/reference/javascript-api

[^7_10]: https://kit-clj.github.io/docs/clojurescript.html

[^7_11]: https://stackoverflow.com/questions/60937118/how-to-work-with-javascript-promises-in-clojurescript

[^7_12]: https://www.npmjs.com/package/shadow-cljs

[^7_13]: https://www.bitsbyluke.com/2018/10/20/clojurescript-interop-with-javascript.html

[^7_14]: https://github.com/thheller/shadow-cljs/blob/master/doc/esm.md

[^7_15]: https://blog.csdn.net/weixin_33924770/article/details/88961560

[^7_16]: https://gist.github.com/jmlsf/f41b46c43a31224f46a41b361356f04d