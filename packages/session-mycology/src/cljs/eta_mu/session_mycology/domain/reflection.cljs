(ns eta-mu.session-mycology.domain.reflection
  "Pure Session Mycology reflection payload construction."
  (:require [clojure.string :as str]))

(defn build-payload
  [{:keys [repo lesson session-id task-id receipt-refs]}]
  (when (str/blank? lesson)
    (throw (js/Error. "A session reflection requires a lesson.")))
  (cond-> {:repo repo :lesson lesson}
    session-id (assoc :session/id session-id)
    task-id (assoc :task/id task-id)
    (seq receipt-refs) (assoc :receipt/refs (vec receipt-refs))))
