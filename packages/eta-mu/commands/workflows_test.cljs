(ns workflows-test
  (:require [cljs.test :refer [deftest is run-tests testing]]
            [clojure.string :as str]
            [nbb.core :as nbb]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]
            ["node:child_process" :as cp]
            ["yaml" :as yaml]))

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


;; These are candidate TEST carriers. Trusted/event-only publication workflows
;; have different authorities and are deliberately outside this finite family.
(def ^:private candidate-carriers
  {"rheos" ["pnpm --dir packages/protocols test"
             "pnpm --dir packages/protocols lint"
             "pnpm --dir packages/protocols test:types"
             "pnpm --dir packages/rheos test"
             "pnpm --dir packages/rheos lint:kondo"
             "pnpm --dir packages/rheos build"]
   "rheos-github-sync-ci" ["pnpm --dir packages/rheos test"
                            "pnpm --dir packages/rheos build"
                            "Generate canonical eta-mu board snapshot"
                            "Validate canonical status aliases and UUIDs"
                            "Record Rheos drift history"
                            "Dry-run Rheos GitHub Issue projection"
                            "--dry-run true" "- Applied operations: 0"]
   "sol-ci" ["pnpm --dir packages/sol lint"
              "node --test .github/scripts/package-warning-gates.test.mjs"
              "pnpm --dir packages/sol test" "pnpm --dir packages/sol build"]
   "sandbox-bundle" ["pnpm install --frozen-lockfile"
                      "pnpm --dir packages/extensions build"
                      "pnpm lint" "pnpm test" "pnpm build"
                      "Collect generated outputs and portable toolchains"
                      "steps.validate.outcome == 'failure'"]})

(def ^:private workflow-regression "packages/eta-mu/commands/workflows_test.cljs")
(def ^:private workflow-command "pnpm --dir packages/eta-mu test:workflows")

(defn- committed-workflow [slug]
  (let [root ((resolve 'workflows/repo-root))
        source (fs/readFileSync (path/join root ".github/workflows" (str slug ".yml")) "utf8")]
    {:source source :config (js->clj (.parse yaml source))}))

(defn- workflow-steps [config]
  (mapcat #(get % "steps") (vals (get config "jobs"))))

(defn- strings-in [value]
  (filter string? (tree-seq coll? seq value)))

(defn- secret-reference? [expression]
  ;; GitHub expression strings use single quotes with doubled-quote escaping.
  ;; Literal mentions do not access the secrets context.
  (boolean (re-find #"(?i)\bsecrets\b"
                    (str/replace expression #"'(?:''|[^'])*'" " "))))

(defn- interpolated-secret-reference? [source]
  ;; Consume complete quoted strings before looking for the closing delimiter;
  ;; braces inside format/fromJSON literals cannot terminate the expression.
  (some (comp secret-reference? second)
        (re-seq #"\$\{\{((?:'(?:''|[^'])*'|[^'])*?)\}\}" source)))

(defn- candidate-violations [config]
  (let [steps (workflow-steps config)
        configurations (cons config (vals (get config "jobs")))]
    (concat
     (for [value (tree-seq coll? seq config)
           :when (and (map? value) (some #(= "secrets" (str/lower-case (str %))) (keys value)))]
       [:secret-mapping])
     (for [value (strings-in config)
           :when (or (interpolated-secret-reference? value)
                     (re-find #"create-github-app-token|eta_mu_app_|dependency_token|private-git-mirrors|authorization: basic|extraheader|insteadof" (str/lower-case value)))]
       [:privileged-input value])
     ;; Job/step `if` values are expressions even without ${{ }} delimiters.
     (for [value (tree-seq coll? seq config) :when (map? value)
           [field expression] value
           :when (and (= "if" (str/lower-case (str field)))
                      (string? expression) (secret-reference? expression))]
       [:privileged-condition expression])
     (for [configuration configurations
           [scope permission] (get configuration "permissions")
           :when (not= "read" permission)]
       [:write-permission scope permission])
     (for [step steps
           :when (str/starts-with? (get step "uses" "") "actions/checkout@")
           :when (not= false (get-in step ["with" "persist-credentials"]))]
       [:persisted-checkout (get step "uses")]))))

(deftest candidate-test-carriers-have-no-signing-custody-on-any-event
  (doseq [[slug preserved] candidate-carriers]
    (let [{:keys [source config]} (committed-workflow slug)]
      (is (empty? (candidate-violations config))
          (str slug ": " (pr-str (candidate-violations config))))
      (is (= "read" (get-in config ["permissions" "contents"])) slug)
      (is (some #(str/includes? (get % "run" "") workflow-command)
                (workflow-steps config))
          (str slug " must run this registered owner"))
      (let [trigger (get-in config ["on" "pull_request"])
            paths (get trigger "paths")]
        (is (or (nil? paths)
                (some #{workflow-regression "packages/eta-mu/**"} paths))
            (str slug " must run when its regression owner changes")))
      (doseq [fragment preserved]
        (is (str/includes? source fragment) (str slug " lost existing contract: " fragment)))))
  (testing "same-repository PRs cannot gain custody via a conditional step"
    (let [{:keys [config]} (committed-workflow "rheos")
          injected (assoc-in config ["jobs" "test" "steps" 0 "env" "PRIVATE_KEY"]
                             "${{ secrets.ETA_MU_APP_PRIVATE_KEY }}")]
      (is (seq (candidate-violations injected))))
    (doseq [reference ["${{ secrets['ETA_MU_APP_PRIVATE_KEY'] }}"
                       "${{ secrets[\"ETA_MU_APP_PRIVATE_KEY\"] }}"
                       "${{ toJSON(secrets) }}"]]
      (let [{:keys [config]} (committed-workflow "rheos")]
        (is (seq (candidate-violations
                  (assoc-in config ["jobs" "test" "steps" 0 "env" "PRIVATE_KEY"] reference))))))
    (let [{:keys [config]} (committed-workflow "rheos")]
      (is (seq (candidate-violations (assoc-in config ["jobs" "test" "secrets"] "inherit"))))))
  (testing "read-only defaults cannot conceal a job override or persisted checkout"
    (let [{:keys [config]} (committed-workflow "rheos")]
      (is (seq (candidate-violations
                (assoc-in config ["jobs" "test" "permissions" "contents"] "write"))))
      (is (seq (candidate-violations
                (assoc-in config ["jobs" "test" "steps" 0 "with" "persist-credentials"] true)))))))


(deftest candidate-expression-scanner-refuses-real-secret-access-with-quoted-braces
  (let [{:keys [config]} (committed-workflow "rheos")]
    ;; Both native examples are executable expression contexts. The format
    ;; placeholder closes a brace before secrets, despite the review prose.
    (doseq [expression ["${{ format('{0}', secrets.X) }}"
                        "${{ fromJSON('{}') && secrets.X }}"
                        "${{ format('}}', secrets['X']) }}"
                        "${{ format('a''}b', secrets[format('{0}', 'X')]) }}"
                        "${{ format('{0}', toJSON(secrets)) }}"
                        "${{ format('{0}', SeCrEtS.X) }}"]]
      (is (seq (candidate-violations
                (assoc-in config ["jobs" "test" "steps" 0 "env" "SIGNER"] expression))) expression))
    (doseq [condition ["secrets.X != ''" "secrets['X'] != ''"
                       "contains(toJSON(secrets), 'x')"
                       "format('{0}', secrets.X) != ''"]]
      (is (seq (candidate-violations
                (assoc-in config ["jobs" "test" "steps" 0 "if"] condition))) condition))
    (doseq [ordinary ["Discuss secrets.X in documentation."
                      "printf '%s\\n' 'secrets are absent'"
                      "${{ 'secrets.X' }}"
                      "${{ format('{0}', 'literal secrets.X') }}"
                      "${{ format('}}', 'literal secrets.X') }}"]]
      (is (empty? (candidate-violations
                   (assoc-in config ["jobs" "test" "steps" 0 "name"] ordinary))) ordinary))
    (is (empty? (candidate-violations
                 (assoc-in config ["jobs" "test" "steps" 0 "if"] "contains('secrets.X', 'X')"))))))

(def ^:private signer-canary "INERT_SIGNER_CANARY_ci_workflow_test_ONLY")
(def ^:private token-canary "INERT_TOKEN_CANARY_ci_workflow_test_ONLY")

(defn- fixture-secret-value [value same-repository? outputs]
  (if-not (string? value)
    value
    (-> value
        (str/replace
         #"\$\{\{\s*secrets(?:\.([A-Za-z0-9_]+)|\[['\"]([A-Za-z0-9_]+)['\"]\])\s*\}\}"
         (fn [[_ dot-key bracket-key]]
           (if same-repository?
             (get {"ETA_MU_APP_ID" "inert-parent-app-id"
                   "ETA_MU_APP_PRIVATE_KEY" signer-canary} (or dot-key bracket-key) "")
             "")))
        (str/replace "${{ steps.dependency-credentials.outputs.available }}"
                     (get outputs "available" "false"))
        (str/replace "${{ steps.dependency-token.outputs.token }}"
                     (get outputs "token" "")))))

(defn- contains-canary? [value]
  (some #(str/includes? (str value) %) [signer-canary token-canary]))

(defn- retained-fixture-output [directory]
  ;; Fixture executables are inputs, never retained workflow output. Read only
  ;; files the actual extracted steps produced (including logs and step outputs).
  (letfn [(read-directory [dir]
            (mapcat (fn [name]
                      (let [file (path/join dir name)]
                        (if (.isDirectory (fs/statSync file))
                          (when-not (= file (path/join directory "bin"))
                            (read-directory file))
                          [(fs/readFileSync file "utf8")])))
                    (js->clj (fs/readdirSync dir))))]
    (str/join "\n" (read-directory directory))))

(defn- execute-candidate-hooks [config failure-command same-repository?]
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "eta-candidate-hooks-"))
        bin (path/join directory "bin")
        calls (path/join directory "calls")
        git-calls (path/join directory "git-calls")
        transports (path/join directory "transports")
        key-exposures (path/join directory "key-exposures")
        output-file (path/join directory "outputs")
        steps (filter #(or (some (fn [line] (re-find #"^\s*pnpm (?:install|--dir|lint|test|build)(?:\s|$)" line))
                                 (str/split-lines (get % "run" "")))
                           (re-find #"credentials|Git dependency|Git authorization|Mirror private"
                                    (get % "name" ""))
                           (re-find #"create-github-app-token" (get % "uses" ""))
                           (re-find #"\bgh api |\bcurl[^\n]*(?:-X|--request) (?:POST|PUT|PATCH|DELETE)" (get % "run" "")))
                      (workflow-steps config))]
    (try
      (fs/mkdirSync bin)
      (fs/mkdirSync (path/join directory "sandbox-export/logs") #js {:recursive true})
      (fs/writeFileSync
       (path/join bin "pnpm")
       (str "#!/bin/sh\nset -eu\nprintf '%s\\n' \"$*\" >> \"$CI_CALLS\"\n"
            "if env | grep -Fq '" signer-canary "'; then printf exposed >> \"$CI_KEY_EXPOSURES\"; exit 89; fi\n"
            "if env | grep -Fq '" token-canary "'; then printf exposed >> \"$CI_KEY_EXPOSURES\"; exit 89; fi\n"
            "if [ \"$*\" = \"$CI_FAIL_COMMAND\" ]; then printf '%s\\n' 'dependency resolution refused' >&2; exit 23; fi\n"
            "printf '%s\\n' 'Ran 1 tests containing 1 assertions.' '0 failures, 0 errors' '0 warnings'\n")
       #js {:mode 493})
      (fs/writeFileSync
       (path/join bin "git")
       "#!/bin/sh\nprintf '%s\\n' \"$*\" >> \"$CI_GIT_CALLS\"\nexit 87\n"
       #js {:mode 493})
      (fs/writeFileSync (path/join bin "sleep") "#!/bin/sh\nexit 0\n" #js {:mode 493})
      (doseq [command ["gh" "curl"]]
        (fs/writeFileSync (path/join bin command)
                          (str "#!/bin/sh\nprintf '%s\\n' '" command "' >> \"$CI_TRANSPORTS\"\nexit 88\n")
                          #js {:mode 493}))
      (loop [remaining steps outputs {} status 0 output "" env-exposures [] token-attempts 0]
        (if (or (empty? remaining) (not= 0 status))
          {:status status :output output
           :calls (if (fs/existsSync calls) (str/split-lines (fs/readFileSync calls "utf8")) [])
           :git-calls (if (fs/existsSync git-calls) (fs/readFileSync git-calls "utf8") "")
           :transport-calls (if (fs/existsSync transports) (str/split-lines (fs/readFileSync transports "utf8")) [])
           :token-attempts token-attempts :env-exposures env-exposures
           :pnpm-key-exposure? (fs/existsSync key-exposures)
           :leaked? (boolean (contains-canary? (str output (retained-fixture-output directory))))}
          (let [step (first remaining)
                condition (get step "if")
                skipped? (or (and (= condition "steps.dependency-credentials.outputs.available == 'true'")
                                  (not= "true" (get outputs "available")))
                             (and (= condition "steps.dependency-token.outputs.token != ''")
                                  (str/blank? (get outputs "token" ""))))]
            (cond
              skipped? (recur (rest remaining) outputs status output env-exposures token-attempts)
              (re-find #"create-github-app-token" (get step "uses" ""))
              ;; A transport double records selection and returns only an inert
              ;; synthetic token. No real action or network request is run.
              (recur (rest remaining) (assoc outputs "token" token-canary)
                     status output env-exposures (inc token-attempts))
              :else
              (let [configured-env (merge (get config "env")
                                          (get-in config ["jobs" (first (keys (get config "jobs"))) "env"])
                                          (get step "env"))
                    step-env (into {} (map (fn [[k v]] [k (fixture-secret-value v same-repository? outputs)])
                                           configured-env))
                    env (merge {"PATH" (str bin ":/usr/bin:/bin")
                                "RUNNER_TEMP" directory "GITHUB_WORKSPACE" directory
                                "GITHUB_OUTPUT" output-file "CI_CALLS" calls
                                "CI_GIT_CALLS" git-calls "CI_TRANSPORTS" transports
                                "CI_KEY_EXPOSURES" key-exposures
                                "CI_FAIL_COMMAND" (or failure-command "")}
                               step-env)
                    script (fixture-secret-value (get step "run" "") same-repository? outputs)
                    result (cp/spawnSync "bash" #js ["--noprofile" "--norc" "-e" "-o" "pipefail" "-c" script]
                                         #js {:cwd directory :encoding "utf8" :timeout 10000 :env (clj->js env)})
                    next-outputs (if (fs/existsSync output-file)
                                   (into outputs (keep (fn [line]
                                                         (when-let [[_ k v] (re-matches #"([^=]+)=(.*)" line)] [k v]))
                                                       (str/split-lines (fs/readFileSync output-file "utf8"))))
                                   outputs)]
                (recur (rest remaining) next-outputs (.-status result)
                       (str output (.-stdout result) (.-stderr result))
                       (into env-exposures (for [[k v] step-env :when (contains-canary? v)]
                                             [(get step "name") k]))
                       token-attempts))))))
      (finally (fs/rmSync directory #js {:recursive true :force true})))))

(defn- isolated-hook-result? [result]
  (and (= 0 (:status result)) (empty? (:env-exposures result))
       (not (:pnpm-key-exposure? result)) (not (:leaked? result))
       (zero? (:token-attempts result)) (empty? (:transport-calls result))
       (empty? (:git-calls result))))

(deftest actual-candidate-package-hooks-run-without-app-keys-and-keep-failures
  (doseq [slug (keys candidate-carriers)
          same-repository? [false true]]
    (let [{:keys [config]} (committed-workflow slug)
          result (execute-candidate-hooks config nil same-repository?)
          failure (execute-candidate-hooks config "install --frozen-lockfile" same-repository?)]
      (is (isolated-hook-result? result) (str slug " same-repository=" same-repository? ": " (pr-str result)))
      (is (some #{"--dir packages/eta-mu test:workflows"} (:calls result)) slug)
      (is (= 23 (:status failure)) (str slug " concealed package failure: " (:output failure)))
      (is (not-any? #{"--dir packages/rheos build" "--dir packages/sol build" "build"}
                   (:calls failure))
          (str slug " ran build after failed installation")))))

(deftest synthetic-hook-controls-detect-env-log-and-transport-exposure
  ;; These mutations operate on the actual carrier's parsed steps in memory.
  ;; They falsify this bounded simulator, not arbitrary exfiltration prevention.
  (let [{:keys [config]} (committed-workflow "rheos")
        injected (assoc-in config ["jobs" "test" "steps"]
                           [{"name" "Injected package hook"
                             "env" {"SYNTHETIC_SIGNER" "${{ secrets['ETA_MU_APP_PRIVATE_KEY'] }}"}
                             "run" (str "printf '%s\\n' \"$SYNTHETIC_SIGNER\"\n" workflow-command)}])
        same-repo (execute-candidate-hooks injected nil true)
        fork (execute-candidate-hooks injected nil false)]
    (is (seq (:env-exposures same-repo)))
    (is (:pnpm-key-exposure? same-repo))
    (is (:leaked? same-repo))
    (is (= 89 (:status same-repo)))
    (is (not (isolated-hook-result? same-repo)))
    (is (isolated-hook-result? fork)))
  (let [{:keys [config]} (committed-workflow "rheos")]
    (doseq [command ["git config --global forbidden value" "gh api --method POST /repos/inert/fixture/issues"]]
      (let [injected (assoc-in config ["jobs" "test" "steps"]
                               [{"name" "Injected package hook" "run" (str workflow-command "\n" command)}])
            result (execute-candidate-hooks injected nil true)]
        (is (not (isolated-hook-result? result)))
        (is (or (seq (:git-calls result)) (seq (:transport-calls result))))))
  (let [{:keys [config]} (committed-workflow "rheos")
        injected (assoc-in config ["jobs" "test" "steps"]
                           [{"uses" "actions/create-github-app-token@inert-fixture-only"}
                            {"run" workflow-command}])]
    (is (= 1 (:token-attempts (execute-candidate-hooks injected nil true)))))))


(deftest actual-artifact-checksum-shell-preserves-bytes-and-refuses-tampering
  (let [{:keys [config]} (committed-workflow "sandbox-bundle")
        steps (workflow-steps config)]
    (doseq [[name variable] [["Collect generated outputs and portable toolchains" "OUT"]
                            ["Package optional dependency cache" "DEPS_OUT"]]]
      (let [step (first (filter #(= name (get % "name")) steps))
            source (get step "run" "")
            start (str/last-index-of source "\n(")
            command (when start (subs source (inc start)))
            directory (fs/mkdtempSync (path/join (os/tmpdir) "eta-checksum-integrity-"))
            artifact (path/join directory "artifact")
            reference (str "(cd \"$" variable "\" && find . -type f ! -name SHA256SUMS -print0 | sort -z | xargs -0 sha256sum > SHA256SUMS)")
            env {"PATH" "/usr/bin:/bin" "LC_ALL" "C" "RUNNER_TEMP" directory
                 "OUT" artifact "DEPS_OUT" artifact}
            execute-command (fn [body]
                              (cp/spawnSync "bash" #js ["--noprofile" "--norc" "-e" "-o" "pipefail" "-c" body]
                                            #js {:cwd artifact :encoding "utf8" :env (clj->js env) :timeout 5000}))]
        (try
          (is (some? command) (str "Missing actual checksum shell: " name))
          (fs/mkdirSync (path/join artifact "nested") #js {:recursive true})
          (fs/writeFileSync (path/join artifact "space name.bin") (js/Uint8Array. #js [0 255 13 10 128]))
          (fs/writeFileSync (path/join artifact "line\nbreak.txt") "line content\n")
          (fs/writeFileSync (path/join artifact "nested/alpha.txt") "nested content\n")
          (fs/writeFileSync (path/join artifact ".dot") "hidden content\n")
          (doseq [file ["SHA256SUMS" "nested/SHA256SUMS"]]
            (fs/writeFileSync (path/join artifact file) "stale manifest must be excluded\n"))
          (when command
            (let [actual (execute-command command)
                  manifest (fs/readFileSync (path/join artifact "SHA256SUMS") "utf8")
                  prior (execute-command reference)
                  prior-manifest (fs/readFileSync (path/join artifact "SHA256SUMS") "utf8")
                  clean (execute-command "sha256sum --check --strict SHA256SUMS")]
              (is (= 0 (.-status actual)) (str name ": " (.-stderr actual)))
              (is (= 0 (.-status prior)) (.-stderr prior))
              (is (= prior-manifest manifest) (str name " changed relative paths/order/exclusion/digests"))
              (is (= 0 (.-status clean)) (.-stderr clean))
              (is (= ["artifact"] (js->clj (fs/readdirSync directory)))
                  "Checksum input temporaries must be outside the artifact and removed")
              (fs/appendFileSync (path/join artifact "space name.bin") "tampered")
              (let [tampered (execute-command "sha256sum --check --strict SHA256SUMS")]
                (is (= 1 (.-status tampered)) "Actual sha256sum must reject changed binary bytes")
                (println name "checksum proof: clean" (.-status clean) "tampered" (.-status tampered)))))
          (finally (fs/rmSync directory #js {:recursive true :force true})))))))

(let [result (run-tests 'workflows-test)]
  (when (pos? (+ (:fail result) (:error result)))
    (set! (.-exitCode js/process) 1)))
