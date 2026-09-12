(ns axxium.domain.identity-pgp
  "Pure PGP credential enrollment and single-use login admission."
  (:require [axxium.domain.identity :as identity]
            [axxium.domain.identity-credential-admission :as admission]
            [axxium.law.identity :as law]
            [axxium.law.identity-pgp :as pgp-law]))

(defn- require-proof! [{:keys [fingerprint proof]}]
  (law/require! (and (:verified? proof) (= fingerprint (:fingerprint proof)))
                :invalid-credentials "PGP proof does not match the requested credential"))

(defn login-transition
  "Consume one current proof and admit a session only for its current credential owner."
  [state input]
  (let [{:keys [fingerprint expected-record challenge-id token token-hash issued-at expires-at]}
        (pgp-law/validate-login! input)
        credential-key (str "pgp:" fingerprint)
        actor-id (:principal-id expected-record)
        current (get-in state [:principals actor-id])]
    (require-proof! input)
    (law/require! (and expected-record (seq (:private-ref expected-record))
                       (law/active? current) (= actor-id (:principal/id current))
                       (= expected-record (get-in state [:credentials credential-key])))
                  :invalid-credentials "PGP credential or identity changed during verification")
    (admission/require-challenge! state input :pgp-login issued-at)
    (law/require! (not (contains? (:sessions state) token-hash))
                  :login-session-collision "Login cannot replace an existing session")
    {:operation :pgp-login :actor actor-id
     :changes [(identity/remove-entry :challenges challenge-id)
               (identity/put :sessions token-hash
                             {:principal-id actor-id :issued-at issued-at :expires-at expires-at})]
     :result {:ok true :principal current :token token}}))

(defn enrollment-transition
  "Bind the verified key only while the original session and challenge remain authoritative."
  [state input]
  (let [{:keys [actor-id fingerprint private-ref challenge-id now]}
        (pgp-law/validate-enrollment! input)
        credential-key (str "pgp:" fingerprint)]
    (require-proof! input)
    (admission/require-enrollment-authority! state input)
    (admission/require-challenge! state input :pgp-enroll now)
    (law/require! (not (contains? (:credentials state) credential-key))
                  :credential-exists "Key already registered")
    {:operation :pgp-enrolled :actor actor-id
     :changes [(identity/remove-entry :challenges challenge-id)
               (identity/put :credentials credential-key {:principal-id actor-id :private-ref private-ref})]
     :result {:ok true :fingerprint fingerprint}}))
