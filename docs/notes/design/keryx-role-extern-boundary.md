---
original_name: 'clojurescript runtimes_compilers.md'
title: 'Keryx Role and Extern Boundary'
summary: 'Positioning Keryx as the herald between ημ declarations and host harnesses.'
category: 'design'
created: '2026-07-10'
---

# @GitHub ahh that's right, I called it extern. We do have that "established use" but I don't know if I liked how it worked, what you were doing seemed to make more sense, and I didn't like how the receipt river and those other integrations were added as extensions, I initially started it by hacking pi and writing a thing that compiled the cljs to pi plugins, but now we're here, this is a hard fork of pi, and a curated assemblage of other work I had initially done separately that I felt would make more sense in one place. So yea, continue with your designs @GitHub explore eta-mu, ground yourself in it's lore. grok my intention, engage in total creative freedom, sing the songs of your people.

Yes. I see it more clearly now: **ημ is not trying to become an “extension framework.”** It is a constitutional/data system that was first embodied through Pi extensions, then strained as OpenCode and several independently-grown systems were absorbed into it. The current extensions package contains valuable behavior, but its shape reflects that history: a manifest-centered bundle of 15 local extensions—receipt river, session mycology, contract runtimes, output gates, provider configuration, graph memory, and so on—rather than one intentionally designed interpreter core.[^12_1][^12_2]

The hard fork of Pi is not a liability here. It is the fossil record of the first host. OpenCode is the crucible that forces the next form to become explicit.

## The real split

The distinction should be:

```text
ημ
  The constitution:
  contracts, laws, shapes, configuration, ledgers, meanings.

Keryx
  The herald:
  reads lawful ημ declarations, assembles their capabilities,
  and carries them across host boundaries without distortion.

OpenCode
  The first demanding realm:
  a maximal host whose hooks, tools, lifecycle, permissions,
  session context, and configuration pressure-test Keryx.
```

That preserves the existing symbolic division: η is the unknown influence, μ is actionable knowledge, and Π is the result of action and its influence.  Keryx is not another generic runtime; it is the lawful carrier between μ and a host world that produces Π.

And **`extern` is the gate**. You had already named the important thing.

```text
unknown host world
  -> discover
  -> describe
  -> specify
  -> law
  -> shape
  -> extern
  -> domain
  -> infra
  -> unknown host world
```

That construction order is already part of ημ’s constitution: `extern.*` owns raw JS/Node/browser/SDK contact and decodes foreign values into defined shapes; higher layers do not touch raw host objects.[^12_3]

## Keryx is not a runtime

I would make a new package:

```text
packages/keryx/
```

```json
{
  "name": "@open-hax/keryx",
  "private": true,
  "description": "Lawful ημ declaration assembly and agent-host translation"
}
```

Its public promise:

> **Keryx reads declared ημ capabilities, policies, and observations; proves they are internally lawful and target-compatible; then emits a host adapter or an explicit incompatibility report.**

Not:

> “Keryx runs agent plugins.”

That phrase invites a `runtime` junk drawer.

Keryx does not own the world. It does not own “all agent behavior.” It does not own a generic utilities namespace. It owns **assembly, translation, invocation, and delivery**.

## Package anatomy

```text
packages/keryx/
  README.md
  package.json
  shadow-cljs.edn
  deps.edn
  manifest.edn

  .ημ/
    PRINCIPLE.edn
    config/
      keryx/
        root.edn
        profiles.edn
        assembly.edn
      opencode/
        root.edn
        exposures.edn
        permissions.edn
        mappings.edn

  src/
    keryx/
      law/
        invocation.cljs
        result.cljs
        capability.cljs
        policy.cljs
        target.cljs
        wire.cljs

      shape/
        invocation.cljs
        event.cljs
        result.cljs
        descriptor.cljs
        wire.cljs
        trace.cljs

      extern/
        js.cljs
        opencode.cljs
        node/
          fs.cljs
          path.cljs
          process.cljs

      domain/
        invoke.cljs
        dispatch.cljs
        intercept.cljs
        observe.cljs
        authorize.cljs
        compose.cljs

      infra/
        assembly.cljs
        registry.cljs
        config.cljs
        trace.cljs
        ledger.cljs
        effects.cljs
        artifacts.cljs

      dsl/
        schema.clj
        capability.clj
        interceptor.clj
        observer.clj
        exposure.clj

      target/
        opencode/
          tool.cljs
          hook.cljs
          plugin.cljs
          config.cljs
          decode.cljs
          encode.cljs
          entrypoint.cljs
        pi/
        mcp/

  test/
    keryx/
      law/
      shape/
      extern/
      domain/
      infra/
      target/
        opencode/
```

There is deliberately **no** `keryx.runtime`, `keryx.core`, `keryx.util`, or `keryx.engine` namespace. If code cannot be placed in one of those named responsibilities, it has not been understood enough to write.

## The law of extern

Your prior architecture is stronger than the generic “functional core, imperative shell” framing because it gives foreign systems an actual constitutional role.

```clojure
;; Allowed raw JS contact.
(ns keryx.extern.opencode)

(defn decode-tool-call!
  [js-args js-context]
  ...)

(defn encode-tool-result
  [result]
  ...)
```

```clojure
;; Forbidden: raw OpenCode / JS values.
(ns keryx.domain.invoke)

(defn invoke
  [assembly invocation]
  ...)
```

```clojure
;; Permitted orchestration, still ημ values only.
(ns keryx.infra.effects)

(defn ^:async execute!
  [capability effect]
  ...)
```

`extern.opencode` owns:

- `js->clj`, `clj->js`, `#js`, `aget`, `aset`, property access.
- Raw OpenCode tool arguments, contexts, outputs, and hook callback objects.
- Host errors, Promise rejection shapes, and OpenCode logging calls.
- Zod/OpenCode schema forms, if those cannot be generated away.
- Translation into and out of ημ wire data.

`infra.*` may await an extern operation, but it receives and returns **ημ data only**. `domain.*` remains pure. This preserves the current house rule that domain code has no I/O, law validates, and shape functions remain pure and domain-agnostic.[^12_3]

## The Keryx vocabulary

The earlier `defextension` model made the host extension the primitive. Keryx should make **meaningful agent actions** the primitive.

Start with four forms:

```clojure
(defschema ...)
(defcapability ...)
(definterceptor ...)
(defobserver ...)
```


### Capability

A capability is deliberate callable work.

```clojure
(defcapability inspect-assembly
  {:id      :keryx/inspect-assembly
   :input   :keryx.schema/empty-input
   :output  :keryx.schema/assembly-report
   :effects #{:keryx/introspection}
   :docs    {:summary "Describe the active Keryx assembly."}}
  [_invocation]
  {:keryx/result :ok
   :keryx/value  (assembly/report)})
```

OpenCode sees a custom tool. MCP sees a tool. Pi sees a command or extension tool. The capability does not know or care.

### Interceptor

An interceptor is a lawful chance to continue, modify, require approval, or reject an action.

```clojure
(definterceptor protect-secrets
  {:id       :policy/protect-secrets
   :on       :capability/before
   :priority 100
   :input    :keryx.schema/invocation
   :output   :keryx.schema/interception}
  [{:keys [keryx/input]}]
  (if (secret-path? (get-in input [:arguments :path]))
    {:keryx/decision :reject
     :keryx/error    {:kind :policy/secret-path}}
    {:keryx/decision :continue}))
```

OpenCode’s `tool.execute.before` is merely one renderer for `:capability/before`. OpenCode’s deep hook surface is why it is the correct initial target: it will reveal where your semantic vocabulary is genuinely too weak, rather than letting a simpler host conceal the omissions. OpenCode plugins are explicitly built around plugin functions that receive context and return host hook objects.[^12_4]

### Observer

An observer receives an immutable fact after it happens.

```clojure
(defobserver record-invocation
  {:id      :ledger/record-invocation
   :on      :capability/after
   :input   :keryx.schema/invocation-outcome
   :effects #{:ledger/append}}
  [outcome]
  {:keryx/result :plan
   :keryx/effects
   [{:effect/id    :ledger/append
     :effect/input (receipt/from-outcome outcome)}]})
```

This is where receipt river belongs conceptually: **not as a special peer extension attached to a harness**, but as an observer that consumes declared outcomes and produces append effects.

That is an important reclassification:


| Existing thing | Keryx role |
| :-- | :-- |
| Receipt river | Observer plus ledger sink |
| Session mycology | Session observation and projection policy |
| Contract runtime | Law and adjudication capability |
| OPMF contract gate | Interceptor / output-adjudication policy |
| Graph memory | Capability and observer-backed projection |
| Bootstrap | Assembly construction and session lifecycle mapping |
| Custom providers | Extern/provider configuration plus capabilities |

The functionality survives; the accidental unit of composition changes from “extension file” to **lawful declaration with a semantic role**.

## Assembly is the word

I think **assembly** is the right replacement for “runtime” in the core.

```clojure
(keryx.infra.assembly/assemble! config)
(keryx.infra.assembly/validate! assembly)
(keryx.domain.invoke/invoke assembly invocation)
(keryx.target.opencode.plugin/emit assembly)
```

An assembly is finite, inspectable, serializable metadata plus linked executable handlers:

```clojure
{:keryx/assembly-id :eta-mu/local

 :capabilities
 {:keryx/inspect-assembly
  {:id :keryx/inspect-assembly
   :input :keryx.schema/empty-input
   :output :keryx.schema/assembly-report
   :effects #{:keryx/introspection}
   :handler keryx.capabilities.inspect/run}}

 :interceptors
 {:policy/protect-secrets
  {:id :policy/protect-secrets
   :on :capability/before
   :priority 100
   :handler policy.protect-secrets/check}}

 :observers
 {:ledger/record-invocation
  {:id :ledger/record-invocation
   :on :capability/after
   :handler ledger.receipts/record}}

 :targets
 {:opencode {...}}

 :profile
 {:id :local
  :grants #{:filesystem/read :ledger/append}}}
```

This is much more intelligible than a pile of globally self-registering extensions. The assembly answers: *what has been admitted, what can it do, why is it allowed, and what host is it being carried into?*

## OpenCode-first, deliberately

OpenCode should remain the first target, but not because it is the universal model. It is the harshest concrete test.

```text
ημ declarations
    |
    v
Keryx assembly
    |
    +-- validate all laws
    +-- resolve profile and grants
    +-- prove OpenCode target support
    |
    v
OpenCode projection
    |
    +-- plugin function
    +-- composed hook object
    +-- custom tool definitions
    +-- generated OpenCode config
    +-- host trace sink
```

OpenCode’s local plugin and tool model, plus its project-level configuration, give you enough surface to prove data-driven tool exposure, lifecycle mapping, permission mediation, and source-level deployment.  If a feature has no equivalent in Pi or MCP later, Keryx should reject that target compilation honestly—not pretend “portable” means silently dropped semantics.[^12_5][^12_4]

```text
Target :mcp does not support:
  :session/compaction-requested

Definition:
  :context/project-continuation

Possible resolutions:
  - remove exposure for :mcp
  - provide a target-specific fallback
  - mark the definition :target/optional
```

That error is architecture. It preserves truth across realms.

## The first act

Do not start by porting receipt river. Do not start by recreating the old extension bundle. Do not start by making every OpenCode event available.

Build one **self-describing Keryx assembly**:

```text
Capability:  keryx/inspect-assembly
Interceptor: policy/protect-secrets
Observer:    ledger/record-invocation
Target:      OpenCode
```

This gives you an OpenCode tool:

```text
inspect_assembly
```

that returns:

```clojure
{:assembly/id :eta-mu/local
 :target      :opencode
 :profile     :local

 :capabilities
 [{:id :keryx/inspect-assembly
   :effects #{:keryx/introspection}}]

 :interceptors
 [{:id :policy/protect-secrets
   :on :capability/before
   :priority 100}]

 :observers
 [{:id :ledger/record-invocation
   :on :capability/after}]

 :diagnostics
 {:unknown-symbols []
  :denied-effects []
  :target-incompatibilities []}}
```

It lets the system explain itself from day one. It also makes the second integration safer, because you can ask OpenCode, through the very adapter under development, what Keryx believes is installed and admissible.

## Migration as archaeology

The old extension package is not a failed prototype; it is the source archive.

For each existing extension, do not copy its file shape. Extract its **semantic fossil**:

```text
1. What facts does it consume?
2. Does it decide, observe, invoke, or translate?
3. What contracts govern it?
4. What effects does it declare?
5. Is it universal, or only OpenCode/Pi-specific?
6. What traces/receipts should it leave?
7. Which host hooks are merely its current delivery mechanism?
```

Then rehouse it.

```text
receipt-river.cljs
  -> keryx observer + ledger infra

contract-runtime-v2.cljs
  -> law.contract + adjudication capability + config reader

session-mycology.cljs
  -> lifecycle observer + projection capability

opencode-global-instructions.cljs
  -> OpenCode target mapping, not universal domain logic
```

This is the hard fork becoming an advantage: the old Pi-oriented work taught you what real agent operations look like; OpenCode supplies the richer adversarial host; Keryx becomes the thing that can hold both without becoming either.

The song, then, is not “build a runtime.” It is:

> **Define what may be said. Shape it. Meet the foreign world at extern. Decide lawfully. Assemble only what has earned admission. Carry it across the boundary. Leave a receipt.**

<div align="center">⁂</div>

[^12_1]: https://www.perplexity.ai/search/9af79253-0bea-4464-b53b-31e2ef25d5ce

[^12_2]: https://libraries.io/npm/@open-hax%2Feta-mu-extensions

[^12_3]: https://www.perplexity.ai/search/c1a8eb1c-3407-4d9a-9b66-ae796d1a8197

[^12_4]: https://opencode.ai/docs/plugins/

[^12_5]: https://opencode.ai/docs/config/