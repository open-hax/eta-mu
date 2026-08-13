(ns rheos.backend.domain.compose-condition-test
  (:require [cljs.test :refer [deftest is testing]]
            [rheos.backend.domain.compose-condition :as compose-condition]))

(deftest equality-and-membership-use-shared-condition-semantics
  (testing "legacy string normalization happens before the shared strict matcher"
    (is (compose-condition/match-clause? {:status :todo}
                                         [:status := "todo"]))
    (is (compose-condition/match-clause? {:priority :P1}
                                         [:priority :in ["P0" "P1"]]))
    (is (false? (compose-condition/match-clause? {:priority :P2}
                                                 [:priority :in ["P0" "P1"]])))))

(deftest meta-prefix-is-an-adapter-concern
  (is (compose-condition/match-clause? {:domain "infra"}
                                       [(keyword "meta.domain") := "infra"])))

(deftest contains-and-regex-remain-rheos-query-conveniences
  (is (compose-condition/match-clause? {:labels [:proxy :infra]}
                                       [:labels :contains "proxy"]))
  (is (compose-condition/match-clause? {:title "infra-proxy"}
                                       [:title :regex "infra-.*"]))
  (is (false? (compose-condition/match-clause? {:title "frontend"}
                                               [:title :regex "infra-.*"]))))

(deftest status-and-label-helpers-preserve-compose-behavior
  (is (compose-condition/match-any? :todo ["ready" "todo"]))
  (is (compose-condition/contains-all? [:workflow "research"]
                                       ["workflow" "research"]))
  (is (compose-condition/match-any? nil []))
  (is (compose-condition/contains-all? nil [])))
