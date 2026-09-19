(ns workflows-test
  (:require [cljs.test :refer [deftest is run-tests]]
            [nbb.core :as nbb]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]
            ["node:child_process" :as cp]))

;; Load the shipped source command so this proof covers the actual projector.
;; Its default list command reads the repository registry without mutating it.
(nbb/await (nbb/load-file (path/join (path/dirname nbb/*file*) "workflows.cljs")))
(def project (resolve 'workflows/->github-actions))

(defn- emitted-step [step]
  (get-in (project {} {:contract/id "fixture"
                       :workflow/name "Fixture"
                       :workflow/jobs [{:job/id "test" :job/steps [step]}]})
          ["jobs" "test" "steps" 0]))

(defn- execute [step]
  (let [generated (emitted-step step)
        result (cp/spawnSync "bash" #js ["--noprofile" "--norc" "-e" "-o" "pipefail" "-c" (get generated "run")]
                             #js {:encoding "utf8" :timeout 5000})]
    {:status (.-status result) :output (str (.-stdout result) (.-stderr result))}))

(defn- execute-local-gate [command]
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "eta-gate-warning-"))
        source (path/resolve (path/dirname nbb/*file*) "gates.cljs")]
    (try
      (doseq [relative [".git" "node_modules" "contracts/workflows"]]
        (fs/mkdirSync (path/join directory relative) #js {:recursive true}))
      (fs/writeFileSync
       (path/join directory "contracts/workflows/.gates.edn")
       (pr-str {:gates [{:gate/id "fixture" :gate/workflow "fixture"
                         :gate/check "Fixture" :gate/paths :always
                         :gate/steps [{:step/run command :gate/no-warning true}]}]}))
      (let [result (cp/spawnSync "nbb" #js [source "--all"]
                                 #js {:cwd directory :encoding "utf8" :timeout 10000})]
        {:status (.-status result) :output (str (.-stdout result) (.-stderr result))})
      (finally (fs/rmSync directory #js {:recursive true :force true})))))

(deftest local-gate-enforces-the-same-warning-diagnostics
  (doseq [[command expected-status]
          [["printf '0 warnings\\n'" 0]
           ["printf 'Reflection warning, fixture.clj:1:1 - unresolved call\\n' >&2" 1]
           ["printf 'WARNING, compiler diagnostic\\n'" 1]
           ["printf 'warning: diagnostic\\n'" 1]
           ["printf 'Warning: diagnostic\\n'" 1]
           ["printf '[WARNING] dependency problem\\n'" 1]
           ["printf '[warning] dependency problem\\n' >&2" 1]
           ["printf 'Build completed. (1 warning, 0.1s)\\n'" 1]
           ["printf 'Build completed. (2 warnings, 0.1s)\\n'" 1]
           ["printf 'warnings: 12\\n'" 1]]]
    (let [result (execute-local-gate command)]
      (is (= expected-status (:status result)) (:output result))
      (is (.includes (:output result)
                     (if (zero? expected-status) "1 passed, 0 failed" "warning diagnostic(s)"))
          (:output result)))))

(deftest generated-gate-enforces-runtime-contracts
  (doseq [[command options expected-status]
          [["printf '0 warnings\\n0 failures, 0 errors\\n'" {:gate/no-warning true :gate/expect "0 failures, 0 errors"} 0]
           ["printf 'WARNING: compiler warning\\n'" {:gate/no-warning true} 1]
           ["printf 'WARNING: stderr warning\\n' >&2" {:gate/no-warning true} 1]
           ["printf 'Reflection warning, fixture.clj:1:1 - call cannot be resolved.\\n' >&2" {:gate/no-warning true} 1]
           ["printf 'WARNING, uppercase compiler diagnostic\\n'" {:gate/no-warning true} 1]
           ["printf 'warning: lowercase diagnostic\\n'" {:gate/no-warning true} 1]
           ["printf 'Warning: mixed-case diagnostic\\n'" {:gate/no-warning true} 1]
           ["printf '[WARNING] dependency problem\\n'" {:gate/no-warning true} 1]
           ["printf '[warning] dependency problem\\n' >&2" {:gate/no-warning true} 1]
           ["printf 'Build completed. (1 warning, 0.1s)\\n'" {:gate/no-warning true} 1]
           ["printf 'Build completed. (2 warnings, 0.1s)\\n'" {:gate/no-warning true} 1]
           ["printf 'warnings: 12\\n'" {:gate/no-warning true} 1]
           ["printf 'unrelated output\\n'" {:gate/expect "0 failures, 0 errors"} 1]
           ["printf '0 failures, 0 errors\\n'; exit 7" {:gate/expect "0 failures, 0 errors"} 7]
           ["false | cat\nprintf 'should not run\\n'" {:gate/no-warning true} 1]
           ["printf \"it's ready\\n\"" {:gate/expect "it's ready"} 0]]]
    (is (= expected-status (:status (execute (assoc options :step/run command)))) command)))

(deftest ordinary-steps-and-step-context-are-preserved
  (is (= "echo ordinary" (get (emitted-step {:step/run "echo ordinary"}) "run")))
  (let [step (emitted-step {:step/run "echo clean" :gate/no-warning true
                           :step/working-directory "packages/clio" :step/env {:FIXTURE "value"}
                           :step/if "always()" :step/id "gate"})]
    (is (= "bash" (get step "shell")))
    (is (= "packages/clio" (get step "working-directory")))
    (is (= {"FIXTURE" "value"} (get step "env")))
    (is (= "always()" (get step "if")))
    (is (= "gate" (get step "id")))))

(deftest delimiter-cannot-end-the-generated-command-early
  (let [result (execute {:step/run "cat <<'TEXT'\nETA_MU_GATE_COMMAND\nTEXT\nexit 9"
                         :gate/no-warning true})]
    (is (= 9 (:status result)))
    (is (= "ETA_MU_GATE_COMMAND\n" (:output result)))))

(defn- shipped-rheos-workflow []
  (let [root ((resolve 'workflows/repo-root))
        registry ((resolve 'workflows/load-registry) root)
        workflow (first (filter #(= "rheos" (:contract/id %))
                                ((resolve 'workflows/load-workflows) root)))]
    {:registry registry
     :workflow ((resolve 'workflows/expand-workflow) registry workflow)}))

(def ^:private protocol-commands
  ["pnpm --dir packages/protocols test"
   "pnpm --dir packages/protocols lint"
   "pnpm --dir packages/protocols test:types"])

(deftest protocols-have-enforced-hosted-and-local-package-gates
  (let [{:keys [registry workflow]} (shipped-rheos-workflow)
        steps (get-in workflow [:workflow/jobs 0 :job/steps])
        hosted (get-in (project registry workflow) ["jobs" "test" "steps"])
        gate (first ((resolve 'workflows/->local-gates) [workflow]))]
    (doseq [command protocol-commands]
      (let [step (first (filter #(= command (:step/run %)) steps))
            local (first (filter #(= command (:step/run %)) (:gate/steps gate)))
            projected (first (filter #(= (:step/name step) (get % "name")) hosted))]
        (is (map? step) (str "Missing hosted package gate: " command))
        (is (true? (:gate/no-warning step)) command)
        (is (true? (:gate/no-warning local)) (str "Missing enforced local gate: " command))
        (is (= "bash" (get projected "shell")) command)
        (when (= command (first protocol-commands))
          (is (= "0 failures, 0 errors" (:gate/expect step)))
          (is (= (:gate/expect step) (:gate/expect local))))))
    (is (some #(= "pnpm --dir packages/eta-mu test:workflows" (:step/run %)) steps))
    (doseq [event [:push :pull-request]
            changed-path ["packages/protocols/**" "packages/clio/**"
                          "packages/eta-mu/commands/workflows_test.cljs"]]
      (is (some #{changed-path}
                (:on/paths (first (filter #(= event (:on/event %)) (:workflow/triggers workflow)))))
          (str event " must select the package dependency or gate regression: " changed-path)))
    (doseq [prefix ["packages/protocols/" "packages/clio/"
                    "packages/eta-mu/commands/workflows_test.cljs"]]
      (is (some #{prefix} (:gate/paths gate)) (str "Local gate must select " prefix)))))

(deftest shipped-protocol-gates-refuse-false-green-processes
  (let [{:keys [workflow]} (shipped-rheos-workflow)
        steps (get-in workflow [:workflow/jobs 0 :job/steps])]
    (doseq [command protocol-commands]
      (when-let [step (first (filter #(= command (:step/run %)) steps))]
        (doseq [[output exit-code expected]
                [["0 warnings\\n0 failures, 0 errors\\n" 0 0]
                 ["WARNING: fixture diagnostic\\n0 failures, 0 errors\\n" 0 1]
                 ["0 warnings\\n0 failures, 0 errors\\n" 23 23]]]
          (let [result (execute (assoc step :step/run
                                      (str "printf '" output "'; exit " exit-code)))]
            (is (= expected (:status result)) (str command ": " (:output result)))))
        (when (= command (first protocol-commands))
          (is (= 1 (:status (execute (assoc step :step/run "printf 'compiler exited successfully\\n'"))))
              "The protocol test gate must require actual zero-failure assertions"))))))

(let [result (run-tests 'workflows-test)]
  (when (pos? (+ (:fail result) (:error result)))
    (set! (.-exitCode js/process) 1)))
