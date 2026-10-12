;; SPDX-License-Identifier: GPL-3.0-or-later
(ns opencode-actionability-assessment
  "Protected one-shot host. Import only canonical pure/adaptor namespaces."
  (:require [eta-mu.infra.actionability-assessment :as assessment]
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
        called-revision (host/env "ACTIONABILITY_CALLED_REVISION")
        eta-revision (required "ETA_SOURCE_SHA")
        job-workflow-sha (required "ACTIONABILITY_JOB_WORKFLOW_SHA")
        job-workflow-ref (required "ACTIONABILITY_JOB_WORKFLOW_REF")
        prepare-check-run-id (number! (required "ACTIONABILITY_PREPARE_CHECK_RUN_ID"))
        assess-check-run-id (some-> (host/env "ACTIONABILITY_ASSESS_CHECK_RUN_ID") number!)
        direct? (or (nil? called-revision) (= "" called-revision))
        _ (when-not (and (re-matches #"[0-9a-f]{40}" eta-revision)
                         (if direct?
                           (= "workflow_dispatch" (required "GITHUB_EVENT_NAME"))
                           (= eta-revision called-revision))) (host/refuse! :host-input))
        _ (when-not (and (re-matches #"open-hax/[A-Za-z0-9_.-]+" repo)
                         (re-matches #"[0-9a-f]{40}" head)
                         (re-matches #"[0-9a-f]{40}" workflow-sha)
                         (= eta-revision job-workflow-sha)
                         (re-matches #"open-hax/eta-mu/\.github/workflows/opencode-actionability-assessment\.yml@.+" job-workflow-ref)
                         (empty? (flow/problems policy))) (host/refuse! :host-input))
        n (number! (required "TARGET_PR_NUMBER"))
        run-id (number! (required "GITHUB_RUN_ID")) attempt (number! (required "GITHUB_RUN_ATTEMPT"))]
    {:repo repo :repository-database-id (number! (required "TARGET_REPOSITORY_ID"))
     :pr-number n :head head :thread-id (required "TARGET_THREAD_ID")
     :proposal-id (number! (required "TARGET_PROPOSAL_ID")) :policy (:flow/defaults policy)
     :run-repo (required "GITHUB_REPOSITORY") :run-id run-id :run-attempt attempt
     :workflow-sha workflow-sha :workflow-ref (required "GITHUB_WORKFLOW_REF")
     :eta-revision eta-revision :direct? direct?
     :job-workflow-sha job-workflow-sha :job-workflow-ref job-workflow-ref
     :prepare-check-run-id prepare-check-run-id :assess-check-run-id assess-check-run-id
     :provenance {:repository repo :pull_request (str n) :run_id (str run-id) :run_attempt (str attempt)
                  :workflow_sha workflow-sha :workflow_ref (required "GITHUB_WORKFLOW_REF")}}))

(defn dependencies [cfg publish?]
  (let [pins (assessment/require-protected-dependencies!)
        home (host/private-directory! (required "ACTIONABILITY_HOST_HOME"))
        read (partial host/gh-json home (required "GH_TOKEN"))
        read-run (partial host/gh-json home (or (host/env "HOST_RUN_READ_TOKEN") (required "GH_TOKEN")))
        canonical (required "CANONICAL_CHECKOUT") muse (required "MUSE_CHECKOUT")
        target (required "TARGET_CHECKOUT") directory (host/private-directory! (required "ACTIONABILITY_EVIDENCE_DIR"))
        verifier (required "REVIEW_INVOCATION_VERIFIER_FILE") verifier-sha (required "REVIEW_INVOCATION_VERIFIER_SHA256")
        history-file (host/join canonical ".ημ/receipts.edn")
        history-text (host/read-text history-file)
        history-sha (host/sha256 (host/read-bytes history-file))
        verify (fn []
                 (host/verify-checkouts! [[(required "ETA_CHECKOUT") (:eta-revision cfg)]
                                         [canonical (:canonical pins)] [muse (:muse pins)] [target (:head cfg)]])
                 (when-not (= history-sha (host/sha256 (host/read-bytes history-file)))
                   (host/refuse! :history-source-change))
                 (when (host/env "PREPARED_INPUT_SHA256")
                   (when-not (= (required "PREPARED_INPUT_SHA256")
                                (host/files-digest directory ["actionability-input.txt" "input-manifest.json" "prompt.txt" "tools.txt" "host-input-custody.json"]))
                     (host/refuse! :prepared-input-change)))
                 (when-not (= (required "PREPARED_PROFILE_SHA256") (host/directory-digest (required "ACTIONABILITY_PROFILE_DIR")))
                   (host/refuse! :prepared-profile-change)))]
    {:read-json read :history-text history-text :history-sha256 history-sha
     :verify-sources! verify :verify-run! #(host/verify-run! read-run cfg publish?)
     :verify-invocation! #(host/invocation directory verifier verifier-sha)
     :inventory! #(host/source-inventory read target (:repo cfg) (:pr-number cfg) (:head cfg))
     :publisher-proof! #(host/actual-publisher-proof home)
     :post! #(host/post-comment! %1 %2 %3 (required "GH_TOKEN"))
     :get-comment! #(read "api" (str "repos/" (:repo cfg) "/issues/comments/" %))
     :accepted-sha256 (host/env "ACCEPTED_INVOCATION_SHA256")}))

(defn prepare! [deps cfg]
  ((:verify-sources! deps)) ((:verify-run! deps))
  (let [snapshot (assessment/collect deps cfg)
        inventory ((:inventory! deps))
        input (assessment/prepare-input snapshot inventory (:proposal-id cfg) (:provenance cfg))
        directory (required "ACTIONABILITY_EVIDENCE_DIR")
        canonical (required "CANONICAL_CHECKOUT")
        prompt (str "Independently assess the complete native author context and immutable source for PR{{PR_NUMBER}}. "
                    "This task has no ordinary pull-review or resolution authority. Read and assess every lossless input page through all five review stages. "
                    "Use the canonical actionability protocol in the complete input. A positive result must be the exact two-line assessment body, "
                    "with precise reason and source evidence after independent adversarial assessment. A defect, request, question, uncertainty or incomplete input "
                    "must remain adverse; do not manufacture a positive result. Put the proposed protocol body only in review_submit summary. "
                    "The submission event is incidental and is never published as a pull review.\n")]
    ;; Include the protected protocol documentation as source evidence, not an
    ;; adapter's second protocol grammar or a prequalified decision.
    (let [text (host/json {:native-input (:text input)
                          :canonical-protocol (host/read-text (host/join canonical "skills/pr-flow/actionability.md"))})
          manifest (-> (:manifest input)
                       (assoc-in [:full_input :bytes] (host/utf8-length text))
                       (assoc-in [:full_input :sha256] (host/sha256 text)))]
      (host/write-text! (host/join directory "actionability-input.txt") text)
      (host/write-json! (host/join directory "input-manifest.json") manifest))
    (host/write-text! (host/join directory "prompt.txt") prompt)
    (host/write-json! (host/join directory "host-input-custody.json")
                      {:config (dissoc cfg :policy) :history-sha256 (:history-sha256 deps)
                       :source-inventory-sha256 (:sha256 inventory)})
    (host/output! {:status :prepared :head (:head cfg) :context (get-in input [:manifest :context_sha256])
                   :input-sha256 (host/files-digest directory ["actionability-input.txt" "input-manifest.json" "prompt.txt" "tools.txt" "host-input-custody.json"])})))

(defn verify! [deps cfg]
  ((:verify-sources! deps)) ((:verify-run! deps))
  (let [invocation ((:verify-invocation! deps))
        snapshot (assessment/rebind-input deps cfg (:source invocation))
        inventory ((:inventory! deps))
        custody (host/read-json (host/join (required "ACTIONABILITY_EVIDENCE_DIR") "host-input-custody.json"))]
    (when-not (and (= (:history-sha256 deps) (:history-sha256 custody))
                   (= (:sha256 inventory) (:source-inventory-sha256 custody))
                   (= (:context-digest (:selected snapshot)) (get-in invocation [:source :context_sha256])))
      (host/refuse! :post-child-custody))
    (host/output! {:status :verified :accepted-sha256 (:accepted-sha256 invocation)})))

(defn ^:async entry []
  (try
    (let [[phase] (host/argv)
          pins (assessment/require-protected-dependencies!)]
      (if (= phase "pins")
        (host/output! pins)
        (if (= phase "profile")
          (host/write-text! (required "PROFILE_SCRIPT_FILE")
                            (host/source-profile-script (required "ETA_WORKFLOW_FILE")))
          (let [cfg (config) deps (dependencies cfg (= phase "publish"))]
            (case phase
              "prepare" (prepare! deps cfg)
              "input" (let [source (host/input-source (required "ACTIONABILITY_EVIDENCE_DIR")
                                                       (required "REVIEW_INVOCATION_VERIFIER_FILE")
                                                       (required "REVIEW_INVOCATION_VERIFIER_SHA256"))]
                        (assessment/rebind-input deps cfg source)
                        (host/output! {:status :input-bound}))
              "verify" (verify! deps cfg)
              "publish" (host/output! (await (assessment/publish deps cfg)))
              (host/refuse! :host-phase))))))
    (catch :default e (host/fail-exit! e))))
(entry)
