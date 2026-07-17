(ns eta-mu.domain.tools.ls
  "Pure decision logic for the `ls` tool: sort, format, and limit a
  single-level directory listing."
  (:require [clojure.string :as str]))

(defn format-entries
  "`entries` is `[{:name string :dir? bool} ...]`. Returns entry names sorted
  alphabetically (case-insensitive), directories suffixed with `/`, capped at
  `limit`.

  Returns `{:entries [...] :limit-reached? bool}`."
  [entries limit]
  (let [sorted (->> entries
                    (sort-by #(str/lower-case (:name %)))
                    (map (fn [{:keys [name dir?]}] (if dir? (str name "/") name))))]
    {:entries (vec (take limit sorted))
     :limit-reached? (> (count sorted) limit)}))
