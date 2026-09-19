(ns axxium.domain.identity-external
  "Pure issuer/subject ownership and atomic external login/linking transitions."
  (:require [axxium.domain.identity :as identity]
            [axxium.law.identity :as law]
            [axxium.law.identity-external :as external-law]
            [axxium.shape.identity :as shape]))

(defn accept-transition
  "Recheck the challenge, current linking session and binding in one admission.

  Provider verification and host-generated IDs, hashes and time are inputs.
  Matching email never selects an actor or creates an email login alias."
  [state input]
  (let [{:keys [verified challenge-id purpose browser-hash challenge-record
                challenge-data actor token token-hash issued-at expires-at]}
        (external-law/validate-admission! input)
        {:keys [issuer subject email]} verified
        current-challenge (identity/require-challenge! state challenge-id purpose browser-hash issued-at)
        _ (law/require! (= challenge-record current-challenge)
                        :invalid-challenge "Authentication challenge changed during verification")
        _ (law/require! (> expires-at issued-at) :invalid-external-admission "Session must expire after issuance")
        binding-key (pr-str [issuer subject])
        binding (get-in state [:identities binding-key])
        link-id (:link-principal-id challenge-data)
        existing-id (or link-id (:principal-id binding))
        existing (get-in state [:principals existing-id])
        selected (if existing-id existing actor)
        actor-id (:principal/id selected)]
    (when link-id
      (law/require! (= link-id (:principal/id (identity/principal-for-session
                                               state (:link-session-hash challenge-data) issued-at)))
                    :unauthenticated "Linking session expired")
      (law/require! (or (nil? binding) (= link-id (:principal-id binding)))
                    :identity-already-linked "This external identity belongs to another account"))
    (when binding
      (law/require! (and (= issuer (:issuer binding)) (= subject (:subject binding))
                         (string? (:principal-id binding)))
                    :invalid-credentials "External identity binding is invalid"))
    (law/require! (law/active? selected) :invalid-credentials "Identity is not active")
    (when-not existing-id
      (law/require! (and (= :human (:principal/kind actor))
                         (= ["basic-user"] (:principal/roles actor))
                         (empty? (:principal/capabilities actor))
                         (nil? (:principal/email actor))
                         (law/valid-username? (:principal/username actor)))
                    :invalid-external-principal "External signup requires a basic human identity")
      (law/require! (not (or (get-in state [:principals actor-id])
                             (get-in state [:aliases (:principal/username actor)])))
                    :external-identity-collision "Generated external identity is already claimed"))
    (law/require! (nil? (get-in state [:sessions token-hash]))
                  :external-identity-collision "Generated session is already claimed")
    {:operation (if link-id :external-identity-linked :external-login) :actor actor-id
     :changes (into [(identity/remove-entry :challenges challenge-id)]
                    (concat (when-not existing-id
                              [(identity/put :principals actor-id selected)
                               (identity/put :aliases (:principal/username selected) {:principal-id actor-id})])
                            [(identity/put :identities binding-key
                                           (cond-> {:principal-id actor-id :issuer issuer :subject subject}
                                             (law/valid-email? email) (assoc :provider-email email)))
                             (identity/put :sessions token-hash {:principal-id actor-id :issued-at issued-at
                                                                 :expires-at expires-at})]))
     :result {:ok true :principal selected :token token
              :redirect (shape/safe-redirect (:redirect challenge-data))}}))
