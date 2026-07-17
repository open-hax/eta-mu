# Sol mutation testing

This harness is intentionally Clojure-first: it mutates ClojureScript source
forms before shadow-cljs compiles them, rather than mutating generated
JavaScript. It is part of the Sol package; the harness namespace is still the
inherited `knoxx.mutation-test` (lineage from the Knoxx backend, not yet
renamed).

## Commands

Driven by the `deps.edn` aliases (run from `packages/sol/`):

```bash
clojure -M:mutation --dry-run --limit 250   # plan mutants, no test execution
clojure -M:mutation --run --limit 100       # default quality gate
clojure -M:mutation --run --limit 0         # full campaign, no mutant limit
clojure -M:mutation-test                    # run the harness's own clj tests
```

There are no `pnpm` mutation aliases — `package.json` exposes only the standard
build/watch/test/lint/typecheck scripts. Use the `clojure -M:…` commands above.

## Architecture

1. Parse CLJS source with `tools.reader` as a sanity pass and `rewrite-clj` as a
   position-preserving zipper.
2. Apply pure mutation operators over s-expressions, e.g. `if` test negation,
   comparison flips, arithmetic operator flips, and literal flips.
3. Emit one temporary source overlay per mutant under
   `target/mutation/mutants/<id>/src/cljs/...`.
4. Invoke shadow-cljs with a dynamic `--config-merge` source-path overlay so the
   mutant shadows the original namespace.
5. Run the compiled node-test bundle and classify mutants as `:killed` or
   `:survived`.
6. Write an EDN report to `target/mutation/report.edn`.

Surviving mutants are test-gap candidates, not automatic bugs.
</content>
