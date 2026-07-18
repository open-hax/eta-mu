(ns open-hax.sol.infra.agent.session
  "Minimal in-process agent session registry for Sol."
  (:require [clojure.string :as str]
            [open-hax.sol.domain.models :as models :refer [normalize-thinking-level effective-thinking-level resolve-model-contract]]
            [open-hax.sol.infra.agent.content-codec :as content-codec]
            [open-hax.sol.infra.agent.mcp-tools :as mcp-tools]
            [open-hax.sol.infra.agent.provider.turn-processor :as turn-processor-provider]
            [open-hax.sol.infra.http :refer [no-content?]]
            [open-hax.sol.shape.agent :refer [set-active-tools! set-thinking-level!]]))

(defonce sessions* (atom {}))

(def ^:private inactive-ttl-ms (* 30 60 1000))
(def ^:private sweep-interval-ms 300000)

(defn- start-sweep!
  []
  (js/setInterval
   (fn []
     (let [cutoff (- (js/Date.now) inactive-ttl-ms)]
       (swap! sessions*
              (fn [m]
                (into {}
                      (filter (fn [[_ entry]]
                                (> (or (:touched entry) 0) cutoff))
                              m))))))
   sweep-interval-ms))

(start-sweep!)

(defn active-agent-session
  [conversation-id]
  (some-> (get @sessions* conversation-id) :session))

(defn- active-session-entry
  [conversation-id]
  (get @sessions* conversation-id))

(defn remove-agent-session!
  [conversation-id]
  (swap! sessions* dissoc conversation-id)
  nil)

(defn- agent-spec-model
  [agent-spec]
  (some-> agent-spec :model str str/trim not-empty))

(defn- agent-spec-thinking-level
  [agent-spec]
  (some-> agent-spec :thinking-level str str/trim not-empty))

(defn- agent-spec-system-prompt
  [agent-spec]
  (some-> agent-spec :system-prompt str str/trim not-empty))

(defn- agent-spec-tool-ids
  [agent-spec]
  (vec (or (:tool-ids agent-spec) [])))

(defn- effective-session-model
  [config models-data agent-spec model-id fallback-model-id]
  (let [contract-model-id (agent-spec-model agent-spec)
        effective-id (or contract-model-id model-id)
        resolved (resolve-model-contract config effective-id)]
    (models/find-model models-data
                       (or (:provider resolved) "proxx")
                       effective-id
                       fallback-model-id)))

(defn- effective-session-thinking-level
  [config agent-spec model-id thinking-level]
  (let [contract-level (some-> (agent-spec-thinking-level agent-spec) normalize-thinking-level)
        requested (or (normalize-thinking-level thinking-level)
                      thinking-level)]
    (effective-thinking-level config model-id
                              (or contract-level
                                  requested
                                  (:agent-thinking-level config)
                                  "off"))))

(defn ^:async create-agent-session!
  "Create a new turn-processor backed agent session from a normalized request
   map. Returns the session record implementing IAgentSession."
  [{:keys [config runtime conversation-id model-id thinking-level session-id agent-spec]}]
  (let [provider (turn-processor-provider/turn-processor-provider runtime config)
        {:keys [models]} (await (turn-processor-provider/ensure-runtime! provider))
        model (effective-session-model config models agent-spec model-id (:proxx-default-model config))]
    (when (no-content? model)
      (throw (js/Error. (str "No agent model configured for " (or (agent-spec-model agent-spec) model-id)))))
    (let [effective-level (effective-session-thinking-level config agent-spec (:id model) thinking-level)
          tool-ids (agent-spec-tool-ids agent-spec)
          custom-tools (await (mcp-tools/build-mcp-custom-tools! config tool-ids))
          tool-names (or (seq tool-ids)
                         ["read" "bash" "edit" "write"])
          {:keys [session]} (await (turn-processor-provider/create-session!
                                    provider
                                    {:model model
                                     :thinking-level effective-level
                                     :system-prompt (agent-spec-system-prompt agent-spec)
                                     :custom-tools custom-tools
                                     :tool-name-allowlist tool-names
                                     :materialize! content-codec/materialize!}))]
      (set-active-tools! session tool-names)
      (set-thinking-level! session effective-level)
      (swap! sessions* assoc conversation-id
             {:session session
              :model-id (:id model)
              :session-id session-id
              :touched (js/Date.now)})
      session)))

(defn ^:async ensure-agent-session!
  "Return an existing agent session for the conversation, or create one.
   Accepts a single normalized map."
  [{:keys [model-id agent-spec] :as opts}]
  (let [effective-model-id (or (agent-spec-model agent-spec) model-id)
        current-entry (active-session-entry (:conversation-id opts))]
    (if (and current-entry
             (= (str (:model-id current-entry)) (str effective-model-id)))
      (:session current-entry)
      (await (create-agent-session! (assoc opts :model-id effective-model-id))))))

(defn prune-session-messages
  [_agent-spec messages]
  (vec messages))

