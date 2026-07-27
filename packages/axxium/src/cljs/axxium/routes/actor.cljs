(ns axxium.routes.actor
  "Actor registry routes for Axxium."
  (:require [axxium.auth.session :as session]
            [axxium.db :as db]
            [axxium.extern.fastify :as fastify]
            [axxium.infra.principal-binding :as principal-binding]))

(defn- sanitize-actor [actor]
  (dissoc actor :password_hash))

(defn- ^:async handle-list-actors [req reply]
  (let [ctx (await (session/resolve-auth-context req))]
    (if-not ctx
      (.send (.code reply 401) (clj->js {:error "Unauthorized"}))
      (let [limit (js/parseInt (or (aget (aget req "query") "limit") "50"))
            offset (js/parseInt (or (aget (aget req "query") "offset") "0"))
            actors (await (db/query-all
                           "SELECT * FROM actors WHERE status = 'active' ORDER BY created_at DESC LIMIT $1 OFFSET $2"
                           [limit offset]))]
        (.send reply (clj->js {:ok true
                              :actors (map sanitize-actor actors)
                              :count (count actors)}))))))

(defn- ^:async handle-get-actor [req reply]
  (let [ctx (await (session/resolve-auth-context req))]
    (if-not ctx
      (.send (.code reply 401) (clj->js {:error "Unauthorized"}))
      (let [actor-id (aget (aget req "params") "id")
            actor (await (db/query-one "SELECT * FROM actors WHERE id = $1" [actor-id]))]
        (if-not actor
          (.send (.code reply 404) (clj->js {:error "Actor not found"}))
          (.send reply (clj->js {:ok true
                                :actor (sanitize-actor actor)})))))))

(defn- ^:async handle-get-me [req reply]
  (let [ctx (await (session/resolve-auth-context req))]
    (if-not ctx
      (.send (.code reply 401) (clj->js {:error "Unauthorized"}))
      (let [actor (await (db/query-one "SELECT * FROM actors WHERE id = $1" [(:auth/actor-id ctx)]))]
        (if-not actor
          (.send (.code reply 404) (clj->js {:error "Actor not found"}))
          (.send reply (clj->js {:ok true
                                :actor (sanitize-actor actor)})))))))

(defn- ^:async handle-get-entity [req reply]
  (let [ctx (await (session/resolve-auth-context req))]
    (if-not ctx
      (.send (.code reply 401) (clj->js {:error "Unauthorized"}))
      (let [entity-id (aget (aget req "params") "id")
            entity (await (db/query-one "SELECT * FROM entities WHERE id = $1" [entity-id]))]
        (if-not entity
          (.send (.code reply 404) (clj->js {:error "Entity not found"}))
          (.send reply (clj->js {:ok true
                                :entity entity})))))))

(defn ^:async handle-get-runtime-binding
  "Authenticated projection of one active actor/entity identity for runtime
   event attribution. Does not return roles or capabilities."
  [req reply]
  (let [ctx (await (session/resolve-auth-context req))]
    (if-not ctx
      (fastify/send-json! reply 401 {:error "Unauthorized"})
      (let [actor-id (fastify/request-param req "id")]
        (try
          (if-let [binding (await (principal-binding/resolve-runtime-binding actor-id))]
            (fastify/send-json! reply 200 {:ok true :binding binding})
            (fastify/send-json! reply 404 {:error "Runtime principal not found"}))
          (catch :default error
            (let [reason (:reason (ex-data error))]
              (if (= :unsupported-principal-kind reason)
                (fastify/send-json! reply 422
                                    {:error "Unsupported runtime principal kind"
                                     :code "unsupported_principal_kind"})
                (throw error)))))))))

(defn- ^:async handle-update-capabilities [req reply]
  (let [ctx (await (session/resolve-auth-context req))]
    (if-not ctx
      (.send (.code reply 401) (clj->js {:error "Unauthorized"}))
      (let [actor-id (aget (aget req "params") "id")
            requester-id (:auth/actor-id ctx)
            requester-caps (set (or (:auth/capabilities ctx) []))
            body (js->clj (or (aget req "body") #js {}) :keywordize-keys true)
            capabilities (:capabilities body)]
        (if (or (= requester-id actor-id)
                (contains? requester-caps :axxium/admin))
          (do
            (await (db/query
                    "UPDATE actors SET capabilities = $1, updated_at = NOW() WHERE id = $2"
                    [(clj->js capabilities) actor-id]))
            (.send reply (clj->js {:ok true})))
          (.send (.code reply 403) (clj->js {:error "Forbidden"})))))))

(defn register-actor-routes!
  "Register actor registry routes on the Fastify app."
  [app]
  (.get app "/api/actors" handle-list-actors)
  (fastify/register-get! app "/api/actors/:id/runtime-binding" handle-get-runtime-binding)
  (.get app "/api/actors/:id" handle-get-actor)
  (.get app "/api/actors/me" handle-get-me)
  (.get app "/api/entities/:id" handle-get-entity)
  (.post app "/api/actors/:id/capabilities" handle-update-capabilities))
