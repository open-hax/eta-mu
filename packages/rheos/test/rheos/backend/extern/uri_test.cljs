(ns rheos.backend.extern.uri-test
  (:require [cljs.test :refer [deftest is testing]]
            [rheos.backend.extern.uri :as uri]))

(deftest encodes-one-uri-path-component-through-the-host-boundary
  (testing "reserved separators cannot escape the GitHub label path segment"
    (is (= "domain%3Aold%2Fvalue"
           (uri/encode-component "domain:old/value")))
    (is (= "security%20review%2B100%25"
           (uri/encode-component "security review+100%"))))
  (testing "Unicode labels use the host's UTF-8 percent encoding"
    (is (= "%CE%B2%2F%E5%AE%89%E5%85%A8"
           (uri/encode-component "β/安全")))))
