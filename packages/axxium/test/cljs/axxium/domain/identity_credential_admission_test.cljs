(ns axxium.domain.identity-credential-admission-test
  (:require [axxium.domain.identity :as identity]
            [axxium.domain.identity-passkey-enrollment :as passkey]
            [axxium.domain.identity-pgp :as pgp]
            [cljs.test :as t]
            [clojure.string :as str]))

(def actor
  "Current active enrollment owner."
  {:principal/id "actor-one" :principal/entity-id "entity-one"
   :principal/kind :human :principal/username "writer"
   :principal/display-name "Writer" :principal/status :active
   :principal/roles ["basic-user"] :principal/capabilities []})

(def session "Captured browser session authority."
  {:principal-id "actor-one" :issued-at 10 :expires-at 2000})
(def challenge "Reserved immutable challenge identity and mutable attempt count."
  {:purpose :pgp-enroll :browser-hash "browser-hash"
                :issued-at 20 :expires-at 1500 :private-ref "ceremony:sealed-proof"
                :proof-attempts 1})
(def credential "Verified serializable registration output."
  {:id "passkey-id" :public-key "encoded-key" :counter 0
                 :transports ["internal"] :device-type "singleDevice" :backed-up? false})
(def base-state "Current enrollment state before crypto completes."
  {:principals {"actor-one" actor}
                 :sessions {"existing-session" session}
                 :challenges {"challenge-one" challenge}
                 :credentials {}})
(def base-input "Host facts captured for one enrollment."
  {:actor-id "actor-one" :session-hash "existing-session"
                 :expected-session session :challenge-principal-id "actor-one"
                 :now 1000 :challenge-id "challenge-one" :browser-hash "browser-hash"
                 :expected-challenge challenge})

(defn- enrollment-case [method]
  (let [purpose (if (= method :pgp) :pgp-enroll :passkey-enroll)
        record (assoc challenge :purpose purpose)]
    {:transition (if (= method :pgp) pgp/enrollment-transition passkey/transition)
     :state (assoc-in base-state [:challenges "challenge-one"] record)
     :input (merge (assoc base-input :expected-challenge record)
                   (if (= method :pgp)
                     {:fingerprint "FULL-FINGERPRINT" :proof {:verified? true :fingerprint "FULL-FINGERPRINT"}
                      :private-ref "sealed-new-public-key"}
                     {:proof {:verified? true :credential credential}}))
     :credential-key (if (= method :pgp) "pgp:FULL-FINGERPRINT" "passkey:passkey-id")}))

(defn- refusal [transition snapshot input]
  (try (transition snapshot input) nil
       (catch :default error (:code (ex-data error)))))

(t/deftest enrollment-is-one-atomic-current-authority-decision
  (doseq [method [:pgp :passkey]]
    (let [{:keys [transition state input credential-key]} (enrollment-case method)
          transaction (transition state input)
          replayed (identity/apply-event state {:event/data transaction})]
      (t/is (= transaction (transition state input)))
      (t/is (= (if (= method :pgp) :pgp-enrolled :passkey-enrolled) (:operation transaction)))
      (t/is (= "actor-one" (:actor transaction)))
      (t/is (= (if (= method :pgp) {:ok true :fingerprint "FULL-FINGERPRINT"}
                 {:ok true :credential-id "passkey-id"}) (:result transaction)))
      (t/is (= (if (= method :pgp) {:principal-id "actor-one" :private-ref "sealed-new-public-key"}
                 {:principal-id "actor-one" :credential credential})
             (get-in replayed [:credentials credential-key])))
      (t/is (= (:sessions state) (:sessions replayed)))
      (t/is (= (:principals state) (:principals replayed)))
      (t/is (nil? (get-in replayed [:challenges "challenge-one"])))
      (t/is (= :invalid-challenge (refusal transition replayed input))))))

(t/deftest enrollment-refuses-stale-revoked-or-swapped-session-authority
  (doseq [method [:pgp :passkey]]
    (let [{:keys [transition state input]} (enrollment-case method)
          other (assoc actor :principal/id "actor-two")
          with-other (assoc-in state [:principals "actor-two"] other)]
      (doseq [snapshot [(update state :sessions dissoc "existing-session")
                        (assoc-in state [:sessions "existing-session" :expires-at] 1000)
                        (assoc-in state [:sessions "existing-session" :issued-at] 11)
                        (assoc-in with-other [:sessions "existing-session" :principal-id] "actor-two")
                        (assoc-in state [:principals "actor-one" :principal/status] :suspended)
                        (assoc-in state [:principals "actor-one" :principal/status] :retired)
                        (update state :principals dissoc "actor-one")
                        (assoc-in state [:principals "actor-one" :principal/id] "actor-two")]]
        (t/is (= :unauthenticated (refusal transition snapshot input))))
      (t/is (= :unauthenticated (refusal transition state (assoc input :actor-id "actor-two"))))
      (t/is (= :invalid-challenge
             (refusal transition state (assoc input :challenge-principal-id "actor-two"))))
      (t/is (:ok (:result (transition (assoc-in state [:principals "actor-one" :principal/roles] ["editor"])
                                    input)))))))

(t/deftest enrollment-refuses-credential-conflicts-and-unverified-proofs
  (doseq [method [:pgp :passkey]]
    (let [{:keys [transition state input credential-key]} (enrollment-case method)]
      (doseq [existing [{:principal-id "actor-one"} {:principal-id "actor-two"} nil]]
        (t/is (= :credential-exists (refusal transition (assoc-in state [:credentials credential-key] existing) input))))
      (t/is (= :invalid-credentials (refusal transition state (assoc input :proof {:verified? false}))))
      (t/is (= :invalid-credentials (refusal transition state (assoc input :proof {:verified? true}))))))
  (let [{:keys [transition state input]} (enrollment-case :pgp)]
    (t/is (= :invalid-credentials
           (refusal transition state (assoc-in input [:proof :fingerprint] "DIFFERENT-FINGERPRINT"))))))

(t/deftest enrollment-requires-the-same-private-challenge-but-allows-later-attempt-reservations
  (doseq [method [:pgp :passkey]]
    (let [{:keys [transition state input]} (enrollment-case method)]
      (doseq [[field value] [[:private-ref "ceremony:swapped"] [:issued-at 21]
                             [:expires-at 1600] [:browser-hash "other-browser"] [:purpose :other]]]
        (t/is (= :invalid-challenge
               (refusal transition (assoc-in state [:challenges "challenge-one" field] value) input))))
      (t/is (= :invalid-challenge (refusal transition (update state :challenges dissoc "challenge-one") input)))
      (t/is (= :invalid-challenge (refusal transition state (assoc input :now 1500))))
      (t/is (= :invalid-challenge (refusal transition state (assoc input :browser-hash "other-browser"))))
      (t/is (:ok (:result (transition (assoc-in state [:challenges "challenge-one" :proof-attempts] 3)
                                    input)))))))

(def pgp-record "Exact public-key reference used by the verifier."
  {:principal-id "actor-one" :private-ref "sealed-current-pgp"})
(def login-challenge "Reserved login proof identity."
  (assoc challenge :purpose :pgp-login))
(def login-state "Accepted account and PGP credential before login."
  (-> base-state
                     (assoc-in [:credentials "pgp:FULL-FINGERPRINT"] pgp-record)
                     (assoc-in [:challenges "challenge-one"] login-challenge)))
(def login-input "Verified proof and generated session facts."
  {:fingerprint "FULL-FINGERPRINT" :expected-record pgp-record
                  :proof {:verified? true :fingerprint "FULL-FINGERPRINT"}
                  :challenge-id "challenge-one" :browser-hash "browser-hash"
                  :expected-challenge login-challenge
                  :token "secret-response-token" :token-hash "new-session" :issued-at 1000 :expires-at 2000})

(t/deftest pgp-login-atomically-consumes-proof-and-returns-current-principal
  (let [current (assoc actor :principal/roles ["editor"])
        state (assoc-in login-state [:principals "actor-one"] current)
        transaction (pgp/login-transition state login-input)
        replayed (identity/apply-event state {:event/data transaction})]
    (t/is (= transaction (pgp/login-transition state login-input)))
    (t/is (= :pgp-login (:operation transaction)))
    (t/is (= "actor-one" (:actor transaction)))
    (t/is (= {:ok true :principal current :token "secret-response-token"} (:result transaction)))
    (t/is (= {:principal-id "actor-one" :issued-at 1000 :expires-at 2000}
           (get-in replayed [:sessions "new-session"])))
    (t/is (= current (identity/principal-for-session replayed "new-session" 1999)))
    (t/is (nil? (identity/principal-for-session replayed "new-session" 2000)))
    (t/is (= (:credentials state) (:credentials replayed)))
    (t/is (nil? (get-in replayed [:challenges "challenge-one"])))
    (t/is (not (str/includes? (pr-str (:changes transaction)) "secret-response-token")))
    (t/is (= :invalid-challenge (refusal pgp/login-transition replayed login-input)))))

(t/deftest pgp-login-refuses-revoked-replaced-or-reassigned-credentials
  (doseq [snapshot [(update login-state :credentials dissoc "pgp:FULL-FINGERPRINT")
                    (assoc-in login-state [:credentials "pgp:FULL-FINGERPRINT" :private-ref] "replacement")
                    (assoc-in login-state [:credentials "pgp:FULL-FINGERPRINT" :principal-id] "actor-two")
                    (assoc-in login-state [:principals "actor-one" :principal/status] :suspended)
                    (update login-state :principals dissoc "actor-one")
                    (assoc-in login-state [:principals "actor-one" :principal/id] "actor-two")]]
    (t/is (= :invalid-credentials (refusal pgp/login-transition snapshot login-input))))
  (doseq [input [(assoc login-input :expected-record nil)
                 (assoc login-input :proof {:verified? false})
                 (assoc-in login-input [:proof :fingerprint] "DIFFERENT-FINGERPRINT")
                 (assoc login-input :fingerprint "DIFFERENT-FINGERPRINT")]]
    (t/is (= :invalid-credentials (refusal pgp/login-transition login-state input)))))

(t/deftest pgp-login-refuses-session-collisions-without-consuming-the-challenge
  (doseq [existing [session (assoc session :principal-id "actor-two") nil]]
    (let [snapshot (assoc-in login-state [:sessions "new-session"] existing)]
      (t/is (= :login-session-collision (refusal pgp/login-transition snapshot login-input)))
      (t/is (= existing (get-in snapshot [:sessions "new-session"])))
      (t/is (= login-challenge (get-in snapshot [:challenges "challenge-one"]))))))

(t/deftest pgp-login-requires-the-verified-challenge-identity
  (doseq [[field value] [[:private-ref "ceremony:swapped"] [:issued-at 21] [:expires-at 1600]
                         [:browser-hash "other-browser"] [:purpose :pgp-enroll]]]
    (t/is (= :invalid-challenge
           (refusal pgp/login-transition (assoc-in login-state [:challenges "challenge-one" field] value)
                    login-input))))
  (t/is (= :invalid-challenge (refusal pgp/login-transition login-state (assoc login-input :issued-at 1500))))
  (t/is (= :invalid-challenge (refusal pgp/login-transition login-state (assoc login-input :browser-hash "other"))))
  (t/is (:ok (:result (pgp/login-transition
                     (assoc-in login-state [:challenges "challenge-one" :proof-attempts] 3) login-input)))))

(t/deftest malformed-host-admissions-refuse-before-any-decision
  (doseq [method [:pgp :passkey]]
    (let [{:keys [transition state input]} (enrollment-case method)
          error-code (if (= method :pgp) :invalid-pgp-admission :invalid-passkey-admission)]
      (doseq [request [(dissoc input :expected-session)
                       (dissoc input :expected-challenge)
                       (assoc input :now -1)
                       (assoc input :now "1000")
                       (assoc input :unexpected-host-field true)]]
        (t/is (= error-code (refusal transition state request))))))
  (doseq [request [(assoc login-input :expires-at 1000)
                   (assoc login-input :issued-at -1)
                   (assoc login-input :token "")
                   (dissoc login-input :expected-challenge)
                   (assoc login-input :unexpected-host-field true)]]
    (t/is (= :invalid-pgp-admission (refusal pgp/login-transition login-state request))))
  (t/testing "malformed registration credentials never enter durable state"
    (let [{:keys [transition state input]} (enrollment-case :passkey)]
      (doseq [[field value] [[:id ""] [:public-key ""] [:counter -1] [:counter 4294967296]
                             [:counter 0.5] [:transports "internal"] [:backed-up? nil]]]
        (t/is (= :invalid-passkey-admission
               (refusal transition state (assoc-in input [:proof :credential field] value))))))))

(t/deftest enrollment-preserves-session-records-without-issuance-time
  (doseq [method [:pgp :passkey]]
    (let [{:keys [transition state input]} (enrollment-case method)
          compatible-session (dissoc session :issued-at)
          snapshot (assoc-in state [:sessions "existing-session"] compatible-session)
          captured (assoc input :expected-session compatible-session)]
      (t/is (:ok (:result (transition snapshot captured))))
      (t/is (= :unauthenticated
               (refusal transition (assoc-in snapshot [:sessions "existing-session" :issued-at] 10) captured))))))
