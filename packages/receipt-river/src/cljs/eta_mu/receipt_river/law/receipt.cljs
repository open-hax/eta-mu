(ns eta-mu.receipt-river.law.receipt
  "Validation laws for versioned events and historical unversioned receipts."
  (:require [eta-mu.receipt-river.domain.event :as event]
            [eta-mu.receipt-river.domain.receipt :as receipt]
            [eta-mu.receipt-river.generated.registry :as registry]))

(def envelope-required-keys
  [:event/id :event/type :event/recorded-at :event/schema
   :event/producer :event/subject :event/payload])

(defn- valid-timestamp? [value]
  (or (and (instance? js/Date value)
           (not (js/Number.isNaN (.getTime value))))
      (and (string? value)
           (not (js/Number.isNaN (js/Date.parse value))))))

(defn- missing-errors [value required]
  (into []
        (keep (fn [key]
                (when-not (contains? value key)
                  (str "missing required key: " (name key)))))
        required))

(defn legacy-errors
  [record]
  (let [base (if (map? record)
               (missing-errors record receipt/legacy-required-keys)
               ["event is not a map"])]
    (cond-> base
      (and (map? record)
           (:kind record)
           (not (contains? receipt/known-kinds (:kind record))))
      (conj (str "unknown kind: " (:kind record)))

      (and (map? record) (:ts record) (not (valid-timestamp? (:ts record))))
      (conj (str "invalid ts: " (:ts record))))))

(defn envelope-errors
  [record]
  (let [schema (:event/schema record)
        producer (:event/producer record)
        payload (:event/payload record)
        registered-schema (get registry/schemas [(:id schema) (:version schema)])
        base (missing-errors record envelope-required-keys)]
    (cond-> base
      (not= :receipt-river/receipt-recorded (:event/type record))
      (conj (str "unexpected event type: " (:event/type record)))

      (not= event/receipt-recorded-schema (:id schema))
      (conj (str "unexpected schema id: " (:id schema)))

      (nil? registered-schema)
      (conj (str "unsupported schema version: " (:version schema)))

      (not= registry/package-name (:package/name producer))
      (conj (str "unexpected producer package: " (:package/name producer)))

      (not (and (string? (:package/version producer))
                (seq (:package/version producer))))
      (conj "missing producer package version")

      (not (valid-timestamp? (:event/recorded-at record)))
      (conj (str "invalid event/recorded-at: " (:event/recorded-at record)))

      (seq (legacy-errors payload))
      (into (map #(str "payload " %) (legacy-errors payload))))))

(defn record-errors
  [record]
  (if (contains? record :event/schema)
    (envelope-errors record)
    (legacy-errors record)))
