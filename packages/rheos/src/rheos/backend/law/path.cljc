(ns rheos.backend.law.path)

(defn value-at [context path]
  (loop [current context segments (seq path)]
    (if-not segments
      {:found? true :value current}
      (let [segment (first segments)]
        (cond
          (map? current)
          (if (contains? current segment)
            (recur (get current segment) (next segments))
            {:found? false})

          (vector? current)
          (if (and (integer? segment)
                   (<= 0 segment)
                   (< segment (count current)))
            (recur (nth current segment) (next segments))
            {:found? false})

          :else {:found? false})))))
