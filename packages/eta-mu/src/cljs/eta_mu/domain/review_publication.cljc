;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.domain.review-publication
  "Pure decisions over facts supplied by trusted collection/verification ports.
  An origin keyword is a shaped fact, never authentication. The future adapter
  must independently collect native data, verify actual bytes and acquire the
  existing Clio durable claim before executing a proposed effect. No I/O here."
  (:require [eta-mu.law.review-publication :as law]))

(defn- refuse [reason]
  {:status :refused :action :refuse :reason reason :effects []})

(defn- observed? [now at]
  (and (law/natural? at) (<= at now)))

(defn- fresh? [now at policy]
  (and (observed? now at)
       (law/positive? (:observation-max-age-ms policy))
       (<= (- now at) (:observation-max-age-ms policy))))

(defn- collector-current? [registry collector]
  (let [source (:source-sha registry)]
    (and (contains? #{:schedule :workflow-run :workflow-dispatch} (:event collector))
         (law/commit? source)
         (= source (:source-sha collector) (:accepted-default-sha collector)
            (:adopted-default-sha collector) (:registry-source-sha collector)))))

(defn- enrolled? [entry collector]
  (case (:mode collector)
    :ordinary (and (true? (:enabled? entry)) (false? (:fixture? entry))
                   (nil? (:fixture-id collector)))
    :qualification-only (and (= :workflow-dispatch (:event collector))
                             (true? (:fixture? entry))
                             (= (:fixture-id collector) (get-in entry [:repository :id])))
    false))

(defn- tuple-current? [tuple]
  (and (= :open (:state tuple)) (false? (:draft? tuple))
       (true? (:mergeable? tuple)) (true? (:base-ancestor? tuple))
       (= [(:base-sha tuple) (:head-sha tuple)] (:merge-parents tuple))
       (= (:head-tree tuple) (:merge-tree tuple))))

(defn- run-bound? [entry tuple run]
  (let [producer (:producer entry)]
    (and (= (:id producer) (:workflow-id run))
         (= (:path producer) (:workflow-path run))
         (= (:source-sha producer) (:workflow-source-sha run))
         (= (:base-sha tuple) (:base-sha run))
         (= (:head-sha tuple) (:head-sha run))
         (= (:event-sha tuple) (:event-sha run))
         (= (:commands producer) (:commands run))
         (= (set (:required-jobs producer)) (set (map :name (:jobs run)))))))

(defn- evidence-bound? [now entry snapshot]
  (let [{:keys [tuple run artifact verification submission]} snapshot
        archive (:archive-proof artifact)]
    (and (= (:id run) (:run-id artifact) (:run-id verification))
         (= (:attempt run) (:attempt artifact) (:attempt verification))
         (= (:id artifact) (:artifact-id archive) (:artifact-id verification))
         (= (:sha256 artifact) (:sha256 archive) (:artifact-sha256 verification))
         (< now (:expires-at-ms artifact))
         (<= (:size-bytes artifact) (get-in archive [:bounds :download-bytes]))
         (fresh? now (:completed-at-ms archive) (:status-policy entry))
         (fresh? now (:completed-at-ms verification) (:status-policy entry))
         (= (get-in entry [:sources :muse]) (get-in verification [:publisher-validation :module-source]))
         (= (:submission verification) (get-in verification [:publisher-validation :submission-sha256]))
         (= (:sources entry) (:sources snapshot) (:sources verification))
         (= tuple (:tuple verification))
         (= submission (:submission-envelope verification)))))

(defn- publication-binding [entry snapshot registry collector]
  (let [{:keys [repository tuple run artifact verification submission]} snapshot
        sources (:sources entry)
        proof (select-keys verification [:full-input :input-verification :trace :submission
                                        :invocation :discovery :context :page-count :publisher-validation])
        archive (select-keys artifact [:id :run-id :attempt :size-bytes :sha256 :expires-at-ms])
        run (update run :jobs #(vec (sort-by :name %)))
        key [:review-publication/v1 (:id repository) (:pr-number tuple)
             (:base-sha tuple) (:head-sha tuple) (:event-sha tuple) (:merge-sha tuple)
             (:id run) (:attempt run) (:id artifact) (:sha256 artifact) sources proof
             {:collector-source (:source-sha collector) :registry-source (:source-sha registry)}]]
    {:repository repository :tuple tuple :sources sources :run run :artifact archive
     :verification proof :submission submission :publisher (:publisher entry)
     :publication-payload (get-in verification [:publisher-validation :payload])
     :setup (:setup entry) :hosted-proof (:hosted-proof entry)
     :collector-source (:source-sha collector) :registry-source (:source-sha registry)
     :intent-key key :lock-key [(:id repository) (:merge-sha tuple) law/context]
     :status-meaning :publication-evidence-integrity :merge-approval? false}))

(defn admit
  "Admit decoded independently verified facts without requesting any effects.
  Registry/collector/setup provenance must be established outside candidate
  control by trusted ports; shape checks do not establish that provenance."
  [{:keys [now-ms registry collector target-id snapshot] :as context}]
  (let [entries (:targets registry)
        entry (first (filter #(= target-id (get-in % [:repository :id])) entries))
        {:keys [tuple run artifact verification submission]} snapshot]
    (cond
      (not (law/natural? now-ms)) (refuse :clock)
      (not (law/registry? registry)) (refuse :registry)
      (not (collector-current? registry collector)) (refuse :collector-source)
      (not entry) (refuse :unenrolled-target)
      (not (enrolled? entry collector)) (refuse :enrollment)
      (not= (:repository entry) (:repository snapshot)) (refuse :repository)
      (not (fresh? now-ms (:observed-at-ms snapshot) (:status-policy entry))) (refuse :snapshot-clock)
      (not= (:setup entry) (:setup snapshot)) (refuse :setup)
      (not= target-id (get-in entry [:setup :repository-id])) (refuse :setup-target)
      (not= (:source-sha registry) (get-in entry [:setup :default-sha])) (refuse :setup-source)
      (not= (:publisher entry) (:publisher snapshot)) (refuse :publisher)
      (and (not (:fixture? entry))
           (or (not= (:hosted-proof entry) (:hosted-proof snapshot))
               (not= (:source-sha registry) (get-in entry [:hosted-proof :source-sha]))))
      (refuse :hosted-proof)
      (not (law/tuple? tuple)) (refuse :tuple)
      (= :unknown (:mergeable? tuple)) {:status :pending :reason :mergeability :effects []}
      (not (tuple-current? tuple)) (refuse :integration-tuple)
      (not (and (law/run? run) (run-bound? entry tuple run))) (refuse :producer-run)
      (not (law/artifact? artifact)) (refuse :artifact)
      (not (and (law/verification? verification) (law/submission? submission))) (refuse :verification)
      (not (evidence-bound? now-ms entry snapshot)) (refuse :evidence-binding)
      :else {:status :admitted :effects [] :entry entry :context context
             :binding (publication-binding entry snapshot registry collector)})))

(defn- current-admission [admission]
  (let [current (admit (:context admission))]
    (when (and (= :admitted (:status admission) (:status current))
               (= (:binding admission) (:binding current))
               (= (:entry admission) (:entry current)))
      current)))

(defn- intent-bound? [admission intent]
  (= (:binding admission) (:binding intent)))

(defn- winning-claim? [binding intent claim]
  (and (law/claim? claim)
       (= (:intent-key binding) (:intent-key claim))
       (= (:lock-key binding) (:lock-key claim))
       (law/natural? (:version intent))
       (= (:version intent) (:previous-version claim))))

(defn publication-plan
  "Plan reservation, durable claim, then one review POST. A generic reserved
  intent never authorizes POST. A winning claim is a one-use receipt produced
  by the trusted durable port, not candidate input; the adapter must journal
  post-started before POST and never replay a won receipt as a fresh claim.
  Returned intent is the next state. Unknown outcomes permit discovery only.
  Effects are proposals; their data fields do not authenticate a claim."
  [admission intent claim]
  (if-let [{:keys [binding] :as current} (current-admission admission)]
    (cond
      (nil? intent)
      {:status :pending :action :reserve-intent
       :intent {:state :reserved :binding binding :version 0}
       :effects [{:type :reserve-intent :intent-key (:intent-key binding) :lock-key (:lock-key binding)}]}
      (not (intent-bound? current intent)) (refuse :intent-binding)
      (contains? #{:post-started :post-unknown} (:state intent))
      {:status :pending :action :discover-review :intent intent :effects []}
      (= :ambiguous-absence (:state intent))
      {:status :blocked :action :blocked :reason :unknown-review-outcome :intent intent :effects []}
      (= :observed (:state intent))
      {:status :pending :action :verify-readback :intent intent :effects []}
      (not= :reserved (:state intent)) (refuse :intent-state)
      (nil? claim)
      {:status :pending :action :claim-review-post :intent intent
       :effects [{:type :claim-review-post :intent-key (:intent-key binding)
                  :lock-key (:lock-key binding) :expected-version (:version intent)}]}
      (not (winning-claim? binding intent claim)) (refuse :post-claim)
      :else
      {:status :pending :action :post-review
       :intent (assoc intent :state :post-started :version (:version claim)
                      :claim-id (:claim-id claim) :owner (:owner claim))
       :effects [{:type :post-review :intent-key (:intent-key binding)
                  :lock-key (:lock-key binding) :claim-id (:claim-id claim)
                  :head-sha (get-in binding [:tuple :head-sha])
                  :submission (:submission binding)}]})
    (refuse :admission)))

(defn- comments-match? [expected actual publisher head review-id]
  (and (vector? actual) (= (count expected) (count actual))
       (every? #(and (law/positive? (:id %)) (law/comment? (:payload %))
                      (= (:actor publisher) (:actor %))
                      (= head (:head-sha %)) (= review-id (:review-id %))) actual)
       (= (count actual) (count (distinct (map :id actual))))
       ;; Native API order is not semantic. Each exact typed payload must
       ;; occur the same number of times; missing and unexpected comments fail.
       (= (frequencies expected) (frequencies (map :payload actual)))))

(defn- readback-bound? [now binding intent readback policy]
  (let [review (:review readback) payload (:publication-payload binding)]
    (and (= :trusted-native-readback (:origin readback))
         (= (:intent-key binding) (:intent-key readback))
         (= (:tuple binding) (:tuple readback))
         (fresh? now (:observed-at-ms readback) policy)
         (law/https-url? (:receipt-url readback))
         (= (:receipt-url intent) (:receipt-url readback))
         (law/positive? (:id review)) (= (:review-id intent) (:id review))
         (= (:publisher binding) (:publisher review))
         (= (get-in binding [:tuple :head-sha]) (:head-sha review))
         (= (:event payload) (:event review)) (= (:body payload) (:body review))
         (true? (:complete? review))
         (comments-match? (:comments payload) (:comments review)
                          (:publisher binding) (get-in binding [:tuple :head-sha]) (:id review)))))

(defn- history-bound? [now binding history policy]
  (and (law/status-history? history)
       (fresh? now (:observed-at-ms history) policy)
       (every? #(and (= (:publisher binding) (:publisher %))
                      (= (get-in binding [:tuple :merge-sha]) (:sha %))
                      (= law/context (:context %))
                      (law/https-url? (:receipt-url %))
                      (observed? now (:created-at-ms %))) (:statuses history))))

(defn status-plan
  "Revalidate admission and complete native readback before proposing success
  on M only. A fresh success deduplicates; due refresh never repeats the review
  POST or inference. Unknown status POST must be discovered by native GET before
  a later call. `effects` enumerates proposed mutations, not observations.
  The future adapter must acquire a winning Clio target/M/context claim, recheck
  native tuple/history and retain an uncertain POST before any wire effect.
  This pure proposal alone does not establish concurrent at-most-one writes."
  [admission intent readback history]
  (if-let [{:keys [binding entry context] :as current} (current-admission admission)]
    (let [now (:now-ms context)
          policy (:status-policy entry)
          interval (get policy :refresh-ms law/default-refresh-ms)
          statuses (:statuses history)
          latest (last (sort-by (juxt :created-at-ms :id) statuses))
          due (when latest (+ (:created-at-ms latest) interval))]
      (cond
        (not (and (intent-bound? current intent) (= :observed (:state intent)))) (refuse :intent)
        (not (readback-bound? now binding intent readback policy)) (refuse :native-review-readback)
        (not (history-bound? now binding history policy)) (refuse :status-history)
        (= :unknown (:last-write-outcome history))
        {:status :blocked :action :discover-status :reason :unknown-status-outcome :effects []}
        (not (law/natural? (+ now interval))) (refuse :clock-range)
        (and (= :success (:state latest)) (< now due)
             (= (:receipt-url intent) (:receipt-url latest)))
        {:status :qualified :action :unchanged :effects [] :next-refresh-at-ms due
         :last-success-at-ms (:created-at-ms latest) :status-meaning :publication-evidence-integrity}
        (>= (count statuses) (:max-writes policy)) (refuse :status-write-budget)
        :else
        {:status :pending :action :write-status :next-refresh-at-ms (+ now interval)
         :last-success-at-ms (when (= :success (:state latest)) (:created-at-ms latest))
         :effects [{:type :post-status :publisher (:publisher binding)
                    :sha (get-in binding [:tuple :merge-sha]) :context law/context :state :success
                    :receipt-url (:receipt-url intent) :lock-key (:lock-key binding)
                    :intent-key (:intent-key binding) :expected-write-count (count statuses)
                    :max-writes (:max-writes policy)}]}))
    (refuse :admission)))
