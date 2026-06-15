(ns rheos.backend.domain.board
  "Board snapshot building — groups tasks into columns by status."
  (:require [clojure.string :as str]
            [rheos.backend.shape.kanban :as shape]))

(defn- title-case [status]
  (-> status (str/replace #"[-_]" " ") (str/split #"\s+")
      (->> (mapv str/capitalize) (str/join " "))))

(defn build-board-snapshot [tasks]
  (let [task-statuses (set (mapv :status tasks))
        all-statuses (vec (distinct (concat shape/StatusOrder task-statuses)))
        by-status (group-by :status tasks)]
    {:generated-at (.toISOString (new js/Date))
     :total-tasks (count tasks)
     :columns (mapv (fn [status]
                      {:status status
                       :title (title-case status)
                       :task-count (count (get by-status status []))
                       :tasks (vec (get by-status status []))})
                    all-statuses)}))
