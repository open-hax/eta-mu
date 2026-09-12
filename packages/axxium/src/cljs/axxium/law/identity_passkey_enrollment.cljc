(ns axxium.law.identity-passkey-enrollment
  "Verified WebAuthn enrollment facts with explicit current authority inputs."
  (:require [axxium.law.identity-credential-admission :as admission]
            [axxium.law.identity-passkey :as passkey]))

(def Credential
  "Serializable public credential returned by the WebAuthn registration adapter."
  [:map
   [:id [:string {:min 1}]]
   [:public-key [:string {:min 1}]]
   [:counter passkey/SignatureCounter]
   [:transports [:vector :string]]
   [:device-type :string]
   [:backed-up? :boolean]])

(def EnrollmentAdmission
  "The host verifies cryptography; the transaction decides whether it may be admitted."
  (into [:map {:closed true}]
        (concat admission/challenge-fields admission/enrollment-fields
                [[:proof [:map [:verified? :boolean] [:credential {:optional true} Credential]]]])))

(defn validate!
  "Require complete shaped authority and credential facts before admission."
  [input]
  (admission/validate! EnrollmentAdmission input :invalid-passkey-admission))
