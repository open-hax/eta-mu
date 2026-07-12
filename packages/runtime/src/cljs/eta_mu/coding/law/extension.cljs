(ns eta-mu.coding.law.extension
  (:require [malli.core :as m]
            [malli.error :as me]
            [malli.registry :as mr]
            [eta-mu.runtime.law.content-part :as content]
            [eta-mu.runtime.law.message :as message]))

;; ============================================================================
;; Extension Manifest
;; ============================================================================

(def extension-path-schema
  [:string {:min 1}])

(def source-info-schema
  [:map
   [:source [:enum :local :temporary :builtin :extension]]
   [:base-dir {:optional true} [:string {:min 1}]]])

(def extension-manifest-schema
  [:map
   [:path extension-path-schema]
   [:resolved-path extension-path-schema]
   [:source-info source-info-schema]])

;; ============================================================================
;; Tool Registration
;; ============================================================================

(def tool-execution-mode-schema
  [:enum :sequential :parallel])

(def tool-definition-schema
  [:map
   [:name [:string {:min 1}]]
   [:label [:string {:min 1}]]
   [:description [:string {:min 1}]]
   [:prompt-snippet {:optional true} [:string {:min 1}]]
   [:prompt-guidelines {:optional true} [:vector [:string {:min 1}]]]
   [:parameters map?]
   [:render-shell {:optional true} [:enum :default :self]]
   [:execution-mode {:optional true} tool-execution-mode-schema]])

(def registered-tool-schema
  [:map
   [:definition tool-definition-schema]
   [:source-info source-info-schema]])

;; ============================================================================
;; Command Registration
;; ============================================================================

(def registered-command-schema
  [:map
   [:name [:string {:min 1}]]
   [:source-info source-info-schema]
   [:description {:optional true} [:string {:min 1}]]])

(def resolved-command-schema
  (into registered-command-schema
        [[:invocation-name [:string {:min 1}]]]))

;; ============================================================================
;; Flag Registration
;; ============================================================================

(def extension-flag-schema
  [:map
   [:name [:string {:min 1}]]
   [:description {:optional true} [:string {:min 1}]]
   [:type [:enum :boolean :string]]
   [:default {:optional true} [:or boolean? [:string {:min 1}]]]
   [:extension-path [:string {:min 1}]]])

;; ============================================================================
;; Shortcut Registration
;; ============================================================================

(def extension-shortcut-schema
  [:map
   [:shortcut [:string {:min 1}]]
   [:description {:optional true} [:string {:min 1}]]
   [:extension-path [:string {:min 1}]]])

;; ============================================================================
;; Resource Discovery
;; ============================================================================

(def resources-discover-reason-schema
  [:enum :startup :reload])

(def resources-discover-event-schema
  [:map
   [:type [:= :resources_discover]]
   [:cwd [:string {:min 1}]]
   [:reason resources-discover-reason-schema]])

(def resources-discover-result-schema
  [:map
   [:skill-paths {:optional true} [:vector [:string {:min 1}]]]
   [:prompt-paths {:optional true} [:vector [:string {:min 1}]]]
   [:theme-paths {:optional true} [:vector [:string {:min 1}]]]])

;; ============================================================================
;; Session Events
;; ============================================================================

(def session-start-reason-schema
  [:enum :startup :reload :new :resume :fork])

(def session-start-event-schema
  [:map
   [:type [:= :session_start]]
   [:reason session-start-reason-schema]
   [:previous-session-file {:optional true} [:string {:min 1}]]])

(def session-before-switch-event-schema
  [:map
   [:type [:= :session_before_switch]]
   [:reason [:enum :new :resume]]
   [:target-session-file {:optional true} [:string {:min 1}]]])

(def session-before-fork-event-schema
  [:map
   [:type [:= :session_before_fork]]
   [:entry-id [:string {:min 1}]]
   [:position [:enum :before :at]]])

(def session-before-compact-event-schema
  [:map
   [:type [:= :session_before_compact]]
   [:branch-entries [:vector map?]]
   [:custom-instructions {:optional true} [:string {:min 1}]]])

(def session-compact-event-schema
  [:map
   [:type [:= :session_compact]]
   [:compaction-entry map?]
   [:from-extension boolean?]])

(def session-shutdown-reason-schema
  [:enum :quit :reload :new :resume :fork])

(def session-shutdown-event-schema
  [:map
   [:type [:= :session_shutdown]]
   [:reason session-shutdown-reason-schema]
   [:target-session-file {:optional true} [:string {:min 1}]]])

(def session-before-tree-event-schema
  [:map
   [:type [:= :session_before_tree]]
   [:target-id [:string {:min 1}]]
   [:old-leaf-id {:optional true} [:string {:min 1}]]])

(def session-tree-event-schema
  [:map
   [:type [:= :session_tree]]
   [:new-leaf-id {:optional true} [:string {:min 1}]]
   [:old-leaf-id {:optional true} [:string {:min 1}]]])

(def session-event-schema
  [:or session-start-event-schema
       session-before-switch-event-schema
       session-before-fork-event-schema
       session-before-compact-event-schema
       session-compact-event-schema
       session-shutdown-event-schema
       session-before-tree-event-schema
       session-tree-event-schema])

;; ============================================================================
;; Agent Events
;; ============================================================================

(def context-event-schema
  [:map
   [:type [:= :context]]
   [:messages [:vector message/agent-message-schema]]])

(def before-provider-request-event-schema
  [:map
   [:type [:= :before_provider_request]]
   [:payload any?]])

(def after-provider-response-event-schema
  [:map
   [:type [:= :after_provider_response]]
   [:status [:int {:min 0}]]
   [:headers [:map-of [:string {:min 1}] [:string {:min 1}]]]])

(def before-agent-start-event-schema
  [:map
   [:type [:= :before_agent_start]]
   [:prompt [:string {:min 1}]]
   [:images {:optional true} [:vector content/input-content-schema]]
   [:system-prompt [:string {:min 1}]]])

(def agent-start-event-schema
  [:map
   [:type [:= :agent_start]]])

(def agent-end-event-schema
  [:map
   [:type [:= :agent_end]]
   [:messages [:vector message/agent-message-schema]]])

(def agent-idle-event-schema
  [:map
   [:type [:= :agent_idle]]
   [:messages [:vector message/agent-message-schema]]])

;; ============================================================================
;; Turn Events
;; ============================================================================

(def turn-start-event-schema
  [:map
   [:type [:= :turn_start]]
   [:turn-index [:int {:min 0}]]
   [:timestamp [:int {:min 0}]]])

(def turn-end-event-schema
  [:map
   [:type [:= :turn_end]]
   [:turn-index [:int {:min 0}]]
   [:message message/agent-message-schema]
   [:tool-results [:vector message/tool-result-message-schema]]])

;; ============================================================================
;; Message Events
;; ============================================================================

(def message-start-event-schema
  [:map
   [:type [:= :message_start]]
   [:message message/agent-message-schema]])

(def message-update-event-schema
  [:map
   [:type [:= :message_update]]
   [:message message/agent-message-schema]
   [:assistant-message-event any?]])

(def message-end-event-schema
  [:map
   [:type [:= :message_end]]
   [:message message/agent-message-schema]])

;; ============================================================================
;; Tool Execution Events
;; ============================================================================

(def tool-execution-start-event-schema
  [:map
   [:type [:= :tool_execution_start]]
   [:tool-call-id [:string {:min 1}]]
   [:tool-name [:string {:min 1}]]
   [:args any?]])

(def tool-execution-update-event-schema
  [:map
   [:type [:= :tool_execution_update]]
   [:tool-call-id [:string {:min 1}]]
   [:tool-name [:string {:min 1}]]
   [:args any?]
   [:partial-result any?]])

(def tool-execution-end-event-schema
  [:map
   [:type [:= :tool_execution_end]]
   [:tool-call-id [:string {:min 1}]]
   [:tool-name [:string {:min 1}]]
   [:result any?]
   [:is-error boolean?]])

;; ============================================================================
;; Model Events
;; ============================================================================

(def model-select-source-schema
  [:enum :set :cycle :restore])

(def model-select-event-schema
  [:map
   [:type [:= :model_select]]
   [:model map?]
   [:previous-model {:optional true} map?]
   [:source model-select-source-schema]])

;; ============================================================================
;; User Bash Events
;; ============================================================================

(def user-bash-event-schema
  [:map
   [:type [:= :user_bash]]
   [:command [:string {:min 1}]]
   [:exclude-from-context boolean?]
   [:cwd [:string {:min 1}]]])

;; ============================================================================
;; Input Events
;; ============================================================================

(def input-source-schema
  [:enum :interactive :rpc :extension])

(def input-event-schema
  [:map
   [:type [:= :input]]
   [:text [:string {:min 0}]]
   [:images {:optional true} [:vector content/input-content-schema]]
   [:source input-source-schema]])

(def input-event-result-schema
  [:or [:map [:action [:= :continue]]]
       [:map [:action [:= :transform]]
             [:text [:string {:min 0}]]
             [:images {:optional true} [:vector content/input-content-schema]]]
       [:map [:action [:= :handled]]]])

;; ============================================================================
;; Tool Call/Result Events
;; ============================================================================

(def tool-call-event-base-schema
  [:map
   [:type [:= :tool_call]]
   [:tool-call-id [:string {:min 1}]]
   [:tool-name [:string {:min 1}]]
   [:input map?]])

(def tool-call-event-schema
  tool-call-event-base-schema)

(def tool-result-event-base-schema
  [:map
   [:type [:= :tool_result]]
   [:tool-call-id [:string {:min 1}]]
   [:tool-name [:string {:min 1}]]
   [:input map?]
   [:content [:vector content/input-content-schema]]
   [:is-error boolean?]])

(def tool-result-event-schema
  tool-result-event-base-schema)

(def tool-call-event-result-schema
  [:map
   [:block {:optional true} boolean?]
   [:reason {:optional true} [:string {:min 1}]]])

(def tool-result-event-result-schema
  [:map
   [:content {:optional true} [:vector content/input-content-schema]]
   [:details {:optional true} any?]
   [:is-error {:optional true} boolean?]])

;; ============================================================================
;; Before Agent Start Result
;; ============================================================================

(def before-agent-start-event-result-schema
  [:map
   [:message {:optional true} map?]
   [:system-prompt {:optional true} [:string {:min 1}]]])

;; ============================================================================
;; Session Before Results
;; ============================================================================

(def session-before-switch-result-schema
  [:map [:cancel {:optional true} boolean?]])

(def session-before-fork-result-schema
  [:map
   [:cancel {:optional true} boolean?]
   [:skip-conversation-restore {:optional true} boolean?]])

(def session-before-compact-result-schema
  [:map
   [:cancel {:optional true} boolean?]
   [:compaction {:optional true} map?]])

(def session-before-tree-result-schema
  [:map
   [:cancel {:optional true} boolean?]
   [:summary {:optional true} [:map
                               [:summary [:string {:min 1}]]
                               [:details {:optional true} any?]]]])

;; ============================================================================
;; Aggregate Event Schema
;; ============================================================================

(def extension-event-schema
  [:or resources-discover-event-schema
       session-event-schema
       context-event-schema
       before-provider-request-event-schema
       after-provider-response-event-schema
       before-agent-start-event-schema
       agent-start-event-schema
       agent-end-event-schema
       agent-idle-event-schema
       turn-start-event-schema
       turn-end-event-schema
       message-start-event-schema
       message-update-event-schema
       message-end-event-schema
       tool-execution-start-event-schema
       tool-execution-update-event-schema
       tool-execution-end-event-schema
       model-select-event-schema
       user-bash-event-schema
       input-event-schema
       tool-call-event-schema
       tool-result-event-schema])

;; ============================================================================
;; Extension Runtime State
;; ============================================================================

(def provider-config-schema
  [:map
   [:base-url {:optional true} [:string {:min 1}]]
   [:api-key {:optional true} [:string {:min 1}]]
   [:api {:optional true} [:string {:min 1}]]
   [:headers {:optional true} [:map-of [:string {:min 1}] [:string {:min 1}]]]
   [:auth-header {:optional true} boolean?]
   [:models {:optional true} [:vector map?]]])

;; ============================================================================
;; Registry
;; ============================================================================

(def registry
  (mr/composite-registry
   m/default-registry
   {"ExtensionManifest" extension-manifest-schema
    "SourceInfo" source-info-schema
    "ToolDefinition" tool-definition-schema
    "RegisteredTool" registered-tool-schema
    "RegisteredCommand" registered-command-schema
    "ResolvedCommand" resolved-command-schema
    "ExtensionFlag" extension-flag-schema
    "ExtensionShortcut" extension-shortcut-schema
    "ResourcesDiscoverEvent" resources-discover-event-schema
    "ResourcesDiscoverResult" resources-discover-result-schema
    "SessionStartEvent" session-start-event-schema
    "SessionBeforeSwitchEvent" session-before-switch-event-schema
    "SessionBeforeForkEvent" session-before-fork-event-schema
    "SessionBeforeCompactEvent" session-before-compact-event-schema
    "SessionCompactEvent" session-compact-event-schema
    "SessionShutdownEvent" session-shutdown-event-schema
    "SessionBeforeTreeEvent" session-before-tree-event-schema
    "SessionTreeEvent" session-tree-event-schema
    "SessionEvent" session-event-schema
    "ContextEvent" context-event-schema
    "BeforeProviderRequestEvent" before-provider-request-event-schema
    "AfterProviderResponseEvent" after-provider-response-event-schema
    "BeforeAgentStartEvent" before-agent-start-event-schema
    "AgentStartEvent" agent-start-event-schema
    "AgentEndEvent" agent-end-event-schema
    "AgentIdleEvent" agent-idle-event-schema
    "TurnStartEvent" turn-start-event-schema
    "TurnEndEvent" turn-end-event-schema
    "MessageStartEvent" message-start-event-schema
    "MessageUpdateEvent" message-update-event-schema
    "MessageEndEvent" message-end-event-schema
    "ToolExecutionStartEvent" tool-execution-start-event-schema
    "ToolExecutionUpdateEvent" tool-execution-update-event-schema
    "ToolExecutionEndEvent" tool-execution-end-event-schema
    "ModelSelectEvent" model-select-event-schema
    "UserBashEvent" user-bash-event-schema
    "InputEvent" input-event-schema
    "InputEventResult" input-event-result-schema
    "ToolCallEvent" tool-call-event-schema
    "ToolResultEvent" tool-result-event-schema
    "ToolCallEventResult" tool-call-event-result-schema
    "ToolResultEventResult" tool-result-event-result-schema
    "BeforeAgentStartEventResult" before-agent-start-event-result-schema
    "SessionBeforeSwitchResult" session-before-switch-result-schema
    "SessionBeforeForkResult" session-before-fork-result-schema
    "SessionBeforeCompactResult" session-before-compact-result-schema
    "SessionBeforeTreeResult" session-before-tree-result-schema
    "ExtensionEvent" extension-event-schema
    "ProviderConfig" provider-config-schema}))

(defn schema
  "Return a named schema from the extension registry."
  [name]
  [:ref name])

(defn validator
  "Return a validator for a named schema from the extension registry."
  [name]
  (m/validator (schema name) {:registry registry}))

(defn explain
  "Return a human-oriented explanation for value against a named schema."
  [name value]
  (some-> (m/explain (schema name) value {:registry registry})
          (me/humanize)))

(defn valid-extension-event?
  "Return true when value is a valid extension event."
  [value]
  (m/validate extension-event-schema value))

(defn valid-tool-definition?
  "Return true when value is a valid tool definition."
  [value]
  (m/validate tool-definition-schema value))

(defn valid-extension-manifest?
  "Return true when value is a valid extension manifest."
  [value]
  (m/validate extension-manifest-schema value))
