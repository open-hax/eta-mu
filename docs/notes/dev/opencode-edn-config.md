---
original_name: 'clojurescript runtimes_compilers.md'
title: 'Project-Level opencode.edn Configuration'
summary: 'Composable EDN-first configuration for OpenCode projects.'
category: 'dev'
created: '2026-07-10'
---

# you know, it'd be nice to have an `opencode.edn` or something, which I could break down into chunks, instead of the monolith we get by default per project.

Exactly. An `opencode.edn` should be **your project’s composable source configuration**, while OpenCode receives generated `opencode.json`, plugin modules, and tool modules. OpenCode currently consumes JSON/JSONC configuration plus JS/TS plugin and tool modules, so EDN would be a project-side authoring layer rather than something OpenCode reads natively.[^4_1][^4_2]

## Make EDN the source

```text
project/
  opencode.edn                 ; tiny composition root
  opencode/
    policy.edn
    research.edn
    browser.edn
    git.edn
    agents.edn
  src/
    knoxx/opencode/
      compiler.cljs
      runtime.cljs
      tool_registry.cljs
  .opencode/
    opencode.json              ; generated, gitignored or committed
    plugins/
      knoxx.mjs                ; generated Shadow output
    tools/
      knoxx.mjs                ; generated Shadow output
```

`opencode.edn` should contain only project identity, imports, environment selection, and high-level composition:

```clojure
{:opencode/version 1
 :project/id        :knoxx

 :imports
 ["opencode/policy.edn"
  "opencode/research.edn"
  "opencode/browser.edn"
  "opencode/git.edn"
  "opencode/agents.edn"]

 :profiles
 {:dev  {:enable #{:research/search
                   :browser/inspect
                   :git/status}}
  :ci   {:enable #{:git/status}
         :deny   #{:network/* :browser/*}}
  :prod {:enable #{:research/* :browser/* :git/*}}}}
```

The split files export **data fragments**, not operational code.

## Domain fragments

`opencode/research.edn`:

```clojure
{:tools
 [{:id          :research/search
   :impl        knoxx.tools.research/search
   :name        "research_search"
   :description "Search configured public sources."
   :args        [:map
                 [:query :string]
                 [:limit {:optional true} [:int {:min 1 :max 50}]]]
   :requires    #{:network/search}
   :tags        #{:research :network}}]

 :hooks
 [{:id       :research/audit-results
   :event    :tool.execute.after
   :impl     knoxx.policy.audit/tool-result!
   :priority 10}]}
```

`opencode/policy.edn`:

```clojure
{:hooks
 [{:id       :policy/protect-secrets
   :event    :tool.execute.before
   :impl     knoxx.policy.secrets/check!
   :priority 100
   :applies-to #{:read :write :edit :bash}}

  {:id       :policy/audit-execution
   :event    :tool.execute.after
   :impl     knoxx.policy.audit/record!
   :priority -100}]}
```

The `:impl` value is deliberately a qualified symbol, not a serialized function. EDN names a capability implementation; your CLJS compiler resolves it from a deliberately exported handler table.

## Avoid arbitrary eval

Do **not** read EDN and dynamically `resolve` arbitrary symbols from the disk. Treat the EDN as an untrusted-ish declarative input and resolve only against a registry you compile into the application.

```clojure
(ns knoxx.opencode.handlers
  (:require
   [knoxx.tools.research :as research]
   [knoxx.policy.secrets :as secrets]
   [knoxx.policy.audit :as audit]))

(def handlers
  {'knoxx.tools.research/search      research/search
   'knoxx.policy.secrets/check!      secrets/check!
   'knoxx.policy.audit/record!       audit/record!
   'knoxx.policy.audit/tool-result!  audit/tool-result!})
```

```clojure
(defn link-impl
  [handlers {:keys [id impl] :as definition}]
  (if-let [handler (get handlers impl)]
    (assoc definition :handler handler)
    (throw (ex-info "Unknown OpenCode implementation"
                    {:definition id
                     :implementation impl
                     :known (sort (keys handlers))}))))
```

That gets you an explicit link step: invalid tool IDs, missing implementations, duplicate names, invalid Malli schemas, cyclic imports, and illegal profile rules fail at build time rather than halfway through an agent session.

## Imports and merge rules

EDN cannot directly express an `:include` directive without an interpreter, which is good: you get to specify merge semantics instead of adopting accidental behavior.

I would make import order explicit and merge collections by concatenation:

```clojure
(defn merge-fragments
  [& fragments]
  (->> fragments
       (reduce
        (fn [out fragment]
          (-> out
              (update :tools into (:tools fragment))
              (update :hooks into (:hooks fragment))
              (update :agents into (:agents fragment))
              (update :mcp into (:mcp fragment))))
        {:tools [] :hooks [] :agents [] :mcp []})))
```

Then validate uniqueness *after* merge:

```clojure
(defn duplicate-ids
  [definitions]
  (->> definitions
       (map :id)
       frequencies
       (keep (fn [[id n]] (when (< 1 n) id)))
       sort))

(defn validate-registry!
  [{:keys [tools hooks] :as registry}]
  (let [duplicates (concat (duplicate-ids tools)
                           (duplicate-ids hooks))]
    (when (seq duplicates)
      (throw (ex-info "Duplicate OpenCode IDs"
                      {:duplicates (vec duplicates)})))
    registry))
```

This gives you a deterministic “last writer does **not** win” policy. For tools and policies, collisions should almost always be a compile error.

## Profiles are data transforms

Profiles should transform a fully merged registry before compilation:

```clojure
(defn selected?
  [{:keys [enable deny]} {:keys [id tags]}]
  (and
   (or (empty? enable)
       (some #(or (= id %)
                  (and (keyword? %)
                       (= "*" (name %))
                       (= (namespace id) (namespace %))))
             enable))
   (not (some #(or (= id %)
                   (and (= "*" (name %))
                        (= (namespace id) (namespace %))))
              deny))))

(defn apply-profile
  [profile registry]
  (update registry :tools
          #(filterv (partial selected? profile) %)))
```

You could select a profile with `OPENCODE_PROFILE=dev` in the Shadow build or a small CLJS build command. The output for a profile is deterministic and can be snapshot-tested:

```text
opencode.edn + fragments + profile
  -> normalized registry EDN
  -> validated linked registry
  -> OpenCode plugin/tool adapters + opencode.json
```

OpenCode’s own configuration applies global and project configuration and then loads global and project-local plugin sources in a defined order, so generating a project-local `.opencode/` directory fits its native loading model.[^4_2]

## Generated output

Your generator can emit:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["file://./plugins/knoxx.mjs"],
  "permission": {
    "browser_*": "allow",
    "research_*": "allow"
  }
}
```

And Shadow emits the plugin module that registers all enabled tools and composes the enabled hooks. The generated OpenCode config is intentionally dumb: it only describes host-facing settings and points at compiled code.

OpenCode supports project-specific configuration through `opencode.json` and `.opencode` directories, and project-local plugins are automatically loaded from `.opencode/plugins/`.[^4_1][^4_2]

## Use both macro and EDN layers

They solve different problems:


| Layer | Purpose | Best content |
| :-- | :-- | :-- |
| `deftool` / `defhook` | Defines executable CLJS behavior | Handler code, schemas, local defaults |
| `opencode/*.edn` | Declares a project’s enabled capabilities | Tool selection, names, descriptions, policy ordering, profiles |
| `opencode.edn` | Composes the project | Fragment imports and profiles |
| Compiler | Resolves and validates | Linking, collision detection, output generation |
| `.opencode/` | OpenCode-compatible artifact | Generated config and JS modules |

The architecture lets a domain say “I implement `research/search`,” while each project says whether it wants that capability, under what name, and under which policies. That is vastly cleaner than copying TypeScript files or growing an enormous default config.

## One adjustment

I would call the source file `opencode.edn`, but keep fragment files in an unmistakably separate directory such as `.opencode-src/`:

```text
opencode.edn
.opencode-src/
  browser.edn
  research.edn
  policies.edn
.opencode/
  opencode.json
  plugins/knoxx.mjs
```

That prevents people—and your own tooling—from confusing the input DSL with OpenCode’s actual `.opencode/` discovery directory. OpenCode’s documented local dependency mechanism also uses `.opencode/package.json`, which is another reason to reserve that directory for generated/runtime-facing material.[^4_2]
<span style="display:none">[^4_10][^4_11][^4_12][^4_13][^4_14][^4_15][^4_3][^4_4][^4_5][^4_6][^4_7][^4_8][^4_9]</span>

<div align="center">⁂</div>

[^4_1]: https://opencode.ai/docs/config/

[^4_2]: https://opencode.ai/docs/plugins/

[^4_3]: https://opencode.ai/docs/pt-br/config/

[^4_4]: https://dev.opencode.ai/docs/fr/config/

[^4_5]: https://opencode.ai/docs/de/config/

[^4_6]: https://opencode.ai/docs/it/config/

[^4_7]: https://opencode.ai/docs/pl/config/

[^4_8]: https://opencode.ai/docs/nb/config/

[^4_9]: https://opencode.ai/docs/de/plugins/

[^4_10]: https://opencode.ai/docs/ja/config/

[^4_11]: https://opencode.ai/docs/bs/config/

[^4_12]: https://dev.opencode.ai/docs/ko/config/

[^4_13]: https://opencode.ai/docs/troubleshooting/

[^4_14]: https://opencode.ai/docs/ru/config/

[^4_15]: https://opencode.ai/docs/tools/