(ns axxium.infra.identity-pgp-admission-test
  (:require [axxium.domain.identity :as domain]
            [axxium.extern.credential-crypto :as crypto]
            [axxium.extern.identity-host :as host]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-store :as store]
            [cljs.test :refer [deftest is]]
            ["node:buffer" :refer [Buffer]]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]
            ["openpgp" :as pgp]))

(def actor
  {:principal/id "actor_pgp" :principal/entity-id "entity_pgp"
   :principal/kind :human :principal/username "pgp-user"
   :principal/display-name "PGP user" :principal/status :active
   :principal/roles ["basic-user"] :principal/capabilities []})

(defn- options [directory]
  {:provider :edn :directory directory :public-base-url "http://localhost:8787"})

(defn- seed! [service fingerprint public-key]
  (let [identity-store (:store service)
        reference (store/seal! identity-store {:public-key public-key})]
    (store/transact!
     identity-store
     (fn [_]
       {:operation :test-fixture
        :changes [(domain/put :principals (:principal/id actor) actor)
                  (domain/put :credentials (str "pgp:" fingerprint)
                              {:principal-id (:principal/id actor) :private-ref reference})
                  (domain/put :sessions (host/sha256 "test-session")
                              {:principal-id (:principal/id actor) :expires-at (+ (host/now) 600000)})]}))))

(defn- ^:async failure [run]
  (try (await (run)) nil (catch :default cause (:code (ex-data cause)))))

(deftest ^:async invalid-pgp-completions-are-bounded-across-reopened-handles
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-pgp-bound-"))
        calls (atom 0)]
    (try
      (let [service (identity/open! (options directory))
            browser (host/random-token)
            _ (seed! service "test-fingerprint" "test-key")
            challenge (identity/pgp-challenge! service nil browser {:fingerprint "test-fingerprint"})
            request {:challenge-id (:challenge-id challenge) :signature "invalid"}]
        (with-redefs [crypto/verify-pgp (fn ^:async invalid-proof [_]
                                        (swap! calls inc)
                                        (throw (ex-info "Invalid signature" {:code :invalid-signature})))]
          (dotimes [_ 3]
            (is (= :invalid-credentials
                   (await (failure #(identity/pgp-login! (identity/open! (options directory)) browser request))))))
          (let [before (fs/readFileSync (str directory "/ceremonies.edn") "utf8")]
            (dotimes [_ 3]
              (is (= :ceremony-rate-limit
                     (await (failure #(identity/pgp-login! (identity/open! (options directory)) browser request))))))
            (is (= before (fs/readFileSync (str directory "/ceremonies.edn") "utf8")))))
        (is (= 3 @calls) "Rejected completion retries must not invoke the crypto boundary"))
      (finally (fs/rmSync directory #js {:recursive true :force true})))))

(deftest ^:async enrollment-completions-and-browser-binding-share-the-bound
  (let [service (identity/open! {:provider :memory :public-base-url "http://localhost"})
        browser (host/random-token)
        calls (atom 0)
        _ (seed! service "existing-fingerprint" "existing-key")
        challenge (identity/pgp-challenge! service "test-session" browser {:purpose :enroll})
        request {:challenge-id (:challenge-id challenge) :signature "invalid" :public-key "another-key"}]
    (with-redefs [crypto/verify-pgp (fn ^:async invalid-proof [_]
                                    (swap! calls inc)
                                    (throw (ex-info "Invalid signature" {:code :invalid-signature})))]
      (is (= :invalid-challenge
             (await (failure #(identity/enroll-pgp! service "test-session" (host/random-token) request)))))
      (is (= 0 @calls))
      (dotimes [_ 3]
        (is (= :invalid-credentials
               (await (failure #(identity/enroll-pgp! service "test-session" browser request))))))
      (is (= :ceremony-rate-limit
             (await (failure #(identity/enroll-pgp! service "test-session" browser request)))))
      (is (= 3 @calls)))))

(deftest ^:async uncertain-admission-publication-never-starts-unaccounted-crypto
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-pgp-force-"))
        calls (atom 0)
        replace! host/replace-private-text!]
    (try
      (let [service (identity/open! (options directory))
            browser (host/random-token)
            _ (seed! service "test-fingerprint" "test-key")
            challenge (identity/pgp-challenge! service nil browser {:fingerprint "test-fingerprint"})
            request {:challenge-id (:challenge-id challenge) :signature "invalid"}]
        (with-redefs [crypto/verify-pgp (fn ^:async invalid-proof [_]
                                        (swap! calls inc)
                                        (throw (ex-info "Invalid signature" {:code :invalid-signature})))]
          (is (= :injected-publication-failure
                 (await (with-redefs [host/replace-private-text!
                                     (fn [file text]
                                       (replace! file text)
                                       (throw (ex-info "Injected post-publication failure" {:code :injected-publication-failure})))]
                          (failure #(identity/pgp-login! service browser request))))))
          (is (= 0 @calls) "The crypto boundary runs only after durable admission returns")
          (let [reopened (identity/open! (options directory))]
            (dotimes [_ 2]
              (is (= :invalid-credentials (await (failure #(identity/pgp-login! reopened browser request))))))
            (is (= :ceremony-rate-limit (await (failure #(identity/pgp-login! reopened browser request)))))))
        (is (= 2 @calls) "The uncertain but visible reservation consumes a slot after restart"))
      (finally (fs/rmSync directory #js {:recursive true :force true})))))

(deftest ^:async admitted-real-pgp-proof-creates-one-session-and-remains-single-use
  (let [service (identity/open! {:provider :memory :public-base-url "http://localhost"})
        pair (await (.generateKey pgp #js {:type "ecc" :curve "curve25519Legacy"
                                          :userIDs #js [#js {:name "Ephemeral fixture" :email "proof@example.invalid"}]
                                          :format "armored"}))
        public-key (.-publicKey ^js pair)
        fingerprint (await (crypto/pgp-fingerprint public-key))
        _ (seed! service fingerprint public-key)
        browser (host/random-token)
        challenge (identity/pgp-challenge! service nil browser {:fingerprint fingerprint})
        key (await (.readPrivateKey pgp #js {:armoredKey (.-privateKey ^js pair)}))
        message (await (.createMessage pgp #js {:binary (.from Buffer (:challenge challenge) "utf8")}))
        signature (await (.sign pgp #js {:message message :signingKeys key :detached true :format "armored"}))
        request {:challenge-id (:challenge-id challenge) :signature signature}
        result (await (identity/pgp-login! service browser request))]
    (is (= actor (:principal result)))
    (is (= actor (identity/resolve-principal service (:token result))))
    (is (= :invalid-challenge (await (failure #(identity/pgp-login! service browser request)))))))
