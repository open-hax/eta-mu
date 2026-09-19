(ns axxium.domain.identity-password
  "Pure session admission against the currently accepted password credential."
  (:require [axxium.domain.identity :as identity]
            [axxium.law.identity :as law]
            [axxium.law.identity-password :as password-law]))

(defn login-transition
  "Recheck current identity and credential, then describe one session and response."
  [state input]
  (let [{:keys [actor-id expected-record verified? token token-hash issued-at expires-at]}
        (password-law/validate-admission! input)
        current (get-in state [:principals actor-id])]
    (law/require! (and verified? expected-record (law/active? current)
                       (= actor-id (:principal-id expected-record))
                       (= expected-record (get-in state [:credentials (str "password:" actor-id)])))
                  :invalid-credentials "Invalid username or password; credentials may have changed")
    (law/require! (not (get-in state [:sessions token-hash]))
                  :login-session-collision "Login cannot replace an existing session")
    {:operation :login :actor actor-id
     :changes [(identity/put :sessions token-hash
                             {:principal-id actor-id :issued-at issued-at :expires-at expires-at})]
     :result {:ok true :principal current :token token}}))
