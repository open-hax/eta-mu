(ns eta-mu.gitops-controller.extern.http
  "Fetch boundary for GitHub REST requests."
  (:require [eta-mu.gitops-controller.extern.json :as json]
            [eta-mu.gitops-controller.extern.uri :as uri]))

(defn- headers->js [headers]
  (clj->js headers))

(def default-timeout-ms 10000)

(def max-timeout-ms 30000)

(defn- bounded-timeout-ms [value]
  (if (and (number? value) (js/Number.isFinite value) (pos? value))
    (min value max-timeout-ms)
    default-timeout-ms))

(defn- transport-error [error]
  (if (= "AbortError" (.-name error))
    (ex-info "HTTP request timed out" {:error/code :http-request-timeout})
    (ex-info "HTTP request failed" {:error/code :http-request-failed})))

(defn ^:async request!
  [{:keys [url method headers body timeout-ms]}]
  (let [url (uri/https-request-url! url)
        controller (js/AbortController.)
        timer (js/setTimeout #(.abort controller)
                             (bounded-timeout-ms timeout-ms))
        options (cond-> {:method method
                         :headers (headers->js headers)
                         :redirect "error"
                         :signal (.-signal controller)}
                  body (assoc :body (json/encode body)))]
    (try
      (let [response (await (js/fetch url (clj->js options)))]
        (when (or (.-redirected response)
                  (<= 300 (.-status response) 399))
          (throw (ex-info "HTTP redirects are disabled" {})))
        (let [text (await (.text response))]
          {:status (.-status response)
           :ok? (.-ok response)
           :body (when-not (empty? text) (json/decode text))}))
      (catch :default error
        (throw (transport-error error)))
      (finally
        (js/clearTimeout timer)))))
