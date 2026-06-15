(ns open-hax.sol.infra.agent.session
  "Minimal in-process agent session registry for Sol."
  (:require [clojure.string :as str]
            [open-hax.sol.domain.models :refer [normalize-thinking-level effective-thinking-level resolve-model-contract]]
            [open-hax.sol.extern.eta-mu :as eta-mu-extern]
            [open-hax.sol.infra.agent.content-codec :as content-codec]
            [open-hax.sol.infra.agent.provider.eta-mu :as eta-mu-provider]
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

(defn ^:async create-agent-session!
  "Create a new eta-mu backed agent session from a normalized request map.
   Returns the EtaMuSession record."
  [{:keys [config runtime conversation-id model-id thinking-level session-id]}]
  (let [provider (eta-mu-provider/eta-mu-provider runtime config)
        {:keys [auth-storage model-registry settings-manager loader runtime-dir]} (await (eta-mu-provider/ensure-runtime! provider))
        model (eta-mu-extern/find-model model-registry
                                        (or (some-> (resolve-model-contract config model-id) :provider)
                                            "proxx")
                                        model-id
                                        (:proxx-default-model config))]
    (when (no-content? model)
      (throw (js/Error. (str "No eta-mu model configured for " model-id))))
    (let [session-manager (eta-mu-extern/make-session-manager! (:workspace-root config) session-id)
          {:keys [session]} (await (eta-mu-extern/create-session!
                                    {:workspace-root (:workspace-root config)
                                     :runtime-dir runtime-dir
                                     :auth-storage auth-storage
                                     :model-registry model-registry
                                     :loader loader
                                     :settings-manager settings-manager
                                     :session-manager session-manager
                                     :model model
                                     :thinking-level thinking-level
                                     :custom-tools []
                                     :materialize! content-codec/materialize!}))]
      (set-active-tools! session ["read" "bash" "edit" "write"])
      (set-thinking-level! session thinking-level)
      (swap! sessions* assoc conversation-id
             {:session session
              :model-id model-id
              :session-id session-id
              :touched (js/Date.now)})
      session)))

(defn ^:async ensure-agent-session!
  "Return an existing agent session for the conversation, or create one.
   Accepts a single normalized map."
  [{:keys [config runtime conversation-id model-id thinking-level session-id agent-spec] :as opts}]
  (let [effective-level (effective-thinking-level config model-id (or (normalize-thinking-level thinking-level)
                                                                      thinking-level
                                                                      (:agent-thinking-level config)
                                                                      "off"))
        current-entry (active-session-entry conversation-id)]
    (if (and current-entry
             (= (str (:model-id current-entry)) (str model-id)))
      (:session current-entry)
      (await (create-agent-session! (assoc opts :thinking-level effective-level))))))

(defn prune-session-messages
  [_agent-spec messages]
  (vec messages))

(defn fetch-b64!
  [url media-type]
  (content-codec/fetch-b64! url media-type))

(defn materialize!
  [part]
  (content-codec/materialize! part))
