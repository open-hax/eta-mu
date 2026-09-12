(ns open-hax.services.domain.local-test
  (:require [cljs.test :refer [deftest is]]
            [open-hax.services.domain.local :as domain]
            [open-hax.services.law.local :as law]))

(defn- query-error [query]
  (try
    (law/validate-query! query)
    nil
    (catch :default cause (:services/error (ex-data cause)))))

(deftest logical-children-must-be-query-maps
  (is (nil? (query-error nil)) "The optional root query remains supported")
  (doseq [query [{:$or [nil]} {:$and [nil]}
                {:$and [{:$or [{:visible true} nil]}]}]]
    (is (= :invalid-query (query-error query)) (pr-str query))
    (is (= :invalid-query
           (try (domain/documents {} :documents query) nil
                (catch :default cause (:services/error (ex-data cause)))))))
  (doseq [query [{:$or []} {:$and []} {:$or [{}]} {:$and [{:visible true}]}]]
    (is (nil? (query-error query)) (pr-str query))))

(deftest heterogeneous-range-fields-do-not-abort-or-coerce
  (let [documents {"number-low" {:id "number-low" :value 2}
                   "number-high" {:id "number-high" :value 10}
                   "string-low" {:id "string-low" :value "a"}
                   "string-high" {:id "string-high" :value "z"}
                   "boolean" {:id "boolean" :value true}
                   "null" {:id "null" :value nil}
                   "map" {:id "map" :value {:n 3}}
                   "vector" {:id "vector" :value [3]}
                   "missing" {:id "missing"}}]
    (doseq [[operator operand expected]
            [[:$gt 2 ["number-high"]] [:$gte 10 ["number-high"]]
             [:$lt 10 ["number-low"]] [:$lte 2 ["number-low"]]
             [:$gt "a" ["string-high"]] [:$gte "z" ["string-high"]]
             [:$lt "z" ["string-low"]] [:$lte "a" ["string-low"]]]]
      (is (= expected
             (mapv :id (domain/documents {:documents documents} :documents
                                        {:value {operator operand}})))
          (str operator " " operand)))))

(deftest range-comparisons-preserve-existing-comparable-values
  (doseq [[lower higher] [[false true] [:a :z] ['a 'z] [[1 2] [1 3]]
                          [#inst "2026-01-01T00:00:00.000Z"
                           #inst "2026-02-01T00:00:00.000Z"]]]
    (is (domain/matches? {:value higher} {:value {:$gt lower}}))
    (is (domain/matches? {:value higher} {:value {:$gte higher}}))
    (is (domain/matches? {:value lower} {:value {:$lt higher}}))
    (is (domain/matches? {:value lower} {:value {:$lte lower}})))
  (doseq [[actual operand] [[{:n 1} {:n 2}] [[1] ["2"]]
                            [nil 1] [1 nil]]
          operator [:$gt :$gte :$lt :$lte]]
    (is (not (domain/matches? {:value actual} {:value {operator operand}}))
        (pr-str [actual operator operand]))))
