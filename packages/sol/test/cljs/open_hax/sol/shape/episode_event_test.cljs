(ns open-hax.sol.shape.episode-event-test
  (:require [cljs.test :refer [deftest is testing]]
            [open-hax.event-ledger :as event-ledger]
            [open-hax.sol.shape.episode-event :as episode-event]))

(def agent-spec
  {:actor-id "actor.agent.research"
   :contract-id "agent/research"
   :contract-revision "git:abc123"})

(def runtime-binding
  {:binding/version 1
   :principal/actor-id "actor.agent.research"
   :principal/entity-id "entity.agent.research"
   :principal/kind "agent"
   :principal/org-id "org.open-hax"})

(def expected-ledger-binding
  (assoc runtime-binding
         :actor/resource {:resource/id "agent/research"
                          :resource/revision "git:abc123"}))

(deftest principal-binding-consumes-axxium-authority-test
  (testing "canonical Axxium binding is preserved and augmented with resource lineage"
    (is (= expected-ledger-binding
           (episode-event/principal-binding runtime-binding agent-spec))))

  (testing "nested canonical binding with namespaced JSON string keys is accepted"
    (is (= expected-ledger-binding
           (episode-event/principal-binding
            {"principal/binding"
             {"binding/version" 1
              "principal/actor-id" "actor.agent.research"
              "principal/entity-id" "entity.agent.research"
              "principal/kind" "agent"
              "principal/org-id" "org.open-hax"}}
            agent-spec))))

  (testing "Axxium auth identity without authoritative kind does not fabricate a binding"
    (is (nil? (episode-event/principal-binding
               {:auth/actor-id "actor.agent.research"
                :auth/entity-id "entity.agent.research"
                :auth/org-id "org.open-hax"}
               agent-spec))))

  (testing "legacy complete aliases remain compatible"
    (is (= expected-ledger-binding
           (episode-event/principal-binding
            {:actorId "actor.agent.research"
             :entityId "entity.agent.research"
             :orgId "org.open-hax"
             :principalKind "agent"}
            agent-spec))))

  (testing "missing entity identity never fabricates a binding"
    (is (nil? (episode-event/principal-binding
               {:actorId "actor.agent.research"
                :orgId "org.open-hax"
                :principalKind "agent"}
               agent-spec))))

  (testing "unknown principal kind never falls back into an identity binding"
    (is (nil? (episode-event/principal-binding
               {:actorId "actor.service"
                :entityId "entity.service"
                :principalKind "robot"}
               {}))))

  (testing "unsupported binding versions fail explicitly"
    (try
      (episode-event/principal-binding
       (assoc runtime-binding :binding/version 2)
       agent-spec)
      (is false "unsupported binding version should throw")
      (catch :default error
        (is (= 2 (:binding/version (ex-data error))))))))

(deftest actor-attribution-without-binding-test
  (let [actor (episode-event/actor-descriptor
               {:auth/actor-id "actor.agent.research"
                :auth/entity-id "entity.agent.research"}
               agent-spec
               "sol.node.local")]
    (is (= "actor.agent.research" (:actor-id actor)))
    (is (= "agent" (:actor-kind actor)))
    (is (= "sol.node.local" (:actor-node actor)))
    (is (not (contains? actor :principal/binding)))))

(deftest principal-kind-vocabulary-test
  (doseq [kind ["human" "agent" "service" "automation"]]
    (let [binding (episode-event/principal-binding
                   {:binding/version 1
                    :principal/actor-id (str "actor." kind)
                    :principal/entity-id (str "entity." kind)
                    :principal/kind kind}
                   {})]
      (is (= kind (:principal/kind binding))))))

(deftest episode-envelope-correspondence-test
  (let [context (episode-event/episode-context
                 {:run-id "run-1"
                  :session-id "session-1"
                  :turn-id "turn-1"
                  :episode-id "episode-1"
                  :conversation-id "conversation-1"
                  :causal-root "event-1"
                  :node-id "sol.node.local"
                  :auth-context {:principal/binding runtime-binding}
                  :agent-spec agent-spec})
        envelope (episode-event/envelope
                  context
                  "event-2"
                  "2026-07-27T00:00:00.000Z"
                  "event-1"
                  "sol.turn.started"
                  {:status "running"})]
    (is (= "run-1" (:run/id envelope)))
    (is (= "session-1" (:session/id envelope)))
    (is (= "turn-1" (:turn/id envelope)))
    (is (= "episode-1" (:episode/id envelope)))
    (is (= "event-1" (:causal/root envelope)))
    (is (= "event-1" (:causal/parent envelope)))
    (is (= "conversation-1"
           (get-in envelope [:payload :conversation/id])))
    (is (= ["agent/research"] (:contracts envelope)))
    (is (= [{:resource/id "agent/research"
             :resource/revision "git:abc123"}]
           (:contract/refs envelope)))
    (is (= expected-ledger-binding
           (get-in envelope [:event/from :principal/binding])))
    (is (true? (:valid (event-ledger/validate-envelope envelope))))))