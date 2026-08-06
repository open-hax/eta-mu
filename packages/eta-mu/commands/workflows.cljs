;; Project workflow resources onto their targets.
;;
;; Runs under the nbb bundled with eta-mu at a pinned version, resolved from the
;; package's node_modules rather than from PATH. A tool that ships everywhere
;; must not inherit whatever interpreter the machine happens to have.
;;
;; Reads katamorph workflow resources from contracts/workflows/ and emits:
;;
;;   :github-actions -> .github/workflows/<id>.yml
;;   :local-gates    -> contracts/workflows/.gates.edn   (read by ci-gates.bb)
;;
;; One declaration, two projections. Before this, the gate runner mirrored the
;; workflows by hand and needed an `--audit` subcommand purely to detect drift
;; between them — drift it found on its first run.
;;
;; Following muse's target discipline: produce a validated host artifact or an
;; explicit incompatibility. Never silently drop a semantic.
;;
;;   scripts/workflows.bb list
;;   scripts/workflows.bb show <id>
;;   scripts/workflows.bb emit [--target github-actions|local-gates|all] [--dry-run]
;;   scripts/workflows.bb check          # generated == committed?

(ns eta-mu.commands.workflows
  (:require ["yaml" :as yaml]
            ["node:fs" :as fs]
            ["node:path" :as path]
            ["node:child_process" :as cp]
            [clojure.edn :as edn]
            [clojure.string :as str]
            [cljs.pprint :as pp]))

(def contracts-dir "contracts/workflows")
(def workflows-dir ".github/workflows")
(def gate-plan-path (str contracts-dir "/.gates.edn"))

(defn- die! [& msg]
  (println (str/join " " msg))
  (js/process.exit 2))

(defn- pad
  "Left-justify `s` to `n` columns. nbb has no `format`, and the alignment here
   is the whole point of the listing output."
  [s n]
  (let [s (str s)]
    (str s (apply str (repeat (max 0 (- n (count s))) " ")))))

(defn- exists? [p] (fs/existsSync p))
(defn- read-text [p] (fs/readFileSync p "utf8"))
(defn- write-text! [p s] (fs/writeFileSync p s "utf8"))

(defn repo-root
  "Nearest ancestor holding a .git entry. Walked rather than shelled out to git:
   this runs on every invocation and a subprocess for a directory test is a tax."
  []
  (loop [dir (path/resolve (js/process.cwd))]
    (cond
      (exists? (path/join dir ".git")) dir
      (= dir (path/dirname dir)) (die! "not inside a git repository")
      :else (recur (path/dirname dir)))))

;; ── Loading ─────────────────────────────────────────────────────────────────

(defn- read-edn [f]
  (try (edn/read-string (read-text f))
       (catch :default e (die! (str "cannot read " f ": " (.-message e))))))

(defn load-registry [root]
  (let [f (path/join root contracts-dir "resources.edn")]
    (when-not (exists? f)
      ;; This tool ships with eta-mu and runs in every project, so "no resources
      ;; here" is an ordinary situation, not a crash. Say what is missing and
      ;; what it would contain.
      (println (str "No workflow resources in " (path/join root contracts-dir) "\n"))
      (println "This project declares no workflows. To start one:")
      (println "  mkdir -p" contracts-dir)
      (println "  # resources.edn  — the action registry: one pin per action")
      (println "  # ci.edn         — {:namespace :your.ci :resources [{:contract/kind :workflow ...}]}")
      (println "\neta-mu carries the projector; the project supplies the resources.")
      (js/process.exit 0))
    (read-edn f)))

(defn load-workflows [root]
  (let [dir (path/join root contracts-dir)
        names (->> (if (exists? dir) (vec (fs/readdirSync dir)) [])
                   (filter #(and (str/ends-with? % ".edn")
                                 (not= "resources.edn" %)
                                 (not (str/starts-with? % "."))))
                   sort)]
    (vec (mapcat (fn [n]
                   (let [{:keys [resources]} (read-edn (path/join dir n))]
                     (map #(assoc % ::source n)
                          (filter #(= :workflow (:contract/kind %)) resources))))
                 names))))

;; ── Step expansion ──────────────────────────────────────────────────────────

(defn expand-steps
  "Resolve `:step/use` toolchain references into their step sequences, and check
   every `:step/action` against the registry.

   An action outside the registry is refused rather than passed through. That
   refusal is the whole mechanism: it is what makes one action carrying five
   different pins unrepresentable instead of merely discouraged."
  [registry wf job]
  (let [{:keys [actions toolchains]} registry]
    (vec
     (mapcat
      (fn [step]
        (let [steps (if-let [t (:step/use step)]
                      (or (get toolchains t)
                          (die! (str "unknown toolchain " t
                                     " in workflow " (:contract/id wf)
                                     " job " (:job/id job)
                                     "\n  known: " (str/join ", " (sort (keys toolchains))))))
                      [step])
              ;; a :step/use may carry gate flags that apply to its expansion
              carry (select-keys step [:step/gate :gate/expect :gate/no-warning])]
          (map (fn [s]
                 (when-let [a (:step/action s)]
                   (when-not (contains? actions a)
                     (die! (str "action " a " is not in the resource registry"
                                " (workflow " (:contract/id wf) ")"
                                "\n  known: " (str/join ", " (sort (keys actions)))))))
                 (merge s (when (seq carry) carry)))
               steps)))
      (:job/steps job)))))

(defn expand-workflow [registry wf]
  (update wf :workflow/jobs
          (fn [jobs]
            (mapv #(assoc % :job/steps (expand-steps registry wf %)) jobs))))

;; ── Referential checks a schema cannot make ─────────────────────────────────

(defn check-references!
  "Katamorph validates the shape. These are the cross-references it cannot see:
   duplicate ids, and `:job/needs` pointing at a job that does not exist."
  [workflows]
  (let [ids (map :contract/id workflows)
        dupes (->> ids frequencies (filter #(> (val %) 1)) (map key))]
    (when (seq dupes)
      (die! (str "duplicate workflow ids: " (str/join ", " dupes))))
    (doseq [wf workflows]
      (let [job-ids (set (map :job/id (:workflow/jobs wf)))]
        (doseq [j (:workflow/jobs wf)
                n (:job/needs j)]
          (when-not (job-ids n)
            (die! (str "workflow " (:contract/id wf) " job " (:job/id j)
                       " needs unknown job " n))))))))

;; ── Target: GitHub Actions ──────────────────────────────────────────────────

(def ^:private event->gh
  {:push "push" :pull-request "pull_request" :schedule "schedule"
   :workflow-dispatch "workflow_dispatch" :workflow-call "workflow_call"
   :release "release" :issues "issues"})

(defn- gh-trigger [t]
  (let [ev (or (event->gh (:on/event t))
               (when (:on/cron t) "schedule")
               (die! (str "no GitHub event for trigger " (pr-str t))))
        body (cond-> {}
               (:on/branches t) (assoc "branches" (vec (:on/branches t)))
               (:on/paths t) (assoc "paths" (vec (:on/paths t)))
               (:on/types t) (assoc "types" (mapv name (:on/types t)))
               (:on/cron t) (constantly nil))]
    [ev (if (:on/cron t) [{"cron" (:on/cron t)}] body)]))

(defn- gh-perms [m]
  (into {} (map (fn [[k v]] [(name k) (name v)]) m)))

(defn- gh-step [registry s]
  (cond-> {}
    (:step/name s) (assoc "name" (:step/name s))
    (:step/id s) (assoc "id" (:step/id s))
    (:step/if s) (assoc "if" (:step/if s))
    (:step/action s) (assoc "uses" (get-in registry [:actions (:step/action s) :action/uses]))
    (:step/with s) (assoc "with" (into {} (map (fn [[k v]] [(name k) v]) (:step/with s))))
    (:step/run s) (assoc "run" (:step/run s))
    (:step/env s) (assoc "env" (into {} (map (fn [[k v]] [(name k) v]) (:step/env s))))
    (:step/working-directory s) (assoc "working-directory" (:step/working-directory s))
    (:step/continue-on-error s) (assoc "continue-on-error" (:step/continue-on-error s))))

(defn- gh-job [registry j]
  (cond-> {}
    (:job/name j) (assoc "name" (:job/name j))
    true (assoc "runs-on" (name (:job/runner j :ubuntu-latest)))
    (:job/needs j) (assoc "needs" (vec (:job/needs j)))
    (:job/if j) (assoc "if" (:job/if j))
    (:job/matrix j) (assoc "strategy" {"matrix" (into {} (map (fn [[k v]] [(name k) (vec v)]) (:job/matrix j)))})
    (some? (:job/permissions j)) (assoc "permissions" (gh-perms (:job/permissions j)))
    (:job/timeout-minutes j) (assoc "timeout-minutes" (:job/timeout-minutes j))
    (:job/env j) (assoc "env" (into {} (map (fn [[k v]] [(name k) v]) (:job/env j))))
    true (assoc "steps" (mapv #(gh-step registry %) (:job/steps j)))))

(defn ->github-actions [registry wf]
  (let [triggers (map gh-trigger (:workflow/triggers wf))]
    (cond-> {"name" (:workflow/name wf)}
      (seq (:workflow/permissions wf)) (assoc "permissions" (gh-perms (:workflow/permissions wf)))
      true (assoc "on" (reduce (fn [m [ev body]]
                                 (if (vector? body)
                                   (update m ev (fnil into []) body)
                                   (assoc m ev body)))
                               {} triggers))
      (:workflow/concurrency wf) (assoc "concurrency" (:workflow/concurrency wf))
      true (assoc "jobs" (into {} (map (fn [j] [(:job/id j) (gh-job registry j)])
                                       (:workflow/jobs wf))))
      (get-in wf [:workflow/raw :github-actions]) (merge (get-in wf [:workflow/raw :github-actions])))))

;; ── Target: local gates ─────────────────────────────────────────────────────

(defn emitting?
  "Does this resource own its workflow file?

   A resource may declare a gate while its YAML stays hand-written — the
   half-step that lets the gate mirror die before the riskier YAML conversion
   is attempted. `:workflow/emit false` says so explicitly."
  [wf]
  (not (false? (:workflow/emit wf))))

(defn ->local-gate
  "The gate plan for one job, or nil when the job declares no `:job/gate`.

   Only steps marked `:step/gate true` run locally. A CI job does housekeeping a
   developer's machine already has — checkout, toolchain installs, artifact
   uploads — and running those locally would be noise, not verification."
  [wf j]
  (when-let [g (:job/gate j)]
    (cond-> {:gate/id (:gate/id g)
             :gate/workflow (:contract/id wf)
             :gate/job (:job/id j)
             :gate/check (:gate/check g)
             ;; `:gate/always` is how a workflow with no path filter says so —
             ;; distinct from "no paths declared yet", which would silently
             ;; stop selecting the gate.
             :gate/paths (if (:gate/always g) :always (vec (:gate/paths g)))}
      (:gate/needs-repos g) (assoc :gate/needs-repos (vec (:gate/needs-repos g)))
      true (merge)
      true (assoc :gate/steps
                  (vec (keep (fn [s]
                              (when (:step/gate s)
                                (cond-> {:step/run (:step/run s)}
                                  (:step/name s) (assoc :step/name (:step/name s))
                                  (:gate/expect s) (assoc :gate/expect (:gate/expect s))
                                  (:gate/no-warning s) (assoc :gate/no-warning true))))
                             (:job/steps j)))))))

(defn emitting?
  "Does this resource own its workflow file?

   A resource may declare a gate while its YAML stays hand-written — the
   half-step that lets the gate mirror die before the riskier YAML conversion
   is attempted. `:workflow/emit false` says so explicitly."
  [wf]
  (not (false? (:workflow/emit wf))))

(defn ->local-gates [workflows]
  (vec (for [wf workflows
             j (:workflow/jobs wf)
             :let [g (->local-gate wf j)]
             :when g]
         g)))

;; ── Emit / check ────────────────────────────────────────────────────────────

(defn- yaml-str [data]
  (str "# Generated from contracts/workflows/ by `eta-mu workflows emit` — do not edit.\n"
       "# Edit the workflow resource and re-emit.\n"
       ;; Keys are left unquoted, matching every hand-written workflow in this
       ;; repo and GitHub's own examples. Worth knowing why that is safe: under
       ;; YAML 1.1 a bare `on` is boolean true, which is why some generators
       ;; quote it. GitHub parses 1.2, where it is the string "on".
       ;; `lineWidth 0` disables wrapping — a folded `run:` command is a
       ;; different command.
       (.stringify yaml (clj->js data) #js {:lineWidth 0})))

(defn- semantic=
  "Do two YAML documents mean the same thing? Comments and key order are not
   part of the contract, so this compares parsed values, never bytes."
  [a b]
  (= (js->clj (.parse yaml a)) (js->clj (.parse yaml b))))

(defn cmd-emit [root registry workflows {:keys [target dry-run]}]
  (let [targets (if (= "all" target) #{"github-actions" "local-gates"} #{target})]
    (when (targets "github-actions")
      (doseq [wf workflows]
        (when-not (emitting? wf)
          (println (str "  " (pad (:contract/id wf) 16) " (skipped — :workflow/emit false)")))) 
      (doseq [wf (filter emitting? workflows)]
        (let [path (path/join root workflows-dir (str (:contract/id wf) ".yml"))
              text (yaml-str (->github-actions registry wf))
              existing (when (exists? path) (read-text path))
              same (and existing (semantic= existing text))]
          (println (str "  " (pad (:contract/id wf) 16) " " path
                        (cond same " (unchanged)"
                              existing " (CHANGED)"
                              :else " (new)")))
          (when-not dry-run (write-text! path text)))))
    (when (targets "local-gates")
      (let [path (path/join root gate-plan-path)
            plan {:namespace :eta-mu.ci.gates
                  :gates (->local-gates workflows)}]
        (println (str "  " (pad "local-gates" 16) " " path
                      " (" (count (:gates plan)) " gates)"))
        (when-not dry-run
          (write-text! path (str ";; Generated from contracts/workflows/ by scripts/workflows.bb.\n"
                          ";; Read by the gate runner. Do not edit.\n"
                          (with-out-str (pp/pprint plan)))))))))

(defn cmd-check [root registry workflows]
  (let [problems
        (doall
         (concat
          (for [wf (filter emitting? workflows)
                :let [path (path/join root workflows-dir (str (:contract/id wf) ".yml"))
                      text (yaml-str (->github-actions registry wf))]]
            (cond
              (not (exists? path))
              (do (println (str "  MISSING  " path " — never emitted")) :missing)
              (not (semantic= (read-text path) text))
              (do (println (str "  DRIFT    " path " — committed YAML differs from its resource")) :drift)
              :else
              (do (println (str "  ok       " (:contract/id wf))) nil)))
          ;; The gate plan is not merely present-or-absent. `eta-mu gates` reads
          ;; it as the sole definition of what runs, so a plan left stale by a
          ;; resource change means the runner silently executes obsolete
          ;; commands and path filters while `check` reports success.
          [(let [path (path/join root gate-plan-path)
                 expected (->local-gates workflows)]
             (cond
               (not (exists? path))
               (do (println "  MISSING  gate plan — run `emit`") :missing)

               (not= expected (:gates (edn/read-string (read-text path))))
               (do (println "  DRIFT    gate plan — committed plan differs from its resources")
                   :drift)

               :else
               (do (println (str "  ok       gate plan (" (count expected) " gates)")) nil)))]))
        bad (remove nil? problems)]
    (println)
    (println "YAML is compared semantically (parsed), not byte-for-byte — comments")
    (println "and key order are not part of the contract. The gate plan is compared as")
    (println "an EDN value, since it is generated whole and has no hand-written parts.")
    (when (seq bad)
      (println (str "\n" (count bad) " workflow(s) differ from their resource. Run `emit`.")))
    (js/process.exit (if (seq bad) 1 0))))

;; ── Main ────────────────────────────────────────────────────────────────────

(defn -main [& args]
  (let [args (vec args)
        cmd (or (first args) "list")
        opt (fn [k d] (or (second (drop-while #(not= % k) args)) d))
        flag? #(some #{%} args)
        root (repo-root)
        registry (load-registry root)
        workflows (load-workflows root)
        expanded (mapv #(expand-workflow registry %) workflows)]
    (check-references! expanded)
    (case cmd
      "list"
      (do (println (str (count expanded) " workflow resource(s) in " contracts-dir "\n"))
          (doseq [wf expanded]
            (println (str "  " (pad (:contract/id wf) 16)
                          " " (pad (:workflow/name wf) 28)
                          " " (count (:workflow/jobs wf)) " job(s), "
                          (count (filter :job/gate (:workflow/jobs wf))) " gate(s)  ["
                          (::source wf) "]"))))

      "show"
      (if-let [wf (first (filter #(= (second args) (:contract/id %)) expanded))]
        (pp/pprint (dissoc wf ::source))
        (die! (str "unknown workflow: " (second args)
                   "\n  known: " (str/join ", " (map :contract/id expanded)))))

      "emit"
      (do (println "Emitting workflow projections.\n")
          (cmd-emit root registry expanded
                    {:target (opt "--target" "all") :dry-run (flag? "--dry-run")})
          (println "\nGenerated files are committed — GitHub reads .github/workflows from the")
          (println "repo. `check` asserts they still match their resource."))

      "check" (cmd-check root registry expanded)

      (die! (str "unknown command: " cmd "\n  known: list, show, emit, check")))))

(apply -main (vec (drop 3 (.-argv js/process))))
