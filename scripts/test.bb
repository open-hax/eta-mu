#!/usr/bin/env bb
;; Eta-mu test gate.
;;
;; Runs every workspace unit-test suite and reports one summary.
;;
;; This exists because the root `test` script was a four-package `&&` chain
;; (eta-mu, terminal-ui, turn-processor, kanban-legacy). It silently excluded
;; rheos, sol, axxium, chat-ui, protocols, and extensions — which is how
;; @open-hax/protocols sat with two failing assertions nobody saw. ClojureScript
;; is canonical here; the gate has to cover it.
;;
;; Every suite runs even when an earlier one fails, so one red package does not
;; hide the state of the rest. `--bail` opts out.
;;
;;   bb scripts/test.bb [--bail] [--only rheos,sol]
;;
;; Exit 0 when every selected suite passed, 1 otherwise.

(require '[babashka.process :as p]
         '[clojure.java.io :as io]
         '[clojure.string :as str])

(def root
  (-> (io/file *file*) .getAbsoluteFile .getParentFile .getParentFile))

(def suites
  "The suites, in the order a failure is most likely to matter.

   `:label` is what shows in the summary and what `--only` matches. `:pkg` is the
   pnpm filter; `:cmd` overrides it for anything not run through pnpm.

   Keep this complete — a package with a `test` script that is not listed here is
   a package whose failures nobody will see.

   Deliberately excluded:
     @eta-mu/e2e — browser/server suite, run by .github/workflows/e2e.yml"
  [{:label "contract-guard" :cmd ["node" "--test" "scripts/contract-guard.test.mjs"]}
   {:label "eta-mu" :pkg "eta-mu"}
   {:label "rheos" :pkg "@eta-mu/rheos"}
   {:label "sol" :pkg "@eta-mu/sol"}
   {:label "terminal-ui" :pkg "@eta-mu/terminal-ui"}
   {:label "turn-processor" :pkg "@eta-mu/turn-processor"}
   {:label "extensions" :pkg "@eta-mu/extensions"}
   {:label "protocols" :pkg "@open-hax/protocols"}
   {:label "chat-ui" :pkg "@open-hax/chat-ui"}
   {:label "axxium" :pkg "@open-hax/axxium"}
   {:label "kanban-legacy" :pkg "@open-hax/kanban-legacy"}])

(def rule (apply str (repeat 60 "=")))

(defn suite-command [{:keys [pkg cmd]}]
  (or cmd ["pnpm" "--filter" pkg "test"]))

(defn run-suite
  "Run one suite with inherited stdio. Returns {:label :ok :seconds}."
  [{:keys [label] :as suite}]
  (println (str "\n" rule "\nTesting: " label "\n" rule "\n"))
  (flush)
  (let [started (System/currentTimeMillis)
        {:keys [exit]} (apply p/shell
                              {:dir root :continue true
                               :extra-env {"NODE_OPTIONS" "--experimental-vm-modules"}}
                              (suite-command suite))
        seconds (format "%.1f" (/ (- (System/currentTimeMillis) started) 1000.0))
        ok (zero? exit)]
    (if ok
      (println (str "\n✓ " label " passed (" seconds "s)"))
      (binding [*out* *err*]
        (println (str "\n✗ " label " failed (exit code " exit ", " seconds "s)"))))
    {:label label :ok ok :seconds seconds}))

(defn parse-args
  "`--only` may legitimately be argv[0], so test the sentinel -1 rather than
   truthiness of the index — conflating those made `--only rheos` select nothing
   and then report success."
  [args]
  (let [args (vec args)
        only-idx (.indexOf args "--only")
        only-value (when (not= -1 only-idx) (get args (inc only-idx)))]
    (when (and (not= -1 only-idx) (str/blank? only-value))
      (binding [*out* *err*] (println "--only needs a comma-separated list of suite labels."))
      (System/exit 1))
    {:bail? (contains? (set args) "--bail")
     :only (when only-value
             (into #{} (comp (map str/trim) (remove str/blank?))
                   (str/split only-value #",")))}))

(defn -main [& args]
  (let [{:keys [bail? only]} (parse-args args)
        known (into #{} (map :label) suites)]
    (when only
      (when-let [unknown (seq (remove known only))]
        (binding [*out* *err*]
          (println (str "Unknown suite(s): " (str/join ", " unknown)))
          (println (str "Known: " (str/join ", " (map :label suites)))))
        (System/exit 1)))
    (let [selected (if only (filterv #(only (:label %)) suites) suites)
          ;; Running zero suites is a failure, never a pass. Without this an empty
          ;; selection printed "All suites passed!" and exited 0.
          _ (when (empty? selected)
              (binding [*out* *err*]
                (println "No suites selected — refusing to report a pass for zero tests."))
              (System/exit 1))
          results (reduce (fn [acc suite]
                            (let [result (run-suite suite)
                                  acc (conj acc result)]
                              (if (and bail? (not (:ok result)))
                                (do (binding [*out* *err*]
                                      (println "\n--bail: stopping at the first failure."))
                                    (reduced acc))
                                acc)))
                          []
                          selected)
          failed (remove :ok results)
          skipped (- (count selected) (count results))]
      (println (str "\n" rule "\nTEST SUMMARY\n" rule "\n"))
      (doseq [{:keys [label ok seconds]} results]
        (println (str "  " (if ok "✓" "✗") " " label " (" seconds "s)")))
      (when (pos? skipped)
        (println (str "\n  " skipped " suite(s) not run (bailed early).")))
      (println
       (str "\n" (if (empty? failed)
                   "All suites passed!"
                   (str (count failed) " suite(s) failed: "
                        (str/join ", " (map :label failed))))))
      (flush)
      (System/exit (if (and (seq results) (empty? failed) (zero? skipped)) 0 1)))))

(apply -main *command-line-args*)
