(ns eta-mu.runtime.facade
  (:require [eta-mu.runtime.domain.breath :as breath]
            [eta-mu.runtime.domain.envelope :as envelope]
            [eta-mu.runtime.domain.planner :as planner]
            [eta-mu.runtime.domain.state :as state]
            [eta-mu.runtime.shape.compat :as compat]))

(defn- now-iso
  []
  (.toISOString (js/Date.)))

(defn- js-map
  [value]
  (js->clj (or value #js {}) :keywordize-keys true))

(defn- ->js
  [value]
  (clj->js value))

(defn create-eta-belief
  "JS facade for createEtaBelief."
  ([]
   (create-eta-belief nil))
  ([overrides]
   (-> overrides
       js-map
       compat/belief-from-external
       state/create-belief
       compat/belief->external
       ->js)))

(defn create-breath-episode
  "JS facade for createBreathEpisode."
  ([id]
   (create-breath-episode id (now-iso) false 0))
  ([id now]
   (create-breath-episode id now false 0))
  ([id now pending-commit activity-scalar]
   (-> (state/create-breath-episode id now pending-commit (or activity-scalar 0))
       compat/breath-episode->external
       ->js)))

(defn create-eta-mu-state
  "JS facade for createEtaMuState."
  ([]
   (create-eta-mu-state nil))
  ([options]
   (let [options (cond-> (js-map options)
                   (not (contains? (js-map options) :now))
                   (assoc :now (now-iso)))]
     (-> options
         compat/state-options-from-external
         state/create-state
         compat/state->external
         ->js))))

(defn select-panels-from-context
  "JS facade for selectPanelsFromContext."
  [context]
  (let [panels (-> context
                   js-map
                   compat/planning-context-from-external
                   planner/select-panels)]
    (->js (mapv compat/panel->external panels))))

(defn rank-cheap-mu-candidates
  "JS facade for rankCheapMuCandidates."
  [context]
  (let [candidates (-> context
                       js-map
                       compat/planning-context-from-external
                       planner/rank-cheap-candidates)]
    (->js (mapv compat/candidate->external candidates))))

(defn recommend-breath
  "JS facade for recommendBreath."
  ([context]
   (recommend-breath context nil))
  ([context actions]
   (let [context (-> context js-map compat/planning-context-from-external)
         actions (when actions
                   (mapv compat/candidate-from-external (js->clj actions :keywordize-keys true)))]
     (-> context
         (breath/recommend actions)
         compat/breath-recommendation->external
         ->js))))

(defn create-action-batch
  "JS facade for createActionBatch."
  [context]
  (-> context
      js-map
      compat/planning-context-from-external
      envelope/create-action-batch
      compat/action-batch->external
      ->js))
