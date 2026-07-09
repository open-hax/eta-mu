# User-Authored ClojureScript Extensions

**Status:** landed — Node.js/dev mode
**Scope:** `packages/legacy/coding-agent/src/core/extensions/`
**Author:** pi

## Goal

Make it trivial to extend ημ by writing ClojureScript:

1. Drop a `.cljs` file into `.eta-mu/agent/extensions/` (or `.ημ/agent/extensions/`).
2. Optionally add it to `settings.json`'s `extensions` array.
3. It compiles and loads automatically.

## What works now

- `.cljs` files are discovered alongside `.ts`/`.js` files in both the project-local and global `extensions/` directories.
- Explicit `.cljs` paths in `settings.json` `extensions` are understood.
- Each `.cljs` extension is compiled to a Node.js library on first load via the project's `shadow-cljs`.
- Compilation artifacts are cached under `~/.ημ/agent/extensions/.cljs-cache/<source-hash>/` and reused until the source changes.
- The compiled module is loaded through the existing jiti-based extension pipeline.
- Extensions written with the `eta-mu.core` `defextension` DSL are compiled into the same PI-API calls used by built-in extensions.

## Writing a `.cljs` extension

A user extension is a single namespace that exports an `init` function:

```clojure
(ns my-hello-extension)

(defn ^:export init [pi]
  (.registerCommand pi "hello-cljs"
    #js {:description "Greet from ClojureScript"
         :handler (fn [_args ctx]
                    (when-let [ui (.-ui ctx)]
                      (.notify ui "Hello from ClojureScript!" "info")))}))
```

Save it as `.eta-mu/agent/extensions/my_hello_extension.cljs`. The next ημ startup discovers and loads it; or add it explicitly to `settings.json`:

```json
{
  "extensions": ["~/.eta-mu/agent/extensions/my_hello_extension.cljs"]
}
```

You can also use the `eta-mu.core` macros because the compiler includes the `packages/extensions/lib` source path:

```clojure
(ns my-extension
  (:require-macros [eta-mu.core :as em]))

(em/defextension my-extension
  :description "A user extension"
  (em/command greet
    :description "Say greet"
    :handler (fn [args ctx] ...)))
```

**Note:** Both styles are supported: a plain `(defn ^:export init [pi] ...)` or an `(em/defextension my-extension ...)` block. The compiler detects the DSL and generates a small `init` wrapper that registers the declared commands, tools, and events.

## Architecture

### Compiler (`cljs-extension-compiler.js`)

- Resolves the `@open-hax/eta-mu-extensions` package root to find the shared `shadow-cljs` binary and the `lib/` macro source path.
- Parses the `(ns ...)` form from the source file.
- Detects `eta-mu.core/defextension` usage and, when present, generates a wrapper namespace that exports a single `init` function translating the DSL spec into PI-API calls.
- Places the source in a temporary build tree under `~/.ημ/agent/extensions/.cljs-cache/<hash>/src/...` at the path implied by its namespace.
- Generates a minimal `shadow-cljs.edn` with a `:node-library` build exporting the entry namespace's `init`.
- Runs `shadow-cljs compile extension` and returns the compiled `target/runtime.js`.

### Loader integration (`loader.ts`)

- `isExtensionFile()` now includes `.cljs`.
- `resolveExtensionEntries()` checks for `index.cljs` in subdirectories.
- `loadExtension()` calls `maybeCompileCljsExtension()` before jiti-loading. If the path is `.cljs`, it compiles and swaps in the compiled JS path; otherwise it passes the path through unchanged.
- `loadExtensionModule()` now accepts both ESM-style default exports and UMD/CommonJS-style `module.default` exports so the shadow-cljs `:node-library` output loads correctly.

## Limitations and future work

- **Bun binary:** The compiler shells out to `shadow-cljs`, which requires a Node.js/npm environment and the `@open-hax/eta-mu-extensions` package on disk. In a Bun compiled binary these may not be available. For binary deployments, user extensions should be pre-compiled with an explicit `eta-mu build-extensions` command (TBD) or pre-shipped as compiled JS.
- **Dependencies:** Extra ClojureScript dependencies are not yet configurable. User extensions can only rely on the core ClojureScript standard library, Node.js built-ins, and the `eta-mu` macro libs.

## Testing

See `packages/legacy/coding-agent/test/extensions-cljs.test.js`. It verifies discovery, compilation, command registration, and compilation-error reporting.

## License

GPL-3.0-or-later
