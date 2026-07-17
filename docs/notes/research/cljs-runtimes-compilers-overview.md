---
original_name: 'clojurescript runtimes_compilers.md'
title: 'ClojureScript Runtimes and Compilers Overview'
summary: 'Overview of ClojureScript compiler modes and JavaScript runtimes.'
category: 'research'
created: '2026-07-10'
---

<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# clojurescript runtimes/compilers

ClojureScript has one “official” compiler, but it can run on several JavaScript runtimes and in a couple of distinct modes (JVM‑hosted vs self‑hosted). Below is a concise map of the landscape so you can orient around “runtimes/compilers.”

## Big picture

ClojureScript is a Clojure‑to‑JavaScript compiler that originated as a JVM process invoking the Google Closure Compiler, and later gained a self‑hosted mode where the compiler itself runs in JS (Node, browser, etc.).  The compiled code can then execute on any compatible JS runtime (Node, browser, V8 shells, SpiderMonkey, JavaScriptCore, Graal.js, ChakraCore, etc.).[^1_1][^1_4][^1_9][^1_10]

***

## Main compiler implementations

### 1. JVM‑hosted ClojureScript compiler

- Implemented as a JVM program that reads `.cljs` and emits `.js` following Google Closure conventions.[^1_9][^1_10]
- Integrates with Closure Compiler for advanced dead‑code elimination and optimizations.[^1_10]
- Used via `clj` / `deps.edn`, Leiningen, Boot, or Maven coordinates (e.g. `org.clojure/clojurescript` or patched builds like the FlowStorm fork).[^1_3][^1_9]

Typical usage:

- `clj -M -m cljs.main` to compile and run / REPL.[^1_4]
- Build tooling (shadow‑cljs, figwheel, etc.) wraps this compiler and adds watches, hot reload, bundling, etc. (not in the snippets but you’ll know the ecosystem).


### 2. Self‑hosted ClojureScript compiler

- The compiler itself is compiled to JavaScript and runs *inside* a JS runtime (Node.js or browser).[^1_4]
- This is how browser REPLs and Node‑based “bootstrapped” test suites are supported.[^1_4]
- Allows you to do things like dynamic compilation in the browser or run ClojureScript tooling written in ClojureScript.

Examples from the project:

- Bootstrapped test suite in `src/test/self/self_host/test.cljs` run via Node.[^1_4]
- `./script/test-self-parity` to test compiler parity in bootstrapped mode.[^1_4]

***

## JavaScript runtimes commonly used

The *compiled* ClojureScript code can run anywhere JS runs, but the project itself explicitly exercises several runtimes for compatibility testing.[^1_4]

Listed runtimes and how they’re wired in:

- **V8 (d8)** via `V8_HOME`, e.g. `echo quit | $V8_HOME/d8`. [^1_4]
- **SpiderMonkey** via `SPIDERMONKEY_HOME/js --version`.[^1_4]
- **JavaScriptCore (jsc)** on macOS, added to `PATH`, then `jsc` prompt.[^1_4]
- **Nashorn** via `NASHORN_HOME/jjs` (usually under `JAVA_HOME/bin`).[^1_4]
- **Graal.js** via `GRAALVM_HOME/js`.[^1_4]
- **ChakraCore** via `CHAKRACORE_HOME/ch`.[^1_4]
- **Node.js** for bootstrapped tests and self‑hosted compiler REPL.[^1_4]

The project’s `./script/test` will run test suites against each runtime you set up, skipping those that aren’t configured.[^1_4]

There is also a CLI REPL environment abstraction:

- `./script/test-cli repl-env [repl-env-opts-edn]` runs tests against a given REPL env (`node`, `browser`, `graaljs`, etc.).[^1_4]
- These environments are plugged into `cljs.main` (`-re` and `-ro` options).[^1_4]

***

## Performance and variants

The official ClojureScript compiler has had several performance passes over the years:

- Release notes mention 20–40% faster compile times from small internal changes in 1.9.660.[^1_5]

And some forks exist:

- Example: FlowStorm provides a patched ClojureScript compiler/runtime artifact (`com.github.flow-storm/clojurescript`) that you can depend on from Leiningen / deps.edn / Maven / Gradle.[^1_3]
- These variants typically instrument or extend the runtime but remain compatible with the main compiler.

***

## Using compiler options

The standard compiler exposes options (via `cljs.main`, build tooling, or EDN configs) to control:

- Entry point (`:main`) and where it expects to load scripts from.[^1_2]
- Optimization level (none, simple, advanced) through Closure Compiler settings.[^1_10]
- Target environment, module configuration, source maps, etc. (documented in compiler options reference).[^1_2]

These options are what you manipulate indirectly when you configure shadow‑cljs or hand‑roll `cljs.main` invocations.

***

## If you’re planning something

Given your background, the big fork in the road is:

- Do you want a *self‑hosted* ClojureScript compiler for a browser‑or‑Node‑native toolchain / REPL, or
- A *JVM‑hosted* compiler integrated into a more traditional build system (with Closure advanced optimizations)?

What kind of runtime environment are you aiming for first: browser UX (SPA/game front‑end), Node‑based tools, or a polyglot test matrix across multiple JS engines?
<span style="display:none">[^1_6][^1_7][^1_8]</span>

<div align="center">⁂</div>

[^1_1]: https://clojurescript.org/

[^1_2]: https://clojurescript.org/reference/compiler-options

[^1_3]: https://clojars.org/com.github.flow-storm/clojurescript/versions/1.12.145-0

[^1_4]: https://clojurescript.org/community/running-tests

[^1_5]: https://clojurescript.org/news/2017-06-27-faster-compilation-runtime-and-spec-caching-fixes

[^1_6]: https://lambdabooks.github.io/clojurescript-unraveled/manuscript/04-01-Getting-Started-with-the-Compiler.html

[^1_7]: https://medium.com/@rauh/a-new-hiccup-compiler-for-clojurescript-8a7b63dc5128

[^1_8]: https://github.com/funcool/clojurescript-unraveled/blob/master/src/compiler.adoc

[^1_9]: https://github.com/clojure/clojurescript

[^1_10]: https://clojure.org/news/2011/07/22/introducing-clojurescript