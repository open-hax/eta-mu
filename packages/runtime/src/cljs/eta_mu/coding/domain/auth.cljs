(ns eta-mu.coding.domain.auth
  "Pure domain functions for auth credential management.
   No I/O — credential type detection, provider extraction, validation, refresh logic."
  (:require [eta-mu.coding.extern.fs :as fs]))

;; ============================================================================
;; Credential Predicates
;; ============================================================================

(defn api-key?
  "Return true if the credential is an API key."
  [cred]
  (= :api-key (:type cred)))

(defn oauth?
  "Return true if the credential is an OAuth token."
  [cred]
  (= :oauth (:type cred)))

(defn oauth-expired?
  "Return true if an OAuth token has expired.
   Uses a 60-second safety margin before actual expiry."
  [cred]
  (if-let [expires (:expires cred)]
    (let [now-ms (fs/now-ms)
          safety-margin-ms 60000]
      (> now-ms (- expires safety-margin-ms)))
    false))

(defn oauth-expires-within?
  "Return true if an OAuth token expires within the given milliseconds."
  [cred ms]
  (if-let [expires (:expires cred)]
    (let [now-ms (fs/now-ms)]
      (> now-ms (- expires ms)))
    false))

;; ============================================================================
;; Credential Extraction
;; ============================================================================

(defn credential-key
  "Return the API key string from a credential, or nil."
  [cred]
  (when (api-key? cred) (:key cred)))

(defn credential-access-token
  "Return the access token from an OAuth credential, or nil."
  [cred]
  (when (oauth? cred) (:access-token cred)))

(defn credential-refresh-token
  "Return the refresh token from an OAuth credential, or nil."
  [cred]
  (when (oauth? cred) (:refresh-token cred)))

(defn credential-provider-id
  "Return the provider ID from an OAuth credential, or nil."
  [cred]
  (when (oauth? cred) (:provider-id cred)))

;; ============================================================================
;; Credential Validation
;; ============================================================================

(defn valid-credential?
  "Return true if a credential has all required fields for its type."
  [cred]
  (case (:type cred)
    :api-key (string? (:key cred))
    :oauth (and (string? (:access-token cred))
                (string? (:provider-id cred))
                (number? (:expires cred)))
    false))

(defn credential-summary
  "Return a safe summary of a credential for logging (no secrets)."
  [cred]
  (case (:type cred)
    :api-key {:type :api-key
              :key-length (count (:key cred))
              :key-preview (when-let [k (:key cred)]
                             (str (subs k 0 (min 4 (count k))) "..."))}
    :oauth {:type :oauth
            :provider-id (:provider-id cred)
            :expired? (oauth-expired? cred)
            :expires (:expires cred)}
    nil))

;; ============================================================================
;; Resolution Priority Chain
;; ============================================================================

(defn resolve-api-key
  "Resolve an API key using the priority chain:
   1. Stored key (from auth storage)
   2. Runtime key (from --api-key flag)
   3. Environment variable (ANTHROPIC_API_KEY / OPENAI_API_KEY / GEMINI_API_KEY)
   4. Fallback (from models.json file)
   5. nil if not found"
  [stored-key runtime-key env-key fallback-key]
  (or stored-key runtime-key env-key fallback-key nil))

(defn resolve-oauth-token
  "Resolve an OAuth token. Returns the token if valid and not expired,
   otherwise returns nil (caller should refresh)."
  [stored-token]
  (when (and stored-token (valid-credential? stored-token) (not (oauth-expired? stored-token)))
    stored-token))

;; ============================================================================
;; OAuth Token Refresh
;; ============================================================================

(defn oauth-refresh-needed?
  "Return true if the OAuth token should be refreshed proactively."
  [cred]
  (and (oauth? cred)
       (oauth-expired? cred)))

(defn oauth-refresh-params
  "Return the parameters needed for an OAuth refresh request."
  [cred]
  (when (oauth? cred)
    {:refresh-token (:refresh-token cred)
     :provider-id (:provider-id cred)}))

(defn oauth-update-tokens
  "Return a new OAuth credential with updated tokens from a refresh response."
  [cred refresh-response]
  (when (and (oauth? cred) refresh-response)
    (assoc cred
           :access-token (:access_token refresh-response)
           :refresh-token (or (:refresh_token refresh-response) (:refresh-token cred))
           :expires (when-let [expires-in (:expires_in refresh-response)]
                      (+ (fs/now-ms) (* expires-in 1000))))))

;; ============================================================================
;; Provider Environment Mapping
;; ============================================================================

(defn provider-env-key
  "Return the environment variable name for a provider's API key."
  [provider-id]
  (case provider-id
    "anthropic" "ANTHROPIC_API_KEY"
    "openai" "OPENAI_API_KEY"
    "gemini" "GEMINI_API_KEY"
    "deepseek" "DEEPSEEK_API_KEY"
    "openrouter" "OPENROUTER_API_KEY"
    "github-copilot" "GITHUB_TOKEN"
    "cerebras" "CEREBRAS_API_KEY"
    "groq" "GROQ_API_KEY"
    "sambanova" "SAMBANOVA_API_KEY"
    nil))

(defn provider-display-name
  "Return the human-readable display name for a provider."
  [provider-id]
  (case provider-id
    "anthropic" "Anthropic"
    "openai" "OpenAI"
    "gemini" "Google Gemini"
    "deepseek" "DeepSeek"
    "openrouter" "OpenRouter"
    "github-copilot" "GitHub Copilot"
    "cerebras" "Cerebras"
    "groq" "Groq"
    "sambanova" "SambaNova"
    provider-id))
