(ns katamorph.store.memory-test
  (:require [cljs.test :refer [deftest is async]]
            [katamorph.store.protocol :as store]
            [katamorph.store.memory :as mem]))

(defn- col []
  (mem/memory-collection {:store/id :observed
                          :store/schema [:map [:message-id :string]]}))

(deftest insert-then-find
  (async done
    (let [c (col)]
      (-> (store/insert! c {:message-id "a"})
          (.then (fn [doc]
                   (is (= {:message-id "a"} doc) "insert returns the guarded doc")
                   (store/insert! c {:message-id "b"})))
          (.then (fn [_] (store/find-docs c {})))
          (.then (fn [docs]
                   (is (= 2 (count docs)) "both docs persisted in order")
                   (is (= ["a" "b"] (mapv :message-id docs)))))
          (.then done)))))

(deftest query-equality-and-limit
  (async done
    (let [c (col)]
      (-> (store/insert! c {:message-id "x"})
          (.then (fn [_] (store/insert! c {:message-id "y"})))
          (.then (fn [_] (store/find-docs c {:message-id "y"})))
          (.then (fn [docs]
                   (is (= [{:message-id "y"}] docs) "field-equality query")))
          (.then (fn [_] (store/find-docs c {:limit 1})))
          (.then (fn [docs]
                   (is (= 1 (count docs)) ":limit caps results")))
          (.then done)))))

(deftest store-instance-is-callable
  (async done
    (let [c (col)]
      (-> (store/insert! c {:message-id "z"})
          (.then (fn [_] (c {})))            ;; (store query) == find-docs
          (.then (fn [docs]
                   (is (= [{:message-id "z"}] docs) "calling the store queries it")))
          (.then done)))))

(deftest invalid-insert-rejects
  (async done
    (let [c (col)]
      (-> (store/insert! c {:message-id 42})
          (.then (fn [_] (is false "expected rejection")))
          (.catch (fn [e] (is (some? (:errors (ex-data e))) "rejects with schema errors")))
          (.then done)))))
