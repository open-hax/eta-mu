(ns rheos.backend.infra.config-test
  (:require ["node:path" :as path]
            [cljs.test :refer [deftest is testing]]
            [rheos.backend.infra.config :as config]))

(deftest edn-config-precedes-deprecated-json
  (is (= ["openhax.kanban.edn" "kanban.edn"
          "openhax.kanban.json" "kanban.json"]
         config/default-config-names)))

(deftest parses-and-normalizes-edn-config
  (is (= {:tasks-dir "./kanban"
          :fsm :promethean
          :card-projection {:paths ["epics" "tasks"]}}
         (config/parse-config-content
          "openhax.kanban.edn"
          "{:tasks-dir \"./kanban\" :fsm :promethean :card-projection {:paths [\"epics\" \"tasks\"]}}"))))

(deftest parses-and-normalizes-legacy-json-config
  (is (= {:tasks-dir "./kanban"
          :default-project "eta-mu"
          :card-projection {:paths ["tasks"]}
          :fsm {:extends "promethean"
                :build-gate-commands ["pnpm test"]}}
         (config/parse-config-content
          "openhax.kanban.json"
          "{\"tasksDir\":\"./kanban\",\"defaultProject\":\"eta-mu\",\"cardProjection\":{\"paths\":[\"tasks\"]},\"fsm\":{\"extends\":\"promethean\",\"buildGateCommands\":[\"pnpm test\"]}}"))))

(deftest resolves-build-gate-cwd-relative-to-board-config
  (let [config-dir (path/resolve "/workspace/eta-mu/kanban")
        loaded {:config-dir config-dir
                :config {:default-project "epiphany"
                         :projects [{:id "epiphany"
                                     :tasks-dir "../../epiphany/docs/kanban"
                                     :fsm {:extends :promethean
                                           :build-gate-commands ["clojure -M:unit-test"]
                                           :cwd "../../epiphany"}}]}}
        resolved (config/resolve-configured-projects loaded nil)
        project (first (:projects resolved))]
    (is (= (path/resolve config-dir "../../epiphany")
           (get-in project [:fsm :cwd])))
    (is (= (path/resolve config-dir "../../epiphany/docs/kanban")
           (:tasks-dir project)))))

(deftest resolves-card-projection-paths-beneath-task-root
  (let [config-dir (path/resolve "/workspace/eta-mu")
        loaded {:config-dir config-dir
                :config {:tasks-dir "kanban"
                         :card-projection {:paths ["epics" "tasks" "chores"]}}}
        project (first (:projects (config/resolve-configured-projects loaded nil)))]
    (is (= [(path/resolve config-dir "kanban/epics")
            (path/resolve config-dir "kanban/tasks")
            (path/resolve config-dir "kanban/chores")]
           (get-in project [:card-projection :paths])))))

(deftest rejects-card-projection-path-escape
  (testing "projection paths cannot escape the configured task root"
    (let [loaded {:config-dir (path/resolve "/workspace/eta-mu")
                  :config {:tasks-dir "kanban"
                           :card-projection {:paths ["../docs"]}}}]
      (is (thrown? js/Error
                   (config/resolve-configured-projects loaded nil))))))
