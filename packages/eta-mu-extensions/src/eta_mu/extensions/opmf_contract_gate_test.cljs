(ns eta-mu.extensions.opmf-contract-gate-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.extensions.opmf-contract-gate :as gate]))

(deftest parse-repair-attempt-test
  (testing "parses the current eta-mu repair sentinel"
    (is (= {:attempt 2 :max 3}
           (gate/parse-repair-attempt
            "[[eta-mu-opmf-contract-gate repair 2/3]]\nrepair prompt"))))
  (testing "parses the legacy short repair sentinel"
    (is (= {:attempt 1 :max 4}
           (gate/parse-repair-attempt
            "[[output-contract-gate repair 1/4]]\nrepair prompt"))))
  (testing "parses the accidental historical eta-mu output-contract sentinel"
    (is (= {:attempt 3 :max 5}
           (gate/parse-repair-attempt
            "[[eta-mu-opmf-output-contract-gate repair 3/5]]\nrepair prompt"))))
  (testing "rejects non-repair user content"
    (is (nil? (gate/parse-repair-attempt "normal prompt")))))
