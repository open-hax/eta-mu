(ns axxium.domain.identity-external-test
  (:require [axxium.domain.identity :as identity]
            [axxium.domain.identity-external :as external]
            [cljs.test :refer [deftest is]]
            [clojure.string :as str]))

(def actor
  {:principal/id "actor_new" :principal/entity-id "entity_new"
   :principal/kind :human :principal/username "member-new"
   :principal/display-name "New member" :principal/status :active
   :principal/roles ["basic-user"] :principal/capabilities []})

(def challenge {:purpose :oauth/github :browser-hash "browser-hash"
                :private-ref "sealed-challenge" :expires-at 2000})
(def state {:challenges {"proof" challenge}})
(def input
  {:verified {:issuer "https://github.com" :subject "100" :email "same@example.test"}
   :challenge-id "proof" :purpose :oauth/github :browser-hash "browser-hash"
   :challenge-record challenge :challenge-data {:redirect "https://untrusted.example/"}
   :actor actor :token "opaque-session-secret" :token-hash "new-session"
   :issued-at 1000 :expires-at 5000})

(def binding-key (pr-str ["https://github.com" "100"]))
(def local-actor (assoc actor :principal/id "actor_local" :principal/entity-id "entity_local"
                            :principal/username "local" :principal/email "same@example.test"))
(def local-state (assoc state :principals {"actor_local" local-actor}
                             :aliases {"same@example.test" {:principal-id "actor_local"}}
                             :sessions {"link-session" {:principal-id "actor_local" :issued-at 900 :expires-at 1500}}))
(def link-input (assoc input :challenge-data {:link-principal-id "actor_local"
                                              :link-session-hash "link-session" :redirect "/settings"}))

(defn- refusal [current request]
  (try (external/accept-transition current request) nil
       (catch :default cause (:code (ex-data cause)))))

(defn- projected [current transaction]
  (identity/apply-event current {:event/data transaction}))

(deftest external-signup-is-pure-atomic-and-never-claims-an-email-alias
  (let [tx (external/accept-transition local-state input)
        after (projected local-state tx)]
    (is (= tx (external/accept-transition local-state input)))
    (is (= :external-login (:operation tx)))
    (is (= "actor_new" (:actor tx)))
    (is (= "actor_local" (get-in after [:aliases "same@example.test" :principal-id])))
    (is (= "actor_new" (get-in after [:identities binding-key :principal-id])))
    (is (= "same@example.test" (get-in after [:identities binding-key :provider-email])))
    (is (nil? (get-in after [:principals "actor_new" :principal/email])))
    (is (nil? (get-in after [:challenges "proof"])))
    (is (= {:principal-id "actor_new" :issued-at 1000 :expires-at 5000}
           (get-in after [:sessions "new-session"])))
    (is (= "/" (get-in tx [:result :redirect])))
    (is (not (str/includes? (pr-str (:changes tx)) "opaque-session-secret")))
    (is (= :invalid-challenge (refusal after input)))))

(deftest linking-rechecks-current-session-and-binding-ownership
  (let [tx (external/accept-transition local-state link-input)
        after (projected local-state tx)]
    (is (= :external-identity-linked (:operation tx)))
    (is (= "actor_local" (:actor tx)))
    (is (= 1 (count (:principals after))))
    (is (= "/settings" (get-in tx [:result :redirect])))
    (is (= "actor_local" (get-in after [:identities binding-key :principal-id]))))
  (doseq [current [(assoc local-state :sessions {})
                    (assoc-in local-state [:sessions "link-session" :expires-at] 1000)
                    (assoc-in local-state [:principals "actor_local" :principal/status] :suspended)
                    (assoc-in local-state [:sessions "link-session" :principal-id] "someone-else")]]
    (is (= :unauthenticated (refusal current link-input))))
  (is (= :identity-already-linked
         (refusal (assoc-in local-state [:identities binding-key]
                            {:issuer "https://github.com" :subject "100" :principal-id "another"}) link-input))))

(deftest bound-login-reuses-active-actor-without-claiming-new-generated-identity
  (let [current (assoc-in local-state [:identities binding-key]
                           {:issuer "https://github.com" :subject "100" :principal-id "actor_local"})
        tx (external/accept-transition current input)
        after (projected current tx)]
    (is (= "actor_local" (:actor tx)))
    (is (= 1 (count (:principals after))))
    (is (= local-actor (get-in tx [:result :principal])))
    (is (= :invalid-credentials (refusal (assoc current :principals {}) input)))
    (is (= :invalid-credentials
           (refusal (assoc-in current [:principals "actor_local" :principal/status] :retired) input)))
    (is (= :invalid-credentials
           (refusal (assoc-in current [:identities binding-key :issuer] "https://other.example") input)))))

(deftest changed-or-expired-challenges-cannot-authorize-an-admission
  (doseq [current [(assoc state :challenges {})
                    (assoc-in state [:challenges "proof" :expires-at] 1000)
                    (assoc-in state [:challenges "proof" :browser-hash] "different-browser")
                    (assoc-in state [:challenges "proof" :purpose] :oauth/google)
                    (assoc-in state [:challenges "proof" :private-ref] "different-protected-data")]]
    (is (= :invalid-challenge (refusal current input)))))

(deftest generated-values-cannot-overwrite-existing-identity-or-grant-authority
  (doseq [current [(assoc-in state [:principals "actor_new"] actor)
                    (assoc-in state [:aliases "member-new"] {:principal-id "another"})
                    (assoc-in state [:sessions "new-session"] {:principal-id "another" :expires-at 5000})]]
    (is (= :external-identity-collision (refusal current input))))
  (doseq [changed [(assoc actor :principal/roles ["system-admin"])
                    (assoc actor :principal/capabilities ["axxium/admin"])
                    (assoc actor :principal/email "same@example.test")
                    (assoc actor :principal/kind :agent)]]
    (is (= :invalid-external-principal (refusal state (assoc input :actor changed)))))
  (is (= :invalid-provider-identity (refusal state (assoc-in input [:verified :subject] ""))))
  (is (= :invalid-external-admission (refusal state (assoc input :expires-at 1000)))))
