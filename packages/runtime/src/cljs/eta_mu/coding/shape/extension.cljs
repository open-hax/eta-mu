(ns eta-mu.coding.shape.extension
  "JS↔CLJS converters for extension API types.
   Handles the boundary between JS extension modules and CLJS runtime."
  (:require [eta-mu.runtime.shape.message :as message-shape]))

;; ============================================================================
;; Helpers
;; ============================================================================

(defn- first-present
  "Return the first non-nil value from a map for any of the given keys."
  [m keys]
  (when-let [key (first (filter #(contains? m %) keys))]
    (get m key)))

(defn- keyword-or-nil
  [value]
  (cond
    (keyword? value) value
    (string? value) (keyword value)
    :else nil))

;; ============================================================================
;; Extension Manifest
;; ============================================================================

(defn manifest-from-external
  "Convert an external extension manifest to internal form."
  [manifest]
  {:path (or (:path manifest) "")
   :resolved-path (or (:resolvedPath manifest) (:resolved-path manifest) (:path manifest) "")
   :source-info {:source (keyword-or-nil (or (:source manifest) :local))
                 :base-dir (first-present manifest [:baseDir :base-dir])}})

(defn manifest->external
  "Convert an internal extension manifest to external form."
  [manifest]
  {:path (:path manifest)
   :resolvedPath (:resolved-path manifest)
   :source (name (get-in manifest [:source-info :source]))
   :baseDir (get-in manifest [:source-info :base-dir])})

;; ============================================================================
;; Tool Definition
;; ============================================================================

(defn tool-definition-from-external
  "Convert an external tool definition to internal form."
  [tool]
  {:name (:name tool)
   :label (:label tool)
   :description (:description tool)
   :prompt-snippet (first-present tool [:promptSnippet :prompt-snippet])
   :prompt-guidelines (first-present tool [:promptGuidelines :prompt-guidelines])
   :parameters (or (:parameters tool) {})
   :render-shell (keyword-or-nil (first-present tool [:renderShell :render-shell]))
   :execution-mode (keyword-or-nil (first-present tool [:executionMode :execution-mode]))})

(defn tool-definition->external
  "Convert an internal tool definition to external form."
  [tool]
  (cond-> {:name (:name tool)
           :label (:label tool)
           :description (:description tool)
           :parameters (:parameters tool)}
    (:prompt-snippet tool) (assoc :promptSnippet (:prompt-snippet tool))
    (:prompt-guidelines tool) (assoc :promptGuidelines (:prompt-guidelines tool))
    (:render-shell tool) (assoc :renderShell (name (:render-shell tool)))
    (:execution-mode tool) (assoc :executionMode (name (:execution-mode tool)))))

;; ============================================================================
;; Registered Tool
;; ============================================================================

(defn registered-tool-from-external
  "Convert an external registered tool to internal form."
  [registered]
  {:definition (tool-definition-from-external (:definition registered))
   :source-info {:source (keyword-or-nil (or (get-in registered [:sourceInfo :source]) :local))
                 :base-dir (first-present registered [:sourceInfo :baseDir :source-info :base-dir])}})

(defn registered-tool->external
  "Convert an internal registered tool to external form."
  [registered]
  {:definition (tool-definition->external (:definition registered))
   :sourceInfo {:source (name (get-in registered [:source-info :source]))
                :baseDir (get-in registered [:source-info :base-dir])}})

;; ============================================================================
;; Command
;; ============================================================================

(defn registered-command-from-external
  "Convert an external registered command to internal form."
  [command]
  (cond-> {:name (:name command)
           :source-info {:source (keyword-or-nil (or (get-in command [:sourceInfo :source]) :local))
                         :base-dir (first-present command [:sourceInfo :baseDir :source-info :base-dir])}}
    (:description command) (assoc :description (:description command))
    (:invocationName command) (assoc :invocation-name (:invocationName command))
    (:invocation-name command) (assoc :invocation-name (:invocation-name command))))

(defn registered-command->external
  "Convert an internal registered command to external form."
  [command]
  (cond-> {:name (:name command)
           :sourceInfo {:source (name (get-in command [:source-info :source]))
                        :baseDir (get-in command [:source-info :base-dir])}}
    (:description command) (assoc :description (:description command))
    (:invocation-name command) (assoc :invocationName (:invocation-name command))))

(defn resolved-command->external
  "Convert an internal resolved command to external form."
  [command]
  (cond-> {:name (:name command)
           :invocationName (:invocation-name command)
           :sourceInfo {:source (name (get-in command [:source-info :source]))
                        :baseDir (get-in command [:source-info :base-dir])}}
    (:description command) (assoc :description (:description command))))

;; ============================================================================
;; Extension Flag
;; ============================================================================

(defn extension-flag-from-external
  "Convert an external extension flag to internal form."
  [flag]
  {:name (:name flag)
   :description (:description flag)
   :type (keyword-or-nil (or (:type flag) :boolean))
   :default (:default flag)
   :extension-path (or (:extensionPath flag) (:extension-path flag))})

(defn extension-flag->external
  "Convert an internal extension flag to external form."
  [flag]
  (cond-> {:name (:name flag)
           :type (name (:type flag))
           :extensionPath (:extension-path flag)}
    (:description flag) (assoc :description (:description flag))
    (some? (:default flag)) (assoc :default (:default flag))))

;; ============================================================================
;; Extension Shortcut
;; ============================================================================

(defn extension-shortcut-from-external
  "Convert an external extension shortcut to internal form."
  [shortcut]
  {:shortcut (:shortcut shortcut)
   :description (:description shortcut)
   :extension-path (or (:extensionPath shortcut) (:extension-path shortcut))})

(defn extension-shortcut->external
  "Convert an internal extension shortcut to external form."
  [shortcut]
  (cond-> {:shortcut (:shortcut shortcut)
           :extensionPath (:extension-path shortcut)}
    (:description shortcut) (assoc :description (:description shortcut))))

;; ============================================================================
;; Source Info
;; ============================================================================

(defn source-info-from-external
  "Convert an external SourceInfo to internal form."
  [info]
  {:source (keyword-or-nil (or (:source info) :local))
   :base-dir (first-present info [:baseDir :base-dir])})

(defn source-info->external
  "Convert an internal SourceInfo to external form."
  [info]
  (cond-> {:source (name (:source info))}
    (:base-dir info) (assoc :baseDir (:base-dir info))))

;; ============================================================================
;; Extension State
;; ============================================================================

(defn extension-from-external
  "Convert an external Extension object to internal form."
  [extension]
  (let [path-val (:path extension)
        manifest (if (map? path-val)
                   (manifest-from-external path-val)
                   {:path path-val
                    :resolved-path (or (:resolvedPath extension) path-val)
                    :source-info {:source :local :base-dir nil}})]
    {:manifest manifest
     :handlers {}
     :tools (reduce-kv (fn [acc tool-name registered]
                         (assoc acc tool-name (registered-tool-from-external registered)))
                       {}
                       (or (:tools extension) {}))
     :commands (reduce-kv (fn [acc cmd-name command]
                            (assoc acc cmd-name (registered-command-from-external command)))
                          {}
                          (or (:commands extension) {}))
     :flags (reduce-kv (fn [acc flag-name flag]
                         (assoc acc flag-name (extension-flag-from-external flag)))
                       {}
                       (or (:flags extension) {}))
     :shortcuts (reduce-kv (fn [acc key shortcut]
                             (assoc acc key (extension-shortcut-from-external shortcut)))
                           {}
                           (or (:shortcuts extension) {}))
     :message-renderers (or (:messageRenderers extension) {})}))

(defn extension->external
  "Convert an internal Extension state to external form."
  [extension]
  (cond-> {:path (get-in extension [:manifest :path])
           :resolvedPath (get-in extension [:manifest :resolved-path])
           :sourceInfo (source-info->external (get-in extension [:manifest :source-info]))}
    (seq (:tools extension))
    (assoc :tools (reduce-kv (fn [acc tool-name registered]
                               (assoc acc tool-name (registered-tool->external registered)))
                             {}
                             (:tools extension)))
    (seq (:commands extension))
    (assoc :commands (reduce-kv (fn [acc cmd-name command]
                                  (assoc acc cmd-name {:name (:name command)
                                                       :sourceInfo (source-info->external (:source-info command))}))
                                {}
                                (:commands extension)))
    (seq (:flags extension))
    (assoc :flags (reduce-kv (fn [acc flag-name flag]
                               (assoc acc flag-name (extension-flag->external flag)))
                             {}
                             (:flags extension)))
    (seq (:shortcuts extension))
    (assoc :shortcuts (reduce-kv (fn [acc key shortcut]
                                   (assoc acc key (extension-shortcut->external shortcut)))
                                 {}
                                 (:shortcuts extension)))))

;; ============================================================================
;; Events
;; ============================================================================

(defn event-from-external
  "Convert an external event to internal CLJS form."
  [event]
  (let [event-type (keyword-or-nil (:type event))]
    (case event-type
      :resources_discover
      {:type :resources_discover
       :cwd (:cwd event)
       :reason (keyword-or-nil (:reason event))}

      :session_start
      {:type :session_start
       :reason (keyword-or-nil (:reason event))
       :previous-session-file (first-present event [:previousSessionFile :previous-session-file])}

      :session_before_switch
      {:type :session_before_switch
       :reason (keyword-or-nil (:reason event))
       :target-session-file (first-present event [:targetSessionFile :target-session-file])}

      :session_before_fork
      {:type :session_before_fork
       :entry-id (first-present event [:entryId :entry-id])
       :position (keyword-or-nil (:position event))}

      :session_before_compact
      {:type :session_before_compact
       :branch-entries (:branchEntries event)
       :custom-instructions (first-present event [:customInstructions :custom-instructions])}

      :session_compact
      {:type :session_compact
       :compaction-entry (:compactionEntry event)
       :from-extension (boolean (:fromExtension event))}

      :session_shutdown
      {:type :session_shutdown
       :reason (keyword-or-nil (:reason event))
       :target-session-file (first-present event [:targetSessionFile :target-session-file])}

      :session_before_tree
      {:type :session_before_tree
       :target-id (:targetId event)
       :old-leaf-id (first-present event [:oldLeafId :old-leaf-id])}

      :session_tree
      {:type :session_tree
       :new-leaf-id (first-present event [:newLeafId :new-leaf-id])
       :old-leaf-id (first-present event [:oldLeafId :old-leaf-id])}

      :context
      {:type :context
       :messages (mapv message-shape/message-from-external (:messages event))}

      :before_provider_request
      {:type :before_provider_request
       :payload (:payload event)}

      :after_provider_response
      {:type :after_provider_response
       :status (:status event)
       :headers (:headers event)}

      :before_agent_start
      {:type :before_agent_start
       :prompt (:prompt event)
       :images (some->> (:images event) (mapv message-shape/message-from-external))
       :system-prompt (first-present event [:systemPrompt :system-prompt])}

      :agent_start {:type :agent_start}
      :agent_end {:type :agent_end
                  :messages (mapv message-shape/message-from-external (:messages event))}
      :agent_idle {:type :agent_idle
                   :messages (mapv message-shape/message-from-external (:messages event))}

      :turn_start
      {:type :turn_start
       :turn-index (:turnIndex event)
       :timestamp (:timestamp event)}

      :turn_end
      {:type :turn_end
       :turn-index (:turnIndex event)
       :message (message-shape/message-from-external (:message event))
       :tool-results (mapv message-shape/message-from-external (:toolResults event))}

      :message_start
      {:type :message_start
       :message (message-shape/message-from-external (:message event))}

      :message_update
      {:type :message_update
       :message (message-shape/message-from-external (:message event))
       :assistant-message-event (:assistantMessageEvent event)}

      :message_end
      {:type :message_end
       :message (message-shape/message-from-external (:message event))}

      :tool_execution_start
      {:type :tool_execution_start
       :tool-call-id (:toolCallId event)
       :tool-name (:toolName event)
       :args (:args event)}

      :tool_execution_update
      {:type :tool_execution_update
       :tool-call-id (:toolCallId event)
       :tool-name (:toolName event)
       :args (:args event)
       :partial-result (:partialResult event)}

      :tool_execution_end
      {:type :tool_execution_end
       :tool-call-id (:toolCallId event)
       :tool-name (:toolName event)
       :result (:result event)
       :is-error (boolean (:isError event))}

      :model_select
      {:type :model_select
       :model (:model event)
       :previous-model (:previousModel event)
       :source (keyword-or-nil (:source event))}

      :user_bash
      {:type :user_bash
       :command (:command event)
       :exclude-from-context (boolean (:excludeFromContext event))
       :cwd (:cwd event)}

      :input
      {:type :input
       :text (:text event)
       :images (some->> (:images event) (mapv message-shape/message-from-external))
       :source (keyword-or-nil (:source event))}

      :tool_call
      {:type :tool_call
       :tool-call-id (:toolCallId event)
       :tool-name (:toolName event)
       :input (:input event)}

      :tool_result
      {:type :tool_result
       :tool-call-id (:toolCallId event)
       :tool-name (:toolName event)
       :input (:input event)
       :content (mapv message-shape/content-from-external (:content event))
       :is-error (boolean (:isError event))}

      ;; Fallback: pass through as-is
      event)))

(defn event->external
  "Convert an internal CLJS event to external form."
  [event]
  (let [event-type (:type event)]
    (case event-type
      :resources_discover
      {:type "resources_discover"
       :cwd (:cwd event)
       :reason (name (:reason event))}

      :session_start
      (cond-> {:type "session_start"
               :reason (name (:reason event))}
        (:previous-session-file event) (assoc :previousSessionFile (:previous-session-file event)))

      :session_before_switch
      (cond-> {:type "session_before_switch"
               :reason (name (:reason event))}
        (:target-session-file event) (assoc :targetSessionFile (:target-session-file event)))

      :session_before_fork
      {:type "session_before_fork"
       :entryId (:entry-id event)
       :position (name (:position event))}

      :session_before_compact
      {:type "session_before_compact"
       :branchEntries (:branch-entries event)
       :customInstructions (:custom-instructions event)}

      :session_compact
      {:type "session_compact"
       :compactionEntry (:compaction-entry event)
       :fromExtension (:from-extension event)}

      :session_shutdown
      (cond-> {:type "session_shutdown"
               :reason (name (:reason event))}
        (:target-session-file event) (assoc :targetSessionFile (:target-session-file event)))

      :session_before_tree
      {:type "session_before_tree"
       :targetId (:target-id event)
       :oldLeafId (:old-leaf-id event)}

      :session_tree
      {:type "session_tree"
       :newLeafId (:new-leaf-id event)
       :oldLeafId (:old-leaf-id event)}

      :context
      {:type "context"
       :messages (mapv message-shape/message->external (:messages event))}

      :before_provider_request
      {:type "before_provider_request"
       :payload (:payload event)}

      :after_provider_response
      {:type "after_provider_response"
       :status (:status event)
       :headers (:headers event)}

      :before_agent_start
      {:type "before_agent_start"
       :prompt (:prompt event)
       :images (some->> (:images event) (mapv message-shape/message->external))
       :systemPrompt (:system-prompt event)}

      :agent_start {:type "agent_start"}
      :agent_end {:type "agent_end"
                  :messages (mapv message-shape/message->external (:messages event))}
      :agent_idle {:type "agent_idle"
                   :messages (mapv message-shape/message->external (:messages event))}

      :turn_start
      {:type "turn_start"
       :turnIndex (:turn-index event)
       :timestamp (:timestamp event)}

      :turn_end
      {:type "turn_end"
       :turnIndex (:turn-index event)
       :message (message-shape/message->external (:message event))
       :toolResults (mapv message-shape/message->external (:tool-results event))}

      :message_start
      {:type "message_start"
       :message (message-shape/message->external (:message event))}

      :message_update
      {:type "message_update"
       :message (message-shape/message->external (:message event))
       :assistantMessageEvent (:assistant-message-event event)}

      :message_end
      {:type "message_end"
       :message (message-shape/message->external (:message event))}

      :tool_execution_start
      {:type "tool_execution_start"
       :toolCallId (:tool-call-id event)
       :toolName (:tool-name event)
       :args (:args event)}

      :tool_execution_update
      {:type "tool_execution_update"
       :toolCallId (:tool-call-id event)
       :toolName (:tool-name event)
       :args (:args event)
       :partialResult (:partial-result event)}

      :tool_execution_end
      {:type "tool_execution_end"
       :toolCallId (:tool-call-id event)
       :toolName (:tool-name event)
       :result (:result event)
       :isError (:is-error event)}

      :model_select
      {:type "model_select"
       :model (:model event)
       :previousModel (:previous-model event)
       :source (name (:source event))}

      :user_bash
      {:type "user_bash"
       :command (:command event)
       :excludeFromContext (:exclude-from-context event)
       :cwd (:cwd event)}

      :input
      {:type "input"
       :text (:text event)
       :images (some->> (:images event) (mapv message-shape/message->external))
       :source (name (:source event))}

      :tool_call
      {:type "tool_call"
       :toolCallId (:tool-call-id event)
       :toolName (:tool-name event)
       :input (:input event)}

      :tool_result
      {:type "tool_result"
       :toolCallId (:tool-call-id event)
       :toolName (:tool-name event)
       :input (:input event)
       :content (mapv message-shape/content->external (:content event))
       :isError (:is-error event)}

      ;; Fallback
      event)))

;; ============================================================================
;; Event Results
;; ============================================================================

(defn input-event-result->external
  "Convert an internal InputEventResult to external form."
  [result]
  (case (:action result)
    :handled {:action "handled"}
    :transform
    (cond-> {:action "transform"
             :text (:text result)}
      (seq (:images result)) (assoc :images (mapv message-shape/message->external (:images result))))
    {:action "continue"}))

(defn tool-call-event-result->external
  "Convert an internal ToolCallEventResult to external form."
  [result]
  (cond-> {}
    (:block? result) (assoc :block true)
    (:reason result) (assoc :reason (:reason result))))

(defn tool-result-event-result->external
  "Convert an internal ToolResultEventResult to external form."
  [result]
  (cond-> {}
    (:content result) (assoc :content (mapv message-shape/content->external (:content result)))
    (:details result) (assoc :details (:details result))
    (some? (:is-error result)) (assoc :isError (:is-error result))))

(defn before-agent-start-result->external
  "Convert an internal BeforeAgentStartEventResult to external form."
  [result]
  (cond-> {}
    (:message result) (assoc :message (:message result))
    (:system-prompt result) (assoc :systemPrompt (:system-prompt result))))

(defn session-before-result->external
  "Convert an internal session-before result to external form."
  [result]
  (cond-> {}
    (:cancel result) (assoc :cancel true)
    (:skip-conversation-restore result) (assoc :skipConversationRestore true)
    (:compaction result) (assoc :compaction (:compaction result))
    (:summary result) (assoc :summary {:summary (get-in result [:summary :summary])
                                        :details (get-in result [:summary :details])})))
