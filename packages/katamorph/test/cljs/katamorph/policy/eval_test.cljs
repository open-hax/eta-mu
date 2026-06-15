(ns katamorph.policy.eval-test
  (:require [cljs.test :refer [deftest testing is]]
            [katamorph.policy.eval :as policy-eval]))

(deftest eval-form-literals
  (testing "returns literal values unchanged"
    (is (= 42 (policy-eval/eval-form 42 {})))
    (is (= "hello" (policy-eval/eval-form "hello" {})))
    (is (= :kw (policy-eval/eval-form :kw {})))
    (is (true? (policy-eval/eval-form true {})))
    (is (nil? (policy-eval/eval-form nil {})))))

(deftest eval-form-symbol-resolution
  (testing "resolves ctx symbol"
    (is (= {:x 1} (policy-eval/eval-form 'ctx {:x 1}))))
  (testing "resolves it symbol from ctx"
    (is (= 42 (policy-eval/eval-form 'it {:it 42}))))
  (testing "unknown symbol returns nil"
    (is (nil? (policy-eval/eval-form 'unknown {})))))

(deftest eval-form-equality
  (is (true? (policy-eval/eval-form '(= 1 1) {})))
  (is (nil? (policy-eval/eval-form '(= 1 2) {})))
  (is (true? (policy-eval/eval-form '(not= 1 2) {})))
  (is (nil? (policy-eval/eval-form '(not= 1 1) {}))))

(deftest eval-form-comparison
  (is (true? (policy-eval/eval-form '(< 1 2) {})))
  (is (nil? (policy-eval/eval-form '(< 2 1) {})))
  (is (true? (policy-eval/eval-form '(> 2 1) {})))
  (is (true? (policy-eval/eval-form '(<= 1 1) {})))
  (is (true? (policy-eval/eval-form '(>= 2 1) {}))))

(deftest eval-form-logic
  (testing "not"
    (is (true? (policy-eval/eval-form '(not false) {})))
    (is (nil? (policy-eval/eval-form '(not true) {}))))
  (testing "and"
    (is (true? (policy-eval/eval-form '(and true true) {})))
    (is (nil? (policy-eval/eval-form '(and true false) {})))
    (is (= 3 (policy-eval/eval-form '(and 1 2 3) {}))))
  (testing "or"
    (is (= 1 (policy-eval/eval-form '(or false 1) {})))
    (is (nil? (policy-eval/eval-form '(or false false) {})))))

(deftest eval-form-collection-access
  (testing "get"
    (is (= 1 (policy-eval/eval-form '(get {:a 1} :a) {})))
    (is (= :default (policy-eval/eval-form '(get {:a 1} :b :default) {}))))
  (testing "get-in"
    (is (= 2 (policy-eval/eval-form '(get-in {:a {:b 2}} [:a :b]) {}))))
  (testing "first"
    (is (= 1 (policy-eval/eval-form '(first [1 2 3]) {}))))
  (testing "second"
    (is (= 2 (policy-eval/eval-form '(second [1 2 3]) {}))))
  (testing "count"
    (is (= 3 (policy-eval/eval-form '(count [1 2 3]) {})))))

(deftest eval-form-type-coercion
  (is (= :foo (policy-eval/eval-form '(keyword "foo") {})))
  (is (= "123" (policy-eval/eval-form '(str 1 2 3) {})))
  (is (= "foo" (policy-eval/eval-form '(name :foo) {}))))

(deftest eval-form-predicates
  (is (true? (policy-eval/eval-form '(some? 1) {})))
  (is (nil? (policy-eval/eval-form '(some? nil) {})))
  (is (true? (policy-eval/eval-form '(nil? nil) {})))
  (is (nil? (policy-eval/eval-form '(nil? 1) {})))
  (is (true? (policy-eval/eval-form '(empty? []) {})))
  (is (true? (policy-eval/eval-form '(string? "x") {}))))

(deftest eval-form-string-ops
  (is (true? (policy-eval/eval-form '(clojure.string/includes? "hello world" "world") {})))
  (is (true? (policy-eval/eval-form '(clojure.string/starts-with? "hello" "hel") {})))
  (is (true? (policy-eval/eval-form '(clojure.string/ends-with? "hello" "llo") {})))
  (is (= "hello" (policy-eval/eval-form '(clojure.string/lower-case "HELLO") {})))
  (is (= "hello" (policy-eval/eval-form '(clojure.string/trim "  hello  ") {}))))

(deftest eval-form-with-context
  (testing "ctx values accessible via get"
    (is (= "admin"
           (policy-eval/eval-form '(get ctx :role) {:role "admin"}))))
  (testing "nested ctx access"
    (is (= "alice"
           (policy-eval/eval-form '(get-in ctx [:user :name]) {:user {:name "alice"}})))))

(deftest eval-form-injected-functions
  (testing "contract/apply calls injected fn"
    (let [injected {:check/fn (fn [v] (= v "ok"))}]
      (is (true? (policy-eval/eval-form '(contract/apply [:check/fn "ok"]) {} {:injected injected})))
      (is (nil? (policy-eval/eval-form '(contract/apply [:check/fn "bad"]) {} {:injected injected}))))))

(deftest eval-forms-all
  (is (true? (policy-eval/eval-forms :all [true true] {} {})))
  (is (nil? (policy-eval/eval-forms :all [true false] {} {})))
  (is (nil? (policy-eval/eval-forms :all [] {} {}))))

(deftest eval-forms-some
  (is (= true (policy-eval/eval-forms :some [false true] {} {})))
  (is (nil? (policy-eval/eval-forms :some [false false] {} {}))))

(deftest eval-forms-none
  (is (true? (policy-eval/eval-forms :none [false false] {} {})))
  (is (nil? (policy-eval/eval-forms :none [false true] {} {}))))

(deftest eval-forms-not
  (is (true? (policy-eval/eval-forms :not [false] {} {})))
  (is (nil? (policy-eval/eval-forms :not [true] {} {}))))

(deftest eval-form-returns-nil-on-error
  (is (nil? (policy-eval/eval-form '(throw "boom") {}))))
