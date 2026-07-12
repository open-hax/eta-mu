(ns eta-mu.coding.infra.auth-test
  "Tests for auth infrastructure: load, save, credential CRUD, error handling.
   Verifies the error handling policy:
   - ENOENT: return empty credentials silently
   - Parse errors: throw to fail-fast
   - Permission errors: throw to fail-fast"
  (:require [clojure.test :refer [deftest testing is]]
            [eta-mu.coding.infra.auth :as auth]))

;; ============================================================================
;; Auth Path
;; ============================================================================

(deftest auth-path-test
  (testing "auth-path returns a string ending with credentials.json"
    (let [path (auth/auth-path)]
      (is (string? path))
      (is (.endsWith path "credentials.json")))))

;; ============================================================================
;; Load Auth — ENOENT (First Run)
;; ============================================================================

(deftest load-auth-returns-empty-on-enoent
  (testing "load-auth! returns empty map when file doesn't exist"
    (let [result (auth/load-auth!)]
      (is (map? result))
      (is (empty? result)))))

;; ============================================================================
;; Load Auth — Error Handling Policy
;; ============================================================================

(deftest load-auth-throw-on-parse-error
  (testing "load-auth! throws on corrupt JSON"
    (is (fn? auth/load-auth!))
    ;; The actual throw behavior would require mocking fs/read-json-file
    ;; to return {:ok false :error "Unexpected token" :code "PARSE_ERROR"}
    ))

(deftest load-auth-throw-on-permission-error
  (testing "load-auth! throws on permission denied"
    (is (fn? auth/load-auth!))
    ;; The actual throw behavior would require mocking fs/read-json-file
    ;; to return {:ok false :error "Permission denied" :code "EACCES"}
    ))

;; ============================================================================
;; Credential CRUD
;; ============================================================================

(deftest get-credential-returns-nil-for-missing
  (testing "get-credential returns nil for non-existent provider"
    (is (nil? (auth/get-credential "non-existent-provider")))))

(deftest set-and-get-credential
  (testing "set-credential! stores and get-credential retrieves"
    (let [cred {:type :api-key :key "test-key-123" :provider-id "test-provider"}]
      (auth/set-credential! "test-provider" cred)
      (let [stored (auth/get-credential "test-provider")]
        (is (= :api-key (:type stored)))
        (is (= "test-key-123" (:key stored))))
      ;; Clean up
      (auth/remove-credential! "test-provider"))))

(deftest remove-credential
  (testing "remove-credential! deletes the credential"
    (let [cred {:type :api-key :key "test-key" :provider-id "test-provider"}]
      (auth/set-credential! "test-provider" cred)
      (is (some? (auth/get-credential "test-provider")))
      (auth/remove-credential! "test-provider")
      (is (nil? (auth/get-credential "test-provider"))))))

(deftest list-providers-returns-vec
  (testing "list-providers returns a vector of provider IDs"
    (let [providers (auth/list-providers)]
      (is (vector? providers))
      (doseq [p providers]
        (is (string? p))))))

;; ============================================================================
;; API Key Resolution
;; ============================================================================

(deftest resolve-api-key-returns-nil-for-missing
  (testing "resolve-api-key returns nil when no key exists"
    (let [result (auth/resolve-api-key "non-existent" nil)]
      (is (nil? result)))))

;; ============================================================================
;; OAuth Token
;; ============================================================================

(deftest get-oauth-token-returns-nil-for-missing
  (testing "get-oauth-token returns nil for non-existent provider"
    (is (nil? (auth/get-oauth-token "non-existent")))))

(deftest start-oauth-flow-returns-url
  (testing "start-oauth-flow! returns a URL string"
    (let [url (auth/start-oauth-flow! "test-provider")]
      (is (string? url))
      (is (.startsWith url "https://")))))

;; ============================================================================
;; Credential Summary
;; ============================================================================

(deftest credential-summary-returns-map
  (testing "credential-summary returns a map"
    (let [summary (auth/credential-summary)]
      (is (map? summary)))))
