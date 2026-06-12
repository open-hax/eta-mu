(ns eta-mu.kanban.content-parser
  "Parse task markdown into frontmatter + body/comment sections."
  (:require [clojure.string :as str]))

(defn parse-frontmatter [raw]
  (let [match (re-matches #"---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)" raw)]
    (if match
      (let [yaml-str (nth match 1)
            content (nth match 2)
            lines (str/split-lines yaml-str)
            data (reduce (fn [acc line]
                           (cond
                             (re-matches #"^(\w[\w_-]*):\s*\"(.*)\"\s*" line)
                             (let [[_ k v] (re-matches #"^(\w[\w_-]*):\s*\"(.*)\"\s*" line)]
                               (assoc acc (keyword k) v))
                             (re-matches #"^(\w[\w_-]*):\s*(.+)\s*" line)
                             (let [[_ k v] (re-matches #"^(\w[\w_-]*):\s*(.+)\s*" line)]
                               (assoc acc (keyword k) (str/trim v)))
                             (re-matches #"^(\w[\w_-]*):\s*$" line)
                             (let [[_ k] (re-matches #"^(\w[\w_-]*):\s*$" line)]
                               (assoc acc (keyword k) ""))
                             :else acc))
                         {} lines)]
        {:frontmatter data :content content})
      {:frontmatter {} :content raw})))

(defn parse-sections [content]
  (let [lines (str/split-lines content)
        result (loop [remaining lines
                      current-type "body"
                      buffer []
                      sections []]
                 (if (empty? remaining)
                   (let [text (str/trim (str/join "\n" buffer))]
                     (if (seq text)
                       (conj sections {:type current-type :content text})
                       sections))
                   (let [line (first remaining)
                         rest-lines (rest remaining)]
                     (if (= (str/trim line) "---")
                       (let [text (str/trim (str/join "\n" buffer))
                             new-sections (if (seq text)
                                            (conj sections {:type current-type :content text})
                                            sections)
                             new-type (if (= current-type "body") "comment" "body")]
                         (recur rest-lines new-type [] new-sections))
                       (recur rest-lines current-type (conj buffer line) sections)))))]
    result))

(defn parse-task-content [raw]
  (let [{:keys [frontmatter content]} (parse-frontmatter raw)
        sections (parse-sections content)]
    {:frontmatter frontmatter
     :sections sections}))

(defn task-content->js [parsed]
  #js {:frontmatter (clj->js (:frontmatter parsed))
       :sections (clj->js (mapv (fn [s] #js {:type (:type s) :content (:content s)}) (:sections parsed)))})
