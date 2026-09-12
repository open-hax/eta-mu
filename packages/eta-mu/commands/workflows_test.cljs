(ns workflows-test
  (:require [cljs.test :refer [deftest is run-tests]]
            [nbb.core :as nbb]
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

(deftest generated-gate-enforces-runtime-contracts
  (doseq [[command options expected-status]
          [["printf '0 warnings\\n0 failures, 0 errors\\n'" {:gate/no-warning true :gate/expect "0 failures, 0 errors"} 0]
           ["printf 'WARNING: compiler warning\\n'" {:gate/no-warning true} 1]
           ["printf 'WARNING: stderr warning\\n' >&2" {:gate/no-warning true} 1]
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

(let [result (run-tests 'workflows-test)]
  (when (pos? (+ (:fail result) (:error result)))
    (set! (.-exitCode js/process) 1)))
