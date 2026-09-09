(ns eta-mu.gitops-controller.extern.webhook-test
  (:require ["node:crypto" :as node-crypto]
            [cljs.test :refer [deftest is testing]]
            [eta-mu.gitops-controller.extern.json :as json]
            [eta-mu.gitops-controller.extern.webhook :as webhook]))

(def secret "0123456789abcdef0123456789abcdef")
(def delivery-id "9eb17352-284c-4b55-879d-0d07f353fdee")

(defn- signature [body]
  (str "sha256="
       (-> (.createHmac node-crypto "sha256" secret)
           (.update body)
           (.digest "hex"))))

(defn- request [body supplied-signature]
  #js {:headers #js {"x-hub-signature-256" supplied-signature
                     "x-github-delivery" delivery-id
                     "x-github-event" "issues"}
       :body body})

(deftest raw-webhook-admission-returns-only-shaped-cljs-data
  (testing "the Fastify parser must supply an exact Node buffer"
    (is (= {:webhook/status :raw-body-required}
           (webhook/admit-request secret (request "{}" nil)))))
  (testing "authentication precedes JSON decoding"
    (let [body (js/Buffer.from "{" "utf8")]
      (is (= {:webhook/status :invalid-signature}
             (webhook/admit-request
              secret (request body
                              (str "sha256=" (apply str (repeat 64 "0")))))))
      (is (= {:webhook/status :invalid-json}
             (webhook/admit-request secret
                                    (request body (signature body)))))))
  (testing "an authentic body leaves the boundary as CLJS values"
    (let [payload {:action "labeled"
                   :repository {:id 42 :full_name "open-hax/eta-mu"}}
          raw (js/Buffer.from (json/encode payload) "utf8")
          expected-hash (-> (.createHash node-crypto "sha256")
                            (.update raw)
                            (.digest "hex"))]
      (is (= {:webhook/status :authenticated
              :delivery-id delivery-id
              :event "issues"
              :payload payload
              :payload/sha256 expected-hash}
             (webhook/admit-request secret
                                    (request raw (signature raw))))))))
