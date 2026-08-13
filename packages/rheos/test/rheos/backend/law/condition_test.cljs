(ns rheos.backend.law.condition-test
  (:require [cljs.test :refer [deftest is]]
            [rheos.backend.law.condition :as condition]
            [rheos.backend.law.path :as path]))

(def context
  {:artifact {:kind :finding
              :status nil
              :data {:confidence 0.84
                     :labels [:workflow :research]}}
   :event {:type :artifact/changed}})

(deftest nested-paths-preserve-presence
  (is (= {:found? true :value :finding}
         (path/value-at context [:artifact :kind])))
  (is (= {:found? true :value nil}
         (path/value-at context [:artifact :status])))
  (is (= {:found? false}
         (path/value-at context [:artifact :missing])))
  (is (= {:found? true :value :research}
         (path/value-at context [:artifact :data :labels 1]))))

(deftest leaf-matching-is-strict-and-nested
  (is (condition/match-leaf?
       context
       {:condition/op :eq
        :condition/path [:artifact :kind]
        :condition/value :finding}))
  (is (condition/match-leaf?
       context
       {:condition/op :not-eq
        :condition/path [:artifact :kind]
        :condition/value "finding"}))
  (is (condition/match-leaf?
       context
       {:condition/op :exists
        :condition/path [:artifact :status]}))
  (is (condition/match-leaf?
       context
       {:condition/op :in
        :condition/path [:event :type]
        :condition/values [:artifact/created :artifact/changed]})))

(deftest unknown-leaf-operators-fail-closed
  (is (false? (condition/match-leaf?
               context
               {:condition/op :unknown
                :condition/path [:artifact :kind]}))))
