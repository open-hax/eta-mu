(ns open-hax.services.domain.local
  "Pure service projections and queries over canonical Clio events."
  (:require [clojure.string :as str]
            [open-hax.services.law.local :as law]))

(defn apply-change [state {:keys [op collection id value]}]
  (case op
    :put (assoc-in state [collection id] value)
    :patch (if (get-in state [collection id])
             (update-in state [collection id] merge value)
             state)
    :delete (update state collection dissoc id)))

(defn apply-event [state event]
  (reduce apply-change state (get-in event [:event/data :changes])))

(declare matches?)

(defn- field-value [doc field]
  (if (or (contains? doc field) (namespace field))
    [(contains? doc field) (get doc field)]
    (reduce (fn [[present? value] part]
              (if (and present? (map? value) (contains? value part))
                [true (get value part)]
                [false nil]))
            [true doc] (mapv keyword (str/split (name field) #"\.")))))

(defn- range-comparison [actual expected]
  (when (and (some? actual) (some? expected)
             (or (= (type actual) (type expected))
                 (and (number? actual) (number? expected))
                 (and (inst? actual) (inst? expected))))
    ;; Generic fields can hold collections or incomparable nested elements.
    ;; Only comparison failure is a nonmatch; validation and I/O still fail.
    (try (compare actual expected)
         (catch #?(:clj Exception :cljs :default) _cause nil))))

(defn- range-matches? [predicate actual expected]
  (when-some [comparison (range-comparison actual expected)]
    (predicate comparison)))

(defn- field-matches? [[present? actual] expected]
  (if (and (map? expected) (some #(str/starts-with? (name %) "$") (keys expected)))
    (every? (fn [[op value]]
              (case op
                :$eq (= actual value)
                :$ne (not= actual value)
                :$in (boolean (some #{actual} value))
                :$nin (not (some #{actual} value))
                :$exists (= present? value)
                :$gt (range-matches? pos? actual value)
                :$gte (range-matches? #(not (neg? %)) actual value)
                :$lt (range-matches? neg? actual value)
                :$lte (range-matches? #(not (pos? %)) actual value)
                (throw (ex-info "Unsupported local query operator"
                                {:services/error :unsupported-query :operator op}))))
            expected)
    (= actual expected)))

(defn matches? [doc query]
  (every? (fn [[field value]]
            (case field
              :$and (every? #(matches? doc %) value)
              :$or (boolean (some #(matches? doc %) value))
              (do
                (law/require! (not (str/starts-with? (name field) "$"))
                              :unsupported-query "Unsupported local query operator")
                (field-matches? (field-value doc field) value))))
          query))

(defn documents [state collection query]
  (law/validate-query! query)
  (->> (get state collection)
       (sort-by key)
       (map val)
       (filter #(matches? % query))
       vec))

(defn neighbors [state node-id {:keys [direction edge-types] :or {direction :both}}]
  (law/require! (#{:in :out :both} direction) :invalid-direction
                "Graph direction must be :in, :out or :both")
  (->> (documents state :edges {})
       (filter #(or (empty? edge-types) (some #{(:type %)} edge-types)))
       (mapcat (fn [{:keys [source target]}]
                 (cond-> []
                   (and (#{:out :both} direction) (= source node-id)) (conj target)
                   (and (#{:in :both} direction) (= target node-id)) (conj source))))
       distinct law/validate-neighbor-ids! sort vec))

(defn traverse [state start {:keys [depth] :or {depth 1} :as opts}]
  (law/require! (and (integer? depth) (<= 0 depth)) :invalid-depth
                "Graph traversal depth must be a non-negative integer")
  (loop [frontier [start] seen #{} remaining depth]
    (let [seen (into seen frontier)]
      (if (or (zero? remaining) (empty? frontier))
        (->> seen sort (keep #(get-in state [:nodes %])) vec)
        (recur (->> frontier
                    (mapcat #(neighbors state % opts))
                    (remove seen) distinct vec)
               seen (dec remaining))))))
