(ns eta-mu.receipt-river.api
  "Authoritative programmatic API for Receipt River."
  (:require [eta-mu.receipt-river.domain.event :as event]
            [eta-mu.receipt-river.extern.bus :as bus]
            [eta-mu.receipt-river.generated.registry :as registry]
            [eta-mu.receipt-river.law.receipt :as law]
            [eta-mu.receipt-river.shape.edn :as edn]))

(def schema-registry registry/schemas)
(def current-schemas registry/current-versions)

(defn build-event [metadata payload]
  (event/build-event metadata payload))

(defn validate-line [line line-number]
  (try
    (let [record (edn/parse-line line)
          errors (law/record-errors record)]
      {:ok (empty? errors)
       :line-number line-number
       :event record
       :source/schema (if (contains? record :event/schema)
                        {:status :declared
                         :id (get-in record [:event/schema :id])
                         :version (get-in record [:event/schema :version])}
                        {:status :unversioned})
       :errors errors
       :line line})
    (catch :default error
      (bus/emit-error! :receipt-river/invalid-edn
                       {:line-number line-number
                        :exception/name (or (.-name error) "Error")
                        :exception/message (.-message error)})
      {:ok false
       :line-number line-number
       :event nil
       :source/schema {:status :unreadable}
       :errors [(str "invalid EDN: " (.-message error))]
       :line line})))
