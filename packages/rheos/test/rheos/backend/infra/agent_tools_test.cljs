(ns rheos.backend.infra.agent-tools-test
  "The tool layer's refusal contract, as a caller experiences it.

   `eta-mu kanban status-update` dispatches `kanban_update_status`, so this is
   the surface that accepted `in_review` for three cards. A refusal here has to
   be observable two ways: the card file is unchanged, and the failure carries a
   `:kind` the CLI maps to a non-zero exit — a tool that refused but exited 0
   would leave every scripted caller believing the move landed."
  (:require ["node:fs/promises" :as fsp]
            ["node:os" :as os]
            ["node:path" :as path]
            [cljs.test :refer [deftest testing is]]
            [rheos.backend.infra.agent-tools :as agent-tools]
            [rheos.backend.infra.cli :as cli]
            [rheos.backend.infra.projects :as projects]))

(defn- tmp-dir []
  (path/join (.tmpdir os) (str "rheos-agent-tools-test-" (.now js/Date) "-" (rand-int 100000))))

(defn- write-task! [dir uuid status]
  (.writeFile fsp (path/join dir (str uuid ".md"))
              (str "---\n"
                   "uuid: \"" uuid "\"\n"
                   "title: \"Task One\"\n"
                   "status: \"" status "\"\n"
                   "priority: \"P3\"\n"
                   "---\n\n# Task One\n\nBody")
              "utf8"))

(defn- tool [name]
  (first (filter #(= name (:name %)) agent-tools/tools)))

(deftest tool-schemas-express-repository-types-and-planning-metadata
  (testing "creation defers type vocabulary to project configuration"
    (let [type-schema (get-in (tool "kanban_create_task")
                              [:input-schema :properties :type])]
      (is (= "string" (:type type-schema)))
      (is (nil? (:enum type-schema)))
      (is (re-find #"card-dirs" (:description type-schema)))))
  (testing "create and update expose dependency as structured arrays"
    (is (= "array" (get-in (tool "kanban_create_task")
                            [:input-schema :properties :dependency :type])))
    (is (= "^[a-zA-Z0-9][a-zA-Z0-9._-]*$"
           (get-in (tool "kanban_create_task")
                   [:input-schema :properties :dependency :items :pattern])))
    (is (= "array" (get-in (tool "kanban_update_frontmatter")
                            [:input-schema :properties :updates :properties
                             :dependency :type])))
    (is (= "^[a-zA-Z0-9][a-zA-Z0-9._-]*$"
           (get-in (tool "kanban_update_frontmatter")
                   [:input-schema :properties :updates :properties
                    :dependency :items :pattern])))))

(defn- ^:async dispatch-outcome
  "Dispatch `tool` against a temp board holding one card at `status`.
   Returns {:error <ex-data or nil> :result :before :after}."
  [status tool args]
  (let [dir (tmp-dir)
        _ (await (.mkdir fsp dir #js {:recursive true}))
        _ (await (write-task! dir "t1" status))
        source-path (path/join dir "t1.md")
        saved {:projects (projects/all) :default-project-id (projects/default-id)}
        before (await (.readFile fsp source-path "utf8"))]
    (projects/set-projects!
     {:projects [{:id "test" :title "Test" :tasks-dir dir :fsm "promethean" :meta {}}]
      :default-project-id "test"})
    (try
      (let [outcome (try
                      {:result (await (agent-tools/dispatch tool args))}
                      (catch :default e
                        {:error (ex-data e) :message (ex-message e)}))]
        (merge outcome {:before before
                        :after (await (.readFile fsp source-path "utf8"))}))
      (finally
        (projects/set-projects! saved)
        (await (.rm fsp dir #js {:recursive true :force true}))))))

(deftest ^:async update-status-refuses-a-non-fsm-status
  (testing "`in_review` is not an FSM state — the tool must refuse it, not write it"
    (let [{:keys [error message result before after]}
          (await (dispatch-outcome "review" "kanban_update_status"
                                   {:uuid "t1" :status "in_review" :project "test"}))]
      (is (nil? result) "the tool must not report success")
      (is (some? error) "it must throw")
      (is (= :refused (:kind error)))
      (is (re-find #"transition rejected" (str message)))
      (is (= before after) "and the card file is byte-identical"))))

(deftest ^:async update-status-refuses-a-missing-edge
  (testing "both states real, edge absent — same refusal, same silence on disk"
    (let [{:keys [error result before after]}
          (await (dispatch-outcome "breakdown" "kanban_update_status"
                                   {:uuid "t1" :status "done" :project "test"}))]
      (is (nil? result))
      (is (= :refused (:kind error)))
      (is (= before after)))))

(deftest ^:async update-status-writes-on-a-legal-move
  (testing "the refusal tests above would pass on a tool that never writes"
    (let [{:keys [error result before after]}
          (await (dispatch-outcome "breakdown" "kanban_update_status"
                                   {:uuid "t1" :status "ready" :project "test"}))]
      (is (nil? error))
      (is (:ok result))
      (is (= "breakdown" (:from result)))
      (is (= "ready" (:to result)))
      (is (not= before after))
      (is (re-find #"status: \"ready\"" after)))))

(deftest ^:async update-frontmatter-accepts-structured-dependencies
  (testing "the API carries a vector rather than stringifying planning metadata"
    (let [{:keys [error result after]}
          (await (dispatch-outcome "incoming" "kanban_update_frontmatter"
                                   {:uuid "t1" :project "test"
                                    :updates {:dependency ["dep-a" "dep-b"]}}))]
      (is (nil? error))
      (is (:ok result))
      (is (= ["dep-a" "dep-b"] (get-in result [:frontmatter :dependency])))
      (is (re-find #"dependency: \[\"dep-a\", \"dep-b\"\]" after)))))

(deftest ^:async update-frontmatter-refuses-scalar-dependency-without-writing
  (testing "malformed API metadata is a usage error and preserves the source bytes"
    (let [{:keys [error result before after]}
          (await (dispatch-outcome "incoming" "kanban_update_frontmatter"
                                   {:uuid "t1" :project "test"
                                    :updates {:dependency "dep-a"}}))]
      (is (nil? result))
      (is (= :usage (:kind error)))
      (is (= before after)))))

;; ---------------------------------------------------------------------------
;; The exit code a scripted caller actually observes
;; ---------------------------------------------------------------------------

(defn- ^:async run-cli!
  "Drive [[cli/main]] end to end against a temp board holding one card at
   `status`, and return the exit code it left on the process.

   `main` reads `process.argv` and writes `process.exitCode` — the only way to
   prove a refusal reaches a caller as a non-zero exit is to go through both.
   Both globals are restored, and `exitCode` is reset to 0, or a passing suite
   would inherit this test's failure code."
  [status argv-tail]
  (let [dir (tmp-dir)
        _ (await (.mkdir fsp dir #js {:recursive true}))
        _ (await (write-task! dir "t1" status))
        config-path (path/join dir "board.edn")
        _ (await (.writeFile fsp config-path
                             (str "{:tasks-dir \"" dir "\" :fsm :promethean}") "utf8"))
        saved-argv js/process.argv
        saved-projects {:projects (projects/all) :default-project-id (projects/default-id)}]
    (set! (.-exitCode js/process) 0)
    (set! (.-argv js/process)
          (clj->js (concat ["node" "rheos"] argv-tail ["--config" config-path])))
    (try
      (await (cli/main))
      {:exit-code (.-exitCode js/process)
       :after (await (.readFile fsp (path/join dir "t1.md") "utf8"))}
      (finally
        (set! (.-argv js/process) saved-argv)
        (set! (.-exitCode js/process) 0)
        (projects/set-projects! saved-projects)
        (await (.rm fsp dir #js {:recursive true :force true}))))))

(deftest ^:async status-update-exits-non-zero-on-a-refusal
  (testing "a refused move reaches the caller as exit 3, not a silent success"
    (let [{:keys [exit-code after]}
          (await (run-cli! "review" ["status-update" "t1" "--to" "in_review"]))]
      (is (= 3 exit-code)
          "exit 0 here is indistinguishable from a completed move")
      (is (= (:refused cli/exit-codes) exit-code)
          "and it is the published `:refused` code, not an incidental non-zero")
      (is (re-find #"status: \"review\"" after)
          "the card still holds its real status"))))

(deftest ^:async status-update-exits-zero-on-a-legal-move
  (testing "the exit assertion above would pass on a CLI that always failed"
    (let [{:keys [exit-code after]}
          (await (run-cli! "breakdown" ["status-update" "t1" "--to" "ready"]))]
      (is (= 0 exit-code))
      (is (re-find #"status: \"ready\"" after)))))

(deftest ^:async frontmatter-cli-decodes-and-clears-dependency-vectors
  (testing "comma-separated CLI input becomes repository-valid vector metadata"
    (let [{:keys [exit-code after]}
          (await (run-cli! "incoming"
                           ["frontmatter" "t1" "--set" "dependency=dep-a,dep-b"]))]
      (is (= 0 exit-code))
      (is (re-find #"dependency: \[\"dep-a\", \"dep-b\"\]" after))))
  (testing "an empty CLI value is the explicit clear operation"
    (let [{:keys [exit-code after]}
          (await (run-cli! "incoming" ["frontmatter" "t1" "--set" "dependency="]))]
      (is (= 0 exit-code))
      (is (re-find #"dependency: \[\]" after))
      (is (not (re-find #"dependency: \[\"\"\]" after))))))

(deftest exit-codes-cover-refusal
  (testing "the published mapping the tests above depend on"
    (is (= 3 (:refused cli/exit-codes)))
    (is (pos? (:refused cli/exit-codes)))))
