(ns eta-mu.coding.law.session
  (:require [malli.core :as m]
            [malli.error :as me]
            [malli.registry :as mr]
            [eta-mu.runtime.law.content-part :as content]
            [eta-mu.runtime.law.message :as message]))

(def session-entry-base-keys
  [[:id [:string {:min 1}]]
   [:parent-id [:maybe [:string {:min 1}]]]
   [:timestamp [:string {:min 1}]]])

(def session-header-schema
  [:map
   [:type [:= :session]]
   [:version {:optional true} [:int {:min 1}]]
   [:id [:string {:min 1}]]
   [:timestamp [:string {:min 1}]]
   [:cwd [:string {:min 1}]]
   [:parent-session {:optional true} [:string {:min 1}]]])

(def session-message-entry-schema
  (into [:map]
        (concat session-entry-base-keys
                [[:type [:= :message]]
                 [:message message/agent-message-schema]])))

(def thinking-level-change-entry-schema
  (into [:map]
        (concat session-entry-base-keys
                [[:type [:= :thinking-level-change]]
                 [:thinking-level [:string {:min 1}]]])))

(def model-change-entry-schema
  (into [:map]
        (concat session-entry-base-keys
                [[:type [:= :model-change]]
                 [:provider [:string {:min 1}]]
                 [:model-id [:string {:min 1}]]])))

(def compaction-entry-schema
  (into [:map]
        (concat session-entry-base-keys
                [[:type [:= :compaction]]
                 [:summary [:string {:min 1}]]
                 [:first-kept-entry-id [:string {:min 1}]]
                 [:tokens-before [:int {:min 0}]]
                 [:details {:optional true} any?]
                 [:from-hook {:optional true} boolean?]])))

(def branch-summary-entry-schema
  (into [:map]
        (concat session-entry-base-keys
                [[:type [:= :branch-summary]]
                 [:from-id [:string {:min 1}]]
                 [:summary [:string {:min 1}]]
                 [:details {:optional true} any?]
                 [:from-hook {:optional true} boolean?]])))

(def custom-entry-schema
  (into [:map]
        (concat session-entry-base-keys
                [[:type [:= :custom]]
                 [:custom-type [:string {:min 1}]]
                 [:details {:optional true} any?]])))

(def label-entry-schema
  (into [:map]
        (concat session-entry-base-keys
                [[:type [:= :label]]
                 [:target-id [:string {:min 1}]]
                 [:label [:maybe [:string {:min 1}]]]])))

(def session-info-entry-schema
  (into [:map]
        (concat session-entry-base-keys
                [[:type [:= :session-info]]
                 [:name {:optional true} [:string {:min 1}]]])))

(def custom-message-entry-schema
  (into [:map]
        (concat session-entry-base-keys
                [[:type [:= :custom-message]]
                 [:custom-type [:string {:min 1}]]
                 [:content [:or string? [:vector {:min 1} content/input-content-schema]]]
                 [:details {:optional true} any?]
                 [:display boolean?]])))

(def session-entry-schema
  [:or
   session-message-entry-schema
   thinking-level-change-entry-schema
   model-change-entry-schema
   compaction-entry-schema
   branch-summary-entry-schema
   custom-entry-schema
   label-entry-schema
   session-info-entry-schema
   custom-message-entry-schema])

(def file-entry-schema
  [:or session-header-schema session-entry-schema])

(def session-tree-node-schema
  [:map
   [:entry session-entry-schema]
   [:children [:vector [:ref "SessionTreeNode"]]]
   [:label {:optional true} [:maybe [:string {:min 1}]]]
   [:label-timestamp {:optional true} [:maybe [:string {:min 1}]]]])

(def session-context-schema
  [:map
   [:messages [:vector message/agent-message-schema]]
   [:thinking-level [:string {:min 1}]]
   [:model [:maybe [:map
                    [:provider [:string {:min 1}]]
                    [:model-id [:string {:min 1}]]]]]])

(def session-info-schema
  [:map
   [:path [:string {:min 1}]]
   [:id [:string {:min 1}]]
   [:cwd [:string {:min 1}]]
   [:name {:optional true} [:string {:min 1}]]
   [:parent-session-path {:optional true} [:string {:min 1}]]
   [:created inst?]
   [:modified inst?]
   [:message-count [:int {:min 0}]]
   [:first-message [:string {:min 1}]]
   [:all-messages-text string?]])

(def session-cwd-issue-schema
  [:map
   [:session-file {:optional true} [:string {:min 1}]]
   [:session-cwd [:string {:min 1}]]
   [:fallback-cwd [:string {:min 1}]]])

(def resource-collision-schema
  [:map
   [:resource-type [:enum :extension :skill :prompt :theme]]
   [:name [:string {:min 1}]]
   [:winner-path [:string {:min 1}]]
   [:loser-path [:string {:min 1}]]
   [:winner-source {:optional true} [:string {:min 1}]]
   [:loser-source {:optional true} [:string {:min 1}]]])

(def resource-diagnostic-schema
  [:map
   [:type [:enum :warning :error :collision]]
   [:message [:string {:min 1}]]
   [:path {:optional true} [:string {:min 1}]]
   [:collision {:optional true} resource-collision-schema]])

(def registry
  (mr/composite-registry
   m/default-registry
   {"SessionHeader" session-header-schema
    "SessionMessageEntry" session-message-entry-schema
    "ThinkingLevelChangeEntry" thinking-level-change-entry-schema
    "ModelChangeEntry" model-change-entry-schema
    "CompactionEntry" compaction-entry-schema
    "BranchSummaryEntry" branch-summary-entry-schema
    "CustomEntry" custom-entry-schema
    "LabelEntry" label-entry-schema
    "SessionInfoEntry" session-info-entry-schema
    "CustomMessageEntry" custom-message-entry-schema
    "SessionEntry" session-entry-schema
    "FileEntry" file-entry-schema
    "SessionTreeNode" session-tree-node-schema
    "SessionContext" session-context-schema
    "SessionInfo" session-info-schema
    "SessionCwdIssue" session-cwd-issue-schema
    "ResourceCollision" resource-collision-schema
    "ResourceDiagnostic" resource-diagnostic-schema}))

(defn schema
  "Return a named schema from the session registry."
  [name]
  [:ref name])

(defn validator
  "Return a validator for a named schema from the session registry."
  [name]
  (m/validator (schema name) {:registry registry}))

(defn explain
  "Return a human-oriented explanation for value against a named schema."
  [name value]
  (some-> (m/explain (schema name) value {:registry registry})
          (me/humanize)))

(defn valid-file-entry?
  "Return true when value is a valid session header or entry."
  [value]
  (m/validate (schema "FileEntry") value {:registry registry}))

(defn valid-session-entry?
  "Return true when value is a valid session entry (not a header)."
  [value]
  (m/validate session-entry-schema value))

(defn valid-session-context?
  "Return true when value is a valid session context."
  [value]
  (m/validate session-context-schema value))

(defn valid-session-cwd-issue?
  "Return true when value is a valid SessionCwdIssue."
  [value]
  (m/validate session-cwd-issue-schema value))
