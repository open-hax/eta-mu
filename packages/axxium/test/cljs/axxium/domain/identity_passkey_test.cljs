(ns axxium.domain.identity-passkey-test
  (:require [axxium.domain.identity :as identity]
            [axxium.domain.identity-passkey :as passkey]
            [cljs.test :refer [deftest is]]
            [clojure.string :as str]))

(def actor
  {:principal/id "actor_passkey" :principal/entity-id "entity_passkey"
   :principal/kind :human :principal/username "passkey-user"
   :principal/display-name "Passkey user" :principal/status :active
   :principal/roles ["basic-user"] :principal/capabilities []})

(def credential
  {:principal-id "actor_passkey"
   :credential {:id "credential-id" :public-key "accepted-key" :counter 3
                :transports ["internal"] :device-type "singleDevice" :backed-up? false}})

(def challenge {:purpose :passkey-login :browser-hash "browser-digest" :expires-at 1500
                :private-ref "sealed-challenge"})
(def state {:principals {"actor_passkey" actor}
            :credentials {"passkey:credential-id" credential}
            :challenges {"challenge-id" challenge}})
(def input {:credential-id "credential-id" :expected-record credential
            :proof {:verified? true :counter 4} :user-handle nil :expected-user-handle "encoded-actor"
            :challenge-id "challenge-id" :browser-hash "browser-digest"
            :token "plaintext-response-only" :token-hash "session-digest"
            :issued-at 1000 :expires-at 2000})

(defn- refusal [snapshot request]
  (try (passkey/login-transition snapshot request) nil
       (catch :default cause (:code (ex-data cause)))))

(deftest login-atomically-consumes-proof-advances-counter-and-uses-current-principal
  (let [current (assoc actor :principal/roles ["editor"] :principal/display-name "Updated name")
        snapshot (assoc-in state [:principals "actor_passkey"] current)
        transaction (passkey/login-transition snapshot input)
        accepted (identity/apply-event snapshot {:event/data transaction})]
    (is (= transaction (passkey/login-transition snapshot input)))
    (is (= :passkey-login (:operation transaction)))
    (is (= "actor_passkey" (:actor transaction)))
    (is (= {:ok true :principal current :token "plaintext-response-only"} (:result transaction)))
    (is (= current (identity/principal-for-session accepted "session-digest" 1999)))
    (is (nil? (identity/principal-for-session accepted "session-digest" 2000)))
    (is (= (assoc-in credential [:credential :counter] 4)
           (get-in accepted [:credentials "passkey:credential-id"])))
    (is (nil? (get-in accepted [:challenges "challenge-id"])))
    (is (not (str/includes? (pr-str (:changes transaction)) "plaintext-response-only")))
    (is (= :invalid-credentials (refusal accepted input)))))

(deftest successful-signature-cannot-override-current-account-or-credential
  (doseq [snapshot [(assoc-in state [:principals "actor_passkey" :principal/status] :suspended)
                    (update state :principals dissoc "actor_passkey")
                    (update state :credentials dissoc "passkey:credential-id")
                    (assoc-in state [:credentials "passkey:credential-id" :principal-id] "another-actor")
                    (assoc-in state [:credentials "passkey:credential-id" :credential :public-key] "replaced-key")
                    (assoc-in state [:credentials "passkey:credential-id" :credential :counter] 4)]]
    (is (= :invalid-credentials (refusal snapshot input))))
  (doseq [request [(assoc input :expected-record nil)
                   (assoc input :proof {:verified? false})
                   (assoc input :user-handle "another-encoded-actor")
                   (assoc input :credential-id "another-credential")]]
    (is (= :invalid-credentials (refusal state request))))
  (is (= {:ok true :principal actor :token "plaintext-response-only"}
         (:result (passkey/login-transition state (assoc input :user-handle "encoded-actor"))))))

(deftest proof-consumption-rechecks-browser-purpose-expiry-and-replay
  (doseq [snapshot [(update state :challenges dissoc "challenge-id")
                    (assoc-in state [:challenges "challenge-id" :purpose] :passkey-enroll)
                    (assoc-in state [:challenges "challenge-id" :browser-hash] "other-browser")
                    (assoc-in state [:challenges "challenge-id" :expires-at] 1000)]]
    (is (= :invalid-challenge (refusal snapshot input))))
  (is (= :invalid-challenge (refusal state (assoc input :issued-at 1500 :expires-at 2500)))))

(deftest counters-advance-or-remain-unsupported-zero
  (doseq [counter [0 2 3]]
    (is (= :invalid-credentials (refusal state (assoc-in input [:proof :counter] counter)))))
  (let [zero-record (assoc-in credential [:credential :counter] 0)
        snapshot (assoc-in state [:credentials "passkey:credential-id"] zero-record)]
    (doseq [counter [0 1 4294967295]]
      (is (= counter
             (-> (identity/apply-event
                  snapshot {:event/data (passkey/login-transition
                                        snapshot (assoc input :expected-record zero-record
                                                        :proof {:verified? true :counter counter}))})
                 (get-in [:credentials "passkey:credential-id" :credential :counter])))))
    (let [request (assoc input :expected-record zero-record :proof {:verified? true :counter 0})
          accepted (identity/apply-event snapshot {:event/data (passkey/login-transition snapshot request)})]
      (is (= :invalid-challenge (refusal accepted request))))))

(deftest malformed-host-facts-and-session-collisions-cannot-mutate-state
  (doseq [request [(assoc input :expires-at 1000) (assoc input :token-hash "")
                   (dissoc input :issued-at) (assoc-in input [:proof :verified?] nil)
                   (assoc-in input [:proof :counter] -1) (assoc-in input [:proof :counter] 4294967296)
                   (assoc-in input [:proof :counter] 1.5)]]
    (is (= :invalid-passkey-admission (refusal state request))))
  (is (= :invalid-credentials (refusal state (assoc input :proof {:verified? true}))))
  (is (= :login-session-collision
         (refusal (assoc-in state [:sessions "session-digest"]
                            {:principal-id "another-actor" :expires-at 9999}) input))))
