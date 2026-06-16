(ns rheos.backend.domain.compose-test
  (:require [cljs.test :refer [deftest is]]
            [rheos.backend.domain.compose :as compose]))

(deftest parse-where-clause-eq
  (is (= ["meta.domain" := "infra"] (compose/parse-where-clause "meta.domain = infra"))))

(deftest parse-where-clause-in
  (is (= ["meta.org" :in ["open-hax" "octave-commons"]] (compose/parse-where-clause "meta.org in open-hax,octave-commons"))))

(deftest parse-where-clause-contains
  (is (= ["meta.tags" :contains "proxy"] (compose/parse-where-clause "meta.tags contains proxy"))))

(deftest parse-compose-query-basic
  (let [flags {:status "todo,in_progress" :priority "P0,P1" :projects "proxx,eta-mu"}
        query (compose/parse-compose-query flags)]
    (is (= ["todo" "in_progress"] (:status query)))
    (is (= ["proxx" "eta-mu"] (:across query)))))
