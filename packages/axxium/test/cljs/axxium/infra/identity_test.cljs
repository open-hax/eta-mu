(ns axxium.infra.identity-test
  (:require [axxium.domain.identity :as domain]
            [axxium.extern.identity-host :as host]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-store :as store]
            [axxium.law.identity :as law]
            [axxium.shape.identity :as shape]
            [cljs.test :refer [deftest is testing]]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(defn- open-service [directory]
  (identity/open! {:provider :edn :directory directory :public-base-url "http://localhost:8787" :rp-id "localhost"}))

(defn- directory [] (fs/mkdtempSync (path/join (os/tmpdir) "axxium-identity-")))
(defn- remove! [directory] (fs/rmSync directory #js {:recursive true :force true}))
(def signup {:username "alice" :email "alice@example.test" :password "correct horse battery staple"})

(defn- failure-code [f]
  (try (f) nil (catch :default error (:code (ex-data error)))))

(deftest ^:async durable-password-session-test
  (let [directory (directory)]
    (try
      (let [service (open-service directory)
            created (await (identity/signup! service signup))
            restarted (open-service directory)
            actor (:principal created)]
        (is (string? (:principal/id actor)))
        (is (= actor (identity/resolve-principal restarted (:token created))))
        (is (= 1 (count (:canonical/events (store/history (:store service))))))
        (doseq [identifier ["alice" " ALICE@EXAMPLE.TEST "]]
          (let [login (await (identity/login! restarted {:identifier identifier :password (:password signup)}))]
            (is (= actor (:principal login)))
            (identity/logout! restarted (:token login))
            (is (nil? (identity/resolve-principal (open-service directory) (:token login))))))
        (let [blobs-before (set (array-seq (fs/readdirSync (str directory "/private"))))]
          (doseq [duplicate [(assoc signup :username "different")
                             (assoc signup :email "other@example.test") signup]]
            (try
              (await (identity/signup! restarted duplicate))
              (is false "duplicate identifiers must be rejected")
              (catch :default error (is (= :identifier-exists (:code (ex-data error)))))))
          (is (= blobs-before (set (array-seq (fs/readdirSync (str directory "/private")))))
              "Rejected duplicate signup must not allocate credential blobs"))
        (is (= 1 (count (:principals (store/state (:store restarted))))))
        (let [ledger (fs/readFileSync (str directory "/identity.edn") "utf8")]
          (is (not (.includes ledger (:password signup))))
          (is (not (.includes ledger (:token created))))
          (is (not (.includes ledger ":salt"))))
        (is (= 384 (bit-and (.-mode (fs/statSync (str directory "/private/master-key"))) 511))))
      (finally (remove! directory)))))

(deftest ^:async active-principal-and-administrator-test
  (let [directory (directory)]
    (try
      (let [service (open-service directory)
            created (await (identity/signup! service signup))
            actor-id (get-in created [:principal :principal/id])]
        (is (= :forbidden (failure-code #(identity/update-grants! service (:token created) actor-id [] ["axxium/admin"]))))
        (store/transact! (:store service)
                         (fn [state] {:operation :suspended
                                      :changes [(domain/put :principals actor-id
                                                            (assoc (get-in state [:principals actor-id]) :principal/status :suspended))]}))
        (is (nil? (identity/resolve-principal service (:token created))))
        (is (nil? (identity/resolve-active-principal service actor-id)))
        (try
          (await (identity/login! service {:identifier "alice" :password (:password signup)}))
          (is false "suspended actor cannot sign in")
          (catch :default error (is (= :invalid-credentials (:code (ex-data error)))))))
      (finally (remove! directory)))))

(deftest ^:async challenge-and-linking-test
  (let [directory (directory)]
    (try
      (let [service (open-service directory)
            local (await (identity/signup! service signup))
            browser (host/random-token)
            issue #(identity/challenge! service browser :oauth/github %)
            challenge (issue {:redirect "https://hostile.test/"})
            remote {:issuer "https://github.com" :subject "100" :email (:email signup) :display-name "External Alice"}
            result (identity/accept-external! service browser challenge :oauth/github remote)]
        (is (not= (get-in local [:principal :principal/id]) (get-in result [:principal :principal/id]))
            "Matching email never silently links an external identity")
        (is (= "/" (:redirect result)))
        (is (nil? (get-in result [:principal :principal/email])))
        (is (= :invalid-challenge (failure-code #(identity/accept-external! service browser challenge :oauth/github remote))))
        (let [id (issue {})]
          (is (= :invalid-challenge (failure-code #(identity/read-challenge service (host/random-token) id :oauth/github))))
          (is (= :invalid-challenge (failure-code #(identity/read-challenge service browser id :oauth/google)))))
        (let [id (issue {:link-principal-id (get-in local [:principal :principal/id])
                         :link-session-hash (host/sha256 (:token local))})]
          (is (= :identity-already-linked (failure-code #(identity/accept-external! service browser id :oauth/github remote)))))
        (let [id (issue {:link-principal-id (get-in local [:principal :principal/id])
                         :link-session-hash (host/sha256 (:token local))})
              linked (identity/accept-external! service browser id :oauth/github (assoc remote :subject "200"))]
          (is (= (:principal local) (:principal linked)))))
      (finally (remove! directory)))))

(deftest missing-state-and-corruption-test
  (let [directory (directory)]
    (try
      (let [service (open-service directory)
            decided? (atom false)]
        (fs/unlinkSync (str directory "/identity.edn"))
        (is (= :missing-ledger (failure-code #(open-service directory))))
        (is (= :missing-ledger (failure-code #(store/state (:store service)))))
        (is (= :missing-ledger
               (failure-code #(store/transact! (:store service)
                                                (fn [_] (reset! decided? true) {:result :unsafe-empty-state})))))
        (is (false? @decided?) "A running store must not decide from a lost ledger")
        (is (false? (fs/existsSync (str directory "/identity.edn")))))
      (finally (remove! directory))))
  (let [directory (directory)]
    (try
      (open-service directory)
      (fs/unlinkSync (str directory "/private/master-key"))
      (is (= :missing-vault-key (failure-code #(open-service directory))))
      (finally (remove! directory))))
  (let [directory (directory)]
    (try
      (let [service (open-service directory)]
        (fs/appendFileSync (str directory "/identity.edn") "{:broken\n")
        (is (thrown? js/Error (store/state (:store service)))))
      (finally (remove! directory)))))

(deftest pure-identity-contracts-test
  (testing "safe local redirects and separate usernames"
    (is (= "/wiki" (shape/safe-redirect "/wiki")))
    (doseq [redirect ["//evil.test" "https://evil.test" "/\\evil.test" "/wiki\nLocation: evil"]]
      (is (= "/" (shape/safe-redirect redirect))))
    (is (law/valid-username? "alice_123"))
    (is (not (law/valid-username? "alice@example.test")))))

(deftest ^:async bootstrap-is-explicit-and-restart-stable-test
  (let [directory (directory)]
    (try
      (let [service (open-service directory)
            options (assoc signup :principal-id "actor_admin")
            principal (await (identity/bootstrap! service options))]
        (is (= "actor_admin" (:principal/id principal)))
        (is (= ["axxium/admin"] (:principal/capabilities principal)))
        (is (= principal (await (identity/bootstrap! (open-service directory) options))))
        (is (= 1 (count (:canonical/events (store/history (:store service))))))
        (try
          (await (identity/bootstrap! service (assoc options :password "new password is not silent rotation")))
          (is false "bootstrap credential changes require an explicit rotation")
          (catch :default error (is (= :bootstrap-mismatch (:code (ex-data error)))))))
      (finally (remove! directory))))
  (let [directory (directory)]
    (try
      (let [service (open-service directory)]
        (await (identity/signup! service signup))
        (try
          (await (identity/bootstrap! service signup))
          (is false "an existing self-signup must never become the administrator")
          (catch :default error (is (= :bootstrap-collision (:code (ex-data error)))))))
      (finally (remove! directory)))))
