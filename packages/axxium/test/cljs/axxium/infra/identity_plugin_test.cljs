(ns axxium.infra.identity-plugin-test
  (:require [axxium.extern.identity-http :as http]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-ceremonies :as ceremonies]
            [axxium.infra.identity-store :as store]
            [axxium.api :as api]
            [axxium.infra.identity-plugin :as descriptions]
            [cljs.reader :as edn]
            [cljs.test :refer [deftest is]]
            ["@fastify/cookie" :default fastify-cookie]))

(defn- body [response] (js->clj (.json response) :keywordize-keys true))
(defn- cookie [response]
  (let [header (aget (.-headers response) "set-cookie")]
    (first (.split header ";"))))

(deftest ^:async handlers-exchange-defined-response-data
  (let [service (identity/open! {:provider :memory :public-base-url "http://localhost"})
        {:keys [origin routes]} (await (descriptions/routes! service {}))
        handlers (into {} (map (fn [{:keys [method path handler]}] [[method path] handler])) routes)]
      (is (= "http://localhost" origin))
      (is (vector? routes))
      (let [config ((get handlers ["GET" "/api/auth/config"]) {})
            signup (await ((get handlers ["POST" "/api/auth/signup"])
                           {:body {:username "data-only" :email "data@example.test"
                                   :password "correct horse battery staple"}
                            :client-key "test-client"}))
            logout ((get handlers ["POST" "/api/auth/logout"])
                    {:token (:session-token signup)})]
        (is (= #{:body} (set (keys config))))
        (is (= #{:body :session-token} (set (keys signup))))
        (is (not (contains? (:body signup) :token)))
        (is (= {:body {:ok true} :clear-session? true} logout))
        (doseq [response [config signup logout]]
          (is (= response (edn/read-string (pr-str response)))
              "No native Fastify app or reply is needed to construct or execute a handler")))))

(deftest ^:async renewed-ceremonies-refresh-the-existing-browser-cookie
  (let [service (identity/open! {:provider :memory :public-base-url "http://localhost"
                                :providers {:github {:client-id "test-client" :client-secret "test-secret"}}})
        app (http/create-app)
        browser "abcdefghijklmnopqrstuvwxyz-0123456789-browser"]
    (try
      (await (api/register-routes app service))
      (doseq [[method url payload] [["GET" "/api/auth/providers/github/login" nil]
                                    ["POST" "/api/auth/pgp/challenge" #js {:purpose "login"}]
                                    ["POST" "/api/auth/passkey/authentication-options" #js {}]]]
        (let [response (await (.inject app #js {:method method :url url :payload payload
                                               :headers #js {"cookie" (str "axxium_browser=" browser)}}))
              header (aget (.-headers response) "set-cookie")]
          (is (#{200 302} (.-statusCode response)))
          (is (string? header))
          (is (.includes (or header "") (str "axxium_browser=" browser)))
          (is (.includes (or header "") "Max-Age=600"))
          (is (.includes (or header "") "HttpOnly"))))
      (finally (await (http/close! app))))))

(deftest ^:async password-http-admission-refuses-before-derivation
  (let [service (identity/open! {:provider :memory :public-base-url "http://localhost"})
        app (http/create-app)
        releases (atom [])
        blocked (fn [] (js/Promise. (fn [resolve] (swap! releases conj resolve))))
        first-work (ceremonies/password-work! (:store service) "one" blocked)
        second-work (ceremonies/password-work! (:store service) "two" blocked)]
    (try
      (await (api/register-routes app service))
      (doseq [url ["/api/auth/signup" "/api/auth/local/login"]]
        (let [response (await (.inject app #js {:method "POST" :url url
                                               :headers #js {"x-forwarded-for" "new-client"
                                                             "cookie" "axxium_browser=rotated-browser"}
                                               :payload #js {:username "bounded" :identifier "bounded"
                                                             :email "bounded@example.test"
                                                             :password "correct horse battery staple"}}))]
          (is (= 429 (.-statusCode response)))
          (is (= "ceremony-rate-limit" (:code (body response))))))
      (is (empty? (:principals (store/state (:store service)))))
      (finally
        (doseq [release @releases] (release nil))
        (await first-work)
        (await second-work)
        (await (http/close! app))))))

(deftest ^:async password-client-window-ignores-forged-forwarding-and-browser-rotation
  (let [service (identity/open! {:provider :memory :public-base-url "http://localhost"})
        app (http/create-app)]
    (try
      (await (api/register-routes app service))
      (dotimes [attempt 8]
        (let [response (await (.inject app #js {:method "POST" :url "/api/auth/local/login"
                                               :headers #js {"x-forwarded-for" (str "client-" attempt)
                                                             "cookie" (str "axxium_browser=browser-" attempt)}
                                               :payload #js {:identifier "absent" :password "wrong-password"}}))]
          (is (= 401 (.-statusCode response)))))
      (let [response (await (.inject app #js {:method "POST" :url "/api/auth/signup"
                                             :headers #js {"x-forwarded-for" "fresh-client"
                                                           "cookie" "axxium_browser=fresh-browser"}
                                             :payload #js {:username "window-bound" :email "window@example.test"
                                                           :password "correct horse battery staple"}}))]
        (is (= 429 (.-statusCode response)))
        (is (empty? (:principals (store/state (:store service)))))
        (is (= 8 (count (ceremonies/entries (:store service)))))
        (is (empty? (:canonical/events (store/history (:store service))))))
      (finally (await (http/close! app))))))

(deftest ^:async real-plugin-password-and-csrf-test
  (let [service (identity/open! {:provider :memory :public-base-url "http://localhost:8787" :rp-id "localhost"})
        app (http/create-app)]
    (try
      (await (api/register-routes app service))
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
      (await (api/register-routes app service))
      (is (.hasRequestDecorator app "cookies"))
      (is (= 200 (.-statusCode (await (.inject app #js {:url "/api/auth/config"})))))
      (finally (await (http/close! app))))))

(deftest ^:async unicode-password-admission-matches-crypto-bytes
  (let [service (identity/open! {:provider :memory :public-base-url "http://localhost"})
        app (http/create-app)]
    (try
      (await (api/register-routes app service))
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
      (await (api/register-routes app service))
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
