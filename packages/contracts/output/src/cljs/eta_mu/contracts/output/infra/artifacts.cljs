(ns eta-mu.contracts.output.infra.artifacts
  "Artifact writer for output-contract gate runs.
   Composes the pure layers with `extern.fs` to persist run inputs, contract
   IR, candidate, validation report, and optional repair/review reports."
  (:require [eta-mu.contracts.output.extern.fs :as fs]
            [eta-mu.contracts.output.extern.path :as path]))

(defn- run-dir
  [artifacts-root]
  (path/path-join artifacts-root (fs/run-id)))

(defn write-run-artifacts!
  "Write a complete run artifact bundle and return its descriptor."
  [{:keys [artifacts-root contract-path response-path contract-source
           response-markdown contract document report repair-prompt exit-code]}]
  (let [dir (run-dir artifacts-root)]
    (fs/ensure-directory! dir)
    (let [repair-prompt-file (when repair-prompt (path/path-join dir "repair-prompt.txt"))
          files {:input (path/path-join dir "input.json")
                 :contract (path/path-join dir "contract.edn")
                 :contract-ir (path/path-join dir "contract-ir.json")
                 :candidate (path/path-join dir "candidate.md")
                 :candidate-ast (path/path-join dir "candidate.ast.json")
                 :validation-report (path/path-join dir "validation-report.json")
                 :final-decision (path/path-join dir "final-decision.json")}
          files (if repair-prompt-file
                  (assoc files :repair-prompt repair-prompt-file)
                  files)
          contract-hash (fs/sha256-hex contract-source)
          candidate-hash (fs/sha256-hex response-markdown)
          ast-hash (fs/sha256-hex (js/JSON.stringify (clj->js (:ast document))))]
      (fs/write-json! (:input files) {:createdAt (fs/now-iso)
                                      :contractPath contract-path
                                      :responsePath response-path
                                      :artifactsRoot artifacts-root})
      (fs/write-text-file! (:contract files) contract-source)
      (fs/write-json! (:contract-ir files) contract)
      (fs/write-text-file! (:candidate files) response-markdown)
      (fs/write-json! (:candidate-ast files) (:ast document))
      (fs/write-json! (:validation-report files) report)
      (fs/write-json! (:final-decision files)
                      {:ok (:ok report)
                       :stage (:stage report)
                       :exitCode exit-code
                       :contract {:name (:name contract)
                                  :version (:version contract)}
                       :hashes {:contract contract-hash
                                :candidate candidate-hash
                                :candidateAst ast-hash}
                       :failureCount (count (:failures report))
                       :hasRepairPrompt (boolean repair-prompt)})
      (when repair-prompt-file
        (fs/write-text-file! repair-prompt-file (str repair-prompt "\n")))
      {:root artifacts-root
       :runId (path/path-basename dir)
       :dir dir
       :files files})))

(defn write-review-artifacts!
  "Persist a review report into an existing bundle directory and update the
   final-decision file."
  [bundle-dir report]
  (let [dir bundle-dir
        review-report-path (path/path-join dir "review-report.json")
        final-decision-path (path/path-join dir "final-decision.json")]
    (fs/write-json! review-report-path report)
    (let [existing (or (fs/read-json final-decision-path) {})
          final (assoc existing
                       :ok (:ok report)
                       :stage "review"
                       :review {:reviewer (:reviewer report)
                                :ok (:ok report)
                                :threshold (:threshold report)
                                :overallScore (:overall-score report)
                                :reportPath review-report-path})]
      (fs/write-json! final-decision-path final))
    {:review-report-path review-report-path
     :final-decision-path final-decision-path}))

(defn write-generation-artifacts!
  "Persist task text and generation report into an existing bundle."
  [bundle-dir task-text report repair-attempts-count]
  (let [dir bundle-dir
        task-path (path/path-join dir "task.txt")
        generation-report-path (path/path-join dir "generation-report.json")
        input-path (path/path-join dir "input.json")]
    (fs/write-text-file! task-path (str task-text "\n"))
    (fs/write-json! generation-report-path report)
    (let [input (or (fs/read-json input-path) {})]
      (fs/write-json! input-path
                      (assoc input
                             :generation {:generator (:generator report)
                                          :model (:model report)
                                          :base-url (:base-url report)
                                          :temperature (:temperature report)
                                          :taskPath task-path
                                          :generationReportPath generation-report-path
                                          :taskWordCount (get-in report [:prompt-summary :task-word-count])
                                          :repairAttemptsCount repair-attempts-count})))
    {:task-path task-path
     :generation-report-path generation-report-path
     :input-path input-path}))

(defn write-repair-attempt-artifacts!
  "Persist each repair attempt into an existing bundle. Returns a vector of
   path descriptors."
  [bundle-dir attempts]
  (mapv (fn [attempt]
          (let [candidate-path (path/path-join bundle-dir (str "repair-attempt-" (:attempt attempt) ".md"))
                report-path (path/path-join bundle-dir (str "repair-attempt-" (:attempt attempt) ".validation-report.json"))
                repair-prompt-path (path/path-join bundle-dir (str "repair-attempt-" (:attempt attempt) ".repair-prompt.txt"))]
            (fs/write-text-file! candidate-path (str (:candidate-markdown attempt) "\n"))
            (fs/write-json! report-path (:report attempt))
            (fs/write-text-file! repair-prompt-path (str (:repair-prompt attempt) "\n"))
            {:attempt (:attempt attempt)
             :candidate-path candidate-path
             :report-path report-path
             :repair-prompt-path repair-prompt-path}))
        attempts))
