(ns axxium.infra.identity-credentials-test
  (:require [axxium.domain.identity :as domain]
            [axxium.extern.identity-host :as host]
            [axxium.extern.identity-http :as http]
            [axxium.infra.identity :as identity]
            [axxium.api :as api]
            [axxium.infra.identity-store :as store]
            [cljs.test :refer [deftest is]]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(defn- body [response] (js->clj (.json response) :keywordize-keys true))

(deftest ^:async credential-http-revocation-is-fresh-origin-checked-and-durable
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-revoke-"))
        options {:provider :edn :directory directory :public-base-url "http://localhost"}
        service (identity/open! options)
        app (http/create-app)
        signup {:username "credential-owner" :email "owner@example.test" :password "correct horse battery staple"}]
    (try
      (await (api/register-routes app service))
      (let [created (await (identity/signup! service signup))
            token (:token created)
            browser (host/random-token)
            challenge (identity/challenge! service browser :oauth/github
                                           {:link-principal-id (get-in created [:principal :principal/id])
                                            :link-session-hash (host/sha256 token)})
            ;; Trusted issuer fixture exercises local binding semantics, not a live OAuth login.
            linked (identity/accept-external! service browser challenge :oauth/github
                                              {:issuer "https://github.com" :subject "credential-owner"})
            headers (fn [token origin] #js {"cookie" (str "axxium_session=" token) "origin" origin})
            inventory (body (await (.inject app #js {:url "/api/auth/credentials" :headers (headers token "http://localhost")})))
            external (first (filter #(= "github" (:method %)) (:credentials inventory)))
            password (first (filter #(= "password" (:method %)) (:credentials inventory)))
            revoke (fn [token origin id] (.inject app #js {:method "POST" :url "/api/auth/credentials/revoke"
                                                           :headers (headers token origin) :payload #js {:credentialId id}}))]
        (is (= 2 (count (:credentials inventory))))
        (is (= "last-login-method" (:blockedReason password))
            "An unconfigured OAuth provider cannot replace the remaining password")
        (let [refused (await (revoke token "http://localhost" (:id password)))]
          (is (= 409 (.-statusCode refused)))
          (is (= "last-login-method" (:code (body refused))))
          (is (identity/resolve-principal service token) "Refused removal preserves the current session"))
        (is (false? (:reauthenticationRequired inventory)))
        (is (= 403 (.-statusCode (await (revoke token "https://foreign.example" (:id external))))))
        (store/transact! (:store service)
                         (fn [state] {:operation :legacy-session-fixture
                                      :changes [(domain/put :sessions (host/sha256 token)
                                                            (dissoc (get-in state [:sessions (host/sha256 token)]) :issued-at))]}))
        (let [refused (await (revoke token "http://localhost" (:id external)))]
          (is (= 401 (.-statusCode refused)))
          (is (= "reauthentication-required" (:code (body refused)))))
        (let [fresh (await (identity/login! service {:identifier (:username signup) :password (:password signup)}))
              response (await (revoke (:token fresh) "http://localhost" (:id external)))
              reopened (identity/open! options)]
          (is (= 200 (.-statusCode response)))
          (is (= {:ok true :reauthenticate true} (body response)))
          (is (some? (aget (.-headers response) "set-cookie")))
          (doseq [old-token [token (:token linked) (:token fresh)]]
            (is (nil? (identity/resolve-principal reopened old-token))))
          (is (empty? (:identities (store/state (:store reopened)))))
          (is (= :credential-revoked (get-in (last (:canonical/events (store/history (:store reopened)))) [:event/data :operation])))
          (let [recovery (await (identity/login! reopened {:identifier (:email signup) :password (:password signup)}))
                password-id (str "credential:password:" (get-in recovery [:principal :principal/id]))
                refused (await (revoke (:token recovery) "http://localhost" password-id))]
            (is (= (:principal created) (:principal recovery)))
            (is (= 409 (.-statusCode refused)))
            (is (= "last-login-method" (:code (body refused)))))))
      (finally (await (http/close! app)) (fs/rmSync directory #js {:recursive true :force true})))))
