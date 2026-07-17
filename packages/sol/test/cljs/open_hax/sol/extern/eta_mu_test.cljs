(ns open-hax.sol.extern.eta-mu-test
  "Coverage for the plain-data ensure-runtime! that replaces the legacy SDK
   SettingsManager/AuthStorage/ModelRegistry/DefaultResourceLoader construction."
  (:require [cljs.test :refer [deftest testing is]]
            ["node:fs" :as node-fs]
            ["node:os" :as node-os]
            ["node:path" :as node-path]
            [open-hax.sol.extern.eta-mu :as eta-mu-extern]
            [open-hax.sol.extern.json :as json]))

(defn- tmp-agent-dir
  []
  (.mkdtempSync node-fs (.join node-path (.tmpdir node-os) "sol-eta-mu-test-")))

(deftest ^:async ensure-runtime!-persists-models-json-and-returns-plain-data
  (testing "models.json is written and the runtime map is data, not SDK objects"
    (let [agent-dir (tmp-agent-dir)
          model-config {:providers {:proxx {:baseUrl "http://proxx:8789/v1"
                                            :models [{:id "glm-5"}]}}}
          runtime (await (eta-mu-extern/ensure-runtime! {:agent-dir agent-dir} model-config))]
      (is (= agent-dir (:runtime-dir runtime)))
      (is (= model-config (:models runtime)))
      (is (= model-config
             (json/parse-object (.readFileSync node-fs
                                               (.join node-path agent-dir "models.json")
                                               "utf8"))))
      (is (false? (.existsSync node-fs (.join node-path agent-dir "auth.json")))
          "no auth.json — provider auth is plain config now, not AuthStorage"))))

(deftest ^:async ensure-runtime!-creates-a-missing-agent-dir
  (testing "the data dir is created recursively"
    (let [base (tmp-agent-dir)
          agent-dir (.join node-path base "nested" "agent")]
      (await (eta-mu-extern/ensure-runtime! {:agent-dir agent-dir} {:providers {}}))
      (is (true? (.existsSync node-fs (.join node-path agent-dir "models.json")))))))
