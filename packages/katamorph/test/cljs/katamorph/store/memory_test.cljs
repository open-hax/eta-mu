(ns katamorph.store.memory-test
  (:require [cljs.test :refer [deftest is]]
            [katamorph.store.protocol :as store]
            [katamorph.store.memory :as mem]))

(defn- col []
  (mem/memory-collection {:store/id :observed
                          :store/schema [:map [:message-id :string]]}))

(deftest ^:async insert-then-find
  (let [c (col)]
    (is (= {:message-id "a"} (await (store/insert! c {:message-id "a"})))
        "insert returns the guarded doc")
    (await (store/insert! c {:message-id "b"}))
    (let [docs (await (store/find-docs c {}))]
      (is (= 2 (count docs)) "both docs persisted in order")
      (is (= ["a" "b"] (mapv :message-id docs))))))

(deftest ^:async query-equality-and-limit
  (let [c (col)]
    (await (store/insert! c {:message-id "x"}))
    (await (store/insert! c {:message-id "y"}))
    (is (= [{:message-id "y"}] (await (store/find-docs c {:message-id "y"})))
        "field-equality query")
    (is (= 1 (count (await (store/find-docs c {:limit 1}))))
        ":limit caps results")))

(deftest ^:async store-instance-is-callable
  (let [c (col)]
    (await (store/insert! c {:message-id "z"}))
    (is (= [{:message-id "z"}] (await (c {})))
        "calling the store queries it")))

(deftest ^:async invalid-insert-rejects
  (let [c (col)]
    (try
      (await (store/insert! c {:message-id 42}))
      (is false "expected rejection")
      (catch :default e
        (is (some? (:errors (ex-data e))) "rejects with schema errors")))))
