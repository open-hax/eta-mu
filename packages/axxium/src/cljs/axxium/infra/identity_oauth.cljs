(ns axxium.infra.identity-oauth
  "OAuth orchestration with durable browser state and explicit identity linking."
  (:require [axxium.domain.identity :as domain]
            [axxium.extern.identity-host :as host]
            [axxium.extern.oauth :as oauth]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-ceremonies :as ceremonies]
            [axxium.infra.identity-store :as store]
            [axxium.law.identity :as law]
            [axxium.shape.identity :as shape]
            [clojure.string :as str]))

(defn provider-config
  "Resolve server-owned settings; HTTP callers cannot choose endpoints or credentials."
  [service provider]
  (merge (get oauth/defaults provider) (get-in service [:options :providers provider])))

(defn configured?
  "Provider choice remains visible when configuration is missing."
  [service provider]
  (let [config (provider-config service provider)]
    (if (= :atproto provider)
      (boolean (seq (:client-id config)))
      (boolean (and (contains? oauth/defaults provider) (seq (:client-id config)) (seq (:client-secret config)))))))

(defn- private-sdk-store [identity-store prefix]
  {:get! (fn [key]
           (when-let [record (get-in (store/state identity-store) [:credentials (str prefix key)])]
             (store/unseal identity-store (:private-ref record))))
   :put! (fn [key value]
           (let [reference (store/seal! identity-store value)]
             (store/transact! identity-store
                              (fn [_] {:operation :oauth-private-state
                                       :changes [(domain/put :credentials (str prefix key) {:private-ref reference})]}))))
   :delete! (fn [key]
              (store/transact! identity-store
                               (fn [state] {:operation :oauth-private-state-deleted
                                            :changes (when (get-in state [:credentials (str prefix key)])
                                                       [(domain/remove-entry :credentials (str prefix key))])})))})

(defn- pending-sdk-store [identity-store]
  {:get! (fn [key] (ceremonies/private-value identity-store (str "atproto-state:" key)))
   :put! (fn [key value]
           (ceremonies/issue! identity-store (str "atproto-state:" key) (host/sha256 key)
                              :atproto/pending value identity/challenge-ttl-ms))
   :delete! (fn [key] (ceremonies/remove! identity-store (str "atproto-state:" key)))})

(defn ^:async create-atproto-client!
  "Create one SDK client per service process with protected persistent stores."
  [{:keys [store options] :as service}]
  (when (configured? service :atproto)
    (let [key "system:atproto-client-key"
          record (get-in (store/state store) [:credentials key])
          private-key (if record
                        (store/unseal store (:private-ref record))
                        (let [generated (oauth/generate-client-key)
                              reference (store/seal! store generated)]
                          (store/transact! store (fn [state]
                                                  (law/require! (nil? (get-in state [:credentials key]))
                                                                :concurrent-key-creation "ATProto client initialized concurrently; restart")
                                                  {:operation :oauth-client-key-created
                                                   :changes [(domain/put :credentials key {:private-ref reference})]}))
                          generated))]
      (await (oauth/atproto-client! {:client-id (:client-id (provider-config service :atproto))
                                     :origin (:public-base-url options) :private-key (:private-key private-key)
                                     :lock-directory (get-in store [:vault :directory])
                                     :state-store (pending-sdk-store store)
                                     :session-store (private-sdk-store store "atproto-session:")})))))

(defmulti begin!
  "Authentication providers own their distinct start protocol."
  (fn [_service provider _browser _token _query _client] provider))

(defn- begin-generic!
  [service provider browser-token session-token {:keys [redirect link]}]
  (law/require! (configured? service provider) :provider-not-configured "Identity provider is not configured")
  (let [actor (when (= "true" link) (identity/require-principal! service session-token))
        config (provider-config service provider)
        {:keys [verifier challenge]} (oauth/pkce)
        nonce (host/random-token)
        callback (oauth/callback-url (get-in service [:options :public-base-url]) provider)
        state (identity/challenge! service browser-token (keyword "oauth" (name provider))
                                   (cond-> {:redirect (shape/safe-redirect redirect) :verifier verifier :nonce nonce :redirect-uri callback}
                                     actor (assoc :link-principal-id (:principal/id actor)
                                                  :link-session-hash (host/sha256 session-token))))]
    (oauth/authorize-url provider config state challenge nonce callback)))

(defmethod begin! :github [service provider browser token query _] (begin-generic! service provider browser token query))
(defmethod begin! :discord [service provider browser token query _] (begin-generic! service provider browser token query))
(defmethod begin! :google [service provider browser token query _] (begin-generic! service provider browser token query))
(defmethod begin! :atproto [service _ browser token {:keys [handle redirect link]} client]
  (law/require! client :provider-not-configured "ATProto client metadata is not configured")
  (law/require! (and (string? handle) (<= 3 (count handle) 2048)) :invalid-handle "ATProto handle or DID is required")
  (let [actor (when (= "true" link) (identity/require-principal! service token))
        state (identity/challenge! service browser :oauth/atproto
                                   (cond-> {:redirect (shape/safe-redirect redirect)}
                                     actor (assoc :link-principal-id (:principal/id actor)
                                                  :link-session-hash (host/sha256 token))))]
    (oauth/atproto-authorize! client handle state)))
(defmethod begin! :default [_ _ _ _ _ _]
  (throw (ex-info "Unsupported identity provider" {:code :unsupported-provider})))

(defn ^:async finish!
  "Validate browser-bound callback state before accepting any external identity."
  [service provider browser query client]
  (if (= :atproto provider)
    (let [_ (identity/read-challenge service browser (:state query) :oauth/atproto)
          {:keys [state identity]} (await (oauth/atproto-callback! client query))]
      (law/require! (= state (:state query)) :invalid-callback "OAuth callback state changed")
      (identity/read-challenge service browser state :oauth/atproto)
      (identity/accept-external! service browser state :oauth/atproto identity))
    (let [state (:state query)
          purpose (keyword "oauth" (name provider))
          data (identity/read-challenge service browser state purpose)]
      (law/require! (and (configured? service provider) (not (str/blank? (:code query))))
                    :invalid-callback "Invalid OAuth callback")
      (let [verified (await (oauth/exchange! provider (provider-config service provider)
                                            (assoc data :code (:code query))))]
        (identity/accept-external! service browser state purpose verified)))))
