---
original_name: 'clojurescript runtimes_compilers.md'
title: 'Eta-Mu OpenCode Configuration Layout'
summary: 'Placing OpenCode configuration under .ημ/config/opencode.'
category: 'dev'
created: '2026-07-10'
---

# Probably best we group it with the rest of our edn data, in our `.ημ/` folder. in like `.ημ/config/opencode/*.edn`

Yes—that is the right home. `.ημ/` is already your project’s semantic/data layer, so OpenCode configuration should be another projection of that data, not a special mini-ecosystem living beside it. Your contract DSL is explicitly EDN-first and intended to be interpreted into runtime behavior, which makes OpenCode an especially natural target.

```text
project/
  .ημ/
    config/
      opencode/
        root.edn              ; composition root
        profiles.edn          ; dev, ci, local, restricted
        plugins/
          core.edn
          policy.edn
          research.edn
          browser.edn
          git.edn
          discord.edn
        agents/
          research.edn
          review.edn
        permissions/
          default.edn
          ci.edn

    contracts/
      tool.edn
      hook.edn
      plugin.edn
      opencode.edn

    ledgers/
      agent/
      policy/
      tool-invocations/

  src/
    ημ/
      opencode/
        read_config.cljs
        link.cljs
        validate.cljs
        compile.cljs
        emit.cljs
      opencode/
        handlers.cljs

  .opencode/
    opencode.json             ; generated host artifact
    package.json              ; host dependency resolution
    plugins/
      eta-mu.mjs              ; compiled CLJS module
```

OpenCode itself still expects JSON configuration and locally discovered JS/TS modules, so `.ημ/config/opencode/` is the editable source tree while `.opencode/` is a disposable generated runtime boundary.[^5_1][^5_2]

## Composition root

I would call the top-level file `.ημ/config/opencode/root.edn`, rather than `opencode.edn` at repository root:

```clojure
{:ημ/opencode-version 1
 :id                  :knoxx/opencode

 :imports
 ["profiles.edn"
  "permissions/default.edn"

  "plugins/core.edn"
  "plugins/policy.edn"
  "plugins/research.edn"
  "plugins/browser.edn"
  "plugins/git.edn"

  "agents/research.edn"
  "agents/review.edn"]

 :profile :dev}
```

This makes the path itself communicate the hierarchy:

```text
.ημ/config/opencode/
  └── configuration data for the OpenCode target
```

And later:

```text
.ημ/config/pi/
.ημ/config/codex/
.ημ/config/mcp/
.ημ/config/browser/
```

Each target is a projection over the same contracts, capabilities, policies, and domain implementations—not a separate version of your system.

## Separate semantics from target wiring

There are three kinds of data here, and I would keep them distinct.


| Location | Meaning | Reusable outside OpenCode? |
| :-- | :-- | :-- |
| `.ημ/contracts/` | Laws, schemas, capability definitions | Yes |
| `.ημ/config/opencode/` | OpenCode composition, mappings, profile choices | Partly |
| `src/ημ/opencode/` | CLJS runtime adapter and host interop | No |
| `.opencode/` | Generated OpenCode-compatible output | No |

For example, the generic capability should not be named `:opencode/tool`. It should be a system-level thing:

```clojure
;; .ημ/contracts/capabilities/research.edn
{:id          :capability/research-search
 :input       [:map
               [:query :string]
               [:limit {:optional true} :int]]
 :output      [:map
               [:findings [:vector :map]]]
 :effects     #{:network/search}
 :handler     ημ.domain.research/search}
```

Then the OpenCode config decides how that capability is exposed:

```clojure
;; .ημ/config/opencode/plugins/research.edn
{:tools
 [{:id          :opencode/research-search
   :capability  :capability/research-search
   :name        "research_search"
   :description "Search configured public sources."
   :tags        #{:research :network}}]}
```

That prevents the host from colonizing the core model. MCP can expose `:capability/research-search` under another name; Pi can bind it to a different plugin mechanism; the CLI can expose it as `ημ research search`.

## Config is a projection

The flow should be:

```text
.ημ/contracts/*.edn
        +
.ημ/config/opencode/**/*.edn
        +
CLJS handler registry
        |
        v
validated OpenCode registry
        |
        +--> .opencode/opencode.json
        +--> .opencode/plugins/eta-mu.mjs
        +--> generated tool metadata / documentation
        +--> `.ημ/ledgers/agent/...` audit events at runtime
```

The configuration linker resolves a capability ID to an approved compiled handler, verifies its input/output contract, applies the active profile, and only then emits OpenCode-facing code. This lines up with your existing emphasis on explicit boundaries between CLJS logic and Node runtime representations.

## Profiles belong nearby

Profiles should live next to OpenCode config because profiles describe **how that host is allowed to expose capabilities**, not the universal semantics of a capability.

```clojure
;; .ημ/config/opencode/profiles.edn
{:profiles
 {:dev
  {:allow #{:capability/research-search
            :capability/browser-inspect
            :capability/git-status}
   :audit :verbose}

  :ci
  {:allow #{:capability/git-status}
   :deny-effects #{:network/search :browser/control}
   :audit :strict}

  :personal
  {:allow #{:capability/*}
   :audit :full}}}
```

That permits a project to run the exact same capability implementation with radically different operational authority. The compiler should reject a config that enables a tool whose declared effects are disallowed by its profile.

## Keep generated artifacts boring

```gitignore
# Generated OpenCode target artifacts
.opencode/opencode.json
.opencode/plugins/eta-mu.mjs
.opencode/tools/eta-mu.mjs
```

I would normally **commit** `.opencode/package.json` and a lockfile if those host dependencies are intentional, but generate its dependency list from your source configuration if you want one canonical declaration. OpenCode supports local plugins and tools with external npm dependencies placed in `.opencode/package.json`.[^5_2]

A generated `opencode.json` should only contain host concerns—plugin paths, named external plugins, direct OpenCode permissions, and defaults OpenCode itself needs. OpenCode’s documented configuration format is JSON, with project-specific configuration and `.opencode` directories as its project-local extension boundary.[^5_1][^5_2]

## Naming suggestion

Use `ημ` as the semantic namespace and reserve `opencode` as an adapter name:

```clojure
:ημ/kind       :capability
:ημ/id         :research/search
:ημ/contracts  {:input :contract/research-query
                :output :contract/research-findings}

:opencode/name "research_search"
:opencode/hook :tool.execute.before
```

Or, more strictly, avoid embedding `:opencode/*` fields in universal objects at all and keep such mappings only under `.ημ/config/opencode/`.

That leaves you with a legible topology:

- **ημ says what exists and what is lawful.**
- **OpenCode config says what this project exposes through OpenCode.**
- **The CLJS compiler links the two and enforces the boundary.**
- **`.opencode/` is generated compatibility output, not where the design lives.**

<div align="center">⁂</div>

[^5_1]: https://opencode.ai/docs/config/

[^5_2]: https://opencode.ai/docs/plugins/