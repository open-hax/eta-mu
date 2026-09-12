(ns axxium.law.identity-password
  "Explicit host facts required by the pure password-login decision."
  (:require [axxium.law.identity :as identity]
            [malli.core :as m]))

(def LoginAdmission
  [:map {:closed true}
   [:actor-id [:maybe :string]]
   [:expected-record [:maybe :map]]
   [:verified? :boolean]
   [:token [:string {:min 1}]]
   [:token-hash [:string {:min 1}]]
   [:issued-at [:and :int [:>= 0]]]
   [:expires-at [:and :int [:> 0]]]])

(defn validate-admission!
  "Validate supplied login inputs without reading credentials or producing host values."
  [input]
  (identity/require! (and (m/validate LoginAdmission input) (> (:expires-at input) (:issued-at input)))
                    :invalid-login-admission "Invalid password login admission inputs")
  input)
