(ns axxium.infra.identity-oauth-admission-test
  "One-time provider exchanges survive a real competing filesystem admission lock."
  (:require [axxium.extern.identity-host :as host]
            [axxium.extern.identity-http :as http]
            [axxium.extern.oauth :as oauth]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-oauth :as flow]
            [cljs.test :refer [deftest is]]
            ["fs-ext-extra-prebuilt" :as fs-ext]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(defn- hold-admission! [directory]
  (let [fd (fs/openSync (str directory "/identity-operation.lock") "r+")]
    (fs-ext/flockSync fd "exnb")
    (js/setTimeout #(fs/closeSync fd) 250)))

(defn- ^:async result! [service provider browser state client]
  (try (await (flow/finish! service provider browser {:state state :code "one-use"} client))
       (catch :default cause {:error (ex-data cause)})))

(deftest ^:async local-issuer-code-is-exchanged-once-while-edn-admission-waits
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-oauth-admit-"))
        issuer (http/create-app)
        exchanges (atom 0)]
    (try
      (.addContentTypeParser issuer "application/x-www-form-urlencoded" #js {:parseAs "string"}
                             (fn [_ body done] (done nil body)))
      (.post issuer "/token" (fn [_ reply]
                               (swap! exchanges inc)
                               (hold-admission! directory)
                               (.send reply #js {:access_token "issuer-token"})))
      (.get issuer "/user" (fn [_ reply] (.send reply #js {:id 42 :login "remote"})))
      (.get issuer "/emails" (fn [_ reply] (.send reply #js [])))
      (let [origin (await (http/listen! issuer "127.0.0.1" 0))
            service (identity/open! {:provider :edn :directory directory :public-base-url "http://localhost"
                                      :providers {:github {:client-id "fixture" :client-secret "fixture"
                                                           :token-url (str origin "/token") :user-url (str origin "/user")
                                                           :emails-url (str origin "/emails")}}})
            browser (host/random-token)
            authorization (js/URL. (flow/begin! service :github browser nil {} nil))
            state (.get (.-searchParams authorization) "state")
            result (await (result! service :github browser state nil))]
        (is (:ok result) (pr-str result))
        (is (= 1 @exchanges) "Local admission must not exchange the consumed provider code again")
        (when (:ok result)
          (is (= (:principal result) (identity/resolve-principal service (:token result))))
          (is (= :invalid-challenge (get-in (await (result! service :github browser state nil)) [:error :code])))
          (is (= 1 @exchanges) "Challenge replay must not repeat the provider exchange")))
      (finally (await (http/close! issuer)) (fs/rmSync directory #js {:recursive true :force true})))))

(deftest ^:async atproto-callback-result-is-retained-across-the-same-real-lock
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-atproto-admit-"))
        callbacks (atom 0)]
    (try
      (let [service (identity/open! {:provider :edn :directory directory :public-base-url "http://localhost"})
            browser (host/random-token)
            state (identity/challenge! service browser :oauth/atproto {})]
        (with-redefs [oauth/atproto-app-state! (fn ^:async app-state [_ query] (:state query))
                      oauth/atproto-callback! (fn ^:async callback [_ query]
                                              (swap! callbacks inc)
                                              (hold-admission! directory)
                                              {:state (:state query)
                                               :identity {:issuer "https://bsky.social" :subject "did:plc:fixture"}})]
          (let [result (await (result! service :atproto browser state :reference-client))]
            (is (:ok result) (pr-str result))
            (is (= 1 @callbacks))
            (when (:ok result)
              (is (= (:principal result) (identity/resolve-principal service (:token result))))))))
      (finally (fs/rmSync directory #js {:recursive true :force true})))))

(deftest ^:async expired-browser-challenge-bounds-local-admission-waiting
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-oauth-expiry-"))
        clock (atom (host/now))
        callbacks (atom 0)]
    (try
      (let [service (identity/open! {:provider :edn :directory directory :public-base-url "http://localhost"})
            browser (host/random-token)
            state (identity/challenge! service browser :oauth/atproto {})]
        (with-redefs [host/now (fn [] @clock)
                      oauth/atproto-app-state! (fn ^:async app-state [_ query] (:state query))
                      host/delay! (fn ^:async advance-clock [_] (swap! clock + (* 10 60 1000)))
                      oauth/atproto-callback! (fn ^:async callback [_ query]
                                                (swap! callbacks inc)
                                                (hold-admission! directory)
                                                {:state (:state query)
                                                 :identity {:issuer "https://bsky.social" :subject "did:plc:expires"}})]
          (let [result (await (result! service :atproto browser state :reference-client))]
            (is (= :invalid-challenge (get-in result [:error :code])))
            (is (= 1 @callbacks))
            (is (not (:ok result))))))
      (finally (fs/rmSync directory #js {:recursive true :force true})))))
