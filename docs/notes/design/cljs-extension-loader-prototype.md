---
original_name: "2026.07.08.14.15.47.md"
title: "ClojureScript Extension Loader Prototype"
summary: "Prototype notes for transparently loading `.cljs` user extensions via shadow-cljs on-demand compilation."
category: "design"
created: "2026-07-08"
---

 Signal

 I researched how ημ currently loads extensions, grokked your
 intent, and shipped a working prototype that makes .cljs
 extensions "just work" in Node.js/dev mode.

 What landed:

 -
 packages/legacy/coding-agent/src/core/extensions/cljs-extension-
 compiler.js — on-demand compiler. Parses the (ns ...) form,
 builds a temporary shadow-cljs.edn, symlinks the project's
 node_modules, compiles to a :node-library, and caches the result
 under ~/.ημ/agent/extensions/.cljs-cache/<source-hash>/.
 - packages/legacy/coding-agent/src/core/extensions/loader.ts —
 now discovers .cljs files in .eta-mu/agent/extensions/ (and
 project-local .eta-mu/extensions/), accepts .cljs paths from
 settings.json, and transparently compiles them before loading
 the compiled JS through the existing jiti pipeline.
 - docs/design/user-clojurescript-extensions.md — design spec +
 user authoring guide.
 - packages/legacy/coding-agent/test/extensions-cljs.test.js — 3
 tests verifying discovery, compilation, command registration,
 and compilation-error reporting.

 A minimal user extension now looks like:

 ```clojure
   (ns my-hello-extension)

   (defn ^:export init [pi]
     (.registerCommand pi "hello-cljs"
       #js {:description "Greet from ClojureScript"
            :handler (fn [_args ctx]
                       (when-let [ui (.-ui ctx)]
                         (.notify ui "Hello from ClojureScript!"
 "info")))}))
 ```

 Drop it in .eta-mu/agent/extensions/my_hello_extension.cljs, add
 it to settings.json, or let auto-discovery pick it up. First
 compile takes ~15s; subsequent loads are instant from cache.

 Evidence

 - Research anchors: read
 packages/legacy/coding-agent/src/core/extensions/loader.ts,
 packages/legacy/coding-agent/src/core/settings-manager.ts,
 packages/legacy/coding-agent/src/config.ts,
 packages/extensions/shadow-cljs.edn,
 packages/extensions/scripts/build.mjs,
 packages/extensions/README.md, and the upstream eta-mu-cli
 extensions docs.
 - Prototype validation: manually compiled a .cljs file with
 shadow-cljs and confirmed it loaded as a UMD module with jiti.
 - Tests: ran pnpm -C packages/legacy/coding-agent test — 111
 test files passed, 1123 tests passed, 7 skipped. The new
 CLJS-specific test file passes.
 - Type safety: pnpm exec tsc -p tsconfig.build.json --noEmit
 passes.
 - TS line count: current working-tree total is 175,464; my
 changes net-decreased TypeScript lines (removed redundant
 comments, avoided new .ts files). The compiler and test are
 plain .js to avoid adding new TypeScript.
 - Note: packages/legacy/ai/src/models.generated.ts shows as
 modified in working tree, but that was a pre-existing change
 unrelated to this work.

 Frames

 1. You wanted end-user ergonomics first. The chosen path is
 transparent lazy compilation so the user does not need to run a
 build command or hand-write shadow-cljs configs.
 2. You wanted it to feel native to ημ. The loader change makes
 .cljs a first-class extension format alongside .ts/.js, using
 the same discovery rules and settings.json schema.
 3. You wanted to leverage the existing CLJS infrastructure. The
 compiler reuses the installed shadow-cljs binary and the
 packages/extensions/lib macro source path rather than
 introducing a new compiler.

 Countermoves

 - What about the Bun binary? The current implementation shells
 out to shadow-cljs and resolves the @open-hax/eta-mu-extensions
 package on disk. In a compiled Bun binary this may not be
 available. The spec documents this and points to a future eta-mu
 build-extensions pre-compilation command.
 - What about defextension DSL? The first iteration supports the
 plain (defn ^:export init [pi] ...) style. The spec notes that a
 generated wrapper for eta-mu.core/defextension specs is the next
 increment.
 - Why not a separate package? A small JS compiler module keeps
 the change scoped to the loader; a new package would add more
 orchestration without improving the user experience.

 Next

 Run the full extension discovery suite once more to confirm the
 change is green, then add a defextension wrapper so user
 extensions can use the same eta-mu.core DSL as the built-in
 extensions.

<--- Last few GCs --->────────────────────────────────────────────
~/spaces/eta-mu (main)
[1962695:0x339a6000]  1940833 ms: Scavenge (interleaved) 10150.6 (10206.4) -> 10130.5 (10276.4) MB, pooled: 0 MB, 554.31 / 0.00 ms  (average mu = 0.230, current mu = 0.165) allocation failure;
[1962695:0x339a6000]  2063169 ms: Mark-Compact (reduce) 10196.2 (10283.9) -> 10124.8 (10157.4) MB, pooled: 0 MB, 71835.80 / 0.00 ms  (+ 5602.7 ms in 956 steps since start of marking, biggest step 21.5 ms, walltime since start of marking 83465 ms) (average
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
----- Native stack trace -----

 1: 0xf53df6 node::OOMErrorHandler(char const*, v8::OOMDetails const&) [eta-mu]
 2: 0x13bf4b0 v8::Utils::ReportOOMFailure(v8::internal::Isolate*, char const*, v8::OOMDetails const&) [eta-mu]
 3: 0x13bf59f v8::internal::V8::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, v8::OOMDetails const&) [eta-mu]
 4: 0x1658085  [eta-mu]
 5: 0x16580b2  [eta-mu]
 6: 0x16583aa v8::internal::Heap::RecomputeLimits(v8::internal::GarbageCollector, v8::base::TimeTicks) [eta-mu]
 7: 0x16688ca  [eta-mu]
 8: 0x166cc70  [eta-mu]
 9: 0x20ffb21  [eta-mu]
