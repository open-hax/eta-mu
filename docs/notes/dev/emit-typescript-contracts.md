---
original_name: 'clojurescript runtimes_compilers.md'
title: 'Emitting TypeScript Declarations from Contracts'
summary: 'Emitting .d.ts files from ημ contract IR instead of parsing JSDoc.'
category: 'dev'
created: '2026-07-10'
---

# is it possible to emit typescript type declaration files from typedclosure annotations?

**Yes, but probably not as a built-in one-step feature.** If TypedClosure annotations preserve enough type information in macro metadata or a compiler-visible registry, you can emit `.d.ts` files directly from that representation; TypeScript declaration files are simply the external module API contract.[^6_1][^6_9]

The good version is **not**:

```text
CLJS → emitted JS with Closure JSDoc → parse JSDoc → .d.ts
```

It is:

```text
TypedClosure annotations
        ↓
canonical ημ type / contract IR
        ├── Closure annotations or runtime validators
        ├── Malli schema / JSON Schema
        ├── OpenCode tool schema
        └── TypeScript .d.ts
```

That makes TypeScript declarations another target of the same contract system—not an inference pass over generated JavaScript.

## The feasibility boundary

It depends on what “TypedClosure annotations” means mechanically:


| Annotation form | Can emit `.d.ts`? | Recommended approach |
| :-- | --: | :-- |
| Macro arguments / EDN type forms | Yes, strongly | Generate from macro input at compile time |
| Var metadata attached by a macro | Yes | Collect public API metadata into a registry |
| TypedClosure’s internal type AST | Yes | Implement a direct type-AST to TypeScript-AST renderer |
| Closure-style JSDoc in emitted JS | Mostly | Parse JSDoc, but expect edge cases |
| Only Closure Compiler’s post-analysis knowledge | Not cleanly | Do not rely on this as the source of declarations |

A prior tool, `closure-ts`, demonstrates that Closure JSDoc annotations can be translated into `.d.ts` files.  But it is an old and narrow path; for ημ, a direct emitter from your own typed contract representation will be more reliable and much more useful.[^6_3]

## The type translation is mostly manageable

The common portion maps cleanly:

```clojure
[:string]                   ; string
[:int]                      ; number
[:boolean]                  ; boolean
[:nil]                      ; null | undefined, by policy
[:vector :string]           ; string[]
[:set :keyword]             ; Set<string>
[:map [:id :uuid]]          ; { id: string }
[:or :string :int]          ; string | number
[:maybe :string]            ; string | null
[:tuple :string :int]       ; [string, number]
```

For a tool:

```clojure
(defopencode-tool research-search
  {:input  [:map
            [:query :string]
            [:limit {:optional true} [:int {:min 1 :max 100}]]]
   :output [:map
            [:findings [:vector :research/finding]]
            [:source-count :int]]}
  [ctx {:keys [query limit]}]
  ...)
```

You could emit:

```ts
export interface ResearchSearchInput {
  query: string;
  limit?: number;
}

export interface ResearchFinding {
  title: string;
  url: string;
  summary?: string;
}

export interface ResearchSearchOutput {
  findings: ResearchFinding[];
  sourceCount: number;
}

export declare function researchSearch(
  input: ResearchSearchInput,
  context: ToolContext
): Promise<ResearchSearchOutput>;
```

And then package it conventionally:

```text
dist/
  opencode-plugin.mjs
  opencode-plugin.d.ts
package.json
```

```json
{
  "exports": {
    ".": {
      "types": "./dist/opencode-plugin.d.ts",
      "default": "./dist/opencode-plugin.mjs"
    }
  }
}
```

TypeScript tooling understands `.d.ts` as a package’s API description and will use bundled declarations when it resolves the package.[^6_9]

## Make it an ημ target

I would add an emitter namespace rather than bake TypeScript concerns into `defcontract` or `deftool`:

```text
src/ημ/
  type/
    ir.cljc
    normalize.cljc
  emit/
    closure.cljs
    malli.cljs
    json_schema.cljs
    typescript.cljs
    opencode.cljs
```

Then give each public definition a normalized, serializable descriptor:

```clojure
{:ημ/kind       :tool
 :ημ/id         :research/search
 :ημ/export?    true
 :ημ/params
 [{:name :input
   :type [:ref :contract/research-search-input]}]
 :ημ/returns    [:promise [:ref :contract/research-search-output]]
 :ημ/effects    #{:network/search}
 :ημ/docs       {:summary "Search configured public sources."}}
```

The TypeScript emitter only handles public exported entries:

```clojure
(defn emit-module
  [{:keys [types exports]}]
  (str
   (emit-type-declarations types)
   "\n"
   (emit-export-declarations exports)))
```

This lets the same definitions emit:

- `.d.ts` for TypeScript consumers.
- JSON Schema for OpenCode/MCP boundaries.
- Malli validators for your ClojureScript runtime.
- Docs, tool manifests, and generated test cases.
- Closure-compatible annotations, if that remains useful internally.


## Use a closed shared vocabulary

The difficult part is not writing a TypeScript printer. It is preventing semantic drift between the type systems.

Closure’s types and TypeScript’s types overlap substantially, but they do not mean exactly the same thing:

- **TypeScript is structurally typed**; object compatibility is based mostly on shape.
- **Closure types** can carry more nominal conventions through constructors, interfaces, and namespaces.
- **ClojureScript maps** may be persistent maps, JS objects, records, or tagged data—those are not automatically interchangeable at a JS boundary.
- **`nil`, `null`, and `undefined`** must have an explicit policy.
- **Keywords, UUIDs, instants, EDN values, and tagged unions** need deliberate wire representations.
- Runtime validation must remain authoritative; `.d.ts` improves authoring and editor feedback but cannot enforce untyped JS callers.

For your architecture, I would make wire types part of the contract:

```clojure
{:ημ/type :uuid
 :wire/type :string
 :wire/format :uuid}

{:ημ/type :keyword
 :wire/type :string
 :wire/pattern "^[^/]+/.+$"}

{:ημ/type :instant
 :wire/type :string
 :wire/format :date-time}
```

Then `emit-typescript` never needs to guess whether an internal `UUID` is a string, a JS `Date`, or a custom runtime value.

## A macro design that supports emission

Your defining macro can register a descriptor at macro-expansion time, while still compiling an ordinary CLJS function:

```clojure
(defcontract research-search-input
  [:map
   [:query :string]
   [:limit {:optional true} [:int {:min 1 :max 100}]]])

(deftool research-search
  {:input  :contract/research-search-input
   :output :contract/research-search-output
   :export :typescript}
  [ctx input]
  ...)
```

The macro should produce two things conceptually:

1. The ordinary executable var/function.
2. A pure descriptor added to a compile-time manifest.
```clojure
{:ημ/id       :research/search
 :ημ/kind     :tool
 :ημ/var      'ημ.tools.research/search
 :ημ/input    :contract/research-search-input
 :ημ/output   :contract/research-search-output
 :emit        #{:opencode :typescript :json-schema}}
```

Your build task can collect the manifest and write:

```text
target/ημ/api-manifest.edn
dist/ημ-opencode.d.ts
dist/ημ-opencode.schema.json
.opencode/opencode.json
```

That is better than relying on names or reflection after advanced compilation, where useful source-level identities may be renamed or eliminated.

## What I would not do

Avoid treating TypeScript declarations as the universal type language. TypeScript should be a **consumer projection**, just like OpenCode plugin output.

Also avoid generating declarations from arbitrary implementation inference. A function body cannot reliably describe effects, serializable shape, error behavior, or operational authority. Your contracts already carry the information that matters.

And avoid exposing every internal CLJS var. Emit declarations only for deliberately public, JS-safe boundaries:

```clojure
{:ημ/export
 {:typescript {:module "@open-hax/eta-mu-opencode"
               :name   "researchSearch"}
  :opencode   {:name "research_search"}
  :mcp        {:name "research.search"}}}
```


## Best first milestone

Start with a deliberately boring subset:

1. Named scalar types: string, boolean, number, integer, keyword-as-string, UUID-as-string.
2. Maps with required and optional keys.
3. Vectors, tuples, enums, unions, and references.
4. Async tool functions as `Promise<T>`.
5. Tagged result/error unions.
6. Snapshot tests comparing emitted `.d.ts` against checked-in golden files.
7. A tiny TypeScript consumer fixture compiled with `tsc --noEmit`.

TypeScript’s own compiler can emit declarations for TS/JS sources when `declaration` is enabled, but in your case you are not deriving contracts from TypeScript—you are generating the declaration source artifact directly from ημ’s contracts.[^6_1]

So: **absolutely possible, and it is a very good fit for ημ.** TypedClosure annotations can be one input, but the durable move is to normalize them into your own contract IR and emit `.d.ts` as a first-class backend.
<span style="display:none">[^6_10][^6_2][^6_4][^6_5][^6_6][^6_7][^6_8]</span>

<div align="center">⁂</div>

[^6_1]: https://www.typescriptlang.org/tsconfig/declaration.html

[^6_2]: https://github.com/material-components/material-components-web/issues/134

[^6_3]: https://github.com/teppeis/closure-ts

[^6_4]: https://stackoverflow.com/questions/76369054/typescript-emitted-type-declaration-files-not-including-undefined-as-a-type

[^6_5]: https://dev.to/jsmanifest/typescript-60-isolateddeclarations-what-it-actually-replaces-and-why-it-matters-716

[^6_6]: https://www.npmjs.com/package/tsickle

[^6_7]: https://medium.com/@martin_hotell/typescript-library-tips-rollup-your-types-995153cc81c7

[^6_8]: https://github.com/artifacthealth/tsreflect-compiler

[^6_9]: https://www.typescriptlang.org/docs/handbook/2/type-declarations.html

[^6_10]: https://adropincalm.com/blog/notes-on-making-typescript-declaration-files/