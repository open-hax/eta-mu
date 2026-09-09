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

(deftest ^:async credential-requests-reject-insecure-urls-before-fetch
  (let [original-fetch (.-fetch js/globalThis)
        called?* (atom false)]
    (set! (.-fetch js/globalThis)
          (fn [_url _options] (reset! called?* true)))
    (try
      (doseq [url ["http://github.test/secret-path"
                   "https://user:secret@github.test/api"]]
        (let [error (try (await (http/request!
                                 {:url url :method "POST"
                                  :headers {"authorization" "Bearer secret"}}))
                         nil
                         (catch :default value value))]
          (is (= {:error/code :invalid-http-url} (ex-data error)))))
      (is (false? @called?*))
      (finally
        (set! (.-fetch js/globalThis) original-fetch)))))

(deftest ^:async credential-requests-disable-redirects-and-sanitize-failures
  (let [original-fetch (.-fetch js/globalThis)
        redirects* (atom [])]
    (set! (.-fetch js/globalThis)
          (fn [_url options]
            (swap! redirects* conj (.-redirect options))
            (js/Promise.resolve
             (js/Response. nil
                           #js {:status 307
                                :headers #js {"location"
                                              "https://foreign.test/secret"}}))))
    (try
      (let [error (try (await (http/request!
                               {:url "https://github.test/api"
                                :method "POST"
                                :headers {"authorization" "Bearer secret"}}))
                       nil
                       (catch :default value value))]
        (is (= ["error"] @redirects*))
        (is (= {:error/code :http-request-failed} (ex-data error)))
        (is (= "HTTP request failed" (ex-message error))))
      (finally
        (set! (.-fetch js/globalThis) original-fetch)))))
