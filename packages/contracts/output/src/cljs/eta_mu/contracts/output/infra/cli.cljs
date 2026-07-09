(ns eta-mu.contracts.output.infra.cli
  "CLI gate facade for the output contract package.
   Reads arguments, dispatches to validate/generate/review modes, and emits
   JSON output. All I/O lives here or in extern/infra helpers."
  (:require [eta-mu.contracts.output.domain.repair :as repair]
            [eta-mu.contracts.output.domain.review :as review]
            [eta-mu.contracts.output.domain.validate :as validate]
            [eta-mu.contracts.output.extern.fs :as fs]
            [eta-mu.contracts.output.extern.path :as path]
            [eta-mu.contracts.output.infra.artifacts :as artifacts]
            [eta-mu.contracts.output.infra.generate :as gen]
            [eta-mu.contracts.output.infra.review :as gpt-review]
            [eta-mu.contracts.output.shape.edn :as edn]
            [eta-mu.contracts.output.shape.markdown :as md]))

(def usage
  "Usage:
  output-contract-gate --contract <path/to/contract.edn> --response <path/to/response.md>
  output-contract-gate generate --contract <path/to/contract.edn> (--task-file <path> | --task-text <text>)
  output-contract-gate review-stub --bundle <path/to/bundle>
  output-contract-gate review-gpt --bundle <path/to/bundle>

Flags:
  --contract   Path to an EDN contract file
  --response   Path to a Markdown response file
  --task-file  Path to a task/prompt text file for generation mode
  --task-text  Inline task/prompt text for generation mode
  --generator  fixture-valid | fixture-invalid | openai-chat (default: fixture-valid)
  --bundle     Path to a previously written artifact bundle
  --artifacts-root  Optional root for run artifacts (default: ./artifacts/output-contract-gate)
  --base-url   OpenAI-compatible base URL for generate/review mode (default: OPENAI_BASE_URL or http://127.0.0.1:8789/v1)
  --model      Model id for generate/review mode (default: gpt-5.4)
  --api-key    Explicit API credential for generate/review mode
  --temperature Numeric temperature for generate/review mode (default: 0.2 for generate, 0.3 for review)
  --max-session-turns  Max session turns for review-gpt (default: 10)
  --no-fallback  For review-gpt: fail instead of falling back to stub on error
  --no-artifacts    Disable artifact writing for this run
  --help       Show this help
")

(defn- stdout
  [text]
  (.write js/process.stdout (str text "\n")))

(defn- stderr
  [text]
  (.write js/process.stderr (str text "\n")))

(defn- cli-error
  [message]
  (ex-info message {:type :cli-usage}))

(defn- default-artifacts-root
  []
  (path/path-join (path/path-resolve ["."]) "artifacts" "output-contract-gate"))

(defn- consume-flag
  [state key tokens]
  (if (< (count tokens) 2)
    (throw (cli-error (str "Missing value for " (first tokens))))
    [(assoc state key (second tokens)) (drop 2 tokens)]))

(defn- parse-validate-args
  [tokens]
  (loop [tokens tokens
         state {:artifacts-root (default-artifacts-root)}]
    (if (empty? tokens)
      (do
        (when-not (:contract-path state)
          (throw (cli-error "Both --contract and --response are required.")))
        (when-not (:response-path state)
          (throw (cli-error "Both --contract and --response are required.")))
        (assoc state :mode :validate))
      (let [token (first tokens)]
        (case token
          "--help" (throw (cli-error usage))
          "--contract" (let [[s ts] (consume-flag state :contract-path tokens)]
                         (recur ts s))
          "--response" (let [[s ts] (consume-flag state :response-path tokens)]
                         (recur ts s))
          "--artifacts-root" (let [[s ts] (consume-flag state :artifacts-root tokens)]
                               (recur ts s))
          "--no-artifacts" (recur (rest tokens) (assoc state :artifacts-root nil))
          (throw (cli-error (str "Unknown argument: " token))))))))

(defn- parse-generate-args
  [tokens]
  (loop [tokens tokens
         state {:artifacts-root (default-artifacts-root)
                :generator "fixture-valid"
                :temperature 0.2}]
    (if (empty? tokens)
      (do
        (when-not (:contract-path state)
          (throw (cli-error "generate requires --contract <path>.")))
        (when (and (:task-path state) (:task-text state))
          (throw (cli-error "generate accepts only one of --task-file or --task-text.")))
        (when-not (or (:task-path state) (:task-text state))
          (throw (cli-error "generate requires either --task-file <path> or --task-text <text>.")))
        (assoc state :mode :generate))
      (let [token (first tokens)]
        (case token
          "--help" (throw (cli-error usage))
          "--contract" (let [[s ts] (consume-flag state :contract-path tokens)]
                         (recur ts s))
          "--task-file" (let [[s ts] (consume-flag state :task-path tokens)]
                          (recur ts (update s :task-path #(path/path-resolve [%]))))
          "--task-text" (let [[s ts] (consume-flag state :task-text tokens)]
                          (recur ts s))
          "--artifacts-root" (let [[s ts] (consume-flag state :artifacts-root tokens)]
                               (recur ts s))
          "--no-artifacts" (recur (rest tokens) (assoc state :artifacts-root nil))
          "--generator" (let [[s ts] (consume-flag state :generator tokens)]
                          (if (#{"fixture-valid" "fixture-invalid" "openai-chat"} (:generator s))
                            (recur ts s)
                            (throw (cli-error (str "Unsupported generator: " (:generator s))))))
          "--base-url" (let [[s ts] (consume-flag state :base-url tokens)]
                         (recur ts s))
          "--model" (let [[s ts] (consume-flag state :model tokens)]
                      (recur ts s))
          "--api-key" (let [[s ts] (consume-flag state :api-key tokens)]
                        (recur ts s))
          "--temperature" (let [[s ts] (consume-flag state :temperature tokens)
                                  t (js/parseFloat (:temperature s))]
                              (when (js/isNaN t)
                                (throw (cli-error "--temperature must be numeric.")))
                              (recur ts (assoc s :temperature t)))
          (throw (cli-error (str "Unknown argument: " token))))))))

(defn- parse-review-stub-args
  [tokens]
  (loop [tokens tokens
         state {}]
    (if (empty? tokens)
      (do
        (when-not (:bundle-dir state)
          (throw (cli-error "review-stub requires --bundle <path>.")))
        (assoc state :mode :review-stub))
      (let [token (first tokens)]
        (case token
          "--help" (throw (cli-error usage))
          "--bundle" (let [[s ts] (consume-flag state :bundle-dir tokens)]
                       (recur ts (update s :bundle-dir #(path/path-resolve [%]))))
          (throw (cli-error (str "Unknown argument: " token))))))))

(defn- parse-review-gpt-args
  [tokens]
  (loop [tokens tokens
         state {:max-session-turns 10
                :fallback? true}]
    (if (empty? tokens)
      (do
        (when-not (:bundle-dir state)
          (throw (cli-error "review-gpt requires --bundle <path>.")))
        (assoc state :mode :review-gpt))
      (let [token (first tokens)]
        (case token
          "--help" (throw (cli-error usage))
          "--bundle" (let [[s ts] (consume-flag state :bundle-dir tokens)]
                       (recur ts (update s :bundle-dir #(path/path-resolve [%]))))
          "--model" (let [[s ts] (consume-flag state :model tokens)]
                      (recur ts s))
          "--base-url" (let [[s ts] (consume-flag state :base-url tokens)]
                         (recur ts s))
          "--api-key" (let [[s ts] (consume-flag state :api-key tokens)]
                        (recur ts s))
          "--max-session-turns" (let [[s ts] (consume-flag state :max-session-turns tokens)]
                                  (recur ts (update s :max-session-turns js/parseInt)))
          "--temperature" (let [[s ts] (consume-flag state :temperature tokens)]
                          (recur ts (update s :temperature js/parseFloat)))
          "--no-fallback" (recur (rest tokens) (assoc state :fallback? false))
          (throw (cli-error (str "Unknown argument: " token))))))))

(defn parse-args
  "Parse `process.argv` (after the script name) into a CLI args map."
  [argv]
  (case (first argv)
    "generate" (parse-generate-args (rest argv))
    "review-stub" (parse-review-stub-args (rest argv))
    "review-gpt" (parse-review-gpt-args (rest argv))
    (parse-validate-args argv)))

(defn- json
  [value]
  (js/JSON.stringify (clj->js value) nil 2))

(defn- load-bundle
  [bundle-dir]
  (let [contract-ir (fs/read-json (path/path-join bundle-dir "contract-ir.json"))
        candidate (fs/read-text-file (path/path-join bundle-dir "candidate.md"))
        validation-report (fs/read-json (path/path-join bundle-dir "validation-report.json"))]
    (when-not (and contract-ir candidate validation-report)
      (throw (ex-info (str "Bundle incomplete: " bundle-dir) {:bundle-dir bundle-dir})))
    {:contract (edn/coerce-json-contract contract-ir)
     :candidate candidate
     :validation-report (update validation-report :stage keyword)}))


(defn- run-validate
  [args]
  (let [contract-source (fs/read-text-file (:contract-path args))
        response-markdown (fs/read-text-file (:response-path args))
        contract (edn/compile-agent-output-contract contract-source)
        document (md/extract-markdown-sections response-markdown)
        validation (validate/validate-markdown-response contract response-markdown)
        report (validate/to-failure-report contract validation)
        repair-prompt (when-not (:ok validation) (repair/compile-repair-prompt contract validation))
        exit-code (if (:ok validation) 0 1)
        artifacts (when (:artifacts-root args)
                    (artifacts/write-run-artifacts! {:artifacts-root (:artifacts-root args)
                                                     :contract-path (:contract-path args)
                                                     :response-path (:response-path args)
                                                     :contract-source contract-source
                                                     :response-markdown response-markdown
                                                     :contract contract
                                                     :document document
                                                     :report report
                                                     :repair-prompt repair-prompt
                                                     :exit-code exit-code}))]
    (if (:ok validation)
      (stdout (json {:ok true
                     :stage "structure"
                     :contract {:name (:name contract)
                                :version (:version contract)
                                :path (:contract-path args)}
                     :response {:path (:response-path args)
                                :section-headings (mapv :heading (:sections validation))}
                     :report report
                     :artifacts artifacts
                     :failureCount 0}))
      (stdout (json {:ok false
                     :stage "structure"
                     :contract {:name (:name contract)
                                :version (:version contract)
                                :path (:contract-path args)}
                     :response {:path (:response-path args)
                                :section-headings (mapv :heading (:sections validation))}
                     :report report
                     :repairPrompt repair-prompt
                     :artifacts artifacts
                     :failureCount (count (:failures validation))})))
    exit-code))

(defn- ^:async run-generate
  [args]
  (let [contract-source (fs/read-text-file (:contract-path args))
        task-text (if (:task-path args)
                    (fs/read-text-file (:task-path args))
                    (:task-text args))
        contract (edn/compile-agent-output-contract contract-source)
        generation (await (gen/generate-candidate contract task-text
                                                  :mode (:generator args)
                                                  :attempt 0
                                                  :model (:model args)
                                                  :base-url (:base-url args)
                                                  :api-key (:api-key args)
                                                  :temperature (:temperature args)))
        response-markdown (atom (:candidate-markdown generation))
        validation (atom (validate/validate-markdown-response contract @response-markdown))
        repair-attempts (atom [])]

    (while (and (not (:ok @validation)) (< (count @repair-attempts) (:repair-max-retries contract)))
      (let [failed-report (validate/to-failure-report contract @validation)
            repair-prompt (repair/compile-repair-prompt contract @validation)]
        (swap! repair-attempts conj {:attempt (inc (count @repair-attempts))
                                     :candidate-markdown @response-markdown
                                     :report failed-report
                                     :repair-prompt repair-prompt})
        (let [next-gen (await (gen/generate-candidate contract task-text
                                                      :mode (:generator args)
                                                      :attempt (count @repair-attempts)
                                                      :repair-prompt repair-prompt
                                                      :previous-candidate @response-markdown
                                                      :model (:model args)
                                                      :base-url (:base-url args)
                                                      :api-key (:api-key args)
                                                      :temperature (:temperature args)))]
          (reset! response-markdown (:candidate-markdown next-gen))
          (reset! validation (validate/validate-markdown-response contract @response-markdown)))))

    (let [document (md/extract-markdown-sections @response-markdown)
          report (validate/to-failure-report contract @validation)
          repair-prompt (when-not (:ok @validation) (repair/compile-repair-prompt contract @validation))
          exit-code (if (:ok @validation) 0 1)
          artifacts (when (:artifacts-root args)
                      (artifacts/write-run-artifacts! {:artifacts-root (:artifacts-root args)
                                                       :contract-path (:contract-path args)
                                                       :response-path (if (:task-path args)
                                                                        (str "generated-from:" (:task-path args))
                                                                        "generated-from:inline-task")
                                                       :contract-source contract-source
                                                       :response-markdown @response-markdown
                                                       :contract contract
                                                       :document document
                                                       :report report
                                                       :repair-prompt repair-prompt
                                                       :exit-code exit-code}))
          generation-artifacts (when artifacts
                                 (artifacts/write-generation-artifacts! (:dir artifacts) task-text
                                                                        (:report generation) (count @repair-attempts)))
          repair-attempt-artifacts (when (and artifacts (seq @repair-attempts))
                                     (artifacts/write-repair-attempt-artifacts! (:dir artifacts) @repair-attempts))
          review (when (:ok @validation)
                   (review/build-stub-review-report contract @response-markdown report))
          review-artifacts (when (and review artifacts)
                             (artifacts/write-review-artifacts! (:dir artifacts) review))]
      (stdout (json (merge {:ok (and (:ok @validation) (or (nil? review) (:ok review)))
                            :stage (if (:ok @validation)
                                     (if review "review" "structure")
                                     "structure")
                            :contract {:name (:name contract)
                                       :version (:version contract)
                                       :path (:contract-path args)}
                            :generation (:report generation)
                            :structure report
                            :repairAttempts @repair-attempts}
                           (when repair-prompt {:repairPrompt repair-prompt})
                           (when review {:review review})
                           (when artifacts {:artifacts artifacts})
                           (when generation-artifacts {:generationArtifacts generation-artifacts})
                           (when repair-attempt-artifacts {:repairAttemptArtifacts repair-attempt-artifacts})
                           (when review-artifacts {:reviewArtifacts review-artifacts}))))
      (if review (if (:ok review) 0 1) exit-code))))

(defn- run-review-stub
  [args]
  (let [{:keys [contract candidate validation-report]} (load-bundle (:bundle-dir args))]
    (if-not (:ok validation-report)
      (do (stderr (json {:ok false
                         :stage "review"
                         :error "review-stub requires a structurally valid bundle"
                         :bundleDir (:bundle-dir args)}))
          2)
      (let [review (review/build-stub-review-report contract candidate validation-report)
            written (artifacts/write-review-artifacts! (:bundle-dir args) review)]
        (stdout (json {:ok (:ok review)
                       :stage "review"
                       :bundleDir (:bundle-dir args)
                       :reviewReport review
                       :written written}))
        (if (:ok review) 0 1)))))

(defn- ^:async run-review-gpt
  [args]
  (let [{:keys [contract candidate validation-report]} (load-bundle (:bundle-dir args))]
    (if-not (:ok validation-report)
      (do (stderr (json {:ok false
                         :stage "review"
                         :error "review-gpt requires a structurally valid bundle"
                         :bundleDir (:bundle-dir args)}))
          2)
      (let [review (await (gpt-review/build-gpt-review-report contract candidate validation-report
                                                              :model (:model args)
                                                              :base-url (:base-url args)
                                                              :api-key (:api-key args)
                                                              :max-session-turns (:max-session-turns args)
                                                              :temperature (:temperature args)
                                                              :fallback? (:fallback? args)))
            written (artifacts/write-review-artifacts! (:bundle-dir args) review)]
        (stdout (json {:ok (:ok review)
                       :stage "review"
                       :reviewer (:reviewer review)
                       :modelId (:model-id review)
                       :bundleDir (:bundle-dir args)
                       :reviewReport review
                       :written written}))
        (if (:ok review) 0 1)))))

(defn ^:async run-cli
  "Run the output-contract-gate CLI with `argv` and return an exit code."
  [argv]
  (try
    (let [args (parse-args argv)]
      (case (:mode args)
        :validate (run-validate args)
        :generate (await (run-generate args))
        :review-stub (run-review-stub args)
        :review-gpt (await (run-review-gpt args))))
    (catch js/Error e
      (let [data (ex-data e)]
        (if (= (:type data) :cli-usage)
          (if (= (.-message e) usage)
            (do (stdout (json {:ok true :stage "cli" :help usage})) 0)
            (do (stderr (json {:ok false :stage "cli" :error (.-message e) :usage usage})) 2))
          (do (stderr (json {:ok false :stage "cli" :error (.-message e)})) 2))))))

(defn ^:async main
  "Entry point when invoked as a Node.js script."
  []
  (let [argv (vec (.slice js/process.argv 2))]
    (try
      (let [exit-code (await (run-cli argv))]
        (set! (.-exitCode js/process) exit-code))
      (catch js/Error e
        (stderr (json {:ok false :stage "cli" :error (.-message e)}))
        (set! (.-exitCode js/process) 2)))))
