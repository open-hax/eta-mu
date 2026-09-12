(ns axxium.domain.identity-grants-test
  (:require [axxium.domain.identity :as identity]
            [axxium.domain.identity-grants :as grants]
            [cljs.test :refer [deftest is]]))

(def administrator
  {:principal/id "actor_admin" :principal/entity-id "entity_admin"
   :principal/kind :human :principal/username "admin"
   :principal/display-name "Administrator" :principal/status :active
   :principal/roles ["system-admin"] :principal/capabilities ["axxium/admin"]})

(def target
  {:principal/id "actor_writer" :principal/entity-id "entity_writer"
   :principal/kind :agent :principal/username "writer"
   :principal/display-name "Writer" :principal/status :active
   :principal/roles ["basic-user"] :principal/capabilities []})

(def state
  {:principals {"actor_admin" administrator "actor_writer" target}
   :sessions {"admin-digest" {:principal-id "actor_admin" :expires-at 1000}}})

(def request
  {:token-hash "admin-digest" :now 999 :principal-id "actor_writer"
   :roles ["writer"] :capabilities ["content/draft"]})

(defn- refusal [snapshot input]
  (try (grants/transition snapshot input) nil
       (catch :default cause (:code (ex-data cause)))))

(deftest grants-produce-a-deterministic-targeted-transition
  (let [transaction (grants/transition state request)
        accepted (identity/apply-event state {:event/data transaction})]
    (is (= transaction (grants/transition state request)))
    (is (= {:ok true} (:result transaction)))
    (is (= "actor_admin" (:actor transaction)))
    (is (= (assoc target :principal/roles ["writer"] :principal/capabilities ["content/draft"])
           (get-in accepted [:principals "actor_writer"])))
    (is (= administrator (get-in accepted [:principals "actor_admin"])))
    (is (= (:sessions state) (:sessions accepted)))))

(deftest grants-recheck-expiry-revocation-and-current-target-facts
  (is (= :unauthenticated (refusal state (assoc request :now 1000))))
  (is (= :unauthenticated (refusal (assoc state :sessions {}) request)))
  (is (= :unauthenticated
         (refusal (assoc-in state [:principals "actor_admin" :principal/status] :suspended) request)))
  (is (= :forbidden
         (refusal (assoc-in state [:principals "actor_admin" :principal/capabilities] []) request)))
  (is (= :not-found (refusal (update state :principals dissoc "actor_writer") request)))
  (let [current (assoc-in state [:principals "actor_writer" :principal/display-name] "Renamed writer")
        accepted (identity/apply-event current {:event/data (grants/transition current request)})]
    (is (= "Renamed writer" (get-in accepted [:principals "actor_writer" :principal/display-name])))))

(deftest malformed-grants-cannot-create-a-transition
  (doseq [input [(assoc request :roles #{"writer"})
                 (assoc request :capabilities ["content/draft" nil])
                 (assoc request :principal-id "")
                 (assoc request :unexpected true)]]
    (is (= :invalid-grants (refusal state input)))))

(deftest administrators-cannot-update-their-own-roles-or-capabilities
  (doseq [input [(assoc request :principal-id "actor_admin")
                 (assoc request :principal-id "actor_admin"
                                :roles ["another-role"] :capabilities ["axxium/admin"])]]
    (is (= :forbidden (refusal state input)))))
