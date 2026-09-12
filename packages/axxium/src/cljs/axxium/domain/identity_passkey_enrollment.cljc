(ns axxium.domain.identity-passkey-enrollment
  "Pure passkey enrollment with current session and challenge admission."
  (:require [axxium.domain.identity :as identity]
            [axxium.domain.identity-credential-admission :as admission]
            [axxium.law.identity :as law]
            [axxium.law.identity-passkey-enrollment :as enrollment-law]))

(defn transition
  "Admit one verified registration without replacing any existing credential."
  [state input]
  (let [{:keys [actor-id proof challenge-id now]} (enrollment-law/validate! input)
        credential (:credential proof)
        credential-id (:id credential)
        credential-key (str "passkey:" credential-id)]
    (law/require! (and (:verified? proof) credential)
                  :invalid-credentials "Invalid passkey registration proof")
    (admission/require-enrollment-authority! state input)
    (admission/require-challenge! state input :passkey-enroll now)
    (law/require! (not (contains? (:credentials state) credential-key))
                  :credential-exists "Credential already registered")
    {:operation :passkey-enrolled :actor actor-id
     :changes [(identity/remove-entry :challenges challenge-id)
               (identity/put :credentials credential-key {:principal-id actor-id :credential credential})]
     :result {:ok true :credential-id credential-id}}))
