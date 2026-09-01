(ns eta-mu.gitops-controller.extern.http-test
  (:require [cljs.test :refer [deftest is]]
            [eta-mu.gitops-controller.extern.http :as http]))

(defn- never-resolving-fetch [_url options]
  (js/Promise.
   (fn [_resolve reject]
     (.addEventListener
      (.-signal options) "abort"
      (fn []
        (let [error (js/Error. "synthetic abort")]
          (set! (.-name error) "AbortError")
          (reject error)))
      #js {:once true}))))

(deftest ^:async requests-time-out-with-bounded-safe-errors
  (let [original-fetch (.-fetch js/globalThis)]
    (set! (.-fetch js/globalThis) never-resolving-fetch)
    (try
      (try
        (await (http/request! {:url "https://github.test/secret-path"
                               :method "GET"
                               :headers {"authorization" "Bearer secret"}
                               :timeout-ms 5}))
        (is false "a stalled request must time out")
        (catch :default error
          (is (= {:error/code :http-request-timeout} (ex-data error)))
          (is (= "HTTP request timed out" (ex-message error)))))
      (finally
        (set! (.-fetch js/globalThis) original-fetch)))))
