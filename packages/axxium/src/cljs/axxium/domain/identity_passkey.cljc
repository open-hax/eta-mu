(ns axxium.domain.identity-passkey
  "Pure passkey proof consumption, credential counter and session admission."
  (:require [axxium.domain.identity :as identity]
            [axxium.law.identity :as law]
            [axxium.law.identity-passkey :as passkey-law]))

(defn login-transition
  "Admit verified host facts only against the current account, credential and proof.

  A counter may remain zero only when the authenticator does not support it;
  otherwise the accepted assertion must advance it. All changes commit together."
  [state input]
  (let [{:keys [credential-id expected-record proof user-handle expected-user-handle
                challenge-id browser-hash token token-hash issued-at expires-at]}
        (passkey-law/validate-admission! input)
        key (str "passkey:" credential-id)
        actor-id (:principal-id expected-record)
        current (get-in state [:principals actor-id])
        previous-counter (get-in expected-record [:credential :counter])
        counter (:counter proof)]
    (law/require! (and (:verified? proof) expected-record (law/active? current)
                       (= actor-id (:principal/id current))
                       (= credential-id (get-in expected-record [:credential :id]))
                       (= expected-record (get-in state [:credentials key]))
                       (or (nil? user-handle) (= expected-user-handle user-handle))
                       (passkey-law/valid-counter? previous-counter)
                       (passkey-law/valid-counter? counter)
                       (or (and (zero? previous-counter) (zero? counter)) (> counter previous-counter)))
                  :invalid-credentials "Invalid passkey proof or credential changed during authentication")
    (identity/require-challenge! state challenge-id :passkey-login browser-hash issued-at)
    (law/require! (not (get-in state [:sessions token-hash]))
                  :login-session-collision "Login cannot replace an existing session")
    {:operation :passkey-login :actor actor-id
     :changes [(identity/remove-entry :challenges challenge-id)
               (identity/put :credentials key (assoc-in expected-record [:credential :counter] counter))
               (identity/put :sessions token-hash
                             {:principal-id actor-id :issued-at issued-at :expires-at expires-at})]
     :result {:ok true :principal current :token token}}))
