(ns open-hax.contracts.policy.eval-test
  (:require [cljs.test :refer [deftest testing is]]
            [open-hax.contracts.policy.eval :as eval]))

(deftest eval-form-literals
  (testing "Literals pass through unchanged"
    (is (= "hello" (eval/eval-form "hello" {})))
    (is (= 42 (eval/eval-form 42 {})))
    (is (= :kw (eval/eval-form :kw {})))
    (is (true? (eval/eval-form true {})))
    (is (nil? (eval/eval-form nil {})))))

(deftest eval-form-symbol-resolution
  (testing "ctx resolves to full context"
    (is (= {:x 1} (eval/eval-form 'ctx {:x 1}))))
  (testing "it resolves to :it in context"
    (is (= "item" (eval/eval-form 'it {:it "item"}))))
  (testing "Unknown symbols resolve to nil"
    (is (nil? (eval/eval-form 'unknown {})))))

(deftest eval-form-equality
  (testing "Equality and inequality"
    (is (true? (eval/eval-form '(= "a" "a") {})))
    (is (false? (eval/eval-form '(= "a" "b") {})))
    (is (true? (eval/eval-form '(not= "a" "b") {})))))

(deftest eval-form-comparison
  (testing "Numeric comparisons"
    (is (true? (eval/eval-form '(< 1 2) {})))
    (is (true? (eval/eval-form '(> 2 1) {})))
    (is (true? (eval/eval-form '(<= 1 1) {})))
    (is (true? (eval/eval-form '(>= 2 1) {})))
    (is (false? (eval/eval-form '(< 2 1) {})))))

(deftest eval-form-logic
  (testing "not/and/or"
    (is (false? (eval/eval-form '(not true) {})))
    (is (true? (eval/eval-form '(not false) {})))
    (is (true? (eval/eval-form '(and true true) {})))
    (is (nil? (eval/eval-form '(and true false) {})))
    (is (true? (eval/eval-form '(or false true) {})))
    (is (nil? (eval/eval-form '(or false false) {})))))

(deftest eval-form-collection-access
  (testing "get/get-in/first/second/count"
    (is (= "val" (eval/eval-form '(get m :key) {:m {:key "val"}})))
    (is (= "deep" (eval/eval-form '(get-in m [:a :b]) {:m {:a {:b "deep"}}})))
    (is (= "a" (eval/eval-form '(first items) {:items ["a" "b"]})))
    (is (= "b" (eval/eval-form '(second items) {:items ["a" "b"]})))
    (is (= 3 (eval/eval-form '(count items) {:items [1 2 3]})))))

(deftest eval-form-type-coercion
  (testing "keyword/str/name"
    (is (= :foo (eval/eval-form '(keyword "foo") {})))
    (is (= "hello world" (eval/eval-form '(str "hello " "world") {})))
    (is (= "foo" (eval/eval-form '(name :foo) {})))))

(deftest eval-form-predicates
  (testing "some?/nil?/empty?/string?"
    (is (true? (eval/eval-form '(some? "x") {})))
    (is (true? (eval/eval-form '(nil? nil) {})))
    (is (true? (eval/eval-form '(empty? []) {})))
    (is (true? (eval/eval-form '(string? "x") {})))))

(deftest eval-form-string-ops
  (testing "clojure.string operations"
    (is (true? (eval/eval-form '(clojure.string/includes? "hello world" "world") {})))
    (is (true? (eval/eval-form '(clojure.string/starts-with? "hello" "hel") {})))
    (is (true? (eval/eval-form '(clojure.string/ends-with? "hello" "llo") {})))
    (is (= "hello" (eval/eval-form '(clojure.string/lower-case "HELLO") {})))
    (is (= "hello" (eval/eval-form '(clojure.string/trim "  hello  ") {})))))

(deftest eval-form-injected-fn
  (testing "contract/apply calls injected function"
    (let [injected {:my-fn (fn [v] (str "got:" v))}]
      (is (= "got:42"
             (eval/eval-form '(contract/apply :my-fn 42) {} {:injected injected}))))))

(deftest eval-forms-all
  (testing ":all requires all forms truthy"
    (is (true? (eval/eval-forms :all [true true true] {} {})))
    (is (nil? (eval/eval-forms :all [true false true] {} {})))))

(deftest eval-forms-some
  (testing ":some requires any truthy"
    (is (true? (eval/eval-forms :some [false true false] {} {})))
    (is (nil? (eval/eval-forms :some [false false false] {} {})))))

(deftest eval-forms-none
  (testing ":none requires all falsy"
    (is (true? (eval/eval-forms :none [false nil false] {} {})))
    (is (nil? (eval/eval-forms :none [false true false] {} {})))))

(deftest eval-forms-not
  (testing ":not requires first form falsy"
    (is (true? (eval/eval-forms :not [false] {} {})))
    (is (nil? (eval/eval-forms :not [true] {} {})))))

(deftest eval-form-map-evaluation
  (testing "Map values are evaluated, keys preserved"
    (is (= {:a 1 :b 2}
           (eval/eval-form {:a 1 :b 2} {})))))

(deftest eval-form-vector-evaluation
  (testing "Vector elements are evaluated"
    (is (= [1 2 3]
           (eval/eval-form [1 2 3] {})))))
