(ns eta-mu.receipt-river.domain.event
  "Pure construction of Receipt River events."
  (:require [eta-mu.receipt-river.generated.registry :as registry]))

(def receipt-recorded-schema :eta-mu.receipt-river/receipt-recorded)

(defn build-event
  "Wrap a package-owned payload in the shared eta-mu event envelope.

  Runtime values such as ids, timestamps, application composition, and actor
  attribution are inputs. Package and schema metadata are stamped here."
  [{:keys [event-id recorded-at component-manifest command producer subject
           caused-by causes refs]}
   payload]
  (cond-> {:event/id event-id
           :event/type :receipt-river/receipt-recorded
           :event/recorded-at recorded-at
           :event/schema {:id receipt-recorded-schema
                          :version (get registry/current-versions receipt-recorded-schema)}
           :event/producer (merge
                            {:eta-mu/version (:eta-mu/version component-manifest)
                             :package/name registry/package-name
                             :package/version registry/package-version
                             :command command}
                            producer)
           :event/subject subject
           :event/payload payload}
    (seq caused-by) (assoc :event/caused-by (vec caused-by))
    (seq causes) (assoc :event/causes (vec causes))
    (seq refs) (assoc :event/refs (vec refs))))
