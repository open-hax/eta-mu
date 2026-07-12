(ns eta-mu.platform.boundary-js-test
  "Round-trip tests for the primitive JS / ημ boundary."
  (:require
   [cljs.test :refer [deftest is]]
   [eta-mu.platform.boundary.js :as jsb]))

(deftest keyword-round-trip
  (is (= :research/search (jsb/decode-keyword "research/search")))
  (is (= "research/search" (jsb/encode-keyword :research/search)))
  (is (nil? (jsb/decode-keyword nil)))
  (is (nil? (jsb/encode-keyword nil))))

(deftest uuid-round-trip
  (let [s "a67c0fbd-4b8e-4b96-9fc5-6bb41f8dba74"
        u (jsb/decode-uuid s)]
    (is (uuid? u))
    (is (= s (jsb/encode-uuid u)))))

(deftest instant-round-trip
  (let [s "2026-07-11T12:00:00.000Z"
        d (jsb/decode-instant s)]
    (is (inst? d))
    (is (= s (jsb/encode-instant d)))))

(deftest vector-round-trip
  (let [xs [:a :b :c]
        encoded (jsb/encode-vector jsb/encode-keyword xs)
        decoded (jsb/decode-vector jsb/decode-keyword encoded)]
    (is (array? encoded))
    (is (= xs decoded))))

(deftest set-round-trip
  (let [xs #{:a :b :c}
        encoded (jsb/encode-set jsb/encode-keyword xs)
        decoded (jsb/decode-set jsb/decode-keyword encoded)]
    (is (array? encoded))
    (is (= xs decoded))))

(deftest map-round-trip
  (let [m {:query "hello" :limit 10}
        encoded (jsb/encode-map jsb/encode m)
        decoded (jsb/decode-map jsb/decode encoded)]
    (is (jsb/js-obj? encoded) :encode-map-produces-js-obj)
    (is (= m decoded))
    (is (every? keyword? (keys decoded)))))

(deftest universal-round-trip
  (let [value {:query "hello"
               :limit 10
               :tags ["research" "network"]}
        encoded (jsb/encode value)
        decoded (jsb/decode encoded)]
    (is (= value decoded))))

(deftest invalid-decode-rejects
  (is (thrown? js/Error (jsb/decode-keyword 42)))
  (is (thrown? js/Error (jsb/decode-map jsb/decode "not-an-object"))))
