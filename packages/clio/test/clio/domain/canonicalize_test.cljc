(ns clio.domain.canonicalize-test
  (:require [clio.domain.canonicalize :as canonicalize]
            [clio.domain.projection :as projection]
            [clio.domain.schema :as schema]
            [clio.shape.schema :as shape]
            #?(:clj [clojure.test :refer [deftest is testing]]
               :cljs [cljs.test :refer [deftest is testing]])))

(defn fake-hash
  [text]
  (let [token (str (hash text) ":")]
    (apply str (take 64 (cycle token)))))

(def catalog
  (shape/merge-catalogs
   shape/core-catalog
   {:counter/opened
    (shape/event-schema
     :counter/opened
     [:map {:closed true} [:amount :int]])
    :counter/added
    (shape/event-schema
     :counter/added
     [:map {:closed true} [:amount :int]])}))

(def revision
  (schema/materialize fake-hash catalog))

(defn event
  [id event-type stream seq causes amount]
  {:event/id id
   :event/schema (schema/schema-ref revision event-type)
   :event/type event-type
   :event/stream stream
   :event/seq seq
   :event/causes causes
   :event/actor "user:alice"
   :event/subject stream
   :event/at "2026-08-09T00:00:00.000Z"
   :event/data {:amount amount}})

(def e1
  (event "11111111-1111-4111-8111-111111111111"
         :counter/opened "counter:a" 1 [] 1))

(def e2
  (event "22222222-2222-4222-8222-222222222222"
         :counter/added "counter:a" 2 [(:event/id e1)] 2))

(def e3
  (event "33333333-3333-4333-8333-333333333333"
         :counter/opened "counter:b" 1 [(:event/id e1)] 10))

(def e4
  (event "44444444-4444-4444-8444-444444444444"
         :counter/added "counter:a" 3 [(:event/id e2) (:event/id e3)] 2))

(defn apply-counter
  [state event]
  (case (:event/type event)
    :counter/opened
    (assoc state (:event/stream event) (get-in event [:event/data :amount]))

    :counter/added
    (update state (:event/stream event) + (get-in event [:event/data :amount]))

    state))

(defn error-code
  [f]
  (try
    (f)
    nil
    (catch #?(:clj Exception :cljs :default) cause
      (:clio/error (ex-data cause)))))

(deftest projection-is-invariant-under-physical-partitioning
  (let [layouts
        [[[e1 e2 e3 e4]]
         [[e3 e1] [e4 e2]]
         [[e4 e2 e2] [e3] [e1 e3]]]
        canonical (mapv #(canonicalize/canonicalize [revision] %) layouts)
        ids (mapv :canonical/event-ids canonical)
        states (mapv #(projection/state % {} apply-counter) canonical)]
    (testing "all physical layouts yield one logical replay order"
      (is (apply = ids)))
    (testing "all physical layouts yield one projection"
      (is (apply = states))
      (is (= {"counter:a" 5 "counter:b" 10}
             (first states))))))

(deftest missing-causal-parent-is-refused
  (let [orphan
        (assoc e3 :event/causes
               ["aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"])]
    (is (= :clio.canonicalize/missing-parent
           (error-code #(canonicalize/canonicalize [revision] [[e1 orphan]]))))))

(deftest competing-stream-revision-is-refused
  (let [competitor
        (event "55555555-5555-4555-8555-555555555555"
               :counter/added "counter:a" 2 [(:event/id e1)] 99)]
    (is (= :clio.canonicalize/concurrent-stream-write
           (error-code
            #(canonicalize/canonicalize [revision] [[e1 e2 competitor]]))))))

(deftest uuid-collision-is-refused
  (let [impostor (assoc-in e2 [:event/data :amount] 99)]
    (is (= :clio.canonicalize/id-collision
           (error-code #(canonicalize/canonicalize [revision] [[e1 e2 impostor]]))))))

(deftest causal-cycle-is-refused
  (let [a (event "66666666-6666-4666-8666-666666666666"
                 :counter/opened "counter:x" 1
                 ["77777777-7777-4777-8777-777777777777"] 1)
        b (event "77777777-7777-4777-8777-777777777777"
                 :counter/opened "counter:y" 1
                 ["66666666-6666-4666-8666-666666666666"] 1)]
    (is (= :clio.canonicalize/causal-cycle
           (error-code #(canonicalize/canonicalize [revision] [[a b]]))))))
