(ns axxium.extern.fastify-test
  (:require [axxium.extern.fastify :as fastify]
            [cljs.test :refer [deftest is]]))

(deftest canonical-json-key-preservation-test
  (let [status* (atom nil)
        sent* (atom nil)
        target #js {:send (fn [body]
                            (reset! sent* body)
                            body)}
        reply #js {:code (fn [status]
                           (reset! status* status)
                           target)}]
    (fastify/send-json!
     reply
     200
     {:ok true
      :binding {:binding/version 1
                :principal/actor-id "actor.agent.research"
                :principal/entity-id "entity.agent.research"
                :principal/kind "agent"
                :principal/org-id "org.open-hax"}})
    (is (= 200 @status*))
    (is (= {"ok" true
            "binding" {"binding/version" 1
                       "principal/actor-id" "actor.agent.research"
                       "principal/entity-id" "entity.agent.research"
                       "principal/kind" "agent"
                       "principal/org-id" "org.open-hax"}}
           (js->clj @sent*)))))