(ns open-hax.sol.infra.agent.provider.turn-processor
  "Turn-processor provider adapter for agent runtime session construction.

   Sessions are `open-hax.sol.infra.agent.turn-session` records whose turns
   run through the turn-processor run-loop with `eta-mu.extern.openai`
   streaming; model and auth arrive as plain config resolved from sol's
   decoupled settings (no SDK singletons, no on-disk models.json)."
  (:require [eta-mu.extern.openai :as openai]
            [eta-mu.infra.tools.registry :as tool-registry]
            [eta-mu.turn-processor.infra.loop :as loop]
            [eta-mu.turn-processor.shape.message :as shape.msg]
            [open-hax.sol.domain.agent.settings :as agent-settings]
            [open-hax.sol.domain.models :as models]
            [open-hax.sol.extern.process :as process]
            [open-hax.sol.infra.agent.media :as media]
            [open-hax.sol.infra.agent.provider :refer [fetch-proxx-model-ids!]]
            [open-hax.sol.infra.agent.turn-session :as turn-session]
            [open-hax.sol.shape.agent :as agent-shape]))

(defprotocol IAgentProviderAdapter
  (ensure-runtime! [provider])
  (resolve-model [provider models provider-id model-id fallback-model-id])
  (create-session! [provider session-request])
  (send-message! [provider provider-session message-request])
  (subscribe-stream! [provider provider-session handlers]))

(defn- ^:async ensure-runtime-impl!
  [config]
  (let [model-ids (await (fetch-proxx-model-ids! config))]
    {:models (models/models-config config model-ids)}))

(defn- provider-credentials
  [config model]
  (let [auth (agent-settings/provider-auth config process/env-var)
        provider-id (or (some-> (:provider model) str) "proxx")]
    (get auth provider-id)))

(defn- create-session-impl!
  [config {:keys [model thinking-level system-prompt custom-tools
                  tool-name-allowlist materialize!]}]
  (let [credentials (provider-credentials config model)
        tools (media/wrap-tools materialize!
                                (into (vec tool-registry/tools) (or custom-tools [])))
        session (turn-session/make-session
                 {:run-loop loop/run-loop
                  :stream-fn openai/stream-chat
                  :convert-to-llm shape.msg/messages->openai
                  :model (select-keys model [:id :provider])
                  :api-key (:api-key credentials)
                  :base-url (:base-url credentials)
                  :system-prompt system-prompt
                  :tools tools
                  :thinking-level thinking-level
                  :active-tools tool-name-allowlist})]
    {:session session}))

(defrecord TurnProcessorProviderAdapter [runtime config]
  IAgentProviderAdapter
  (ensure-runtime! [_]
    (ensure-runtime-impl! config))

  (resolve-model [_ models provider-id model-id fallback-model-id]
    (models/find-model models provider-id model-id fallback-model-id))

  (create-session! [_ session-request]
    (create-session-impl! config session-request))

  (send-message! [_ provider-session message-request]
    (agent-shape/send-user-message! provider-session (:content message-request)))

  (subscribe-stream! [_ provider-session handlers]
    (agent-shape/subscribe! provider-session (:handler handlers))))

(defn turn-processor-provider
  [runtime config]
  (->TurnProcessorProviderAdapter runtime config))
