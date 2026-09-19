(ns open-hax.records.services
  "Compose independently selected service implementations behind one protocol value."
  (:require [open-hax.openplanner-protocols :as p]
            [open-hax.services.law.local :as law]))

(defrecord Services [events sessions documents graph translations labels users realtime]
  p/EventAdmission
  (append-event! [_ envelope] (p/append-event! events envelope))
  (append-events! [_ envelopes] (p/append-events! events envelopes))
  (query-events [_ query] (p/query-events events query))
  (watch-events [_ query callback] (p/watch-events events query callback))
  p/SessionManagement
  (create-session [_ opts] (p/create-session sessions opts))
  (get-session [_ id] (p/get-session sessions id))
  (update-session [_ id updates] (p/update-session sessions id updates))
  (close-session [_ id] (p/close-session sessions id))
  p/DocumentStorage
  (store-document [_ doc] (p/store-document documents doc))
  (get-document [_ id] (p/get-document documents id))
  (query-documents [_ query] (p/query-documents documents query))
  (archive-document [_ id] (p/archive-document documents id))
  p/GraphOperations
  (add-node [_ node] (p/add-node graph node))
  (add-edge [_ edge] (p/add-edge graph edge))
  (query-neighbors [_ id opts] (p/query-neighbors graph id opts))
  (traverse [_ start opts] (p/traverse graph start opts))
  p/TranslationManagement
  (create-translation [_ segment] (p/create-translation translations segment))
  (label-translation [_ id label] (p/label-translation translations id label))
  (batch-translate [_ batch] (p/batch-translate translations batch))
  p/LabelManagement
  (create-label [_ label] (p/create-label labels label))
  (apply-label [_ id target type] (p/apply-label labels id target type))
  (query-by-label [_ id opts] (p/query-by-label labels id opts))
  p/UserManagement
  (create-user [_ user] (p/create-user users user))
  (authenticate [_ credentials] (p/authenticate users credentials))
  (get-user [_ id] (p/get-user users id))
  (update-user [_ id updates] (p/update-user users id updates))
  p/RealtimeSubscription
  (subscribe [_ room event callback] (p/subscribe realtime room event callback))
  (unsubscribe [_ handle] (p/unsubscribe realtime handle))
  (emit-to-room [_ room event data] (p/emit-to-room realtime room event data)))

(defn compose
  [{:keys [events sessions documents graph translations labels users realtime] :as ports}]
  (law/validate-overrides! ports)
  (when-not (every? true? [(satisfies? p/EventAdmission events)
                          (satisfies? p/SessionManagement sessions)
                          (satisfies? p/DocumentStorage documents)
                          (satisfies? p/GraphOperations graph)
                          (satisfies? p/TranslationManagement translations)
                          (satisfies? p/LabelManagement labels)
                          (satisfies? p/UserManagement users)
                          (satisfies? p/RealtimeSubscription realtime)])
    (throw (ex-info "Each service override must implement its protocol"
                    {:services/error :invalid-provider-contract})))
  (map->Services ports))
