(ns document-history.domain.history)

(defn revision [event]
  (merge (:event/data event)
         {:document/id (:event/subject event)
          :revision/id (:event/id event)
          :revision/at (:event/at event)
          :revision/actor (:event/actor event)
          :revision/parents (:event/causes event)}))

(defn apply-revision
  "Retain every accepted claim. Causal parents, never display order or wall
   time, remove heads. Concurrent siblings stay unresolved."
  [state event]
  (let [value (revision event)
        parents (set (:revision/parents value))]
    {:revision/history (conj (:revision/history state []) value)
     :revision/heads (conj (vec (remove parents (:revision/heads state [])))
                           (:revision/id value))}))

(defn document
  "Select the last canonical head for deterministic display. Selection grants
   no authority to discard siblings or silently resolve a conflict."
  [{:revision/keys [history heads]}]
  (when (seq history)
    (let [selected (last heads)
          selected-revision (some #(when (= selected (:revision/id %)) %) history)]
      (merge (select-keys selected-revision
                          [:document/id :document/metadata :document/markdown])
             {:revision/selected selected
              :revision/heads heads
              :revision/conflicted? (> (count heads) 1)
              :revision/history history}))))
