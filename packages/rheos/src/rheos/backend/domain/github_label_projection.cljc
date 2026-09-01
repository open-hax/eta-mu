(ns rheos.backend.domain.github-label-projection
  "Pure normalization and reconciliation transforms for projected GitHub labels."
  (:require [clojure.string :as str]
            [rheos.backend.law.github-label-projection :as law]))

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
   (canonical-task-labels task law/default-policy))
  ([task policy]
   (->> (:labels task)
        (map normalize-label)
        (remove str/blank?)
        (remove #(law/protected-label? % policy))
        distinct-labels
        vec)))

(defn ownership-marker
  "Encode normalized task-label ownership as a structurally escaped EDN vector."
  ([task]
   (ownership-marker task law/default-policy))
  ([task policy]
   (str "<!-- openhax-kanban-label-ownership-v1 "
        (pr-str (canonical-task-labels task policy))
        " -->")))

(defn projected-task-labels
  "Recover task-label ownership recorded in the prior managed issue header.

   The structural v1 marker is authoritative when present, including when it is
   malformed (which decodes to no ownership). Legacy backtick records are not
   ownership evidence because label-controlled delimiters made them ambiguous."
  ([issue-body]
   (projected-task-labels issue-body law/default-policy))
  ([issue-body policy]
   (:labels (law/structured-ownership issue-body policy normalize-label))))

(defn desired-labels
  "Build the canonical projection without projecting protected authority."
  ([task]
   (desired-labels task law/default-policy))
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
   (plan-delta task issue law/default-policy))
  ([task issue policy]
   (let [desired (desired-labels task policy)
         desired-keys (into #{} (map label-key) desired)
         current (vec (or (:labels issue) []))
         current-keys (into #{} (map label-key) current)
         prior-task-keys (into #{}
                               (map label-key)
                               (projected-task-labels (:body issue) policy))
         removable? (fn [label]
                      (and (not (law/protected-label? label policy))
                           (or (law/projector-owned-label? label policy)
                               (contains? prior-task-keys
                                          (label-key label)))))]
     {:desired desired
      :add (->> desired
                (remove #(contains? current-keys (label-key %)))
                vec)
      :remove (->> current
                   (filter removable?)
                   (remove #(contains? desired-keys (label-key %)))
                   vec)})))
