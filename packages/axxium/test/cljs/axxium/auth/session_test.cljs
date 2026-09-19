(ns axxium.auth.session-test
  (:require [axxium.auth.session :as session]
            [axxium.config :as config]
            [cljs.test :refer [deftest is]]
            [clojure.string :as str]
            ["@fastify/cookie" :as cookie]
            ["fastify" :as fastify]))

(deftest ^:async legacy-cookie-max-age-uses-http-seconds
  (let [app (fastify/fastify)]
    (try
      (await (.register app cookie/default))
      (.get app "/fixture" (fn [_ reply]
                              (session/set-session-cookie reply "opaque-fixture")
                              (.send reply #js {:ok true})))
      (with-redefs [config/get-in-config (fn [key]
                                          (case key [:jwt/expiry-hours] 2 [:session/cookie-secure] false
                                                [:session/cookie-same-site] "lax" nil))]
        (let [response (await (.inject app #js {:method "GET" :url "/fixture"}))
              header (aget (.-headers response) "set-cookie")]
          (is (= 200 (.-statusCode response)))
          (is (str/includes? header "Max-Age=7200;") header)
          (is (not (str/includes? header "Max-Age=7200000;")))
          (is (str/includes? header "HttpOnly"))))
      (finally (await (.close app))))))
