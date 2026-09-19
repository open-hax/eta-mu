(ns axxium.law.identity-external
  "Explicit verified facts and generated values for external identity admission."
  (:require [axxium.law.identity :as identity]
            [malli.core :as m]))

(def VerifiedIdentity
  "Provider-verified issuer and immutable subject; email conveys no linking authority."
  [:map
   [:issuer [:string {:min 1}]] [:subject [:string {:min 1}]]
   [:email {:optional true} [:maybe :string]]
   [:display-name {:optional true} [:maybe :string]]])

(def ExternalAdmission
  "Host effects supplied to the pure transition; secrets are never projected."
  [:map {:closed true}
   [:verified VerifiedIdentity]
   [:challenge-id [:string {:min 1}]] [:purpose :keyword]
   [:browser-hash [:string {:min 1}]]
   [:challenge-record :map] [:challenge-data :map]
   [:actor identity/Principal]
   [:token [:string {:min 1}]] [:token-hash [:string {:min 1}]]
   [:issued-at [:and :int [:>= 0]]] [:expires-at [:and :int [:> 0]]]])

(defn validate-admission!
  "Reject malformed effect inputs before applying identity ownership policy."
  [input]
  (identity/require! (m/validate VerifiedIdentity (:verified input))
                     :invalid-provider-identity "Provider returned an invalid verified identity")
  (identity/require! (m/validate ExternalAdmission input)
                     :invalid-external-admission "Invalid external identity admission inputs")
  input)
