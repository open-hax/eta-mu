;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.infra.positive-cohort-assessment
  "Complete cohort transport and one native issue append. Canonical policy owns admission."
  (:require [clojure.string :as str]
            [eta-mu.law.positive-cohort-assessment :as carrier]
            [eta-mu.infra.rejection-assessment :as rejection]
            [pr-flow.native-context :as native] [pr-flow.native-context-law :as context-law]
            [pr-flow.permissions :as permissions] [pr-flow.actionability-history :as history]
            [pr-flow.positive-thread :as positive]
            [pr-flow.law :as law] [eta-mu.extern.actionability-host :as host]))

;; Actual reviewed merged source pins; this transport still requires owning
;; source qualification, adoption and fresh native custody before live use.
(def dependency-pins {:canonical "b23845012508fd598a56dea34d6be38ede5c7136"
                      :muse "b9e47da4f445106310c7b9dc98fe3a3ef9ea50d5"})
(def expected-publisher
  {:login "eta-mu-ai[bot]" :id 270021952 :node_id "BOT_kgDOEBg1QA" :type "Bot"})
(def host-route {:workflow-file "opencode-positive-cohort-assessment.yml"
                 :producer-jobs ["Prepare positive cohort input" "Assess complete positive cohort input"]})
(def input-name "positive-cohort-assessment-input.txt")
(def prepared-files [input-name "input-manifest.json" "prompt.txt" "tools.txt" "host-input-custody.json"
                     "history-source.edn" "history-source.json"])
(defn require-protected-dependencies! []
  (when-not (every? #(and (string? %) (re-matches #"[0-9a-f]{40}" %)) (vals dependency-pins))
    (host/refuse! :unadopted-dependency-pins))
  dependency-pins)
(def acquire-history-input rejection/acquire-history-input)

;; Fixed protected source/test inputs, read as Git objects without execution.
(def canonical-source-paths
  ["skills/pr-flow/CONTRACT.edn"
   "skills/pr-flow/flow.edn"
   "skills/pr-flow/positive-bot-thread.md"
   "skills/pr-flow/scripts/pr_flow/positive_thread.cljc"
   "skills/pr-flow/scripts/pr_flow/actionability.cljc"
   "skills/pr-flow/scripts/pr_flow/actionability_history.cljs"
   "skills/pr-flow/scripts/pr_flow/native_context.cljs"
   "skills/pr-flow/scripts/pr_flow/native_context_law.cljc"
   "skills/pr-flow/scripts/pr_flow/permissions.cljc"
   "skills/pr-flow/scripts/pr_flow/law.cljc"
   "skills/pr-flow/scripts/pr.cljs"
   "skills/pr-flow/scripts/test_positive_thread.cljs"
   "skills/pr-flow/scripts/test_native_context.cljs"
   "skills/pr-flow/scripts/test_informational.cljs"
   "skills/pr-flow/scripts/fixture-gh.cjs"
   "skills/pr-flow/scripts/test_actionability_history.cljs"
   "skills/pr-flow/scripts/test_law.cljs"
   "skills/pr-flow/scripts/test_cli.cljs"
   "skills/pr-flow/scripts/fixtures/native-positive-bot-preservation-seeds.json"])

(defn collect
  "Acquire complete native custody. Preparation creates no semantic eligibility."
  [{:keys [read-json history-text protected-history-text history-source canonical-inventory!]}
   {:keys [repo pr-number policy root-comment-id] :as config}]
  (let [authorized (fn [r login]
                     (when (and login (not (law/bot? login)))
                       (try
                         (boolean (permissions/writer-role?
                                   (:permission (read-json "api" (str "repos/" r "/collaborators/" login "/permission")))))
                         (catch :default e
                           (if (= 404 (:status (ex-data e))) false (throw e))))))
        snapshot (native/collect-context
                  {:read-json read-json :authorized-author? authorized
                   :preservation-policy (:review/positive-bot-thread policy)
                   :read-history (fn [repo-id]
                                   (let [selected (history/observations history-text repo-id)
                                         protected (history/observations protected-history-text repo-id)]
                                     (when-not (and (vector? selected) (vector? protected) (= selected protected))
                                       (host/refuse! :history-source-reconciliation))
                                     selected))} repo pr-number)
        selection (context-law/select-fresh-context snapshot config)]
    (when (:refusal selection) (host/refuse! :fresh-context))
    (when-not (= root-comment-id (:root-comment-id (:selected selection))) (host/refuse! :root-coordinate))
    (assoc snapshot :canonical-source-inputs (canonical-inventory!)
           :history-source history-source :protected-history-source-text protected-history-text
           :selected (assoc (:selected selection) :actionability-observations (:history snapshot)))))

(defn request!
  "Select actual proposal/cohort coordinates, never semantic eligibility.
   No placeholder positive judgment or adapter copy of canonical evaluation."
  [snapshot proposal-id]
  (let [thread (:selected snapshot) record (positive/latest-proposal thread)
        proposal (:source record) targets (positive/proposal-cohort-targets thread)]
    (when-not (and (= proposal-id (:id proposal)) (positive/cohort-targets? targets))
      (host/refuse! :input-proposal-coordinate))
    {:head (:head thread) :proposal-id (:id proposal) :proposal-body (:body proposal)
     :proposal-body-sha256 (:body-sha256 proposal) :cohort-targets targets :proposal proposal}))

(defn conversation-material [snapshot history-text]
  {:repository (:repository snapshot) :pr (:pr snapshot)
   :canonical-source-inputs (:canonical-source-inputs snapshot)
   :native-corpus (get-in snapshot [:selected :preservation-custody :native-corpus])
   :threads (:threads snapshot) :selected (:selected snapshot)
   :raw-issue-comments (:raw-issue-comments snapshot) :issue-comments (:issue-comments snapshot)
   :history (:history snapshot) :history-source-text history-text :history-source (:history-source snapshot)
   :protected-history-source-text (:protected-history-source-text snapshot)})

(defn prepare-input [snapshot inventory request history-text protocol-text provenance]
  (when-not (= (:head request) (:head inventory)) (host/refuse! :input-source-head))
  (let [material (conversation-material snapshot history-text)
        full (host/json {:version 1 :purpose "positive-cohort-assessment" :conversation material
                         :actual-proposal request :source-inventory inventory :canonical-protocol protocol-text})]
    {:text full
     :manifest {:schema "open-hax.positive-cohort-assessment-input/v1" :purpose "positive-cohort-assessment"
                :head_sha (:head request) :context_sha256 (host/sha256 (host/json material))
                :proposal_id (:proposal-id request) :proposal_body_sha256 (:proposal-body-sha256 request)
                :source_inventory_sha256 (:sha256 inventory)
                :target {:repository (get-in snapshot [:repository :nameWithOwner])
                         :repository_id (get-in snapshot [:repository :id])
                         :repository_database_id (get-in snapshot [:repository :databaseId])
                         :pr_id (get-in snapshot [:pr :id]) :pr_number (get-in snapshot [:pr :number])
                         :cohort_targets (:cohort-targets request)}
                :full_input {:path input-name :bytes (host/utf8-length full) :sha256 (host/sha256 full)}
                :provenance provenance}}))

(defn- bound-input! [deps snapshot inventory request source config]
  (when-not (= source (:manifest (prepare-input snapshot inventory request (:history-text deps)
                                               (:protocol-text deps) (:provenance config))))
    (host/refuse! :fresh-input-binding)))
(defn rebind-input [deps config source]
  ((:verify-sources! deps)) ((:verify-run! deps))
  (let [snapshot (collect deps config) inventory ((:inventory! deps))
        request (request! snapshot (:proposal-id config))]
    (bound-input! deps snapshot inventory request source config)
    snapshot))

(defn- actual-record! [record actual body user]
  (when-not (and (pos-int? (:id record)) (string? (:node_id record))
                 (not (str/blank? (:node_id record))) (= body (:body record))
                 (= user (select-keys (:user record) [:login :id :node_id :type]))
                 (= (select-keys record [:id :node_id :body :user :created_at :updated_at :html_url])
                    (select-keys actual [:id :node_id :body :user :created_at :updated_at :html_url])))
    (host/refuse! :native-get-mismatch)))

(defn- observed-cohort! [before after record source inventory body user]
  ;; Compare original native facts after exactly one issue append; removing the
  ;; last record here never creates a corpus used for canonical admission.
  (when-not (and (= (inc (count (:raw-issue-comments before))) (count (:raw-issue-comments after)))
                 (= (:raw-issue-comments before) (pop (:raw-issue-comments after)))
                 (= (:issue-comments before) (pop (:issue-comments after)))
                 (= (mapv #(select-keys % [:id :comments]) (:threads before))
                    (mapv #(select-keys % [:id :comments]) (:threads after)))
                 (= (:id record) (:id (last (:raw-issue-comments after))))
                 (= (select-keys before [:repository :pr :raw-threads :history :history-source :protected-history-source-text :canonical-source-inputs])
                    (select-keys after [:repository :pr :raw-threads :history :history-source :protected-history-source-text :canonical-source-inputs]))
                 (= (:source_inventory_sha256 source) (:sha256 inventory)))
    (host/refuse! :native-append-context-change))
  (let [targets (get-in source [:target :cohort_targets])
        selected (vec (sort-by :id (filter #(some #{(positive/member-target %)} targets) (:threads after))))
        proofs (mapv #(positive/proof (assoc % :actionability-observations (:history after))) selected)]
    (when-not (and (= targets (mapv positive/member-target selected))
                   (= (:preservation-source-inputs (:selected before)) (:preservation-source-inputs (:selected after)))
                   (= (:proposal_id source) (:id (:source (positive/latest-proposal (:selected after)))))
                   (every? #(and (:qualified? %) (not (:settled? %))
                                 (= targets (:cohort-targets %)) (= (:id record) (:assessment-id %))) proofs))
      (host/refuse! :canonical-actual-assessment))
    {:status :observed :record-id (:id record) :node-id (:node_id record) :url (:html_url record)
     :body-sha256 (host/sha256 body) :native-user user
     :native-record (select-keys record [:id :node_id :body :user :created_at :updated_at :html_url])
     :canonical-assessment-qualified true :cohort-targets targets
     :member-proofs (mapv #(dissoc % :observations) proofs)
     :admitted false :settlement-performed false :resolution-performed false :review-credit false}))

(defn ^:async publish
  "One independent native assessment append, never a pull review or settlement."
  [{:keys [verify-sources! verify-run! verify-invocation! inventory! publisher-proof!
           post! get-comment! accepted-sha256] :as deps} config]
  (verify-sources!) (verify-run!)
  (let [invocation (verify-invocation!) source (:source invocation)
        _ (when-not (and (string? accepted-sha256) (re-matches #"[0-9a-f]{64}" accepted-sha256)
                         (= accepted-sha256 (:accepted-sha256 invocation))) (host/refuse! :trusted-invocation-digest))
        _ (when-not (carrier/admissible-submission? (:submission invocation)) (host/refuse! :adverse-submission))
        before (rebind-input deps config source)
        proof (publisher-proof!) user (:user proof)
        _ (when-not (and (= expected-publisher user)
                         (= [{:id (get-in before [:repository :databaseId]) :full_name (:repo config)}]
                            (mapv #(select-keys % [:id :full_name]) (:repositories proof))))
            (host/refuse! :publisher-repository-or-principal))
        prospective (positive/assessment-publication (:selected before)
                                                      (get-in invocation [:submission :summary]) user)
        _ (when-not (and (:eligible? prospective) (= (:proposal_id source) (:proposal-id prospective))
                         (= (:proposal_body_sha256 source) (:proposal-body-sha256 prospective))
                         (= (get-in source [:target :cohort_targets]) (:cohort-targets prospective)))
            (host/refuse! :prospective-body))
        body (:body prospective)
        last-before (rebind-input deps config source)]
    (when-not (= (conversation-material before (:history-text deps))
                 (conversation-material last-before (:history-text deps)))
      (host/refuse! :pre-write-context-change))
    (let [result (try (await (post! (:repo config) (:pr-number config) body))
                      (catch :default _ {:outcome :uncertain :transport-boundary-threw true}))]
      (try
        (when-not (#{:posted :refused :uncertain} (:outcome result)) (host/refuse! :native-write-outcome))
        (when (= :refused (:outcome result)) (host/refuse! :native-write-refused))
        (verify-sources!) (verify-run!)
        (let [after (collect deps config)
              record (last (:issue-comments after)) actual (get-comment! (:id record))]
          (when (and (= :posted (:outcome result)) (not= (:id record) (get-in result [:record :id])))
            (host/refuse! :native-post-record-mismatch))
          (actual-record! record actual body user)
          ;; GET performs another native read. Recollect the entire corpus and
          ;; permissions afterward; that read must not hide concurrent churn.
          (verify-sources!) (verify-run!)
          (let [last-after (collect deps config) last-inventory (inventory!)]
            (when-not (= (conversation-material after (:history-text deps))
                         (conversation-material last-after (:history-text deps)))
              (host/refuse! :post-get-context-change))
            (cond-> (assoc (observed-cohort! before last-after record source last-inventory body user)
                           :outcome (:outcome result) :actual-write-outcome (select-keys result [:outcome :http-status :transport-boundary-threw])
                           :write-performed true :retry-performed false)
              (= :uncertain (:outcome result))
              (assoc :status :unestablished :refusal-code :uncertain-native-write :native-readback-observed true))))
        (catch :default e
          {:status :unestablished :outcome (:outcome result)
           :actual-write-outcome (select-keys result [:outcome :http-status :transport-boundary-threw])
           :actual-post-response (select-keys (:record result) [:id :node_id :body :user :created_at :updated_at :html_url])
           :refusal-code (or (:code (ex-data e)) :native-readback-error)
           :write-intent-performed true :retry-performed false :admitted false
           :settlement-performed false :resolution-performed false :review-credit false})))))
