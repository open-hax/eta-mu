(ns axxium.extern.postgres
  "PostgreSQL boundary. A pool is retained only in operation closures. Queries
   return {:rows [keyword-keyed maps], :row-count integer-or-nil, :command string}.
   PostgreSQL timestamps become ISO strings, byte buffers become byte vectors,
   and JSON/array cells become recursive CLJS values."
  (:require ["pg" :refer [Pool]]))

(defn- decode-value [value]
  (cond
    (nil? value) nil
    (or (string? value) (number? value) (boolean? value)) value
    (instance? js/Date value) (.toISOString value)
    (js/Buffer.isBuffer value) (vec (array-seq value))
    (array? value) (mapv decode-value (array-seq value))
    (or (identical? js/Object.prototype (js/Object.getPrototypeOf value))
        (nil? (js/Object.getPrototypeOf value)))
    (into {} (map (fn [key] [(keyword key) (decode-value (aget value key))]))
          (array-seq (js/Object.keys value)))
    :else (throw (ex-info "Unsupported PostgreSQL value" {:code :unsupported-db-value}))))

(defn- query-result [result]
  ;; A migration containing several SQL statements produces one result per
  ;; statement. Preserve that cardinality without leaking native pg Results.
  (if (array? result)
    (mapv query-result (array-seq result))
    {:rows (decode-value (.-rows result))
     :row-count (.-rowCount result)
     :command (.-command result)}))

(defn- database-error [error]
  (ex-info (or (.-message error) "PostgreSQL operation failed")
           (cond-> {:code (or (.-code error) :database-error)}
             (.-constraint error) (assoc :constraint (.-constraint error)))))

(defn pool-adapter
  "Adapt a native pool at the boundary; expose query! and close! operations.
   SQL parameters enter as a CLJS sequence and retain pg's parameter semantics."
  [native-pool]
  {:query! (fn ^:async query! [sql params]
             (try
               (query-result (await (.query native-pool sql (clj->js params))))
               (catch :default error (throw (database-error error)))))
   :close! (fn ^:async close! []
             (try
               (await (.end native-pool))
               nil
               (catch :default error (throw (database-error error)))))})

(defn open-pool
  "Create a deferred-connection pg pool using the existing connection limits."
  [connection-string]
  (pool-adapter (Pool. #js {:connectionString connection-string
                            :max 20
                            :idleTimeoutMillis 30000
                            :connectionTimeoutMillis 2000})))
