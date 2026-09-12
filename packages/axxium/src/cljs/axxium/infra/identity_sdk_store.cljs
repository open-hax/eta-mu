(ns axxium.infra.identity-sdk-store
  "Local ATProto SDK storage retries never repeat a provider token exchange."
  (:require [axxium.domain.identity-private :as private-domain]
            [axxium.extern.identity-host :as host]
            [axxium.infra.identity-admission :as admission]
            [axxium.infra.identity-ceremonies :as ceremonies]
            [axxium.infra.identity-private :as private]
            [axxium.infra.identity-store :as store]))

(defn private-store
  "Persist SDK sessions with atomic reads and scoped post-admission blob reclamation."
  [identity-store prefix]
  {:get! (fn ^:async get-private [key]
           (await (admission/retry! #(store/read-private-value identity-store (str prefix key)))))
   :put! (fn ^:async put-private [key value]
           (let [reference (store/seal! identity-store value)]
             (await
              (private/with-prepared!
               identity-store reference
               (fn ^:async admit-prepared []
                 (let [result (await (admission/retry!
                                      #(store/transact! identity-store
                                                        (fn [state]
                                                          (private-domain/replace-transition state (str prefix key) reference)))))]
                   (await (private/cleanup! identity-store [(:retired-reference result)]))
                   nil))))))
   :delete! (fn ^:async delete-private [key]
              (let [result (await (admission/retry!
                                   #(store/transact! identity-store
                                                     (fn [state]
                                                       (private-domain/delete-transition state (str prefix key))))))]
                (await (private/cleanup! identity-store [(:retired-reference result)]))
                nil))})

(defn pending-store
  "Bounded SDK authorization state, including retry-safe local consumption."
  [identity-store ttl-ms]
  {:get! (fn [key] (ceremonies/private-value identity-store (str "atproto-state:" key)))
   :put! (fn ^:async put-pending [key value]
           (await (admission/retry! #(ceremonies/issue! identity-store (str "atproto-state:" key) (host/sha256 key)
                                              :atproto/pending value ttl-ms))))
   :delete! (fn ^:async delete-pending [key]
              (await (admission/retry! #(ceremonies/remove! identity-store (str "atproto-state:" key)))))})
