(ns axxium.domain.identity-credentials
  "Pure ownership, recent-authentication and last-method guards for credential removal."
  (:require [axxium.domain.identity :as identity]
            [axxium.law.identity :as law]
            [clojure.string :as str]))

(def freshness-ms (* 15 60 1000))

(defn fresh? [session now]
  (let [issued (:issued-at session)]
    (and (number? issued) (<= 0 (- now issued) freshness-ms))))

(defn- actor! [state token-hash now]
  (let [actor (identity/principal-for-session state token-hash now)]
    (law/require! actor :unauthenticated "Authentication required")
    actor))

(defn- credential-entry [actor [key record]]
  (when (= (:principal/id actor) (:principal-id record))
    (let [[method label]
          (cond
            (str/starts-with? key "password:") ["password" "Password"]
            (str/starts-with? key "pgp:") ["pgp" (str "PGP " (subs key 4))]
            (str/starts-with? key "passkey:") ["passkey" (str "Passkey " (subs key 8))])]
      (when method
        {:id (str "credential:" key) :method method :label label
         :collection :credentials :key key}))))

(defn- external-entry [actor available-issuers [key record]]
  (when (= (:principal/id actor) (:principal-id record))
    (let [issuer (:issuer record)
          [method label] (get {"https://github.com" ["github" "GitHub"]
                              "https://discord.com" ["discord" "Discord"]
                              "https://accounts.google.com" ["google" "Google"]
                              "atproto" ["atproto" "Bluesky / ATProto"]}
                             issuer ["oauth" issuer])]
      {:id (str "identity:" key) :method method :label label
       :available? (contains? available-issuers issuer)
       :collection :identities :key key})))

(defn- entries [state actor available-issuers]
  (let [entries (vec (concat (keep #(credential-entry actor %) (:credentials state))
                             (keep #(external-entry actor available-issuers %) (:identities state))))
        available? #(or (= :credentials (:collection %)) (:available? %))
        bootstrap-id (get-in state [:credentials "system:bootstrap" :principal-id])]
    (mapv (fn [entry]
            (let [reason (cond
                           (and (= "password" (:method entry)) (= bootstrap-id (:principal/id actor))) "managed-bootstrap"
                           (not-any? #(and (not= (:id entry) (:id %)) (available? %)) entries) "last-login-method")]
              (cond-> (assoc entry :revocable (nil? reason)) reason (assoc :blockedReason reason))))
          (sort-by (juxt :method :id) entries))))

(defn inventory [state token-hash now available-issuers]
  (let [actor (actor! state token-hash now)]
    {:credentials (mapv #(dissoc % :collection :key :available?) (entries state actor available-issuers))
     :reauthenticationRequired (not (fresh? (get-in state [:sessions token-hash]) now))}))

(defn revoke-transition [state token-hash now credential-id available-issuers]
  (let [actor (actor! state token-hash now)
        actor-id (:principal/id actor)
        _ (law/require! (fresh? (get-in state [:sessions token-hash]) now)
                        :reauthentication-required "Sign in again to manage credentials")
        entry (first (filter #(= credential-id (:id %)) (entries state actor available-issuers)))]
    (law/require! entry :credential-not-found "Sign-in method was not found")
    (when-let [reason (:blockedReason entry)]
      (throw (ex-info (if (= reason "managed-bootstrap")
                        "The server-managed bootstrap password cannot be removed here"
                        "Add another sign-in method before removing this one")
                      {:code (keyword reason)})))
    {:operation :credential-revoked :actor actor-id
     :changes (into [(identity/remove-entry (:collection entry) (:key entry))]
                    (keep (fn [[key session]]
                            (when (= actor-id (:principal-id session))
                              (identity/remove-entry :sessions key))) (:sessions state)))
     :result {:ok true :reauthenticate true}}))
