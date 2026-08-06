(ns rheos.backend.infra.config-test
  (:require ["node:fs" :as fs]
            ["node:fs/promises" :as fsp]
            ["node:os" :as os]
            ["node:path" :as path]
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

(deftest ^:async rejects-a-nonexistent-path-below-an-escaping-symlink
  ;; `real-path` fell back to the lexical candidate whenever the path did not
  ;; exist yet, so containment was checked against a path the filesystem never
  ;; confirmed. A symlink under the task root pointing outside it, plus a
  ;; not-yet-created child, resolved to something that *looked* contained —
  ;; and every card later written there would live outside the task root.
  (let [base (await (.mkdtemp fsp (path/join (os/tmpdir) "rheos-cfg-link-")))
        tasks (path/join base "kanban")
        outside (path/join base "elsewhere")]
    (try
      (await (.mkdir fsp tasks #js {:recursive true}))
      (await (.mkdir fsp outside #js {:recursive true}))
      (await (.symlink fsp outside (path/join tasks "linked") "dir"))
      (let [loaded {:config-dir base
                    :config {:tasks-dir "kanban"
                             :card-projection {:paths ["linked/new-cards"]}}}]
        (is (thrown? js/Error (config/resolve-configured-projects loaded nil))
            "a path below an in-root symlink that leaves the root must be refused even before it exists"))
      (finally
        (await (.rm fsp base #js {:recursive true :force true}))))))

(deftest ^:async allows-a-nonexistent-path-that-stays-inside-the-root
  ;; The guard must not reject ordinary not-yet-created projection dirs.
  (let [base (await (.mkdtemp fsp (path/join (os/tmpdir) "rheos-cfg-new-")))
        tasks (path/join base "kanban")]
    (try
      (await (.mkdir fsp tasks #js {:recursive true}))
      (let [loaded {:config-dir base
                    :config {:tasks-dir "kanban"
                             :card-projection {:paths ["not-created-yet"]}}}
            project (first (:projects (config/resolve-configured-projects loaded nil)))]
        (is (= [(path/join (.realpathSync fs tasks) "not-created-yet")]
               (get-in project [:card-projection :paths]))))
      (finally
        (await (.rm fsp base #js {:recursive true :force true}))))))

(deftest rejects-an-absolute-card-projection-path
  ;; An absolute path inside the task root passes containment but pins the
  ;; config to one machine. Refuse it at the config boundary.
  (testing "even one that would land inside the task root"
    (let [loaded {:config-dir (path/resolve "/workspace/eta-mu")
                  :config {:tasks-dir "kanban"
                           :card-projection
                           {:paths [(path/resolve "/workspace/eta-mu/kanban/tasks")]}}}]
      (is (thrown? js/Error (config/resolve-configured-projects loaded nil))))))
