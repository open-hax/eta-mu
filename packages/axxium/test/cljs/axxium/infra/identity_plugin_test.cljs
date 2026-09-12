(ns axxium.infra.identity-plugin-test
  (:require [axxium.extern.identity-http :as http]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-plugin :as plugin]
            [cljs.test :refer [deftest is]]))

(defn- body [response] (js->clj (.json response) :keywordize-keys true))
(defn- cookie [response]
  (let [header (aget (.-headers response) "set-cookie")]
    (first (.split header ";"))))

(deftest ^:async real-plugin-password-and-csrf-test
  (let [service (identity/open! {:provider :memory :public-base-url "http://localhost:8787" :rp-id "localhost"})
        app (http/create-app)]
    (try
      (await (plugin/register! app service {}))
      (let [config (body (await (.inject app #js {:method "GET" :url "/api/auth/config"})))
            response (await (.inject app #js {:method "POST" :url "/api/auth/signup"
                                              :headers #js {"origin" "http://localhost:8787"}
                                              :payload #js {:username "alice" :email "alice@example.test"
                                                            :password "correct horse battery staple"}}))
            session-cookie (cookie response)]
        (is (= #{"password" "github" "discord" "google" "atproto" "pgp" "passkey"} (set (map :id (:methods config)))))
        (is (= 200 (.-statusCode response)))
        (is (= "alice" (get-in (body response) [:principal :principal/username])))
        (is (not (contains? (body response) :token)) "Cookie login never returns its private token")
        (is (= 200 (.-statusCode (await (.inject app #js {:method "GET" :url "/api/auth/me" :headers #js {"cookie" session-cookie}})))))
        (doseq [headers [#js {"cookie" session-cookie}
                         #js {"cookie" session-cookie "origin" "https://attacker.example"}]]
          (is (= 403 (.-statusCode (await (.inject app #js {:method "POST" :url "/api/auth/logout" :headers headers :payload #js {}}))))))
        (is (= 200 (.-statusCode (await (.inject app #js {:method "POST" :url "/api/auth/logout"
                                                         :headers #js {"cookie" session-cookie "origin" "http://localhost:8787"}
                                                         :payload #js {}})))))
        (is (= 401 (.-statusCode (await (.inject app #js {:method "GET" :url "/api/auth/me" :headers #js {"cookie" session-cookie}})))))
        (is (= 503 (.-statusCode (await (.inject app #js {:method "GET" :url "/api/auth/providers/github/login"})))))
        (is (= 400 (.-statusCode (await (.inject app #js {:method "GET" :url "/api/auth/providers/unknown/login"}))))))
      (finally (await (http/close! app))))))

(deftest ^:async oauth-link-aliases-enforce-the-same-origin-contract
  (let [origin "http://localhost:8787"
        service (identity/open! {:provider :memory :public-base-url origin
                                 :providers {:github {:client-id "local-test-client"
                                                       :client-secret "local-test-secret"}}})
        app (http/create-app)]
    (try
      (await (plugin/register! app service {}))
      (let [{:keys [token]} (await (identity/signup! service {:username "linker" :email "linker@example.test"
                                                             :password "correct horse battery staple"}))
            session-cookie (str "axxium_session=" token)]
        (doseq [path ["/api/auth/login?link=true" "/api/auth/providers/github/login?link=true"]]
          (doseq [headers [#js {"cookie" session-cookie}
                           #js {"cookie" session-cookie "origin" "https://foreign.example"}]]
            (is (= 403 (.-statusCode (await (.inject app #js {:method "GET" :url path :headers headers}))))))
          (is (= 302 (.-statusCode
                      (await (.inject app #js {:method "GET" :url path
                                               :headers #js {"cookie" session-cookie "origin" origin}}))))
              "same-origin explicit linking remains available without a live issuer request")))
      (finally (await (http/close! app))))))
