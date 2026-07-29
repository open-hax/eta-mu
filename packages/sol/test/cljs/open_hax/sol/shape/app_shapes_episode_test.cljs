(ns open-hax.sol.shape.app-shapes-episode-test
  (:require [cljs.test :refer [deftest is testing]]
            [open-hax.sol.shape.app-shapes :as shapes]))

(deftest normalize-chat-body-preserves-contract-revision-test
  (doseq [[label agent-spec]
          [["camelCase" {:contractId "agent/research"
                         :contractRevision "git:abc123"}]
           ["snake_case" {:contract_id "agent/research"
                          :contract_revision "git:def456"}]
           ["kebab-case" {:contract-id "agent/research"
                          :contract-revision "git:789abc"}]]]
    (testing label
      (let [result (shapes/normalize-chat-body
                    {:message "hello"
                     :agentSpec agent-spec})]
        (is (= "agent/research"
               (get-in result [:agent-spec :contract-id])))
        (is (= (or (:contractRevision agent-spec)
                   (:contract_revision agent-spec)
                   (:contract-revision agent-spec))
               (get-in result [:agent-spec :contract-revision])))))))
