;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.infra.rejection-assessment
  "Compose existing canonical rejection APIs and native readers. Never settle or resolve."
  (:require [clojure.string :as str]
            [eta-mu.law.rejection-assessment :as assessment-law]
            [pr-flow.native-context :as native] [pr-flow.native-context-law :as context-law]
            [pr-flow.permissions :as permissions] [pr-flow.actionability-history :as history]
            [pr-flow.law :as law] [eta-mu.extern.actionability-host :as host]))

;; External source preparation only. Root must bind actual protected successors
;; after independent qualification, source review and native merge readback.
(def dependency-pins {:canonical "5cea3e51a15d19277bd642147292c11b82de5369" :muse "b7e4f98f550780a7b484b1525f53ad2934e29dad"})
(def expected-publisher
  {:login "eta-mu-ai[bot]" :id 270021952 :node_id "BOT_kgDOEBg1QA" :type "Bot"})
(def host-route {:workflow-file "opencode-rejection-assessment.yml"
                 :producer-jobs ["Prepare rejection input" "Assess complete rejection input"]})
(def input-name "rejection-assessment-input.txt")
(def prepared-files [input-name "input-manifest.json" "prompt.txt" "tools.txt" "host-input-custody.json"
                     "history-source.edn" "history-source.json"])
(defn require-protected-dependencies! []
  (when-not (every? #(and (string? %) (re-matches #"[0-9a-f]{40}" %)) (vals dependency-pins))
    (host/refuse! :unadopted-dependency-pins))
  dependency-pins)

(defn acquire-history-input
  "Acquire selected complete bytes at prepare; later reuse the same input artifact.
   Root supplies actual canonical CLI selection and whole-source hashes, never a decoded subset."
  [{:keys [kind source-file cli-file expected-sha expected-cli-sha]} cfg pins directory prepare?]
  (let [source-sha (host/sha256 (host/read-bytes source-file))
        cli-sha (host/sha256 (host/read-bytes cli-file))
        text (host/read-text source-file true)
        coordinate {:version 1 :source-kind kind :source-file source-file :cli-file cli-file
                    :source-sha256 source-sha :source-bytes (host/utf8-length text) :cli-sha256 cli-sha
                    :canonical-revision (:canonical pins)
                    :target (select-keys cfg [:repo :repository-database-id :pr-number :head
                                             :thread-id :root-comment-id :proposal-id])}
        carrier-text (if prepare? text (host/read-text (host/join directory "history-source.edn") true))
        carrier-coordinate (if prepare? coordinate (host/read-json (host/join directory "history-source.json")))]
    (when-not (and (#{"protected-checkout" "installed-cli"} kind)
                   (re-matches #"[0-9a-f]{64}" expected-sha)
                   (re-matches #"[0-9a-f]{64}" expected-cli-sha)
                   (= expected-sha source-sha (host/sha256 text) (host/sha256 carrier-text))
                   (= expected-cli-sha cli-sha)
                   (= coordinate carrier-coordinate))
      (host/refuse! :history-source-custody))
    {:text carrier-text :coordinate coordinate}))

(defn collect
  "Select original complete native context; permissions use the same authenticated reader."
  [{:keys [read-json history-text protected-history-text history-source]}
   {:keys [repo pr-number policy root-comment-id] :as config}]
  (let [authorized (fn [r login]
                     (when (and login (not (law/bot? login)))
                       (try
                         (boolean (permissions/writer-role?
                                   (:permission (read-json "api" (str "repos/" r "/collaborators/" login "/permission")))))
                         (catch :default e
                           (if (= 404 (:status (ex-data e))) false (throw e))))))
        snapshot (native/collect-context {:read-json read-json :authorized-author? authorized
                                          :read-history (fn [repo-id]
                                                          (let [selected (history/observations history-text repo-id)
                                                                protected (history/observations protected-history-text repo-id)]
                                                            (when-not (and (vector? selected) (vector? protected)
                                                                           (= selected protected))
                                                              (host/refuse! :history-source-reconciliation))
                                                            selected))} repo pr-number)
        selection (context-law/select-fresh-context snapshot config)]
    (when (:refusal selection) (host/refuse! :fresh-context))
    (when-not (= root-comment-id (:root-comment-id (:selected selection)))
      (host/refuse! :root-coordinate))
    (assoc snapshot :history-source history-source :protected-history-source-text protected-history-text
           :selected (assoc (:selected selection) :identities (:review/identities policy)))))

(defn request! [snapshot proposal-id]
  (let [request (law/rejection-assessment-request (:selected snapshot) proposal-id expected-publisher)]
    (when-not (:eligible? request) (host/refuse! :canonical-proposal))
    request))

(defn conversation-material
  "Complete ordered native material and actual permission results; no native agreement is synthesized."
  [snapshot history-text]
  {:repository (:repository snapshot) :pr (:pr snapshot)
   :selected-thread (dissoc (:selected snapshot) :issue-comments)
   :raw-issue-comments (:raw-issue-comments snapshot)
   :issue-comments (:issue-comments snapshot)
   :history (:history snapshot) :history-source-text history-text
   :history-source (:history-source snapshot)
   :protected-history-source-text (:protected-history-source-text snapshot)})

(defn prepare-input [snapshot inventory request history-text protocol-text provenance]
  (when-not (= (:head request) (:head inventory)) (host/refuse! :input-source-head))
  (let [material (conversation-material snapshot history-text)
        digest (host/sha256 (host/json material))
        full (host/json {:version 1 :purpose "rejection-assessment" :conversation material
                         :actual-proposal request :source-inventory inventory :canonical-protocol protocol-text})]
    {:text full
     :manifest {:schema "open-hax.rejection-assessment-input/v1" :purpose "rejection-assessment"
                :head_sha (:head request) :context_sha256 digest :proposal_id (:proposal-id request)
                :proposal_body_sha256 (host/sha256 (:proposal-body request))
                :source_inventory_sha256 (:sha256 inventory)
                :target {:repository_id (get-in snapshot [:repository :id])
                         :repository_database_id (get-in snapshot [:repository :databaseId])
                         :pr_id (get-in snapshot [:pr :id]) :pr_number (get-in snapshot [:pr :number])
                         :thread_id (:thread-id request) :root_comment_id (:root-comment-id request)}
                :full_input {:path input-name :bytes (host/utf8-length full) :sha256 (host/sha256 full)}
                :provenance provenance}}))

(defn- bound-input! [deps snapshot inventory request source config]
  (let [fresh (prepare-input snapshot inventory request (:history-text deps) (:protocol-text deps) (:provenance config))]
    (when-not (= source (:manifest fresh)) (host/refuse! :fresh-input-binding))))

(defn rebind-input [deps config source]
  ((:verify-sources! deps)) ((:verify-run! deps))
  (let [snapshot (collect deps config) inventory ((:inventory! deps))
        request (request! snapshot (:proposal-id config))]
    (bound-input! deps snapshot inventory request source config)
    snapshot))

(defn- body-matches [snapshot body user]
  (filterv #(and (= body (:body %)) (= user (select-keys (:user %) [:login :id :node_id :type])))
           (:issue-comments snapshot)))
(defn- without-observed [snapshot record-id]
  (let [drop-record #(filterv (fn [c] (not= record-id (:id c))) %)]
    (-> snapshot (update :raw-issue-comments drop-record) (update :issue-comments drop-record)
        (update-in [:selected :issue-comments] drop-record))))
(defn- observed-record! [record actual body user]
  (when-not (and (pos-int? (:id record)) (string? (:node_id record))
                 (not (str/blank? (:node_id record))) (string? (:html_url record))
                 (not (str/blank? (:html_url record))) (string? (:created_at record))
                 (string? (:updated_at record)) (= body (:body record))
                 (= user (select-keys (:user record) [:login :id :node_id :type]))
                 (= (select-keys record [:id :node_id :body :user :created_at :updated_at :html_url])
                    (select-keys actual [:id :node_id :body :user :created_at :updated_at :html_url])))
    (host/refuse! :native-get-mismatch))
  {:status :observed :record-id (:id actual) :node-id (:node_id actual) :url (:html_url actual)
   :created-at (:created_at actual) :updated-at (:updated_at actual) :body-sha256 (host/sha256 (:body actual))
   :native-user (select-keys (:user actual) [:login :id :node_id :type])
   :native-record (select-keys actual [:id :node_id :body :user :created_at :updated_at :html_url])
   :admitted false :native-agreement-admitted false :settlement-performed false :resolution-performed false :review-credit false})

(defn ^:async publish
  "One issue write at most. Native observations never substitute for final canonical rejection admission."
  [{:keys [verify-sources! verify-run! verify-invocation! inventory! publisher-proof!
           post! get-comment! accepted-sha256] :as deps} config]
  (verify-sources!) (verify-run!)
  (let [invocation (verify-invocation!)
        _ (when-not (and (string? accepted-sha256) (re-matches #"[0-9a-f]{64}" accepted-sha256)
                         (= accepted-sha256 (:accepted-sha256 invocation))) (host/refuse! :trusted-invocation-digest))
        _ (when-not (assessment-law/admissible-submission? (:submission invocation))
            (host/refuse! :adverse-submission))
        before (rebind-input deps config (:source invocation)) _inventory (inventory!)
        proof (publisher-proof!) user (:user proof)
        _ (when-not (and (= expected-publisher user)
                         (some #(and (= (get-in before [:repository :databaseId]) (:id %))
                                     (= (:repo config) (:full_name %))) (:repositories proof)))
            (host/refuse! :publisher-repository-or-principal))
        prospective (law/rejection-assessment-publication (:selected before) (:proposal-id config)
                                                          (get-in invocation [:submission :summary]) user)
        _ (when-not (:eligible? prospective) (host/refuse! :prospective-body))
        body (:body prospective) prior (body-matches before body user)]
    (when (> (count prior) 1) (host/refuse! :ambiguous-existing-assessment))
    ;; Recollect after authenticating the publisher, immediately before either
    ;; guarded dedup readback or the sole write. There is no caller-supplied permission flag.
    (let [last-before (rebind-input deps config (:source invocation))]
      (when-not (= (conversation-material before (:history-text deps))
                   (conversation-material last-before (:history-text deps)))
        (host/refuse! :pre-write-context-change)))
    (if (= 1 (count prior))
      (let [record (first prior) actual (get-comment! (:id record))]
        (assoc (observed-record! record actual body user) :outcome :already-observed :write-performed false))
      (let [result (try (await (post! (:repo config) (:pr-number config) body))
                        (catch :default _ {:outcome :uncertain :transport-boundary-threw true}))]
        ;; Preserve the actual one-shot outcome even when later readback fails.
        ;; The entry writes this returned result before failing the workflow.
        (try
          (when-not (#{:posted :refused :uncertain} (:outcome result)) (host/refuse! :native-write-outcome))
          (when (= :refused (:outcome result)) (host/refuse! :native-write-refused))
          (verify-sources!) (verify-run!)
          (let [after (collect deps config) current-inventory (inventory!)
                matches (body-matches after body user)]
            (when-not (= 1 (count matches)) (host/refuse! :uncertain-native-write))
            (let [record (first matches) actual (get-comment! (:id record))
                  prior-after (without-observed after (:id record))
                  request (request! prior-after (:proposal-id config))]
              (when (and (= :posted (:outcome result)) (not= (:id record) (get-in result [:record :id])))
                (host/refuse! :native-post-record-mismatch))
              (bound-input! deps prior-after current-inventory request (:source invocation) config)
              (assoc (observed-record! record actual body user)
                     :outcome (:outcome result)
                     :actual-write-outcome (select-keys result [:outcome :http-status :transport-boundary-threw])
                     :write-performed true :retry-performed false)))
          (catch :default e
            {:status :unestablished :outcome (:outcome result)
             :actual-write-outcome (select-keys result [:outcome :http-status :transport-boundary-threw])
             :actual-post-response (select-keys (:record result) [:id :node_id :body :user :created_at :updated_at :html_url])
             :refusal-code (or (:code (ex-data e)) :native-readback-error)
             :write-intent-performed true :retry-performed false :admitted false :native-agreement-admitted false
             :settlement-performed false :resolution-performed false :review-credit false}))))))
