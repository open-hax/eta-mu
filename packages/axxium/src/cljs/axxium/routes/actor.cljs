(ns axxium.routes.actor
  "Retained actor registry operations; native route adapters live in extern."
  (:require [axxium.auth.session :as session]
            [axxium.db :as db]
            [axxium.extern.legacy-http :as http]
            [axxium.infra.principal-binding :as principal-binding]
            [axxium.law.identity-grants :as grants]))

(defn- sanitize-actor [actor] (dissoc actor :password_hash))
(def unauthorized {:status 401 :body {:error "Unauthorized"}})

(defn- wrap [handler]
  (http/handler handler {:read-token session/extract-auth-token}))

(defn- ^:async list-actors [request]
  (if-not (await (session/resolve-auth-context request)) unauthorized
    (let [limit (http/parse-integer (get-in request [:query :limit]) "50")
          offset (http/parse-integer (get-in request [:query :offset]) "0")
          actors (await (db/query-all
                         "SELECT * FROM actors WHERE status = 'active' ORDER BY created_at DESC LIMIT $1 OFFSET $2"
                         [limit offset]))]
      {:body {:ok true :actors (mapv sanitize-actor actors) :count (count actors)}})))

(defn- ^:async get-actor [request]
  (if-not (await (session/resolve-auth-context request)) unauthorized
    (if-let [actor (await (db/query-one "SELECT * FROM actors WHERE id = $1" [(get-in request [:params :id])]))]
      {:body {:ok true :actor (sanitize-actor actor)}}
      {:status 404 :body {:error "Actor not found"}})))

(defn- ^:async get-me [request]
  (if-let [context (await (session/resolve-auth-context request))]
    (if-let [actor (await (db/query-one "SELECT * FROM actors WHERE id = $1" [(:auth/actor-id context)]))]
      {:body {:ok true :actor (sanitize-actor actor)}}
      {:status 404 :body {:error "Actor not found"}})
    unauthorized))

(defn- ^:async get-entity [request]
  (if-not (await (session/resolve-auth-context request)) unauthorized
    (if-let [entity (await (db/query-one "SELECT * FROM entities WHERE id = $1" [(get-in request [:params :id])]))]
      {:body {:ok true :entity entity}}
      {:status 404 :body {:error "Entity not found"}})))

(defn- ^:async get-runtime-binding [request]
  (if-not (await (session/resolve-auth-context request)) unauthorized
    (try
      (if-let [binding (await (principal-binding/resolve-runtime-binding (get-in request [:params :id])))]
        {:body {:ok true :binding binding}}
        {:status 404 :body {:error "Runtime principal not found"}})
      (catch :default error
        (if (= :unsupported-principal-kind (:reason (ex-data error)))
          {:status 422 :body {:error "Unsupported runtime principal kind" :code "unsupported_principal_kind"}}
          (throw error))))))

(def handle-get-runtime-binding
  "Compatible native handler created by the extern transport adapter."
  (wrap get-runtime-binding))

(defn- ^:async update-capabilities [request]
  (if-let [context (await (session/resolve-auth-context request))]
    (if (and (contains? (set (or (:auth/capabilities context) [])) :axxium/admin)
             (grants/delegated-target? (:auth/actor-id context) (get-in request [:params :id])))
      (do
        (await (db/query "UPDATE actors SET capabilities = $1, updated_at = NOW() WHERE id = $2"
                         [(get-in request [:body :capabilities]) (get-in request [:params :id])]))
        {:body {:ok true}})
      {:status 403 :body {:error "Forbidden"}})
    unauthorized))

(def register-actor-routes!
  "Register actor routes through the retained native function signature."
  (http/route-registrar
   [{:method "GET" :path "/api/actors" :handler (wrap list-actors)}
    {:method "GET" :path "/api/actors/:id/runtime-binding" :handler handle-get-runtime-binding}
    {:method "GET" :path "/api/actors/:id" :handler (wrap get-actor)}
    {:method "GET" :path "/api/actors/me" :handler (wrap get-me)}
    {:method "GET" :path "/api/entities/:id" :handler (wrap get-entity)}
    {:method "POST" :path "/api/actors/:id/capabilities" :handler (wrap update-capabilities)}]))
