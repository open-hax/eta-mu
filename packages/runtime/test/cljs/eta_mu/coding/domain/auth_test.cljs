(ns eta-mu.coding.domain.auth-test
  (:require [clojure.test :refer [deftest testing is]]
            [eta-mu.coding.domain.auth :as domain]))

;; ============================================================================
;; Credential Predicates
;; ============================================================================

(deftest api-key-predicate
  (testing "api-key? returns true for api-key credentials"
    (is (true? (domain/api-key? {:type :api-key :key "sk-abc"}))))
  (testing "api-key? returns false for oauth credentials"
    (is (false? (domain/api-key? {:type :oauth})))))

(deftest oauth-predicate
  (testing "oauth? returns true for oauth credentials"
    (is (true? (domain/oauth? {:type :oauth}))))
  (testing "oauth? returns false for api-key credentials"
    (is (false? (domain/oauth? {:type :api-key})))))

(deftest oauth-expired-predicate
  (testing "oauth-expired? returns true when expired"
    (let [cred {:type :oauth :expires 1000}]
      (is (true? (domain/oauth-expired? cred)))))
  (testing "oauth-expired? returns false when not expired"
    (let [cred {:type :oauth :expires 999999999999999}]
      (is (false? (domain/oauth-expired? cred)))))
  (testing "oauth-expired? returns false when no expires"
    (is (false? (domain/oauth-expired? {:type :oauth})))))

(deftest oauth-expires-within
  (testing "oauth-expires-within? returns true when within window"
    (let [cred {:type :oauth :expires (+ (js/Date.now) 30000)}]
      (is (true? (domain/oauth-expires-within? cred 60000)))))
  (testing "oauth-expires-within? returns false when outside window"
    (let [cred {:type :oauth :expires (+ (js/Date.now) 120000)}]
      (is (false? (domain/oauth-expires-within? cred 60000))))))

;; ============================================================================
;; Credential Extraction
;; ============================================================================

(deftest credential-key
  (testing "credential-key returns key for api-key"
    (is (= "sk-abc" (domain/credential-key {:type :api-key :key "sk-abc"}))))
  (testing "credential-key returns nil for oauth"
    (is (nil? (domain/credential-key {:type :oauth})))))

(deftest credential-access-token
  (testing "credential-access-token returns token for oauth"
    (is (= "tok_123" (domain/credential-access-token {:type :oauth :access-token "tok_123"}))))
  (testing "credential-access-token returns nil for api-key"
    (is (nil? (domain/credential-access-token {:type :api-key})))))

(deftest credential-refresh-token
  (testing "credential-refresh-token returns refresh token"
    (is (= "ref_456" (domain/credential-refresh-token {:type :oauth :refresh-token "ref_456"}))))
  (testing "credential-refresh-token returns nil for api-key"
    (is (nil? (domain/credential-refresh-token {:type :api-key})))))

(deftest credential-provider-id
  (testing "credential-provider-id returns provider id"
    (is (= "anthropic" (domain/credential-provider-id {:type :oauth :provider-id "anthropic"}))))
  (testing "credential-provider-id returns nil for api-key"
    (is (nil? (domain/credential-provider-id {:type :api-key})))))

;; ============================================================================
;; Credential Validation
;; ============================================================================

(deftest valid-credential
  (testing "valid-credential? returns true for valid api-key"
    (is (true? (domain/valid-credential? {:type :api-key :key "sk-abc"}))))
  (testing "valid-credential? returns true for valid oauth"
    (is (true? (domain/valid-credential? {:type :oauth :access-token "tok" :provider-id "anthropic" :expires 9999999999}))))
  (testing "valid-credential? returns false for invalid api-key"
    (is (false? (domain/valid-credential? {:type :api-key}))))
  (testing "valid-credential? returns false for invalid oauth"
    (is (false? (domain/valid-credential? {:type :oauth :access-token "tok"})))))

(deftest credential-summary
  (testing "credential-summary returns safe summary for api-key"
    (let [summary (domain/credential-summary {:type :api-key :key "sk-abc"})]
      (is (= :api-key (:type summary)))
      (is (= 6 (:key-length summary)))
      (is (string? (:key-preview summary)))))
  (testing "credential-summary returns safe summary for oauth"
    (let [summary (domain/credential-summary {:type :oauth :provider-id "anthropic" :expires 9999999999})]
      (is (= :oauth (:type summary)))
      (is (= "anthropic" (:provider-id summary)))
      (is (boolean? (:expired? summary)))))
  (testing "credential-summary returns nil for nil"
    (is (nil? (domain/credential-summary nil)))))

;; ============================================================================
;; Resolution Priority Chain
;; ============================================================================

(deftest resolve-api-key-priority
  (testing "stored key takes priority"
    (is (= "stored" (domain/resolve-api-key "stored" "runtime" "env" "fallback"))))
  (testing "runtime key used when no stored"
    (is (= "runtime" (domain/resolve-api-key nil "runtime" "env" "fallback"))))
  (testing "env key used when no stored/runtime"
    (is (= "env" (domain/resolve-api-key nil nil "env" "fallback"))))
  (testing "fallback key used when nothing else"
    (is (= "fallback" (domain/resolve-api-key nil nil nil "fallback"))))
  (testing "nil when nothing available"
    (is (nil? (domain/resolve-api-key nil nil nil nil)))))

(deftest resolve-oauth-token
  (testing "resolve-oauth-token returns valid token"
    (let [cred {:type :oauth :access-token "tok" :provider-id "anthropic" :expires 999999999999999}]
      (is (= cred (domain/resolve-oauth-token cred)))))
  (testing "resolve-oauth-token returns nil when expired"
    (let [cred {:type :oauth :access-token "tok" :provider-id "anthropic" :expires 1000}]
      (is (nil? (domain/resolve-oauth-token cred)))))
  (testing "resolve-oauth-token returns nil for nil"
    (is (nil? (domain/resolve-oauth-token nil)))))

;; ============================================================================
;; OAuth Token Refresh
;; ============================================================================

(deftest oauth-refresh-needed
  (testing "oauth-refresh-needed? returns true when expired"
    (let [cred {:type :oauth :expires 1000}]
      (is (true? (domain/oauth-refresh-needed? cred)))))
  (testing "oauth-refresh-needed? returns false when valid"
    (is (false? (domain/oauth-refresh-needed? {:type :oauth :expires 999999999999999})))))

(deftest oauth-refresh-params
  (testing "oauth-refresh-params returns params for oauth"
    (let [cred {:type :oauth :refresh-token "ref_123" :provider-id "anthropic"}
          params (domain/oauth-refresh-params cred)]
      (is (= "ref_123" (:refresh-token params)))
      (is (= "anthropic" (:provider-id params)))))
  (testing "oauth-refresh-params returns nil for api-key"
    (is (nil? (domain/oauth-refresh-params {:type :api-key})))))

(deftest oauth-update-tokens
  (testing "oauth-update-tokens updates credential with new tokens"
    (let [cred {:type :oauth :access-token "old_tok" :refresh-token "ref" :provider-id "anthropic" :expires 1000}
          response {:access_token "new_tok" :refresh_token "new_ref" :expires_in 3600}
          result (domain/oauth-update-tokens cred response)]
      (is (= "new_tok" (:access-token result)))
      (is (= "new_ref" (:refresh-token result)))
      (is (number? (:expires result)))))
  (testing "oauth-update-tokens preserves refresh token when not provided"
    (let [cred {:type :oauth :access-token "old" :refresh-token "ref" :provider-id "anthropic" :expires 1000}
          response {:access_token "new_tok" :expires_in 3600}
          result (domain/oauth-update-tokens cred response)]
      (is (= "ref" (:refresh-token result))))))

;; ============================================================================
;; Provider Environment Mapping
;; ============================================================================

(deftest provider-env-key
  (testing "provider-env-key returns correct env var for known providers"
    (is (= "ANTHROPIC_API_KEY" (domain/provider-env-key "anthropic")))
    (is (= "OPENAI_API_KEY" (domain/provider-env-key "openai")))
    (is (= "GEMINI_API_KEY" (domain/provider-env-key "gemini")))
    (is (= "DEEPSEEK_API_KEY" (domain/provider-env-key "deepseek")))
    (is (= "GROQ_API_KEY" (domain/provider-env-key "groq"))))
  (testing "provider-env-key returns nil for unknown provider"
    (is (nil? (domain/provider-env-key "unknown")))))

(deftest provider-display-name
  (testing "provider-display-name returns human-readable name"
    (is (= "Anthropic" (domain/provider-display-name "anthropic")))
    (is (= "OpenAI" (domain/provider-display-name "openai")))
    (is (= "Google Gemini" (domain/provider-display-name "gemini"))))
  (testing "provider-display-name returns provider-id for unknown"
    (is (= "custom" (domain/provider-display-name "custom")))))
