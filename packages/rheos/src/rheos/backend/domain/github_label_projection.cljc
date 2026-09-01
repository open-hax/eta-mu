(ns rheos.backend.domain.github-label-projection
  "Pure ownership and reconciliation law for Rheos-projected GitHub labels."
  (:require [clojure.string :as str]
            #?(:clj [clojure.edn :as edn]
               :cljs [cljs.reader :as edn])))

(def default-policy
  {:version 1
   :owned {:exact #{"kanban"}
           :prefixes ["status:" "priority:"]}
   :command {:prefixes ["eta-mu:"]}
   :reserved {:exact #{"deploy"}}})

(def ^:private projected-labels-pattern #"(?im)^- Labels:\s*(.*?)\s*$")
(def ^:private projected-label-pattern #"`([^`]*)`")
(def ^:private legacy-projected-labels-pattern
  #"^(?:none|`[^`]*`(?:\s*,\s*`[^`]*`)*)$")
(def ^:private ownership-marker-line-pattern
  #"(?m)^<!--\s*openhax-kanban-label-ownership-v1(?:\s|-->)[^\r\n]*\r?$")
(def ^:private ownership-marker-value-pattern
  #"^<!--\s*openhax-kanban-label-ownership-v1\s+(\[[^\r\n]*\])\s*-->\r?$")

(defn normalize-label
  "Normalize one canonical task label into the GitHub projection spelling."
  [label]
  (let [normalized (-> (str label)
                       str/trim
                       (str/replace #"\s+" "-")
                       (str/replace #"[^A-Za-z0-9_.:/-]+" "-")
                       (str/replace #"^-+|-+$" ""))]
    (subs normalized 0 (min 50 (count normalized)))))

(defn- label-key [label]
  (-> (str label) str/trim str/lower-case))

(defn- exact-match? [label names]
  (contains? (into #{} (map label-key) names) (label-key label)))

(defn- prefix-match? [label prefixes]
  (let [key (label-key label)]
    (boolean (some #(str/starts-with? key (label-key %)) prefixes))))

(defn protected-label?
  "True when a label is a command or reserved operator authority."
  ([label]
   (protected-label? label default-policy))
  ([label policy]
   (or (prefix-match? label (get-in policy [:command :prefixes]))
       (exact-match? label (get-in policy [:reserved :exact])))))

(defn projector-owned-label?
  "True for structural label families the Rheos projector may reconcile."
  ([label]
   (projector-owned-label? label default-policy))
  ([label policy]
   (and (not (protected-label? label policy))
        (or (exact-match? label (get-in policy [:owned :exact]))
            (prefix-match? label (get-in policy [:owned :prefixes]))))))

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

(defn canonical-task-labels
  "Normalize task labels that are safe for Rheos to project and own."
  ([task]
   (canonical-task-labels task default-policy))
  ([task policy]
   (->> (:labels task)
        (map normalize-label)
        (remove str/blank?)
        (remove #(protected-label? % policy))
        distinct-labels
        vec)))

(defn ownership-marker
  "Encode normalized task-label ownership as a structurally escaped EDN vector."
  ([task]
   (ownership-marker task default-policy))
  ([task policy]
   (str "<!-- openhax-kanban-label-ownership-v1 "
        (pr-str (canonical-task-labels task policy))
        " -->")))

(defn- valid-ownership-vector [candidate policy]
  (when (and (vector? candidate)
             (every? string? candidate)
             (every? (fn [label]
                       (and (not (str/blank? label))
                            (= label (normalize-label label))
                            (not (protected-label? label policy))))
                     candidate))
    (distinct-labels candidate)))

(defn- structured-ownership [issue-body policy]
  (let [body (or issue-body "")]
    (if-let [marker-line (re-find ownership-marker-line-pattern body)]
      {:present? true
       :labels
       (if-let [[_ encoded] (re-matches ownership-marker-value-pattern
                                        marker-line)]
         (try
           (let [labels (valid-ownership-vector (edn/read-string encoded) policy)]
             (if (and labels (= encoded (pr-str labels))) labels []))
           (catch #?(:clj Exception :cljs :default) _ []))
         [])}
      {:present? false :labels []})))

(defn- legacy-ownership [issue-body]
  (if-let [metadata (some-> (second (re-find projected-labels-pattern
                                              (or issue-body "")))
                            str/trim)]
    (if (and (not= "none" metadata)
             (re-matches legacy-projected-labels-pattern metadata))
      (->> (re-seq projected-label-pattern metadata)
           (map second)
           (map normalize-label)
           (remove str/blank?)
           distinct-labels
           vec)
      [])
    []))

(defn projected-task-labels
  "Recover task-label ownership recorded in the prior managed issue header.

   The structural v1 marker is authoritative when present, including when it is
   malformed (which decodes to no ownership). Strict legacy backtick records are
   still accepted for issues written before the structural marker shipped."
  ([issue-body]
   (projected-task-labels issue-body default-policy))
  ([issue-body policy]
   (let [{:keys [present? labels]} (structured-ownership issue-body policy)]
     (if present? labels (legacy-ownership issue-body)))))

(defn desired-labels
  "Build the canonical projection without projecting protected authority."
  ([task]
   (desired-labels task default-policy))
  ([task policy]
   (let [task-labels (canonical-task-labels task policy)]
     (->> (concat ["kanban" (str "status:" (:status task))]
                  (when (seq (:priority task)) [(str "priority:" (:priority task))])
                  task-labels)
          (map normalize-label)
          (remove str/blank?)
          distinct-labels
          vec))))

(defn plan-delta
  "Plan additive and named-delete label effects for one managed issue.

   Structural labels and task labels recorded in the prior managed header are
   removable. Unmanaged, command, and reserved labels never are."
  ([task issue]
   (plan-delta task issue default-policy))
  ([task issue policy]
   (let [desired (desired-labels task policy)
         desired-keys (into #{} (map label-key) desired)
         current (vec (or (:labels issue) []))
         current-keys (into #{} (map label-key) current)
         prior-task-keys (into #{}
                               (map label-key)
                               (projected-task-labels (:body issue) policy))
         removable? (fn [label]
                      (and (not (protected-label? label policy))
                           (or (projector-owned-label? label policy)
                               (contains? prior-task-keys (label-key label)))))]
     {:desired desired
      :add (->> desired
                (remove #(contains? current-keys (label-key %)))
                vec)
      :remove (->> current
                   (filter removable?)
                   (remove #(contains? desired-keys (label-key %)))
                   vec)})))
