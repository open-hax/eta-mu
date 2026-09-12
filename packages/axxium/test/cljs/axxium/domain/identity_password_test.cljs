(ns axxium.domain.identity-password-test
  (:require [axxium.domain.identity :as identity]
            [axxium.domain.identity-password :as password]
            [cljs.test :refer [deftest is]]
            [clojure.string :as str]))

(def actor
  {:principal/id "actor_password" :principal/entity-id "entity_password"
   :principal/kind :human :principal/username "password-user"
   :principal/display-name "Password user" :principal/status :active
   :principal/roles ["basic-user"] :principal/capabilities []})

(def credential {:principal-id "actor_password" :private-ref "sealed-password"})
(def state {:principals {"actor_password" actor} :credentials {"password:actor_password" credential}})
(def input {:actor-id "actor_password" :expected-record credential :verified? true
            :token "plaintext-response-only" :token-hash "prepared-session-digest"
            :issued-at 1000 :expires-at 2000})

(defn- refusal [snapshot request]
  (try (password/login-transition snapshot request) nil
       (catch :default cause (:code (ex-data cause)))))

(deftest login-transition-is-pure-and-uses-the-current-principal
  (let [current (assoc actor :principal/roles ["editor"] :principal/display-name "Updated name")
        snapshot (assoc-in state [:principals "actor_password"] current)
        transaction (password/login-transition snapshot input)
        accepted (identity/apply-event snapshot {:event/data transaction})]
    (is (= transaction (password/login-transition snapshot input)))
    (is (= {:ok true :principal current :token "plaintext-response-only"} (:result transaction)))
    (is (= current (identity/principal-for-session accepted "prepared-session-digest" 1999)))
    (is (nil? (identity/principal-for-session accepted "prepared-session-digest" 2000)))
    (is (= credential (get-in accepted [:credentials "password:actor_password"])))
    (is (not (str/includes? (pr-str (:changes transaction)) "plaintext-response-only")))))

(deftest successful-verification-cannot-override-current-identity-or-credential
  (doseq [snapshot [(assoc-in state [:principals "actor_password" :principal/status] :suspended)
                     (update state :principals dissoc "actor_password")
                     (update state :credentials dissoc "password:actor_password")
                     (assoc-in state [:credentials "password:actor_password" :private-ref] "replaced-password")]]
    (is (= :invalid-credentials (refusal snapshot input))))
  (doseq [request [(assoc input :verified? false) (assoc input :expected-record nil)
                    (assoc-in input [:expected-record :principal-id] "another-actor")]]
    (is (= :invalid-credentials (refusal state request)))))

(deftest login-refuses-malformed-host-values-and-existing-session-identities
  (doseq [request [(assoc input :expires-at 1000) (assoc input :token-hash "")
                    (dissoc input :issued-at) (assoc input :verified? nil)]]
    (is (= :invalid-login-admission (refusal state request))))
  (is (= :login-session-collision
         (refusal (assoc-in state [:sessions "prepared-session-digest"]
                            {:principal-id "another-actor" :expires-at 9999}) input))))
