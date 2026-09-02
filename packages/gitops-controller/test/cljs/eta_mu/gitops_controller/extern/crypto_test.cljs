(ns eta-mu.gitops-controller.extern.crypto-test
  (:require ["node:crypto" :as node-crypto]
            [cljs.test :refer [deftest is testing]]
            [eta-mu.gitops-controller.extern.crypto :as crypto]
            [eta-mu.gitops-controller.infra.config :as config]
            [eta-mu.gitops-controller.law.webhook :as law]))

(defn- rsa-private-key-fixture []
  (let [key-pair (.generateKeyPairSync node-crypto "rsa"
                                       #js {:modulusLength 1024})]
    (.export (.-privateKey key-pair)
             #js {:type "pkcs8" :format "pem"})))

(deftest startup-credential-contracts-fail-closed
  (let [valid-rsa-private-key (rsa-private-key-fixture)]
    (testing "webhook secrets must be nonblank and at least 32 characters"
      (is (law/webhook-secret? "0123456789abcdef0123456789abcdef"))
      (is (false? (law/webhook-secret? "short")))
      (is (false? (law/webhook-secret? (apply str (repeat 32 " ")))))
      (is (false? (law/webhook-secret?
                   (str "short" (apply str (repeat 32 " ")))))))
    (testing "only a parseable RSA private key satisfies the App boundary"
      (is (crypto/rsa-private-key? valid-rsa-private-key))
      (is (false? (crypto/rsa-private-key? "not a private key"))))
    (testing "the loaded configuration checks both credentials before startup"
      (is (nil? (config/validate-credentials!
                 {:github-private-key valid-rsa-private-key
                  :webhook-secret "0123456789abcdef0123456789abcdef"})))
      (is (= "ETA_MU_GITHUB_WEBHOOK_SECRET"
             (:field
              (ex-data
               (try
                 (config/validate-credentials!
                  {:github-private-key valid-rsa-private-key
                   :webhook-secret "short"})
                 (catch :default error error))))))
      (is (= "ETA_MU_GITHUB_APP_PRIVATE_KEY"
             (:field
              (ex-data
               (try
                 (config/validate-credentials!
                  {:github-private-key "not a private key"
                   :webhook-secret "0123456789abcdef0123456789abcdef"})
                 (catch :default error error)))))))))
