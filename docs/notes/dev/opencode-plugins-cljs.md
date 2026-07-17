---
original_name: 'clojurescript runtimes_compilers.md'
title: 'OpenCode Plugins in ClojureScript'
summary: 'Strategy for writing OpenCode plugins and tools in ClojureScript with thin JS adapters.'
category: 'dev'
created: '2026-07-10'
---

# yea I just wanna write opencode plugins and tools in clojurescript, typescript just feels so dirty now.

Yeah—use ClojureScript for the real implementation. The only unavoidable JavaScript/TypeScript surface is OpenCode’s *loader contract*: plugins must be JS/TS modules, and custom tools are discovered as JS/TS files; but those files can be tiny generated adapters that immediately delegate to your compiled CLJS bundle.[^2_1][^2_2]

For your “universal agent platform adapter” direction, I’d treat OpenCode as a target backend, not the language your business logic is written in.

## Recommended shape

```text
src/
  agent/
    core.cljs              ; pure event → command / decision logic
    contracts.cljs         ; Malli schemas, canonical IR
    opencode/
      plugin.cljs          ; plugin-specific hook adapters
      tools.cljs           ; tool handlers
      node.cljs            ; explicit JS boundary wrappers

.opencode/
  plugins/
    my-plugin.mjs          ; generated loader / entrypoint
  tools/
    research.mjs           ; generated tool definition / entrypoint

dist/
  opencode-plugin.mjs      ; shadow-cljs Node target output
```

Keep `agent.core` wholly ignorant of OpenCode, Bun, Node imports, and raw JS objects. It should accept normalized EDN data and return decisions/effects as data. Your `agent.opencode.*` namespaces decode OpenCode’s hook context and inputs at the boundary, call the core, then encode OpenCode’s expected result.

That reinforces the runtime boundary you have been moving toward: isolate Node interop in a narrow adapter rather than allowing JS shapes to permeate the system.

## Two practical paths

| Path | What OpenCode sees | What you write | Best use |
| :-- | :-- | :-- | :-- |
| **Compiled bundle directly** | A `.js` / `.mjs` output in `.opencode/plugins` or `.opencode/tools` | Almost entirely ClojureScript | Simple, local plugins and tools |
| **Thin JS shim** | A 5–15 line `.mjs` file that imports your compiled artifact | ClojureScript plus a disposable loader | Multiple generated plugins/tools, packaging, or a CLJS monorepo |

OpenCode loads local plugin files from `.opencode/plugins/` or `~/.config/opencode/plugins/`, and custom-tool definition files from `.opencode/tools/` or `~/.config/opencode/tools/`.  It also permits a custom tool’s implementation to invoke software written in any language, so the JS/TS-only rule is specifically the discovery/definition layer—not a mandate that your program logic be TypeScript.[^2_2][^2_1]

## Direct CLJS plugin

With `shadow-cljs`, target Node and export a function under the name OpenCode expects.

```clojure
;; src/agent/opencode/plugin.cljs
(ns agent.opencode.plugin
  (:require
   [clojure.string :as str]))

(defn- block-write?
  [{:keys [path]}]
  (str/ends-with? path ".env"))

(defn plugin
  [_ctx]
  #js
  {:tool.execute.before
   (fn [input _output]
     (let [tool-name (.-tool input)
           args      (js->clj (.-args input) :keywordize-keys true)]
       (when (and (= tool-name "write")
                  (block-write? args))
         (throw (js/Error. "Refusing to write secrets")))))})
```

```clojure
;; shadow-cljs.edn
{:source-paths ["src"]

 :builds
 {:opencode-plugin
  {:target :node-library
   :output-to ".opencode/plugins/agent-plugin.mjs"
   :exports {:default agent.opencode.plugin/plugin}
   :compiler-options {:output-feature-set :es2022}}}}
```

Conceptually, that generated `.mjs` is no different from an authored OpenCode plugin: OpenCode expects a module exporting a plugin function that receives a context and returns hooks.[^2_1]

The exact export map and generated module format may need a small adjustment based on your installed Shadow CLJS and whether OpenCode resolves a default versus named export—but that is a build-contract issue, not a reason to move the plugin into TS.

## Tool definitions: make the wrapper declarative

For custom tools, I would not allow every tool to become bespoke Node interop. Define your canonical tool contract in CLJS, then generate or compile the OpenCode-facing wrapper.

```clojure
(ns agent.contracts)

(def tool-registry
  {:research/search
   {:name        "research"
    :description "Search configured sources and return normalized findings."
    :input-schema [:map [:query :string]]
    :handler     'agent.tools.research/run}})
```

Your OpenCode adapter then does four boring things:

1. Converts the schema into the JSON-schema-like shape required by the OpenCode tool helper.
2. Converts incoming JS tool arguments into CLJS data.
3. Runs the handler, ideally with an explicit effect environment.
4. Converts the result into OpenCode’s tool-result shape.

OpenCode recommends the `tool()` helper for validation and type safety, and its filename becomes the tool name—meaning a generated `.mjs` wrapper per tool maps naturally to a registry-driven CLJS build.[^2_2]

## Where to tolerate JS

I would accept precisely these three bits of JavaScript:

- **Module loader/export semantics** if Shadow’s Node ESM output does not match OpenCode exactly.
- **A generated `package.json`** for dependencies that OpenCode expects to resolve through Bun.
- **Optional subprocess wrappers** where using an external utility is better than recreating it in CLJS.

Everything else—including hook routing, policy checks, tool descriptions, schemas, state machines, observability events, and agent orchestration—belongs in ClojureScript.

OpenCode installs package-based plugins with Bun and resolves local plugin/tool dependencies through a `package.json` in its config directory, so dependency resolution remains a real Node/Bun concern even if your source code is CLJS.[^2_1]

## Why this fits your DSL

Your canonical DSL can compile into a platform-neutral representation such as:

```clojure
{:id :policy/secret-write-guard
 :trigger {:kind :tool/before :tool :write}
 :when    [:path-suffix? ".env"]
 :effect  {:kind :reject
           :message "Refusing to write secrets"}}
```

Then the OpenCode backend emits a hook-map adapter; a Pi backend could emit its equivalent lifecycle registration; an MCP backend could instead expose a policy-aware tool. That gives you one semantic policy rather than three increasingly divergent implementations.

For OpenCode specifically, the adapter translates your `:tool/before` trigger to the corresponding plugin hook and preserves your core’s deterministic behavior. OpenCode plugins are explicitly event-hook extensions intended to add functionality, integrations, and behavior changes.[^2_1]

TypeScript feels dirty here because it is mostly *incidental host syntax*: dynamic object plumbing around a runtime contract. CLJS is a much better place to make the contracts, transformations, and policy logic legible.
<span style="display:none">[^2_10][^2_11][^2_12][^2_13][^2_14][^2_15][^2_3][^2_4][^2_5][^2_6][^2_7][^2_8][^2_9]</span>

<div align="center">⁂</div>

[^2_1]: https://opencode.ai/docs/plugins/

[^2_2]: https://opencode.ai/docs/custom-tools/

[^2_3]: https://opencode.ai/docs/it/plugins/

[^2_4]: https://dev.opencode.ai/docs/da/plugins/

[^2_5]: https://opencode.ai/docs/de/plugins/

[^2_6]: https://opencode.ai/docs/pl/plugins/

[^2_7]: https://opencode.ai/docs/bs/plugins/

[^2_8]: https://opencode.ai/docs/es/plugins/

[^2_9]: https://opencode.ai/docs/ko/plugins/

[^2_10]: https://opencode.ai/docs/ru/plugins/

[^2_11]: https://opencode.ai/docs/th/plugins/

[^2_12]: https://opencode.ai/docs/ja/plugins/

[^2_13]: https://opencode.ai/docs/zh-tw/plugins/

[^2_14]: https://opencode.ai/docs/ar/plugins/

[^2_15]: https://opencode.ai/docs/tr/plugins/