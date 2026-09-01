(ns rheos.backend.law.github-label-projection
  "Admissibility contracts for GitHub label projection and ownership evidence."
  (:require [clojure.string :as str]
            #?(:clj [clojure.edn :as edn]
               :cljs [cljs.reader :as edn])))

(def default-policy
  {:version 1
   :owned {:exact #{"kanban"}
           :prefixes ["status:" "priority:"]}
   :command {:prefixes ["eta-mu:"]}
   :reserved {:exact #{"deploy"}}})

(def ^:private sync-marker-line-pattern
  #"^<!--\s*openhax-kanban-sync\s+uuid=\"[^\"]+\"\s*-->$")
(def ^:private ownership-marker-line-pattern
  #"^<!--\s*openhax-kanban-label-ownership-v1(?:\s|-->)[^\r\n]*$")
(def ^:private ownership-marker-value-pattern
  #"^<!--\s*openhax-kanban-label-ownership-v1\s+(\[[^\r\n]*\])\s*-->$")
(def ^:private url-dot-segment-pattern
  #"(?i)^(?:\.|%2e)(?:\.|%2e)?$")

(defn- label-key [label]
  (-> (str label) str/trim str/lower-case))

(defn- exact-match? [label names]
  (contains? (into #{} (map label-key) names) (label-key label)))

(defn- prefix-match? [label prefixes]
  (let [key (label-key label)]
    (boolean (some #(str/starts-with? key (label-key %)) prefixes))))

(defn protected-label?
  "True when current policy reserves a label for commands or operator authority."
  ([label]
   (protected-label? label default-policy))
  ([label policy]
   (or (prefix-match? label (get-in policy [:command :prefixes]))
       (exact-match? label (get-in policy [:reserved :exact])))))

(defn projector-owned-label?
  "True when current policy admits a structural label for reconciliation."
  ([label]
   (projector-owned-label? label default-policy))
  ([label policy]
   (and (not (protected-label? label policy))
        (or (exact-match? label (get-in policy [:owned :exact]))
            (prefix-match? label (get-in policy [:owned :prefixes]))))))

(defn named-label-delete-safe?
  "True when one label can occupy GitHub's named-delete path segment safely.

   Empty components hit the collection endpoint. WHATWG URL resolution treats
   literal and percent-spelled single/double dots as path navigation before a
   request is sent, so none can represent a named label deletion."
  [label]
  (and (string? label)
       (let [candidate (str/trim label)]
         (and (not (str/blank? candidate))
              (not (re-matches url-dot-segment-pattern candidate))))))

(defn projected-task-label-admissible?
  "True when a normalized task label may be projected and later named-deleted."
  ([label]
   (projected-task-label-admissible? label default-policy))
  ([label policy]
   (and (named-label-delete-safe? label)
        (not (protected-label? label policy)))))

(defn- distinct-labels [labels]
  (loop [remaining labels
         seen #{}
         result []]
    (if-let [label (first remaining)]
      (let [key (label-key label)]
        (if (contains? seen key)
          (recur (rest remaining) seen result)
          (recur (rest remaining) (conj seen key) (conj result label))))
      result)))

(defn- valid-ownership-vector [candidate policy normalize-label]
  (when (and (vector? candidate)
             (every? string? candidate)
             (every? (fn [label]
                       (and (= label (normalize-label label))
                            (projected-task-label-admissible? label policy)))
                     candidate))
    (distinct-labels candidate)))

(defn structured-ownership
  "Validate ownership evidence only at the versioned managed-header position.

   A present malformed marker is authoritative and owns nothing. Pre-v1
   backtick metadata is deliberately not admitted: label-controlled delimiters
   made it impossible to distinguish a genuine vector from an injected one."
  [issue-body policy normalize-label]
  (let [[sync-line marker-line] (str/split-lines (or issue-body ""))]
    (if (and (some? sync-line)
             (some? marker-line)
             (re-matches sync-marker-line-pattern sync-line)
             (re-matches ownership-marker-line-pattern marker-line))
      {:present? true
       :labels
       (if-let [[_ encoded] (re-matches ownership-marker-value-pattern
                                        marker-line)]
         (try
           (let [labels (valid-ownership-vector
                         (edn/read-string encoded) policy normalize-label)]
             (if (and labels (= encoded (pr-str labels))) labels []))
           (catch #?(:clj Exception :cljs :default) _ []))
         [])}
      {:present? false :labels []})))
