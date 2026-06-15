(ns katamorph.store.law-test
  (:require [cljs.test :refer [deftest is testing]]
            [katamorph.store.law :as law]))

(deftest nil-schema-is-passthrough
  (let [guard (law/compile-schema-guard nil)]
    (is (= {:any "thing"} (guard {:any "thing"})))))

(deftest valid-doc-passes-through
  (let [guard (law/compile-schema-guard [:map [:message-id :string]])]
    (is (= {:message-id "abc"} (guard {:message-id "abc"})))))

(deftest invalid-doc-throws-with-humanized-errors
  (let [guard (law/compile-schema-guard [:map [:message-id :string]])]
    (testing "throws ex-info carrying humanized :errors and the offending :doc"
      (try
        (guard {:message-id 5})
        (is false "expected the guard to throw")
        (catch :default e
          (is (some? (:errors (ex-data e))))
          (is (= {:message-id 5} (:doc (ex-data e)))))))))
