(ns rheos.backend.domain.compose
  "Board composition — query DSL for filtering across multiple boards."
  (:require [clojure.string :as str]
            [rheos.backend.domain.board :as board]
            [rheos.backend.domain.compose-condition :as compose-condition]
            [rheos.backend.domain.events :as events]
            [rheos.backend.infra.ledger :as ledger]
            [rheos.backend.infra.task-store :as tasks]))

(defn parse-where-clause [clause]
  (let [clause (str/trim clause)]
    (cond
      (str/includes? clause " = ")
      (let [[field value] (str/split clause #" = " 2)]
        [(str/trim field) := (str/trim value)])
      (str/includes? clause " ~ ")
      (let [[field pattern] (str/split clause #" ~ " 2)
            pattern (str/trim pattern)
            bare (if (and (str/starts-with? pattern "/") (str/ends-with? pattern "/"))
                   (subs pattern 1 (dec (count pattern)))
                   pattern)]
        [(str/trim field) :regex bare])
      (str/includes? clause " in ")
      (let [[field values] (str/split clause #" in " 2)]
        [(str/trim field) :in (mapv str/trim (str/split values #","))])
      (str/includes? clause " contains ")
      (let [[field value] (str/split clause #" contains " 2)]
        [(str/trim field) :contains (str/trim value)])
      :else nil)))

(defn- meta-clause? [clause]
  (str/starts-with? (name (first clause)) "meta."))

(defn- filter-task [task {:keys [status priority labels where-clauses]}]
  (and (compose-condition/match-any? (:status task) status)
       (compose-condition/match-any? (:priority task) priority)
       (compose-condition/contains-all? (:labels task) labels)
       (every? (fn [clause]
                 (or (meta-clause? clause)
                     (compose-condition/match-clause? task clause)))
               (or where-clauses []))))

(defn- filter-projects [projects {:keys [across where-clauses]}]
  (let [meta-clauses (filter meta-clause? where-clauses)]
    (filterv (fn [project]
               (and (or (empty? across) (some #(= (:id project) %) across))
                    (every? #(compose-condition/match-clause? (:meta project) %)
                            meta-clauses)))
             projects)))

(defn ^:async compose-snapshot [projects query]
  (try
    (let [filtered-projects (filter-projects projects query)
          all-tasks (atom [])]
      (loop [remaining filtered-projects]
        (when (seq remaining)
          (let [project (first remaining)]
            (try
              (let [tasks (await (tasks/load-tasks (:tasks-dir project)))
                    ledger (ledger/get-ledger (:tasks-dir project))
                    drift-evts (await (events/query-events ledger {:type "drift-detected"}))
                    drift-uuids (set (map #(get-in % [:payload :task-id]) drift-evts))
                    domain (get-in project [:meta :domain])
                    org (get-in project [:meta :org])]
                (doseq [t tasks]
                  (swap! all-tasks conj (assoc t
                                               :source-board (:id project)
                                               :domain domain
                                               :org org
                                               :drift (boolean (drift-uuids (:uuid t)))))))
              (catch :default _))
            (recur (rest remaining)))))
      (let [filtered (filterv #(filter-task % query) @all-tasks)]
        (board/build-board-snapshot filtered)))
    (catch :default err
      (js/console.error "compose-snapshot error:" (.-message err))
      (board/build-board-snapshot []))))

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
        q-val (get-flag flags "q")
        meta-filters (cond-> []
                       domain-val (conj [(keyword "meta.domain") := (str domain-val)])
                       org-val (conj [(keyword "meta.org") := (str org-val)])
                       tier-val (conj [(keyword "meta.tier") := (str tier-val)])
                       q-val (conj [(keyword "title") :contains (str q-val)]))
        where-str (get-flag flags "where")
        where-clauses (when where-str (mapv parse-where-clause (str/split (str where-str) #" and ")))]
    {:status (or status []) :priority (or priority []) :labels (or labels [])
     :across (or across []) :where-clauses (filterv some? (concat meta-filters (or where-clauses [])))}))
