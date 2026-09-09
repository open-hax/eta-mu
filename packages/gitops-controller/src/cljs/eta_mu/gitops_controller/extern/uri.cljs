(ns eta-mu.gitops-controller.extern.uri
  "Narrow JavaScript URI-encoding and HTTPS URL boundary."
  (:require [clojure.string :as str]))

(defn encode-component [value]
  (js/encodeURIComponent value))

(defn- https-url [value]
  (try
    (let [url (js/URL. value)]
      (when (and (string? value)
                 (= "https:" (.-protocol url))
                 (not (empty? (.-hostname url)))
                 (empty? (.-username url))
                 (empty? (.-password url))
                 (empty? (.-hash url)))
        url))
    (catch :default _ nil)))

(defn https-request-url!
  "Validate a credential-bearing request URL without echoing it on failure."
  [value]
  (if-let [url (https-url value)]
    (.-href url)
    (throw (ex-info "HTTP requests require an HTTPS URL without credentials or fragments"
                    {:error/code :invalid-http-url}))))

(defn github-api-url!
  "Normalize a configured HTTPS API root, retaining enterprise API paths."
  [value]
  (if-let [url (https-url value)]
    (if (empty? (.-search url))
      (str/replace (.-href url) #"/+$" "")
      (throw (ex-info "GitHub API URL cannot contain a query"
                      {:error/code :invalid-github-api-url
                       :field "ETA_MU_GITHUB_API_URL"})))
    (throw (ex-info "GitHub API URL requires HTTPS without credentials or fragments"
                    {:error/code :invalid-github-api-url
                     :field "ETA_MU_GITHUB_API_URL"}))))

(defn github-graphql-url [api-root]
  (if (str/ends-with? api-root "/api/v3")
    (str (subs api-root 0 (- (count api-root) 3)) "/graphql")
    (str api-root "/graphql")))
