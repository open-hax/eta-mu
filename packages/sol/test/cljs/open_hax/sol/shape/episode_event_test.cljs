(ns open-hax.sol.shape.episode-event-test
  (:require [cljs.test :refer [deftest is testing]]
            [open-hax.event-ledger :as event-ledger]
            [open-hax.sol.shape.episode-event :as episode-event]))

(def agent-spec
  {:actor-id "actor.agent.research"
   :contract-id "agent/research"
   :contract-revision "git:abc123"})

(def auth-context
  {:actorId "actor.agent.research"
   :entityId "entity.agent.research"
   :orgId "org.open-hax"
   :principalKind "agent"})

(deftest principal-binding-requires-authoritative-identity-test
  (testing "complete Axxium references produce a versioned binding"
    (is (= {:binding/version 1
            :principal/actor-id "actor.agent.research"
            :principal/entity-id "entity.agent.research"
            :principal/kind "agent"
            :principal/org-id "org.open-hax"
            :actor/resource {:resource/id "agent/research"
                             :resource/revision "git:abc123"}}
           (episode-event/principal-binding auth-context agent-spec))))

  (testing "missing entity identity never fabricates a binding"
    (is (nil? (episode-event/principal-binding
               {:actorId "actor.agent.research"
                :orgId "org.open-hax"}
               agent-spec))))

  (testing "actor attribution remains available without a binding"
    (let [actor (episode-event/actor-descriptor
                 {:actorId "actor.agent.research"}
                 agent-spec
                 "sol.node.local")]
      (is (= "actor.agent.research" (:actor-id actor)))
      (is (= "agent" (:actor-kind actor)))
      (is (= "sol.node.local" (:actor-node actor)))
      (is (not (contains? actor :principal/binding))))))

(deftest principal-kind-vocabulary-test
  (doseq [kind ["human" "agent" "service" "automation"]]
    (let [binding (episode-event/principal-binding
                   {:actorId (str "actor." kind)
                    :entityId (str "entity." kind)
                    :principalKind kind}
                   {})]
      (is (= kind (:principal/kind binding)))))

  (testing "unknown kinds fall back to the shaped runtime category"
    (is (= "service"
           (:principal/kind
            (episode-event/principal-binding
             {:actorId "actor.service"
              :entityId "entity.service"
              :principalKind "robot"}
             {}))))))

(deftest episode-envelope-correspondence-test
  (let [context (episode-event/episode-context
                 {:run-id "run-1"
                  :session-id "session-1"
                  :turn-id "turn-1"
                  :episode-id "episode-1"
                  :conversation-id "conversation-1"
                  :causal-root "event-1"
                  :node-id "sol.node.local"
                  :auth-context auth-context
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
    (is (= auth-context
           {:actorId (get-in envelope
                             [:event/from :principal/binding
                              :principal/actor-id])
            :entityId (get-in envelope
                              [:event/from :principal/binding
                               :principal/entity-id])
            :orgId (get-in envelope
                           [:event/from :principal/binding
                            :principal/org-id])
            :principalKind (get-in envelope
                                   [:event/from :principal/binding
                                    :principal/kind])}))
    (is (true? (:valid (event-ledger/validate-envelope envelope))))))
