(ns rheos.backend.infra.config-card-creation-test
  (:require ["node:path" :as path]
            [cljs.test :refer [deftest is testing]]
            [rheos.backend.infra.config :as config]))

(deftest preserves-project-card-placement-config
  (testing "card directories remain relative to the task root and projections become absolute"
    (let [config-dir (path/resolve "/workspace/eta-mu")
          loaded {:config-dir config-dir
                  :config {:projects [{:id "board"
                                      :tasksDir "kanban"
                                      :cardDirs {:task "work" :epic "initiatives"}
                                      :cardProjection {:paths ["work" "initiatives"]}}]}}
          project (first (:projects (config/resolve-configured-projects loaded nil)))
          tasks-dir (path/resolve config-dir "kanban")]
      (is (= {:task "work" :epic "initiatives"} (:card-dirs project)))
      (is (= [(path/resolve tasks-dir "work")
              (path/resolve tasks-dir "initiatives")]
             (get-in project [:card-projection :paths]))))))

(deftest preserves-top-level-card-placement-config
  (testing "single-project boards receive top-level card creation settings"
    (let [config-dir (path/resolve "/workspace/eta-mu")
          loaded {:config-dir config-dir
                  :config {:tasksDir "kanban"
                           :cardDirs {:task "cards"}
                           :cardProjection {:paths ["cards"]}}}
          project (first (:projects (config/resolve-configured-projects loaded nil)))
          tasks-dir (path/resolve config-dir "kanban")]
      (is (= {:task "cards"} (:card-dirs project)))
      (is (= [(path/resolve tasks-dir "cards")]
             (get-in project [:card-projection :paths]))))))
