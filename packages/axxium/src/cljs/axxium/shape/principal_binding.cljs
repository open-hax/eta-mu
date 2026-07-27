(ns axxium.shape.principal-binding
  "Pure projection from authoritative Axxium actor/entity rows to the immutable
   identity reference carried by operational event envelopes."
  (:require [axxium.schema :as schema]
            [clojure.string :as str]))

(def runnable-principal-kinds
  {"human" "human"
   "agent" "agent"
   "service" "service"
   "automation" "automation"})

(defn- nonblank
  [value]
  (some-> value str str/trim not-empty))

(defn- row-value
  [row & keys]
  (some (fn [key]
          (when (contains? row key)
            (get row key)))
        keys))

(defn row->runtime-binding
  "Project a joined active actor/entity row into RuntimePrincipalBinding.

   Returns nil for nil, inactive, or status-indeterminate rows. Organization
   entities are identity containers, not runnable principals, and therefore
   produce an explicit typed error rather than a silent remap."
  [row]
  (when row
    (let [status (some-> (row-value row :status :actor_status) str str/lower-case)
          actor-id (nonblank (row-value row :actor_id :id))
          entity-id (nonblank (row-value row :entity_id))
          entity-kind (some-> (row-value row :entity_kind :kind)
                              str str/lower-case)
          org-id (nonblank (row-value row :org_id))]
      (cond
        (not= "active" status)
        nil

        (nil? actor-id)
        (throw (ex-info "Runtime principal row is missing actor identity"
                        {:reason :missing-actor-id}))

        (nil? entity-id)
        (throw (ex-info "Runtime principal row is missing entity identity"
                        {:reason :missing-entity-id
                         :actor-id actor-id}))

        (= "org" entity-kind)
        (throw (ex-info "Organization entities are not runnable principals"
                        {:reason :unsupported-principal-kind
                         :actor-id actor-id
                         :entity-id entity-id
                         :entity-kind entity-kind}))

        (nil? (get runnable-principal-kinds entity-kind))
        (throw (ex-info "Unsupported runtime principal kind"
                        {:reason :unsupported-principal-kind
                         :actor-id actor-id
                         :entity-id entity-id
                         :entity-kind entity-kind}))

        :else
        (schema/validate!
         schema/RuntimePrincipalBinding
         (cond-> {:binding/version 1
                  :principal/actor-id actor-id
                  :principal/entity-id entity-id
                  :principal/kind (get runnable-principal-kinds entity-kind)}
           org-id (assoc :principal/org-id org-id)))))))