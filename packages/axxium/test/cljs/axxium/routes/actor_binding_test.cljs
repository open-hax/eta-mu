(ns axxium.routes.actor-binding-test
  (:require [axxium.auth.session :as session]
            [axxium.extern.fastify :as fastify]
            [axxium.infra.principal-binding :as principal-binding]
            [axxium.routes.actor :as actor-route]
            [cljs.test :refer [deftest is testing]]))

(def auth-context
  {:auth/actor-id "requester"
   :auth/entity-id "entity.requester"
   :auth/capabilities []
   :auth/roles []})

(def runtime-binding
  {:binding/version 1
   :principal/actor-id "actor.agent.research"
   :principal/entity-id "entity.agent.research"
   :principal/kind "agent"
   :principal/org-id "org.open-hax"})

(defn- capture-send
  [sent*]
  (fn [_reply status body]
    (reset! sent* {:status status :body body})
    body))

(deftest ^:async runtime-binding-route-success-test
  (let [sent* (atom nil)]
    (with-redefs [session/resolve-auth-context
                  (fn [_request] (js/Promise.resolve auth-context))
                  fastify/request-param
                  (fn [_request name]
                    (when (= "id" name) "actor.agent.research"))
                  principal-binding/resolve-runtime-binding
                  (fn [actor-id]
                    (is (= "actor.agent.research" actor-id))
                    (js/Promise.resolve runtime-binding))
                  fastify/send-json! (capture-send sent*)]
      (await (actor-route/handle-get-runtime-binding {} {}))
      (is (= {:status 200
              :body {:ok true :binding runtime-binding}}
             @sent*)))))

(deftest ^:async runtime-binding-route-unauthorized-test
  (let [sent* (atom nil)]
    (with-redefs [session/resolve-auth-context
                  (fn [_request] (js/Promise.resolve nil))
                  fastify/send-json! (capture-send sent*)]
      (await (actor-route/handle-get-runtime-binding {} {}))
      (is (= {:status 401 :body {:error "Unauthorized"}}
             @sent*)))))

(deftest ^:async runtime-binding-route-not-found-test
  (let [sent* (atom nil)]
    (with-redefs [session/resolve-auth-context
                  (fn [_request] (js/Promise.resolve auth-context))
                  fastify/request-param
                  (fn [_request _name] "missing")
                  principal-binding/resolve-runtime-binding
                  (fn [_actor-id] (js/Promise.resolve nil))
                  fastify/send-json! (capture-send sent*)]
      (await (actor-route/handle-get-runtime-binding {} {}))
      (is (= {:status 404
              :body {:error "Runtime principal not found"}}
             @sent*)))))

(deftest ^:async runtime-binding-route-unsupported-kind-test
  (let [sent* (atom nil)]
    (with-redefs [session/resolve-auth-context
                  (fn [_request] (js/Promise.resolve auth-context))
                  fastify/request-param
                  (fn [_request _name] "actor.org")
                  principal-binding/resolve-runtime-binding
                  (fn [_actor-id]
                    (js/Promise.reject
                     (ex-info "Organization entities are not runnable principals"
                              {:reason :unsupported-principal-kind})))
                  fastify/send-json! (capture-send sent*)]
      (await (actor-route/handle-get-runtime-binding {} {}))
      (is (= {:status 422
              :body {:error "Unsupported runtime principal kind"
                     :code "unsupported_principal_kind"}}
             @sent*)))))

(deftest route-response-excludes-live-authorization-state-test
  (testing "the immutable binding contains neither roles nor capabilities"
    (is (not (contains? runtime-binding :principal/roles)))
    (is (not (contains? runtime-binding :principal/capabilities)))))
