(ns rheos.backend.infra.config-card-creation-test
  (:require ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]
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

(deftest card-projection-may-not-escape-through-a-symlink
  (testing "a symlink under the task root pointing outside it is refused"
    ;; `path/resolve` never touches the filesystem, so a lexical check accepts
    ;; this: the path sits under the task root and only its target is outside.
    ;; `collect-markdown-files` follows symlinks, so the board would have loaded
    ;; whatever the link pointed at.
    (let [base (path/join (.tmpdir os) (str "rheos-symlink-test-" (.now js/Date) "-" (rand-int 100000)))
          tasks-dir (path/join base "kanban")
          outside (path/join base "outside")
          link (path/join tasks-dir "sneaky")]
      (.mkdirSync fs tasks-dir #js {:recursive true})
      (.mkdirSync fs outside #js {:recursive true})
      (try
        (.symlinkSync fs outside link)
        (let [loaded {:config-dir base
                      :config (config/parse-config-content
                               "openhax.kanban.edn"
                               (pr-str {:tasks-dir "kanban"
                                        :card-projection {:paths ["sneaky"]}}))}]
          (is (thrown-with-msg?
               ExceptionInfo #"card projection path escapes task root"
               (config/resolve-configured-projects loaded nil))))
        (catch :default e
          ;; A platform without symlink permission cannot exercise this.
          (when-not (= "EPERM" (.-code e)) (throw e)))
        (finally
          (.rmSync fs base #js {:recursive true :force true}))))))

(deftest card-projection-accepts-a-real-directory-under-the-task-root
  (testing "resolving symlinks does not reject an ordinary contained path"
    (let [base (path/join (.tmpdir os) (str "rheos-realpath-test-" (.now js/Date) "-" (rand-int 100000)))
          tasks-dir (path/join base "kanban")]
      (.mkdirSync fs (path/join tasks-dir "cards") #js {:recursive true})
      (try
        (let [loaded {:config-dir base
                      :config (config/parse-config-content
                               "openhax.kanban.edn"
                               (pr-str {:tasks-dir "kanban"
                                        :card-projection {:paths ["cards"]}}))}
              project (first (:projects (config/resolve-configured-projects loaded nil)))]
          (is (= 1 (count (get-in project [:card-projection :paths])))))
        (finally
          (.rmSync fs base #js {:recursive true :force true}))))))
