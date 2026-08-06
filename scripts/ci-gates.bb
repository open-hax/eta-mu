#!/usr/bin/env bb
;; Run the gates GitHub Actions runs, locally, against the packages a branch touches.
;;
;; Why this exists: on 2026-08-06 a GitHub-wide Actions outage left every open PR
;; red for reasons that had nothing to do with the code, and there was no way to
;; answer "would this have passed?" without hand-running each job's commands.
;;
;; This mirrors the workflows rather than re-inventing a gate set. Each entry
;; below names the workflow file and job it came from; if a workflow changes,
;; this file is wrong until it is updated, and `--audit` will say so.
;;
;; Two behaviours are copied deliberately because exit codes alone do not capture
;; them:
;;   - some jobs assert "0 failures, 0 errors" appears in stdout;
;;   - sol and axxium fail on any WARNING line in test/build output.
;;
;; Usage:
;;   scripts/ci-gates.bb                 # gates whose paths the branch touches
;;   scripts/ci-gates.bb --all           # every gate
;;   scripts/ci-gates.bb --list          # what would run, and why
;;   scripts/ci-gates.bb --base main     # diff against another base (default origin/main)
;;   scripts/ci-gates.bb --only rheos    # one gate by name (repeatable)
;;   scripts/ci-gates.bb --audit         # check the mirrored path filters still match the workflows

(require '[babashka.process :as p]
         '[clojure.string :as str]
         '[clojure.java.io :as io])

;; ---------------------------------------------------------------------------
;; Gate definitions — mirrored from .github/workflows
;; ---------------------------------------------------------------------------

(def gates
  [{:name "rheos"
    :workflow "rheos.yml" :job "test" :check "Rheos tests and lint"
    :paths ["packages/rheos/" "packages/protocols/" "packages/chat-ui/"
            "pnpm-lock.yaml" ".github/workflows/rheos.yml"]
    :steps [{:cmd ["pnpm" "--dir" "packages/rheos" "test"] :expect "0 failures, 0 errors"}
            {:cmd ["pnpm" "--dir" "packages/rheos" "lint:kondo"]}]}

   {:name "eta-mu-cljs"
    :workflow "coverage.yml" :job "eta-mu-cljs" :check "eta-mu CLI + turn-processor + terminal-ui"
    :paths :always
    :steps [{:cmd ["pnpm" "--dir" "packages/turn-processor" "test"] :expect "0 failures, 0 errors"}
            {:cmd ["pnpm" "--dir" "packages/turn-processor" "lint:kondo"]}
            {:cmd ["pnpm" "--dir" "packages/terminal-ui" "test"] :expect "0 failures, 0 errors"}
            {:cmd ["pnpm" "--dir" "packages/terminal-ui" "lint:kondo"]}
            {:cmd ["pnpm" "--dir" "packages/eta-mu" "test"] :expect "0 failures, 0 errors"}
            {:cmd ["pnpm" "--dir" "packages/eta-mu" "lint:kondo"]}
            {:cmd ["pnpm" "--dir" "packages/eta-mu" "test:e2e"]}]}

   {:name "ts-packages"
    :workflow "coverage.yml" :job "ts-packages" :check "TS package tests"
    :paths :always
    :steps [{:cmd ["pnpm" "--dir" "packages/legacy/github" "test"]}
            {:cmd ["bash" "-c" "node --test packages/legacy/docs/tests/*.test.cjs"]}]}

   {:name "sol"
    :workflow "sol-ci.yml" :job "verify" :check "Sol CI"
    :paths ["packages/sol/" "packages/turn-processor/" "packages/eta-mu/"
            ".github/workflows/sol-ci.yml" "package.json" "pnpm-lock.yaml" "pnpm-workspace.yaml"]
    ;; Sol resolves katamorph/event-ledger through private git mirrors that CI
    ;; builds from an app credential. Without it the failure is environmental,
    ;; so it is reported as SKIPPED rather than counted as a code failure.
    :needs-env ["ETA_MU_APP_ID" "ETA_MU_APP_PRIVATE_KEY"]
    :steps [{:cmd ["pnpm" "--dir" "packages/sol" "lint"]}
            {:cmd ["pnpm" "--dir" "packages/sol" "test"] :expect "0 failures, 0 errors" :no-warning true}
            {:cmd ["pnpm" "--dir" "packages/sol" "build"] :no-warning true}]}

   {:name "axxium"
    :workflow "axxium-ci.yml" :job "verify" :check "Axxium CI"
    :paths ["packages/axxium/" ".github/workflows/axxium-ci.yml" "pnpm-lock.yaml"]
    :steps [{:cmd ["bash" "-c" "cd packages/axxium && clj-kondo --lint src/cljs test/cljs"]}
            {:cmd ["pnpm" "--dir" "packages/axxium" "test"] :expect "0 failures, 0 errors" :no-warning true}
            {:cmd ["pnpm" "--dir" "packages/axxium" "build"] :no-warning true}]}

   {:name "extensions"
    :workflow "eta-mu-extensions-tests.yml" :job "test" :check "eta-mu-extensions-tests"
    :paths ["packages/extensions/" "packages/e2e/" ".github/workflows/eta-mu-extensions-tests.yml"]
    :steps [{:cmd ["pnpm" "--dir" "packages/extensions" "build"]}
            {:cmd ["pnpm" "--dir" "packages/extensions" "validate-paths"]}
            {:cmd ["bash" "-c" "cd packages/extensions && pnpm exec shadow-cljs compile node-test && node target/test.cjs"]
             :expect "0 failures, 0 errors"}]}

   {:name "eta-mu-lint"
    :workflow "main-pr-gate.yml" :job "eta-mu-lint" :check "eta-mu-lint"
    :paths ["packages/legacy/docs/" "packages/legacy/github/" ".github/workflows/"]
    :steps [{:cmd ["pnpm" "--dir" "packages/extensions" "build"]}
            {:cmd ["pnpm" "lint"]}]}

   {:name "main-tests"
    :workflow "main-pr-gate.yml" :job "main-tests" :check "main-tests"
    :paths ["packages/legacy/docs/" "packages/legacy/github/" ".github/workflows/"]
    :steps [{:cmd ["bash" "-c" "node --test packages/legacy/docs/tests/*.test.cjs"]}]}

   {:name "rheos-github-sync"
    :workflow "rheos-github-sync-ci.yml" :job "rheos-github-sync" :check "rheos-github-sync"
    :paths ["packages/rheos/" ".github/workflows/kanban-sync.yml"
            ".github/workflows/eta-mu-kanban-sync.yml"
            ".github/workflows/rheos-github-sync-ci.yml"]
    :steps [{:cmd ["pnpm" "--dir" "packages/rheos" "test"] :expect "0 failures, 0 errors"}
            {:cmd ["pnpm" "--dir" "packages/rheos" "build"]}
            {:cmd ["bash" "-c" "node packages/rheos/dist/cli.cjs board snapshot --tasks-dir \"$PWD/kanban\" --out /tmp/ci-gates-snapshot.json"]}
            {:cmd ["bash" "-c" "node packages/rheos/dist/cli.cjs drift --tasks-dir \"$PWD/kanban\""]}]}])

;; ---------------------------------------------------------------------------
;; Plumbing
;; ---------------------------------------------------------------------------

;; ---------------------------------------------------------------------------
;; Environment scrubbing
;; ---------------------------------------------------------------------------
;;
;; CI runs with an empty environment; a developer machine does not. This is not
;; cosmetic — it produces false failures. `stream-chat-no-provider-configured-test`
;; asserts that stream-chat short-circuits when no API key is configured. It
;; passes `{}` as config, and the implementation falls back to the ambient
;; OPENAI_API_KEY. With that key exported (as it is on this workspace, along with
;; 16 other provider keys) the guard never fires, fetch is called, and the test
;; fails for a reason that has nothing to do with the branch.
;;
;; So gates run with provider-ish variables removed, minus anything a gate
;; explicitly declares it needs. Removal is reported, never silent — a scrub that
;; hides a real configuration problem would be its own kind of lie.

(def scrub-patterns
  [#"_API_KEY$" #"^OPENAI_" #"^ANTHROPIC_" #"^GEMINI_" #"^MISTRAL_" #"^OPENROUTER_"
   #"^KIMI_" #"^ZAI_" #"^ELEVENLABS_" #"^KNOXX_" #"^PROXX_" #"^OPENPLANNER_"
   #"^SHIBBOLETH_" #"^OLLAMA_" #"_BASE_URL$" #"^ETA_MU_"])

(defn scrubbed-env
  "The current environment minus provider configuration, keeping whatever `keep`
   names. Returns [env-map removed-names]."
  [keep]
  (let [keep (set keep)
        all (into {} (System/getenv))
        remove? (fn [k] (and (not (keep k))
                             (some #(re-find % k) scrub-patterns)))
        removed (sort (filter remove? (keys all)))]
    [(into {} (remove (comp remove? key)) all) removed]))

(defn sh-out [& args]
  (let [{:keys [out exit]} (apply p/sh args)]
    (when (zero? exit) (str/trim out))))

(defn repo-root []
  (or (sh-out "git" "rev-parse" "--show-toplevel")
      (do (println "not inside a git repository") (System/exit 2))))

(defn changed-files [base]
  (let [mb (or (sh-out "git" "merge-base" base "HEAD") base)
        tracked (or (sh-out "git" "diff" "--name-only" mb "HEAD") "")
        dirty (or (sh-out "git" "status" "--porcelain") "")
        dirty-paths (->> (str/split-lines dirty)
                         (remove str/blank?)
                         (map #(str/trim (subs % 2))))]
    (->> (concat (str/split-lines tracked) dirty-paths)
         (remove str/blank?)
         set)))

(defn gate-selected? [gate files]
  (or (= :always (:paths gate))
      (boolean (some (fn [p] (some #(str/starts-with? % p) files)) (:paths gate)))))

(defn missing-env [gate]
  (seq (remove #(seq (str (System/getenv %))) (:needs-env gate))))

(defn run-step [{:keys [cmd expect no-warning]} root env]
  (let [started (System/currentTimeMillis)
        {:keys [out err exit]} (apply p/sh {:dir root :continue true :env env} cmd)
        combined (str out err)
        ms (- (System/currentTimeMillis) started)
        warn (when no-warning
               (->> (str/split-lines combined)
                    (filter #(re-find #"(^|\s)WARNING([:\s]|$)" %))
                    seq))
        fail (cond
               (not (zero? exit)) (str "exit " exit)
               (and expect (not (str/includes? combined expect)))
               (str "expected \"" expect "\" in output — CI asserts this, exit code alone is not enough")
               warn (str (count warn) " WARNING line(s) — this gate treats warnings as failures")
               :else nil)]
    {:cmd (str/join " " cmd) :ms ms :fail fail :output combined
     :warn warn}))

(defn run-gate [gate root]
  (if-let [miss (missing-env gate)]
    {:gate gate :status :skipped
     :reason (str "missing " (str/join ", " miss) " — needed for private dependency mirrors")}
    (loop [[s & more] (:steps gate)
           done []
           env (first (scrubbed-env (:needs-env gate)))]
      (if-not s
        {:gate gate :status :passed :steps done}
        (let [r (run-step s root env)]
          (print (if (:fail r) "x" ".")) (flush)
          (if (:fail r)
            {:gate gate :status :failed :steps (conj done r) :failed-step r}
            (recur more (conj done r) env)))))))

;; ---------------------------------------------------------------------------
;; Audit — do the mirrored path filters still match the workflows?
;; ---------------------------------------------------------------------------

(defn audit [root]
  (println "Checking each gate's workflow file still exists and its job is present.\n")
  (doseq [g gates]
    (let [f (io/file root ".github/workflows" (:workflow g))]
      (cond
        (not (.exists f))
        (println (format "  MISSING  %-20s %s (workflow gone — gate is stale)" (:name g) (:workflow g)))

        (not (str/includes? (slurp f) (str (:job g) ":")))
        (println (format "  DRIFT    %-20s job '%s' not found in %s" (:name g) (:job g) (:workflow g)))

        :else
        (println (format "  ok       %-20s %s :: %s" (:name g) (:workflow g) (:job g))))))
  (println "\nThis only checks the workflow and job still exist. It does NOT verify the")
  (println "commands still match — read the workflow when a gate starts disagreeing with CI."))

;; ---------------------------------------------------------------------------
;; Main
;; ---------------------------------------------------------------------------

(defn -main [& args]
  (let [args (vec args)
        flag? #(some #{%} args)
        opt (fn [k] (second (drop-while #(not= % k) args)))
        base (or (opt "--base") "origin/main")
        only (set (keep-indexed (fn [i a] (when (= "--only" (nth args (dec i) nil)) a))
                                (range (count args))))
        only (set (for [[i a] (map-indexed vector args) :when (= a "--only")]
                    (nth args (inc i) nil)))
        root (repo-root)]

    (when (flag? "--audit") (audit root) (System/exit 0))

    (let [files (if (flag? "--all") nil (changed-files base))
          chosen (cond->> gates
                   (seq only) (filter #(only (:name %)))
                   (and (not (flag? "--all")) (empty? only))
                   (filter #(gate-selected? % files)))]

      (when-not (flag? "--all")
        (println (format "Base %s — %d changed path(s)\n" base (count files))))

      (when (empty? chosen)
        (println "No gates selected. Nothing this branch touched maps to a gate.")
        (println "Use --all to run everything, or --list to see the mapping.")
        (System/exit 0))

      (when (flag? "--list")
        (println "Would run:\n")
        (doseq [g chosen]
          (println (format "  %-20s mirrors %s (%s :: %s)"
                           (:name g) (:check g) (:workflow g) (:job g)))
          (doseq [s (:steps g)] (println (format "      %s" (str/join " " (:cmd s))))))
        (System/exit 0))

      (let [removed (second (scrubbed-env nil))]
        (when (seq removed)
          (println (format "Scrubbing %d provider variable(s) so gates see CI's empty environment:"
                           (count removed)))
          (println "  " (str/join " " removed))
          (println "  (names only — no values are read or printed)\n")))

      (println (format "Running %d gate(s). Each dot is a step.\n" (count chosen)))
      (let [started (System/currentTimeMillis)
            results (doall (for [g chosen]
                             (do (printf "  %-20s " (:name g)) (flush)
                                 (let [r (run-gate g root)]
                                   (println (case (:status r)
                                              :passed "  PASS"
                                              :failed "  FAIL"
                                              :skipped (str "  SKIP — " (:reason r))))
                                   r))))
            failed (filter #(= :failed (:status %)) results)
            skipped (filter #(= :skipped (:status %)) results)
            total-s (quot (- (System/currentTimeMillis) started) 1000)]

        (println (format "\n%ds — %d passed, %d failed, %d skipped"
                         total-s
                         (count (filter #(= :passed (:status %)) results))
                         (count failed) (count skipped)))

        (doseq [r failed]
          (println (format "\n─── %s failed ───" (-> r :gate :name)))
          (println "  mirrors CI check:" (-> r :gate :check))
          (println "  command:" (-> r :failed-step :cmd))
          (println "  reason: " (-> r :failed-step :fail))
          (println "  ---- last 40 lines ----")
          (doseq [l (take-last 40 (str/split-lines (-> r :failed-step :output)))]
            (println "  " l)))

        (when (seq skipped)
          (println "\nSkipped gates were NOT verified — do not read them as green."))

        (System/exit (if (seq failed) 1 0))))))

(apply -main *command-line-args*)
