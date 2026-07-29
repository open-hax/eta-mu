(ns eta-mu.fork-tax.domain.event
  "Pure construction of Fork Tax events."
  (:require [eta-mu.fork-tax.generated.registry :as registry]))

(def handoff-recorded-schema :eta-mu.fork-tax/handoff-recorded)

(defn build-event
  [{:keys [event-id recorded-at component-manifest command producer subject
           caused-by causes refs]}
   payload]
  (cond-> {:event/id event-id
           :event/type :fork-tax/handoff-recorded
           :event/recorded-at recorded-at
           :event/schema {:id handoff-recorded-schema
                          :version (get registry/current-versions
                                        handoff-recorded-schema)}
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
