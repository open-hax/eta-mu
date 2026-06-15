(ns open-hax.sol.shape.parse-test
  (:require [cljs.test :refer [deftest testing is]]
            [open-hax.sol.shape.parse :as parse]))

(deftest parse-positive-int-from-string
  (testing "parses valid integer strings"
    (is (= 42 (parse/parse-positive-int "42")))
    (is (= 1 (parse/parse-positive-int "1")))
    (is (= 100 (parse/parse-positive-int "100"))))
  (testing "rejects zero"
    (is (nil? (parse/parse-positive-int "0"))))
  (testing "rejects negative"
    (is (nil? (parse/parse-positive-int "-5"))))
  (testing "rejects float strings"
    (is (nil? (parse/parse-positive-int "3.14"))))
  (testing "rejects non-numeric strings"
    (is (nil? (parse/parse-positive-int "abc"))))
  (testing "rejects empty string"
    (is (nil? (parse/parse-positive-int ""))))
  (testing "rejects nil"
    (is (nil? (parse/parse-positive-int nil)))))

(deftest parse-positive-int-from-number
  (testing "passes through positive numbers"
    (is (= 7 (parse/parse-positive-int 7)))
    (is (= 1.0 (parse/parse-positive-int 1.0))))
  (testing "rejects zero"
    (is (nil? (parse/parse-positive-int 0))))
  (testing "rejects negative"
    (is (nil? (parse/parse-positive-int -3))))
  (testing "rejects NaN"
    (is (nil? (parse/parse-positive-int js/NaN)))))

(deftest truthy-param?-booleans
  (is (true? (parse/truthy-param? true)))
  (is (false? (parse/truthy-param? false))))

(deftest truthy-param?-numbers
  (is (true? (parse/truthy-param? 1)))
  (is (true? (parse/truthy-param? 42)))
  (is (false? (parse/truthy-param? 0)))
  (is (false? (parse/truthy-param? -1))))

(deftest truthy-param?-strings
  (is (true? (parse/truthy-param? "1")))
  (is (true? (parse/truthy-param? "true")))
  (is (true? (parse/truthy-param? "TRUE")))
  (is (true? (parse/truthy-param? "yes")))
  (is (true? (parse/truthy-param? "on")))
  (is (true? (parse/truthy-param? "force")))
  (is (false? (parse/truthy-param? "0")))
  (is (false? (parse/truthy-param? "false")))
  (is (false? (parse/truthy-param? "no")))
  (is (false? (parse/truthy-param? "anything-else"))))

(deftest truthy-param?-edge-cases
  (is (false? (parse/truthy-param? nil)))
  (is (false? (parse/truthy-param? "")))
  (is (false? (parse/truthy-param? {}))))
