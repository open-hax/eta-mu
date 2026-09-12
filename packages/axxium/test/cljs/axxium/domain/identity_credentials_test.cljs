(ns axxium.domain.identity-credentials-test
  (:require [axxium.domain.identity :as identity]
            [axxium.domain.identity-credentials :as credentials]
            [cljs.test :refer [deftest is]]))

(def now 1000000)
(def actor {:principal/id "alice" :principal/status :active})
(def state
  {:principals {"alice" actor "bob" {:principal/id "bob" :principal/status :active}}
   :credentials {"password:alice" {:principal-id "alice" :private-ref "secret-reference"}
                 "pgp:ALICE" {:principal-id "alice" :private-ref "private-key-reference"}
                 "password:bob" {:principal-id "bob" :private-ref "bob-secret"}
                 "atproto-session:internal" {:private-ref "provider-tokens"}}
   :sessions {"current" {:principal-id "alice" :issued-at now :expires-at (+ now 86400000)}
              "other" {:principal-id "alice" :issued-at now :expires-at (+ now 86400000)}
              "bob" {:principal-id "bob" :issued-at now :expires-at (+ now 86400000)}}})

(defn- refusal [state id]
  (try (credentials/revoke-transition state "current" now id #{}) nil
       (catch :default error (:code (ex-data error)))))

(deftest inventory-is-public-and-owned
  (let [inventory (credentials/inventory state "current" now #{})]
    (is (= #{"credential:password:alice" "credential:pgp:ALICE"}
           (set (map :id (:credentials inventory)))))
    (is (false? (:reauthenticationRequired inventory)))
    (is (every? #(= #{:id :method :label :revocable} (set (keys %))) (:credentials inventory)))
    (is (= :credential-not-found (refusal state "credential:password:bob")))))

(deftest revocation-is-one-transition-and-rechecks-current-authority
  (let [transaction (credentials/revoke-transition state "current" now "credential:pgp:ALICE" #{})
        next (identity/apply-event state {:event/data transaction})]
    (is (= {:ok true :reauthenticate true} (:result transaction)))
    (is (nil? (get-in next [:credentials "pgp:ALICE"])))
    (is (some? (get-in next [:credentials "password:alice"])))
    (is (= #{"bob"} (set (keys (:sessions next)))))
    (is (= :unauthenticated (refusal next "credential:password:alice"))))
  (is (= :unauthenticated
         (refusal (assoc-in state [:principals "alice" :principal/status] :suspended) "credential:pgp:ALICE"))))

(deftest freshness-never-infers-an-issued-time-from-expiry
  (doseq [issued [nil (- now (inc credentials/freshness-ms)) (inc now) "1000000"]]
    (let [state (assoc-in state [:sessions "current" :issued-at] issued)]
      (is (:reauthenticationRequired (credentials/inventory state "current" now #{})))
      (is (= :reauthentication-required (refusal state "credential:pgp:ALICE")))))
  (is (credentials/fresh? {:issued-at (- now credentials/freshness-ms)} now)))

(deftest last-method-and-managed-bootstrap-cannot-be-removed
  (let [only-password (update state :credentials dissoc "pgp:ALICE")
        bootstrap (assoc-in state [:credentials "system:bootstrap"] {:principal-id "alice"})]
    (is (= :last-login-method (refusal only-password "credential:password:alice")))
    (is (= :managed-bootstrap (refusal bootstrap "credential:password:alice")))
    (is (= "managed-bootstrap"
           (:blockedReason (first (filter #(= "password" (:method %))
                                          (:credentials (credentials/inventory bootstrap "current" now #{}))))))))
  (is (= :last-login-method
         (refusal (update state :credentials dissoc "password:alice") "credential:pgp:ALICE"))))

(deftest unavailable-provider-binding-cannot-be-the-only-remaining-login
  (let [issuer "https://github.com"
        key (pr-str [issuer "alice-provider"])
        linked (-> state
                   (update :credentials dissoc "pgp:ALICE")
                   (assoc-in [:identities key] {:principal-id "alice" :issuer issuer :subject "alice-provider"}))
        password-id "credential:password:alice"
        external-id (str "identity:" key)]
    (is (= :last-login-method (refusal linked password-id)))
    (is (= {:ok true :reauthenticate true}
           (:result (credentials/revoke-transition linked "current" now password-id #{issuer}))))
    (is (= {:ok true :reauthenticate true}
           (:result (credentials/revoke-transition linked "current" now external-id #{}))))
    (let [inventory (:credentials (credentials/inventory linked "current" now #{}))]
      (is (= 2 (count inventory)) "Unavailable bindings remain visible for removal")
      (is (false? (:revocable (first (filter #(= password-id (:id %)) inventory)))))
      (is (:revocable (first (filter #(= external-id (:id %)) inventory)))))))
