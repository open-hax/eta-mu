(ns axxium.extern.legacy-http
  "Native request/reply and cookie adapters for retained PostgreSQL consumers."
  (:require [axxium.extern.fastify :as fastify]
            [clojure.string :as str]))

(defn decode [value] (js->clj value :keywordize-keys true))

(defn- dictionary [value]
  (into {} (map (fn [key] [(keyword key) (decode (aget value key))]))
        (js/Object.keys (or value #js {}))))

(defn token-reader [cookie-name]
  (fn [request]
    (if (map? request) (:token request)
      (let [authorization (str (or (some-> request .-headers (aget "authorization")) ""))
            cookie (some-> request .-cookies (aget cookie-name))]
        (or (when (str/starts-with? (str/lower-case authorization) "bearer ")
              (str/trim (subs authorization 7)))
            cookie)))))

(defn context-resolver [read-token verify-session project]
  (fn ^:async resolve-context [request]
    (when-let [actor (await (verify-session (read-token request)))]
      (project (decode actor)))))

(defn cookie-setter [cookie-name options]
  (fn [reply token] (.setCookie reply cookie-name token (clj->js (options)))))

(defn cookie-clearer [cookie-name]
  (fn [reply] (.clearCookie reply cookie-name #js {:path "/"})))

(defn expiry-iso [hours]
  (.toISOString (js/Date. (+ (js/Date.now) (* hours 3600000)))))

(defn error-data [error fallback]
  (let [data (ex-data error)]
    {:status (or (:status data) (.-statusCode error) 500)
     :body {:error (or (ex-message error) (.-message error) fallback)
            :code (or (:code data) (.-code error) "unknown")}}))

(defn parse-integer [value fallback]
  (js/parseInt (or value fallback)))

(defn handler
  "Create the legacy native handler signature around a defined data handler."
  [handle {:keys [read-token set-cookie clear-cookie]}]
  (fn ^:async invoke [request reply]
    (let [response (await (handle {:body (decode (or (.-body request) #js {}))
                                   :query (dictionary (.-query request))
                                   :params {:id (fastify/request-param request "id")}
                                   :token (when read-token (read-token request))}))]
      (when-let [token (:session-token response)] (set-cookie reply token))
      (when (:clear-session? response) (clear-cookie reply))
      (if-let [url (:redirect response)] (.redirect reply url)
        (fastify/send-json! reply (or (:status response) 200) (:body response))))))

(defn route-registrar
  "Create a compatible native registration function without exposing app to route logic."
  [descriptors]
  (fn [app]
    (doseq [{:keys [method path handler]} descriptors]
      (if (= "GET" method) (fastify/register-get! app path handler)
          (.post app path handler)))
    app))
