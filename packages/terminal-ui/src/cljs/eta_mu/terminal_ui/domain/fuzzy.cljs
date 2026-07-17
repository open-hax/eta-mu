(ns eta-mu.terminal-ui.domain.fuzzy
  "Fuzzy matching utilities. Matches if all query chars appear in order.
  Lower score = better match.")

(defn fuzzy-match
  "Returns {:matches bool :score number} for fuzzy match of query against text."
  [query text]
  (let [query-lower (.toLowerCase query)
        text-lower (.toLowerCase text)]
    (if (empty? query-lower)
      {:matches true :score 0}
      (if (> (.-length query-lower) (.-length text-lower))
        {:matches false :score 0}
        (loop [qi 0 score 0 last-idx -1 consec 0 ti 0]
          (if (or (>= ti (.-length text-lower)) (>= qi (.-length query-lower)))
            (if (< qi (.-length query-lower))
              {:matches false :score 0}
              {:matches true :score score})
            (if (= (.charAt text-lower ti) (.charAt query-lower qi))
              (let [word-boundary? (or (= ti 0)
                                       (re-find #"[\\s\\-_./:]" (.charAt text-lower (dec ti))))
                    [new-consec new-score]
                    (if (= last-idx (dec ti))
                      [(inc consec) (- score (* (inc consec) 5))]
                      [0 (if (>= last-idx 0)
                           (+ score (* (- ti last-idx -1) 2))
                           score)])
                    score' (+ new-score
                             (if word-boundary? -10 0)
                             (* ti 0.1))]
                (recur (inc qi) score' ti new-consec (inc ti)))
              (recur qi score last-idx consec (inc ti)))))))))

(defn fuzzy-filter
  "Filter and sort items by fuzzy match quality. Supports space-separated tokens."
  [items query get-text]
  (if (empty? (.trim query))
    items
    (let [tokens (-> (.trim query)
                     (.split #"\s+")
                     (->> (filter #(> (.-length %) 0)))
                     vec)]
      (if (empty? tokens)
        items
        (->> items
             (map (fn [item]
                    (let [text (get-text item)
                          scores (mapv #(let [m (fuzzy-match % text)]
                                          (if (:matches m) (:score m) nil))
                                       tokens)]
                      (when (every? some? scores)
                        {:item item :score (reduce + scores)}))))
             (filter some?)
             (sort-by :score)
             (mapv :item))))))
