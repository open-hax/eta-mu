(ns clio.domain.schema-test
  (:require [clio.domain.schema :as schema]
            [clio.law.schema :as schema-law]
            #?(:clj [clojure.test :refer [deftest is testing]]
               :cljs [cljs.test :refer [deftest is testing]])))

(defn fake-hash
  [text]
  (let [token (str (hash text) ":")]
    (apply str (take 64 (cycle token)))))

(def catalog-v1
  {:counter/amount
   :int

   :counter/added
   (schema-law/event-schema
    :counter/added
    [:map {:closed true}
     [:amount :counter/amount]])

   :counter/subtracted
   (schema-law/event-schema
    :counter/subtracted
    [:map {:closed true}
     [:amount :counter/amount]])})

(def catalog-v2
  {:counter/amount
   :int

   :counter/added
   (schema-law/event-schema
    :counter/added
    [:map {:closed true}
     [:amount :counter/amount]
     [:unit :keyword]])

   :counter/subtracted
   (schema-law/event-schema
    :counter/subtracted
    [:map {:closed true}
     [:amount :counter/amount]])})

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

(defn error-code
  [f]
  (try
    (f)
    nil
    (catch #?(:clj Exception :cljs :default) cause
      (:clio/error (ex-data cause)))))

(deftest schema-version-is-derived-from-structure
  (let [v1 (schema/materialize fake-hash catalog-v1)
        v2 (schema/materialize fake-hash catalog-v2)]
    (testing "a changed schema changes the whole-catalog root"
      (is (not= (:schema/root v1) (:schema/root v2))))

    (testing "an unchanged schema keeps its leaf identity across roots"
      (is (= (get-in v1 [:schema/hashes :counter/subtracted])
             (get-in v2 [:schema/hashes :counter/subtracted]))))

    (testing "historical validation resolves qualified refs from that revision"
      (is (= (event v1 :counter/added {:amount 3})
             (schema/validate-event!
              [v1 v2]
              (event v1 :counter/added {:amount 3})))))

    (testing "the changed current shape is independently enforced"
      (is (= :clio.schema/invalid-event
             (error-code
              #(schema/validate-event!
                [v1 v2]
                (event v2 :counter/added {:amount 3}))))))

    (testing "an unchanged leaf reports compatibility across multiple known roots"
      (let [old (event v1 :counter/subtracted {:amount 2})
            resolved (schema/resolve-event-schema [v2 v1] old)]
        (is (= #{(:schema/root v1) (:schema/root v2)}
               (into #{} (map :schema/root) (:compatible/revisions resolved))))))

    (testing "leaf compatibility never fabricates provenance for an unknown root"
      (let [old (event v1 :counter/subtracted {:amount 2})
            moved (assoc-in old [:event/schema :schema/root]
                            (apply str (repeat 64 "f")))]
        (is (= :clio.schema/unknown-revision
               (error-code #(schema/validate-event! [v1 v2] moved))))))

    (testing "a known root cannot lie about its schema leaf"
      (let [old (event v1 :counter/subtracted {:amount 2})
            tampered (assoc-in old [:event/schema :schema/hash]
                               (apply str (repeat 64 "e")))]
        (is (= :clio.schema/hash-mismatch
               (error-code #(schema/validate-event! [v1 v2] tampered))))))))
