---
original_name: 'clojurescript runtimes_compilers.md'
title: 'Agent DSL Macros and Data Composition'
summary: 'Data-oriented DSL macros and hiccup-style composition for agent tools and hooks.'
category: 'dev'
created: '2026-07-10'
---

# I want some macros to make it look clean. like a `deftool` `defhook` `defplugin` or I can already see there bein one huge file where all the domains are registering their functions as tools. Either the macros, or some kinda vector based data oriented DSL like hiccup, so it composes.

Yes—make the DSL the authoring interface, and make OpenCode hook maps / `tool()` calls merely a compilation target. A registry that is data first, then rendered into runtime adapters, will compose better than a pile of `def`s with hidden global side effects.

OpenCode plugins ultimately return a hooks object, while plugin-defined tools are registered through the same plugin surface; standalone tool modules also allow multiple exports from one file.[^3_1][^3_2]

## Prefer data as the IR

Use a small declarative representation as the stable, inspectable intermediate representation. The important distinction is:

- `deftool`, `defhook`, and `defplugin` are **ergonomic constructors**.
- The resulting values are **plain data**.
- A single bootstrap namespace gathers those values and compiles them into an OpenCode plugin.
- Your OpenCode backend is only one interpreter of the registry.

```clojure
{:opencode/kind :tool
 :id            :research/search
 :name          "research_search"
 :description   "Search configured sources and return normalized findings."
 :args          [:map [:query :string] [:limit {:optional true} :int]]
 :handler       research/search}

{:opencode/kind :hook
 :id            :policy/protect-env
 :event         :tool.execute.before
 :priority      100
 :handler       policy/protect-env!}
```

Malli forms are especially appropriate for `:args`: they are data, can be inspected at load time, and give you one place to later derive OpenCode’s Zod schema, JSON Schema for MCP, documentation, tests, or a UI.

## Authoring macros

Use macros only to eliminate repetition and preserve source metadata. Avoid doing registration as macro-expansion side effect; it makes REPL reloads, dead-code elimination, dependency order, testing, and multi-runtime compilation unnecessarily weird.

```clojure
(ns agent.platform.dsl
  (:require-macros [agent.platform.dsl]))

(defmacro deftool
  [sym {:keys [id description args] :as options} argv & body]
  `(def ~sym
     (merge
      {:opencode/kind :tool
       :id            ~id
       :name          ~(or (:name options)
                           (clojure.core/name id))
       :description   ~description
       :args          ~args
       :handler       (fn ~argv ~@body)
       :source        ~(select-keys (meta &form) [:file :line :column])}
      ~(dissoc options :id :name :description :args))))

(defmacro defhook
  [sym {:keys [id event priority] :as options} argv & body]
  `(def ~sym
     (merge
      {:opencode/kind :hook
       :id            ~id
       :event         ~event
       :priority      ~(or priority 0)
       :handler       (fn ~argv ~@body)
       :source        ~(select-keys (meta &form) [:file :line :column])}
      ~(dissoc options :id :event :priority))))

(defmacro defplugin
  [sym & entries]
  `(def ~sym
     {:opencode/kind :plugin
      :id            ~(keyword (str *ns*) (name sym))
      :entries       [~@entries]}))
```

Then domain code stays small and reads like a declaration rather than a framework ceremony:

```clojure
(ns knoxx.tools.research
  (:require
   [agent.platform.dsl :refer-macros [deftool]]))

(deftool search
  {:id          :research/search
   :description "Search public sources and return normalized findings."
   :args        [:map
                 [:query :string]
                 [:limit {:optional true} :int]]}
  [{:keys [query limit]} _ctx]
  {:content (run-search query (or limit 10))})
```

```clojure
(ns knoxx.policy.secrets
  (:require
   [agent.platform.dsl :refer-macros [defhook]]))

(defhook deny-env-access
  {:id       :policy/deny-env-access
   :event    :tool.execute.before
   :priority 100}
  [{:keys [tool args]} _ctx]
  (when (and (#{"read" "write"} tool)
             (env-file? (:path args)))
    {:opencode/action :reject
     :message "Access to environment files is blocked"}))
```

The hook event vocabulary should track OpenCode’s supported lifecycle events, including `:tool.execute.before`, `:tool.execute.after`, session events, file events, permission events, and command events.[^3_1]

## Hiccup-style composition

You can also make plugin construction entirely vector based. I’d support this **in addition to** the macros, because it is valuable for generated registrations and domain configuration.

```clojure
(def research-plugin
  [:plugin {:id :plugin/research}

   [:tool {:id          :research/search
           :description "Search public sources."
           :args        [:map [:query :string]]}
    research/search]

   [:hook {:id       :policy/protect-env
           :event    :tool.execute.before
           :priority 100}
    policy/protect-env!]])
```

A normalizer converts the syntax tree into the canonical registry values:

```clojure
(defn normalize
  [[tag attrs & children :as form]]
  (case tag
    :plugin
    {:opencode/kind :plugin
     :id            (:id attrs)
     :entries       (mapv normalize children)}

    :tool
    (let [[handler] children]
      (assoc attrs
             :opencode/kind :tool
             :name (or (:name attrs)
                       (name (:id attrs)))
             :handler handler))

    :hook
    (let [[handler] children]
      (assoc attrs
             :opencode/kind :hook
             :priority (or (:priority attrs) 0)
             :handler handler))

    (throw (ex-info "Unknown agent DSL node"
                    {:form form :tag tag}))))
```

That lets a domain own a vector, while the top-level application just concatenates plugins:

```clojure
(def app
  [:plugin {:id :plugin/knoxx}
   research-plugin
   browser-plugin
   discord-plugin
   policy-plugin])
```

This does **not** become one huge file. Each vertical slice exports either:

- One `defplugin` value, such as `knoxx.tools.browser/plugin`, or
- A Hiccup-like vector, such as `knoxx.tools.browser/spec`.

Then the application composition root is intentionally boring:

```clojure
(ns knoxx.opencode.app
  (:require
   [knoxx.tools.research :as research]
   [knoxx.tools.browser :as browser]
   [knoxx.policy.secrets :as secrets]
   [agent.platform.dsl :as dsl]))

(def plugin-spec
  [:plugin {:id :plugin/knoxx}
   research/plugin
   browser/plugin
   secrets/plugin])

(def registry
  (dsl/normalize plugin-spec))
```

That is a desirable “one place that says what exists,” rather than a bad “one place where every implementation lives.”

## Compile the registry

Make one pure compiler from registry data to the OpenCode shape:

```clojure
(defn compile-plugin
  [registry ctx]
  (let [entries (tree-seq #(= :plugin (:opencode/kind %))
                          :entries
                          registry)
        tools   (filter #(= :tool (:opencode/kind %)) entries)
        hooks   (filter #(= :hook (:opencode/kind %)) entries)]
    (merge
     (compile-tools tools ctx)
     (compile-hooks hooks ctx))))
```

The subtle design choice: **many internal hooks may target one OpenCode event**. Your compiler groups them by `:event`, sorts by `:priority`, and builds exactly one OpenCode callback per event. OpenCode itself wants a hooks object keyed by event name, so grouping belongs in the adapter rather than leaking into domain code.[^3_1]

```clojure
(defn compose-hooks
  [hooks]
  (into {}
        (for [[event definitions] (group-by :event hooks)]
          [event
           (fn [input output]
             (reduce
              (fn [_ definition]
                ((:handler definition)
                 (js->clj input :keywordize-keys true)
                 {:output output}))
              nil
              (sort-by :priority > definitions)))])))
```

For failures, I would not make every hook throw directly. Make handlers return an explicit result algebra:

```clojure
{:effect :continue}
{:effect :reject :message "Blocked by secret-file policy"}
{:effect :patch :output {:path "safe-replacement"}}
{:effect :log :level :warn :message "Untrusted input"}
```

Then the OpenCode renderer decides whether `:reject` becomes an exception, whether `:patch` mutates the output object, and whether logs go to OpenCode’s structured client logger. OpenCode documents `client.app.log()` as its structured logging route, rather than `console.log`.[^3_1]

## Do not expose host shapes

Your tool function should never receive the raw OpenCode context. Instead:

```clojure
{:session/id       "..."
 :workspace/root   "/repo"
 :worktree/root    "/repo"
 :cwd              "/repo"
 :capabilities     #{:filesystem/read :network/search}}
```

OpenCode supplies per-session directory and worktree context to custom tools, so the compiler can normalize those values once at the boundary.  This preserves your ability to render the identical tool definition toward MCP, Pi, Codex hooks, or a standalone CLI without letting a host runtime dictate the core API.[^3_2]

## Suggested final vocabulary

I’d begin narrowly:

```clojure
(deftool name options [input ctx] ...)
(defhook name options [event ctx] ...)
(defplugin name entries...)
(plugin [& entries])
(tool opts handler)
(hook opts handler)
```

Then use these data combinators heavily:

```clojure
(only-in #{:dev} plugin)
(requires #{:network/search} tool)
(with-policy policy tool)
(with-timeout 10000 tool)
(named "browser_inspect" tool)
(disabled-when predicate tool)
```

The macros provide pleasant source-level definitions; the constructors and combinators allow configuration, generation, testing, and cross-platform compilation. That gives you the Hiccup composability you want without locking the whole agent system into macro magic.

<div align="center">⁂</div>

[^3_1]: https://opencode.ai/docs/plugins/

[^3_2]: https://opencode.ai/docs/custom-tools/