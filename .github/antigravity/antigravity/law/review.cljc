;; SPDX-License-Identifier: GPL-3.0-or-later
(ns antigravity.law.review
  "Portable admission for bounded advisory CLI reviews. No publication authority."
  (:require [clojure.string :as str]))

(def model "gemini-3.8-flash-high")
(def cli-version "1.4.6")
(def schema "open-hax.antigravity-review/v1")
(def limits {:files 256 :file-bytes 1048576 :diff-bytes 1048576
             :input-bytes 4194304 :prompt-bytes 4718592 :stdin-bytes 8388608 :response-bytes 2097152})

(defn text? [x] (and (string? x) (not (str/blank? x))))
(defn commit? [x] (and (string? x) (boolean (re-matches #"(?:[0-9a-f]{40}|[0-9a-f]{64})" x))))
(defn digest? [x] (and (string? x) (boolean (re-matches #"[0-9a-f]{64}" x))))
(defn path? [x]
  (and (text? x) (not (str/starts-with? x "/"))
       (not (str/includes? x "\\")) (not (re-find #"[\x00-\x1f\x7f]" x))
       (every? #(not (contains? #{"" "." ".." ".git"} %)) (str/split x #"/"))))

(defn input-errors [{:keys [base head paths files diff_digest diff-bytes input-bytes prompt-bytes stdin-bytes]}]
  (cond-> []
    (not (and (commit? base) (commit? head) (not= base head))) (conj :revisions)
    (not (digest? diff_digest)) (conj :diff-digest)
    (not (and (vector? paths) (seq paths) (every? path? paths)
              (= (count paths) (count (distinct paths)))
              (<= (count paths) (:files limits)))) (conj :paths)
    (not (and (vector? files) (= paths (mapv :path files))
              (every? (fn [{:keys [base-mode head-mode base-bytes head-bytes binary?]}]
                        (and (contains? #{"000000" "100644" "100755"} base-mode)
                             (contains? #{"000000" "100644" "100755"} head-mode)
                             (false? binary?)
                             (every? #(and (integer? %) (<= 0 % (:file-bytes limits)))
                                     [base-bytes head-bytes]))) files))) (conj :files)
    (not (and (integer? diff-bytes) (<= 1 diff-bytes (:diff-bytes limits)))) (conj :diff-size)
    (not (and (integer? input-bytes) (<= 1 input-bytes (:input-bytes limits)))) (conj :input-size)
    (not (and (integer? prompt-bytes) (<= 1 prompt-bytes (:prompt-bytes limits)))) (conj :prompt-size)
    (not (and (integer? stdin-bytes) (<= 1 stdin-bytes (:stdin-bytes limits)))) (conj :stdin-size)))

(def finding-keys #{:path :line :title :body :confidence :evidence :failure_trace})
(def result-keys #{:schema :status :diff_digest :base :head :model :scope_complete :reviewed_paths :summary :findings :questions})
(defn finding? [changed-lines finding]
  (and (map? finding) (= finding-keys (set (keys finding)))
       (path? (:path finding)) (integer? (:line finding))
       (contains? (get changed-lines (:path finding) #{}) (:line finding))
       (every? text? ((juxt :title :body) finding))
       (number? (:confidence finding)) (<= 0.85 (:confidence finding) 1)
       (every? #(and (vector? %) (seq %) (every? text? %))
               ((juxt :evidence :failure_trace) finding))))

(defn result-errors [input changed-lines result]
  (let [findings (:findings result) paths (:reviewed_paths result)]
    (cond-> []
      (not (and (map? result) (= result-keys (set (keys result)))
                (= schema (:schema result)))) (conj :schema)
      (not= [(:base input) (:head input) model] ((juxt :base :head :model) result)) (conj :binding)
      (not (and (digest? (:diff_digest result)) (= (:diff_digest input) (:diff_digest result)))) (conj :diff-digest)
      (not= (if (empty? findings) "clean" "findings") (:status result)) (conj :status)
      (not (and (true? (:scope_complete result)) (vector? paths)
                (= (count paths) (count (distinct paths)))
                (= (set (:paths input)) (set paths)))) (conj :scope)
      (not (text? (:summary result))) (conj :summary)
      (not (and (vector? findings) (<= (count findings) 100)
                (every? #(finding? changed-lines %) findings)
                (= (count findings) (count (distinct (map (juxt :path :line :title) findings)))))) (conj :findings)
      (not (and (vector? (:questions result)) (<= (count (:questions result)) 100)
                (every? text? (:questions result)))) (conj :questions))))

(defn native-json-errors
  "Validate the native terminal object; strict-profile custody is an independent prerequisite."
  [expected-schema native]
  (cond-> []
    (not (and (map? native) (text? (:conversation_id native)) (= "SUCCESS" (:status native))
              (map? (:structured_output native))
              (integer? (:num_turns native)) (<= 1 (:num_turns native) 32)
              (number? (:duration_seconds native)) (<= 0 (:duration_seconds native))
              (every? #{:conversation_id :status :response :duration_seconds :num_turns
                        :structured_output :json_schema :usage} (keys native))))
    (conj :native-result)
    (not= expected-schema (:json_schema native)) (conj :native-schema)))

(def native-tools
  "The pinned native init advertises this static catalog, not effective grants.
   Actual confinement independently requires the qualified strict overlay."
  #{"ask_custom_permission" "ask_permission" "ask_question" "browser_click_element"
    "browser_drag_pixel_to_pixel" "browser_get_dom" "browser_get_network_request" "browser_input"
    "browser_list_network_requests" "browser_mouse_down" "browser_mouse_up" "browser_move_mouse"
    "browser_press_key" "browser_refresh_page" "browser_resize_window" "browser_scroll"
    "browser_scroll_dom" "browser_select_option" "browser_subagent" "call_mcp_tool"
    "capture_browser_console_logs" "capture_browser_screenshot" "click_browser_pixel" "command_status"
    "define_subagent" "delete_knowledge" "execute_browser_javascript" "find_by_name"
    "finish" "generate_image" "grep_search" "invoke_subagent"
    "list_browser_pages" "list_dir" "list_permissions" "list_plugin_accounts"
    "list_resources" "manage_inbox" "manage_subagents" "manage_task"
    "multi_replace_file_content" "notebook_edit" "notebook_execution" "open_browser_url"
    "read_browser_page" "read_resource" "read_url_content" "replace_file_content"
    "run_command" "run_workflow" "schedule" "search_marketplace"
    "search_web" "sed_file" "send_command_input" "send_message"
    "view_file" "wait" "wait_5_seconds" "write_to_file"})

(def step-keys #{:conversation_id :step_index :state :step_type :text_delta :duration_seconds :usage})
(defn step? [conversation event]
  (let [{:keys [conversation_id step_index state step_type text_delta duration_seconds usage] :as step}
        (:step_update event)]
    (and (map? event) (= #{:event :step_update} (set (keys event))) (= "step_update" (:event event))
         (map? step) (every? step-keys (keys step))
         (= conversation conversation_id) (integer? step_index) (<= 0 step_index)
         (or (and (= "agent_response" step_type) (contains? #{"ACTIVE" "DONE"} state))
             (and (contains? #{"user_input" "finish"} step_type) (= "DONE" state)))
         (or (not (contains? step :text_delta)) (string? text_delta))
         (or (not (contains? step :duration_seconds)) (and (number? duration_seconds) (<= 0 duration_seconds)))
         (or (not (contains? step :usage)) (map? usage)))))

(defn envelope-errors
  "Admit one complete native stream. No effectful or unknown progress category is accepted."
  [{:keys [cwd schema]} events]
  (let [initial (first events) terminal (last events) init (:init initial)
        conversation (:conversation_id initial) result (:result terminal)
        steps (vec (drop-last (rest events))) tools (:tools init)]
    (cond-> (native-json-errors schema result)
      (not (and (vector? events) (= "init" (:event initial))
                (= #{:event :conversation_id :init} (set (keys initial)))
                (= 1 (count (filter #(= "init" (:event %)) events)))
                (text? conversation) (map? init)
                (= #{:cwd :model :agent :permission_mode :tools :json_schema} (set (keys init)))
                (= cwd (:cwd init)) (= model (:model init))
                (= "antigravity-reviewer" (:agent init)) (= "strict" (:permission_mode init))
                (= schema (:json_schema init)) (vector? tools)
                (= native-tools (set tools)) (= (count tools) (count native-tools)))) (conj :native-init)
      (not (and (= "result" (:event terminal))
                (= #{:event :result} (set (keys terminal)))
                (= 1 (count (filter #(= "result" (:event %)) events)))
                (= conversation (:conversation_id result)))) (conj :native-terminal)
      (not (and (seq steps) (every? #(step? conversation %) steps)
                (= [0 "user_input" "DONE"] ((juxt :step_index :step_type :state) (:step_update (first steps))))
                (= 1 (count (filter #(= "user_input" (get-in % [:step_update :step_type])) steps)))
                (= 1 (count (filter #(= "finish" (get-in % [:step_update :step_type])) steps)))
                (= "finish" (get-in (last steps) [:step_update :step_type]))
                (apply <= (map #(get-in % [:step_update :step_index]) steps)))) (conj :native-effects))))
