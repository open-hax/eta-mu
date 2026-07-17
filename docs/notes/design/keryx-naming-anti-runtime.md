---
original_name: 'clojurescript runtimes_compilers.md'
title: 'Keryx Naming and Anti-Runtime Design'
summary: 'Avoiding runtime as a catch-all and naming the package Keryx.'
category: 'design'
created: '2026-07-10'
---

# @GitHub I really don't like the word runtime... while not the worst offender semanticly, it logically makes sense as a name and it communicates something specific, it tends to be one of those namespaces where, when you don't know where else to put it, or you didn't realize you needed it until you started adding it to the runtime, it just kinda sneaks in there.

If generic language can't be avoided, then I like to pick proper nouns, name the packages something that is metaphorically meaningful to the role such "runtimes" are playing in the system as a whole.

I agree. **`runtime` should be banned as a catch-all namespace and avoided in package names.** It names *when code executes*, not the role or meaning of the thing that executes—so it becomes an architectural junk drawer.

Your existing η / μ / Π vocabulary is already better suited to this: $\eta$ is unknown influence, $\mu$ is actionable knowledge, and $\Pi$ is the result of action and its outward influence.  The agent DSL is a mechanism for turning declared knowledge and policy into effects in an external harness, so the package should be named for that act—not for a generic runtime.

## Name the role

The new package has two jobs:

1. **Interpret declarations**: contracts, capabilities, policies, and exposures.
2. **Carry them faithfully into a host**: OpenCode first, then Pi, MCP, CLI, browser, and other harnesses.

That points toward names associated with a **herald, envoy, translator, ritual, or instrument**, rather than machine internals.

You already landed on **Keryx** for a message-preserving dispatcher: Greek `keryx` is a herald whose function is to carry messages between realms without distortion.  That makes it an excellent name for the host-facing integration package—but only if its job is *dispatch and translation*, not the entire DSL.[^11_1]

```text
ημ declarations
      |
      v
Keryx
  - links approved handlers
  - validates contracts
  - interprets capabilities/policies
  - renders host adapters
      |
      +--> OpenCode
      +--> Pi
      +--> MCP
```

So I would use:

```text
packages/keryx/
```

with an npm package name:

```json
{
  "name": "@open-hax/keryx"
}
```

And namespaces:

```clojure
keryx.shape.*
keryx.extern.*
keryx.law.*
keryx.domain.*
keryx.infra.*
keryx.target.opencode.*
keryx.target.pi.*
keryx.target.mcp.*
```

No `keryx.runtime.*`.

## Prevent the junk drawer

The replacement for a `runtime` namespace is not one new generic name. It is **precise role namespaces**.


| Bad catch-all | Use instead | Owns |
| :-- | :-- | :-- |
| `runtime.core` | `keryx.domain.dispatch` | Pure dispatch decision |
| `runtime.registry` | `keryx.infra.registry` | Linked installed definitions |
| `runtime.plugin` | `keryx.target.opencode.plugin` | OpenCode plugin projection |
| `runtime.server` | `keryx.infra.process` | Process lifecycle ownership |
| `runtime.context` | `keryx.domain.invocation` | Canonical invocation envelope |
| `runtime.events` | `keryx.shape.event` | Event data structures |
| `runtime.handlers` | `keryx.infra.handler-registry` | Allowlisted implementation linking |
| `runtime.bootstrap` | `keryx.infra.assembly` | Composition / construction root |
| `runtime.main` | `keryx.target.opencode.entrypoint` | Host-required module export |
| `runtime.debug` | `keryx.infra.trace` | Trace sink and receipt persistence |

The enforced question becomes:

> **What is this responsible for?**

If the answer is “it runs the system,” the code is not ready to be placed yet. It needs to be decomposed into a shape, extern, law, domain, infra, target, or entrypoint concern.

That mirrors your generative order: unknown world → discover → describe → specify → `shape` → `extern` → `law` → `domain` → `infra` → external world.[^11_2]

## Keryx package shape

```text
packages/keryx/
  package.json
  shadow-cljs.edn
  README.md
  manifest.edn

  .ημ/
    PRINCIPLE.edn
    config/
      keryx/
        root.edn
        profiles.edn
      opencode/
        root.edn
        exposures.edn
        permissions.edn

  src/
    keryx/
      shape/
        capability.cljc
        invocation.cljc
        event.cljc
        effect.cljc
        result.cljc
        descriptor.cljc
        wire.cljc

      extern/
        js.cljs
        node.cljs
        opencode.cljs

      law/
        capability.cljs
        invocation.cljs
        effect.cljs
        registry.cljs
        wire.cljs
        target.cljs

      domain/
        dispatch.cljs
        intercept.cljs
        observe.cljs
        compose.cljs
        authorize.cljs

      infra/
        config.cljs
        registry.cljs
        assembly.cljs
        trace.cljs
        ledger.cljs
        effect_interpreter.cljs

      dsl/
        schema.clj
        capability.clj
        interceptor.clj
        observer.clj
        target.clj

      target/
        opencode/
          decode.cljs
          encode.cljs
          hooks.cljs
          tools.cljs
          plugin.cljs
          config.cljs
          entrypoint.cljs
        pi/
        mcp/

  test/
    keryx/
      shape/
      extern/
      law/
      domain/
      infra/
      target/
        opencode/
```

`extern.*` is important here as a **first-class layer**, not a private detail inside infra. It contains, documents, and constrains the raw host world before it reaches lawful ημ data.[^11_2]

## Keryx versus ημ

Keryx should not replace ημ. The distinction is useful:

```text
ημ = the semantic/data constitution
     Shapes, contracts, policies, configuration, ledgers

Keryx = the herald/interpreter
        Brings lawful ημ declarations into a particular agent harness

OpenCode = the first receiving realm
Pi / MCP / CLI = later receiving realms
```

That suggests the source layout in a consuming project:

```text
.ημ/
  contracts/
  config/
    keryx/
      root.edn
      profiles.edn
    opencode/
      root.edn
      tools.edn
      hooks.edn
  ledgers/
    agent/

src/
  my_project/
    agent/
      research.cljs
      policy.cljs

  keryx/
    ... package implementation, not project code
```

The project declares its meaning in `.ημ`; Keryx compiles and carries that meaning into OpenCode.

## Alternative names

If Keryx is already reserved narrowly for generic message dispatch, these are the only alternatives I think fit the role:


| Name | Metaphor | Fit |
| :-- | :-- | :-- |
| **Keryx** (`κῆρυξ`) | Herald / authorized messenger | Best: contract-preserving host translation |
| **Hermeneus** (`ἑρμηνεύς`) | Interpreter / translator | Good for the pure compiler/interpreter, slightly academic |
| **Iris** (`Ἶρις`) | Messenger across realms, bridge/rainbow | Good for configuration-to-target projection |
| **Metis** (`Μῆτις`) | Cunning practical intelligence | Good for policy/agent reasoning, not adapter execution |
| **Charon** (`Χάρων`) | Ferryman across boundaries | Evocative, but carries death/underworld baggage |
| **Logos** (`λόγος`) | Reasoned account / word / principle | Too broad and overused |
| **Telos** (`τέλος`) | End or purpose | Better for outcome evaluation than invocation |

I would still choose **Keryx**. The package receives a declaration, preserves its contract, validates its legitimacy, chooses a route, and delivers it across a boundary. That is not merely poetic; it is an accurate architecture description.

## Replace “runtime” in DSL terms

The same discipline should apply to API names:

```clojure
;; Avoid
(runtime/start!)
(runtime/execute!)
(runtime/context)

;; Prefer
(assembly/assemble!)
(dispatch/invoke!)
(invocation/context)
(target.opencode/load-plugin!)
(target.opencode/compile-plugin!)
```

For the OpenCode module export, use an intentionally blunt host-specific name:

```clojure
(ns keryx.target.opencode.entrypoint)

(defn plugin
  [opencode-context]
  (let [assembly (assembly/assemble! {:target :opencode})]
    (target/compile-plugin assembly opencode-context)))
```

That namespace *is* an entrypoint. Calling it an entrypoint tells the truth and prevents unrelated logic from accumulating there.

## One semantic boundary

Make Keryx’s public promise extremely small:

> **Given lawful ημ declarations and a declared target, Keryx either produces a validated target artifact or reports why the declaration cannot be carried there.**

That gives it a sharp non-goal list:

- Keryx does not invent domain logic.
- Keryx does not provide a generic “runtime utilities” namespace.
- Keryx does not let host objects pass beyond `extern.*`.
- Keryx does not silently degrade unsupported host semantics.
- Keryx does not let target-specific names become ημ vocabulary.

The current ημ work already centers a portable macro DSL for agent extensions and has an established use of `defextension`, tools, commands, and lifecycle hooks; Keryx would be the deliberate next step that gives those declarations a clean, explicit carrier into OpenCode rather than another evolving extension surface.[^11_3]

<div align="center">⁂</div>

[^11_1]: https://www.perplexity.ai/search/4b3017f4-fb88-411b-976d-8c1379caa5f3

[^11_2]: https://www.perplexity.ai/search/c1a8eb1c-3407-4d9a-9b66-ae796d1a8197

[^11_3]: https://www.perplexity.ai/search/9af79253-0bea-4464-b53b-31e2ef25d5ce