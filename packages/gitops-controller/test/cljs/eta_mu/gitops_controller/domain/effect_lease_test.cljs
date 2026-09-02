(ns eta-mu.gitops-controller.domain.effect-lease-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.gitops-controller.domain.effect-lease :as effect-lease]))

(def deployment-id "101-1")

(deftest marker-status-is-fail-closed
  (testing "missing, malformed, and unreadable markers remain provisional"
    (is (= {:state :provisional
            :effects-allowed? false
            :reason :active-marker-missing
            :deployment-id deployment-id}
           (effect-lease/status deployment-id nil)))
    (is (= :active-marker-malformed
           (:reason (effect-lease/status deployment-id "101-1"))))
    (is (= {:state :provisional
            :effects-allowed? false
            :reason :active-marker-unreadable
            :deployment-id deployment-id}
           (effect-lease/unreadable-status deployment-id)))))

(deftest marker-status-requires-the-exact-deployment
  (is (= {:state :active
          :effects-allowed? true
          :reason :deployment-active
          :deployment-id deployment-id
          :active-deployment-id deployment-id}
         (effect-lease/status deployment-id "101-1\n")))
  (is (= {:state :provisional
          :effects-allowed? false
          :reason :another-deployment-active
          :deployment-id deployment-id
          :active-deployment-id "100-1"}
         (effect-lease/status deployment-id "100-1\n"))))

(deftest authorization-allows-only-active-or-exact-canary-deliveries
  (let [active (effect-lease/status deployment-id "101-1\n")
        provisional (effect-lease/status deployment-id nil)
        canary-id "56a5d98a-87df-4d70-a40c-40a3cf109198"
        ordinary-id "808f730f-136f-457d-b629-ceccdcf7766b"]
    (is (= {:allowed? true :basis :active-deployment :lease active}
           (effect-lease/authorization active #{} ordinary-id)))
    (is (= {:allowed? false :basis :provisional-deployment
            :lease provisional}
           (effect-lease/authorization provisional #{canary-id} ordinary-id)))
    (is (= {:allowed? true :basis :deployment-canary :lease provisional}
           (effect-lease/authorization provisional #{canary-id} canary-id)))))
