;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.infra.actionability-assessment
  "Compose canonical decisions and explicit host readers; never resolve or review a PR."
  (:require [pr-flow.native-context :as native] [pr-flow.native-context-law :as context-law]
            [pr-flow.permissions :as permissions]
            [pr-flow.actionability :as actionability] [pr-flow.actionability-history :as history]
            [pr-flow.law :as law] [eta-mu.extern.actionability-host :as host]))

;; Source preparation deliberately cannot authorize unprotected dependencies.
;; These pins must be reviewed in this repository after the stacked dependencies merge.
(def dependency-pins {:canonical nil :muse nil})
(defn require-protected-dependencies! []
  (when-not (every? #(and (string? %) (re-matches #"[0-9a-f]{40}" %)) (vals dependency-pins))
    (host/refuse! :unadopted-dependency-pins))
  dependency-pins)

(defn collect
  "Always collect and classify fresh native input; no supplied eligibility flags."
  [{:keys [read-json history-text]} {:keys [repo pr-number policy] :as config}]
  (let [authorized (fn [r login]
                     (when (and login (not (law/bot? login)))
                       (try
                         (boolean (permissions/writer-role?
                                   (:permission (read-json "api" (str "repos/" r "/collaborators/" login "/permission")))))
                         (catch :default e
                           (if (= 404 (:status (ex-data e))) false (throw e))))))
        snapshot (native/collect-context {:read-json read-json :authorized-author? authorized
                                          :read-history #(history/observations history-text %)} repo pr-number)
        selection (context-law/select-fresh-context snapshot config)]
    (when (:refusal selection) (host/refuse! :fresh-context))
    (let [thread (law/classify-thread (assoc (:selected selection)
                                           :actionability-policy (:review/actionability policy)
                                           :actionability-observations (:history snapshot)
                                           :identities (:review/identities policy)))]
      (assoc snapshot :selected thread :config config))))

(defn prepare-input
  "Encode complete original data with a structural source binding, not an admission."
  [snapshot inventory proposal-id provenance]
  (let [thread (:selected snapshot)
        proposals (filterv #(= proposal-id (:id %)) (:issue-comments snapshot))
        proposal (first proposals)
        record (actionability/protocol proposal)
        binding (actionability/context-binding thread)]
    (when-not (and (= 1 (count proposals)) (= :proposal (:kind record))
                   (= (:head thread) (:head record)) (= binding (:payload record))
                   (= (:head thread) (:head inventory))) (host/refuse! :input-proposal-binding))
    (let [full (host/json {:version 1 :native-context (:native-context thread)
                          :context-manifest (:context-manifest thread)
                          :native-issue-comments (:raw-issue-comments snapshot)
                          :proposal proposal :source-inventory inventory})
          manifest {:schema "open-hax.actionability-input/v1" :purpose "actionability"
                    :head_sha (:head thread) :context_sha256 (:context-digest thread)
                    :proposal_id (:id proposal) :proposal_body_sha256 (:body-sha256 proposal)
                    :source_inventory_sha256 (:sha256 inventory)
                    :target {:repository_id (get-in snapshot [:repository :id])
                             :repository_database_id (get-in snapshot [:repository :databaseId])
                             :pr_id (get-in snapshot [:pr :id]) :pr_number (get-in snapshot [:pr :number])
                             :thread_id (:id thread) :root_comment_id (:root-comment-id thread)}
                    :full_input {:path "actionability-input.txt" :bytes (host/utf8-length full)
                                 :sha256 (host/sha256 full)} :provenance provenance}]
      {:text full :manifest manifest})))

(defn- bound-source! [snapshot inventory source config]
  (let [thread (:selected snapshot) target (:target source)]
    (when-not (and (= "open-hax.actionability-input/v1" (:schema source)) (= "actionability" (:purpose source))
                   (= (:head thread) (:head_sha source)) (= (:context-digest thread) (:context_sha256 source))
                   (= (:sha256 inventory) (:source_inventory_sha256 source))
                   (= (get-in snapshot [:repository :id]) (:repository_id target))
                   (= (get-in snapshot [:repository :databaseId]) (:repository_database_id target))
                   (= (get-in snapshot [:pr :id]) (:pr_id target)) (= (:pr-number config) (:pr_number target))
                   (= (:id thread) (:thread_id target)) (= (:root-comment-id thread) (:root_comment_id target))
                   (= (:provenance config) (:provenance source)))
      (host/refuse! :fresh-input-binding))))

(defn- body-matches [snapshot body user]
  (filterv #(and (= body (:body %)) (= user (select-keys (:user %) [:login :id :node_id :type])))
           (:issue-comments snapshot)))
(defn rebind-input
  "Fresh custody check before and after the child; this grants no admission."
  [deps config source]
  ((:verify-sources! deps)) ((:verify-run! deps))
  (let [snapshot (collect deps config) inventory ((:inventory! deps))
        proposals (filterv #(= (:proposal_id source) (:id %)) (:issue-comments snapshot))
        proposal (first proposals) record (actionability/protocol proposal)]
    (bound-source! snapshot inventory source config)
    (when-not (and (= 1 (count proposals)) (= :proposal (:kind record))
                   (= (:proposal_body_sha256 source) (:body-sha256 proposal))
                   (= (actionability/context-binding (:selected snapshot)) (:payload record)))
      (host/refuse! :fresh-proposal-binding))
    snapshot))
(defn- qualified-record! [snapshot record body user]
  (let [thread (:selected snapshot) disposition (actionability/disposition thread)]
    (when-not (and (= body (:body record)) (= user (select-keys (:user record) [:login :id :node_id :type]))
                   (= :informational (:kind disposition)) (= :qualified (:status disposition))
                   (= (:id record) (:assessment-id disposition)))
      (host/refuse! :native-assessment-readback))
    {:status :qualified :record-id (:id record) :url (:html_url record)
     :context-digest (:context-digest thread) :resolved? (:resolved? thread)
     :settled? (:settled? thread) :native-resolution-performed false :review-credit false}))

(defn ^:async publish
  "At most one issue write; fresh native disposition/readback is separate from body eligibility."
  [{:keys [verify-sources! verify-run! verify-invocation! inventory! publisher-proof!
           post! get-comment! accepted-sha256] :as deps} config]
  (verify-sources!) (verify-run!)
  (let [invocation (verify-invocation!)
        _ (when-not (= accepted-sha256 (:accepted-sha256 invocation)) (host/refuse! :trusted-invocation-digest))
        _ (when-not (and (vector? (get-in invocation [:submission :comments]))
                         (empty? (get-in invocation [:submission :comments])))
            (host/refuse! :adverse-submission))
        before (collect deps config) inventory (inventory!) source (:source invocation)
        _ (bound-source! before inventory source config)
        proof (publisher-proof!)
        _ (when-not (some #(and (= (get-in before [:repository :databaseId]) (:id %))
                                (= (:repo config) (:full_name %))) (:repositories proof))
            (host/refuse! :publisher-repository))
        user (:user proof)
        prospective (actionability/assessment-publication (:selected before)
                                                          (get-in invocation [:submission :summary]) user)
        _ (when-not (and (true? (:eligible? prospective))
                         (= (:proposal_id source) (:proposal-id prospective))
                         (= (:proposal_body_sha256 source) (:proposal-body-sha256 prospective)))
            (host/refuse! :prospective-body))
        body (:body prospective)
        prior (body-matches before body user)]
    (when (> (count prior) 1) (host/refuse! :ambiguous-existing-assessment))
    (if (= 1 (count prior))
      (let [record (first prior) actual (get-comment! (:id record))]
        (when-not (= (select-keys record [:id :node_id :body :user :created_at :updated_at :html_url])
                     (select-keys actual [:id :node_id :body :user :created_at :updated_at :html_url]))
          (host/refuse! :native-get-mismatch))
        (qualified-record! before record body user))
      (let [result (await (post! (:repo config) (:pr-number config) body))]
        (when-not (#{:posted :refused :uncertain} (:outcome result)) (host/refuse! :native-write-outcome))
        (when (= :refused (:outcome result)) (host/refuse! :native-write-refused))
        ;; The record may exist even after a transport timeout. Recollect once,
        ;; never retry a write or infer that an absent response means no effect.
        (verify-sources!) (verify-run!)
        (let [after (collect deps config) current-inventory (inventory!)
              _ (bound-source! after current-inventory source config)
              matches (body-matches after body user)]
          (when-not (= 1 (count matches)) (host/refuse! :uncertain-native-write))
          (let [record (first matches) actual (get-comment! (:id record))]
            (when (and (= :posted (:outcome result)) (not= (:id record) (get-in result [:record :id])))
              (host/refuse! :native-post-record-mismatch))
            (when-not (= (select-keys record [:id :node_id :body :user :created_at :updated_at :html_url])
                         (select-keys actual [:id :node_id :body :user :created_at :updated_at :html_url]))
              (host/refuse! :native-get-mismatch))
            (qualified-record! after record body user)))))))
