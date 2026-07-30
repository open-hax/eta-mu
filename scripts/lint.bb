#!/usr/bin/env bb
;; Eta-mu lint gate.
;;
;; Runs clj-kondo across every ClojureScript package, then delegates the
;; TypeScript-era checks to the legacy `scripts/lint.mjs` unchanged.
;;
;; The static gate used to be lint.mjs alone: Biome, tsc, extension path
;; validation, and a kanban frontmatter check — all pointed at legacy
;; TypeScript. ClojureScript is the canonical language here and had zero static
;; coverage in the gate, despite AGENTS.md requiring clj-kondo to pass with zero
;; warnings.
;;
;;   bb scripts/lint.bb [--fix] [--only rheos,sol] [--kondo-only]
;;
;; `--fix` is forwarded to lint.mjs (Biome write mode); clj-kondo has no fix mode.
;;
;; Exit 0 when every check passed, 1 otherwise.

(require '[babashka.process :as p]
         '[clojure.java.io :as io]
         '[clojure.string :as str])

(def root
  (-> (io/file *file*) .getAbsoluteFile .getParentFile .getParentFile))

(def kondo-packages
  "Every CLJS package, by pnpm filter name. Each owns its own `lint:kondo` paths,
   so run those rather than guessing a global source list.

   Keep this complete — a CLJS package absent here is unlinted by the gate."
  ["eta-mu"
   "@eta-mu/rheos"
   "@eta-mu/sol"
   "@eta-mu/terminal-ui"
   "@eta-mu/turn-processor"
   "@eta-mu/extensions"
   "@eta-mu/e2e"
   "@open-hax/protocols"
   "@open-hax/chat-ui"
   "@open-hax/axxium"
   "@open-hax/mcp-contracts"])

(def rule (apply str (repeat 60 "=")))

(defn run-check
  "Run one check with inherited stdio. Returns {:name :ok}."
  [check-name command]
  (println (str "\n" rule "\nRunning: " check-name "\n" rule "\n"))
  (flush)
  (let [{:keys [exit]} (apply p/shell {:dir root :continue true} command)
        ok (zero? exit)]
    (if ok
      (println (str "\n✓ " check-name " passed"))
      (binding [*out* *err*]
        (println (str "\n✗ " check-name " failed (exit code " exit ")"))))
    {:name check-name :ok ok}))

(defn short-name
  "`@open-hax/protocols` -> `protocols`, so `--only` takes the readable name."
  [pkg]
  (last (str/split pkg #"/")))

(def gate-scripts
  "The gate's own babashka scripts, so the tooling is held to the same bar as the
   code it checks.

   Not yet the whole of scripts/*.bb: `ultra.bb` has an unused binding and
   `ultra_test.bb` reports seven unresolved symbols because it pulls its subject
   in with `load-file`, which clj-kondo cannot follow without config. That is
   pre-existing debt with its own card — widen this vector once it is clean,
   rather than leaving the exclusion implicit."
  ["scripts/test.bb" "scripts/lint.bb"])

(defn lint-bb-scripts
  "clj-kondo over the bb scripts, one file per invocation.

   Linting several together trips redefinition warnings: each script is its own
   `user`-namespace file, so kondo sees `root`/`rule`/`-main` defined repeatedly."
  []
  (let [results (mapv (fn [file]
                        (run-check (str "clj-kondo (" file ")")
                                   ["clj-kondo" "--lint" file]))
                      gate-scripts)]
    {:name "clj-kondo (gate scripts)"
     :ok (every? :ok results)}))

(defn -main [& args]
  (let [args (vec args)
        fix? (contains? (set args) "--fix")
        kondo-only? (contains? (set args) "--kondo-only")
        only-idx (.indexOf args "--only")
        only (when (and (not= -1 only-idx) (get args (inc only-idx)))
               (into #{} (map str/trim) (str/split (get args (inc only-idx)) #",")))
        selected (if only
                   (filterv #(or (only %) (only (short-name %))) kondo-packages)
                   kondo-packages)]
    (when (and only (empty? selected))
      (binding [*out* *err*]
        (println (str "No CLJS package matched --only. Known: "
                      (str/join ", " (map short-name kondo-packages)))))
      (System/exit 1))
    (let [kondo-results
          (into (mapv (fn [pkg]
                        (run-check (str "clj-kondo (" pkg ")")
                                   ["pnpm" "--filter" pkg "lint:kondo"]))
                      selected)
                (when-not only [(lint-bb-scripts)]))
          ;; The TS-era checks still live in lint.mjs. Delegate rather than
          ;; extend it — new gate logic belongs in Clojure.
          legacy-results
          (if (or kondo-only? only)
            []
            [(run-check "TypeScript-era checks (scripts/lint.mjs)"
                        (cond-> ["node" "scripts/lint.mjs"] fix? (conj "--fix")))])
          results (into kondo-results legacy-results)
          failed (remove :ok results)]
      (println (str "\n" rule "\nLINT SUMMARY\n" rule "\n"))
      (doseq [{:keys [name ok]} results]
        (println (str "  " (if ok "✓" "✗") " " name)))
      (when (or kondo-only? only)
        (println "\n  (TypeScript-era checks skipped)"))
      (println (str "\n" (if (empty? failed) "All checks passed!" "Some checks failed!")))
      (flush)
      (System/exit (if (empty? failed) 0 1)))))

(apply -main *command-line-args*)
