(ns open-hax.sol.infra.agent.provider
  (:require [clojure.string :as str]
            [open-hax.sol.domain.models :refer [allowlisted-model-id?]]
            [open-hax.sol.extern.fetch :as fetch]))

(defn- response-model-items
  [resp]
  (or (get-in resp [:body :data]) []))

(defn- item-model-id
  [item]
  (let [raw (when (map? item) (:id item))]
    (when (and raw (not (str/blank? (str raw))))
      (str raw))))

(defn- proxx-models-url
  [config]
  (let [base (str (:proxx-base-url config))
        base (str/trim base)
        base (cond
               (str/ends-with? base "/v1") base
               (str/ends-with? base "/") (str base "v1")
               :else (str base "/v1"))]
    (str base "/models")))

(defn ^:async fetch-proxx-model-ids!
  "Fetch available model ids from Proxx /v1/models.
   Returns a vector of model id strings; on failure returns []."
  [config]
  (try
    (let [url (proxx-models-url config)
          token (some-> (:proxx-auth-token config) str str/trim not-empty)
          headers (cond-> {"Content-Type" "application/json"}
                    token (assoc "Authorization" (str "Bearer " token)))
          resp (await (fetch/json! fetch/default-client
                                   {:url url
                                    :method "GET"
                                    :headers headers
                                    :timeout-ms 15000}))]
      (if (:ok resp)
        (->> (response-model-items (:body resp))
             (keep item-model-id)
             (filterv #(allowlisted-model-id? config %))
             vec)
        (do
          (.warn js/console "[provider] Proxx /v1/models failed:" (:status resp) "— using configured default only")
          [])))
    (catch :default err
      (.warn js/console "[provider] Proxx /v1/models error:" (.-message err))
      [])))
