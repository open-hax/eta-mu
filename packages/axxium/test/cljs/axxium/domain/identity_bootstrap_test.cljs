(ns axxium.domain.identity-bootstrap-test
  (:require [axxium.domain.identity :as identity]
            [axxium.domain.identity-bootstrap :as bootstrap]
            [cljs.test :refer [deftest is]]))

(def actor
  {:principal/id "actor_admin" :principal/entity-id "entity_admin" :principal/kind :human
   :principal/username "admin" :principal/email "admin@example.test" :principal/display-name "Administrator"
   :principal/status :active :principal/roles ["system-admin"] :principal/capabilities ["axxium/admin"]})
(def input {:actor actor :private-ref "encrypted-descriptor"})
(def request {:username "admin" :email "admin@example.test" :principal-id "actor_admin"})

(defn- refusal [run]
  (try (run) nil (catch :default cause (:code (ex-data cause)))))

(deftest managed-bootstrap-is-one-deterministic-pure-transition
  (let [transaction (bootstrap/create-transition {} input)
        state (identity/apply-event {} {:event/data transaction})
        expected (bootstrap/existing state)
        restart (bootstrap/restart-transition state {:expected expected :request request :verified? true})]
    (is (= transaction (bootstrap/create-transition {} input)))
    (is (= 5 (count (:changes transaction))))
    (is (= actor (:result transaction)))
    (is (= actor (:result restart)))
    (is (empty? (:changes restart)))
    (is (= "encrypted-descriptor" (get-in expected [:credential :private-ref])))))

(deftest new-bootstrap-refuses-every-already-owned-coordinate
  (doseq [state [{:credentials {"system:bootstrap" {:principal-id "another"}}}
                {:principals {"actor_admin" actor}}
                {:credentials {"password:actor_admin" {:principal-id "someone-else" :private-ref "old"}}}
                {:aliases {"admin" {:principal-id "another"}}}
                {:aliases {"admin@example.test" {:principal-id "another"}}}]]
    (is (= :bootstrap-collision (refusal #(bootstrap/create-transition state input))))))

(deftest new-bootstrap-requires-the-explicit-managed-human-contract
  (doseq [candidate [(assoc actor :principal/kind :agent)
                    (assoc actor :principal/roles ["basic-user"])
                    (assoc actor :principal/capabilities [])
                    (assoc actor :principal/status :suspended)
                    (assoc actor :principal/email "ADMIN@example.test")]]
    (is (= :invalid-bootstrap (refusal #(bootstrap/create-transition {} (assoc input :actor candidate))))))
  (is (= :invalid-bootstrap (refusal #(bootstrap/create-transition {} (assoc input :private-ref ""))))))

(deftest restart-refuses-wrong-password-and-current-history-drift
  (let [state (identity/apply-event {} {:event/data (bootstrap/create-transition {} input)})
        admitted {:expected (bootstrap/existing state) :request request :verified? true}]
    (is (= :bootstrap-mismatch (refusal #(bootstrap/restart-transition state (assoc admitted :verified? false)))))
    (doseq [changed [(assoc-in state [:credentials "password:actor_admin" :private-ref] "rotated")
                     (assoc-in state [:credentials "password:actor_admin" :principal-id] "other")
                     (update state :credentials dissoc "system:bootstrap")
                     (assoc-in state [:aliases "admin" :principal-id] "other")
                     (assoc-in state [:principals "actor_admin" :principal/status] :suspended)]]
      (is (= :bootstrap-mismatch (refusal #(bootstrap/restart-transition changed admitted)))))
    (doseq [change [{:username "other"} {:email "other@example.test"} {:principal-id "another"}]]
      (is (= :bootstrap-mismatch (refusal #(bootstrap/restart-transition state
                                              (assoc admitted :request (merge request change)))))))))
