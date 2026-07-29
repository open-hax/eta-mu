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

(defn- key-string
  [key]
  (if (keyword? key)
    (if-let [key-ns (namespace key)]
      (str key-ns "/" (name key))
      (name key))
    (str key)))

(defn- first-value
  [m keys]
  (some (fn [key]
          (let [string-key (key-string key)]
            (cond
              (contains? m key) (get m key)
              (contains? m string-key) (get m string-key)
              :else nil)))
        keys))

(defn- shaped-string
  [m keys]
  (nonblank-string (first-value (or m {}) keys)))

(defn- binding-source
  [auth-context]
  (let [auth-context (or auth-context {})
        nested (first-value auth-context
                            [:principal/binding
                             :principalBinding
                             :principal-binding
                             :principal_binding
                             :runtimeBinding
                             :runtime-binding
                             :runtime_binding])]
    (if (map? nested) nested auth-context)))

(defn- supplied-principal-kind
  [auth-context]
  (let [source (binding-source auth-context)
        requested (some-> (or (shaped-string source
                                              [:principal/kind
                                               :principalKind
                                               :principal-kind
                                               :principal_kind])
                              (shaped-string auth-context
                                             [:auth/principal-kind
                                              :auth/principalKind
                                              :principalKind
                                              :principal-kind
                                              :principal_kind]))
                          str/lower-case)]
    (when (contains? principal-kinds requested)
      requested)))

(defn- binding-version
  [source]
  (let [value (first-value source
                           [:binding/version
                            :bindingVersion
                            :binding-version
                            :binding_version])]
    (cond
      (nil? value) 1
      (= 1 value) 1
      (= "1" (str value)) 1
      :else
      (throw (ex-info "Unsupported Axxium runtime binding version"
                      {:binding/version value})))))

(defn resource-ref
  "Project the governing actor/agent resource reference from an agent spec."
  [agent-spec]
  (when-let [resource-id (nonblank-string (:contract-id agent-spec))]
    (cond-> {:resource/id resource-id}
      (nonblank-string (:contract-revision agent-spec))
      (assoc :resource/revision
             (nonblank-string (:contract-revision agent-spec))))))

(defn principal-binding
  "Build the event-ledger PrincipalBindingV1 only from supplied Axxium identity.

   Accepted input includes Axxium's canonical RuntimePrincipalBinding map,
   a nested `:principal/binding`, Axxium `:auth/*` identity keys accompanied by
   a supplied principal kind, and legacy transport aliases. Agent specs may add
   a Katamorph resource reference but never fabricate principal identity/kind."
  [auth-context agent-spec]
  (let [source (binding-source auth-context)
        actor-id (or (shaped-string source
                                    [:principal/actor-id
                                     :actorId :actor-id :actor_id])
                     (shaped-string auth-context
                                    [:auth/actor-id
                                     :actorId :actor-id :actor_id]))
        entity-id (or (shaped-string source
                                     [:principal/entity-id
                                      :entityId :entity-id :entity_id
                                      :principalEntityId :principal-entity-id
                                      :principal_entity_id])
                      (shaped-string auth-context
                                     [:auth/entity-id
                                      :entityId :entity-id :entity_id]))
        org-id (or (shaped-string source
                                  [:principal/org-id
                                   :orgId :org-id :org_id
                                   :tenantId :tenant-id :tenant_id])
                   (shaped-string auth-context
                                  [:auth/org-id
                                   :orgId :org-id :org_id
                                   :tenantId :tenant-id :tenant_id]))
        principal-kind (supplied-principal-kind auth-context)
        actor-resource (resource-ref agent-spec)]
    (when (and actor-id entity-id principal-kind)
      (cond-> {:binding/version (binding-version source)
               :principal/actor-id actor-id
               :principal/entity-id entity-id
               :principal/kind principal-kind}
        org-id (assoc :principal/org-id org-id)
        actor-resource (assoc :actor/resource actor-resource)))))

(defn- transport-actor-kind
  [auth-context agent-spec]
  (or (supplied-principal-kind auth-context)
      (when (nonblank-string (:actor-id agent-spec)) "agent")
      "service"))

(defn actor-descriptor
  "Build transport attribution. The actor descriptor may exist without a
   principal binding; its fallback identifies the Sol runtime node, not an
   invented authenticated principal."
  [auth-context agent-spec node-id]
  (let [binding (principal-binding auth-context agent-spec)
        source (binding-source auth-context)
        actor-id (or (:principal/actor-id binding)
                     (shaped-string source
                                    [:principal/actor-id
                                     :actorId :actor-id :actor_id])
                     (shaped-string auth-context
                                    [:auth/actor-id
                                     :actorId :actor-id :actor_id])
                     (nonblank-string (:actor-id agent-spec))
                     (nonblank-string node-id)
                     "sol.runtime")
        actor-kind (or (:principal/kind binding)
                       (transport-actor-kind auth-context agent-spec))]
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