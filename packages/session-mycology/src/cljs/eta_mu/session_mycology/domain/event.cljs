(ns eta-mu.session-mycology.domain.event
  "Pure construction of Session Mycology events."
  (:require [eta-mu.session-mycology.law.reflection :as law]))

(def reflection-recorded-schema law/reflection-recorded-schema)

(defn build-event
  [{:keys [event-id recorded-at component-manifest command producer subject
           caused-by causes refs]}
   payload]
  (cond-> {:event/id event-id
           :event/type :session-mycology/reflection-recorded
           :event/recorded-at recorded-at
           :event/schema {:id reflection-recorded-schema
                          :version (get law/current-versions
                                        reflection-recorded-schema)}
           :event/producer (merge
                            {:eta-mu/version (:eta-mu/version component-manifest)
                             :package/name law/package-name
                             :package/version law/package-version
                             :command command}
                            producer)
           :event/subject subject
           :event/payload payload}
    (seq caused-by) (assoc :event/caused-by (vec caused-by))
    (seq causes) (assoc :event/causes (vec causes))
    (seq refs) (assoc :event/refs (vec refs))))
