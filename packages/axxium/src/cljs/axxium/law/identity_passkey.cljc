(ns axxium.law.identity-passkey
  "Verified WebAuthn facts and host values supplied to pure session admission."
  (:require [axxium.law.identity :as identity]
            [malli.core :as m]))

(def SignatureCounter
  "WebAuthn counters are unsigned 32-bit values, including unsupported zero."
  [:and :int [:>= 0] [:<= 4294967295]])

(def LoginAdmission
  "Host cryptography, encoding, randomness, hashing and time are explicit inputs."
  [:map {:closed true}
   [:credential-id [:string {:min 1}]]
   [:expected-record [:maybe :map]]
   [:proof [:map [:verified? :boolean] [:counter {:optional true} SignatureCounter]]]
   [:user-handle [:maybe :string]]
   [:expected-user-handle [:string {:min 1}]]
   [:challenge-id [:string {:min 1}]]
   [:browser-hash [:string {:min 1}]]
   [:token [:string {:min 1}]]
   [:token-hash [:string {:min 1}]]
   [:issued-at [:and :int [:>= 0]]]
   [:expires-at [:and :int [:> 0]]]])

(defn valid-counter?
  "Describe the signature counter independently of a host WebAuthn implementation."
  [counter]
  (m/validate SignatureCounter counter))

(defn validate-admission!
  "Reject malformed proof and session inputs before deciding current-state policy."
  [input]
  (identity/require! (and (m/validate LoginAdmission input) (> (:expires-at input) (:issued-at input)))
                    :invalid-passkey-admission "Invalid passkey login admission inputs")
  input)
