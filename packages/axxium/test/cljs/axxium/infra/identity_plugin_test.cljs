(ns axxium.infra.identity-plugin-test
  (:require [axxium.extern.identity-http :as http]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-plugin :as plugin]
            [cljs.test :refer [deftest is]]
            ["@fastify/cookie" :default fastify-cookie]))

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
        (is (= #{"github" "discord" "google" "atproto"}
               (set (map :id (filter :linkUrl (:methods config))))))
        (is (every? #(nil? (:loginUrl %)) (filter #(#{"pgp" "passkey"} (:id %)) (:methods config))))
        (is (= {:loginUrl "/api/auth/local/login" :loginMethod "POST"}
               (select-keys (first (filter #(= "password" (:id %)) (:methods config))) [:loginUrl :loginMethod])))
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

(deftest ^:async embedding-keeps-a-hosts-queued-cookie-plugin
  (let [service (identity/open! {:provider :memory :public-base-url "http://localhost"})
        app (http/create-app)]
    (try
      (.register app fastify-cookie)
      (is (not (.hasRequestDecorator app "cookies")) "Dependency is queued, not materialized")
      (await (plugin/register! app service {}))
      (is (.hasRequestDecorator app "cookies"))
      (is (= 200 (.-statusCode (await (.inject app #js {:url "/api/auth/config"})))))
      (finally (await (http/close! app))))))

(deftest ^:async unicode-password-admission-matches-crypto-bytes
  (let [service (identity/open! {:provider :memory :public-base-url "http://localhost"})
        app (http/create-app)]
    (try
      (await (plugin/register! app service {}))
      (let [signup (fn [password] (.inject app #js {:method "POST" :url "/api/auth/signup"
                                                   :payload #js {:username "unicode" :email "unicode@example.test" :password password}}))
            rejected (await (signup (apply str (repeat 300 "😀"))))
            accepted (await (signup (apply str (repeat 250 "😀"))))]
        (is (= 400 (.-statusCode rejected)))
        (is (= "invalid-password" (:code (body rejected))))
        (is (= 200 (.-statusCode accepted)) "Unicode within the byte budget remains valid"))
      (finally (await (http/close! app))))))

(deftest ^:async oauth-link-aliases-enforce-the-same-origin-contract
  (let [origin "http://localhost:8787"
        service (identity/open! {:provider :memory :public-base-url origin
                                 :providers {:github {:client-id "local-test-client"
                                                       :client-secret "local-test-secret"}}})
        app (http/create-app)]
    (try
      (await (plugin/register! app service {}))
      (is (= 401 (.-statusCode (await (.inject app #js {:method "POST" :url "/api/auth/providers/github/link"
                                                      :headers #js {"origin" origin} :payload #js {}})))))
      (let [{:keys [token]} (await (identity/signup! service {:username "linker" :email "linker@example.test"
                                                             :password "correct horse battery staple"}))
            session-cookie (str "axxium_session=" token)]
        (doseq [path ["/api/auth/login?link=true" "/api/auth/providers/github/login?link=true"]]
          (doseq [headers [#js {"cookie" session-cookie}
                           #js {"cookie" session-cookie "origin" "https://foreign.example"}]]
            (is (= 405 (.-statusCode (await (.inject app #js {:method "GET" :url path :headers headers})))))))
        (doseq [headers [#js {"cookie" session-cookie}
                         #js {"cookie" session-cookie "origin" "https://foreign.example"}]]
          (is (= 403 (.-statusCode (await (.inject app #js {:method "POST" :url "/api/auth/providers/github/link"
                                                          :headers headers :payload #js {}}))))))
        (let [response (await (.inject app #js {:method "POST" :url "/api/auth/providers/github/link"
                                               :headers #js {"cookie" session-cookie "origin" origin}
                                               :payload #js {:redirect "/wiki"}}))]
          (is (= 200 (.-statusCode response)))
          (is (.startsWith (:authorizationUrl (body response)) "https://github.com/login/oauth/authorize?"))))
      (finally (await (http/close! app))))))
