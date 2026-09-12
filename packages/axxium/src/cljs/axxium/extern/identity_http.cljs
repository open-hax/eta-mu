(ns axxium.extern.identity-http
  "Fastify cookie, request and route boundaries for identity consumers."
  (:require [axxium.extern.fastify :as fastify]
            [axxium.extern.identity-host :as host]
            [axxium.law.identity :as law]
            [clojure.string :as str]
            ["@fastify/cookie" :default fastify-cookie]
            ["fastify" :default Fastify]))

(def cookie-name "Shared browser session cookie." "axxium_session")
(def browser-cookie "Browser-bound authentication ceremony cookie." "axxium_browser")

(defn provider-options
  "Decode JavaScript consumer options at the public API edge."
  [options]
  (update (js->clj options :keywordize-keys true) :provider #(if % (keyword %) :edn)))

(defn- dictionary
  "Fastify uses prototype-free dictionaries; js->clj does not decode those."
  [value]
  (into {} (map (fn [key] [(keyword key) (js->clj (aget value key) :keywordize-keys true)]))
        (js/Object.keys (or value #js {}))))

(defn request-data
  "Decode request values once; only this adapter touches native request objects."
  [request]
  (let [headers (dictionary (.-headers request))
        cookies (dictionary (.-cookies request))
        authorization (or (:authorization headers) "")
        bearer (when (str/starts-with? (str/lower-case authorization) "bearer ") (subs authorization 7))]
    (when (seq authorization)
      (law/require! (and (string? bearer) (not (str/blank? bearer)))
                    :invalid-credentials "Unsupported authentication credentials"))
    (law/require! (not (and bearer (:axxium_session cookies)))
                  :invalid-credentials "Ambiguous authentication credentials")
    {:body (js->clj (or (.-body request) #js {}) :keywordize-keys true)
     :query (dictionary (.-query request))
     :params (dictionary (.-params request))
     :headers headers :token (or bearer (:axxium_session cookies))
     :browser-token (:axxium_browser cookies)
     :bearer? (boolean bearer) :cookie-auth? (boolean (:axxium_session cookies))}))

(defn origin
  "Parse a public origin without retaining paths or query parameters."
  [value]
  (try (.-origin (js/URL. value)) (catch :default _ nil)))

(defn hostname "The configured relying-party hostname." [value]
  (.-hostname (js/URL. value)))

(defn csrf!
  "Browsers must use the configured origin; cookie-authenticated mutations require Origin."
  [request public-origin]
  (let [supplied (get-in request [:headers :origin])
        required? (and (:cookie-auth? request) (not (:bearer? request)))]
    (law/require! (and (or (not required?) supplied)
                       (or (nil? supplied) (= supplied public-origin)))
                  :forbidden-origin "Authentication request origin is not allowed")))

(defn- secure? [public-origin] (str/starts-with? public-origin "https://"))

(defn set-session!
  "Set a revocable opaque HTTP-only session cookie."
  [reply token public-origin]
  (.setCookie reply cookie-name token #js {:path "/" :httpOnly true :secure (secure? public-origin)
                                          :sameSite "lax" :maxAge 86400}))

(defn clear-session! "Expire the current browser session cookie." [reply]
  (.clearCookie reply cookie-name #js {:path "/"}))

(defn ensure-browser!
  "Maintain an unpredictable HTTP-only ceremony binding distinct from a login session."
  [request reply public-origin]
  (or (:browser-token request)
      (let [token (host/random-token)]
        (.setCookie reply browser-cookie token #js {:path "/api/auth" :httpOnly true
                                                    :secure (secure? public-origin) :sameSite "lax" :maxAge 600})
        token)))

(defn redirect! "Send a server-validated authentication redirect." [reply url] (.redirect reply url))
(defn no-store! "Prevent caches from retaining session and credential responses." [reply]
  (.header reply "Cache-Control" "no-store"))

(defn send! "Preserve namespaced identity keys in JSON responses." [reply status value]
  (fastify/send-json! reply status value))

(defn register!
  "Register one bounded JSON route; stable public errors omit private provider details."
  [app method path handler]
  (.route app
          #js {:method method :url path :bodyLimit 262144
               :handler (fn ^:async handle [request reply]
                          (no-store! reply)
                          (try
                            (await (handler (request-data request) reply))
                            (catch :default error
                              (let [code (:code (ex-data error))
                                    concurrent? (= :clio.ledger/concurrent-stream-write (:clio/error (ex-data error)))
                                    status (cond
                                             concurrent? 409
                                             (#{:unauthenticated :invalid-credentials} code) 401
                                             (#{:forbidden :forbidden-origin} code) 403
                                             (= :link-requires-post code) 405
                                             (= :ceremony-rate-limit code) 429
                                             (#{:identifier-exists :credential-exists :identity-already-linked} code) 409
                                             (#{:provider-not-configured :provider-unavailable} code) 503
                                             code 400
                                             :else 500)]
                                (send! reply status {:error (cond concurrent? "Identity changed concurrently; retry the complete operation"
                                                                 code (ex-message error)
                                                                 :else "Authentication failed")
                                                     :code (name (or code (when concurrent? :concurrent-identity-change) :identity-error))})))))}))

(defn ^:async ensure-cookies!
  "Let an embedding Fastify host keep its existing cookie plugin."
  [app]
  ;; Inspect after earlier queued plugins execute, before queuing a missing dependency.
  (await (.after app (fn [error]
                       (when error (throw error))
                       (when-not (.hasRequestDecorator app "cookies")
                         (.register app fastify-cookie))))))

(defn create-app "Create an independently runnable identity server." [] (Fastify #js {:logger false}))
(defn ^:async listen! "Bind the identity server." [app host port]
  (await (.listen app #js {:host host :port port})))
(defn ^:async close! "Close the identity listener for test cleanup." [app] (await (.close app)))
(defn log! "Report startup status without logging secrets." [message] (js/console.log message))
(defn exit! "Fail startup visibly." [status] (js/process.exit status))
