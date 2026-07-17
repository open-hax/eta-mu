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
