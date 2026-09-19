(ns axxium.shape.identity-test
  (:require [axxium.shape.identity :as shape]
            [cljs.test :refer [deftest is]]))

(deftest identifier-normalization-is-portable-and-type-bounded
  (is (= "alice@example.test" (shape/normalize-identifier "  ALICE@Example.Test \n")))
  (is (= "alice_name" (shape/normalize-identifier " ALICE_NAME ")))
  (doseq [value [nil 12 :alice {} []]]
    (is (nil? (shape/normalize-identifier value)))))

(deftest redirect-normalization-preserves-only-local-absolute-paths
  (doseq [value ["/" "/wiki" "/wiki?tab=review#source"]]
    (is (= value (shape/safe-redirect value))))
  (doseq [value [nil 12 {} "" "wiki" "https://foreign.test" "//foreign.test"
                 "/\\foreign.test" "/wiki\r\nLocation: https://foreign.test"]]
    (is (= "/" (shape/safe-redirect value)))))

(deftest browser-url-normalization-cannot-turn-controls-into-an-external-host
  (let [origin "https://local.example"]
    (is (= "https://evil.example" (.-origin (js/URL. "/\t/evil.example" origin))))
    (doseq [control (concat (range 32) [127])
            :let [value (str "/" (js/String.fromCharCode control) "/evil.example")
                  redirect (shape/safe-redirect value)]]
      (is (= "/" redirect))
      (is (= origin (.-origin (js/URL. redirect origin)))))))
