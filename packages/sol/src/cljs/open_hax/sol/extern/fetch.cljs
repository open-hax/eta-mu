(ns open-hax.sol.extern.fetch
  "Native fetch boundary.

   Non-extern namespaces should depend on the IHttpClient protocol and pass
   CLJS request maps. This namespace owns AbortController, js/fetch,
   RequestInit construction, Response parsing, and JSON conversion."
  (:require [clojure.string :as str]
            [open-hax.sol.extern.json :as xjson]))

(defprotocol IHttpClient
  (response! [client request]
    "Execute request and resolve with the native Response object.
     Compatibility escape hatch; prefer json!, text!, or array-buffer!.")
  (json! [client request]
    "Execute request and resolve with {:ok :status :body :headers}.
     :body and :headers are CLJS data.")
  (text! [client request]
    "Execute request and resolve with {:ok :status :body :headers} where :body is text.")
  (array-buffer! [client request]
    "Execute request and resolve with {:ok :status :body :headers} where :body is an ArrayBuffer."))

(defn- option-key
  [k]
  (if (keyword? k) (name k) (str k)))

(defn- js-option-value
  [k value]
  (cond
    (= k "headers") (if (map? value) (clj->js value) value)
    (or (map? value) (vector? value) (set? value)) (clj->js value)
    :else value))

(defn- header-key?
  [headers wanted]
  (boolean
   (some (fn [k]
           (= (str/lower-case (name k)) wanted))
         (keys headers))))

(defn- json-headers
  [headers]
  (let [headers (or headers {})]
    (if (header-key? headers "content-type")
      headers
      (assoc headers "Content-Type" "application/json"))))

(defn- request-opts
  [{:keys [opts method headers json body form]}]
  (let [{:keys [method headers json body form]}
        (if (map? opts)
          {:method (or (:method opts) method)
           :headers (or (:headers opts) headers)
           :json (or (:json opts) json)
           :body (or (:body opts) body)
           :form (or (:form opts) form)}
          {:method method
           :headers headers
           :json json
           :body body
           :form form})]
    (if (and opts (not (map? opts)))
      opts
      (cond-> {:method (or method "GET")}
        (seq headers) (assoc :headers headers)
        (some? json) (assoc :headers (json-headers headers)
                            :body (xjson/stringify json))
        (some? body) (assoc :body body)
        (some? form) (assoc :body form)))))

(defn- opts->js
  [opts signal]
  (let [out (js/Object.)]
    (when opts
      (if (map? opts)
        (doseq [[k value] opts]
          (when (some? value)
            (let [jk (option-key k)]
              (aset out jk (js-option-value jk value)))))
        (js/Object.assign out opts)))
    (when signal
      (aset out "signal" signal))
    out))

(defn- response->base-map
  [resp]
  {:ok (.-ok resp)
   :status (.-status resp)
   :headers (let [headers (.-headers resp)
                  acc (atom {})]
              (when headers
                (.forEach headers
                          (fn [value key]
                            (swap! acc assoc (str/lower-case key) value))))
              @acc)})

(defn parse-json-object
  "Parse a JSON object string into a CLJS map. Returns nil for invalid JSON or
   non-object values. CLJS maps pass through unchanged."
  [value]
  (cond
    (map? value) value
    (string? value) (try
                      (let [parsed (xjson/to-cljs (.parse js/JSON value))]
                        (when (map? parsed) parsed))
                      (catch :default _ nil))
    :else nil))

(defn- parse-json-text
  [text]
  (if (str/blank? text)
    {}
    (try
      (xjson/to-cljs (.parse js/JSON text))
      (catch :default _
        {:raw text}))))

(defn- ^:async response-helper!
  [default-timeout-ms fetch-fn request]
  (let [controller (js/AbortController.)
        effective-timeout-ms (or (:timeout-ms request) default-timeout-ms 30000)
        timeout-id (js/setTimeout #(.abort controller) effective-timeout-ms)
        request-init (opts->js (request-opts request) (.-signal controller))
        do-fetch (or fetch-fn js/fetch)]
    (try
      (await (do-fetch (:url request) request-init))
      (finally
        (js/clearTimeout timeout-id)))))

(defn- ^:async json-helper!
  [client request]
  (let [resp (await (response! client request))
        body (.text resp)]
    (assoc (response->base-map resp)
           :body (parse-json-text body))))

(defn- ^:async text-helper!
  [client request]
  (let [resp (await (response! client request))
        body (.text resp)]
    (assoc (response->base-map resp) :body body)))

(defn- ^:async array-buffer-helper!
  [client request]
  (let [resp (await (response! client request))
        body (.arrayBuffer resp)]
    (assoc (response->base-map resp) :body body)))

(defrecord NativeFetchClient [default-timeout-ms fetch-fn]
  IHttpClient
  (response! [_ request]
    (response-helper! default-timeout-ms fetch-fn request))
  (json! [client request]
    (json-helper! client request))
  (text! [client request]
    (text-helper! client request))
  (array-buffer! [client request]
    (array-buffer-helper! client request)))

(def default-client
  (->NativeFetchClient 30000 nil))

(defn native-client
  ([] (native-client {}))
  ([{:keys [default-timeout-ms fetch-fn]}]
   (->NativeFetchClient (or default-timeout-ms 30000) fetch-fn)))
