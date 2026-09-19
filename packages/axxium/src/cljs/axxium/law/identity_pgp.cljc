(ns axxium.law.identity-pgp
  "Explicit verified PGP proof and host facts admitted by pure identity transitions."
  (:require [axxium.law.identity :as identity]
            [axxium.law.identity-credential-admission :as admission]))

(def Proof
  "The crypto adapter returns the complete verified primary-key fingerprint."
  [:map [:verified? :boolean] [:fingerprint {:optional true} [:string {:min 1}]]])

(def proof-fields
  "A fingerprint identifies the credential and must match the verified proof."
  [[:fingerprint [:string {:min 1}]] [:proof Proof]])

(def LoginAdmission
  "Login rechecks the exact credential used to verify the signed challenge."
  (into [:map {:closed true}]
        (concat admission/challenge-fields admission/session-fields proof-fields
                [[:expected-record [:maybe [:map [:principal-id [:string {:min 1}]]
                                           [:private-ref [:string {:min 1}]]]]]])))

(def EnrollmentAdmission
  "Enrollment binds a newly sealed public key to the captured session authority."
  (into [:map {:closed true}]
        (concat admission/challenge-fields admission/enrollment-fields proof-fields
                [[:private-ref [:string {:min 1}]]])))

(defn validate-login!
  "Require complete proof and a forward absolute session interval."
  [input]
  (admission/validate! LoginAdmission input :invalid-pgp-admission)
  (identity/require! (> (:expires-at input) (:issued-at input))
                    :invalid-pgp-admission "Login session must expire after issuance")
  input)

(defn validate-enrollment!
  "Require explicit authority, proof and sealed-reference facts."
  [input]
  (admission/validate! EnrollmentAdmission input :invalid-pgp-admission))
