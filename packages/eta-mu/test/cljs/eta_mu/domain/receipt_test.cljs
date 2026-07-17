(ns eta-mu.domain.receipt-test
  (:require [cljs.test :refer [deftest is testing]]
            [clojure.edn :as edn]
            [eta-mu.domain.receipt :as receipt]))

(deftest build-record-test
  (testing "builds a receipt record with normalized kind"
    (let [record (receipt/build-record {:kind "test-run" :note "green"} "/repo" :observation)]
      (is (= :test-run (:kind record)))
      (is (= "/repo" (:repo record)))
      (is (= "green" (:note record)))
      (is (string? (:ts record))))))

(deftest build-record-default-kind-test
  (testing "falls back to the fallback kind when kind is missing"
    (let [record (receipt/build-record {} "/repo" :observation)]
      (is (= :observation (:kind record))))))

(deftest validate-line-valid-test
  (testing "validates a correct receipt line"
    (let [line (pr-str {:ts (receipt/now-iso)
                        :kind :observation
                        :repo "/repo"
                        :origin "pi"
                        :owner "receipt-river"
                        :dod "test"
                        :pi "0.1.0"
                        :host "local"
                        :manifest "none"
                        :refs "none"})
          result (receipt/validate-line line 1)]
      (is (:ok result))
      (is (= :observation (get-in result [:event :kind]))))))

(deftest validate-line-invalid-test
  (testing "rejects a missing required key"
    (let [result (receipt/validate-line (pr-str {:kind :observation}) 1)]
      (is (not (:ok result)))
      (is (seq (:errors result))))))

(deftest validate-line-bad-edn-test
  (testing "rejects malformed EDN"
    (let [result (receipt/validate-line "not edn" 1)]
      (is (not (:ok result))))))

(deftest format-line-round-trip-test
  (testing "format-line produces readable EDN"
    (let [record (receipt/build-record {:kind "decision" :note "choice"} "/repo" :observation)
          line (receipt/format-line record)]
      (is (string? line))
      (is (map? (edn/read-string line))))))
