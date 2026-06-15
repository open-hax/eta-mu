(ns katamorph.policy.gate-test
  (:require [cljs.test :refer [deftest testing is]]
            [katamorph.policy.gate :as gate]))

(deftest policy-matches?-by-tool-name
  (let [policy {:policy/match {:tool/name "exec"}}
        call   {:tool/name "exec" :tool/params {}}]
    (is (true? (gate/policy-matches? policy call))))
  (let [policy {:policy/match {:tool/name "exec"}}
        call   {:tool/name "read"}]
    (is (false? (gate/policy-matches? policy call)))))

(deftest policy-matches?-by-tool-params
  (let [policy {:policy/match {:tool/params {:cmd "rm -rf"}}}
        call   {:tool/name "exec" :tool/params {:cmd "rm -rf" :timeout 10}}]
    (is (true? (gate/policy-matches? policy call))))
  (let [policy {:policy/match {:tool/params {:cmd "rm -rf"}}}
        call   {:tool/name "exec" :tool/params {:cmd "ls"}}]
    (is (false? (gate/policy-matches? policy call)))))

(deftest policy-matches?-with-predicate
  (let [policy {:policy/match {:tool/params {:cmd (fn [v] (re-find #"rm" v))}}}
        call   {:tool/params {:cmd "rm -rf /"}}]
    (is (true? (gate/policy-matches? policy call)))))

(deftest policy-matches?-empty-match
  (let [policy {:policy/match {}}
        call   {:tool/name "anything"}]
    (is (true? (gate/policy-matches? policy call)))))

(deftest strongest-action-single
  (is (= :block (gate/strongest-action [:block])))
  (is (= :warn (gate/strongest-action [:warn])))
  (is (= :note (gate/strongest-action [:note])))
  (is (= :allow (gate/strongest-action [:allow]))))

(deftest strongest-action-multiple
  (is (= :block (gate/strongest-action [:allow :warn :block])))
  (is (= :warn (gate/strongest-action [:note :warn :allow])))
  (is (= :allow (gate/strongest-action [:allow])))
  (is (= :block (gate/strongest-action [:block :block :block]))))

(deftest evaluate-gates-no-gates
  (let [result (gate/evaluate-gates [] {:tool/name "x"})]
    (is (= :allow (:action result)))
    (is (nil? (:reason result)))
    (is (empty? (:matches result)))))

(deftest evaluate-gates-no-match
  (let [gates [{:policy/match {:tool/name "blocked"} :policy/action :block}]
        result (gate/evaluate-gates gates {:tool/name "allowed"})]
    (is (= :allow (:action result)))))

(deftest evaluate-gates-single-match
  (let [gates [{:policy/match {:tool/name "exec"} :policy/action :block :policy/reason "no exec"}]
        result (gate/evaluate-gates gates {:tool/name "exec"})]
    (is (= :block (:action result)))
    (is (= "no exec" (:reason result)))))

(deftest evaluate-gates-strongest-wins
  (let [gates [{:policy/match {:tool/name "x"} :policy/action :note}
               {:policy/match {:tool/name "x"} :policy/action :block}
               {:policy/match {:tool/name "x"} :policy/action :warn}]
        result (gate/evaluate-gates gates {:tool/name "x"})]
    (is (= :block (:action result)))))

(deftest evaluate-gates-ttl-expired
  (let [gates [{:policy/match {:tool/name "x"} :policy/action :block :policy/ttl-ms 1000}]
        result (gate/evaluate-gates gates {:tool/name "x"} 2000 500)]
    (is (= :allow (:action result)))))

(deftest evaluate-gates-ttl-active
  (let [gates [{:policy/match {:tool/name "x"} :policy/action :block :policy/ttl-ms 5000}]
        result (gate/evaluate-gates gates {:tool/name "x"} 3000 1000)]
    (is (= :block (:action result)))))

(deftest evaluate-gates-multiple-matches
  (let [gates [{:policy/match {:tool/name "x"} :policy/action :warn :policy/reason "careful"}
               {:policy/match {:tool/name "x"} :policy/action :note}]
        result (gate/evaluate-gates gates {:tool/name "x"})]
    (is (= 2 (count (:matches result))))
    (is (= :warn (:action result)))))
