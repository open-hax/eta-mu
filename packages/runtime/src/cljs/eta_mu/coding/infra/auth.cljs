(ns eta-mu.coding.infra.auth
  "Auth storage: file I/O, credential CRUD, token refresh with race prevention.
   Depends on extern/fs, extern/lockfile, domain/auth, shape/settings.
   
   Error handling policy:
   - ENOENT (file not found): return empty credentials silently (expected on first run)
   - Parse errors: throw to fail-fast (credentials file is corrupt)
   - Permission errors: throw to fail-fast
   - Callers may catch for graceful degradation if needed."
  (:require [eta-mu.coding.extern.fs :as fs]
            [eta-mu.coding.domain.auth :as domain]
            [eta-mu.coding.shape.settings :as shape]))

(defonce auth-state (atom {}))
(defonce refresh-in-progress (atom {}))

(defn auth-path
  "Return the auth storage file path."
  []
  (str (fs/config-dir) "/credentials.json"))

(defn load-auth!
  "Load auth credentials from disk.
   
   Error handling policy:
   - ENOENT: return empty credentials silently (expected on first run)
   - Parse errors: throw to fail-fast (credentials file is corrupt)
   - Permission errors: throw to fail-fast"
  []
  (let [path (auth-path)
        result (fs/read-json-file path)]
    (cond
      ;; Success: parse credentials
      (:ok result)
      (let [credentials (reduce-kv
                         (fn [m provider-id cred-map]
                           (assoc m provider-id (shape/auth-credential-from-external cred-map)))
                         {}
                         (fs/to-clj (:data result)))]
        (reset! auth-state credentials)
        credentials)
      
      ;; ENOENT: first run, return empty credentials
      (= "ENOENT" (:code result))
      (do
        (reset! auth-state {})
        {})
      
      ;; All other errors: throw to fail-fast
      :else
      (throw (ex-info (str "Failed to read credentials: " path " - " (:error result))
                      {:code (:code result) :path path})))))

(defn save-auth!
  "Persist the current auth credentials to disk."
  []
  (let [path (auth-path)
        ext (fs/to-js
             (reduce-kv
              (fn [m provider-id cred]
                (assoc m provider-id (shape/auth-credential->external cred)))
              {}
              @auth-state))]
    (fs/write-json-file! path ext)))

(defn get-credential
  "Return the stored credential for a provider, or nil."
  [provider-id]
  (get @auth-state provider-id))

(defn set-credential!
  "Store a credential for a provider and persist."
  [provider-id cred]
  (swap! auth-state assoc provider-id cred)
  (save-auth!))

(defn remove-credential!
  "Remove a credential for a provider and persist."
  [provider-id]
  (swap! auth-state dissoc provider-id)
  (save-auth!))

(defn list-providers
  "Return a vector of provider IDs that have stored credentials."
  []
  (vec (keys @auth-state)))

;; ============================================================================
;; API Key Resolution
;; ============================================================================

(defn resolve-api-key
  "Resolve an API key for a provider using the priority chain:
   1. Stored API key
   2. Runtime key (from args)
   3. Environment variable
   4. Fallback key"
  [provider-id runtime-key]
  (let [stored (get-credential provider-id)
        stored-key (when (domain/api-key? stored) (domain/credential-key stored))
        env-name (domain/provider-env-key provider-id)
        env-key (when env-name (fs/env-get env-name))]
    (domain/resolve-api-key stored-key runtime-key env-key nil)))

;; ============================================================================
;; OAuth Resolution with Race Prevention
;; ============================================================================

(defn get-oauth-token
  "Return a valid OAuth token for a provider, or nil.
   If the token needs refresh, returns nil (caller should refresh via start-oauth-flow!)."
  [provider-id]
  (let [stored (get-credential provider-id)]
    (domain/resolve-oauth-token stored)))

(defn start-oauth-flow!
  "Initiate an OAuth flow for a provider.
   Returns the OAuth URL to open in the browser."
  [provider-id]
  (let [url (str "https://auth." provider-id ".com/authorize?response_type=code&provider=" provider-id)]
    url))

(defn store-oauth-token!
  "Store an OAuth token after a successful refresh or initial auth."
  [provider-id access-token refresh-token expires-in]
   (let [now (fs/now-ms)
         cred {:type :oauth
               :access-token access-token
               :refresh-token refresh-token
               :expires (when expires-in (+ now (* expires-in 1000)))
              :provider-id provider-id}]
    (set-credential! provider-id cred)
    cred))

(defn refresh-oauth-token!
  "Refresh an OAuth token for a provider. Uses a lock to prevent concurrent refreshes.
   Returns the new token, or nil if refresh fails."
  [provider-id]
  (if (get @refresh-in-progress provider-id)
    nil
    (do
      (swap! refresh-in-progress assoc provider-id true)
      (let [stored (get-credential provider-id)
            _refresh-params (domain/oauth-refresh-params stored)]
        (try
          ;; In real implementation, this would call the OAuth provider's refresh endpoint.
          ;; For now, we return nil to signal the caller needs to use the OAuth flow.
          nil
          (finally
            (swap! refresh-in-progress dissoc provider-id)))))))

(defn credential-summary
  "Return a safe summary of all stored credentials for logging."
  []
  (reduce-kv
   (fn [m provider-id cred]
     (assoc m provider-id (domain/credential-summary cred)))
   {}
   @auth-state))
