(ns axxium.infra.identity-oauth
  "OAuth orchestration with durable browser state and explicit identity linking."
  (:require [axxium.domain.identity-oauth :as policy]
            [axxium.extern.identity-host :as host]
            [axxium.extern.oauth :as oauth]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-admission :as admission]
            [axxium.infra.identity-sdk-store :as sdk-store]
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

(defn ^:async create-atproto-client!
  "Create one SDK client per service process with protected persistent stores."
  [{:keys [store options] :as service}]
  (when (configured? service :atproto)
    (let [candidate (delay (store/seal! store (oauth/generate-client-key)))
          reference (await (admission/retry!
                            #(let [prepared (when-not (get-in (store/state store) [:credentials policy/client-key])
                                              @candidate)]
                               ;; Key generation stays outside the pure transition. The
                               ;; current locked snapshot decides which replica won; its
                               ;; no-op transaction also fences an existing accepted key.
                               (store/transact! store (fn [state] (policy/select-client-key state prepared))))))
          private-key (store/unseal store reference)]
      (await (oauth/atproto-client! {:client-id (:client-id (provider-config service :atproto))
                                     :origin (:public-base-url options) :private-key (:private-key private-key)
                                     :lock-directory (get-in store [:vault :directory])
                                     :state-store (sdk-store/pending-store store identity/challenge-ttl-ms)
                                     :session-store (sdk-store/private-store store "atproto-session:")})))))

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
(defmethod begin! :atproto ^:async begin-atproto [service _ browser token {:keys [handle redirect link]} client]
  (law/require! client :provider-not-configured "ATProto client metadata is not configured")
  (law/require! (and (string? handle) (<= 3 (count handle) 2048)) :invalid-handle "ATProto handle or DID is required")
  (let [actor (when (= "true" link) (identity/require-principal! service token))
        state (identity/challenge! service browser :oauth/atproto
                                   (cond-> {:redirect (shape/safe-redirect redirect)}
                                     actor (assoc :link-principal-id (:principal/id actor)
                                                  :link-session-hash (host/sha256 token))))]
    (await (oauth/atproto-authorize! client handle state))))
(defmethod begin! :default [_ _ _ _ _ _]
  (throw (ex-info "Unsupported identity provider" {:code :unsupported-provider})))

(defn- ^:async accept-verified!
  "Recheck current challenge and linking authority while retrying only local admission."
  [service browser state purpose verified]
  (await (admission/retry! #(identity/accept-external! service browser state purpose verified))))

(defn ^:async finish!
  "Validate browser-bound callback state before accepting any external identity."
  [service provider browser query client]
  (if (= :atproto provider)
    (let [app-state (await (oauth/atproto-app-state! client query))
          _ (identity/read-challenge service browser app-state :oauth/atproto)
          {:keys [state identity]} (await (oauth/atproto-callback! client query))]
      (law/require! (= state app-state) :invalid-callback "OAuth callback application state changed")
      (identity/read-challenge service browser state :oauth/atproto)
      (await (accept-verified! service browser state :oauth/atproto identity)))
    (let [state (:state query)
          purpose (keyword "oauth" (name provider))
          data (identity/read-challenge service browser state purpose)]
      (law/require! (and (configured? service provider) (not (str/blank? (:code query))))
                    :invalid-callback "Invalid OAuth callback")
      (let [verified (await (oauth/exchange! provider (provider-config service provider)
                                            (assoc data :code (:code query))))]
        (await (accept-verified! service browser state purpose verified))))))
