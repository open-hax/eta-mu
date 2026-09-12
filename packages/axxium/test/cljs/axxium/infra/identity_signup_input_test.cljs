(ns axxium.infra.identity-signup-input-test
  (:require [axxium.api :as api]
            [axxium.extern.credential-crypto :as crypto]
            [axxium.extern.identity-http :as http]
            [axxium.infra.identity :as identity]
            [axxium.infra.identity-store :as store]
            [clojure.string :as str]
            [cljs.test :refer [deftest is]]))

(deftest ^:async malformed-display-names-refuse-before-password-or-private-allocation
  (doseq [display-name [42 true {:unexpected "map"} (apply str (repeat 257 "x"))]]
    (let [service (identity/open! {:provider :memory :public-base-url "http://localhost"})
          app (http/create-app)
          hashes (atom 0)
          hash-password crypto/hash-password]
      (try
        (await (api/register-routes app service))
        (with-redefs [crypto/hash-password (fn [password] (swap! hashes inc) (hash-password password))]
          (let [response (await (.inject app #js {:method "POST" :url "/api/auth/signup"
                                                 :payload (clj->js {:username "invalid-name" :email "invalid@example.test"
                                                                   :password "correct horse battery staple"
                                                                   :display-name display-name})}))]
            (is (= 400 (.-statusCode response)))
            (is (= "invalid-display-name" (aget (.json response) "code")))))
        (is (zero? @hashes))
        (is (empty? (:principals (store/state (:store service)))))
        (is (every? #(str/starts-with? % "ceremony:") (keys @(:private (:store service))))
            "Bounded admission checkpoints are allowed; durable credential blobs are not")
        (finally (await (http/close! app)))))))
