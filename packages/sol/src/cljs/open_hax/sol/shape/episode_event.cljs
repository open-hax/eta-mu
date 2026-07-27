(ns open-hax.sol.shape.episode-event
  "Pure Sol projection onto the standalone event-ledger envelope.

   This namespace shapes references only. Axxium remains the authority for live
   principals; Katamorph remains the authority for actor/agent resources;
   event-ledger remains the authority for envelope validation and append
   semantics."
  (:require [clojure.string :as str]
            [open-hax.event-ledger :as event-ledger]))

(def principal-kinds
  #{"human" "agent" "service" "automation"})

(defn- nonblank-string
  [value]
  (some-> value str str/trim not-empty))

(defn- first-value
  [m keys]
  (some (fn [key]
          (when (contains? m key)
            (get m key)))
        keys))

(defn- shaped-string
  [m keys]
  (nonblank-string (first-value (or m {}) keys)))

(defn- principal-kind
  [auth-context agent-spec]
  (let [requested (some-> (shaped-string auth-context
                                         [:principalKind :principal-kind :principal_kind
                                          :actorKind :actor-kind :actor_kind])
                          str/lower-case)]
    (cond
      (contains? principal-kinds requested) requested
      (nonblank-string (:actor-id agent-spec)) "agent"
      :else "service")))

(defn resource-ref
  "Project the governing actor/agent resource reference from an agent spec."
  [agent-spec]
  (when-let [resource-id (nonblank-string (:contract-id agent-spec))]
    (cond-> {:resource/id resource-id}
      (nonblank-string (:contract-revision agent-spec))
      (assoc :resource/revision
             (nonblank-string (:contract-revision agent-spec))))))

(defn principal-binding
  "Build PrincipalBindingV1 only when both Axxium actor and entity identities
   are present. Missing identity is never fabricated from session/run IDs."
  [auth-context agent-spec]
  (let [actor-id (or (shaped-string auth-context [:actorId :actor-id :actor_id])
                     (nonblank-string (:actor-id agent-spec)))
        entity-id (shaped-string auth-context
                                 [:entityId :entity-id :entity_id
                                  :principalEntityId :principal-entity-id
                                  :principal_entity_id])
        org-id (shaped-string auth-context
                              [:orgId :org-id :org_id
                               :tenantId :tenant-id :tenant_id])
        actor-resource (resource-ref agent-spec)]
    (when (and actor-id entity-id)
      (cond-> {:binding/version 1
               :principal/actor-id actor-id
               :principal/entity-id entity-id
               :principal/kind (principal-kind auth-context agent-spec)}
        org-id (assoc :principal/org-id org-id)
        actor-resource (assoc :actor/resource actor-resource)))))

(defn actor-descriptor
  "Build transport attribution. The actor descriptor may exist without a
   principal binding; its fallback identifies the Sol runtime node, not an
   invented authenticated principal."
  [auth-context agent-spec node-id]
  (let [binding (principal-binding auth-context agent-spec)
        actor-id (or (:principal/actor-id binding)
                     (shaped-string auth-context [:actorId :actor-id :actor_id])
                     (nonblank-string (:actor-id agent-spec))
                     (nonblank-string node-id)
                     "sol.runtime")
        actor-kind (if binding
                     (:principal/kind binding)
                     (principal-kind auth-context agent-spec))]
    (cond-> {:actor-id actor-id
             :actor-kind actor-kind}
      (nonblank-string node-id) (assoc :actor-node (nonblank-string node-id))
      binding (assoc :principal/binding binding))))

(defn episode-context
  "Construct the immutable identity/correlation portion of one Sol turn
   episode. ID generation belongs to infra and is supplied by the caller."
  [{:keys [run-id session-id turn-id episode-id conversation-id causal-root
           node-id auth-context agent-spec]}]
  (let [actor (actor-descriptor auth-context agent-spec node-id)
        contract-ref (resource-ref agent-spec)]
    (cond-> {:run/id run-id
             :session/id session-id
             :turn/id turn-id
             :episode/id episode-id
             :causal/root causal-root
             :event/from actor}
      (nonblank-string conversation-id)
      (assoc :conversation/id (nonblank-string conversation-id))

      contract-ref
      (assoc :contracts [(:resource/id contract-ref)]
             :contract/refs [contract-ref]))))

(defn envelope
  "Build and validate one canonical event-ledger envelope.

   `parent-id` is nil for the first event. The caller owns sequencing and only
   advances the parent after successful append/acceptance."
  [episode event-id event-time parent-id event-type payload]
  (let [payload (cond-> (or payload {})
                  (:conversation/id episode)
                  (assoc :conversation/id (:conversation/id episode)))
        candidate (cond->
                   {:envelope/version 1
                    :event/id event-id
                    :event/type event-type
                    :event/time event-time
                    :event/from (:event/from episode)
                    :causal/root (:causal/root episode)
                    :session/id (:session/id episode)
                    :turn/id (:turn/id episode)
                    :run/id (:run/id episode)
                    :episode/id (:episode/id episode)
                    :delivery/mode "stream"
                    :payload payload}
                    parent-id (assoc :causal/parent parent-id)
                    (:contracts episode) (assoc :contracts (:contracts episode))
                    (:contract/refs episode) (assoc :contract/refs
                                                    (:contract/refs episode)))
        validation (event-ledger/validate-envelope candidate)]
    (when-not (:valid validation)
      (throw (ex-info "Sol produced an invalid event-ledger envelope"
                      {:event/type event-type
                       :errors (:errors validation)})))
    candidate))
