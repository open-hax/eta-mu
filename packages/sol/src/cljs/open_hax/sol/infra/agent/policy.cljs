(ns open-hax.sol.infra.agent.policy
  "Chat policy enforcement: model allow-lists and rate-limiting.
   Sol-compatible stub: allows all models and skips rate limits.")

(defn- check-model-policy!
  "Throw if model-id is not in the allow-list."
  [model-id permitted-models]
  (when (and (seq permitted-models)
             (not (contains? permitted-models model-id)))
    (throw (ex-info (str "Model '" model-id "' is not allowed")
                    {:status 403 :code "model_not_allowed"}))))

(defn enforce-chat-policy!
  "Enforce model allow-list and rate-limit constraints for a chat turn.
   Returns a Promise that resolves to nil on success or rejects on policy violation."
  [_auth-context model-id]
  (check-model-policy! model-id #{})
  (js/Promise.resolve nil))

(defprotocol IPolicyEngine
  (authorize-turn [engine turn-request])
  (resolve-model-policy [engine auth-context requested-model])
  (resolve-tool-policy [engine auth-context agent-spec])
  (resolve-resource-policy [engine auth-context agent-spec]))

(defrecord ChatPolicyEngine []
  IPolicyEngine
  (authorize-turn [_ turn-request]
    (enforce-chat-policy! (:auth-context turn-request)
                          (or (:model turn-request)
                              (get-in turn-request [:agent-spec :model]))))

  (resolve-model-policy [_ _auth-context requested-model]
    (enforce-chat-policy! nil requested-model)
    {:model requested-model :allowed true})

  (resolve-tool-policy [_ auth-context agent-spec]
    (js/Promise.resolve {:auth-context auth-context
                         :agent-spec agent-spec}))

  (resolve-resource-policy [_ auth-context agent-spec]
    (js/Promise.resolve {:auth-context auth-context
                         :agent-spec agent-spec})))

(def default-policy-engine
  (->ChatPolicyEngine))

(defn validate-chat-policy!
  [auth-context model-id]
  (resolve-model-policy default-policy-engine auth-context model-id))
