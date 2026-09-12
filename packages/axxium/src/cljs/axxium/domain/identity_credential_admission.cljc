(ns axxium.domain.identity-credential-admission
  "Current challenge and enrollment authority decisions shared by credential methods."
  (:require [axxium.domain.identity :as identity]
            [axxium.law.identity :as law]
            [axxium.law.identity-credential-admission :as admission-law]))

(defn require-challenge!
  "Accept only the immutable ceremony identity whose private bytes were verified."
  [state {:keys [challenge-id browser-hash expected-challenge]} purpose now]
  (let [current (identity/require-challenge! state challenge-id purpose browser-hash now)
        identity-keys admission-law/challenge-identity-keys]
    (law/require! (= (select-keys expected-challenge identity-keys)
                     (select-keys current identity-keys))
                  :invalid-challenge "Authentication challenge changed during verification")
    current))

(defn require-enrollment-authority!
  "Recheck the exact captured session and its current active enrollment owner."
  [state {:keys [actor-id session-hash expected-session challenge-principal-id now]}]
  (let [current (identity/principal-for-session state session-hash now)]
    (law/require! (and (= expected-session (get-in state [:sessions session-hash]))
                       (= actor-id (:principal-id expected-session))
                       (= actor-id (:principal/id current)))
                  :unauthenticated "Enrollment session or identity changed during verification")
    (law/require! (= actor-id challenge-principal-id)
                  :invalid-challenge "Enrollment challenge belongs to another account")
    current))
