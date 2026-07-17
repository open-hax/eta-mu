(ns open-hax.sol.infra.agent.provider.eta-mu
  "Eta-mu provider adapter port for agent runtime session construction."
  (:require [open-hax.sol.domain.agent.settings :as agent-settings]
            [open-hax.sol.domain.models :as models]
            [open-hax.sol.extern.eta-mu :as eta-mu-extern]
            [open-hax.sol.extern.process :as process]
            [open-hax.sol.infra.agent.provider :refer [fetch-proxx-model-ids!]]))

(defprotocol IAgentProviderAdapter
  (ensure-runtime! [provider])
  (resolve-model [provider models provider-id model-id fallback-model-id])
  (create-session! [provider session-request])
  (send-message! [provider provider-session message-request])
  (subscribe-stream! [provider provider-session handlers]))

(defn- ^:async ensure-runtime-impl!
  [config]
  (let [model-ids (await (fetch-proxx-model-ids! config))
        runtime (await (eta-mu-extern/ensure-runtime!
                        config
                        (models/models-config config model-ids)))]
    (merge runtime
           (agent-settings/context-policy config)
           {:auth (agent-settings/provider-auth config process/env-var)})))

(defrecord EtaMuProviderAdapter [runtime config]
  IAgentProviderAdapter
  (ensure-runtime! [_]
    (ensure-runtime-impl! config))

  (resolve-model [_ models provider-id model-id fallback-model-id]
    (models/find-model models provider-id model-id fallback-model-id))

  (create-session! [_ session-request]
    (eta-mu-extern/create-session! session-request))

  (send-message! [_ provider-session message-request]
    (if-let [send! (:send-message! message-request)]
      (send! provider-session message-request)
      (js/Promise.reject (js/Error. "EtaMuProviderAdapter send-message! requires :send-message! in message-request"))))

  (subscribe-stream! [_ provider-session handlers]
    (if-let [subscribe! (:subscribe! handlers)]
      (subscribe! provider-session handlers)
      (js/Promise.reject (js/Error. "EtaMuProviderAdapter subscribe-stream! requires :subscribe! in handlers")))))

(defn eta-mu-provider
  [runtime config]
  (->EtaMuProviderAdapter runtime config))
