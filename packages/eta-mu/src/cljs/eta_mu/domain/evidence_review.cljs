(ns eta-mu.domain.evidence-review
  "Pure admission and aggregation laws for parallel evidence-review lanes.

  Model and agent outputs enter as candidate lane results. This namespace binds
  them to one immutable review snapshot, rejects unsupported evidence, preserves
  contradictions, and computes a deterministic conclusion. It performs no I/O
  and has no GitHub publication authority."
  (:require [eta-mu.law.evidence-review :as law]))

(def ^:private snapshot-keys
  [:schema/version
   :review/repository-id
   :review/pull-request
   :review/head
   :review/snapshot-hash
   :review/dependency-closure-hash
   :review/episode])

(defn confirmed-blocker?
  [finding]
  (and (= :confirmed (:finding/status finding))
       (= :blocking (:finding/disposition finding))))

(defn- confirmed-advisory?
  [finding]
  (and (= :confirmed (:finding/status finding))
       (= :advisory (:finding/disposition finding))))

(defn- contradiction?
  [finding]
  (= :contradicted (:finding/status finding)))

(defn- confidence-valid?
  [finding]
  (let [confidence (:finding/confidence finding)]
    (and (number? confidence)
         (<= 0 confidence 1))))

(defn- scope-valid?
  [finding]
  (case (:finding/scope finding)
    :changed-line
    (and (string? (:finding/path finding))
         (seq (:finding/path finding))
         (int? (:finding/line finding))
         (pos? (:finding/line finding)))

    :repository-invariant
    (and (string? (:finding/invariant finding))
         (seq (:finding/invariant finding)))

    false))

(defn- evidence-retained?
  [inspected-hashes finding]
  (let [evidence (:finding/evidence finding)]
    (and (seq evidence)
         (every? #(contains? inspected-hashes (:artifact/hash %)) evidence))))

(defn admissible-finding?
  "True when a finding is structurally valid, scoped, and cites retained lane
  artifacts. Confirmed blockers additionally require a concrete failure trace."
  [inspected-artifacts finding]
  (let [inspected-hashes (set (map :artifact/hash inspected-artifacts))]
    (and (confidence-valid? finding)
         (scope-valid? finding)
         (evidence-retained? inspected-hashes finding)
         (or (not (confirmed-blocker? finding))
             (and (string? (:finding/failure-trace finding))
                  (seq (:finding/failure-trace finding)))))))

(defn- snapshot-facts
  [value]
  (select-keys value snapshot-keys))

(defn- target-matches?
  [snapshot lane-result]
  (= (snapshot-facts snapshot)
     (snapshot-facts lane-result)))

(defn- result-rejection-reasons
  [snapshot required-lanes lane-result]
  (let [shape-valid? (law/valid-lane-result-shape? lane-result)
        lane (:evidence/lane lane-result)
        inspected (:coverage/inspected lane-result)
        findings (:findings lane-result)]
    (cond-> []
      (not shape-valid?)
      (conj :invalid-result-shape)

      (and shape-valid? (not (contains? required-lanes lane)))
      (conj :unexpected-lane)

      (and shape-valid? (not (target-matches? snapshot lane-result)))
      (conj :review-snapshot-mismatch)

      (and shape-valid?
           (= :complete (:coverage/status lane-result))
           (empty? inspected))
      (conj :complete-without-inspected-artifacts)

      (and shape-valid?
           (not-every? #(admissible-finding? inspected %) findings))
      (conj :unsupported-finding))))

(defn- rejection-records
  [lane-result reasons]
  (mapv (fn [reason]
          (cond-> {:rejection/reason reason}
            (keyword? (:evidence/lane lane-result))
            (assoc :evidence/lane (:evidence/lane lane-result))))
        reasons))

(defn- finding-key
  [finding]
  [(:finding/claim finding)
   (:finding/path finding)
   (:finding/line finding)
   (:finding/invariant finding)
   (:finding/status finding)
   (:finding/disposition finding)
   (->> (:finding/evidence finding)
        (map :artifact/hash)
        sort
        vec)])

(defn- dedupe-findings
  [findings]
  (->> findings
       (sort-by pr-str)
       (reduce (fn [{:keys [seen values] :as state} finding]
                 (let [key (finding-key finding)]
                   (if (contains? seen key)
                     state
                     {:seen (conj seen key)
                      :values (conj values finding)})))
               {:seen #{} :values []})
       :values))

(defn- lane-status
  [lane selected-results conflict-lanes rejected-lanes]
  (cond
    (contains? conflict-lanes lane)
    :conflicted

    (contains? selected-results lane)
    (:coverage/status (get selected-results lane))

    (contains? rejected-lanes lane)
    :rejected

    :else
    :missing))

(defn- status-reason
  [status]
  (case status
    :missing :missing-required-lane
    :rejected :rejected-required-lane
    :conflicted :conflicting-lane-results
    :partial :partial-required-lane
    :blocked :blocked-required-lane
    :unavailable :unavailable-required-lane
    :timed-out :timed-out-required-lane
    :failed :failed-required-lane
    :stale :stale-required-lane
    nil))

(defn- validated-verdict
  [verdict]
  (if (law/valid-aggregate-verdict? verdict)
    verdict
    (throw (ex-info "Evidence aggregation produced an invalid verdict"
                    {:errors (law/explain-aggregate-verdict verdict)
                     :verdict verdict}))))

(defn aggregate-verdict
  "Validate and fold candidate lane results for one immutable review snapshot.

  A sound confirmed blocker yields `:failure` even when another lane is
  incomplete. Without a blocker, missing, rejected, conflicting, stale, partial,
  timed-out, failed, blocked, or unavailable required evidence yields `:blocked`.
  `:success` requires every required lane to be complete."
  [snapshot required-lanes lane-results]
  (when-not (law/valid-review-snapshot? snapshot)
    (throw (ex-info "Invalid review snapshot"
                    {:errors (law/explain-review-snapshot snapshot)})))
  (when-not (and (set? required-lanes)
                 (seq required-lanes)
                 (every? keyword? required-lanes))
    (throw (ex-info "Required evidence lanes must be a non-empty keyword set"
                    {:required-lanes required-lanes})))
  (let [validation (mapv (fn [lane-result]
                           {:result lane-result
                            :reasons (result-rejection-reasons
                                      snapshot required-lanes lane-result)})
                         lane-results)
        rejected (filterv (comp seq :reasons) validation)
        accepted (->> validation
                      (remove (comp seq :reasons))
                      (map :result)
                      distinct
                      vec)
        accepted-by-lane (group-by :evidence/lane accepted)
        conflict-lanes (->> accepted-by-lane
                            (keep (fn [[lane results]]
                                    (when (> (count results) 1) lane)))
                            set)
        selected-results (->> accepted-by-lane
                              (remove (fn [[lane _]]
                                        (contains? conflict-lanes lane)))
                              (map (fn [[lane results]] [lane (first results)]))
                              (into {}))
        rejected-lanes (->> rejected
                            (keep (comp :evidence/lane :result))
                            set)
        rejections (->> rejected
                        (mapcat (fn [{:keys [result reasons]}]
                                  (rejection-records result reasons)))
                        (concat (map (fn [lane]
                                       {:rejection/reason :conflicting-lane-results
                                        :evidence/lane lane})
                                     conflict-lanes))
                        (sort-by pr-str)
                        vec)
        lane-statuses (->> required-lanes
                           (sort-by str)
                           (mapv (fn [lane]
                                   {:evidence/lane lane
                                    :coverage/status (lane-status lane
                                                                  selected-results
                                                                  conflict-lanes
                                                                  rejected-lanes)})))
        findings (->> selected-results
                      vals
                      (mapcat :findings)
                      dedupe-findings
                      vec)
        blockers (filterv confirmed-blocker? findings)
        advisories (filterv confirmed-advisory? findings)
        contradictions (filterv contradiction? findings)
        incomplete-statuses (->> lane-statuses
                                 (remove #(= :complete (:coverage/status %)))
                                 vec)
        reasons (->> (concat
                      (when (seq blockers) [:confirmed-blocker])
                      (when (seq rejections) [:rejected-evidence])
                      (keep (comp status-reason :coverage/status)
                            incomplete-statuses))
                     distinct
                     (sort-by str)
                     vec)
        conclusion (cond
                     (seq blockers) :failure
                     (or (seq rejections) (seq incomplete-statuses)) :blocked
                     :else :success)]
    (validated-verdict
     (merge snapshot
            {:aggregate/conclusion conclusion
             :aggregate/reasons reasons
             :aggregate/required-lanes required-lanes
             :aggregate/lane-statuses lane-statuses
             :aggregate/rejections rejections
             :aggregate/findings findings
             :aggregate/confirmed-blockers blockers
             :aggregate/advisories advisories
             :aggregate/contradictions contradictions}))))
