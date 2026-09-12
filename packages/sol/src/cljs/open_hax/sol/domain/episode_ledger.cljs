(ns open-hax.sol.domain.episode-ledger
  "Pure translation from Sol episode payloads to Clio stream facts."
  (:require [open-hax.sol.law.episode-event :as episode-law]))

(defn validate-history!
  "A wire identity may appear in only one accepted Clio wrapper across every episode stream."
  [events]
  (reduce (fn [seen event]
            (let [envelope (episode-law/validate-stored-envelope! (:event/data event))
                  id (:event/id envelope)]
              (when (contains? seen id)
                (throw (ex-info "Sol history contains multiple facts for one wire identity"
                                {:sol/error :sol.clio/id-collision :event/id id})))
              (conj seen id))) #{} events)
  events)

(defn append-plan
  "Preserve exact retries and require the supplied Sol predecessor to be the
   current episode head. Clio still arbitrates concurrent stream-slot writes."
  [events envelope]
  (episode-law/validate-stored-envelope! envelope)
  (if-let [existing (some #(when (= (:event/id envelope)
                                  (get-in % [:event/data :event/id]))
                           %)
                         events)]
    (if (= envelope (:event/data existing))
      {:plan/action :retry :event existing}
      (throw (ex-info "Sol event id already names a different episode payload"
                      {:sol/error :sol.clio/id-collision
                       :event/id (:event/id envelope)})))
    (let [stream (str "sol:episode:" (:episode/id envelope))
          stream-events (filterv #(= stream (:event/stream %)) events)
          predecessor (peek stream-events)
          parent-id (get-in predecessor [:event/data :event/id])
          expected-root (if predecessor
                          (get-in predecessor [:event/data :causal/root])
                          (:event/id envelope))]
      (when-not (and (= parent-id (:causal/parent envelope))
                     (= expected-root (:causal/root envelope)))
        (throw (ex-info "Sol episode does not extend its persisted causal head"
                        {:sol/error :sol.clio/causal-conflict
                         :episode/id (:episode/id envelope)
                         :expected/parent parent-id
                         :actual/parent (:causal/parent envelope)
                         :expected/root expected-root
                         :actual/root (:causal/root envelope)})))
      {:plan/action :append
       :event {:event/stream stream
               :event/seq (inc (count stream-events))
               :event/causes (if predecessor [(:event/id predecessor)] [])
               :event/actor (get-in envelope [:event/from :actor-id])
               :event/subject (str "sol:run:" (:run/id envelope))
               :event/data envelope}})))
