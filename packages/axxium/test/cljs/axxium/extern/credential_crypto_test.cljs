(ns axxium.extern.credential-crypto-test
  (:require [axxium.extern.credential-crypto :as credentials]
            [axxium.extern.webauthn-fixture :as fixture]
            [cljs.reader :as edn]
            [cljs.test :refer [deftest is testing]]
            ["node:buffer" :refer [Buffer]]
            ["node:crypto" :as crypto]
            ["openpgp" :as pgp]))

(defn- ^:async refused? [verify!]
  (try
    (not (:verified? (await (verify!))))
    (catch :default _ true)))

(deftest ^:async password-roundtrip-and-fail-closed-test
  (let [password "test-only passphrase with Unicode λ"
        first-record (await (credentials/hash-password password))
        second-record (await (credentials/hash-password password))]
    (is (not= (:salt first-record) (:salt second-record)))
    (is (not= (:hash first-record) (:hash second-record)))
    (is (= first-record (edn/read-string (pr-str first-record))))
    (is (true? (await (credentials/verify-password password first-record))))
    (is (false? (await (credentials/verify-password "wrong password" first-record))))
    (doseq [record [nil {} (assoc first-record :version 99)
                    (assoc first-record :scheme :unknown)
                    (assoc first-record :salt "not base64url")
                    (assoc first-record :hash "AA")
                    (assoc first-record :hash (str (:hash first-record) "="))]]
      (is (false? (await (credentials/verify-password password record)))))
    (is (false? (await (credentials/verify-password nil first-record))))
    (is (false? (await (credentials/verify-password (apply str (repeat 1025 "x"))
                                                   first-record))))))

(defn- ^:async pgp-keypair []
  (await (.generateKey pgp #js {:type "ecc" :curve "curve25519Legacy"
                               :userIDs #js [#js {:name "Ephemeral test only"
                                                 :email "test@example.invalid"}]
                               :format "armored"})))

(deftest ^:async passkey-descriptor-validation-is-eager-test
  (let [registration {:rp-id "localhost" :rp-name "Axxium"
                      :user-id "descriptor-test" :user-name "alice"}
        descriptor {:id "AA" :transports ["internal"]}]
    (is (= [(assoc descriptor :type "public-key")]
           (:excludeCredentials
            (await (credentials/registration-options (assoc registration :credentials [descriptor]))))))
    (is (= [(assoc descriptor :type "public-key")]
           (:allowCredentials (await (credentials/authentication-options
                                      {:rp-id "localhost" :credentials [descriptor]})))))
    (doseq [invalid-id ["not base64url" "AA=" "AB"]
            generate! [#(credentials/registration-options (assoc registration :credentials [{:id invalid-id}]))
                       #(credentials/authentication-options {:rp-id "localhost" :credentials [{:id invalid-id}]})]]
      (try
        (await (generate!))
        (is false "Descriptor validation must throw before SDK option generation")
        (catch :default error
          (is (= :invalid-credential-input (:type (ex-data error)))))))))

(defn- ^:async sign-challenge [private-key challenge & [other-private-key]]
  (let [key (await (.readPrivateKey pgp #js {:armoredKey private-key}))
        other-key (when other-private-key
                    (await (.readPrivateKey pgp #js {:armoredKey other-private-key})))
        message (await (.createMessage pgp #js {:binary (.from Buffer challenge "utf8")}))]
    (await (.sign pgp #js {:message message :signingKeys (if other-key #js [key other-key] key)
                           :detached true
                           :format "armored"}))))

(deftest ^:async detached-pgp-exact-bytes-test
  (let [keypair (await (pgp-keypair))
        public-key (.-publicKey ^js keypair)
        private-key (.-privateKey ^js keypair)
        challenge "Axxium authentication\nnonce=test-only\norigin=http://localhost:3000\n"
        signature (await (sign-challenge private-key challenge))
        proof {:public-key public-key :signature signature :challenge challenge}
        fingerprint (await (credentials/pgp-fingerprint public-key))
        verified (await (credentials/verify-pgp proof))]
    (is (boolean (re-matches #"[A-F0-9]{40}|[A-F0-9]{64}" fingerprint)))
    (is (= {:verified? true :fingerprint fingerprint} verified))
    (is (= verified (edn/read-string (pr-str verified))))
    (is (await (refused? #(credentials/verify-pgp
                          (assoc proof :challenge (str challenge " "))))))
    (is (await (refused? #(credentials/verify-pgp
                          (assoc proof :challenge (.replaceAll challenge "\n" "\r\n"))))))
    (is (await (refused? #(credentials/verify-pgp (assoc proof :signature "invalid")))))
    (is (await (refused? #(credentials/verify-pgp (assoc proof :public-key private-key)))))
    (is (await (refused? #(credentials/verify-pgp
                          (assoc proof :public-key (str public-key "\n" public-key))))))
    (let [other-keypair (await (pgp-keypair))
          multiple-signature (await (sign-challenge private-key challenge
                                                    (.-privateKey ^js other-keypair)))]
      (is (await (refused? #(credentials/verify-pgp
                            (assoc proof :public-key (.-publicKey ^js other-keypair))))))
      (is (await (refused? #(credentials/verify-pgp
                            (assoc proof :signature multiple-signature))))))))

(deftest ^:async webauthn-options-and-registration-test
  (let [options-input {:rp-id "localhost" :rp-name "Axxium tests"
                       :user-id "test-account-123" :user-name "test@example.invalid"}
        options (await (credentials/registration-options options-input))
        next-options (await (credentials/registration-options options-input))
        generated (fixture/p256-credential)
        stored (:credential generated)
        proof {:challenge (:challenge options) :origin "http://localhost:3000"
               :rp-id "localhost"
               :response (fixture/registration-response stored (:challenge options)
                                                "http://localhost:3000" "localhost")}
        result (await (credentials/verify-registration proof))]
    (is (not= (:challenge options) (:challenge next-options)))
    (is (= "required" (get-in options [:authenticatorSelection :userVerification])))
    (is (= "required" (get-in options [:authenticatorSelection :residentKey])))
    (is (= (fixture/base64url (.from Buffer "test-account-123" "utf8"))
           (get-in options [:user :id])))
    (is (:verified? result))
    (is (= stored (select-keys (:credential result) [:id :public-key :counter :transports])))
    (is (= result (edn/read-string (pr-str result))))
    (is (await (refused? #(credentials/verify-registration (assoc proof :challenge "wrong")))))
    (is (await (refused? #(credentials/verify-registration
                          (assoc proof :origin "https://unrelated.example")))))
    (is (await (refused? #(credentials/verify-registration (assoc proof :rp-id "example.org")))))
    (is (await (refused? #(credentials/verify-registration (assoc proof :response {})))))
    (is (await (refused? #(credentials/verify-registration
                          (assoc proof :response
                                 (fixture/registration-response stored (:challenge options)
                                                        "http://localhost:3000" "localhost" 65))))))))

(deftest ^:async webauthn-real-signature-and-replay-rejection-test
  (let [generated (fixture/p256-credential)
        stored (:credential generated)
        options (await (credentials/authentication-options {:rp-id "localhost"
                                                            :credentials [stored]}))
        challenge (:challenge options)
        origin "http://localhost:3000"
        response (fixture/authentication-response generated challenge origin "localhost" 1 5)
        proof {:challenge challenge :origin origin :rp-id "localhost"
               :response response :credential stored}
        verified (await (credentials/verify-authentication proof))]
    (is (= "required" (:userVerification options)))
    (is (= (:id stored) (get-in options [:allowCredentials 0 :id])))
    (is (:verified? verified))
    (is (= 1 (:counter verified)))
    (is (= verified (edn/read-string (pr-str verified))))
    (testing "server-owned ceremony context is cryptographically checked"
      (doseq [[field value] [[:challenge "another-challenge"]
                            [:origin "https://unrelated.example"]
                            [:rp-id "example.org"]]]
        (is (await (refused? #(credentials/verify-authentication (assoc proof field value)))))))
    (testing "signature and stored counter are not merely parsed"
      (is (await (refused? #(credentials/verify-authentication
                            (assoc-in proof [:response :response :signature]
                                      (fixture/base64url (.randomBytes crypto 72)))))))
      (is (await (refused? #(credentials/verify-authentication
                            (assoc-in proof [:credential :counter] 1)))))
      (is (await (refused? #(credentials/verify-authentication
                            (assoc-in proof [:credential :id]
                                      (fixture/base64url (.randomBytes crypto 32))))))))
    (testing "a valid signature without user verification is insufficient"
      (is (await (refused? #(credentials/verify-authentication
                            (assoc proof :response
                                   (fixture/authentication-response generated challenge origin
                                                            "localhost" 1 1)))))))))
