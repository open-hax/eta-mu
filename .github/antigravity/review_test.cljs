;; SPDX-License-Identifier: GPL-3.0-or-later
(ns review-test
  (:require [antigravity.extern.host :as host]
            [antigravity.law.review :as law]
            [antigravity.shape.diff :as diff]
            [antigravity.shape.finish :as finish]
            [antigravity.shape.stream :as stream]
            [cljs.test :as t :refer [deftest is run-tests]]))

(def input {:base (apply str (repeat 40 "a")) :base_tip (apply str (repeat 40 "d"))
            :head (apply str (repeat 40 "b"))
            :diff_digest (apply str (repeat 64 "c"))
            :paths ["src/a.cljc"]
            :files [{:path "src/a.cljc" :base-mode "100644" :head-mode "100644"
                     :base-bytes 20 :head-bytes 30 :binary? false}]
            :diff-bytes 50 :input-bytes 100 :prompt-bytes 200 :stdin-bytes 250})
(def finding {:path "src/a.cljc" :line 2 :title "Wrong result" :body "Fails for zero input."
              :confidence 0.95 :evidence ["The changed branch returns one."]
              :failure_trace ["zero" "branch returns one" "contract requires zero"]})
(def result {:schema law/schema :status "findings" :diff_digest (:diff_digest input)
             :base (:base input) :head (:head input) :model law/model
             :scope_complete true :reviewed_paths (:paths input) :summary "One confirmed defect."
             :findings [finding] :questions []})

(deftest complete-bounded-input
  (is (= [] (law/input-errors input)))
  (is (= [] (law/input-errors (-> input (assoc :prompt-bytes 150000 :stdin-bytes 170000)
                                   (assoc-in [:files 0 :head-bytes] 380000)))))
  (doseq [invalid [(dissoc input :base_tip) (assoc input :base_tip "main")
                   (assoc input :head "HEAD") (assoc input :head (:base input))
                   (assoc input :paths ["../escape"]) (assoc input :paths ["src/a.cljc" "src/a.cljc"])
                   (assoc-in input [:files 0 :binary?] true) (assoc-in input [:files 0 :head-mode] "160000")
                   (assoc-in input [:files 0 :head-mode] "120000")
                   (assoc-in input [:files 0 :head-bytes] 1048577) (assoc input :diff-bytes 1048577)
                   (assoc input :prompt-bytes 4718593) (assoc input :stdin-bytes 8388609)]]
    (is (seq (law/input-errors invalid)))))

(deftest grounded-and-complete-output
  (is (= [] (law/result-errors input {"src/a.cljc" #{2}} result)))
  (is (= [] (law/result-errors input {} (assoc result :status "clean" :summary "No confirmed defects." :findings []))))
  (doseq [invalid [(assoc result :model "gemini-3-flash") (assoc result :head (:base input))
                   (assoc result :scope_complete false) (assoc result :reviewed_paths [])
                   (assoc result :status "clean") (assoc result :diff_digest (apply str (repeat 64 "d")))
                   (assoc result :reviewed_paths ["src/a.cljc" "src/a.cljc"])
                   (assoc result :summary " ") (assoc-in result [:findings 0 :confidence] 0.84)
                   (assoc-in result [:findings 0 :line] 3) (assoc-in result [:findings 0 :path] "/etc/passwd")
                   (assoc-in result [:findings 0 :evidence] [])
                   (assoc result :findings [finding finding]) (assoc result :native_approval true)]]
    (is (seq (law/result-errors input {"src/a.cljc" #{2}} invalid)))))

(deftest real-added-coordinates
  (is (= #{2 3 10} (diff/added-lines "diff --git a/a b/a\n--- a/a\n+++ b/a\n@@ -2 +2,2 @@\n-old\n+new\n+next\n@@ -9,0 +10 @@\n+tail\n\\ No newline at end of file\n")))
  (is (= #{} (diff/added-lines "@@ -1 +0,0 @@\n-deleted\n"))))

(def native-schema {:type "object" :properties {}})
(def native-init {:event "init" :conversation_id "fixture-conversation"
                  :init {:cwd "/fixture" :model law/model :agent "antigravity-reviewer"
                         :permission_mode "strict" :json_schema native-schema
                         :tools ["ask_custom_permission" "ask_permission" "ask_question" "browser_click_element" "browser_drag_pixel_to_pixel" "browser_get_dom" "browser_get_network_request" "browser_input" "browser_list_network_requests" "browser_mouse_down" "browser_mouse_up" "browser_move_mouse" "browser_press_key" "browser_refresh_page" "browser_resize_window" "browser_scroll" "browser_scroll_dom" "browser_select_option" "browser_subagent" "call_mcp_tool" "capture_browser_console_logs" "capture_browser_screenshot" "click_browser_pixel" "command_status" "define_subagent" "delete_knowledge" "execute_browser_javascript" "find_by_name" "finish" "generate_image" "grep_search" "invoke_subagent" "list_browser_pages" "list_dir" "list_permissions" "list_plugin_accounts" "list_resources" "manage_inbox" "manage_subagents" "manage_task" "multi_replace_file_content" "notebook_edit" "notebook_execution" "open_browser_url" "read_browser_page" "read_resource" "read_url_content" "replace_file_content" "run_command" "run_workflow" "schedule" "search_marketplace" "search_web" "sed_file" "send_command_input" "send_message" "view_file" "wait" "wait_5_seconds" "write_to_file"]}})
(defn step [index kind state]
  {:event "step_update" :step_update {:conversation_id "fixture-conversation"
                                     :step_index index :state state :step_type kind}})
(def native-result {:event "result" :result {:conversation_id "fixture-conversation"
                                           :status "SUCCESS" :num_turns 1 :duration_seconds 0.1
                                           :json_schema native-schema :structured_output result}})
(def events [native-init (step 0 "user_input" "DONE")
             (step 1 "agent_response" "ACTIVE") (step 1 "agent_response" "DONE")
             (step 2 "finish" "DONE") native-result])
(deftest native-invocation-boundaries
  (let [expected {:cwd "/fixture" :schema native-schema}]
    (is (= [] (law/envelope-errors expected events)))
    (doseq [invalid [(conj (pop events) {:event "tool_call"} native-result)
                     (assoc events 2 {:event "new_mutating_event"})
                     (assoc-in events [2 :step_update :tool_info] {:name "run_command"})
                     (assoc-in events [2 :step_update :subagent_info] {})
                     (assoc-in events [2 :step_update :step_type] "run_command")
                     (assoc-in events [2 :step_update :conversation_id] "other")
                     (assoc-in events [2 :step_update :state] "WAITING")
                     (assoc-in events [2 :step_update :step_index] -1)
                     (assoc-in events [5 :result :conversation_id] "other")
                     (assoc-in events [0 :init :tools] ["run_command"])
                     (assoc-in events [0 :init :model] "other")
                     (assoc-in events [0 :init :permission_mode] "plan")
                     (assoc-in events [0 :init :json_schema] {})
                     (assoc-in events [5 :result :json_schema] {})
                     [native-result] (conj events native-result) (into [native-init] events)
                     (conj events (step 3 "agent_response" "DONE"))
                     (assoc-in events [5 :result :status] "ERROR")]]
      (is (seq (law/envelope-errors expected invalid))))))

(deftest native-json-is-structured-and-schema-bound
  (let [schema {:type "object" :properties {}}
        native {:conversation_id "fixture" :status "SUCCESS" :num_turns 2 :duration_seconds 1.0
                :structured_output result :json_schema schema}]
    (is (= [] (law/native-json-errors schema native)))
    (doseq [invalid [(dissoc native :structured_output) (assoc native :status "ERROR")
                     (assoc native :json_schema {}) (assoc native :tool_calls [])
                     (assoc native :num_turns 0) (assoc native :response "partial" :structured_output nil)]]
      (is (seq (law/native-json-errors schema invalid))))))

(deftest observed-finish-preview-is-optional-and-never-terminal-authority
  (let [replay (host/native-lines (host/read-text ".github/antigravity/fixtures/native-finish-progress.ndjson"))
        expected {:cwd (get-in replay [0 :init :cwd]) :schema (get-in replay [0 :init :json_schema])}
        preview (get-in replay [3 :step_update :tool_info :parameters])
        terminal (stream/terminal replay)
        review (:review (finish/split-output (:structured_output terminal)))]
    (is (= 6 (count replay)))
    (is (= [] (law/envelope-errors expected replay)))
    (is (= (:result (peek replay)) terminal))
    (is (= law/result-keys (set (keys preview))))
    (is (< (count (get-in preview [:findings 0 :body])) 600))
    (is (> (count (get-in review [:findings 0 :body])) 1000))
    (is (not= preview review))
    (is (= [] (law/envelope-errors expected (vec (concat (subvec replay 0 3) (subvec replay 4))))))
    (doseq [invalid [(assoc-in replay [3 :step_update :tool_name] "run_command")
                     (assoc-in replay [3 :step_update :tool_info :name] "run_command")
                     (assoc-in replay [3 :step_update :step_type] "run_command")
                     (assoc-in replay [3 :step_update :state] "DONE")
                     (assoc-in replay [3 :tool_calls] [])
                     (assoc-in replay [3 :step_update :usage] {})
                     (assoc-in replay [3 :step_update :tool_info :calls] [])
                     (assoc-in replay [3 :step_update :tool_info :parameters :toolAction] "extra")
                     (assoc-in replay [3 :step_update :tool_info :parameters :findings 0 :tool_calls] [])
                     (assoc-in replay [3 :step_update :tool_info :parameters :reviewed_paths] {})
                     (update-in replay [3 :step_update :tool_info :parameters] dissoc :summary)
                     (assoc-in replay [3 :step_update :conversation_id] "other")
                     (assoc-in replay [3 :step_update :step_index] 1)
                     (assoc-in replay [3 :step_update :step_index] "2")
                     (assoc-in replay [4 :step_update :step_index] 3)
                     (vec (concat (subvec replay 0 4) [(nth replay 3)] (subvec replay 4)))
                     [(nth replay 0) (nth replay 1) (nth replay 3) (nth replay 2) (nth replay 4) (nth replay 5)]
                     [(nth replay 0) (nth replay 1) (nth replay 2) (nth replay 3) (nth replay 5)]
                     [(nth replay 0) (nth replay 1) (nth replay 2) (nth replay 4) (nth replay 3) (nth replay 5)]
                     (assoc-in replay [5 :result :structured_output] nil)]]
      (is (seq (law/envelope-errors expected invalid))))))

(deftest native-finish-has-an-exact-narrow-transport-shape
  (let [decorated (assoc result :toolAction "Submit review" :toolSummary "Review complete")
        shaped (finish/split-output decorated)]
    (is (= :shaped (:status (finish/split-output result))))
    (is (= :shaped (:status shaped)))
    (is (= result (:review shaped)))
    (is (= {:toolAction "Submit review" :toolSummary "Review complete"} (:metadata shaped)))
    (is (= [] (law/result-errors input {"src/a.cljc" #{2}} (:review shaped))))
    (doseq [invalid [(assoc result :toolAction "Partial metadata")
                     (assoc decorated :toolSummary nil) (assoc decorated :toolSummary " ")
                     (assoc decorated :toolAction (apply str (repeat 4097 "x")))
                     (assoc decorated :native_approval true) (assoc result :unknown "extra")]]
      (is (= :refused (:status (finish/split-output invalid)))))))

(defmethod t/report [:cljs.test/default :end-run-tests] [summary]
  (host/exit-code! (if (t/successful? summary) 0 1)))

(run-tests)
