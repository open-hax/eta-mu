(ns rheos.backend.domain.kanban-projection
  (:require [clojure.string :as str]))

(defn- normalize-labels [labels tags]
  (let [raw (or labels tags [])
        items (cond
                (string? raw) (str/split raw #",")
                (vector? raw) raw
                :else [])]
    (vec (distinct (filter seq (mapv str/trim items))))))

(defn- normalize-status [status]
  (case (-> (or status "incoming") str/lower-case str/trim)
    "pending" "incoming"
    "completed" "done"
    (-> (or status "incoming") str/lower-case str/trim)))

(defn- slugify [title]
  (-> title
      str/lower-case
      (str/replace #"[^a-z0-9]+" "-")))

(defn task
  [document {:keys [fallback-title fallback-created-at source-path]}]
  (let [frontmatter (:document/frontmatter/data document)
        title (or (:title frontmatter) fallback-title)
        priority (-> (or (:priority frontmatter) "P3") str/upper-case str/trim)
        labels (normalize-labels (:labels frontmatter) (:tags frontmatter))
        uuid (or (:uuid frontmatter) (:slug frontmatter) (slugify title))
        status (normalize-status (:status frontmatter))
        created-at (or (:created_at frontmatter)
                       (:createdAt frontmatter)
                       fallback-created-at)]
    {:uuid uuid
     :title title
     :slug (or (:slug frontmatter) uuid)
     :status status
     :priority priority
     :labels labels
     :created-at created-at
     :content (:document/body document)
     :source-path source-path}))
