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
                      "**/*.ndjson"]]
      (is (.includes dockerignore excluded)))
    (is (.includes dockerfile "COPY . ."))
    (is (.includes dockerfile "pnpm install --frozen-lockfile --ignore-scripts --filter @eta-mu/gitops-controller..."))
    (is (.includes dockerfile
                   "unlink /opt/controller/node_modules/@open-hax/eta-mu-monorepo"))
    (is (.includes dockerfile
                   "test ! -L /opt/controller/node_modules/@open-hax/eta-mu-monorepo"))
    (is (.includes dockerfile "EXPOSE 8790"))))

(deftest controller-ci-is-exact-revision-unprivileged-and-frozen
  (let [workflow (.readFileSync
                  node-fs
                  (repository-file ".github/workflows/gitops-controller.yml")
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
                  "docker build"]]
      (is (.includes workflow gate)))
    (is (not (.includes workflow "secrets.")))
    (is (not (.includes workflow "docker push")))))

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
