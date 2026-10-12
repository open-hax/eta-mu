;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-rejection-assessment
  "Prospective protected host entry. Dependency pins deliberately remain unadopted."
  (:require [eta-mu.infra.rejection-assessment :as assessment]
            [eta-mu.extern.actionability-host :as host]
            [pr-flow.flow :as flow] [clojure.string :as str]))

(defn required [name]
  (let [value (host/env name)]
    (when (str/blank? value) (host/refuse! :missing-host-input)) value))
(defn number! [value]
  (when-not (and (string? value) (re-matches #"[1-9][0-9]*" value)
                 (<= (count value) 15)) (host/refuse! :native-coordinate))
  (parse-long value))
(defn config []
  (let [repo (required "TARGET_REPOSITORY") head (required "TARGET_HEAD_SHA")
        canonical (required "CANONICAL_CHECKOUT")
        policy (host/read-edn (host/join canonical "skills/pr-flow/flow.edn"))
        workflow-sha (required "GITHUB_WORKFLOW_SHA")
        called-revision (host/env "REJECTION_CALLED_REVISION")
        eta-revision (required "ETA_SOURCE_SHA")
        job-workflow-sha (required "REJECTION_JOB_WORKFLOW_SHA")
        job-workflow-ref (required "REJECTION_JOB_WORKFLOW_REF")
        prepare-check-run-id (number! (required "REJECTION_PREPARE_CHECK_RUN_ID"))
        assess-check-run-id (some-> (host/env "REJECTION_ASSESS_CHECK_RUN_ID") number!)
        direct? (or (nil? called-revision) (= "" called-revision))
        _ (when-not (and (re-matches #"[0-9a-f]{40}" eta-revision)
                         (if direct?
                           (= "workflow_dispatch" (required "GITHUB_EVENT_NAME"))
                           (= eta-revision called-revision))) (host/refuse! :host-input))
        _ (when-not (and (re-matches #"open-hax/[A-Za-z0-9_.-]+" repo)
                         (re-matches #"[0-9a-f]{40}" head)
                         (re-matches #"PRRT_[a-zA-Z0-9_-]+" (required "TARGET_THREAD_ID"))
                         (re-matches #"[0-9a-f]{40}" workflow-sha)
                         (= eta-revision job-workflow-sha)
                         (re-matches #"open-hax/eta-mu/\.github/workflows/opencode-rejection-assessment\.yml@.+" job-workflow-ref)
                         (empty? (flow/problems policy))) (host/refuse! :host-input))
        n (number! (required "TARGET_PR_NUMBER"))
        run-id (number! (required "GITHUB_RUN_ID")) attempt (number! (required "GITHUB_RUN_ATTEMPT"))
        _ (when-not (= 1 attempt) (host/refuse! :fresh-run-required))]
    {:repo repo :repository-database-id (number! (required "TARGET_REPOSITORY_ID"))
     :pr-number n :head head :thread-id (required "TARGET_THREAD_ID")
     :root-comment-id (number! (required "TARGET_ROOT_COMMENT_ID"))
     :proposal-id (number! (required "TARGET_PROPOSAL_ID")) :policy (:flow/defaults policy)
     :run-repo (required "GITHUB_REPOSITORY") :run-id run-id :run-attempt attempt
     :workflow-sha workflow-sha :workflow-ref (required "GITHUB_WORKFLOW_REF")
     :eta-revision eta-revision :direct? direct?
     :job-workflow-sha job-workflow-sha :job-workflow-ref job-workflow-ref
     :prepare-check-run-id prepare-check-run-id :assess-check-run-id assess-check-run-id
     :provenance {:repository repo :pull_request (str n) :run_id (str run-id) :run_attempt (str attempt)
                  :workflow_sha workflow-sha :workflow_ref (required "GITHUB_WORKFLOW_REF")}}))

(defn dependencies [cfg phase]
  (let [pins (assessment/require-protected-dependencies!) publish? (= phase "publish")
        home (host/private-directory! (required "REJECTION_HOST_HOME"))
        read (partial host/gh-json home (required "GH_TOKEN"))
        read-run (partial host/gh-json home (or (host/env "HOST_RUN_READ_TOKEN") (required "GH_TOKEN")))
        canonical (required "CANONICAL_CHECKOUT") muse (required "MUSE_CHECKOUT")
        target (required "TARGET_CHECKOUT") directory (host/private-directory! (required "REJECTION_EVIDENCE_DIR"))
        verifier (required "REVIEW_INVOCATION_VERIFIER_FILE") verifier-sha (required "REVIEW_INVOCATION_VERIFIER_SHA256")
        history-selection {:kind (required "REJECTION_HISTORY_SOURCE_KIND")
                           :source-file (required "REJECTION_HISTORY_SOURCE_FILE")
                           :cli-file (required "REJECTION_HISTORY_CLI_FILE")
                           :expected-sha (required "REJECTION_HISTORY_SOURCE_SHA256")
                           :expected-cli-sha (required "REJECTION_HISTORY_CLI_SHA256")}
        acquired (assessment/acquire-history-input history-selection cfg pins directory (= phase "prepare"))
        protected-history-file (host/join canonical ".ημ/receipts.edn")
        protected-history-text (host/read-text protected-history-file true)
        protected-history-sha (host/sha256 (host/read-bytes protected-history-file))
        protocol-text (host/read-text (host/join canonical "skills/pr-review-settlement/SKILL.md"))
        verify (fn []
                 (host/verify-checkouts! [[(required "ETA_CHECKOUT") (:eta-revision cfg)]
                                         [canonical (:canonical pins)] [muse (:muse pins)] [target (:head cfg)]])
                 (when-not (and (= acquired (assessment/acquire-history-input history-selection cfg pins directory (= phase "prepare")))
                                (= protected-history-sha (host/sha256 (host/read-bytes protected-history-file))))
                   (host/refuse! :history-source-change))
                 (when (host/env "PREPARED_INPUT_SHA256")
                   (when-not (= (required "PREPARED_INPUT_SHA256")
                                (host/files-digest directory assessment/prepared-files))
                     (host/refuse! :prepared-input-change)))
                 (when-not (= (required "PREPARED_PROFILE_SHA256") (host/directory-digest (required "REJECTION_PROFILE_DIR")))
                   (host/refuse! :prepared-profile-change)))]
    {:read-json read :history-text (:text acquired) :history-source (:coordinate acquired)
     :protected-history-text protected-history-text :protocol-text protocol-text
     :verify-sources! verify :verify-run! #(host/verify-run! read-run cfg publish? assessment/host-route)
     :verify-invocation! #(host/invocation directory verifier verifier-sha assessment/input-name)
     :inventory! #(host/source-inventory read target (:repo cfg) (:pr-number cfg) (:head cfg))
     :publisher-proof! #(host/actual-publisher-proof home)
     :post! #(host/post-comment! %1 %2 %3 (required "GH_TOKEN"))
     :get-comment! #(read "api" (str "repos/" (:repo cfg) "/issues/comments/" %))
     :accepted-sha256 (when publish? (required "ACCEPTED_INVOCATION_SHA256"))}))

(defn prepare! [deps cfg]
  ((:verify-sources! deps)) ((:verify-run! deps))
  (let [snapshot (assessment/collect deps cfg) inventory ((:inventory! deps))
        request (assessment/request! snapshot (:proposal-id cfg))
        input (assessment/prepare-input snapshot inventory request (:history-text deps) (:protocol-text deps) (:provenance cfg))
        directory (required "REJECTION_EVIDENCE_DIR")
        prompt (str "Independently assess the actual current-head rejection proposal for PR{{PR_NUMBER}}, full native conversation, immutable changed source, and all canonical history provided in the complete input. "
                    "Read and assess every lossless page and all five stages with the eight exposed review tools. Do not treat a writer proposal or API eligibility as an agreement. "
                    "If independent adversarial evaluation supports the proposal, put ONLY the exact canonical rejection agreement body (current head, Finding pair, substantive Reason and source Evidence) in review_submit summary, with empty comments and incidental APPROVE carrier. "
                    "A defect, disputed claim, question, uncertainty, incomplete input or refusal must remain adverse; never manufacture agreement. "
                    "No pull-review approval, rejection settlement, resolution or native permission is granted by this model envelope. No GitHub credentials or write tools are provided.\n")]
    (host/write-text! (host/join directory "history-source.edn") (:history-text deps))
    (host/write-json! (host/join directory "history-source.json") (:history-source deps))
    (host/write-text! (host/join directory assessment/input-name) (:text input))
    (host/write-json! (host/join directory "input-manifest.json") (:manifest input))
    (host/write-text! (host/join directory "prompt.txt") prompt)
    (host/write-json! (host/join directory "host-input-custody.json")
                      {:config (dissoc cfg :policy) :history-sha256 (get-in deps [:history-source :source-sha256])
                       :source-inventory-sha256 (:sha256 inventory) :expected-user assessment/expected-publisher})
    (host/output! {:status :prepared :head (:head cfg) :context (get-in input [:manifest :context_sha256])
                   :input-sha256 (host/files-digest directory assessment/prepared-files)})))

(defn verify! [deps cfg]
  ((:verify-sources! deps)) ((:verify-run! deps))
  (let [invocation ((:verify-invocation! deps))]
    (assessment/rebind-input deps cfg (:source invocation))
    (host/output! {:status :verified :accepted-sha256 (:accepted-sha256 invocation)})))

(defn ^:async entry []
  (try
    (let [[phase] (host/argv) pins (assessment/require-protected-dependencies!)]
      (case phase
        "pins" (host/output! pins)
        "profile" (host/write-text! (required "PROFILE_SCRIPT_FILE")
                                   (host/source-profile-script (required "ETA_WORKFLOW_FILE")))
        (let [cfg (config) deps (dependencies cfg phase)]
          (case phase
            "prepare" (prepare! deps cfg)
            "input" (let [source (host/input-source (required "REJECTION_EVIDENCE_DIR")
                                                    (required "REVIEW_INVOCATION_VERIFIER_FILE")
                                                    (required "REVIEW_INVOCATION_VERIFIER_SHA256") assessment/input-name)]
                      (assessment/rebind-input deps cfg source) (host/output! {:status :input-bound}))
            "verify" (verify! deps cfg)
            "publish" (let [result (await (assessment/publish deps cfg))]
                        ;; A failed post-readback must retain the actual one-shot outcome.
                        (host/write-json! (required "PUBLICATION_RESULT_FILE") result)
                        (if (= :observed (:status result)) (host/output! result)
                          (host/refuse! :unestablished-native-write)))
            (host/refuse! :host-phase)))))
    (catch :default e (host/fail-exit! e))))
(entry)
