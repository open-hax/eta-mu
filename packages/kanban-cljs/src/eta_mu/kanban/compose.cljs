(ns eta-mu.kanban.compose
  "Board composition — query DSL for filtering across multiple boards."
  (:require [clojure.string :as str]
            [eta-mu.kanban.board :as board]
            [eta-mu.kanban.tasks :as tasks]))

(defn- apply-operator [field-value op test-value]
  (case op
    :=  (= field-value test-value)
    :in (if (vector? test-value) (some #(= field-value %) test-value) (= field-value test-value))
    :contains (cond (vector? field-value) (some #(= % test-value) field-value)
                    (string? field-value) (str/includes? field-value test-value)
                    :else false)
    :regex (re-matches (re-pattern test-value) (str field-value))
    false))

(defn- match-where [task [field op value]]
  (let [field-key (if (keyword? field) field (keyword field))]
    (apply-operator (get task field-key) op value)))

(defn- match-meta-where [meta [field _op value]]
  (apply-operator (get meta (keyword (name field))) := value))

(defn parse-where-clause [clause]
  (let [clause (str/trim clause)]
    (cond
      (str/includes? clause " = ")
      (let [[field value] (str/split clause #" = " 2)]
        [(str/trim field) := (str/trim value)])
      (str/includes? clause " in ")
      (let [[field values] (str/split clause #" in " 2)]
        [(str/trim field) :in (mapv str/trim (str/split values #","))])
      (str/includes? clause " contains ")
      (let [[field value] (str/split clause #" contains " 2)]
        [(str/trim field) :contains (str/trim value)])
      :else nil)))

(defn- filter-task [task {:keys [status priority labels where-clauses]}]
  (and (or (empty? status) (some #(= (:status task) %) status))
       (or (empty? priority) (some #(= (:priority task) %) priority))
       (or (empty? labels) (every? (fn [label] (some #(= % label) (:labels task))) labels))
       (or (empty? where-clauses) (every? #(match-where task %) where-clauses))))

(defn- filter-projects [projects {:keys [across where-clauses]}]
  (let [meta-clauses (filter #(str/starts-with? (name (first %)) "meta.") where-clauses)]
    (filterv (fn [project]
               (and (or (empty? across) (some #(= (:id project) %) across))
                    (every? #(match-meta-where (:meta project) %) meta-clauses)))
             projects)))

(defn ^:async compose-snapshot [projects query]
  (let [filtered-projects (filter-projects projects query)
        all-tasks (atom [])]
    (loop [remaining filtered-projects]
      (when (seq remaining)
        (let [project (first remaining)
              tasks (await (tasks/load-tasks (:tasks-dir project)))]
          (swap! all-tasks into (mapv #(assoc % :source-board (:id project)) tasks))
          (recur (rest remaining)))))
    (let [filtered (filterv #(filter-task % query) @all-tasks)]
      (board/build-board-snapshot filtered))))

(defn parse-compose-query [flags]
  (let [status (when (:status flags) (mapv str/trim (str/split (:status flags) #",")))
        priority (when (:priority flags) (mapv str/trim (str/split (:priority flags) #",")))
        labels (when (:labels flags) (mapv str/trim (str/split (:labels flags) #",")))
        across (when (:projects flags) (mapv str/trim (str/split (:projects flags) #",")))
        where-str (:where flags)
        where-clauses (when where-str (mapv parse-where-clause (str/split where-str #" and ")))]
    {:status (or status []) :priority (or priority []) :labels (or labels [])
     :across (or across []) :where-clauses (filterv some? (or where-clauses []))}))
