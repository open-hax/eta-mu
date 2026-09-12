(ns axxium.infra.identity-passkey-admission-test
  (:require [axxium.domain.identity :as domain]
            [axxium.extern.credential-crypto :as crypto]
            [axxium.extern.identity-host :as host]
            [axxium.extern.webauthn-fixture :as fixture]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-store :as store]
            [cljs.test :refer [deftest is]]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(def actor
  {:principal/id "actor_passkey" :principal/entity-id "entity_passkey"
   :principal/kind :human :principal/username "passkey-user"
   :principal/display-name "Passkey user" :principal/status :active
   :principal/roles ["basic-user"] :principal/capabilities []})

(defn- options [directory]
  {:provider :edn :directory directory :public-base-url "http://localhost:8787" :rp-id "localhost"})

(defn- seed! [service credential]
  (store/transact!
   (:store service)
   (fn [_]
     {:operation :test-fixture
      :changes [(domain/put :principals (:principal/id actor) actor)
                (domain/put :credentials (str "passkey:" (:id credential))
                            {:principal-id (:principal/id actor) :credential credential})
                (domain/put :sessions (host/sha256 "test-session")
                            {:principal-id (:principal/id actor) :expires-at (+ (host/now) 600000)})]})))

(defn- ^:async failure [run]
  (try (await (run)) nil (catch :default cause (:code (ex-data cause)))))

(deftest ^:async invalid-real-passkey-signatures-are-bounded-across-reopened-handles
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-passkey-bound-"))
        calls (atom 0)
        verify! crypto/verify-authentication]
    (try
      (let [service (identity/open! (options directory))
            generated (fixture/p256-credential)
            _ (seed! service (:credential generated))
            browser (host/random-token)
            challenge (await (identity/passkey-authentication-options! service browser))
            invalid (assoc generated :private-key (:private-key (fixture/p256-credential)))
            request {:challenge-id (:challenge-id challenge)
                     :response (fixture/authentication-response invalid (get-in challenge [:options :challenge])
                                                                "http://localhost:8787" "localhost" 1 5)}]
        (with-redefs [crypto/verify-authentication (fn ^:async counted-proof [input]
                                                   (swap! calls inc) (await (verify! input)))]
          (is (= :invalid-challenge
                 (await (failure #(identity/passkey-authentication-verify! service (host/random-token) request)))))
          (is (= 0 @calls))
          (dotimes [_ 3]
            (is (= :invalid-credentials
                   (await (failure #(identity/passkey-authentication-verify!
                                      (identity/open! (options directory)) browser request))))))
          (let [before (fs/readFileSync (str directory "/ceremonies.edn") "utf8")]
            (dotimes [_ 2]
              (is (= :ceremony-rate-limit
                     (await (failure #(identity/passkey-authentication-verify!
                                        (identity/open! (options directory)) browser request))))))
            (is (= before (fs/readFileSync (str directory "/ceremonies.edn") "utf8"))))
          (is (= 3 @calls))))
      (finally (fs/rmSync directory #js {:recursive true :force true})))))

(deftest ^:async invalid-attestations-are-bounded-and-enrollment-checks-account-before-crypto
  (let [service (identity/open! {:provider :memory :public-base-url "http://localhost:8787" :rp-id "localhost"})
        generated (fixture/p256-credential)
        _ (seed! service (:credential generated))
        browser (host/random-token)
        calls (atom 0)
        verify! crypto/verify-registration
        challenge (await (identity/passkey-registration-options! service "test-session" browser))
        request {:challenge-id (:challenge-id challenge)
                 :response (fixture/registration-response (:credential (fixture/p256-credential))
                                                           "incorrect-challenge" "http://localhost:8787" "localhost")}]
    (store/transact! (:store service)
                    (fn [_] {:operation :test-fixture
                             :changes [(domain/put :principals "another-actor" (assoc actor :principal/id "another-actor"))
                                       (domain/put :sessions (host/sha256 "another-session")
                                                   {:principal-id "another-actor" :expires-at (+ (host/now) 600000)})]}))
    (with-redefs [crypto/verify-registration (fn ^:async counted-proof [input]
                                             (swap! calls inc) (await (verify! input)))]
      (is (= :invalid-challenge
             (await (failure #(identity/passkey-registration-verify! service "test-session" (host/random-token) request)))))
      (is (= :invalid-challenge
             (await (failure #(identity/passkey-registration-verify! service "another-session" browser request)))))
      (is (= 0 @calls))
      ;; The wrong-account request may spend its browser-bound slot, but cannot do crypto.
      (dotimes [_ 2]
        (is (= :invalid-credentials
               (await (failure #(identity/passkey-registration-verify! service "test-session" browser request))))))
      (is (= :ceremony-rate-limit
             (await (failure #(identity/passkey-registration-verify! service "test-session" browser request)))))
      (is (= 2 @calls)))))

(deftest ^:async uncertain-passkey-reservation-remains-spent-after-reopen
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-passkey-force-"))
        calls (atom 0)
        replace! host/replace-private-text!
        verify! crypto/verify-authentication]
    (try
      (let [service (identity/open! (options directory))
            generated (fixture/p256-credential)
            _ (seed! service (:credential generated))
            browser (host/random-token)
            challenge (await (identity/passkey-authentication-options! service browser))
            invalid (assoc generated :private-key (:private-key (fixture/p256-credential)))
            request {:challenge-id (:challenge-id challenge)
                     :response (fixture/authentication-response invalid (get-in challenge [:options :challenge])
                                                                "http://localhost:8787" "localhost" 1 5)}]
        (with-redefs [crypto/verify-authentication (fn ^:async counted-proof [input]
                                                   (swap! calls inc) (await (verify! input)))]
          (is (= :injected-publication-failure
                 (await (with-redefs [host/replace-private-text!
                                     (fn [file text]
                                       (replace! file text)
                                       (throw (ex-info "Injected post-publication failure" {:code :injected-publication-failure})))]
                          (failure #(identity/passkey-authentication-verify! service browser request))))))
          (is (= 0 @calls))
          (dotimes [_ 2]
            (is (= :invalid-credentials
                   (await (failure #(identity/passkey-authentication-verify!
                                      (identity/open! (options directory)) browser request))))))
          (is (= :ceremony-rate-limit
                 (await (failure #(identity/passkey-authentication-verify!
                                    (identity/open! (options directory)) browser request)))))
          (is (= 2 @calls))))
      (finally (fs/rmSync directory #js {:recursive true :force true})))))

(deftest ^:async admitted-real-passkey-enrollment-and-login-remain-single-use
  (let [service (identity/open! {:provider :memory :public-base-url "http://localhost:8787" :rp-id "localhost"})
        generated (fixture/p256-credential)
        _ (seed! service (:credential (fixture/p256-credential)))
        browser (host/random-token)
        enrollment (await (identity/passkey-registration-options! service "test-session" browser))
        enrollment-request {:challenge-id (:challenge-id enrollment)
                            :response (fixture/registration-response (:credential generated)
                                                                    (get-in enrollment [:options :challenge])
                                                                    "http://localhost:8787" "localhost")}
        enrolled (await (identity/passkey-registration-verify! service "test-session" browser enrollment-request))
        challenge (await (identity/passkey-authentication-options! service browser))
        request {:challenge-id (:challenge-id challenge)
                 :response (fixture/authentication-response generated (get-in challenge [:options :challenge])
                                                            "http://localhost:8787" "localhost" 1 5)}
        result (await (identity/passkey-authentication-verify! service browser request))]
    (is (:ok enrolled))
    (is (= actor (:principal result)))
    (is (= actor (identity/resolve-principal service (:token result))))
    (is (= 1 (get-in (store/state (:store service)) [:credentials (str "passkey:" (get-in generated [:credential :id])) :credential :counter])))
    (is (= :invalid-challenge (await (failure #(identity/passkey-authentication-verify! service browser request)))))
    (is (= :invalid-challenge (await (failure #(identity/passkey-registration-verify! service "test-session" browser enrollment-request)))))))
