(ns rheos.backend.infra.config-card-creation-test
  (:require ["node:path" :as path]
            [cljs.test :refer [deftest is testing]]
            [rheos.backend.infra.config :as config]))

;; These boards are written as raw JSON and parsed, rather than as hand-built
;; maps. `resolve-configured-projects` reads kebab-case only, because
;; `parse-config-content` pushes every config through `normalize-config` first
;; — so a test that hands it `:cardDirs` directly would be asserting against an
;; input no caller can produce. Going through the parser means these also cover
;; the thing that actually matters for the EDN migration: a legacy camelCase
;; JSON board still gets its card placement.

(defn- load-json [config-dir json]
  {:config-dir config-dir
   :config (config/parse-config-content "openhax.kanban.json" json)})

(deftest preserves-project-card-placement-config
  (testing "card directories stay relative to the task root and projections become absolute"
    (let [config-dir (path/resolve "/workspace/eta-mu")
          loaded (load-json config-dir
                            (js/JSON.stringify
                             (clj->js {:projects [{:id "board"
                                                   :tasksDir "kanban"
                                                   :cardDirs {:task "work" :epic "initiatives"}
                                                   :cardProjection {:paths ["work" "initiatives"]}}]})))
          project (first (:projects (config/resolve-configured-projects loaded nil)))
          tasks-dir (path/resolve config-dir "kanban")]
      (is (= {:task "work" :epic "initiatives"} (:card-dirs project)))
      (is (= [(path/resolve tasks-dir "work")
              (path/resolve tasks-dir "initiatives")]
             (get-in project [:card-projection :paths]))))))

(deftest preserves-top-level-card-placement-config
  (testing "single-project boards receive top-level card creation settings"
    (let [config-dir (path/resolve "/workspace/eta-mu")
          loaded (load-json config-dir
                            (js/JSON.stringify
                             (clj->js {:tasksDir "kanban"
                                       :cardDirs {:task "cards"}
                                       :cardProjection {:paths ["cards"]}})))
          project (first (:projects (config/resolve-configured-projects loaded nil)))
          tasks-dir (path/resolve config-dir "kanban")]
      (is (= {:task "cards"} (:card-dirs project)))
      (is (= [(path/resolve tasks-dir "cards")]
             (get-in project [:card-projection :paths]))))))

(deftest edn-and-json-boards-resolve-identically
  (testing "the same board written either way produces the same placement"
    (let [config-dir (path/resolve "/workspace/eta-mu")
          from-json (load-json config-dir
                               (js/JSON.stringify
                                (clj->js {:tasksDir "kanban"
                                          :cardDirs {:task "cards"}
                                          :cardProjection {:paths ["cards"]}})))
          from-edn {:config-dir config-dir
                    :config (config/parse-config-content
                             "openhax.kanban.edn"
                             (pr-str {:tasks-dir "kanban"
                                      :card-dirs {:task "cards"}
                                      :card-projection {:paths ["cards"]}}))}
          placement (fn [loaded]
                      (let [p (first (:projects (config/resolve-configured-projects loaded nil)))]
                        (select-keys p [:card-dirs :card-projection :tasks-dir])))]
      (is (= (placement from-edn) (placement from-json))
          "a JSON board and its EDN translation must resolve to the same project"))))

(deftest card-projection-may-not-escape-the-task-root
  (testing "a projection path outside the task root is refused at config load"
    (let [config-dir (path/resolve "/workspace/eta-mu")
          loaded {:config-dir config-dir
                  :config (config/parse-config-content
                           "openhax.kanban.edn"
                           (pr-str {:tasks-dir "kanban"
                                    :card-projection {:paths ["../../elsewhere"]}}))}]
      ;; A projection is where the board looks. One pointing outside the task
      ;; root makes every card written there invisible while the config still
      ;; reads as valid, so this fails at load rather than at the first write.
      (is (thrown-with-msg?
           ExceptionInfo #"card projection path escapes task root"
           (config/resolve-configured-projects loaded nil))))))
