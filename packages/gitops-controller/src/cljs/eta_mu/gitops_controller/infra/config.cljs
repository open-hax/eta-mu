(ns eta-mu.gitops-controller.infra.config
  "Environment decoding for the controller. Secret-file inputs take precedence."
  (:require [clojure.string :as str]
            [eta-mu.gitops-controller.extern.crypto :as crypto]
            [eta-mu.gitops-controller.extern.fs :as fs]
            [eta-mu.gitops-controller.extern.json :as json]
            [eta-mu.gitops-controller.extern.runtime :as runtime]
            [eta-mu.gitops-controller.law.webhook :as law]))

(defn- parse-positive-integer [name value]
  (let [parsed (js/Number value)]
    (when-not (law/positive-integer? parsed)
      (throw (ex-info (str name " must be a positive integer") {:field name})))
    parsed))

(defn- comma-set [value]
  (->> (str/split (or value "") #",")
       (map str/trim)
       (remove str/blank?)
       set))

(defn- integer-set [name value]
  (set (map #(parse-positive-integer name %) (comma-set value))))

(defn- required [name]
  (or (runtime/environment name)
      (throw (ex-info (str name " is required") {:field name}))))

(defn- controller-mode [value]
  (let [mode (keyword value)]
    (when-not (contains? law/controller-modes mode)
      (throw (ex-info
              "ETA_MU_CONTROLLER_MODE must be observe-only or review-dispatch"
              {:field "ETA_MU_CONTROLLER_MODE"})))
    mode))

(defn- ^:async secret
  [file-name value-name]
  (if-let [file (runtime/environment file-name)]
    (await (fs/read-secret-file file))
    (str/trim (required value-name))))

(defn- policy-revision
  [{:keys [mode review-label probe-label workflow gate-workflow
           review-workflow-id gate-workflow-id controller-app-login
           repository-allowlist
           installation-allowlist]}]
  (crypto/sha256-text
   (json/encode
    {:policy/version 1
     :mode mode
     :review-label review-label
     :probe-label probe-label
     :workflow workflow
     :gate-workflow gate-workflow
     :review-workflow-id review-workflow-id
     :gate-workflow-id gate-workflow-id
     :controller-app-login controller-app-login
     :repository-allowlist (vec (sort repository-allowlist))
     :installation-allowlist (vec (sort installation-allowlist))})))

(defn validate-credentials!
  [{:keys [github-private-key webhook-secret]}]
  (when-not (law/webhook-secret? webhook-secret)
    (throw (ex-info
            "GitHub webhook secret must contain at least 32 characters"
            {:field "ETA_MU_GITHUB_WEBHOOK_SECRET"})))
  (when-not (crypto/rsa-private-key? github-private-key)
    (throw (ex-info
            "GitHub App private key must be a valid RSA private key"
            {:field "ETA_MU_GITHUB_APP_PRIVATE_KEY"})))
  nil)

(defn ^:async load!
  []
  (let [repository-allowlist
        (comma-set (required "ETA_MU_GITHUB_REPOSITORY_ALLOWLIST"))
        installation-allowlist
        (integer-set "ETA_MU_GITHUB_INSTALLATION_ALLOWLIST"
                     (required "ETA_MU_GITHUB_INSTALLATION_ALLOWLIST"))
        port (parse-positive-integer "ETA_MU_CONTROLLER_PORT"
                                     (or (runtime/environment "ETA_MU_CONTROLLER_PORT")
                                         "8790"))
        body-limit (parse-positive-integer
                    "ETA_MU_WEBHOOK_BODY_LIMIT_BYTES"
                    (or (runtime/environment "ETA_MU_WEBHOOK_BODY_LIMIT_BYTES")
                        "1048576"))
        review-label (or (runtime/environment "ETA_MU_GITHUB_REVIEW_LABEL")
                         law/review-command-label)
        probe-label (or (runtime/environment "ETA_MU_GITHUB_PROBE_LABEL")
                        law/probe-command-label)
        workflow (or (runtime/environment "ETA_MU_GITHUB_REVIEW_WORKFLOW")
                     "opencode-code-review.yml")
        gate-workflow
        (or (runtime/environment "ETA_MU_GITHUB_GATE_WORKFLOW")
            "review-resolution-gate.yml")
        review-workflow-id
        (parse-positive-integer
         "ETA_MU_GITHUB_REVIEW_WORKFLOW_ID"
         (required "ETA_MU_GITHUB_REVIEW_WORKFLOW_ID"))
        gate-workflow-id
        (parse-positive-integer
         "ETA_MU_GITHUB_GATE_WORKFLOW_ID"
         (required "ETA_MU_GITHUB_GATE_WORKFLOW_ID"))
        controller-app-login (required "ETA_MU_CONTROLLER_APP_LOGIN")
        deployment-id (required "ETA_MU_CONTROLLER_DEPLOYMENT_ID")
        active-marker-file
        (required "ETA_MU_CONTROLLER_ACTIVE_MARKER_FILE")
        canary-delivery-ids
        (comma-set (runtime/environment
                    "ETA_MU_CONTROLLER_CANARY_DELIVERY_IDS"))
        github-private-key
        (await (secret "ETA_MU_GITHUB_APP_PRIVATE_KEY_FILE"
                       "ETA_MU_GITHUB_APP_PRIVATE_KEY"))
        webhook-secret
        (await (secret "ETA_MU_GITHUB_WEBHOOK_SECRET_FILE"
                       "ETA_MU_GITHUB_WEBHOOK_SECRET"))
        mode (controller-mode
              (or (runtime/environment "ETA_MU_CONTROLLER_MODE")
                  "observe-only"))
        policy {:mode mode
                :review-label review-label
                :probe-label probe-label
                :workflow workflow
                :gate-workflow gate-workflow
                :review-workflow-id review-workflow-id
                :gate-workflow-id gate-workflow-id
                :controller-app-login controller-app-login
                :repository-allowlist repository-allowlist
                :installation-allowlist installation-allowlist}]
    (when (empty? repository-allowlist)
      (throw (ex-info "repository allowlist must not be empty"
                      {:field "ETA_MU_GITHUB_REPOSITORY_ALLOWLIST"})))
    (when-not (= 1 (count repository-allowlist))
      (throw (ex-info
              "the canary controller requires exactly one repository because workflow IDs are repository-scoped"
              {:field "ETA_MU_GITHUB_REPOSITORY_ALLOWLIST"})))
    (when-not (every? law/repository-full-name? repository-allowlist)
      (throw (ex-info "repository allowlist contains an invalid full name"
                      {:field "ETA_MU_GITHUB_REPOSITORY_ALLOWLIST"})))
    (when (empty? installation-allowlist)
      (throw (ex-info "installation allowlist must not be empty"
                      {:field "ETA_MU_GITHUB_INSTALLATION_ALLOWLIST"})))
    (when-not (law/review-command-label? review-label)
      (throw (ex-info
              "ETA_MU_GITHUB_REVIEW_LABEL must be eta-mu:review"
              {:field "ETA_MU_GITHUB_REVIEW_LABEL"})))
    (when-not (law/probe-command-label? probe-label)
      (throw (ex-info
              "ETA_MU_GITHUB_PROBE_LABEL must be eta-mu:probe"
              {:field "ETA_MU_GITHUB_PROBE_LABEL"})))
    (when-not (law/workflow-file? workflow)
      (throw (ex-info
              "ETA_MU_GITHUB_REVIEW_WORKFLOW must be a workflow YAML file name"
              {:field "ETA_MU_GITHUB_REVIEW_WORKFLOW"})))
    (when-not (law/workflow-file? gate-workflow)
      (throw (ex-info
              "ETA_MU_GITHUB_GATE_WORKFLOW must be a workflow YAML file name"
              {:field "ETA_MU_GITHUB_GATE_WORKFLOW"})))
    (when (= workflow gate-workflow)
      (throw (ex-info
              "review and gate reconciliation workflows must be distinct"
              {:field "ETA_MU_GITHUB_GATE_WORKFLOW"})))
    (when (= review-workflow-id gate-workflow-id)
      (throw (ex-info
              "review and gate workflow IDs must be distinct"
              {:field "ETA_MU_GITHUB_GATE_WORKFLOW_ID"})))
    (when-not (law/app-bot-login? controller-app-login)
      (throw (ex-info
              "ETA_MU_CONTROLLER_APP_LOGIN must be the exact App bot login"
              {:field "ETA_MU_CONTROLLER_APP_LOGIN"})))
    (when-not (law/deployment-id? deployment-id)
      (throw (ex-info
              "ETA_MU_CONTROLLER_DEPLOYMENT_ID must be run-id-attempt"
              {:field "ETA_MU_CONTROLLER_DEPLOYMENT_ID"})))
    (when-not (str/starts-with? active-marker-file "/")
      (throw (ex-info
              "ETA_MU_CONTROLLER_ACTIVE_MARKER_FILE must be absolute"
              {:field "ETA_MU_CONTROLLER_ACTIVE_MARKER_FILE"})))
    (when-not (every? law/delivery-id? canary-delivery-ids)
      (throw (ex-info
              "ETA_MU_CONTROLLER_CANARY_DELIVERY_IDS contains an invalid GUID"
              {:field "ETA_MU_CONTROLLER_CANARY_DELIVERY_IDS"})))
    (validate-credentials! {:github-private-key github-private-key
                            :webhook-secret webhook-secret})
    {:mode mode
     :policy-revision (policy-revision policy)
     :host (or (runtime/environment "ETA_MU_CONTROLLER_HOST") "0.0.0.0")
     :port port
     :body-limit body-limit
     :state-root (or (runtime/environment "ETA_MU_CONTROLLER_STATE_ROOT")
                     "/srv/open-hax/state/eta-mu-controller")
     :review-label review-label
     :probe-label probe-label
     :workflow workflow
     :gate-workflow gate-workflow
     :review-workflow-id review-workflow-id
     :gate-workflow-id gate-workflow-id
     :controller-app-login controller-app-login
     :deployment-id deployment-id
     :active-marker-file active-marker-file
     :canary-delivery-ids canary-delivery-ids
     :github-api-url (or (runtime/environment "ETA_MU_GITHUB_API_URL")
                         "https://api.github.com")
     :github-app-id (parse-positive-integer
                     "ETA_MU_GITHUB_APP_ID"
                     (required "ETA_MU_GITHUB_APP_ID"))
     :github-private-key github-private-key
     :webhook-secret webhook-secret
     :repository-allowlist repository-allowlist
     :installation-allowlist installation-allowlist
     :replay-interval-ms
     (parse-positive-integer
      "ETA_MU_REPLAY_INTERVAL_MS"
      (or (runtime/environment "ETA_MU_REPLAY_INTERVAL_MS") "5000"))}))
