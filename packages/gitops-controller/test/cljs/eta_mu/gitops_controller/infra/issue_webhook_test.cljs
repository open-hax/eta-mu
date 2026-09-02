(ns eta-mu.gitops-controller.infra.issue-webhook-test
  (:require ["node:crypto" :as node-crypto]
            [cljs.test :refer [deftest is]]
            [eta-mu.gitops-controller.extern.fs :as fs]
            [eta-mu.gitops-controller.extern.json :as json]
            [eta-mu.gitops-controller.infra.store :as store]
            [eta-mu.gitops-controller.infra.webhook :as webhook]))

(def secret "0123456789abcdef0123456789abcdef")

(def config
  {:mode :observe-only
   :project-id "eta-mu"
   :policy-revision "observe-policy-v1"
   :webhook-secret secret
   :review-label "eta-mu:review"
   :probe-label "eta-mu:probe"
   :workflow "opencode-code-review.yml"
   :gate-workflow "review-resolution-gate.yml"
   :repository-allowlist #{"open-hax/eta-mu"}
   :installation-allowlist #{77}})

(def payload
  {:action "labeled"
   :label {:name "eta-mu:probe"}
   :installation {:id 77}
   :repository {:id 42 :full_name "open-hax/eta-mu"}
   :issue {:number 320 :node_id "I_kwDOExample"}
   :sender {:id 9 :login "operator"}})

(defn- raw-body [value]
  (js/Buffer.from (json/encode value) "utf8"))

(defn- signature [body]
  (str "sha256="
       (-> (.createHmac node-crypto "sha256" secret)
           (.update body)
           (.digest "hex"))))

(defn- headers [delivery-id body]
  {:signature (signature body)
   :delivery-id delivery-id
   :event "issues"})

(deftest ^:async signed-issue-probe-is-the-only-durable-issue-command
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        enqueued* (atom [])
        delivery-id "9eb17352-284c-4b55-879d-0d07f353fdee"
        ignored-id "56a5d98a-87df-4d70-a40c-40a3cf109198"
        pull-request-id "808f730f-136f-457d-b629-ceccdcf7766b"
        body (raw-body payload)]
    (try
      (await (store/initialize! state-store))
      (let [invalid
            (await
             (webhook/handle!
              config state-store #(swap! enqueued* conj %)
              (assoc (headers delivery-id body)
                     :signature
                     (str "sha256=" (apply str (repeat 64 "0"))))
              body))
            accepted
            (await
             (webhook/handle! config state-store #(swap! enqueued* conj %)
                              (headers delivery-id body) body))
            duplicate
            (await
             (webhook/handle! config state-store #(swap! enqueued* conj %)
                              (headers delivery-id body) body))
            ignored-body (raw-body (assoc payload :action "edited"))
            ignored
            (await
             (webhook/handle!
              config state-store #(swap! enqueued* conj %)
              (headers ignored-id ignored-body) ignored-body))
            pull-request-body
            (raw-body (assoc-in payload [:issue :pull_request]
                                {:url
                                 "https://api.github.test/repos/open-hax/eta-mu/pulls/320"}))
            pull-request-response
            (await
             (webhook/handle!
              config state-store #(swap! enqueued* conj %)
              (headers pull-request-id pull-request-body)
              pull-request-body))
            command
            (get-in (await (store/read-delivery state-store delivery-id))
                    [:command])]
        (is (= 401 (:status invalid)))
        (is (= 202 (:status accepted)))
        (is (false? (get-in accepted [:body :duplicate])))
        (is (true? (get-in duplicate [:body :duplicate])))
        (is (= 202 (:status ignored)))
        (is (true? (get-in ignored [:body :ignored])))
        (is (= 422 (:status pull-request-response)))
        (is (= "pull-request-is-not-an-issue"
               (get-in pull-request-response [:body :reason])))
        (is (= :issue-probe (keyword (:command/type command))))
        (is (= 320 (:issue-number command)))
        (is (= "I_kwDOExample" (:issue-node-id command)))
        (is (false? (:issue-pull-request? command)))
        (is (= 9 (:sender-id command)))
        (is (= 42 (:repository-id command)))
        (is (= 77 (:installation-id command)))
        (is (= [delivery-id] @enqueued*))
        (is (= [delivery-id]
               (await (store/pending-delivery-ids state-store)))))
      (finally
        (await (fs/remove-tree! root))))))
