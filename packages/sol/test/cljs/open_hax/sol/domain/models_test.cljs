(ns open-hax.sol.domain.models-test
  "Coverage for the plain models.json lookup that replaces ModelRegistry.find."
  (:require [cljs.test :refer [deftest testing is]]
            [open-hax.sol.domain.models :as models]))

(def ^:private models-data
  {:providers {:proxx {:models [{:id "glm-5"} {:id "gpt-5"}]}
               :openrout.es {:models [{:id "kimi-k2"}]}}})

(deftest find-model-prefers-the-explicit-provider
  (testing "a hit under the requested provider wins and carries :provider"
    (is (= {:id "kimi-k2" :provider "openrout.es"}
           (models/find-model models-data "openrout.es" "kimi-k2" "glm-5")))))

(deftest find-model-falls-back-through-the-legacy-chain
  (testing "explicit provider miss falls back to the same id under proxx"
    (is (= {:id "glm-5" :provider "proxx"}
           (models/find-model models-data "openrout.es" "glm-5" "gpt-5"))))
  (testing "requested id missing everywhere falls back to the proxx fallback id"
    (is (= {:id "gpt-5" :provider "proxx"}
           (models/find-model models-data "openrout.es" "nope" "gpt-5")))))

(deftest find-model-returns-nil-when-nothing-matches
  (is (nil? (models/find-model models-data "openrout.es" "nope" "also-nope")))
  (is (nil? (models/find-model {} "proxx" "glm-5" "gpt-5"))))

(deftest find-model-round-trips-models-config-output
  (testing "lookup works over the exact data ensure-runtime! writes to models.json"
    (let [config {:contracts-dir "test/fixtures/empty-contracts"
                  :proxx-base-url "http://proxx:8789"}
          data (models/models-config config ["glm-5"])]
      (is (= "glm-5" (:id (models/find-model data "proxx" "glm-5" nil))))
      (is (= "proxx" (:provider (models/find-model data "proxx" "glm-5" nil))))
      (is (= "glm-5" (:id (models/find-model data "other" "nope" "glm-5")))))))

(deftest chat-completions-url-composes-full-endpoints
  (is (= "http://proxx:8789/v1/chat/completions"
         (models/chat-completions-url "http://proxx:8789/v1")))
  (is (nil? (models/chat-completions-url nil)))
  (is (nil? (models/chat-completions-url "  "))))

;; ── ProviderContract consumption (katamorph v0.2.0) ───────────────────────────

(def ^:private provider-env-vars
  ["PROXX_BASE_URL" "PROXX_AUTH_TOKEN" "PROXX_CONTRACT_TOKEN"
   "KNOXX_MODEL_PREFIX_ALLOWLIST"])

(defn- with-env
  "Run f with exactly `overrides` set among the provider env vars; restore after."
  [overrides f]
  (let [saved (into {} (map (fn [n] [n (aget js/process.env n)]) provider-env-vars))]
    (doseq [n provider-env-vars] (js-delete js/process.env n))
    (doseq [[n v] overrides] (aset js/process.env n v))
    (try
      (f)
      (finally
        (doseq [n provider-env-vars] (js-delete js/process.env n))
        (doseq [[n v] saved :when (some? v)] (aset js/process.env n v))))))

(def ^:private contract-config
  {:contracts-dir "test/fixtures/provider-contracts"
   :proxx-base-url "http://proxx:8789"})

(deftest provider-contract-drives-config-when-env-unset
  (with-env {"PROXX_CONTRACT_TOKEN" "token-from-named-env"}
    (fn []
      (let [enriched (models/enrich-config contract-config)]
        (testing "base-url comes from the :provider contract"
          (is (= "http://proxx-from-contract:8789" (:proxx-base-url enriched))))
        (testing "models endpoint comes from the contract"
          (is (= "/v1/models" (:proxx-models-endpoint enriched))))
        (testing "auth token is read from the contract-named env var"
          (is (= "token-from-named-env" (:proxx-auth-token enriched))))
        (testing "prefix allowlist comes from the contract"
          (is (= ["glm-5" "test-model"] (:model-prefix-allowlist enriched)))
          (is (models/allowlisted-model-id? enriched "test-model-x"))
          (is (not (models/allowlisted-model-id? enriched "qwen3-x"))))))))

(deftest explicitly-set-env-overrides-the-provider-contract
  (with-env {"PROXX_BASE_URL" "http://from-env:9999"
             "KNOXX_MODEL_PREFIX_ALLOWLIST" "envmodel"}
    (fn []
      (let [enriched (models/enrich-config
                      (assoc contract-config :proxx-base-url "http://from-env:9999"))]
        (is (= "http://from-env:9999" (:proxx-base-url enriched)))
        (is (= ["envmodel"] (:model-prefix-allowlist enriched)))))))

(deftest absent-provider-contract-keeps-env-only-behavior
  (with-env {}
    (fn []
      (let [enriched (models/enrich-config
                      {:contracts-dir "test/fixtures/empty-contracts"
                       :proxx-base-url "http://proxx:8789"})]
        (is (= "http://proxx:8789" (:proxx-base-url enriched)))
        (is (nil? (:proxx-models-endpoint enriched)))
        (testing "built-in default allowlist applies"
          (is (some #{"qwen3"} (:model-prefix-allowlist enriched))))))))

(deftest provider-contract-renames-models-json-api-key
  (with-env {}
    (fn []
      (let [data (models/models-config (models/enrich-config contract-config) ["glm-5"])]
        (is (= "PROXX_CONTRACT_TOKEN" (get-in data [:providers :proxx :apiKey])))))))
