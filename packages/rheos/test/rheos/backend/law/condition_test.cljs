(ns rheos.backend.law.condition-test
  (:require [cljs.test :refer [deftest is]]
            [rheos.backend.law.condition :as condition]))

(def context
  {:artifact {:kind :finding :status nil}
   :event {:type :artifact/changed}})

(deftest shared-condition-kernel-is-rheos-law
  (is (condition/match? context
                        {:condition/op :eq
                         :condition/path [:artifact :kind]
                         :condition/value :finding}))
  (is (condition/match? context
                        {:condition/op :exists
                         :condition/path [:artifact :status]}))
  (is (false? (condition/match? context
                                {:condition/op :exists})))
  (is (condition/match?
       context
       {:condition/op :and
        :condition/clauses
        [{:condition/op :eq
          :condition/path [:artifact :kind]
          :condition/value :finding}
         {:condition/op :not
          :condition/clause
          {:condition/op :eq
           :condition/path [:event :type]
           :condition/value :artifact/created}}]})))
