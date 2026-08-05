(ns rheos.backend.infra.github-issue-preflight
  "Repository-wide safety checks before Rheos plans or applies GitHub Issue writes."
  (:require [clojure.string :as str]
            [rheos.backend.infra.github-issues :as github]))

(defn duplicate-uuid-claims [issues]
  (->> issues
       (reduce (fn [claims issue]
                 (if-let [uuid (github/extract-task-uuid issue)]
                   (update claims uuid (fnil conj []) (:number issue))
                   claims))
               {})
       (keep (fn [[uuid issue-numbers]]
               (when (> (count issue-numbers) 1)
                 {:uuid uuid
                  :issue-numbers (vec (sort issue-numbers))})))
       (sort-by :uuid)
       vec))

(defn assert-no-duplicate-uuid-claims! [issues]
  (let [duplicates (duplicate-uuid-claims issues)]
    (when (seq duplicates)
      (throw
       (js/Error.
        (str "Duplicate GitHub issue UUID markers:\n"
             (str/join
              "\n"
              (map (fn [{:keys [uuid issue-numbers]}]
                     (str "- " uuid " on issues "
                          (str/join ", " (map #(str "#" %) issue-numbers))))
                   duplicates))))))))
