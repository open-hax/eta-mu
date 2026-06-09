(ns eta-mu.kanban.compose
  "Board composition — query DSL for filtering across multiple boards."
  (:require [clojure.string :as str]
            [eta-mu.kanban.board :as board]
            [eta-mu.kanban.tasks :as tasks]))

(defn- normalize-value [v]
  (cond
    (keyword? v) (name v)
    :else (str v)))

(defn- apply-operator [field-value op test-value]
  (let [fv (normalize-value field-value)
        tv (normalize-value test-value)]
    (case op
      :=  (= fv tv)
      :in (if (vector? test-value)
            (some #(= fv (normalize-value %)) test-value)
            (= fv tv))
      :contains (cond
                  (vector? field-value) (some #(= (normalize-value %) tv) field-value)
                  (string? fv) (str/includes? fv tv)
                  :else false)
      :regex (re-matches (re-pattern tv) fv)
      false)))

(defn- match-where [task [field op value]]
  (let [field-key (if (keyword? field) field (keyword field))]
    (apply-operator (get task field-key) op value)))

(defn- match-meta-where [meta [field _op value]]
  (let [field-name (name field)
        key (if (str/starts-with? field-name "meta.")
              (keyword (subs field-name 5))
              (keyword field-name))
        meta-val (get meta key)
        result (= (normalize-value meta-val) (normalize-value value))]
    (when (= key :domain)
      (js/console.error "MATCH domain:" (pr-str meta-val) "vs" (pr-str value) "->" result))
    result))

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

(defn filter-projects-for-debug [projects query]
  (filter-projects projects query))

(defn ^:async compose-snapshot [projects query]
  (let [filtered-projects (filter-projects projects query)
        all-tasks (atom [])]
    ;; Load tasks from each filtered project
    (loop [remaining filtered-projects]
      (when (seq remaining)
        (let [project (first remaining)]
          (try
            (let [tasks (await (tasks/load-tasks (:tasks-dir project)))]
              (doseq [t tasks]
                (swap! all-tasks conj (assoc t :source-board (:id project)))))
            (catch :default _))
          (recur (rest remaining)))))
    (let [filtered (filterv #(filter-task % query) @all-tasks)]
      (board/build-board-snapshot filtered))))

(defn- get-flag [flags key]
  (or (get flags key)
      (get flags (keyword key))
      (aget flags key)))

(defn parse-compose-query [flags]
  (let [status (when-let [v (get-flag flags "status")] (mapv str/trim (str/split (str v) #",")))
        priority (when-let [v (get-flag flags "priority")] (mapv str/trim (str/split (str v) #",")))
        labels (when-let [v (get-flag flags "labels")] (mapv str/trim (str/split (str v) #",")))
        across (when-let [v (get-flag flags "projects")] (mapv str/trim (str/split (str v) #",")))
        domain-val (get-flag flags "domain")
        org-val (get-flag flags "org")
        tier-val (get-flag flags "tier")
        meta-filters (cond-> []
                       domain-val (conj [(keyword "meta.domain") := (str domain-val)])
                       org-val (conj [(keyword "meta.org") := (str org-val)])
                       tier-val (conj [(keyword "meta.tier") := (str tier-val)]))
        where-str (get-flag flags "where")
        where-clauses (when where-str (mapv parse-where-clause (str/split (str where-str) #" and ")))]
    {:status (or status []) :priority (or priority []) :labels (or labels [])
     :across (or across []) :where-clauses (filterv some? (concat meta-filters (or where-clauses [])))}))
