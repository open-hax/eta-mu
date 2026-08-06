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
         '[clj-yaml.core :as yaml]
         '[clojure.edn :as edn]
         '[clojure.string :as str]
         '[clojure.java.io :as io])

;; ---------------------------------------------------------------------------
;; Gate definitions — mirrored from .github/workflows
;; ---------------------------------------------------------------------------

(def mirrored-gates
  "Gates still hand-mirrored from .github/workflows. Each is a candidate for
   declaration as a workflow resource; whatever is declared is generated instead."
  [{:name "rheos"
    :workflow "rheos.yml" :job "test" :check "Rheos tests and lint"
    :paths ["packages/rheos/" "packages/protocols/" "packages/chat-ui/"
            "openhax.kanban.edn" "openhax.kanban.json" "kanban/openhax.kanban"
            "package.json" "pnpm-lock.yaml" "pnpm-workspace.yaml"
            ".github/workflows/rheos.yml"]
    ;; `:no-warning` on the build is STRICTER THAN CI, deliberately. The rheos
    ;; job runs only test + lint:kondo, and the one CI job that does build rheos
    ;; ignores compiler warnings — so a shadow-cljs :infer-warning reaches main
    ;; unchallenged, which is exactly how one did on 2026-08-06. sol and axxium
    ;; already fail on any WARNING; rheos should too. Tracked as
    ;; `rheos-ci-does-not-gate-build-warnings`; when CI catches up this stops
    ;; being an intentional divergence and becomes a plain mirror.
    :steps [{:cmd ["pnpm" "--dir" "packages/rheos" "test"] :expect "0 failures, 0 errors"}
            {:cmd ["pnpm" "--dir" "packages/rheos" "lint:kondo"]}
            {:cmd ["pnpm" "--dir" "packages/rheos" "build"] :no-warning true}]}

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
    ;; packages/sol/deps.edn is the only deps.edn in the workspace that reaches
    ;; outside it: katamorph and event-ledger are private repos consumed as
    ;; immutable git refs. eta-mu is public, and a workflow's default
    ;; GITHUB_TOKEN only covers the repo it runs in, so CI mints a scoped
    ;; GitHub App token to read those two.
    ;;
    ;; None of that applies locally — a developer's git credential helper
    ;; usually already has access. So check what actually matters (can we read
    ;; the repos?) rather than for CI's specific credential, which would skip a
    ;; gate that can perfectly well run.
    :needs-repos ["katamorph" "event-ledger"]
    :steps [{:cmd ["pnpm" "--dir" "packages/sol" "lint"]}
            {:cmd ["pnpm" "--dir" "packages/sol" "test"] :expect "0 failures, 0 errors" :no-warning true}
            {:cmd ["pnpm" "--dir" "packages/sol" "build"] :no-warning true}]}

   {:name "axxium"
    :workflow "axxium-ci.yml" :job "verify" :check "Axxium CI"
    :paths ["packages/axxium/" ".github/workflows/axxium-ci.yml" "pnpm-lock.yaml"]
    :steps [{:cmd ["bash" "-c" "cd packages/axxium && clj-kondo --lint src/cljs test/cljs"]}
            ;; The JS-boundary debt ratchet, from axxium-ci.yml. Omitting it let a
            ;; branch pass `--only axxium` while exceeding the boundary maximum,
            ;; or while accepting a malformed --max. Both halves are mirrored:
            ;; malformed maxima must be rejected, then the ratchet must hold.
            {:cmd ["bash" "-c"
                   (str "cd packages/axxium && set -o pipefail && "
                        "for invalid in 56oops 56.5 1e2; do "
                        "  if node scripts/check-js-boundary.mjs \"--max=${invalid}\" >/dev/null 2>&1; then "
                        "    echo \"Malformed boundary maximum was accepted: ${invalid}\"; exit 1; "
                        "  fi; "
                        "done && "
                        "node scripts/check-js-boundary.mjs --max=56")]}
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
;; Resource-derived gates
;; ---------------------------------------------------------------------------
;;
;; Gates below are hand-mirrored from the workflows. Gates declared as workflow
;; *resources* in contracts/workflows/ are generated instead, and those win —
;; a resource-derived gate cannot drift from its workflow, because both are
;; projections of one declaration.
;;
;; Migration is per-gate rather than all-at-once: whatever is declared is
;; generated, the rest stay mirrored, and `--list` says which is which. When
;; every gate is resource-derived, `--audit` has nothing left to check and goes.

(def gate-plan-path "contracts/workflows/.gates.edn")

(defn- resource-gates
  "Gates projected from workflow resources, keyed by name. Empty when the plan
   has not been emitted — the runner must work in a fresh checkout."
  [root]
  (let [f (io/file root gate-plan-path)]
    (if-not (.exists f)
      {}
      (into {}
            (for [g (:gates (edn/read-string (slurp f)))]
              [(:gate/id g)
               {:name (:gate/id g)
                :workflow (:gate/workflow g)
                :check (:gate/check g)
                :from-resource true
                :paths (vec (:gate/paths g))
                :steps (mapv (fn [s]
                               (cond-> {:cmd ["bash" "-c" (:step/run s)]}
                                 (:gate/expect s) (assoc :expect (:gate/expect s))
                                 (:gate/no-warning s) (assoc :no-warning true)))
                             (:gate/steps g))}])))))

(defn- merge-gates
  "Resource-derived gates replace their hand-mirrored namesakes."
  [root]
  (let [derived (resource-gates root)]
    (mapv #(or (derived (:name %)) %) mirrored-gates)))

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

(defn- die! [& msg]
  (println (str/join " " msg))
  (System/exit 2))

(defn repo-root []
  (or (sh-out "git" "rev-parse" "--show-toplevel")
      (die! "not inside a git repository")))

(defn changed-files
  "Paths this branch touches relative to `base`, plus anything currently dirty.

   Every git call is checked. An unresolvable base used to fall through to an
   empty set: no path-based gates were selected, the `:always` gates ran, and the
   run exited 0 — so a typo'd `--base` reported success having verified nothing
   about the branch. Reporting green without looking is the one answer this tool
   must never give by accident, so a git failure here exits 2 (setup) instead.

   An *empty* diff is still fine — `sh-out` returns \"\" on success and nil only
   on a nonzero exit, so a branch with no changes is not confused with a broken
   command."
  [base]
  (when-not (sh-out "git" "rev-parse" "--verify" "--quiet" (str base "^{commit}"))
    (die! (str "cannot resolve base ref: " base)
          "\n  Pass a ref that exists with --base, or fetch it first."))
  (let [mb (or (sh-out "git" "merge-base" base "HEAD")
               (die! (str "no merge base between " base " and HEAD")
                     "\n  Unrelated histories? Try --all to run every gate."))
        tracked (or (sh-out "git" "diff" "--name-only" mb "HEAD")
                    (die! (str "git diff failed against " mb)))
        dirty (or (sh-out "git" "status" "--porcelain")
                  (die! "git status failed"))
        dirty-paths (->> (str/split-lines dirty)
                         (remove str/blank?)
                         (map #(str/trim (subs % 2))))]
    (->> (concat (str/split-lines tracked) dirty-paths)
         (remove str/blank?)
         set)))

(defn gate-selected? [gate files]
  (or (= :always (:paths gate))
      (boolean (some (fn [p] (some #(str/starts-with? % p) files)) (:paths gate)))))

(defn unreadable-repos
  "Which of a gate's private dependency repos this machine cannot read. Uses the
   ambient git credentials — the point is whether the build could resolve them,
   not whether CI's app credential happens to be exported here."
  [gate]
  (seq (remove (fn [r]
                 (zero? (:exit (p/sh {:continue true}
                                     "git" "ls-remote"
                                     (str "https://github.com/open-hax/" r ".git") "HEAD"))))
               (:needs-repos gate))))

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
  (if-let [miss (unreadable-repos gate)]
    {:gate gate :status :skipped
     :reason (str "cannot read private dep repo(s): " (str/join ", " miss)
                  " — check `gh auth status` / your git credential helper")}
    (loop [[s & more] (:steps gate)
           done []
           ;; git needs its credential helper, which lives outside the scrub set
           env (first (scrubbed-env nil))]
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

(defn- workflow-pr-paths
  "The `pull_request.paths` filter a workflow declares, as a set. `nil` means the
   workflow has no path filter and therefore runs on every PR."
  [f]
  (let [on (or (get (yaml/parse-string (slurp f)) :on)
               (get (yaml/parse-string (slurp f)) true))
        pr (:pull_request on)]
    (when (and (map? pr) (:paths pr))
      (set (map str (:paths pr))))))

(defn- literal-prefix
  "The part of a path filter before any glob metacharacter, with trailing
   separators and dots trimmed.

   `packages/rheos/**` -> `packages/rheos`
   `.github/workflows/*.yml` -> `.github/workflows`
   `kanban/openhax.kanban.*` -> `kanban/openhax.kanban`
   `openhax.kanban.edn` -> `openhax.kanban.edn`  (no glob, so it stays literal)"
  [pattern]
  (-> (str pattern)
      (str/replace #"^\./" "")
      (str/split #"[*?\[]" 2)
      first
      (str/replace #"[/.]+$" "")))

(defn- covered?
  "Does some entry in `prefixes` select everything `p` selects? Prefix-vs-prefix,
   since a gate entry is a directory prefix and a workflow entry is a glob."
  [prefixes p]
  (boolean (some #(or (= % p)
                      (str/starts-with? p (str % "/"))
                      (str/starts-with? % (str p "/")))
                 prefixes)))

(defn- path-drift
  "Where a gate's `:paths` and its workflow's `pull_request.paths` disagree.

   Mirrored selection is the whole premise: a branch should run locally what CI
   would have run for it. If CI watches a path the gate does not, the gate
   silently stops covering those changes, and nothing else here would notice."
  [gate f]
  (when-not (= :always (:paths gate))
    (when-let [wf (workflow-pr-paths f)]
      (let [gate-prefixes (map literal-prefix (:paths gate))
            wf-prefixes (map literal-prefix wf)
            missing (sort (distinct (remove #(covered? gate-prefixes %) wf-prefixes)))
            extra (sort (distinct (remove #(covered? wf-prefixes %) gate-prefixes)))]
        (when (or (seq missing) (seq extra))
          {:missing missing :extra extra})))))

(defn audit
  "Check each gate still matches the workflow it mirrors, and exit nonzero if not.

   Reporting drift and exiting 0 would make this safe to ignore in a script,
   which defeats the point of having it."
  [root]
  (println "Auditing each gate against the workflow it mirrors.\n")
  (let [problems
        (doall
         (for [g mirrored-gates]
           (let [f (io/file root ".github/workflows" (:workflow g))]
             (cond
               (not (.exists f))
               (do (println (format "  MISSING  %-20s %s (workflow gone — gate is stale)"
                                    (:name g) (:workflow g)))
                   :missing)

               (not (str/includes? (slurp f) (str (:job g) ":")))
               (do (println (format "  DRIFT    %-20s job '%s' not found in %s"
                                    (:name g) (:job g) (:workflow g)))
                   :job)

               :else
               (if-let [{:keys [missing extra]} (path-drift g f)]
                 (do (println (format "  PATHS    %-20s %s" (:name g) (:workflow g)))
                     (when (seq missing)
                       (println (format "             in the workflow, not in the gate: %s"
                                        (str/join ", " missing))))
                     (when (seq extra)
                       (println (format "             in the gate, not in the workflow: %s"
                                        (str/join ", " extra))))
                     :paths)
                 (do (println (format "  ok       %-20s %s :: %s"
                                      (:name g) (:workflow g) (:job g)))
                     nil))))))
        bad (remove nil? problems)]
    (println)
    (println "Checked: workflow exists, job name present, and pull_request.paths match.")
    (println "NOT checked: that the commands still match — read the workflow when a")
    (println "gate starts disagreeing with CI.")
    (when (seq bad)
      (println (format "\n%d gate(s) drifted from their workflow." (count bad))))
    (System/exit (if (seq bad) 1 0))))

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
        root (repo-root)
        gates (merge-gates root)]

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
          (println (format "  %-20s %s %s"
                           (:name g)
                           (if (:from-resource g) "FROM RESOURCE" "mirrors      ")
                           (if (:from-resource g)
                             (str (:workflow g) " (contracts/workflows/)")
                             (str (:check g) " (" (:workflow g) " :: " (:job g) ")"))))
          (doseq [s (:steps g)] (println (format "      %s" (str/join " " (:cmd s))))))
        (System/exit 0))

      ;; A worktree created without `pnpm install` fails the first step of every
      ;; gate that shells out to pnpm, which reads as three separate code
      ;; failures. It is a setup problem, so it exits 2 (distinct from 1 = a gate
      ;; failed) and says what to run.
      (when-not (.exists (io/file root "node_modules"))
        (println "No node_modules in" (str root))
        (println)
        (println "  Every pnpm gate would fail on its first step and look like a code failure.")
        (println "  This is the usual state of a freshly created worktree.")
        (println)
        (println "  Fix:  pnpm install --frozen-lockfile")
        (System/exit 2))

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
