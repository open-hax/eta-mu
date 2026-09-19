(ns axxium.law.identity-credentials
  "Public credential-management inputs; no secret material belongs in these shapes."
  (:require [axxium.law.identity :as identity]
            [malli.core :as m]))

(def RevokeRequest
  [:map {:closed true} [:credentialId [:string {:min 1 :max 4096}]]])

(defn require-revoke! [request]
  (identity/require! (m/validate RevokeRequest request) :invalid-credential-request
                    "Select a sign-in method to remove")
  request)
