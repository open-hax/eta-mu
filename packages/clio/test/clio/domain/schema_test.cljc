(ns clio.domain.schema-test
  (:require [clio.domain.schema :as schema]
            [clio.shape.schema :as shape]
            #?(:clj [clojure.test :refer [deftest is testing]]
               :cljs [cljs.test :refer [deftest is testing]])))

(defn fake-hash
  [text]
  (let [token (str (hash text) ":")]
    (apply str (take 64 (cycle token)))))

(def catalog-v1
  (shape/merge-catalogs
   shape/core-catalog
   {:counter/added
    (shape/event-schema
     :counter/added
     [:map {:closed true}
      [:amount :int]])

    :counter/subtracted
    (shape/event-schema
     :counter/subtracted
     [:map {:closed true}
      [:amount :int]])}))

(def catalog-v2
  (shape/merge-catalogs
   shape/core-catalog
   {:counter/added
    (shape/event-schema
     :counter/added
     [:map {:closed true}
      [:amount :int]
      [:unit :keyword]])

    :counter/subtracted
    (shape/event-schema
     :counter/subtracted
     [:map {:closed true}
      [:amount :int]])}))

(defn event
  [revision schema-id data]
  {:event/id "11111111-1111-4111-8111-111111111111"
   :event/schema (schema/schema-ref revision schema-id)
   :event/type schema-id
   :event/stream "counter:a"
   :event/seq 1
   :event/causes []
   :event/actor "user:alice"
   :event/subject "counter:a"
   :event/at "2026-08-09T00:00:00.000Z"
   :event/data data})

(deftest schema-version-is-derived-from-structure
  (let [v1 (schema/materialize fake-hash catalog-v1)
        v2 (schema/materialize fake-hash catalog-v2)]
    (testing "a changed schema changes the whole-catalog root"
      (is (not= (:schema/root v1) (:schema/root v2))))
    (testing "an unchanged schema keeps its leaf identity across roots"
      (is (= (get-in v1 [:schema/hashes :counter/subtracted])
             (get-in v2 [:schema/hashes :counter/subtracted]))))
    (testing "a changed event keeps validating against its exact old schema"
      (is (= (event v1 :counter/added {:amount 3})
             (schema/validate-event!
              [v1 v2]
              (event v1 :counter/added {:amount 3})))))
    (testing "an unchanged leaf is sufficient when an unrelated root is unknown"
      (let [old (event v1 :counter/subtracted {:amount 2})
            moved (assoc-in old [:event/schema :schema/root]
                            (apply str (repeat 64 "f")))]
        (is (= moved (schema/validate-event! [v2] moved)))))))
