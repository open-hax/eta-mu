(ns eta-mu.domain.evidence
  "Pure deterministic aggregation for typed evidence-lane results.

   The fold never executes a reviewer and never publishes to GitHub. It accepts
   only exact-head data described by `eta-mu.law.evidence` and returns a
   fail-closed decision that an infra publisher may later validate and render."
  (:require [clojure.string :as str]
            [eta-mu.law.evidence :as law]))

(def ^:private empty-finding-counts
  {:blocking 0
   :advisory 0
   :contradicted 0})

(defn- stable-keywords
  [values]
  (->> values
       (filter keyword?)
       distinct
       (sort-by str)
       vec))

(defn- stable-strings
  [values]
  (->> values
       (filter string?)
       distinct
       sort
       vec))

(defn- stable-findings
  [findings]
  (->> findings
       distinct
       (sort-by (fn [finding]
                  (str (:finding/id finding) "\u0000" (pr-str finding))))
       vec))

(defn- non-blank-string?
  [value]
  (and (string? value) (not (str/blank? value))))

(defn- confirmed?
  [finding]
  (= :confirmed (:finding/status finding)))

(defn- blocking?
  [finding]
  (= :blocking (:finding/disposition finding)))

(defn- advisory?
  [finding]
  (= :advisory (:finding/disposition finding)))

(defn- supported-confirmed-finding?
  [finding]
  (and (confirmed? finding)
       (seq (:finding/evidence finding))
       (or (advisory? finding)
           (and (blocking? finding)
                (non-blank-string? (:finding/failure-trace finding))))))

(defn- request-required-lanes
  [request]
  (stable-keywords (:required/lanes request)))

(defn- base-decision
  [request]
  (let [required-lanes (request-required-lanes request)]
    (cond-> {:schema/version 1
             :aggregate/status :evidence-unavailable
             :required/lanes required-lanes
             :complete/lanes []
             :missing/lanes required-lanes
             :finding/counts empty-finding-counts
             :findings []
             :problems []}
      (law/valid-aggregate-request? request)
      (assoc :review/target (:review/target request)
             :review/episode (:review/episode request)))))

(defn- malformed-request-decision
  [request]
  (assoc (base-decision request)
         :problems ["aggregate request failed its closed schema"]))

(defn- invalid-result-problems
  [results]
  (->> results
       (keep-indexed
        (fn [index result]
          (when-not (law/valid-lane-result? result)
            (str "lane result failed its closed schema: "
                 (or (some-> (:evidence/lane result) str)
                     (str "input-" index))))))
       stable-strings))

(defn- duplicate-values
  [values]
  (->> values
       frequencies
       (keep (fn [[value count]]
               (when (> count 1) value)))
       stable-keywords))

(defn- lane-result-groups
  [results]
  (group-by :evidence/lane results))

(defn- exact-target?
  [request result]
  (and (= (:review/target request) (:review/target result))
       (= (:review/episode request) (:review/episode result))))

(defn- target-problems
  [request valid-results]
  (->> valid-results
       (keep (fn [result]
               (when-not (exact-target? request result)
                 (str "lane target or episode does not match aggregate request: "
                      (:evidence/lane result)))))
       stable-strings))

(defn- required-coverage-problems
  [required-lanes results-by-lane]
  (->> required-lanes
       (keep (fn [lane]
               (when-let [result (first (get results-by-lane lane))]
                 (when-not (= :complete (:coverage/status result))
                   (str "required lane is not complete: " lane
                        " (" (:coverage/status result) ")")))))
       stable-strings))

(defn- empty-inspection-problems
  [required-lanes results-by-lane]
  (->> required-lanes
       (keep (fn [lane]
               (when-let [result (first (get results-by-lane lane))]
                 (when (and (= :complete (:coverage/status result))
                            (empty? (:coverage/inspected result)))
                   (str "complete required lane inspected no retained artifacts: "
                        lane)))))
       stable-strings))

(defn- unsupported-finding-problems
  [findings]
  (->> findings
       (keep (fn [finding]
               (when (and (confirmed? finding)
                          (not (supported-confirmed-finding? finding)))
                 (str "confirmed finding lacks retained evidence or a blocking failure trace: "
                      (:finding/id finding)))))
       stable-strings))

(defn- finding-id-conflicts
  [findings]
  (->> findings
       (group-by :finding/id)
       (keep (fn [[finding-id same-id-findings]]
               (when (> (count (distinct same-id-findings)) 1)
                 finding-id)))
       stable-strings))

(defn- contradiction-ids
  [findings]
  (->> findings
       (keepcat (fn [finding]
                  (cond-> []
                    (= :contradicted (:finding/status finding))
                    (conj (:finding/id finding))

                    (seq (:finding/contradicts finding))
                    (into (:finding/contradicts finding)))))
       stable-strings))

(defn- finding-counts
  [findings]
  {:blocking (count (filter #(and (confirmed? %) (blocking? %)) findings))
   :advisory (count (filter #(and (confirmed? %) (advisory? %)) findings))
   :contradicted (count (filter #(= :contradicted (:finding/status %)) findings))})

(defn aggregate-verdict
  "Fold independent evidence-lane records into one deterministic decision.

   Precedence is deliberately fail closed:

   1. malformed, missing, duplicate, stale, mismatched, incomplete, or
      unsupported evidence => `:evidence-unavailable`;
   2. trusted contradictions or colliding finding identities =>
      `:evidence-conflicted`;
   3. supported confirmed blockers => `:evidence-blocked`;
   4. supported confirmed advisories => `:advisory`;
   5. complete clean required lanes => `:approved`.

   Input ordering cannot change the returned lane, problem, finding, or verdict
   ordering."
  [request]
  (if-not (law/valid-aggregate-request? request)
    (malformed-request-decision request)
    (let [required-lanes (request-required-lanes request)
          duplicate-required (duplicate-values (:required/lanes request))
          results (:lane/results request)
          invalid-problems (invalid-result-problems results)
          valid-results (filterv law/valid-lane-result? results)
          results-by-lane (lane-result-groups valid-results)
          duplicate-result-lanes
          (->> results-by-lane
               (keep (fn [[lane lane-results]]
                       (when (> (count lane-results) 1) lane)))
               stable-keywords)
          result-lanes (set (keys results-by-lane))
          missing-lanes (->> required-lanes
                             (remove result-lanes)
                             stable-keywords)
          target-problems* (target-problems request valid-results)
          coverage-problems
          (required-coverage-problems required-lanes results-by-lane)
          inspection-problems
          (empty-inspection-problems required-lanes results-by-lane)
          trusted-results
          (filterv #(and (exact-target? request %)
                         (= :complete (:coverage/status %)))
                   valid-results)
          findings (->> trusted-results
                        (mapcat :findings)
                        stable-findings)
          unsupported-problems (unsupported-finding-problems findings)
          finding-conflicts (finding-id-conflicts findings)
          contradictions (contradiction-ids findings)
          problems
          (stable-strings
           (concat invalid-problems
                   target-problems*
                   coverage-problems
                   inspection-problems
                   unsupported-problems
                   (map #(str "required lane is duplicated: " %)
                        duplicate-required)
                   (map #(str "lane result is duplicated: " %)
                        duplicate-result-lanes)
                   (map #(str "required lane is missing: " %)
                        missing-lanes)))
          blockers (filterv #(and (supported-confirmed-finding? %)
                                  (blocking? %))
                            findings)
          advisories (filterv #(and (supported-confirmed-finding? %)
                                    (advisory? %))
                              findings)
          conflict? (or (seq finding-conflicts) (seq contradictions))
          status (cond
                   (seq problems) :evidence-unavailable
                   conflict? :evidence-conflicted
                   (seq blockers) :evidence-blocked
                   (seq advisories) :advisory
                   :else :approved)
          conflict-problems
          (stable-strings
           (concat (map #(str "finding identity has conflicting bodies: " %)
                        finding-conflicts)
                   (map #(str "trusted evidence contains a contradiction: " %)
                        contradictions)))
          complete-lanes (->> trusted-results
                              (map :evidence/lane)
                              stable-keywords)]
      {:schema/version 1
       :aggregate/status status
       :review/target (:review/target request)
       :review/episode (:review/episode request)
       :required/lanes required-lanes
       :complete/lanes complete-lanes
       :missing/lanes missing-lanes
       :finding/counts (finding-counts findings)
       :findings findings
       :problems (if conflict? conflict-problems problems)})))
