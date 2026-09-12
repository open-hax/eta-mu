(ns axxium.infra.identity-oauth-completion-test
  "Real invalid provider exchanges must consume a finite durable callback budget."
  (:require [axxium.extern.identity-host :as host]
            [axxium.extern.identity-http :as http]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-oauth :as flow]
            [cljs.test :refer [deftest is]]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(defn- options [directory origin provider]
  {:provider :edn :directory directory :public-base-url "http://localhost:8787"
   :providers {provider {:client-id "local-callback-client" :client-secret "local-callback-secret"
                         :token-url (str origin "/token")}}})

(defn- state! [service provider browser]
  (.get (.-searchParams (js/URL. (flow/begin! service provider browser nil {} nil))) "state"))

(defn- ^:async refusal [service provider browser state]
  (try (await (flow/finish! service provider browser {:state state :code "invalid-code"} nil)) nil
       (catch :default cause (:code (ex-data cause)))))

(defn- invalid-issuer [calls]
  (let [issuer (http/create-app)]
    (.addContentTypeParser issuer "application/x-www-form-urlencoded" #js {:parseAs "string"}
                           (fn [_ body done] (done nil body)))
    (.post issuer "/token" (fn [_ reply]
                             (swap! calls inc)
                             (.code reply 400)
                             (.send reply #js {:error "invalid_grant"})))
    issuer))

(deftest ^:async generic-oauth-completions-are-bounded-across-reopened-handles
  (let [calls (atom 0)
        issuer (invalid-issuer calls)]
    (try
      (let [origin (await (http/listen! issuer "127.0.0.1" 0))]
        (doseq [provider [:github :discord :google]]
          (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-callback-bound-"))]
            (try
              (let [config (options directory origin provider)
                    service (identity/open! config)
                    browser (host/random-token)
                    state (state! service provider browser)
                    initial @calls]
                (is (= :invalid-challenge (await (refusal service provider (host/random-token) state))))
                (is (= initial @calls))
                (dotimes [_ 3]
                  (is (= :provider-unavailable (await (refusal (identity/open! config) provider browser state)))))
                (let [bytes (fs/readFileSync (str directory "/ceremonies.edn") "utf8")]
                  (dotimes [_ 3]
                    (is (= :ceremony-rate-limit (await (refusal (identity/open! config) provider browser state)))))
                  (is (= bytes (fs/readFileSync (str directory "/ceremonies.edn") "utf8"))))
                (is (= (+ initial 3) @calls) (str provider " bounds actual outbound token requests")))
              (finally (fs/rmSync directory #js {:recursive true :force true}))))))
      (finally (await (http/close! issuer))))))

(deftest ^:async uncertain-callback-reservation-starts-no-provider-request
  (let [directory (fs/mkdtempSync (path/join (os/tmpdir) "axxium-callback-fence-"))
        calls (atom 0)
        issuer (invalid-issuer calls)
        replace! host/replace-private-text!]
    (try
      (let [origin (await (http/listen! issuer "127.0.0.1" 0))
            config (options directory origin :github)
            service (identity/open! config)
            browser (host/random-token)
            state (state! service :github browser)]
        (is (= :injected-publication-failure
               (await (with-redefs [host/replace-private-text!
                                   (fn [file text]
                                     (replace! file text)
                                     (throw (ex-info "Injected post-publication failure" {:code :injected-publication-failure})))]
                        (refusal service :github browser state)))))
        (is (= 0 @calls))
        (dotimes [_ 2]
          (is (= :provider-unavailable (await (refusal (identity/open! config) :github browser state)))))
        (is (= :ceremony-rate-limit (await (refusal (identity/open! config) :github browser state))))
        (is (= 2 @calls) "A visible uncertain reservation stays spent after reopening"))
      (finally (await (http/close! issuer)) (fs/rmSync directory #js {:recursive true :force true})))))
