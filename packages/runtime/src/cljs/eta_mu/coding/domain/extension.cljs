(ns eta-mu.coding.domain.extension
  "Pure domain functions for extension management.
   No I/O — discovery paths are computed, not read."
  (:require [clojure.string :as str]))

;; ============================================================================
;; Extension State (pure data)
;; ============================================================================

(defn create-extension
  "Create an empty extension state map from a manifest."
  [manifest]
  {:manifest manifest
   :handlers {}
   :tools {}
   :commands {}
   :flags {}
   :shortcuts {}
   :message-renderers {}})

(defn extension-path
  "Return the path from an extension state."
  [extension]
  (get-in extension [:manifest :path]))

(defn extension-source-info
  "Return the source-info from an extension state."
  [extension]
  (get-in extension [:manifest :source-info]))

;; ============================================================================
;; Handler Registration
;; ============================================================================

(defn register-handler
  "Register an event handler on an extension. Returns updated extension."
  [extension event-type handler]
  (update extension :handlers
          (fn [handlers]
            (update handlers event-type (fnil conj []) handler))))

(defn get-handlers
  "Return handlers for an event type across a collection of extensions.
   Returns a vector of [extension handler] pairs."
  [extensions event-type]
  (into []
        (mapcat (fn [ext]
                  (map (fn [h] [ext h])
                       (get (:handlers ext) event-type))))
        extensions))

(defn has-handlers?
  "Return true if any extension has handlers for the event type."
  [extensions event-type]
  (some #(seq (get (:handlers %) event-type)) extensions))

;; ============================================================================
;; Tool Registration
;; ============================================================================

(defn register-tool
  "Register a tool on an extension. First registration per name wins.
   Returns updated extension."
  [extension tool-definition]
  (let [tool-name (:name tool-definition)
        registered {:definition tool-definition
                    :source-info (extension-source-info extension)}]
    (assoc-in extension [:tools tool-name] registered)))

(defn get-all-registered-tools
  "Return all registered tools across extensions (first registration per name wins)."
  [extensions]
  (let [tools-by-name (reduce (fn [acc ext]
                                (reduce-kv (fn [m tool-name registered]
                                             (if (contains? m tool-name)
                                               m
                                               (assoc m tool-name registered)))
                                           acc
                                           (:tools ext)))
                              {}
                              extensions)]
    (vals tools-by-name)))

(defn get-tool-definition
  "Return the tool definition by name, or nil."
  [extensions tool-name]
  (some #(get-in % [:tools tool-name :definition]) extensions))

;; ============================================================================
;; Command Registration
;; ============================================================================

(defn register-command
  "Register a command on an extension. Returns updated extension."
  [extension name command-map]
  (let [registered (merge {:name name
                           :source-info (extension-source-info extension)}
                          command-map)]
    (assoc-in extension [:commands name] registered)))

(defn resolve-command-names
  "Resolve command names, disambiguating duplicates with occurrence suffixes.
   Returns a vector of resolved commands."
  [extensions]
  (let [all-commands (mapcat (fn [ext]
                               (map (fn [[_name cmd]] cmd) (:commands ext)))
                             extensions)
        counts (frequencies (map :name all-commands))
        seen (volatile! {})]
    (mapv (fn [cmd]
            (let [name (:name cmd)
                  occurrence (inc (get @seen name 0))]
              (vswap! seen update name (fnil inc 0))
              (if (> (get counts name) 1)
                (assoc cmd :invocation-name (str name ":" occurrence))
                (assoc cmd :invocation-name name))))
          all-commands)))

(defn get-resolved-commands
  "Return resolved commands from extensions."
  [extensions]
  (resolve-command-names extensions))

(defn get-command
  "Find a resolved command by invocation name."
  [extensions invocation-name]
  (first (filter #(= (:invocation-name %) invocation-name)
                 (resolve-command-names extensions))))

;; ============================================================================
;; Flag Registration
;; ============================================================================

(defn register-flag
  "Register a flag on an extension. Returns updated extension."
  [extension flag-name flag-map]
  (let [registered (merge {:name flag-name
                           :extension-path (extension-path extension)}
                          flag-map)]
    (assoc-in extension [:flags flag-name] registered)))

(defn get-all-flags
  "Return all flags across extensions (first registration per name wins)."
  [extensions]
  (let [flags-by-name (reduce (fn [acc ext]
                                (reduce-kv (fn [m flag-name flag]
                                             (if (contains? m flag-name)
                                               m
                                               (assoc m flag-name flag)))
                                           acc
                                           (:flags ext)))
                              {}
                              extensions)]
    flags-by-name))

(defn apply-flag-defaults
  "Apply flag default values to a flag-values map. Returns updated flag-values."
  [flag-values flags]
  (reduce-kv (fn [acc flag-name flag]
               (if (and (contains? flag :default)
                        (not (contains? acc flag-name)))
                 (assoc acc flag-name (:default flag))
                 acc))
             flag-values
             flags))

;; ============================================================================
;; Shortcut Registration
;; ============================================================================

(defn register-shortcut
  "Register a keyboard shortcut on an extension. Returns updated extension."
  [extension shortcut-key shortcut-map]
  (let [registered (merge {:shortcut shortcut-key
                           :extension-path (extension-path extension)}
                          shortcut-map)]
    (assoc-in extension [:shortcuts shortcut-key] registered)))

(def reserved-shortcut-keys
  "Shortcuts that extensions cannot override."
  #{"app.interrupt" "app.clear" "app.exit" "app.suspend"
    "app.thinking.cycle" "app.model.cycleForward"
    "app.model.cycleBackward" "app.model.select"
    "app.tools.expand" "app.thinking.toggle"
    "app.editor.external" "app.message.followUp"
    "tui.input.submit" "tui.select.confirm"
    "tui.select.cancel" "tui.input.copy"
    "tui.editor.deleteToLineEnd"})

(defn resolve-shortcuts
  "Resolve shortcut conflicts across extensions.
   Returns a map of shortcut-key -> shortcut, with reserved keys blocked."
  [extensions resolved-keybindings]
  (let [builtin-keys (set (keys resolved-keybindings))]
    (reduce (fn [acc ext]
              (reduce-kv (fn [m key shortcut]
                           (cond
                             (contains? reserved-shortcut-keys key)
                             (do (vswap! acc assoc key {:status :reserved
                                                       :extension-path (:extension-path shortcut)})
                                 m)

                             (contains? builtin-keys key)
                             (assoc m key (assoc shortcut :conflict :builtin))

                             :else
                             (assoc m key shortcut)))
                         acc
                         (:shortcuts ext)))
            {}
            extensions)))

;; ============================================================================
;; Message Renderer Registration
;; ============================================================================

(defn register-message-renderer
  "Register a message renderer for a custom type. Returns updated extension."
  [extension custom-type renderer]
  (assoc-in extension [:message-renderers custom-type] renderer))

(defn get-message-renderer
  "Find a message renderer by custom type across extensions."
  [extensions custom-type]
  (some #(get-in % [:message-renderers custom-type]) extensions))

;; ============================================================================
;; Input Event Handling
;; ============================================================================

(defn emit-input-event
  "Process an input event through extension handlers.
   Transforms chain: each handler can transform text/images or mark as handled.
   Returns the final InputEventResult."
  [extensions text images source]
  (let [ctx {:text text :images images}]
    (loop [current ctx
           exts extensions]
      (if-let [ext (first exts)]
        (let [handlers (get (:handlers ext) "input")]
          (if (seq handlers)
            (let [result (reduce (fn [{:keys [text images]} handler]
                                   (let [event {:type :input
                                                :text text
                                                :images images
                                                :source source}
                                         result (handler event nil)]
                                     (cond
                                       (= (:action result) :handled)
                                       (reduced {:action :handled})

                                       (= (:action result) :transform)
                                       {:text (:text result)
                                        :images (:images result)}

                                       :else
                                       {:text text :images images})))
                                 current
                                 handlers)]
              (if (= (:action result) :handled)
                {:action :handled}
                (recur result (rest exts))))
            (recur current (rest exts))))
        (if (or (not= (:text current) text)
                (not= (:images current) images))
          (cond-> {:action :transform
                   :text (:text current)}
            (seq (:images current)) (assoc :images (:images current)))
          {:action :continue})))))

;; ============================================================================
;; Context Event Handling
;; ============================================================================

(defn emit-context-event
  "Process a context event through extension handlers.
   Each handler can replace the messages vector. Returns final messages."
  [extensions messages]
  (loop [current-messages messages
         exts extensions]
    (if-let [ext (first exts)]
      (let [handlers (get (:handlers ext) "context")]
        (if (seq handlers)
          (let [new-messages (reduce (fn [msgs handler]
                                       (let [event {:type :context
                                                    :messages msgs}
                                             result (handler event nil)]
                                         (if-let [result-msgs (:messages result)]
                                           result-msgs
                                           msgs)))
                                     current-messages
                                     handlers)]
            (recur new-messages (rest exts)))
          (recur current-messages (rest exts))))
      current-messages)))

;; ============================================================================
;; Tool Call Interception
;; ============================================================================

(defn emit-tool-call-event
  "Process a tool call event through extension handlers.
   Returns {:block? boolean :reason string} or nil."
  [extensions tool-call-id tool-name input]
  (loop [exts extensions]
    (if-let [ext (first exts)]
      (let [handlers (get (:handlers ext) "tool_call")]
        (if (seq handlers)
          (let [result (reduce (fn [_ handler]
                                 (let [event {:type :tool_call
                                              :tool-call-id tool-call-id
                                              :tool-name tool-name
                                              :input input}
                                       result (handler event nil)]
                                   (if (:block result)
                                     (reduced {:block? true
                                               :reason (:reason result)})
                                     nil)))
                               nil
                               handlers)]
            (if (:block? result)
              result
              (recur (rest exts))))
          (recur (rest exts))))
      nil)))

;; ============================================================================
;; Tool Result Interception
;; ============================================================================

(defn emit-tool-result-event
  "Process a tool result event through extension handlers.
   Returns merged result modifications or nil."
  [extensions tool-call-id tool-name input content is-error]
  (loop [current {:content content :details nil :is-error is-error}
         exts extensions]
    (if-let [ext (first exts)]
      (let [handlers (get (:handlers ext) "tool_result")]
        (if (seq handlers)
          (let [new-current (reduce (fn [acc handler]
                                      (let [event (merge {:type :tool_result
                                                          :tool-call-id tool-call-id
                                                          :tool-name tool-name
                                                          :input input}
                                                         acc)
                                            result (handler event nil)]
                                        (cond-> acc
                                          (:content result) (assoc :content (:content result))
                                          (:details result) (assoc :details (:details result))
                                          (some? (:is-error result)) (assoc :is-error (:is-error result)))))
                                    current
                                    handlers)]
            (recur new-current (rest exts)))
          (recur current (rest exts))))
      (when (not= current {:content content :details nil :is-error is-error})
        (cond-> {}
          (seq (:content current)) (assoc :content (:content current))
          (:details current) (assoc :details (:details current))
          (not= (:is-error current) is-error) (assoc :is-error (:is-error current)))))))

;; ============================================================================
;; Before Agent Start
;; ============================================================================

(defn emit-before-agent-start
  "Process before_agent_start event through extension handlers.
   Returns {:messages [...] :system-prompt string} or nil."
  [extensions prompt images system-prompt system-prompt-options]
  (loop [current {:messages [] :system-prompt system-prompt}
         exts extensions]
    (if-let [ext (first exts)]
      (let [handlers (get (:handlers ext) "before_agent_start")]
        (if (seq handlers)
          (let [new-current (reduce (fn [acc handler]
                                      (let [event {:type :before_agent_start
                                                   :prompt prompt
                                                   :images images
                                                   :system-prompt (:system-prompt acc)
                                                   :system-prompt-options system-prompt-options}
                                            result (handler event nil)]
                                        (cond-> acc
                                          (:message result) (update :messages conj (:message result))
                                          (:system-prompt result) (assoc :system-prompt (:system-prompt result)))))
                                    current
                                    handlers)]
            (recur new-current (rest exts)))
          (recur current (rest exts))))
      (when (or (seq (:messages current))
                (not= (:system-prompt current) system-prompt))
        current))))

;; ============================================================================
;; Resources Discovery
;; ============================================================================

(defn emit-resources-discover
  "Process resources_discover event through extension handlers.
   Returns {:skill-paths [...] :prompt-paths [...] :theme-paths [...]}."
  [extensions cwd reason]
  (reduce (fn [acc ext]
            (let [handlers (get (:handlers ext) "resources_discover")]
              (if (seq handlers)
                (reduce (fn [acc handler]
                          (let [event {:type :resources_discover
                                       :cwd cwd
                                       :reason reason}
                                result (handler event nil)]
                            (cond-> acc
                              (seq (:skill-paths result)) (update :skill-paths into (:skill-paths result))
                              (seq (:prompt-paths result)) (update :prompt-paths into (:prompt-paths result))
                              (seq (:theme-paths result)) (update :theme-paths into (:theme-paths result)))))
                        acc
                        handlers)
                acc)))
          {:skill-paths [] :prompt-paths [] :theme-paths []}
          extensions))

;; ============================================================================
;; Extension Discovery (pure path computation)
;; ============================================================================

(defn expand-home
  "Expand ~ at the start of a path to the home directory."
  [path home-dir]
  (cond
    (str/starts-with? path "~/") (str home-dir (subs path 1))
    (str/starts-with? path "~") (str home-dir (subs path 1))
    :else path))

(defn resolve-extension-path
  "Resolve a possibly-relative extension path against a base directory."
  [ext-path base-dir home-dir]
  (let [expanded (expand-home ext-path home-dir)]
    (if (str/starts-with? expanded "/")
      expanded
      (str base-dir "/" expanded))))

(defn is-extension-file?
  "Return true if the filename is a recognized extension file."
  [filename]
  (or (str/ends-with? filename ".ts")
      (str/ends-with? filename ".js")
      (str/ends-with? filename ".cljs")))

(defn dedupe-paths
  "Deduplicate extension paths, keeping first occurrence."
  [paths]
  (let [seen (volatile! #{})]
    (filterv (fn [p]
               (let [resolved (str p)]
                 (if (@seen resolved)
                   false
                   (do (vswap! seen conj resolved) true))))
             paths)))
