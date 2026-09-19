(ns axxium.routes.auth
  "Retained PostgreSQL authentication operations with native transport in extern."
  (:require [clojure.string :as str]
            [axxium.config :as cfg]
            [axxium.db :as db]
            [axxium.auth.session :as session]
            [axxium.extern.legacy-http :as http]
            [axxium.extern.legacy-password :as password]))

(defn- http-error [status code message]
  (ex-info message {:status status :code code}))
(defn- sanitize-actor [actor] (dissoc actor :password_hash))
(defn- wrap [handler]
  (http/handler handler {:read-token session/extract-auth-token
                         :set-cookie session/set-session-cookie
                         :clear-cookie session/clear-session-cookie}))
(defn- login-result [actor token]
  {:body {:ok true :actor (sanitize-actor actor) :token token} :session-token token})

(defn- ^:async signup [request]
  (let [body (:body request)
        email (str/lower-case (str/trim (str (:email body))))
        secret (str (:password body))
        display-name (str/trim (str (or (:display-name body) (:display_name body) email)))]
    (cond
      (str/blank? email) {:status 400 :body {:error "email is required"}}
      (str/blank? secret) {:status 400 :body {:error "password is required"}}
      (< (count secret) 8) {:status 400 :body {:error "password must be at least 8 characters"}}
      :else
      (try
        (when (await (db/query-one "SELECT id FROM actors WHERE email = $1" [email]))
          (throw (http-error 409 "email_exists" "An account with this email already exists")))
        (let [password-hash (await (password/hash-password secret (cfg/get-in-config [:password/salt-rounds])))
              entity-id (str "entity_" (random-uuid))
              actor-id (str "actor_" (random-uuid))]
          (await (db/query "INSERT INTO entities (id, kind, email, display_name) VALUES ($1, $2, $3, $4)"
                           [entity-id "human" email display-name]))
          (await (db/query
                  "INSERT INTO actors (id, entity_id, email, display_name, password_hash, capabilities, roles, status)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"
                  [actor-id entity-id email display-name password-hash
                   [:axxium/login :axxium/read :axxium/write] [:axxium/user] "active"]))
          (let [actor (await (db/query-one "SELECT * FROM actors WHERE id = $1" [actor-id]))
                {:keys [token]} (await (session/create-session! actor))]
            (login-result actor token)))
        (catch :default error (http/error-data error "Signup failed"))))))

(defn- ^:async login [request]
  (let [body (:body request)
        email (str/lower-case (str/trim (str (:email body))))
        secret (str (:password body))]
    (if (or (str/blank? email) (str/blank? secret))
      {:status 400 :body {:error "email and password are required"}}
      (try
        (let [actor (await (db/query-one "SELECT * FROM actors WHERE email = $1 AND status = 'active'" [email]))
              verified? (await (password/verify-password-or-dummy secret (:password_hash actor)))]
          (when-not (and actor verified?)
            (throw (http-error 401 "invalid_credentials" "Invalid email or password")))
          (let [{:keys [token]} (await (session/create-session! actor))]
            (login-result actor token)))
        (catch :default error (http/error-data error "Login failed"))))))

(defn- ^:async logout [request]
  (when-let [token (:token request)] (await (session/delete-session! token)))
  {:body {:ok true} :clear-session? true})

(defn- ^:async me [request]
  (if-let [context (await (session/resolve-auth-context request))]
    (if-let [actor (await (db/query-one "SELECT * FROM actors WHERE id = $1" [(:auth/actor-id context)]))]
      {:body {:ok true :actor (sanitize-actor actor)}}
      {:status 401 :body {:error "Actor not found"}})
    {:status 401 :body {:error "Unauthorized"}}))

(defn- config [_request]
  {:body {:githubEnabled (cfg/get-in-config [:oauth/github-enabled])
          :publicBaseUrl (cfg/get-in-config [:axxium/public-base-url])
          :loginUrl "/api/auth/login" :signupUrl "/api/auth/signup"}})

(def ^:private descriptors
  {:signup {:method "POST" :path "/api/auth/signup" :handler (wrap signup)}
   :login {:method "POST" :path "/api/auth/login" :handler (wrap login)}
   :logout {:method "POST" :path "/api/auth/logout" :handler (wrap logout)}
   :me {:method "GET" :path "/api/auth/me" :handler (wrap me)}
   :config {:method "GET" :path "/api/auth/config" :handler (wrap config)}})

(def register-signup-route! (http/route-registrar [(:signup descriptors)]))
(def register-login-route! (http/route-registrar [(:login descriptors)]))
(def register-logout-route! (http/route-registrar [(:logout descriptors)]))
(def register-me-route! (http/route-registrar [(:me descriptors)]))
(def register-config-route! (http/route-registrar [(:config descriptors)]))
(def register-auth-routes!
  "Register the retained public auth routes using an extern-owned native function."
  (http/route-registrar (mapv descriptors [:config :signup :login :logout :me])))
