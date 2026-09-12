(ns axxium.routes.actor-grants-test
  (:require [axxium.auth.session :as session]
            [axxium.db :as db]
            [axxium.routes.actor :as actors]
            [cljs.test :refer [deftest is]]
            ["fastify" :as Fastify]))

(deftest ^:async retained-http-route-refuses-self-grants-before-postgres
  (let [app (Fastify #js {:logger false})
        writes (atom [])]
    (try
      (actors/register-actor-routes! app)
      (with-redefs [session/resolve-auth-context
                    (fn ^:async authenticated [_]
                      {:auth/actor-id "administrator" :auth/capabilities [:axxium/admin]})
                    db/query (fn ^:async capture-write [sql parameters]
                               (swap! writes conj {:sql sql :parameters parameters}) [])]
        (let [response (await (.inject app #js {:method "POST" :url "/api/actors/administrator/capabilities"
                                               :payload #js {:capabilities #js ["content/publish"]}}))]
          (is (= 403 (.-statusCode ^js response)))
          (is (empty? @writes) "A refused self-target request must never reach the SQL write"))
        (reset! writes [])
        (let [response (await (.inject app #js {:method "POST" :url "/api/actors/another-actor/capabilities"
                                               :payload #js {:capabilities #js ["content/publish"]}}))]
          (is (= 200 (.-statusCode ^js response)))
          (is (= 1 (count @writes)))
          (is (= [["content/publish"] "another-actor"] (:parameters (first @writes))))))
      (finally (await (.close app))))))
