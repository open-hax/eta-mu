(ns eta-mu.gitops-controller.infra.container-test
  (:require ["node:fs" :as node-fs]
            ["node:path" :as path]
            [cljs.test :refer [deftest is]]
            [clojure.string :as str]))

(defn- repository-root []
  (let [cwd (js/process.cwd)]
    (if (.existsSync node-fs (.join path cwd ".dockerignore"))
      cwd
      (.resolve path cwd "../.."))))

(defn- repository-file [name]
  (.join path (repository-root) name))

(def ^:private source-revision-argument "ETA_MU_SOURCE_REVISION")

(defn- dockerfile-from-images [dockerfile]
  (keep (fn [line]
          (when (str/starts-with? line "FROM ")
            (second (str/split line #" " 3))))
        (str/split-lines dockerfile)))

(deftest controller-image-build-context-is-allowlisted-and-secret-free
  (let [dockerignore (.readFileSync node-fs
                                    (repository-file ".dockerignore") "utf8")
        ignore-lines (set (str/split-lines dockerignore))
        dockerfile (.readFileSync
                    node-fs
                    (repository-file
                     "packages/gitops-controller/Dockerfile") "utf8")]
    (is (contains? ignore-lines "**"))
    (doseq [required ["!package.json"
                      "!pnpm-lock.yaml"
                      "!pnpm-workspace.yaml"
                      "!packages/gitops-controller/**"]]
      (is (contains? ignore-lines required)))
    (doseq [excluded ["**/.env.*"
                      "**/.npmrc"
                      "**/*.pem"
                      "**/*.key"
                      "**/*.p8"
                      "**/secrets/**"
                      "**/ledgers/**"
                      "**/*.nd-edn"]]
      (is (.includes dockerignore excluded)))
    (is (.includes dockerfile "COPY . ."))
    (is (.includes dockerfile "pnpm install --frozen-lockfile --ignore-scripts --filter @eta-mu/gitops-controller..."))
    (is (.includes dockerfile
                   "unlink /opt/controller/node_modules/@open-hax/eta-mu-monorepo"))
    (is (.includes dockerfile
                   "test ! -L /opt/controller/node_modules/@open-hax/eta-mu-monorepo"))
    (is (.includes dockerfile "EXPOSE 8790"))))

(deftest controller-image-provenance-is-immutable-and-observable
  (let [dockerfile (.readFileSync
                    node-fs
                    (repository-file
                     "packages/gitops-controller/Dockerfile") "utf8")
        workspace (.readFileSync
                   node-fs
                   (repository-file "pnpm-workspace.yaml") "utf8")
        from-images (dockerfile-from-images dockerfile)]
    (is (= 3 (count from-images)))
    (doseq [image from-images]
      (is (re-matches #"[^@ ]+@sha256:[0-9a-f]{64}" image)))
    (is (= 2 (count (re-seq (re-pattern (str "ARG " source-revision-argument))
                            dockerfile))))
    (is (.includes dockerfile
                   "\"\"|*[!0-9a-f]*) exit 64"))
    (is (.includes dockerfile
                   "test \"${#ETA_MU_SOURCE_REVISION}\" -eq 40"))
    (doseq [label ["org.opencontainers.image.source=\"https://github.com/open-hax/eta-mu\""
                   "org.opencontainers.image.revision=\"${ETA_MU_SOURCE_REVISION}\""
                   "org.opencontainers.image.licenses=\"GPL-3.0-or-later\""]]
      (is (.includes dockerfile label)))
    (is (.includes dockerfile "USER node"))
    (is (not (.includes workspace "allowBuilds:")))
    (is (.includes workspace "onlyBuiltDependencies:"))))

(deftest controller-ci-is-exact-revision-unprivileged-and-frozen
  (let [workflow (.readFileSync
                  node-fs
                  (repository-file ".github/workflows/gitops-controller.yml")
                  "utf8")
        lint-script (.readFileSync
                     node-fs
                     (repository-file "scripts/lint.bb")
                     "utf8")]
    (is (.includes workflow "permissions:\n  contents: read"))
    (is (.includes workflow
                   "EXPECTED_SHA: ${{ github.event.pull_request.head.sha || github.sha }}"))
    (is (= 2 (count (re-seq #"persist-credentials: false" workflow))))
    (is (= 2 (count (re-seq #"Verify exact source revision" workflow))))
    (is (.includes workflow
                   "pnpm install --frozen-lockfile --ignore-scripts --filter @eta-mu/gitops-controller..."))
    (doseq [gate ["pnpm -C packages/gitops-controller test"
                  "pnpm -C packages/gitops-controller lint:kondo"
                  "pnpm -C packages/gitops-controller build"
                  "docker build"
                  "Smoke observe-only container"
                  ".Config.User"
                  "--read-only"
                  "--cap-drop ALL"
                  "no-new-privileges:true"
                  "ETA_MU_CONTROLLER_MODE=observe-only"
                  "ETA_MU_GITHUB_APP_PRIVATE_KEY_FILE=/run/secrets/app.pem"
                  "ETA_MU_GITHUB_WEBHOOK_SECRET_FILE=/run/secrets/webhook-secret"
                  "http://127.0.0.1:18790/health/live"
                  "http://127.0.0.1:18790/health/ready"]]
      (is (.includes workflow gate)))
    (is (not (re-find #"--env ETA_MU_GITHUB_APP_PRIVATE_KEY=" workflow)))
    (is (not (re-find #"--env ETA_MU_GITHUB_WEBHOOK_SECRET=" workflow)))
    (is (not (.includes workflow "secrets.")))
    (is (not (.includes workflow "docker push")))
    (is (.includes lint-script "\"@eta-mu/gitops-controller\""))))

(deftest gate-reconciliation-workflow-is-controller-bound-and-exact-head
  (let [workflow (.readFileSync
                  node-fs
                  (repository-file
                   ".github/workflows/review-resolution-gate.yml") "utf8")]
    (doseq [input ["pr_number:" "pr_base_sha:" "pr_head_sha:"
                   "pr_merge_sha:" "command_id:"
                   "gate_check_id:" "evidence_run_id:"
                   "evidence_command_id:"]]
      (is (.includes workflow input)))
    (is (.includes workflow
                   "EXPECTED_CONTROLLER_APP_LOGIN: ${{ vars.ETA_MU_CONTROLLER_APP_LOGIN }}"))
    (is (.includes workflow "TRIGGERING_ACTOR: ${{ github.triggering_actor }}"))
    (is (.includes workflow "context.actor !== expectedActor"))
    (is (.includes workflow
                   "process.env.TRIGGERING_ACTOR !== expectedActor"))
    (is (.includes workflow "github.rest.pulls.get"))
    (is (.includes workflow "github.rest.checks.listForRef"))
    (is (.includes workflow "checks: read"))
    (is (not (.includes workflow "ETA_MU_CONTROLLER_APP_PRIVATE_KEY")))
    (is (.includes workflow "github.rest.checks.get"))
    (is (not (.includes workflow "github.rest.checks.update")))
    (is (.includes workflow
                   "eta-mu-review-gate/v2:${commandId}:${rawNumber}:${expectedHead}:${expectedBase}:${expectedMerge}"))
    (is (.includes workflow "github.rest.actions.getWorkflowRun"))
    (is (.includes workflow "EXPECTED_REVIEW_WORKFLOW_ID"))
    (is (.includes workflow "EXPECTED_REVIEW_WORKFLOW_PATH"))
    (is (.includes workflow "ETA_MU_REVIEW_PUBLISHER_APP_LOGIN"))
    (is (.includes workflow "github.rest.pulls.listReviews"))
    (is (.includes workflow "['APPROVED', 'COMMENTED']"))
    (is (.includes workflow "pullRequest.head?.sha || '') !== expectedHead"))
    (is (.includes workflow "pullRequest.base?.sha || '') !== expectedBase"))
    (is (.includes workflow
                   "pullRequest.merge_commit_sha || '') !== expectedMerge"))
    (is (.includes workflow
                   "context.eventName !== 'workflow_dispatch'"))
    (is (not (.includes workflow
                        "if: ${{ github.event_name == 'workflow_dispatch' }}")))
    (is (.includes workflow "--head-sha \"$ETA_MU_GATE_HEAD_SHA\""))
    (is (.includes workflow "attempt <= 120"))
    (is (.includes workflow "await wait(10000)"))
    (is (.includes workflow "cancel-in-progress: true"))
    (is (not (.includes workflow "--publish-check")))
    (is (not (.includes workflow "evidence_complete")))))
