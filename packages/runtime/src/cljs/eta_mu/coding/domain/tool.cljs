(ns eta-mu.coding.domain.tool
  "Pure domain functions for coding-agent tool management.
   No I/O — tool definitions and dispatch logic only."
  (:require [clojure.string :as str]
            [eta-mu.coding.law.tool :as law]))

;; ============================================================================
;; Tool Definitions
;; ============================================================================

(defn make-tool-definition
  "Create a tool definition map."
  [name label description parameters & {:keys [prompt-snippet prompt-guidelines
                                               execution-mode render-shell]}]
  (cond-> {:name name
           :label label
           :description description
           :parameters parameters}
    prompt-snippet (assoc :prompt-snippet prompt-snippet)
    prompt-guidelines (assoc :prompt-guidelines prompt-guidelines)
    execution-mode (assoc :execution-mode execution-mode)
    render-shell (assoc :render-shell render-shell)))

(defn tool-display-name
  "Return the display name for a tool."
  [tool-def]
  (or (:label tool-def) (:name tool-def)))

(defn tool-execution-mode
  "Return the execution mode for a tool, defaulting to :sequential."
  [tool-def]
  (or (:execution-mode tool-def) :sequential))

;; ============================================================================
;; Built-in Tool Definitions
;; ============================================================================

(def read-tool-def
  (make-tool-definition
   "read" "Read" "Read file contents with optional line range"
   {:type "object"
    :properties {:path {:type "string" :description "Path to the file to read"}
                 :offset {:type "number" :description "Line number to start from (1-indexed)"}
                 :limit {:type "number" :description "Maximum number of lines to read"}}
    :required ["path"]}))

(def bash-tool-def
  (make-tool-definition
   "bash" "Bash" "Execute a bash command"
   {:type "object"
    :properties {:command {:type "string" :description "Bash command to execute"}
                 :timeout {:type "number" :description "Timeout in seconds"}}
    :required ["command"]}
   :execution-mode :sequential))

(def edit-tool-def
  (make-tool-definition
   "edit" "Edit" "Apply targeted string replacements to a file"
   {:type "object"
    :properties {:path {:type "string" :description "Path to the file to edit"}
                 :edits {:type "array"
                         :items {:type "object"
                                 :properties {:oldText {:type "string"}
                                              :newText {:type "string"}}
                                 :required ["oldText" "newText"]}
                         :description "Targeted replacements"}}
    :required ["path" "edits"]}
   :execution-mode :sequential))

(def write-tool-def
  (make-tool-definition
   "write" "Write" "Write content to a file"
   {:type "object"
    :properties {:path {:type "string" :description "Path to the file to write"}
                 :content {:type "string" :description "Content to write"}}
    :required ["path" "content"]}
   :execution-mode :sequential))

(def grep-tool-def
  (make-tool-definition
   "grep" "Grep" "Search file contents using regex or literal patterns"
   {:type "object"
    :properties {:pattern {:type "string" :description "Search pattern"}
                 :path {:type "string" :description "Directory or file to search"}
                 :glob {:type "string" :description "File glob filter"}
                 :ignoreCase {:type "boolean" :description "Case-insensitive search"}
                 :literal {:type "boolean" :description "Treat pattern as literal string"}
                 :context {:type "number" :description "Context lines around matches"}
                 :limit {:type "number" :description "Max matches to return"}}
    :required ["pattern"]}))

(def find-tool-def
  (make-tool-definition
   "find" "Find" "Find files matching a glob pattern"
   {:type "object"
    :properties {:pattern {:type "string" :description "Glob pattern to match"}
                 :path {:type "string" :description "Directory to search in"}
                 :limit {:type "number" :description "Maximum results"}}
    :required ["pattern"]}))

(def ls-tool-def
  (make-tool-definition
   "ls" "Ls" "List directory contents"
   {:type "object"
    :properties {:path {:type "string" :description "Directory to list"}
                 :limit {:type "number" :description "Maximum entries"}}
    :required []}
   :prompt-snippet "List files"))

(def built-in-tools
  "Map of tool-name -> tool definition for all built-in coding-agent tools."
  {"read" read-tool-def
   "bash" bash-tool-def
   "edit" edit-tool-def
   "write" write-tool-def
   "grep" grep-tool-def
   "find" find-tool-def
   "ls" ls-tool-def})

;; ============================================================================
;; Tool Sets
;; ============================================================================

(def coding-tool-names #{"read" "bash" "edit" "write"})
(def read-only-tool-names #{"read" "grep" "find" "ls"})
(def all-tool-names (set (keys built-in-tools)))

(defn get-tool-definition
  "Return the tool definition by name, or nil."
  [tool-name]
  (get built-in-tools tool-name))

(defn tool-names-for-set
  "Return tool names for a tool set."
  [tool-set]
  (case tool-set
    :coding coding-tool-names
    :read-only read-only-tool-names
    :all all-tool-names
    #{}))

;; ============================================================================
;; Active Tool Management
;; ============================================================================

(defn make-tool-state
  "Create an initial tool state with all tools active."
  ([]
   (make-tool-state all-tool-names))
  ([active-names]
   {:active-tools (vec active-names)
    :all-tool-names (vec all-tool-names)}))

(defn set-active-tools
  "Set the active tool names. Returns updated tool state."
  [tool-state tool-names]
  (let [valid (filter all-tool-names tool-names)]
    (assoc tool-state :active-tools (vec valid))))

(defn get-active-tools
  "Return the active tool names."
  [tool-state]
  (set (:active-tools tool-state)))

(defn is-tool-active?
  "Return true if the named tool is active."
  [tool-state tool-name]
  (contains? (get-active-tools tool-state) tool-name))

(defn get-active-tool-definitions
  "Return tool definitions for all active tools."
  [tool-state]
  (->> (:active-tools tool-state)
       (map (fn [name] [name (get built-in-tools name)]))
       (keep second)
       vec))

;; ============================================================================
;; Tool Call Validation
;; ============================================================================

(defn validate-tool-call
  "Validate a tool call descriptor. Returns nil on success, or an error map."
  [{:keys [tool-name input]}]
  (cond
    (not (contains? all-tool-names tool-name))
    {:error :unknown-tool
     :tool-name tool-name
     :message (str "Unknown tool: " tool-name)}

    (not (law/valid-tool-input? (keyword tool-name) input))
    {:error :invalid-input
     :tool-name tool-name
     :message (str "Invalid input for tool " tool-name)
     :explanation (law/explain (str (str/capitalize (name (keyword tool-name))) "Input") input)}

    :else nil))

(defn prepare-edit-arguments
  "Prepare edit tool arguments, handling legacy single-edit format.
   Returns normalized edit input."
  [input]
  (if (and (:oldText input) (:newText input) (not (:edits input)))
    {:path (or (:path input) (:file_path input))
     :edits [{:old-text (:oldText input)
              :new-text (:newText input)}]}
    (let [edits (or (:edits input) [])]
      {:path (or (:path input) (:file_path input))
       :edits (mapv (fn [e]
                      {:old-text (or (:oldText e) (:old-text e))
                       :new-text (or (:newText e) (:new-text e))})
                    edits)})))

(defn normalize-tool-input
  "Normalize tool input arguments (handle aliases, legacy formats)."
  [tool-name input]
  (case (keyword tool-name)
    :edit (prepare-edit-arguments input)
    :read (let [path (or (:path input) (:file_path input))]
            (cond-> (dissoc input :file_path)
              path (assoc :path path)))
    input))

;; ============================================================================
;; Tool Result Construction
;; ============================================================================

(defn make-tool-result
  "Create a tool result map."
  [content is-error & {:keys [details]}]
  (cond-> {:content (if (string? content) [{:type :text :text content}] content)
           :is-error is-error}
    details (assoc :details details)))

(defn make-error-result
  "Create an error tool result."
  [message]
  (make-tool-result [{:type :text :text message}] true))

(defn make-text-result
  "Create a text tool result."
  [text]
  (make-tool-result [{:type :text :text text}] false))

;; ============================================================================
;; Truncation Helpers
;; ============================================================================

(def default-max-bytes (* 1024 10))  ;; 10KB
(def default-max-lines 2000)
(def default-grep-limit 100)
(def default-find-limit 1000)
(def default-ls-limit 500)
(def grep-max-line-length 4096)

(defn make-truncation-result
  "Create a truncation result map."
  [total-bytes total-lines truncated? head-truncated? tail-truncated?]
  {:total-bytes total-bytes
   :total-lines total-lines
   :truncated truncated?
   :head-truncated head-truncated?
   :tail-truncated tail-truncated?})

(defn truncate-to-bytes
  "Truncate a string to max-bytes. Returns [truncated-string truncation-result]."
  [s max-bytes]
  (let [total-bytes (count s)]
    (if (<= total-bytes max-bytes)
      [s (make-truncation-result total-bytes 0 false false false)]
      (let [truncated (subs s 0 max-bytes)
            truncated-lines (count (str/split-lines truncated))]
        [truncated (make-truncation-result total-bytes truncated-lines true false true)]))))

(defn format-size
  "Format byte count as human-readable string."
  [bytes]
  (cond
    (< bytes 1024) (str bytes "B")
    (< bytes (* 1024 1024)) (str (quot bytes 1024) "KB")
    :else (str (quot bytes (* 1024 1024)) "MB")))
