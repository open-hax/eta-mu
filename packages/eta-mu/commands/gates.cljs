;; Run this project's CI gates locally.
;;
;; Ships with eta-mu and carries **no gate definitions of its own**. Gates are
;; read from `contracts/workflows/.gates.edn`, projected from the project's
;; workflow resources by `eta-mu workflows emit`. A tool used across many
;; projects must not carry one project's gates.
;;
;; Why it exists: on 2026-08-06 a GitHub-wide Actions outage left every open PR
;; red for reasons unrelated to the code, with no way to answer "would this have
;; passed?" without hand-running each job's commands.
;;
;; Two behaviours are copied from CI because exit codes alone do not capture
;; them: some jobs assert "0 failures, 0 errors" appears in stdout, and some
;; fail on any WARNING line.
;;
;;   eta-mu gates                 # gates whose paths this branch touches
;;   eta-mu gates --all           # every gate
;;   eta-mu gates --list          # what would run, and why
;;   eta-mu gates --base main     # diff against another base
;;   eta-mu gates --only rheos    # one gate by name (repeatable)
;;   eta-mu gates --audit         # path filters of non-emitting workflows

(ns eta-mu.commands.gates
  (:require ["node:fs" :as fs]
            ["node:path" :as path]
            ["node:child_process" :as cp]
            ["yaml" :as yaml]
            [clojure.edn :as edn]
            [clojure.string :as str]))

(def gate-plan-path "contracts/workflows/.gates.edn")

(defn- die! [& msg] (println (str/join " " msg)) (js/process.exit 2))

(defn- exists? [p] (fs/existsSync p))
(defn- read-text [p] (fs/readFileSync p "utf8"))

(defn- pad [s n]
  (let [s (str s)]
    (str s (apply str (repeat (max 0 (- n (count s))) " ")))))

(defn load-gates
  "Gates projected from this project's workflow resources.

   This tool defines none itself. If the plan is missing, the project either
   has no workflow resources or has not emitted — say which, rather than
   reporting a clean run over an empty gate set."
  [root]
  (let [f (path/join root gate-plan-path)]
    (when-not (exists? f)
      (println (str "No gate plan at " f "\n"))
      (if (exists? (path/join root "contracts" "workflows"))
        (println "This project has workflow resources but has not emitted:\n\n  eta-mu workflows emit")
        (println (str "This project declares no workflows. `eta-mu workflows` explains\n"
                      "how to start one; gates are projected from those resources.")))
      (js/process.exit 0))
    (->> (:gates (edn/read-string (read-text f)))
         (mapv (fn [g]
                 {:name (:gate/id g)
                  :workflow (:gate/workflow g)
                  :check (:gate/check g)
                  :paths (:gate/paths g)
                  :emitting (:gate/emitting g)
                  :needs-repos (:gate/needs-repos g)
                  :steps (mapv (fn [st]
                                 (cond-> {:cmd ["bash" "-c" (:step/run st)]}
                                   (:gate/expect st) (assoc :expect (:gate/expect st))
                                   (:gate/no-warning st) (assoc :no-warning true)))
                               (:gate/steps g))})))))

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
        env (.-env js/process)
        ;; process.env is a host object, not a plain one — js->clj leaves it
        ;; untouched and every seq operation on it then fails. Enumerate keys.
        all (into {} (map (fn [k] [k (aget env k)])) (js/Object.keys env))
        remove? (fn [k] (and (not (keep k))
                             (some #(re-find % k) scrub-patterns)))
        removed (sort (filter remove? (keys all)))]
    [(into {} (remove (comp remove? key)) all) removed]))

(defn sh-out
  "stdout of a command, or nil when it exits non-zero."
  [& args]
  (let [r (cp/spawnSync (first args) (clj->js (vec (rest args)))
                        #js {:encoding "utf8"})]
    (when (zero? (or (.-status r) 1)) (str/trim (or (.-stdout r) "")))))

(defn repo-root []
  (loop [dir (path/resolve (js/process.cwd))]
    (cond
      (exists? (path/join dir ".git")) dir
      (= dir (path/dirname dir)) (die! "not inside a git repository")
      :else (recur (path/dirname dir)))))

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
        ;; `-z` because a rename is reported as `R  old -> new` in the default
        ;; format, which reads as one nonsense path — and the *destination* is
        ;; the one a gate needs to select on. With -z the two sides arrive as
        ;; separate NUL-terminated fields.
        dirty (or (sh-out "git" "status" "--porcelain=v1" "-z")
                  (die! "git status failed"))
        dirty-paths (->> (str/split dirty #"\u0000")
                         (remove str/blank?)
                         ;; Fields alternate: an entry, then for R/C a second
                         ;; field holding the original path. Both are real
                         ;; paths; only the status-prefixed one needs trimming.
                         (map #(if (re-find #"^[ MADRCU?!]{2} " %)
                                 (str/trim (subs % 3))
                                 (str/trim %))))]
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
                 (zero? (or (.-status (cp/spawnSync "git"
                                                    #js ["ls-remote"
                                                         (str "https://github.com/open-hax/" r ".git")
                                                         "HEAD"]
                                                    #js {:encoding "utf8"})) 1)))
               (:needs-repos gate))))

(defn run-step [{:keys [cmd expect no-warning]} root env]
  (let [started (js/Date.now)
        r (cp/spawnSync (first cmd) (clj->js (vec (rest cmd)))
                        #js {:cwd root :encoding "utf8" :env (clj->js env)})
        exit (or (.-status r) 1)
        combined (str (or (.-stdout r) "") (or (.-stderr r) ""))
        ms (- (js/Date.now) started)
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
          (js/process.stdout.write (if (:fail r) "x" "."))
          (if (:fail r)
            {:gate gate :status :failed :steps (conj done r) :failed-step r}
            (recur more (conj done r) env)))))))

;; ---------------------------------------------------------------------------
;; Audit — only where drift is still possible
;; ---------------------------------------------------------------------------
;;
;; A workflow the resource emits cannot drift from its gate: both are
;; projections of one declaration. A workflow marked `:workflow/emit false`
;; still has hand-written YAML, so its path filters can drift from the resource
;; that declares its gate. Those are the only ones worth checking, and this
;; command has nothing left to say once every workflow emits.

(defn- literal-prefix [pattern]
  (-> (str pattern)
      (str/replace #"^\./" "")
      (str/split #"[*?\[]" 2)
      first
      (str/replace #"[/.]+$" "")))

(defn- covered? [prefixes p]
  (boolean (some #(or (= % p)
                      (str/starts-with? p (str % "/"))
                      (str/starts-with? % (str p "/")))
                 prefixes)))

(defn- workflow-pr-paths [f]
  (let [doc (js->clj (.parse yaml (read-text f)))
        on (or (get doc "on") (get doc true))
        pr (get on "pull_request")]
    (when (and (map? pr) (get pr "paths"))
      (set (map str (get pr "paths"))))))

(defn audit [root]
  (let [resources-dir (path/join root "contracts" "workflows")
        plan-gates (load-gates root)
        _ (println "Auditing path filters of workflows that do not yet emit.\n")
        problems
        (doall
         (for [g plan-gates
               :let [wf-file (path/join root ".github" "workflows"
                                        (str (:workflow g) ".yml"))]
               ;; An emitting workflow cannot drift from its gate — both are
               ;; projections of one declaration — so checking it would report
               ;; noise. The plan carries :gate/emitting for exactly this.
               :when (and (not (:emitting g))
                          (not= :always (:paths g))
                          (exists? wf-file))]
           (let [wf (workflow-pr-paths wf-file)]
             (if-not wf
               (do (println (str "  ok       " (pad (:name g) 20) " no path filter"))
                   nil)
               (let [;; The declaration path is appended by the projector so a
                     ;; gate re-runs when its own definition changes. It is a
                     ;; local-selection concern and has no business in a
                     ;; workflow's trigger filter, so it is not drift.
                     declared (remove #(str/starts-with? (str %) "contracts/workflows/")
                                      (:paths g))
                     gate-p (map literal-prefix declared)
                     wf-p (map literal-prefix wf)
                     missing (sort (distinct (remove #(covered? gate-p %) wf-p)))
                     extra (sort (distinct (remove #(covered? wf-p %) gate-p)))]
                 (if (or (seq missing) (seq extra))
                   (do (println (str "  PATHS    " (pad (:name g) 20) (:workflow g) ".yml"))
                       (when (seq missing)
                         (println (str "             in the workflow, not the resource: "
                                       (str/join ", " missing))))
                       (when (seq extra)
                         (println (str "             in the resource, not the workflow: "
                                       (str/join ", " extra))))
                       :drift)
                   (do (println (str "  ok       " (pad (:name g) 20) (:workflow g) ".yml"))
                       nil)))))))
        bad (remove nil? problems)]
    (println)
    (when-not (exists? resources-dir)
      (println "This project has no workflow resources."))
    (println "Emitting workflows are not audited — they cannot drift from their gate.")
    (when (seq bad)
      (println (str "\n" (count bad) " gate(s) drifted from their workflow.")))
    (js/process.exit (if (seq bad) 1 0))))

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
        gates (load-gates root)]

    (when (flag? "--audit") (audit root) (js/process.exit 0))

    (let [files (if (flag? "--all") nil (changed-files base))
          chosen (cond->> gates
                   (seq only) (filter #(only (:name %)))
                   (and (not (flag? "--all")) (empty? only))
                   (filter #(gate-selected? % files)))]

      (when-not (flag? "--all")
        (println (str "Base " base " — " (count files) " changed path(s)\n")))

      (when (empty? chosen)
        (println "No gates selected. Nothing this branch touched maps to a gate.")
        (println "Use --all to run everything, or --list to see the mapping.")
        (js/process.exit 0))

      (when (flag? "--list")
        (println "Would run:\n")
        (doseq [g chosen]
          (println (str "  " (pad (:name g) 20) " " (:check g)
                        "  [" (:workflow g) "]"))
          (doseq [s (:steps g)] (println (str "      " (last (:cmd s))))))
        (js/process.exit 0))

      ;; A worktree created without `pnpm install` fails the first step of every
      ;; gate that shells out to pnpm, which reads as three separate code
      ;; failures. It is a setup problem, so it exits 2 (distinct from 1 = a gate
      ;; failed) and says what to run.
      (when-not (exists? (path/join root "node_modules"))
        (println "No node_modules in" (str root))
        (println)
        (println "  Every pnpm gate would fail on its first step and look like a code failure.")
        (println "  This is the usual state of a freshly created worktree.")
        (println)
        (println "  Fix:  pnpm install --frozen-lockfile")
        (js/process.exit 2))

      (let [removed (second (scrubbed-env nil))]
        (when (seq removed)
          (println (str "Scrubbing " (count removed) " provider variable(s) so gates see CI's empty environment:"))
          (println "  " (str/join " " removed))
          (println "  (names only — no values are read or printed)\n")))

      (println (str "Running " (count chosen) " gate(s). Each dot is a step.\n"))
      (let [started (js/Date.now)
            results (doall (for [g chosen]
                             (do (js/process.stdout.write (str "  " (pad (:name g) 20) " ")) (flush)
                                 (let [r (run-gate g root)]
                                   (println (case (:status r)
                                              :passed "  PASS"
                                              :failed "  FAIL"
                                              :skipped (str "  SKIP — " (:reason r))))
                                   r))))
            failed (filter #(= :failed (:status %)) results)
            skipped (filter #(= :skipped (:status %)) results)
            total-s (quot (- (js/Date.now) started) 1000)]

        (println (str "\n" total-s "s — "
                      (count (filter #(= :passed (:status %)) results)) " passed, "
                      (count failed) " failed, " (count skipped) " skipped"))

        (doseq [r failed]
          (println (str "\n─── " (-> r :gate :name) " failed ───"))
          (println "  mirrors CI check:" (-> r :gate :check))
          (println "  command:" (-> r :failed-step :cmd))
          (println "  reason: " (-> r :failed-step :fail))
          (println "  ---- last 40 lines ----")
          (doseq [l (take-last 40 (str/split-lines (-> r :failed-step :output)))]
            (println "  " l)))

        (when (seq skipped)
          (println "\nSkipped gates were NOT verified — do not read them as green."))

        ;; Exit codes: 1 a gate failed, 3 nothing failed but something went
        ;; unverified. A run where the only selected gate was skipped must not
        ;; exit 0 — "green" has to mean verified, or the tool is worthless
        ;; exactly when it matters.
        (js/process.exit (cond (seq failed) 1
                               (seq skipped) 3
                               :else 0))))))

(apply -main (vec (drop 3 (.-argv js/process))))
