(ns axxium.domain.identity-oauth
  "Pure selection of the one accepted ATProto client signing key."
  (:require [axxium.domain.identity :as identity]
            [axxium.law.identity-oauth :as law]))

(def client-key "The protected credential slot for the shared ATProto client." "system:atproto-client-key")

(defn select-client-key
  "Reuse the winner in the current transaction or accept one prepared reference."
  [state candidate-reference]
  (if-let [accepted (get-in state [:credentials client-key])]
    {:result (law/require-client-key-reference! (:private-ref accepted))}
    (let [reference (law/require-client-key-reference! candidate-reference)]
      {:operation :oauth-client-key-created
       :changes [(identity/put :credentials client-key {:private-ref reference})]
       :result reference})))
