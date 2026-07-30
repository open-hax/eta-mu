(ns eta-mu.session-mycology.domain.reflection
  "Pure Session Mycology reflection payload construction."
  (:require [eta-mu.session-mycology.law.reflection :as law]))

(defn build-payload
  [{:keys [repo lesson session-id task-id receipt-refs]}]
  (law/assert-valid
   (cond-> {:repo repo :lesson lesson}
     session-id (assoc :session/id session-id)
     task-id (assoc :task/id task-id)
     (seq receipt-refs) (assoc :receipt/refs (vec receipt-refs)))))
