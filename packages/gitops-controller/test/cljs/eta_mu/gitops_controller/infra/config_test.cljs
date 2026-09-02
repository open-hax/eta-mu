(ns eta-mu.gitops-controller.infra.config-test
  (:require ["node:crypto" :as node-crypto]
            [cljs.test :refer [deftest is testing]]
            [eta-mu.gitops-controller.infra.config :as config]
            [eta-mu.gitops-controller.law.webhook :as law]))

(def environment-names
  ["ETA_MU_CONTROLLER_MODE"
   "ETA_MU_PROJECT_ID"
   "ETA_MU_CONTROLLER_APP_LOGIN"
   "ETA_MU_CONTROLLER_DEPLOYMENT_ID"
   "ETA_MU_CONTROLLER_ACTIVE_MARKER_FILE"
   "ETA_MU_CONTROLLER_CANARY_DELIVERY_IDS"
   "ETA_MU_GITHUB_APP_ID"
   "ETA_MU_GITHUB_APP_PRIVATE_KEY"
   "ETA_MU_GITHUB_APP_PRIVATE_KEY_FILE"
   "ETA_MU_GITHUB_WEBHOOK_SECRET"
   "ETA_MU_GITHUB_WEBHOOK_SECRET_FILE"
   "ETA_MU_GITHUB_INSTALLATION_ALLOWLIST"
   "ETA_MU_GITHUB_REPOSITORY_ALLOWLIST"
   "ETA_MU_GITHUB_REVIEW_LABEL"
   "ETA_MU_GITHUB_PROBE_LABEL"
   "ETA_MU_GITHUB_REVIEW_WORKFLOW"
   "ETA_MU_GITHUB_GATE_WORKFLOW"
   "ETA_MU_GITHUB_REVIEW_WORKFLOW_ID"
   "ETA_MU_GITHUB_GATE_WORKFLOW_ID"])

(defn- private-key []
  (let [pair (.generateKeyPairSync node-crypto "rsa"
                                   #js {:modulusLength 1024})]
    (.export (.-privateKey pair) #js {:type "pkcs8" :format "pem"})))

(defn- set-environment! [name value]
  (if (nil? value)
    (js-delete (.-env js/process) name)
    (aset (.-env js/process) name value)))

(deftest policy-revision-basis-is-explicit-and-order-independent
  (let [policy-a {:mode :review-dispatch
                  :project-id "eta-mu"
                  :review-label "eta-mu:review"
                  :probe-label "eta-mu:probe"
                  :workflow "opencode-code-review.yml"
                  :gate-workflow "review-resolution-gate.yml"
                  :review-workflow-id 7001
                  :gate-workflow-id 7002
                  :controller-app-login "eta-mu-controller[bot]"
                  :repository-allowlist
                  (conj #{} "open-hax/services" "open-hax/eta-mu")
                  :installation-allowlist (conj #{} 88 77)}
        policy-b (assoc policy-a
                        :repository-allowlist
                        (conj #{} "open-hax/eta-mu" "open-hax/services")
                        :installation-allowlist (conj #{} 77 88))
        expected [["policy/version" 1]
                  ["mode" "review-dispatch"]
                  ["project-id" "eta-mu"]
                  ["review-label" "eta-mu:review"]
                  ["probe-label" "eta-mu:probe"]
                  ["workflow" "opencode-code-review.yml"]
                  ["gate-workflow" "review-resolution-gate.yml"]
                  ["review-workflow-id" 7001]
                  ["gate-workflow-id" 7002]
                  ["controller-app-login" "eta-mu-controller[bot]"]
                  ["repository-allowlist"
                   ["open-hax/eta-mu" "open-hax/services"]]
                  ["installation-allowlist" [77 88]]]]
    (is (= expected (config/policy-revision-basis policy-a)))
    (is (= expected (config/policy-revision-basis policy-b)))))

(deftest ^:async configuration-binds-command-and-effect-lease-contracts
  (let [saved (into {} (map (fn [name]
                              [name (aget (.-env js/process) name)])
                            environment-names))
        first-canary "9eb17352-284c-4b55-879d-0d07f353fdee"
        second-canary "56a5d98a-87df-4d70-a40c-40a3cf109198"]
    (try
      (doseq [[name value]
              {"ETA_MU_CONTROLLER_MODE" "review-dispatch"
               "ETA_MU_PROJECT_ID" "eta-mu"
               "ETA_MU_CONTROLLER_APP_LOGIN" "eta-mu-controller[bot]"
               "ETA_MU_CONTROLLER_DEPLOYMENT_ID" "100-1"
               "ETA_MU_CONTROLLER_ACTIVE_MARKER_FILE"
               "/run/eta-mu-controller-release-state/.active-release"
               "ETA_MU_CONTROLLER_CANARY_DELIVERY_IDS"
               (str first-canary "," second-canary)
               "ETA_MU_GITHUB_APP_ID" "123"
               "ETA_MU_GITHUB_APP_PRIVATE_KEY" (private-key)
               "ETA_MU_GITHUB_APP_PRIVATE_KEY_FILE" nil
               "ETA_MU_GITHUB_WEBHOOK_SECRET"
               "0123456789abcdef0123456789abcdef"
               "ETA_MU_GITHUB_WEBHOOK_SECRET_FILE" nil
               "ETA_MU_GITHUB_INSTALLATION_ALLOWLIST" "77"
               "ETA_MU_GITHUB_REPOSITORY_ALLOWLIST" "open-hax/eta-mu"
               "ETA_MU_GITHUB_REVIEW_LABEL" "eta-mu:review"
               "ETA_MU_GITHUB_PROBE_LABEL" "eta-mu:probe"
               "ETA_MU_GITHUB_REVIEW_WORKFLOW" "eta-mu-review.yml"
               "ETA_MU_GITHUB_GATE_WORKFLOW" "eta-mu-review-gate.yml"
               "ETA_MU_GITHUB_REVIEW_WORKFLOW_ID" "7001"
               "ETA_MU_GITHUB_GATE_WORKFLOW_ID" "7002"}]
        (set-environment! name value))
      (let [loaded (await (config/load!))]
        (is (= :review-dispatch (:mode loaded)))
        (is (= "eta-mu" (:project-id loaded)))
        (is (= "eta-mu-review-gate.yml" (:gate-workflow loaded)))
        (is (= 7001 (:review-workflow-id loaded)))
        (is (= 7002 (:gate-workflow-id loaded)))
        (is (= "eta-mu-controller[bot]" (:controller-app-login loaded)))
        (is (= "eta-mu:probe" (:probe-label loaded)))
        (is (= "100-1" (:deployment-id loaded)))
        (is (= #{first-canary second-canary}
               (:canary-delivery-ids loaded))))
      (testing "review and reconciliation effects cannot share a workflow"
        (set-environment! "ETA_MU_GITHUB_GATE_WORKFLOW" "eta-mu-review.yml")
        (is (= "ETA_MU_GITHUB_GATE_WORKFLOW"
               (:field
                (ex-data
                 (try (await (config/load!))
                      nil
                      (catch :default error error)))))))
      (testing "canary authority is an exact delivery-GUID set"
        (set-environment! "ETA_MU_GITHUB_GATE_WORKFLOW"
                          "eta-mu-review-gate.yml")
        (set-environment! "ETA_MU_CONTROLLER_CANARY_DELIVERY_IDS"
                          "not-a-guid")
        (is (= "ETA_MU_CONTROLLER_CANARY_DELIVERY_IDS"
               (:field
                (ex-data
                 (try (await (config/load!))
                      nil
                      (catch :default error error)))))))
      (testing "observe-only mode rejects every canary mutation bypass"
        (set-environment! "ETA_MU_CONTROLLER_CANARY_DELIVERY_IDS"
                          first-canary)
        (set-environment! "ETA_MU_CONTROLLER_MODE" "observe-only")
        (let [error (try (await (config/load!))
                         nil
                         (catch :default value value))]
          (is (= "ETA_MU_CONTROLLER_CANARY_DELIVERY_IDS"
                 (:field (ex-data error)))))
        (set-environment! "ETA_MU_CONTROLLER_CANARY_DELIVERY_IDS" "")
        (set-environment! "ETA_MU_CONTROLLER_MODE" "review-dispatch"))
      (testing "repository-scoped workflow IDs keep the canary single-repository"
        (set-environment! "ETA_MU_CONTROLLER_CANARY_DELIVERY_IDS" "")
        (set-environment! "ETA_MU_GITHUB_REPOSITORY_ALLOWLIST"
                          "open-hax/eta-mu,open-hax/services")
        (is (= "ETA_MU_GITHUB_REPOSITORY_ALLOWLIST"
               (:field
                (ex-data
                 (try (await (config/load!))
                      nil
                      (catch :default error error))))))
        (set-environment! "ETA_MU_GITHUB_REPOSITORY_ALLOWLIST"
                          "open-hax/eta-mu"))
      (testing "observe-only startup has no later-mutation configuration"
        (set-environment! "ETA_MU_CONTROLLER_MODE" "observe-only")
        (set-environment! "ETA_MU_GITHUB_REPOSITORY_ALLOWLIST"
                          "open-hax/eta-mu,open-hax/services")
        (doseq [name ["ETA_MU_CONTROLLER_APP_LOGIN"
                      "ETA_MU_CONTROLLER_DEPLOYMENT_ID"
                      "ETA_MU_CONTROLLER_ACTIVE_MARKER_FILE"
                      "ETA_MU_GITHUB_REVIEW_WORKFLOW_ID"
                      "ETA_MU_GITHUB_GATE_WORKFLOW_ID"]]
          (set-environment! name nil))
        (let [loaded (await (config/load!))]
          (is (= :observe-only (:mode loaded)))
          (is (= #{"open-hax/eta-mu" "open-hax/services"}
                 (:repository-allowlist loaded)))
          (is (nil? (:controller-app-login loaded)))
          (is (nil? (:deployment-id loaded)))
          (is (nil? (:active-marker-file loaded)))
          (is (nil? (:review-workflow-id loaded)))
          (is (nil? (:gate-workflow-id loaded)))
          (is (string? (:policy-revision loaded)))))
      (testing "the active marker has one exact LF-terminated wire format"
        (is (= "100-1" (law/active-marker-deployment "100-1\n")))
        (is (nil? (law/active-marker-deployment "100-1")))
        (is (nil? (law/active-marker-deployment "100-1\nextra\n"))))
      (testing "project identity is required and line-safe"
        (set-environment! "ETA_MU_PROJECT_ID" "../eta-mu")
        (is (= "ETA_MU_PROJECT_ID"
               (:field
                (ex-data
                 (try (await (config/load!))
                      nil
                      (catch :default error error)))))))
      (finally
        (doseq [[name value] saved]
          (set-environment! name value))))))
