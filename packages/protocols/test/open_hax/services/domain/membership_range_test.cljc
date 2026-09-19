(ns open-hax.services.domain.membership-range-test
  (:require #?(:clj [clojure.test :refer [deftest is]]
               :cljs [cljs.test :refer [deftest is]])
            [open-hax.services.domain.local :as domain]))

(deftest membership-uses-equality-for-false-and-nil
  (let [state {:documents {"false" {:id "false" :value false}
                           "true" {:id "true" :value true}
                           "null" {:id "null" :value nil}
                           "missing" {:id "missing"}
                           "zero" {:id "zero" :value 0}}}]
    (doseq [[members included excluded]
            [[[false] ["false"] ["missing" "null" "true" "zero"]]
             [[nil] ["missing" "null"] ["false" "true" "zero"]]
             [[false nil] ["false" "missing" "null"] ["true" "zero"]]
             [[true] ["true"] ["false" "missing" "null" "zero"]]
             [[] [] ["false" "missing" "null" "true" "zero"]]]
            [operator expected] [[:$in included] [:$nin excluded]]]
      (is (= expected (mapv :id (domain/documents state :documents
                                                 {:value {operator members}})))
          (pr-str [operator members])))))

(deftest nan-is-not-an-ordered-range-operand
  ;; Reusing the boxed value also catches JVM generic equality's identity path.
  (let [nan ##NaN]
    (doseq [[actual expected] [[1 nan] [nan 1] [nan nan]
                              [[1] [nan]] [[nan] [1]] [[nan] [nan]]
                              [[[1]] [[nan]]] [[[nan]] [[1]]]]
            operator [:$gt :$gte :$lt :$lte]]
      (is (not (domain/matches? {:value actual} {:value {operator expected}}))
          (pr-str [actual operator expected])))
    (doseq [[operator actual expected] [[:$gt 2 1] [:$gte 1 1]
                                        [:$lt 1 2] [:$lte 1 1]
                                        [:$lt 1 ##Inf] [:$gt 1 ##-Inf]
                                        [:$gt [2] [1]] [:$lte [[1]] [[1]]]]]
      (is (domain/matches? {:value actual} {:value {operator expected}})
          (pr-str [actual operator expected])))))
