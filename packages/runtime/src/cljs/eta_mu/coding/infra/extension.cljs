(ns eta-mu.coding.infra.extension
  "Extension runner: lifecycle, event emission, tool/command/flag registration.
   Depends on law/extension, shape/extension, domain/extension, extern/fs."
  (:require [clojure.string :as str]
            [eta-mu.coding.extern.fs :as fs]))

;; ============================================================================
;; Extension Runtime State
;; ============================================================================

(defn create-extension-runtime
  "Create a fresh extension runtime state map."
  []
  {:flag-values {}
   :pending-provider-registrations []
   :stale-message nil
   :actions nil
   :context-actions nil})

(defn assert-active!
  "Throw if the runtime has been invalidated."
  [runtime]
  (when-let [msg (:stale-message runtime)]
    (throw (fs/make-error msg))))

(defn invalidate!
  "Mark the runtime as stale."
  [runtime message]
  (assoc runtime :stale-message (or message "Extension runtime is stale")))

;; ============================================================================
;; Extension Object
;; ============================================================================

(defn create-extension
  "Create an empty extension map."
  [extension-path resolved-path]
  {:path extension-path
   :resolved-path resolved-path
   :source-info {:source "local" :base-dir (fs/path-dirname resolved-path)}
   :handlers {}
   :tools {}
   :message-renderers {}
   :commands {}
   :flags {}
   :shortcuts {}})

;; ============================================================================
;; Extension API (pi.* methods)
;; ============================================================================

(defn create-extension-api
  "Create the ExtensionAPI map for an extension."
  [extension runtime _cwd]
  (let [result
        {:on (fn [event-type handler]
               (assert-active! runtime)
               (let [handlers (get (:handlers extension) event-type [])
                     extension (assoc-in extension [:handlers event-type] (conj handlers handler))]
                 extension))

         :register-tool (fn [tool-def]
                          (assert-active! runtime)
                          (let [extension (assoc-in extension [:tools (:name tool-def)] {:definition tool-def :source-info (:source-info extension)})]
                            extension))

         :register-command (fn [name opts]
                             (assert-active! runtime)
                             (let [extension (assoc-in extension [:commands name] {:name name :source-info (:source-info extension) :handler (:handler opts) :description (:description opts)})]
                               extension))

         :register-shortcut (fn [shortcut opts]
                              (assert-active! runtime)
                              (let [extension (assoc-in extension [:shortcuts shortcut] {:shortcut shortcut :extension-path (:path extension) :handler (:handler opts) :description (:description opts)})]
                                extension))

         :register-flag (fn [name opts]
                          (assert-active! runtime)
                          (let [extension (assoc-in extension [:flags name] {:name name :extension-path (:path extension) :type (:type opts) :default (:default opts) :description (:description opts)})
                                runtime (if (and (:default opts) (not (contains? (:flag-values runtime) name)))
                                          (assoc-in runtime [:flag-values name] (:default opts))
                                          runtime)]
                            {:extension extension :runtime runtime}))

         :get-flag (fn [name]
                     (assert-active! runtime)
                     (get (:flag-values runtime) name))

         :send-message (fn [message opts]
                         (assert-active! runtime)
                         (when-let [actions (:actions runtime)]
                           ((:send-message actions) message opts)))

         :send-user-message (fn [content opts]
                              (assert-active! runtime)
                              (when-let [actions (:actions runtime)]
                                ((:send-user-message actions) content opts)))

         :append-entry (fn [custom-type data]
                         (assert-active! runtime)
                         (when-let [actions (:actions runtime)]
                           ((:append-entry actions) custom-type data)))

         :set-session-name (fn [name]
                             (assert-active! runtime)
                             (when-let [actions (:actions runtime)]
                               ((:set-session-name actions) name)))

         :get-session-name (fn []
                             (assert-active! runtime)
                             (when-let [actions (:actions runtime)]
                               ((:get-session-name actions))))

         :set-label (fn [entry-id label]
                      (assert-active! runtime)
                      (when-let [actions (:actions runtime)]
                        ((:set-label actions) entry-id label)))

         :get-active-tools (fn []
                             (assert-active! runtime)
                             (when-let [actions (:actions runtime)]
                               ((:get-active-tools actions))))

         :get-all-tools (fn []
                          (assert-active! runtime)
                          (when-let [actions (:actions runtime)]
                            ((:get-all-tools actions))))

         :set-active-tools (fn [tool-names]
                             (assert-active! runtime)
                             (when-let [actions (:actions runtime)]
                               ((:set-active-tools actions) tool-names)))

         :get-commands (fn []
                         (assert-active! runtime)
                         (when-let [actions (:actions runtime)]
                           ((:get-commands actions))))

         :set-model (fn [model]
                      (assert-active! runtime)
                      (when-let [actions (:actions runtime)]
                        ((:set-model actions) model)))

         :get-thinking-level (fn []
                               (assert-active! runtime)
                               (when-let [actions (:actions runtime)]
                                 ((:get-thinking-level actions))))

         :set-thinking-level (fn [level]
                               (assert-active! runtime)
                               (when-let [actions (:actions runtime)]
                                 ((:set-thinking-level actions) level)))

         :register-provider (fn [name config]
                              (assert-active! runtime)
                              (when-let [actions (:actions runtime)]
                                ((:register-provider actions) name config (:path extension))))

         :unregister-provider (fn [name]
                                (assert-active! runtime)
                                (when-let [actions (:actions runtime)]
                                  ((:unregister-provider actions) name (:path extension))))}]
    result))

;; ============================================================================
;; Extension Runner
;; ============================================================================

(defn create-runner
  "Create an extension runner state map."
  [extensions runtime cwd]
  {:extensions extensions
   :runtime runtime
   :cwd cwd
   :ui-context nil
   :error-listeners #{}
   :model-fn (fn [] nil)
   :idle-fn (fn [] true)
   :signal-fn (fn [] nil)
   :abort-fn (fn [])
   :has-pending-messages-fn (fn [] false)
   :context-usage-fn (fn [] nil)
   :compact-fn (fn [_opts])
   :system-prompt-fn (fn [] "")
   :new-session-handler (fn [_opts] {:cancelled false})
   :fork-handler (fn [_entry-id _opts] {:cancelled false})
   :navigate-tree-handler (fn [_target-id _opts] {:cancelled false})
   :switch-session-handler (fn [_session-path _opts] {:cancelled false})
   :reload-handler (fn [] (fs/promise-resolve nil))
   :shutdown-handler (fn [])
   :shortcut-diagnostics []
   :command-diagnostics []})

(defn bind-core!
  "Bind action implementations to the runner."
  [runner actions context-actions]
  (let [runtime (:runtime runner)
        runtime (assoc runtime :actions actions :context-actions context-actions)
        ;; Flush pending provider registrations
        runtime (reduce (fn [r reg]
                          (when-let [actions (:actions r)]
                            ((:register-provider actions) (:name reg) (:config reg) (:extension-path reg)))
                          r)
                        runtime
                        (:pending-provider-registrations runtime))
        runtime (assoc runtime :pending-provider-registrations [])]
    (assoc runner :runtime runtime
                  :model-fn (or (:get-model context-actions) (fn [] nil))
                  :idle-fn (or (:is-idle context-actions) (fn [] true))
                  :signal-fn (or (:get-signal context-actions) (fn [] nil))
                  :abort-fn (or (:abort context-actions) (fn []))
                  :has-pending-messages-fn (or (:has-pending-messages context-actions) (fn [] false))
                  :shutdown-fn (or (:shutdown context-actions) (fn []))
                  :context-usage-fn (or (:get-context-usage context-actions) (fn [] nil))
                   :compact-fn (or (:compact context-actions) (fn [_opts]))
                  :system-prompt-fn (or (:get-system-prompt context-actions) (fn [] "")))))

(defn create-context
  "Create an ExtensionContext map for event handlers."
  [runner]
  (let [assert-active (fn [] (assert-active! (:runtime runner)))]
    {:ui (or (:ui-context runner) {})
     :has-ui (boolean (:ui-context runner))
     :cwd (:cwd runner)
     :model ((:model-fn runner))
     :is-idle (fn [] (assert-active) ((:idle-fn runner)))
     :signal ((:signal-fn runner))
     :abort (fn [] (assert-active) ((:abort-fn runner)))
     :has-pending-messages (fn [] (assert-active) ((:has-pending-messages-fn runner)))
     :shutdown (fn [] (assert-active) ((:shutdown-fn runner)))
     :get-context-usage (fn [] (assert-active) ((:context-usage-fn runner)))
     :compact (fn [opts] (assert-active) ((:compact-fn runner) opts))
     :get-system-prompt (fn [] (assert-active) ((:system-prompt-fn runner)))}))

(defn create-command-context
  "Create an ExtensionCommandContext map with session control methods."
  [runner]
  (let [ctx (create-context runner)]
    (assoc ctx
            :wait-for-idle (fn [] (fs/promise-resolve nil))
           :new-session (fn [opts] ((:new-session-handler runner) opts))
           :fork (fn [entry-id opts] ((:fork-handler runner) entry-id opts))
           :navigate-tree (fn [target-id opts] ((:navigate-tree-handler runner) target-id opts))
           :switch-session (fn [session-path opts] ((:switch-session-handler runner) session-path opts))
           :reload (fn [] ((:reload-handler runner))))))

;; ============================================================================
;; Event Emission
;; ============================================================================

(defn has-handlers?
  "Check if any extension has handlers for an event type."
  [runner event-type]
  (boolean
   (some (fn [ext]
           (let [handlers (get (:handlers ext) event-type)]
             (and handlers (pos? (count handlers)))))
         (:extensions runner))))

(defn emit-error!
  "Emit an error to all registered listeners."
  [runner error]
  (doseq [listener (:error-listeners runner)]
    (listener error))
  runner)

(defn on-error
  "Register an error listener. Returns a function to unregister."
  [runner listener]
  (swap! runner update :error-listeners conj listener)
  (fn [] (swap! runner update :error-listeners disj listener)))

(defn emit
  "Emit an event to all extension handlers. Returns result or nil."
  [runner event]
  (let [ctx (create-context runner)]
    (loop [extensions (:extensions runner)
           result nil]
      (if-let [ext (first extensions)]
        (let [handlers (get (:handlers ext) (:type event) [])
              result (reduce (fn [r handler]
                               (try
                                 (let [handler-result (handler event ctx)]
                                   (if (and (:cancel handler-result) (contains? #{:session-before-switch :session-before-fork :session-before-compact :session-before-tree} (:type event)))
                                     (reduced handler-result)
                                     (or r handler-result)))
                                  (catch :default e
                                    (emit-error! runner {:extension-path (:path ext)
                                                         :event (:type event)
                                                         :error (fs/error-message e)
                                                         :stack (fs/error-stack e)})
                                    r)))
                             result
                             handlers)]
          (recur (rest extensions) result))
        result))))

(defn emit-tool-call
  "Emit a tool_call event. Returns {:block true} if blocked, nil otherwise."
  [runner event]
  (let [ctx (create-context runner)]
    (loop [extensions (:extensions runner)]
      (when-let [ext (first extensions)]
        (let [handlers (get (:handlers ext) "tool_call" [])]
          (if-let [result (some (fn [handler]
                                  (try
                                    (let [result (handler event ctx)]
                                      (when (:block result) result))
                                    (catch :default e
                                      (emit-error! runner {:extension-path (:path ext)
                                                           :event "tool_call"
                                                           :error (fs/error-message e)
                                                           :stack (fs/error-stack e)})
                                      nil)))
                                handlers)]
            result
            (recur (rest extensions))))))))

(defn emit-tool-result
  "Emit a tool_result event. Returns modified result or nil."
  [runner event]
  (let [ctx (create-context runner)]
    (loop [extensions (:extensions runner)
           current-event event
           modified? false]
      (if-let [ext (first extensions)]
        (let [handlers (get (:handlers ext) "tool_result" [])
              [current-event modified?]
              (reduce (fn [[evt mod?] handler]
                        (try
                          (let [result (handler evt ctx)]
                            (if result
                              [(cond-> evt
                                 (:content result) (assoc :content (:content result))
                                 (:details result) (assoc :details (:details result))
                                 (contains? result :is-error) (assoc :is-error (:is-error result)))
                               true]
                              [evt mod?]))
                            (catch :default e
                              (emit-error! runner {:extension-path (:path ext)
                                                   :event "tool_result"
                                                   :error ((fs/error-message e))
                                                   :stack ((fs/error-stack e))})
                              [evt mod?])))
                      [current-event modified?]
                      handlers)]
          (recur (rest extensions) current-event modified?))
        (when modified?
          {:content (:content current-event)
           :details (:details current-event)
           :is-error (:is-error current-event)})))))

(defn emit-context
  "Emit a context event. Returns modified messages vector."
  [runner messages]
  (let [ctx (create-context runner)]
    (reduce (fn [current-messages ext]
              (let [handlers (get (:handlers ext) "context" [])]
                (reduce (fn [msgs handler]
                          (try
                            (let [event {:type "context" :messages msgs}
                                  result (handler event ctx)]
                              (if-let [new-messages (:messages result)]
                                new-messages
                                msgs))
                            (catch :default e
                              (emit-error! runner {:extension-path (:path ext)
                                                   :event "context"
                                                   :error ((fs/error-message e))
                                                   :stack ((fs/error-stack e))})
                              msgs)))
                        current-messages
                        handlers)))
            messages
            (:extensions runner))))

(defn emit-before-provider-request
  "Emit a before_provider_request event. Returns modified payload."
  [runner payload]
  (let [ctx (create-context runner)]
    (reduce (fn [current-payload ext]
              (let [handlers (get (:handlers ext) "before_provider_request" [])]
                (reduce (fn [p handler]
                          (try
                            (let [event {:type "before_provider_request" :payload p}
                                  result (handler event ctx)]
                              (or result p))
                            (catch :default e
                              (emit-error! runner {:extension-path (:path ext)
                                                   :event "before_provider_request"
                                                   :error ((fs/error-message e))
                                                   :stack ((fs/error-stack e))})
                              p)))
                        current-payload
                        handlers)))
            payload
            (:extensions runner))))

(defn emit-before-agent-start
  "Emit a before_agent_start event. Returns {:messages [...] :system-prompt ...} or nil."
  [runner prompt images system-prompt system-prompt-options]
  (let [ctx (create-context runner)
        current-prompt (atom system-prompt)
        messages (atom [])]
    (doseq [ext (:extensions runner)]
      (let [handlers (get (:handlers ext) "before_agent_start" [])]
        (doseq [handler handlers]
          (try
            (let [event {:type "before_agent_start"
                         :prompt prompt
                         :images images
                         :system-prompt @current-prompt
                         :system-prompt-options system-prompt-options}
                  result (handler event ctx)]
              (when result
                (when-let [msg (:message result)]
                  (swap! messages conj msg))
                (when-let [sp (:system-prompt result)]
                  (reset! current-prompt sp))))
            (catch :default e
              (emit-error! runner {:extension-path (:path ext)
                                   :event "before_agent_start"
                                   :error ((fs/error-message e))
                                   :stack ((fs/error-stack e))}))))))
    (when (or (seq @messages) (not= @current-prompt system-prompt))
      {:messages (when (seq @messages) @messages)
       :system-prompt (when (not= @current-prompt system-prompt) @current-prompt)})))

(defn emit-input
  "Emit an input event. Returns {:action :continue/:transform/:handled ...}."
  [runner text images source]
  (let [ctx (create-context runner)
        current-text (atom text)
        current-images (atom images)]
    (loop [extensions (:extensions runner)]
      (if-let [ext (first extensions)]
        (let [handlers (get (:handlers ext) "input" [])
              result (reduce (fn [r handler]
                               (try
                                 (let [event {:type "input"
                                              :text @current-text
                                              :images @current-images
                                              :source source}
                                       result (handler event ctx)]
                                   (cond
                                     (= "handled" (:action result))
                                     (reduced result)
                                     (= "transform" (:action result))
                                     (do
                                       (reset! current-text (:text result))
                                       (when-let [imgs (:images result)]
                                         (reset! current-images imgs))
                                       result)
                                     :else r))
                                 (catch :default e
                                   (emit-error! runner {:extension-path (:path ext)
                                                        :event "input"
                                                        :error ((fs/error-message e))
                                                        :stack ((fs/error-stack e))})
                                   r)))
                             nil
                             handlers)]
          (if (= "handled" (:action result))
            result
            (recur (rest extensions))))
        (if (or (not= @current-text text) (not= @current-images images))
          {:action "transform" :text @current-text :images @current-images}
          {:action "continue"})))))

;; ============================================================================
;; Tool/Command Accessors
;; ============================================================================

(defn get-all-registered-tools
  "Get all registered tools from all extensions (first per name wins)."
  [runner]
  (let [tools-by-name (atom {})]
    (doseq [ext (:extensions runner)]
      (doseq [[name tool] (:tools ext)]
        (when-not (contains? @tools-by-name name)
          (swap! tools-by-name assoc name tool))))
    (vals @tools-by-name)))

(defn get-tool-definition
  "Get a tool definition by name. Returns nil if not found."
  [runner tool-name]
  (some (fn [ext]
          (when-let [tool (get (:tools ext) tool-name)]
            (:definition tool)))
        (:extensions runner)))

(defn get-flags
  "Get all registered flags from all extensions (first per name wins)."
  [runner]
  (let [all-flags (atom {})]
    (doseq [ext (:extensions runner)]
      (doseq [[name flag] (:flags ext)]
        (when-not (contains? @all-flags name)
          (swap! all-flags assoc name flag))))
    @all-flags))

(defn set-flag-value
  "Set a flag value in the runtime."
  [runner name value]
  (assoc-in runner [:runtime :flag-values name] value))

(defn get-flag-values
  "Get all flag values."
  [runner]
  (get-in runner [:runtime :flag-values]))

(defn get-registered-commands
  "Get all registered commands with resolved invocation names."
  [runner]
  (let [commands (atom [])
        counts (atom {})]
    (doseq [ext (:extensions runner)]
      (doseq [[name cmd] (:commands ext)]
        (swap! commands conj cmd)
        (swap! counts update name (fnil inc 0))))
    (let [seen (atom {})
          taken-names (atom #{})]
      (mapv (fn [cmd]
              (let [occurrence (get @seen (:name cmd) 0)
                    _ (swap! seen update (:name cmd) (fnil inc 0))
                    invocation-name (if (> (get @counts (:name cmd) 0) 1)
                                      (str (:name cmd) ":" occurrence)
                                      (:name cmd))
                    invocation-name (loop [suffix occurrence
                                          name invocation-name]
                                     (if (@taken-names name)
                                       (recur (inc suffix) (str (:name cmd) ":" suffix))
                                       name))]
                (swap! taken-names conj invocation-name)
                (assoc cmd :invocation-name invocation-name)))
            @commands))))

(defn get-command
  "Get a command by invocation name."
  [runner name]
  (some (fn [cmd]
          (when (= (:invocation-name cmd) name)
            cmd))
        (get-registered-commands runner)))

(defn get-message-renderer
  "Get a message renderer for a custom type."
  [runner custom-type]
  (some (fn [ext]
          (get (:message-renderers ext) custom-type))
        (:extensions runner)))

;; ============================================================================
;; Extension Discovery
;; ============================================================================

(def ^:private config-dir-name ".eta-mu")

(defn extension-file?
  "Return true if the filename looks like an extension file."
  [name]
  (or (.endsWith name ".ts")
      (.endsWith name ".js")
      (.endsWith name ".cljs")))

(defn read-pi-manifest
  "Read a package.json and extract the pi manifest if present."
  [package-json-path]
  (let [result (fs/read-json-file package-json-path)]
    (when (:ok result)
      (let [pkg (:data result)]
        (when (and pkg (.-pi pkg))
          (fs/to-clj (.-pi pkg)))))))

(defn resolve-extension-entries
  "Resolve extension entry points from a directory.
   Returns vector of paths or nil if no entries found."
  [dir]
  (let [package-json-path (fs/path-join dir "package.json")]
    (if (fs/file-exists? package-json-path)
      (let [manifest (read-pi-manifest package-json-path)]
        (when-let [ext-paths (:extensions manifest)]
          (let [entries (into []
                              (comp
                               (map (fn [p] (fs/path-resolve dir p)))
                               (filter fs/file-exists?))
                              ext-paths)]
            (when (seq entries) entries))))
      ;; Check for index files
      (let [index-ts (fs/path-join dir "index.ts")
            index-js (fs/path-join dir "index.js")
            index-cljs (fs/path-join dir "index.cljs")]
        (cond
          (fs/file-exists? index-ts) [index-ts]
          (fs/file-exists? index-js) [index-js]
          (fs/file-exists? index-cljs) [index-cljs]
          :else nil)))))

(defn discover-extensions-in-dir
  "Discover extensions in a directory.
   Discovery rules:
   1. Direct files: *.ts, *.js, *.cljs -> load
   2. Subdirectory with index or package.json -> load entries"
  [dir]
  (if-not (fs/directory-exists? dir)
    []
    (let [result (fs/list-directory dir)]
      (if-not (:ok result)
        []
        (into []
              (mapcat (fn [entry]
                        (let [entry-path (:absolute-path entry)]
                          (cond
                            ;; Direct extension files
                            (and (or (:file? entry) (:symbolic-link? entry))
                                 (extension-file? (:name entry)))
                            [entry-path]

                            ;; Subdirectories
                            (or (:directory? entry) (:symbolic-link? entry))
                            (or (resolve-extension-entries entry-path) [])

                            :else []))))
              (:entries result))))))

(defn expand-path
  "Expand ~ to home directory."
  [p]
  (let [normalized (-> p
                       (str/replace "\u00A0" " ")
                       (str/replace "\u2000" " ")
                       (str/replace "\u2001" " ")
                       (str/replace "\u2002" " ")
                       (str/replace "\u2003" " ")
                       (str/replace "\u2004" " ")
                       (str/replace "\u2005" " ")
                       (str/replace "\u2006" " ")
                       (str/replace "\u2007" " ")
                       (str/replace "\u2008" " ")
                       (str/replace "\u2009" " ")
                       (str/replace "\u200A" " ")
                       (str/replace "\u202F" " ")
                       (str/replace "\u205F" " ")
                       (str/replace "\u3000" " "))]
    (cond
      (.startsWith normalized "~/")
      (fs/path-join (fs/env-get "HOME") (subs normalized 2))

      (.startsWith normalized "~")
      (fs/path-join (fs/env-get "HOME") (subs normalized 1))

      :else normalized)))

(defn resolve-path
  "Resolve a path relative to cwd."
  [ext-path cwd]
  (let [expanded (expand-path ext-path)]
    (if (str/starts-with? expanded "/")
      expanded
      (fs/path-resolve cwd expanded))))

(defn discover-and-collect-paths
  "Discover extension paths from standard locations.
   Returns a vector of unique extension paths."
  [configured-paths cwd agent-dir]
  (let [seen (atom #{})
        add-paths (fn [paths]
                    (into []
                          (comp
                           (map (fn [p] [(fs/path-resolve p) p]))
                           (filter (fn [[resolved _]]
                                     (not (@seen resolved))))
                           (map (fn [[resolved p]]
                                  (swap! seen conj resolved)
                                  p)))
                          paths))]
    (vec
     (concat
      ;; 1. Project-local extensions
      (add-paths (discover-extensions-in-dir
                  (fs/path-join cwd config-dir-name "extensions")))
      ;; 2. Global extensions
      (add-paths (discover-extensions-in-dir
                  (fs/path-join agent-dir "extensions")))
      ;; 3. Explicitly configured paths
      (mapcat (fn [p]
                (let [resolved (resolve-path p cwd)]
                  (if (and (fs/file-exists? resolved)
                           (fs/directory-exists? resolved))
                    (or (resolve-extension-entries resolved)
                        (discover-extensions-in-dir resolved))
                    [resolved])))
              configured-paths)))))

;; ============================================================================
;; Extension Loading
;; ============================================================================

(defn load-cljs-extension
  "Load a pre-compiled CLJS extension from a JS file.
   The JS file must export a default function (the extension factory).
   Returns {:extension ext :error nil} or {:extension nil :error msg}."
  [extension-path resolved-path cwd runtime]
  (try
    (let [factory (fs/node-require resolved-path)
          factory-fn (if (fn? factory) factory (.-default factory))]
      (if (fn? factory-fn)
        (let [extension (create-extension extension-path resolved-path)
              api (create-extension-api extension runtime cwd)]
          (factory-fn (fs/to-js api))
          {:extension extension :error nil})
        {:extension nil :error (str "Extension does not export a valid factory function: " extension-path)}))
    (catch :default e
      {:extension nil :error (str "Failed to load extension: " (fs/error-message e))})))

(defn load-extension
  "Load an extension from a path.
   - .cljs files must be pre-compiled to JS (use compile-cljs-extension from TS shell)
   - .ts/.js files require jiti loader (use TS compatibility shell)
   Returns {:extension ext :error nil} or {:extension nil :error msg}."
  [extension-path cwd runtime]
  (let [resolved-path (resolve-path extension-path cwd)]
    (cond
      ;; CLJS extensions must be pre-compiled
      (.endsWith extension-path ".cljs")
      (load-cljs-extension extension-path resolved-path cwd runtime)

      ;; TS/JS extensions require jiti (TS compatibility shell)
      (or (.endsWith extension-path ".ts")
          (.endsWith extension-path ".js"))
      {:extension nil :error (str "TS/JS extension loading requires TS compatibility shell: " extension-path)}

      :else
      {:extension nil :error (str "Unknown extension type: " extension-path)})))

(defn load-extensions
  "Load extensions from a list of paths.
   Returns {:extensions [...] :errors [...]}." 
  [paths cwd runtime]
  (let [result (atom {:extensions [] :errors []})]
    (doseq [path paths]
      (let [{:keys [extension error]} (load-extension path cwd runtime)]
        (if error
          (swap! result update :errors conj {:path path :error error})
          (when extension
            (swap! result update :extensions conj extension)))))
    @result))

(defn discover-and-load-extensions
  "Discover and load extensions from standard locations.
   Returns {:extensions [...] :errors [...] :runtime runtime}."
  [configured-paths cwd agent-dir runtime]
  (let [paths (discover-and-collect-paths configured-paths cwd agent-dir)
        loaded (load-extensions paths cwd runtime)]
    (assoc loaded :runtime runtime)))
