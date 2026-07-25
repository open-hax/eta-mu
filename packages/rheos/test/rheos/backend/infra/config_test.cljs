(ns rheos.backend.infra.config-test
  (:require ["node:path" :as path]
            [cljs.test :refer [deftest is]]
            [rheos.backend.infra.config :as config]))

(deftest resolves-build-gate-cwd-relative-to-board-config
  (let [config-dir (path/resolve "/workspace/eta-mu/kanban")
        loaded {:config-dir config-dir
                :config {:defaultProject "epiphany"
                         :projects [{:id "epiphany"
                                     :tasksDir "../../epiphany/docs/kanban"
                                     :fsm {:extends "promethean"
                                           :buildGateCommands ["clojure -M:unit-test"]
                                           :cwd "../../epiphany"}}]}}
        resolved (config/resolve-configured-projects loaded nil)
        project (first (:projects resolved))]
    (is (= (path/resolve config-dir "../../epiphany")
           (get-in project [:fsm :cwd])))
    (is (= (path/resolve config-dir "../../epiphany/docs/kanban")
           (:tasks-dir project)))))
