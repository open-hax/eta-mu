(ns axxium.domain.identity-signup-test
  (:require [axxium.domain.identity :as identity]
            [cljs.test :refer [deftest is]]
            [clojure.string :as str]))

(def actor
  {:principal/id "actor_alice" :principal/entity-id "entity_alice"
   :principal/kind :human :principal/username "alice" :principal/email "alice@example.test"
   :principal/display-name "Alice" :principal/status :active
   :principal/roles ["basic-user"] :principal/capabilities []})

(def input
  {:actor actor :private-ref "sealed-credential-reference" :token "opaque-session-token"
   :token-hash "session-digest" :issued-at 123400000 :expires-at 123456789})

(defn- refusal [state request]
  (try (identity/signup-transition state request) nil
       (catch :default cause (:code (ex-data cause)))))

(deftest signup-transition-is-deterministic-and-contains-only-supplied-effects
  (let [transaction (identity/signup-transition {} input)
        state (identity/apply-event {} {:event/data transaction})]
    (is (= transaction (identity/signup-transition {} input)))
    (is (= {:ok true :principal actor :token "opaque-session-token"} (:result transaction)))
    (is (= actor (identity/principal-by-identifier state " ALICE@EXAMPLE.TEST ")))
    (is (= actor (identity/principal-for-session state "session-digest" 123456788)))
    (is (nil? (identity/principal-for-session state "session-digest" 123456789)))
    (is (= "sealed-credential-reference" (get-in state [:credentials "password:actor_alice" :private-ref])))
    (is (not (str/includes? (pr-str (:changes transaction)) "opaque-session-token")))))

(deftest alias-admission-rechecks-the-current-state-after-preflight
  (identity/require-free-identifiers! {} "alice" "alice@example.test")
  (let [accepted (identity/apply-event {} {:event/data (identity/signup-transition {} input)})]
    (doseq [next-actor [(assoc actor :principal/id "actor_two" :principal/entity-id "entity_two")
                        (assoc actor :principal/id "actor_two" :principal/username "other")
                        (assoc actor :principal/id "actor_two" :principal/email "other@example.test")]]
      (is (= :identifier-exists (refusal accepted (assoc input :actor next-actor)))))
    (is (= actor (get-in accepted [:principals "actor_alice"])))
    (is (= 1 (count (:principals accepted))))))

(deftest signup-refuses-preexisting-principal-credential-or-session-coordinates
  (doseq [state [{:principals {"actor_alice" (assoc actor :principal/username "unrelated")}}
                 {:credentials {"password:actor_alice" {:private-ref "existing"}}}
                 {:sessions {"session-digest" {:principal-id "someone-else" :expires-at 999999999}}}]]
    (is (= :signup-identity-collision (refusal state input)))))

(deftest signup-rejects-forged-grants-and-malformed-host-inputs
  (doseq [next-actor [(assoc actor :principal/kind :agent)
                      (assoc actor :principal/roles ["system-admin"])
                      (assoc actor :principal/capabilities ["axxium/admin"])
                      (assoc actor :principal/email "ALICE@example.test")
                      (assoc actor :principal/status :suspended)]]
    (is (= :invalid-signup-principal (refusal {} (assoc input :actor next-actor)))))
  (doseq [request [(dissoc input :private-ref) (assoc input :expires-at 0) (assoc input :token-hash "")]]
    (is (= :invalid-signup-admission (refusal {} request)))))
