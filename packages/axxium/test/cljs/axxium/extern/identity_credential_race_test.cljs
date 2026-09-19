(ns axxium.extern.identity-credential-race-test
  (:require [axxium.domain.identity :as domain]
            [axxium.extern.credential-crypto :as crypto]
            [axxium.extern.identity-host :as host]
            [axxium.extern.webauthn-fixture :as webauthn]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-store :as store]
            [cljs.test :refer [deftest is]]
            ["node:buffer" :refer [Buffer]]
            ["openpgp" :as pgp]))

(defn- actor [id]
  {:principal/id id :principal/entity-id (str "entity_" id)
   :principal/kind :human :principal/username (str "user-" id)
   :principal/display-name id :principal/status :active
   :principal/roles ["basic-user"] :principal/capabilities []})

(defn- service! []
  (let [service (identity/open! {:provider :memory :public-base-url "http://localhost:8787"})
        now (host/now)]
    (store/transact! (:store service)
                    (fn [_] {:operation :fixture
                             :changes [(domain/put :principals "actor_a" (actor "actor_a"))
                                       (domain/put :principals "actor_b" (actor "actor_b"))
                                       (domain/put :sessions (host/sha256 "session")
                                                   {:principal-id "actor_a" :issued-at now
                                                    :expires-at (+ now 600000)})]}))
    service))

(defn- swap-session-owner! [service]
  (store/transact! (:store service)
                  (fn [state] {:operation :concurrent-session-change
                               :changes [(domain/put :sessions (host/sha256 "session")
                                                     (assoc (get-in state [:sessions (host/sha256 "session")])
                                                            :principal-id "actor_b"))]})))

(defn- ^:async refusal [run]
  (try (await (run)) nil (catch :default cause (:code (ex-data cause)))))

(defn- ^:async pgp-pair []
  (await (.generateKey pgp #js {:type "ecc" :curve "curve25519Legacy"
                               :userIDs #js [#js {:name "Ephemeral race fixture"}]
                               :format "armored"})))

(defn- ^:async sign [pair challenge]
  (let [key (await (.readPrivateKey pgp #js {:armoredKey (.-privateKey ^js pair)}))
        message (await (.createMessage pgp #js {:binary (.from Buffer challenge "utf8")}))]
    (await (.sign pgp #js {:message message :signingKeys key :detached true :format "armored"}))))

(deftest ^:async pgp-enrollment-rechecks-the-exact-session-after-real-signature-verification
  (let [service (service!)
        browser (host/random-token)
        pair (await (pgp-pair))
        challenge (identity/pgp-challenge! service "session" browser {:purpose :enroll})
        signature (await (sign pair (:challenge challenge)))
        request {:challenge-id (:challenge-id challenge) :signature signature :public-key (.-publicKey ^js pair)}
        verify! crypto/verify-pgp
        before (count @(:private (:store service)))]
    (with-redefs [crypto/verify-pgp (fn ^:async verified-then-reassigned [input]
                                    (let [proof (await (verify! input))]
                                      (swap-session-owner! service) proof))]
      (is (= :unauthenticated (await (refusal #(identity/enroll-pgp! service "session" browser request))))))
    (is (empty? (:credentials (store/state (:store service)))))
    (is (= before (count @(:private (:store service)))) "The refused public-key preparation is reclaimed")))

(deftest ^:async passkey-enrollment-rechecks-the-exact-session-after-real-attestation-verification
  (let [service (service!)
        browser (host/random-token)
        generated (webauthn/p256-credential)
        challenge (await (identity/passkey-registration-options! service "session" browser))
        request {:challenge-id (:challenge-id challenge)
                 :response (webauthn/registration-response (:credential generated)
                                                         (get-in challenge [:options :challenge])
                                                         "http://localhost:8787" "localhost")}
        verify! crypto/verify-registration]
    (with-redefs [crypto/verify-registration (fn ^:async verified-then-reassigned [input]
                                             (let [proof (await (verify! input))]
                                               (swap-session-owner! service) proof))]
      (is (= :unauthenticated
             (await (refusal #(identity/passkey-registration-verify! service "session" browser request))))))
    (is (empty? (:credentials (store/state (:store service)))))))

(deftest ^:async pgp-login-refuses-a-replaced-challenge-after-real-signature-verification
  (let [service (service!)
        browser (host/random-token)
        pair (await (pgp-pair))
        public-key (.-publicKey ^js pair)
        fingerprint (await (crypto/pgp-fingerprint public-key))
        reference (store/seal! (:store service) {:public-key public-key})
        _ (store/transact! (:store service)
                           (fn [_] {:operation :fixture
                                    :changes [(domain/put :credentials (str "pgp:" fingerprint)
                                                          {:principal-id "actor_a" :private-ref reference})]}))
        challenge (identity/pgp-challenge! service nil browser {:fingerprint fingerprint})
        signature (await (sign pair (:challenge challenge)))
        request {:challenge-id (:challenge-id challenge) :signature signature}
        verify! crypto/verify-pgp
        before (:sessions (store/state (:store service)))]
    (with-redefs [crypto/verify-pgp (fn ^:async verified-then-replaced [input]
                                    (let [proof (await (verify! input))]
                                      (swap! (:ceremonies (:store service)) update-in
                                             [(:challenge-id challenge) :issued-at] inc)
                                      proof))]
      (is (= :invalid-challenge (await (refusal #(identity/pgp-login! service browser request))))))
    (is (= before (:sessions (store/state (:store service)))))))
