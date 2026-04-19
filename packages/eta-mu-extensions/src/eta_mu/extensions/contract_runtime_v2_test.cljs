(ns eta-mu.extensions.contract-runtime-v2-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.extensions.contract-runtime-v2.core :as core]))

(deftest path-param-extraction-test
  (testing "extracts first matching path param"
    (is (= "/tmp/x"
           (core/path-param-from-tool-call {"foo" 1 "path" "/tmp/x"})))
    (is (= "/tmp/y"
           (core/path-param-from-tool-call {"dest" "/tmp/y"})))
    (is (nil? (core/path-param-from-tool-call {"name" "nope"})))))

(deftest comment-stripping-test
  (is (= "{:a 1}\n{:b 2}"
         (core/strip-comment-lines ";; hi\n{:a 1}\n;; bye\n{:b 2}"))))

(deftest normalize-contract-forms-test
  (testing "single map"
    (is (= [{:contract/kind :policy :contract/id "x"}]
           (core/normalize-contract-forms "{:contract/kind :policy :contract/id \"x\"}"))))
  (testing "vector of maps"
    (is (= [{:contract/kind :role :role/id :r1}
            {:contract/kind :capability :capability/id :c1}]
           (core/normalize-contract-forms "[{:contract/kind :role :role/id :r1} {:contract/kind :capability :capability/id :c1}]"))))
  (testing "unknown form falls through"
    (let [res (core/normalize-contract-forms "(skill-contract (name \"old\"))")]
      (is (= :unknown (:contract/kind (first res)))))))

(deftest contract-kind-test
  (is (= :actor (core/contract-kind {:actor/id :mindfuck})))
  (is (= :policy (core/contract-kind {:contract/kind :policy})))
  (is (nil? (core/contract-kind {:x 1}))))

(deftest dispatch-test
  (testing "known structured kinds dispatch to their collections"
    (let [raw "{:contract/kind :policy :contract/id \"p1\"}"
          acc (-> {:actors [] :policies [] :fulfills [] :caps {} :roles {} :prompt-blocks []}
                  (core/apply-map-dispatch {:actor/id :mindfuck :system "hello"} raw)
                  (core/apply-map-dispatch {:contract/kind :policy :contract/id "p1"} raw)
                  (core/apply-map-dispatch {:contract/kind :fulfillment :contract/id "f1"} raw)
                  (core/apply-map-dispatch {:contract/kind :capability :capability/id :cap/x} raw)
                  (core/apply-map-dispatch {:contract/kind :role :role/id :role/x} raw)
                  (core/apply-map-dispatch {:contract/kind :unknown :raw "raw-block"} raw))]
      (is (= 1 (count (:actors acc))))
      (is (= 1 (count (:policies acc))))
      (is (= 1 (count (:fulfills acc))))
      (is (= {:contract/kind :capability :capability/id :cap/x}
             (get-in acc [:caps ":cap/x"])))
      (is (= {:contract/kind :role :role/id :role/x}
             (get-in acc [:roles ":role/x"]))))))

(deftest prompt-blocks-fallthrough-test
  (testing "actor emits :system as prompt block"
    (let [acc (core/apply-map-dispatch {} {:actor/id :x :system "sys-text"} "raw")]
      (is (some #{"sys-text"} (:prompt-blocks acc)))))

  (testing "unknown block emits :raw as prompt block"
    (let [acc (core/apply-map-dispatch {} {:contract/kind :unknown :raw "raw-block"} "fallback")]
      (is (some #{"raw-block"} (:prompt-blocks acc)))))

  (testing "structured kind with no :raw falls through to raw-text arg"
    ;; policy/fulfillment/capability/role with schema issues become prompt material —
    ;; intent is preserved even when validation would fail
    (let [raw-text "{:contract/kind :policy :contract/id \"p1\"}"
          acc (core/apply-map-dispatch {} {:contract/kind :policy :contract/id "p1"} raw-text)]
      (is (some #{raw-text} (:prompt-blocks acc)))))

  (testing "structured kind with blank raw-text emits no prompt block"
    (let [acc (core/apply-map-dispatch {} {:contract/kind :policy :contract/id "p1"} "")]
      (is (empty? (:prompt-blocks acc))))))

(deftest prompt-build-test
  (let [out (core/build-prompt-append "{:mission \"x\"}" ["actor text" "unknown text"])]
    (is (string? out))
    (is (.includes out "PRINCIPLE.edn"))
    (is (.includes out "actor text"))
    (is (.includes out "unknown text"))))

(deftest cache-freshness-test
  (is (true? (core/cache-entry-fresh? 1000 {"loaded-at" 900} 200)))
  (is (false? (core/cache-entry-fresh? 1000 {"loaded-at" 500} 200)))
  (is (nil? (core/cache-entry-fresh? 1000 nil 200))))

(deftest walk-up-paths-test
  (let [existing #{"/repo/CONTRACT.edn" "/repo/a/b/CONTRACT.edn"}
        join-path (fn [a b] (str a "/" b))
        dirname (fn [p]
                  (let [idx (.lastIndexOf p "/")]
                    (if (pos? idx) (subs p 0 idx) p)))
        out (core/walk-up-paths join-path dirname "/repo/a/b" "/repo" #(contains? existing %))]
    (is (= ["/repo/CONTRACT.edn" "/repo/a/b/CONTRACT.edn"] out))))
