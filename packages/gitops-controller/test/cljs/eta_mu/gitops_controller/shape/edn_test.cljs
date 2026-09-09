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

(deftest ambient-printer-settings-cannot-change-durable-edn-or-collapse-keys
  (let [value {:wire/index {[1 2] "first" [1 3] "second"}
               :wire/records [[1 2 3] {:wire/name "line\n\"quoted\""
                                     :wire/tags #{[:a :b] [:a :c]}}]
               :wire/symbol (with-meta 'wire/value {:ambient/metadata true})}
        expected (edn/encode value)]
    (doseq [[setting encode]
            [["length" #(binding [*print-length* 1] (edn/encode value))]
             ["level" #(binding [*print-level* 1] (edn/encode value))]
             ["namespace maps" #(binding [*print-namespace-maps* true]
                                  (edn/encode value))]
             ["readability" #(binding [*print-readably* false] (edn/encode value))]
             ["metadata" #(binding [*print-meta* true] (edn/encode value))]
             ["duplication" #(binding [*print-dup* true] (edn/encode value))]
             ["combined" #(binding [*print-length* 1
                                     *print-level* 1
                                     *print-namespace-maps* true
                                     *print-readably* false
                                     *print-meta* true
                                     *print-dup* true]
                             (edn/encode value))]]]
      (let [encoded (encode)]
        (is (= expected encoded) setting)
        (is (= value (edn/read-one encoded)) setting)))))

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
