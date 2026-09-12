(ns axxium.infra.identity-sdk-store
  "Local ATProto SDK storage retries never repeat a provider token exchange."
  (:require [axxium.domain.identity :as domain]
            [axxium.extern.identity-host :as host]
            [axxium.infra.identity-admission :as admission]
            [axxium.infra.identity-ceremonies :as ceremonies]
            [axxium.infra.identity-store :as store]))

(defn private-store
  "Persist SDK sessions privately; prepare one immutable blob before retrying admission."
  [identity-store prefix]
  {:get! (fn [key]
           (when-let [record (get-in (store/state identity-store) [:credentials (str prefix key)])]
             (store/unseal identity-store (:private-ref record))))
   :put! (fn ^:async put-private [key value]
           (let [reference (store/seal! identity-store value)]
             (await (admission/retry! #(store/transact!
                             identity-store
                             (fn [_] {:operation :oauth-private-state
                                      :changes [(domain/put :credentials (str prefix key) {:private-ref reference})]}))))))
   :delete! (fn ^:async delete-private [key]
              (await (admission/retry! #(store/transact!
                               identity-store
                               (fn [state] {:operation :oauth-private-state-deleted
                                            :changes (when (get-in state [:credentials (str prefix key)])
                                                       [(domain/remove-entry :credentials (str prefix key))])})))))})

(defn pending-store
  "Bounded SDK authorization state, including retry-safe local consumption."
  [identity-store ttl-ms]
  {:get! (fn [key] (ceremonies/private-value identity-store (str "atproto-state:" key)))
   :put! (fn ^:async put-pending [key value]
           (await (admission/retry! #(ceremonies/issue! identity-store (str "atproto-state:" key) (host/sha256 key)
                                              :atproto/pending value ttl-ms))))
   :delete! (fn ^:async delete-pending [key]
              (await (admission/retry! #(ceremonies/remove! identity-store (str "atproto-state:" key)))))})
