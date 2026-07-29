(ns eta-mu.receipt-river.law.receipt
  "Validation laws for versioned events and historical unversioned receipts."
  (:require [eta-mu.receipt-river.generated.registry :as registry]))

(def receipt-recorded-schema
  :eta-mu.receipt-river/receipt-recorded)

(def known-kinds
  #{:push-truth :artifact-hash :test-run :build :decision :drift :catalog
    :observation :field-impact :truth :refutation :adjudication})

(def legacy-required-keys
  [:ts :kind :repo :origin :owner :dod :pi :host :manifest :refs])

(def envelope-required-keys
  [:event/id :event/type :event/recorded-at :event/schema
   :event/producer :event/subject :event/payload])

(def ^:private iso-instant-pattern
  #"^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{3})?Z$")

(defn- leap-year? [year]
  (or (zero? (mod year 400))
      (and (zero? (mod year 4))
           (not (zero? (mod year 100))))))

(defn- days-in-month [year month]
  (case month
    2 (if (leap-year? year) 29 28)
    (4 6 9 11) 30
    31))

(defn- valid-iso-timestamp? [value]
  (when (string? value)
    (when-let [[_ year month day hour minute second]
               (re-matches iso-instant-pattern value)]
      (let [year (parse-long year)
            month (parse-long month)
            day (parse-long day)
            hour (parse-long hour)
            minute (parse-long minute)
            second (parse-long second)]
        (and (<= 1 month 12)
             (<= 1 day (days-in-month year month))
             (<= 0 hour 23)
             (<= 0 minute 59)
             (<= 0 second 59))))))

(defn- valid-timestamp? [value]
  (or (and (inst? value)
           (let [milliseconds (inst-ms value)]
             (= milliseconds milliseconds)))
      (boolean (valid-iso-timestamp? value))))

(defn- missing-errors [value required]
  (into []
        (keep (fn [key]
                (when-not (contains? value key)
                  (str "missing required key: " (name key)))))
        required))

(defn legacy-errors
  [record]
  (let [base (if (map? record)
               (missing-errors record legacy-required-keys)
               ["event is not a map"])]
    (cond-> base
      (and (map? record)
           (:kind record)
           (not (contains? known-kinds (:kind record))))
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

      (not= receipt-recorded-schema (:id schema))
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
