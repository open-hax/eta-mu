(ns axxium.extern.identity-proxy-test
  "Fastify proxy trust is the sole authority for password admission addresses."
  (:require [axxium.extern.identity-http :as http]
            [axxium.infra.identity-ceremonies :as ceremonies]
            [axxium.infra.identity-store :as store]
            [cljs.test :refer [deftest is]]
            ["fastify" :default Fastify]))

(defn- ^:async request-key! [app remote forwarded]
  (let [response (await (.inject app #js {:method "GET" :url "/key" :remoteAddress remote
                                         :headers #js {"x-forwarded-for" forwarded}}))]
    (.-key (.json response))))

(defn- register-key! [app]
  (.get app "/key" (fn [request reply]
                     (.send reply #js {:key (:client-key (http/request-data request))}))))

(deftest ^:async only-configured-proxies-separate-password-admission-clients
  (let [trusted (Fastify #js {:trustProxy "127.0.0.1"})
        direct (Fastify #js {:trustProxy false})
        identity-store (store/create-provider {:provider :memory})]
    (try
      (register-key! trusted)
      (register-key! direct)
      (let [first-key (await (request-key! trusted "127.0.0.1" "198.51.100.1"))
            second-key (await (request-key! trusted "127.0.0.1" "198.51.100.2"))
            direct-key (await (request-key! direct "127.0.0.1" "198.51.100.1"))
            spoofed-key (await (request-key! direct "127.0.0.1" "198.51.100.2"))]
        (is (not= first-key second-key))
        (is (= direct-key spoofed-key))
        (dotimes [_ 8]
          (await (ceremonies/password-work! identity-store first-key (fn ^:async admitted [] true))))
        (is (= :ceremony-rate-limit
               (try (await (ceremonies/password-work! identity-store first-key (fn ^:async exhausted [] true)))
                    nil (catch :default cause (:code (ex-data cause))))))
        (is (= :other-client
               (try (await (ceremonies/password-work! identity-store second-key (fn ^:async admitted [] :other-client)))
                    (catch :default cause (:code (ex-data cause))))))
        (is (= (await (request-key! trusted "192.0.2.50" "198.51.100.3"))
               (await (request-key! trusted "192.0.2.50" "198.51.100.4")))
            "A forwarding header from an untrusted immediate peer cannot choose its bucket"))
      (finally (await (.close trusted)) (await (.close direct))))))
