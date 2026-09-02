(ns eta-mu.gitops-controller.infra.webhook-test
  (:require ["node:crypto" :as node-crypto]
            [cljs.test :refer [deftest is testing]]
            [eta-mu.gitops-controller.extern.fastify :as fastify]
            [eta-mu.gitops-controller.extern.fs :as fs]
            [eta-mu.gitops-controller.extern.json :as json]
            [eta-mu.gitops-controller.infra.server :as server]
            [eta-mu.gitops-controller.infra.store :as store]
            [eta-mu.gitops-controller.infra.worker :as worker]))

(def delivery-id "9eb17352-284c-4b55-879d-0d07f353fdee")
(def secret "test-webhook-secret")

(def payload
  {:action "labeled"
   :label {:name "eta-mu:review"}
   :installation {:id 77}
   :repository {:id 42 :full_name "open-hax/eta-mu"}
   :pull_request {:number 321 :node_id "PR_kwDOExample"}
   :sender {:id 9 :login "operator"}})

(defn- signature [text]
  (str "sha256="
       (-> (.createHmac node-crypto "sha256" secret)
           (.update text)
           (.digest "hex"))))

(defn- response-body [response]
  (-> (.-body response) json/decode))

(deftest ^:async signed-webhook-route-authenticates-before-decoding-and-deduplicates
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        enqueued* (atom [])
        controller-config {:mode :observe-only
                           :policy-revision "observe-policy-v1"
                           :body-limit 4096
                           :webhook-secret secret
                           :review-label "eta-mu:review"
                           :probe-label "eta-mu:probe"
                           :workflow "opencode-code-review.yml"
                           :gate-workflow "review-resolution-gate.yml"
                           :repository-allowlist #{"open-hax/eta-mu"}
                           :installation-allowlist #{77}}
        queue-worker (worker/create
                      {:store state-store
                       :github {}
                       :authority {}
                       :policy controller-config
                       :replay-interval-ms 5000})]
    (await (store/initialize! state-store))
    (let [app (server/create-app
               {:config controller-config
                :store state-store
                :worker queue-worker
                :enqueue! #(swap! enqueued* conj %)})
          headers {"content-type" "application/json"
                   "x-github-event" "pull_request"
                   "x-github-delivery" delivery-id}]
      (try
        (testing "readiness is gated on completed startup recovery"
          (is (= 503 (.-statusCode
                      (await (.inject app
                                      #js {:method "GET"
                                           :url "/health/ready"})))))
          (await (worker/start! queue-worker))
          (is (= 200 (.-statusCode
                      (await (.inject app
                                      #js {:method "GET"
                                           :url "/health/ready"}))))))
        (testing "an invalid signature wins over invalid JSON and stores nothing"
          (let [response (await
                          (.inject app
                                   (clj->js {:method "POST"
                                             :url "/hooks/eta-mu/github"
                                             :headers (assoc headers
                                                             "x-hub-signature-256"
                                                             (str "sha256="
                                                                  (apply str (repeat 64 "0"))))
                                             :payload "{"})))]
            (is (= 401 (.-statusCode response)))
            (is (= "invalid-signature" (:reason (response-body response))))
            (is (empty? (await (fs/entries
                                (get-in state-store [:paths :deliveries])))))))
        (testing "validly signed malformed JSON is refused without a queue entry"
          (let [raw "{"
                response (await
                          (.inject app
                                   (clj->js {:method "POST"
                                             :url "/hooks/eta-mu/github"
                                             :headers (assoc headers
                                                             "x-hub-signature-256"
                                                             (signature raw))
                                             :payload raw})))]
            (is (= 400 (.-statusCode response)))
            (is (empty? @enqueued*))))
        (testing "a valid GitHub ping is acknowledged without durable state"
          (let [ping-id "56a5d98a-87df-4d70-a40c-40a3cf109198"
                raw (json/encode {:zen "Keep it logically awesome."})
                response (await
                          (.inject app
                                   (clj->js {:method "POST"
                                             :url "/hooks/eta-mu/github"
                                             :headers (assoc headers
                                                             "x-github-event" "ping"
                                                             "x-github-delivery" ping-id
                                                             "x-hub-signature-256"
                                                             (signature raw))
                                             :payload raw})))]
            (is (= 202 (.-statusCode response)))
            (is (true? (:ignored (response-body response))))
            (is (empty? @enqueued*))
            (is (empty? (await (fs/entries
                                (get-in state-store [:paths :deliveries])))))))
        (testing "an authentic unrelated event is acknowledged without decoding it as a command"
          (let [unrelated-id "808f730f-136f-457d-b629-ceccdcf7766b"
                raw (json/encode {:action "created"
                                  :installation {:id 77}})
                response (await
                          (.inject app
                                   (clj->js {:method "POST"
                                             :url "/hooks/eta-mu/github"
                                             :headers (assoc headers
                                                             "x-github-event" "installation"
                                                             "x-github-delivery" unrelated-id
                                                             "x-hub-signature-256"
                                                             (signature raw))
                                             :payload raw})))]
            (is (= 202 (.-statusCode response)))
            (is (true? (:ignored (response-body response))))
            (is (empty? @enqueued*))
            (is (empty? (await (fs/entries
                                (get-in state-store [:paths :deliveries])))))))
        (testing "an allowlisted base-shaped unsupported event is terminal"
          (let [unsupported-id "a0000000-0000-4000-8000-000000000001"
                raw (json/encode {:action "opened"
                                  :installation {:id 77}
                                  :repository {:id 42
                                               :full_name "open-hax/eta-mu"}
                                  :sender {:id 9 :login "operator"}})
                response (await
                          (.inject app
                                   (clj->js {:method "POST"
                                             :url "/hooks/eta-mu/github"
                                             :headers (assoc headers
                                                             "x-github-event"
                                                             "push"
                                                             "x-github-delivery"
                                                             unsupported-id
                                                             "x-hub-signature-256"
                                                             (signature raw))
                                             :payload raw})))
                receipt (await (store/read-delivery state-store
                                                    unsupported-id))]
            (is (= 202 (.-statusCode response)))
            (is (true? (:ignored (response-body response))))
            (is (= "ignored" (some-> (:disposition receipt) name)))
            (is (= "unmanaged-event" (some-> (:reason receipt) name)))
            (is (empty? @enqueued*))))
        (testing "an allowlisted actionless push is terminal and deduplicated"
          (let [push-id "a0000000-0000-4000-8000-000000000004"
                raw (json/encode {:installation {:id 77}
                                  :repository {:id 42
                                               :full_name "open-hax/eta-mu"}
                                  :sender {:id 9 :login "operator"}})
                request {:method "POST"
                         :url "/hooks/eta-mu/github"
                         :headers (assoc headers
                                         "x-github-event" "push"
                                         "x-github-delivery" push-id
                                         "x-hub-signature-256" (signature raw))
                         :payload raw}
                first-response (await (.inject app (clj->js request)))
                duplicate-response (await (.inject app (clj->js request)))
                receipt (await (store/read-delivery state-store push-id))]
            (is (= 202 (.-statusCode first-response)))
            (is (false? (:duplicate (response-body first-response))))
            (is (= 202 (.-statusCode duplicate-response)))
            (is (true? (:duplicate (response-body duplicate-response))))
            (is (= "ignored" (some-> (:disposition receipt) name)))
            (is (= "unmanaged-event" (some-> (:reason receipt) name)))
            (is (not (contains?
                      (set (await (store/pending-delivery-ids state-store)))
                      push-id)))
            (is (empty? @enqueued*))))
        (testing "a managed event without an action remains state-free"
          (let [missing-action-id "a0000000-0000-4000-8000-000000000005"
                raw (json/encode (dissoc payload :action))
                response (await
                          (.inject app
                                   (clj->js {:method "POST"
                                             :url "/hooks/eta-mu/github"
                                             :headers
                                             (assoc headers
                                                    "x-github-delivery"
                                                    missing-action-id
                                                    "x-hub-signature-256"
                                                    (signature raw))
                                             :payload raw})))]
            (is (= 422 (.-statusCode response)))
            (is (false? (await (fs/path-exists?
                                (fs/join root "deliveries"
                                         (str missing-action-id ".edn"))))))))
        (testing "a disallowed repository remains state-free"
          (let [disallowed-id "a0000000-0000-4000-8000-000000000002"
                raw (json/encode
                     (assoc-in payload [:repository :full_name]
                               "open-hax/disallowed"))
                response (await
                          (.inject app
                                   (clj->js {:method "POST"
                                             :url "/hooks/eta-mu/github"
                                             :headers (assoc headers
                                                             "x-github-delivery"
                                                             disallowed-id
                                                             "x-hub-signature-256"
                                                             (signature raw))
                                             :payload raw})))]
            (is (= 403 (.-statusCode response)))
            (is (false? (await (fs/path-exists?
                                (fs/join root "deliveries"
                                         (str disallowed-id ".edn"))))))))
        (testing "ordinary labels are acknowledged with a terminal receipt"
          (let [ignored-id "97b89d7d-8fbd-42b8-9a6a-3492ddf04937"
                raw (json/encode (assoc-in payload [:label :name] "needs-docs"))
                response (await
                          (.inject app
                                   (clj->js {:method "POST"
                                             :url "/hooks/eta-mu/github"
                                             :headers (assoc headers
                                                             "x-github-delivery"
                                                             ignored-id
                                                             "x-hub-signature-256"
                                                             (signature raw))
                                             :payload raw})))]
            (is (= 202 (.-statusCode response)))
            (is (true? (:ignored (response-body response))))
            (is (empty? @enqueued*))
            (let [receipt (await (store/read-delivery state-store ignored-id))]
              (is (= "ignored" (some-> (:disposition receipt) name)))
              (is (= "unmanaged-label" (some-> (:reason receipt) name)))
              (is (= (-> (.createHash node-crypto "sha256")
                         (.update raw)
                         (.digest "hex"))
                     (:payload/sha256 receipt))))))
        (testing "one authentic delivery produces one durable command"
          (let [raw (json/encode payload)
                request {:method "POST"
                         :url "/hooks/eta-mu/github"
                         :headers (assoc headers
                                         "x-hub-signature-256"
                                         (signature raw))
                         :payload raw}
                first-response (await (.inject app (clj->js request)))
                duplicate-response (await (.inject app (clj->js request)))
                same-command-different-bytes (str raw " ")
                changed-bytes-response
                (await
                 (.inject app
                          (clj->js
                           (assoc request
                                  :headers
                                  (assoc headers
                                         "x-hub-signature-256"
                                         (signature same-command-different-bytes))
                                  :payload same-command-different-bytes))))
                conflicting-raw (json/encode
                                 (assoc-in payload [:sender :login]
                                           "different-operator"))
                conflicting-response
                (await
                 (.inject app
                          (clj->js
                           (assoc request
                                  :headers
                                  (assoc headers
                                         "x-hub-signature-256"
                                         (signature conflicting-raw))
                                  :payload conflicting-raw))))]
            (is (= 202 (.-statusCode first-response)))
            (is (false? (:duplicate (response-body first-response))))
            (is (= 202 (.-statusCode duplicate-response)))
            (is (true? (:duplicate (response-body duplicate-response))))
            (is (= 409 (.-statusCode changed-bytes-response)))
            (is (= 409 (.-statusCode conflicting-response)))
            (is (= "delivery-payload-mismatch"
                   (:reason (response-body conflicting-response))))
            (is (= [delivery-id] @enqueued*))
            (is (= delivery-id
                   (get-in (await (store/read-delivery state-store delivery-id))
                           [:command :delivery-id])))))
        (finally
          (worker/stop! queue-worker)
          (await (fastify/close! app))
          (await (fs/remove-tree! root)))))))

(deftest ^:async signed-workflow-completion-is-durable-only-for-the-controller-app
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        enqueued* (atom [])
        completion-id "56a5d98a-87df-4d70-a40c-40a3cf109198"
        hostile-id "808f730f-136f-457d-b629-ceccdcf7766b"
        controller-config {:mode :observe-only
                           :policy-revision "observe-policy-v3"
                           :body-limit 8192
                           :webhook-secret secret
                           :review-label "eta-mu:review"
                           :probe-label "eta-mu:probe"
                           :workflow "opencode-code-review.yml"
                           :gate-workflow "review-resolution-gate.yml"
                           :review-workflow-id 7001
                           :gate-workflow-id 7002
                           :controller-app-login "eta-mu-controller[bot]"
                           :repository-allowlist #{"open-hax/eta-mu"}
                           :installation-allowlist #{77}}
        queue-worker (worker/create
                      {:store state-store
                       :github {}
                       :authority {}
                       :policy controller-config
                       :replay-interval-ms 600000})
        workflow-payload
        {:action "completed"
         :installation {:id 77}
         :repository {:id 42 :full_name "open-hax/eta-mu"}
         :workflow {:id 7002
                    :path ".github/workflows/review-resolution-gate.yml"}
         :workflow_run
         {:id 991
          :node_id "WFR_gate"
          :workflow_id 7002
          :path ".github/workflows/review-resolution-gate.yml"
          :event "workflow_dispatch"
          :status "completed"
          :conclusion "success"
          :head_sha "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
          :head_branch "main"
          :run_attempt 1
          :url "https://api.github.test/runs/991"
          :html_url "https://github.test/runs/991"
          :actor {:id 501 :login "eta-mu-controller[bot]"}
          :triggering_actor {:id 501 :login "eta-mu-controller[bot]"}}
         :sender {:id 501 :login "eta-mu-controller[bot]"}}]
    (await (store/initialize! state-store))
    (let [app (server/create-app
               {:config controller-config
                :store state-store
                :worker queue-worker
                :enqueue! #(swap! enqueued* conj %)})
          request!
          (fn [actual-id actual-payload]
            (let [raw (json/encode actual-payload)]
              (.inject app
                       (clj->js
                        {:method "POST"
                         :url "/hooks/eta-mu/github"
                         :headers {"content-type" "application/json"
                                   "x-github-event" "workflow_run"
                                   "x-github-delivery" actual-id
                                   "x-hub-signature-256" (signature raw)}
                         :payload raw}))))]
      (try
        (let [accepted (await (request! completion-id workflow-payload))
              hostile (await
                       (request!
                        hostile-id
                        (assoc-in workflow-payload
                                  [:workflow_run :triggering_actor :login]
                                  "attacker")))
              command (get-in
                       (await (store/read-delivery state-store completion-id))
                       [:command])]
          (is (= 202 (.-statusCode accepted)))
          (is (false? (:duplicate (response-body accepted))))
          (is (= :review-gate-completion (:command/type command)))
          (is (= 991 (:workflow-run-id command)))
          (is (= ".github/workflows/review-resolution-gate.yml"
                 (:workflow-run-path command)))
          (is (= 202 (.-statusCode hostile)))
          (is (true? (:ignored (response-body hostile))))
          (is (= [completion-id] @enqueued*))
          (let [hostile-receipt (await (store/read-delivery state-store
                                                            hostile-id))]
            (is (= "ignored"
                   (some-> (:disposition hostile-receipt) name)))
            (is (= "untrusted-workflow-actor"
                   (some-> (:reason hostile-receipt) name)))))
        (finally
          (worker/stop! queue-worker)
          (await (fastify/close! app))
          (await (fs/remove-tree! root)))))))

(deftest ^:async ambiguous-admission-append-revokes-http-readiness
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        enqueued* (atom [])
        controller-config {:mode :observe-only
                           :policy-revision "observe-policy-v1"
                           :body-limit 4096
                           :webhook-secret secret
                           :review-label "eta-mu:review"
                           :probe-label "eta-mu:probe"
                           :workflow "opencode-code-review.yml"
                           :gate-workflow "review-resolution-gate.yml"
                           :repository-allowlist #{"open-hax/eta-mu"}
                           :installation-allowlist #{77}}
        queue-worker (worker/create
                      {:store state-store
                       :github {}
                       :authority {}
                       :policy controller-config
                       :replay-interval-ms 600000})
        raw (json/encode payload)
        request {:method "POST"
                 :url "/hooks/eta-mu/github"
                 :headers {"content-type" "application/json"
                           "x-github-event" "pull_request"
                           "x-github-delivery" delivery-id
                           "x-hub-signature-256" (signature raw)}
                 :payload raw}
        ledger-file (fs/join root "ledgers" "deliveries.nd-edn")]
    (await (store/initialize! state-store))
    (let [app (server/create-app
               {:config controller-config
                :store state-store
                :worker queue-worker
                :enqueue! #(swap! enqueued* conj %)})]
      (try
        (await (worker/start! queue-worker))
        (is (= 200 (.-statusCode
                    (await (.inject app #js {:method "GET"
                                             :url "/health/ready"})))))
        (await (fs/remove-file-if-present! ledger-file))
        (await (fs/ensure-directory! ledger-file))
        (testing "neither the original delivery nor its retry is acknowledged"
          (is (= 500 (.-statusCode
                      (await (.inject app (clj->js request))))))
          (is (= 500 (.-statusCode
                      (await (.inject app (clj->js request))))))
          (is (empty? @enqueued*)))
        (testing "liveness remains up while readiness stays revoked"
          (is (= 200 (.-statusCode
                      (await (.inject app #js {:method "GET"
                                               :url "/health/live"})))))
          (is (= 503 (.-statusCode
                      (await (.inject app #js {:method "GET"
                                               :url "/health/ready"})))))
          (await (fs/remove-tree! ledger-file))
          ;; Repairing the filesystem cannot silently re-authorize a poisoned
          ;; in-memory cache; startup reconciliation is required.
          (is (= 503 (.-statusCode
                      (await (.inject app #js {:method "GET"
                                               :url "/health/ready"}))))))
        (finally
          (worker/stop! queue-worker)
          (await (fastify/close! app))
          (await (fs/remove-tree! root)))))))

(deftest ^:async signed-review-lifecycle-events-and-probe-are-durable-commands
  (let [root (await (fs/temporary-directory!))
        state-store (store/create root)
        enqueued* (atom [])
        resolved-id "56a5d98a-87df-4d70-a40c-40a3cf109198"
        unresolved-id "97b89d7d-8fbd-42b8-9a6a-3492ddf04937"
        comment-id "c9b71e08-70c0-41f5-bc2b-11a978cf7ca6"
        submitted-id "193cbef4-af2f-4bc0-a73a-f4ac06ecb92c"
        dismissed-id "d0cfe1b8-4952-4331-8b36-3f53af75d33e"
        probe-id "808f730f-136f-457d-b629-ceccdcf7766b"
        synchronize-id "a0000000-0000-4000-8000-000000000001"
        base-edit-id "a0000000-0000-4000-8000-000000000002"
        ordinary-edit-id "a0000000-0000-4000-8000-000000000003"
        ignored-id "fb0e2552-a3e3-43f4-86bb-c8857617c463"
        controller-config {:mode :observe-only
                           :policy-revision "observe-policy-v2"
                           :body-limit 4096
                           :webhook-secret secret
                           :review-label "eta-mu:review"
                           :probe-label "eta-mu:probe"
                           :workflow "opencode-code-review.yml"
                           :gate-workflow "review-resolution-gate.yml"
                           :repository-allowlist #{"open-hax/eta-mu"}
                           :installation-allowlist #{77}}
        queue-worker (worker/create
                      {:store state-store
                       :github {}
                       :authority {}
                       :policy controller-config
                       :replay-interval-ms 600000})]
    (await (store/initialize! state-store))
    (let [app (server/create-app
               {:config controller-config
                :store state-store
                :worker queue-worker
                :enqueue! #(swap! enqueued* conj %)})
          request!
          (fn [event actual-delivery-id actual-payload]
            (let [raw (json/encode actual-payload)]
              (.inject app
                       (clj->js
                        {:method "POST"
                         :url "/hooks/eta-mu/github"
                         :headers {"content-type" "application/json"
                                   "x-github-event" event
                                   "x-github-delivery" actual-delivery-id
                                   "x-hub-signature-256" (signature raw)}
                         :payload raw}))))]
      (try
        (let [review-payload (dissoc payload :label)
              resolved-payload (assoc review-payload
                                      :action "resolved"
                                      :thread {:node_id "PRRT_example"})
              resolved-response
              (await (request! "pull_request_review_thread"
                               resolved-id resolved-payload))
              unresolved-response
              (await (request! "pull_request_review_thread"
                               unresolved-id
                               (assoc resolved-payload :action "unresolved")))
              comment-payload (assoc review-payload
                                     :action "created"
                                     :comment {:node_id "PRRC_example"})
              comment-response
              (await (request! "pull_request_review_comment"
                               comment-id comment-payload))
              submitted-payload (assoc review-payload
                                       :action "submitted"
                                       :review {:node_id "PRR_example"})
              submitted-response
              (await (request! "pull_request_review"
                               submitted-id submitted-payload))
              dismissed-response
              (await (request! "pull_request_review"
                               dismissed-id
                               (assoc submitted-payload :action "dismissed")))
              ignored-response
              (await (request! "pull_request_review_comment"
                               ignored-id
                               (assoc comment-payload :action "edited")))
              probe-payload (assoc-in payload [:label :name] "eta-mu:probe")
              probe-response (await (request! "pull_request" probe-id
                                              probe-payload))
              probe-duplicate (await (request! "pull_request" probe-id
                                               probe-payload))
              synchronize-response
              (await (request! "pull_request" synchronize-id
                               (assoc review-payload :action "synchronize")))
              base-edit-response
              (await (request!
                      "pull_request" base-edit-id
                      (assoc review-payload :action "edited"
                             :changes {:base {:ref {:from "release"}}})))
              ordinary-edit-response
              (await (request! "pull_request" ordinary-edit-id
                               (assoc review-payload :action "edited")))
              resolved-command
              (get-in (await (store/read-delivery state-store resolved-id))
                      [:command])
              comment-command
              (get-in (await (store/read-delivery state-store comment-id))
                      [:command])
              probe-command
              (get-in (await (store/read-delivery state-store probe-id))
                      [:command])
              synchronize-command
              (get-in (await (store/read-delivery state-store synchronize-id))
                      [:command])]
          (doseq [response [resolved-response unresolved-response
                            comment-response submitted-response
                            dismissed-response]]
            (is (= 202 (.-statusCode response)))
            (is (false? (:duplicate (response-body response)))))
          (is (= 202 (.-statusCode ignored-response)))
          (is (true? (:ignored (response-body ignored-response))))
          (is (= 202 (.-statusCode probe-response)))
          (is (false? (:duplicate (response-body probe-response))))
          (is (true? (:duplicate (response-body probe-duplicate))))
          (is (= 202 (.-statusCode synchronize-response)))
          (is (= 202 (.-statusCode base-edit-response)))
          (is (true? (:ignored (response-body ordinary-edit-response))))
          (is (= :review-gate-reconcile (:command/type resolved-command)))
          (is (= "PRRT_example" (:review-thread-node-id resolved-command)))
          (is (= :review-gate-reconcile (:command/type comment-command)))
          (is (= "PRRC_example"
                 (:review-comment-node-id comment-command)))
          (is (= :ingress-probe (:command/type probe-command)))
          (is (= :review-gate-invalidate
                 (:command/type synchronize-command)))
          (is (= [resolved-id unresolved-id comment-id submitted-id
                  dismissed-id probe-id synchronize-id base-edit-id]
                 @enqueued*))
          (doseq [[ignored-delivery-id reason]
                  [[ignored-id "unmanaged-action"]
                   [ordinary-edit-id "unmanaged-action"]]]
            (let [receipt (await (store/read-delivery state-store
                                                      ignored-delivery-id))]
              (is (= "ignored" (some-> (:disposition receipt) name)))
              (is (= reason (some-> (:reason receipt) name))))))
        (finally
          (worker/stop! queue-worker)
          (await (fastify/close! app))
          (await (fs/remove-tree! root)))))))
