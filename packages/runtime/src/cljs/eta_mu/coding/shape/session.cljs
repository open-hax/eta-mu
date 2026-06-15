(ns eta-mu.coding.shape.session
  (:require [eta-mu.runtime.shape.message :as message-shape]))

(defn- first-present
  [m keys]
  (when-let [key (first (filter #(contains? m %) keys))]
    (get m key)))

(defn- keyword-or-nil
  [value]
  (cond
    (keyword? value) value
    (string? value) (keyword value)
    :else nil))

(defn- entry-type-from-external
  [entry]
  (or (keyword-or-nil (:type entry)) (:type entry)))

(defn- entry-base-from-external
  [entry]
  {:type (entry-type-from-external entry)
   :id (or (:id entry) (:uuid entry))
   :parent-id (first-present entry [:parentId :parent-id])
   :timestamp (first-present entry [:timestamp :createdAt :created-at])})

(defn- entry-base->external
  [entry]
  {:type (name (:type entry))
   :id (:id entry)
   :parentId (:parent-id entry)
   :timestamp (:timestamp entry)})

(defn entry-from-external
  "Convert an external session file entry (header or entry) to internal form."
  [entry]
  (let [type (entry-type-from-external entry)]
    (case type
      :session
      {:type :session
       :version (or (:version entry) 1)
       :id (:id entry)
       :timestamp (:timestamp entry)
       :cwd (:cwd entry)
       :parent-session (first-present entry [:parentSession :parent-session])}

      :message
      (assoc (entry-base-from-external entry)
             :message (message-shape/message-from-external (:message entry)))

      :thinking-level-change
      (assoc (entry-base-from-external entry)
             :thinking-level (first-present entry [:thinkingLevel :thinking-level]))

      :model-change
      (assoc (entry-base-from-external entry)
             :provider (:provider entry)
             :model-id (first-present entry [:modelId :model-id]))

      :compaction
      (assoc (entry-base-from-external entry)
             :summary (:summary entry)
             :first-kept-entry-id (first-present entry [:firstKeptEntryId :first-kept-entry-id])
             :tokens-before (or (:tokensBefore entry) (:tokens-before entry) 0)
             :details (first-present entry [:details])
             :from-hook (boolean (first-present entry [:fromHook :from-hook])))

      :branch-summary
      (assoc (entry-base-from-external entry)
             :from-id (first-present entry [:fromId :from-id])
             :summary (:summary entry)
             :details (first-present entry [:details])
             :from-hook (boolean (first-present entry [:fromHook :from-hook])))

      :custom
      (assoc (entry-base-from-external entry)
             :custom-type (first-present entry [:customType :custom-type])
             :details (first-present entry [:details]))

      :label
      (assoc (entry-base-from-external entry)
             :target-id (first-present entry [:targetId :target-id])
             :label (first-present entry [:label]))

      :session-info
      (assoc (entry-base-from-external entry)
             :name (first-present entry [:name]))

      :custom-message
      (assoc (entry-base-from-external entry)
             :custom-type (first-present entry [:customType :custom-type])
             :content (message-shape/content-list-from-external (:content entry))
             :details (first-present entry [:details])
             :display (boolean (:display entry)))

      entry)))

(defn entry->external
  "Convert an internal session file entry (header or entry) to external form."
  [entry]
  (case (:type entry)
    :session
    (cond-> {:type "session"
               :version (:version entry)
               :id (:id entry)
               :timestamp (:timestamp entry)
               :cwd (:cwd entry)}
      (:parent-session entry) (assoc :parentSession (:parent-session entry)))

    :message
    (assoc (entry-base->external entry)
           :message (message-shape/message->external (:message entry)))

    :thinking-level-change
    (assoc (entry-base->external entry)
           :thinkingLevel (:thinking-level entry))

    :model-change
    (assoc (entry-base->external entry)
           :provider (:provider entry)
           :modelId (:model-id entry))

    :compaction
    (assoc (entry-base->external entry)
           :summary (:summary entry)
           :firstKeptEntryId (:first-kept-entry-id entry)
           :tokensBefore (:tokens-before entry)
           :details (:details entry)
           :fromHook (:from-hook entry))

    :branch-summary
    (assoc (entry-base->external entry)
           :fromId (:from-id entry)
           :summary (:summary entry)
           :details (:details entry)
           :fromHook (:from-hook entry))

    :custom
    (assoc (entry-base->external entry)
           :customType (:custom-type entry)
           :details (:details entry))

    :label
    (assoc (entry-base->external entry)
           :targetId (:target-id entry)
           :label (:label entry))

    :session-info
    (assoc (entry-base->external entry)
           :name (:name entry))

    :custom-message
    (assoc (entry-base->external entry)
           :customType (:custom-type entry)
           :content (message-shape/content-list->external (:content entry))
           :details (:details entry)
           :display (:display entry))

    entry))

(defn tree-node-from-external
  "Recursively convert an external session tree node to internal form."
  [node]
  {:entry (entry-from-external (:entry node))
   :children (mapv tree-node-from-external (or (:children node) []))
   :label (first-present node [:label])
   :label-timestamp (first-present node [:labelTimestamp :label-timestamp])})

(defn tree-node->external
  "Recursively convert an internal session tree node to external form."
  [node]
  {:entry (entry->external (:entry node))
   :children (mapv tree-node->external (:children node))
   :label (:label node)
   :labelTimestamp (:label-timestamp node)})

(defn context-from-external
  "Convert an external session context to internal form."
  [context]
  {:messages (mapv message-shape/message-from-external (or (:messages context) []))
   :thinking-level (or (:thinkingLevel context) (:thinking-level context) "off")
   :model (when-let [model (or (:model context) nil)]
            {:provider (:provider model)
             :model-id (or (:modelId model) (:model-id model))})})

(defn context->external
  "Convert an internal session context to external form."
  [context]
  {:messages (mapv message-shape/message->external (:messages context))
   :thinkingLevel (:thinking-level context)
   :model (when-let [model (:model context)]
            {:provider (:provider model)
             :modelId (:model-id model)})})

(defn info-from-external
  "Convert an external SessionInfo to internal form."
  [info]
  {:path (:path info)
   :id (:id info)
   :cwd (:cwd info)
   :name (first-present info [:name])
   :parent-session-path (first-present info [:parentSessionPath :parent-session-path])
   :created (:created info)
   :modified (:modified info)
   :message-count (or (:messageCount info) (:message-count info) 0)
   :first-message (or (:firstMessage info) (:first-message info) "")
   :all-messages-text (or (:allMessagesText info) (:all-messages-text info) "")})

(defn info->external
  "Convert an internal SessionInfo to external form."
  [info]
  {:path (:path info)
   :id (:id info)
   :cwd (:cwd info)
   :name (:name info)
   :parentSessionPath (:parent-session-path info)
   :created (:created info)
   :modified (:modified info)
   :messageCount (:message-count info)
   :firstMessage (:first-message info)
   :allMessagesText (:all-messages-text info)})

(defn cwd-issue-from-external
  "Convert an external SessionCwdIssue to internal form."
  [issue]
  {:session-file (first-present issue [:sessionFile :session-file])
   :session-cwd (or (:sessionCwd issue) (:session-cwd issue))
   :fallback-cwd (or (:fallbackCwd issue) (:fallback-cwd issue))})

(defn cwd-issue->external
  "Convert an internal SessionCwdIssue to external form."
  [issue]
  {:sessionFile (:session-file issue)
   :sessionCwd (:session-cwd issue)
   :fallbackCwd (:fallback-cwd issue)})
