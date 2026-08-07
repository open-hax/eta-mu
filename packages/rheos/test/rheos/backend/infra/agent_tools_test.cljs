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

(deftest refused-maps-to-a-non-zero-exit
  (testing "the `:kind` a refusal throws is the one the CLI turns into exit 3"
    (is (= 3 (:refused cli/exit-codes)))
    (is (pos? (:refused cli/exit-codes))
        "a refusal that exits 0 is indistinguishable from a completed move")))
