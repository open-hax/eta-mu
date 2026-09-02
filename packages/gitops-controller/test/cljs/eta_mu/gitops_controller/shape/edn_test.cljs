(ns eta-mu.gitops-controller.shape.edn-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.gitops-controller.shape.edn :as edn]))

(deftest deterministic-edn-round-trip
  (let [left {:z 1 :a {:b 2 :a 1}}
        right (array-map :a (array-map :a 1 :b 2) :z 1)
        encoded (edn/encode left)]
    (is (= encoded (edn/encode right)))
    (is (= left (edn/read-one encoded)))
    (is (not (.includes encoded "\n")))))

(deftest strict-reader-requires-one-complete-form
  (testing "one form is accepted"
    (is (= {:delivery/id "one"}
           (edn/read-one "{:delivery/id \"one\"}"))))
  (doseq [invalid [""
                   "{:delivery/id \"one\"} {:delivery/id \"two\"}"
                   "] {:delivery/id \"hidden\"} ["
                   "{:delivery/id \"torn\""
                   "#=(js/process.exit 0)"]]
    (let [error (try
                  (edn/read-one invalid)
                  nil
                  (catch :default caught caught))]
      (is (= :invalid-edn-record (:error/code (ex-data error)))))))
