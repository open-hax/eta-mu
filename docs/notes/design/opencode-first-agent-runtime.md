---
original_name: 'clojurescript runtimes_compilers.md'
title: 'OpenCode-First Agent Runtime Design'
summary: 'Reframing the new package as an ημ Agent Runtime IR with OpenCode as conformance target.'
category: 'design'
created: '2026-07-10'
---

# @GitHub yea, I got you. You saw the mess the eta-mu-extensions was, that was a drift problem, and we started with eta-mu's extensions, then tried to build around opencode, and it turns out opencode is much harder to debug. It has the most features out of any harness other than claude code, so it makes sense to target it for the DSL then try to grow the compile targets to runtimes with simpler plugin apis.

Exactly. The drift was not merely “the extensions package got messy”; it came from having no stable semantic center while targeting multiple harnesses. You started from ημ extension concepts, then adapted them into OpenCode’s host model, so the host’s harder constraints leaked backward into the core.

OpenCode is the right first proving ground because its extension model is wide: local/global plugin loading, ordered multi-plugin execution, session/file/message/permission/LSP/shell events, before/after tool hooks, custom tools with Zod schemas, workspace/worktree context, and compaction interception.  If the DSL can represent OpenCode cleanly without leaking JS, its compile targets for thinner runtimes should be much easier.[^10_1]

## Reframe the package

The new package should not be “a cleaner `eta-mu-extensions`.” It should be:

```text
ημ Agent Runtime IR
        |
        +--> OpenCode target  ← reference target / maximal harness
        +--> Pi target        ← simpler lifecycle adapter
        +--> MCP target       ← tool-only transport adapter
        +--> CLI target       ← command transport adapter
        +--> Web target       ← later
```

OpenCode is the **conformance target**. It defines the most complete initial event vocabulary, but it does **not** define the IR’s ontology.

The new package should therefore be named around the universal layer, not its first compiler target:

```text
packages/agent-runtime/
```

or, if you want it clearly ημ-native:

```text
packages/eta-mu-agent-runtime/
```

Then OpenCode becomes a target package or build:

```text
packages/
  agent-runtime/                  ; canonical DSL, IR, interpreter
  agent-runtime-opencode/         ; OpenCode compiler/runtime adapter
  agent-runtime-pi/               ; Pi adapter later
  agent-runtime-mcp/              ; MCP adapter later
```

For the first iteration, I would actually keep this as one workspace package with explicit namespace partitions, then split only after the boundary is proven:

```text
packages/agent-runtime/
  src/eta_mu/agent/
    shape/
    law/
    domain/
    infra/
    dsl/
    boundary/opencode.cljs
    target/opencode.cljs
    runtime/opencode.cljs
```

That avoids recreating the dependency sprawl before we know the stable seams.

## OpenCode as the test suite

Treat every OpenCode feature as a test category for the IR—not as a feature to immediately expose.


| OpenCode facility | ημ semantic primitive | Initial status |
| :-- | :-- | :-- |
| Custom tool | `:capability` exposure | Implement first |
| `tool.execute.before` | `:intercept` / policy decision | Implement first |
| `tool.execute.after` | `:observe` / receipt event | Implement first |
| Session lifecycle | `:lifecycle` event | Implement second |
| Permission prompt | `:authorization` decision | Model early, render later |
| File/command events | `:observation` event | Add as needed |
| LSP diagnostics | `:observation` with typed payload | Defer |
| Session compaction override | `:context-projection` | Defer, but preserve in IR |
| npm package install/loading | Host deployment concern | Keep outside IR |

OpenCode plugins are JS/TS modules whose exported plugin functions receive a context and return a hook object, and all configured/local plugin hooks execute in a documented load order.  That tells us what the **adapter** must produce; it does not mean internal behavior should be modeled as an object of arbitrary JS callbacks.[^10_1]

## Three semantic forms

You do not need an enormous DSL yet. The durable initial core has three forms:

```clojure
(defcapability ...)
(definterceptor ...)
(defobserver ...)
```


### Capabilities

A capability is callable work with a contract and declared effects.

```clojure
(defcapability inspect-registry
  {:id      :agent/inspect-registry
   :input   :schema/empty-input
   :output  :schema/registry-report
   :effects #{:runtime/introspection}}
  [_command]
  {:ημ/result :ok
   :ημ/value  (registry/report)})
```

OpenCode compiles this to a custom tool. MCP compiles it to a tool. Pi may compile it to a command or built-in action.

### Interceptors

An interceptor is a policy or transformation applied before an action is committed.

```clojure
(definterceptor deny-secret-write
  {:id       :policy/deny-secret-write
   :on       :tool/execute.before
   :priority 100
   :input    :schema/tool-invocation
   :output   :schema/interception-decision}
  [{:keys [ημ/input]}]
  (if (secret-file? (:path ημ/input))
    {:ημ/decision :reject
     :ημ/error    {:kind :policy/secret-file}}
    {:ημ/decision :continue}))
```

OpenCode renders that to `tool.execute.before`; a smaller host that only exposes tool execution can call the same interceptor around its own tool dispatch.

### Observers

An observer receives immutable events and can append receipts, update projections, or emit further declarative work.

```clojure
(defobserver receipt-tool-execution
  {:id       :ledger/record-tool-execution
   :on       :tool/execute.after
   :input    :schema/tool-execution
   :effects  #{:ledger/append}}
  [event]
  {:ημ/result :plan
   :ημ/effects
   [{:effect/id :ledger/append
     :effect/input (receipt/from-tool-event event)}]})
```

OpenCode’s before/after tool hooks and rich lifecycle-event set make these three forms immediately useful and testable.[^10_1]

## Do not mirror every hook name

This is the critical anti-drift decision.

Bad IR:

```clojure
{:opencode/hook :experimental.session.compacting}
```

Better IR:

```clojure
{:ημ/kind :context-projection
 :ημ/on   :session/compaction-requested
 :ημ/input :schema/session-state
 :ημ/output :schema/continuation-context}
```

Then OpenCode’s `experimental.session.compacting` is an adapter mapping:

```clojure
{:opencode/hook :experimental.session.compacting
 :ημ/event      :session/compaction-requested}
```

OpenCode specifically supports a compaction hook that can augment or replace the continuation prompt. That is a rich feature worth modeling, but as a semantic “context projection” rather than a host-specific event string.[^10_1]

The same principle applies to file watcher updates, LSP events, permission requests, and session status. Start with a compact ημ event vocabulary and add a host mapping only when there is real behavior to support.

## The target contract

Each target should implement a small protocol-like compiler contract:

```clojure
{:target/id :opencode

 :supports
 #{:capability
   :interceptor
   :observer
   :lifecycle/session
   :authorization
   :context-projection}

 :compile-capability compile-capability
 :compile-interceptor compile-interceptor
 :compile-observer compile-observer
 :compile-config compile-config
 :decode-event decode-event
 :encode-result encode-result}
```

The compiler must fail if a project config requests a semantic form unsupported by the target:

```text
Cannot compile :context-projection :session/compaction-requested
to target :pi:
  target does not declare :context-projection support
```

That failure is a feature. It stops silent “mostly works” portability—the same drift problem in a new outfit.

## Keep host configuration outside behavior

OpenCode configuration itself remains an output target:

```text
.ημ/config/agent/
  capabilities.edn
  policies.edn
  profiles.edn

.ημ/config/opencode/
  root.edn
  exposures.edn
  permissions.edn
  deployment.edn
```

Why two layers?

```text
.ημ/config/agent/       universal desired behavior
.ημ/config/opencode/    OpenCode-specific naming and deployment
```

For example:

```clojure
;; .ημ/config/agent/policies.edn
{:interceptors
 [{:id :policy/deny-secret-write
   :enabled? true}]}
```

```clojure
;; .ημ/config/opencode/exposures.edn
{:tools
 [{:capability :agent/inspect-registry
   :name "inspect_registry"}]

 :event-mappings
 [{:ημ/event :tool/execute.before
   :opencode/event "tool.execute.before"}]}
```

OpenCode’s config and local plugin files are project-level runtime material; custom tools can live under `.opencode/tools`, and plugin code under `.opencode/plugins`.  The ημ config remains the editable declaration of intent; the `.opencode` tree is generated compatibility output.[^10_2][^10_1]

## Debugging becomes a first-class feature

You are right that OpenCode is hard to debug. The new system needs to treat debugging as a product feature, not a late logging pass.

Every normalized event and decision should produce a structured trace record:

```clojure
{:ημ/trace-id      "..."
 :ημ/span-id       "..."
 :ημ/phase         :interceptor
 :ημ/definition-id :policy/deny-secret-write
 :ημ/host          :opencode
 :ημ/host-event    "tool.execute.before"
 :ημ/input         {:tool "write" :path ".env"}
 :ημ/output        {:ημ/decision :reject}
 :ημ/duration-ms   2
 :ημ/time          "2026-07-10T13:42:00Z"}
```

Use three sinks:

- **In-memory trace ring** for a `inspect_runtime` debugging tool.
- **EDN receipt ledger** under `.ημ/ledgers/agent/` for durable local audit.
- **OpenCode client logging** only as a host-facing presentation sink.

OpenCode’s plugin API provides a client object and documents structured plugin logging through its client, while `console.log` is discouraged.  The OpenCode sink should render ημ trace records; it should not be where your runtime’s actual observability model lives.[^10_1]

## First vertical slice

Build exactly one capability and exactly one interceptor in the new system:

```text
Capability:  agent/inspect-runtime
Exposure:    OpenCode tool `inspect_runtime`
Interceptor: policy/deny-secret-write
Observation: ledger/record-tool-execution
```

This slice proves:

- Macro-created declarations.
- Registry linking.
- `.ημ` configuration composition.
- OpenCode custom tool compilation.
- `tool.execute.before` compilation.
- `tool.execute.after` compilation.
- Ingress/egress JS codecs.
- Policy enforcement.
- Receipt/trace generation.
- A debugging tool that introspects the same runtime.

It also gives you the debugging surface needed to add the *second* feature safely.

OpenCode custom tools receive session context such as directory and worktree, and custom tool names are derived from their file/export layout. Your target compiler can normalize the former into ημ context and deterministically control the latter through generated module layout.[^10_2]

## What “OpenCode-first” means

It should mean:

- Every semantic definition is executed under OpenCode early.
- Every adapter crossing is tested with OpenCode-shaped fixtures.
- Your debugging trace starts with OpenCode event correlation.
- Rich OpenCode features expose missing IR concepts.
- Unsupported concepts fail compilation for smaller targets.

It must **not** mean:

- Use OpenCode’s hook names as your domain vocabulary.
- Let Zod schemas become your contract language.
- Pass OpenCode’s context object beyond `boundary.opencode`.
- Make every ημ feature depend on Bun, npm, or OpenCode’s file layout.
- Pretend Pi/MCP can support all of OpenCode’s lifecycle semantics.

That gives you the exact leverage you want: the most complex harness forces the interpreter to become explicit, while simpler runtimes become relatively thin renderers over a system that has already survived a hard environment.
<span style="display:none">[^10_10][^10_11][^10_12][^10_13][^10_14][^10_3][^10_4][^10_5][^10_6][^10_7][^10_8][^10_9]</span>

<div align="center">⁂</div>

[^10_1]: https://opencode.ai/docs/plugins/

[^10_2]: https://opencode.ai/docs/custom-tools/

[^10_3]: https://opencode.ai/docs/config/

[^10_4]: https://opencode.ai/docs/es/plugins/

[^10_5]: https://opencode.ai/docs/tools/

[^10_6]: https://dev.opencode.ai/docs/it/plugins/

[^10_7]: https://opencode.ai/docs/ko/plugins/

[^10_8]: https://opencode.ai/docs/th/plugins/

[^10_9]: https://opencode.ai/docs/de/plugins/

[^10_10]: https://opencode.ai/docs/it/config/

[^10_11]: https://dev.opencode.ai/docs/ko/config/

[^10_12]: https://opencode.ai/docs/nb/plugins/

[^10_13]: https://opencode.ai/docs/pl/config/

[^10_14]: https://dev.opencode.ai/docs/ja/plugins/