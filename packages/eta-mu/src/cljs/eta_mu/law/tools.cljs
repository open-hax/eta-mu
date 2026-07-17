(ns eta-mu.law.tools
  "Malli argument schemas and OpenAI-compatible JSON-schema parameter maps for
  the agent's coding tools (read, bash, edit, write, find, grep, ls).

  Argument schemas validate tool-call arguments at execute time. Parameter
  maps are the `:parameters` value carried on the tool descriptor and passed
  through unchanged by `eta-mu.turn-processor.shape.tool` to the LLM."
  (:require [malli.core :as m]))

(def read-args-schema
  [:map
   [:path [:string {:min 1}]]
   [:offset {:optional true} [:int {:min 1}]]
   [:limit {:optional true} [:int {:min 1}]]])

(def bash-args-schema
  [:map
   [:command [:string {:min 1}]]
   [:timeout {:optional true} [:int {:min 1}]]])

(def edit-args-schema
  [:map
   [:path [:string {:min 1}]]
   [:old_text [:string {:min 1}]]
   [:new_text :string]])

(def write-args-schema
  [:map
   [:path [:string {:min 1}]]
   [:content :string]])

(def find-args-schema
  [:map
   [:pattern [:string {:min 1}]]
   [:path {:optional true} :string]
   [:limit {:optional true} [:int {:min 1}]]])

(def grep-args-schema
  [:map
   [:pattern [:string {:min 1}]]
   [:path {:optional true} :string]
   [:glob {:optional true} :string]
   [:ignoreCase {:optional true} :boolean]
   [:literal {:optional true} :boolean]
   [:context {:optional true} [:int {:min 0}]]
   [:limit {:optional true} [:int {:min 1}]]])

(def ls-args-schema
  [:map
   [:path {:optional true} :string]
   [:limit {:optional true} [:int {:min 1}]]])

(defn valid-args? [schema args]
  (m/validate schema args))

(defn explain-args [schema args]
  (m/explain schema args))

(def read-parameters
  {:type "object"
   :properties {:path {:type "string"
                       :description "Path to the file to read (relative or absolute)"}
                :offset {:type "integer"
                        :description "Line number to start reading from (1-indexed)"}
                :limit {:type "integer"
                       :description "Maximum number of lines to read"}}
   :required ["path"]})

(def bash-parameters
  {:type "object"
   :properties {:command {:type "string"
                          :description "Bash command to execute"}
                :timeout {:type "integer"
                         :description "Timeout in seconds (optional, no default timeout)"}}
   :required ["command"]})

(def edit-parameters
  {:type "object"
   :properties {:path {:type "string"
                       :description "Path to the file to edit (relative or absolute)"}
                :old_text {:type "string"
                          :description "Exact text to replace. Must be unique in the file."}
                :new_text {:type "string"
                          :description "Replacement text."}}
   :required ["path" "old_text" "new_text"]})

(def write-parameters
  {:type "object"
   :properties {:path {:type "string"
                       :description "Path to the file to write (relative or absolute)"}
                :content {:type "string"
                         :description "Content to write to the file"}}
   :required ["path" "content"]})

(def find-parameters
  {:type "object"
   :properties {:pattern {:type "string"
                         :description "Glob pattern to match files, e.g. '*.ts', '**/*.json', or 'src/**/*.spec.ts'"}
                :path {:type "string"
                      :description "Directory to search in (default: current directory)"}
                :limit {:type "integer"
                       :description "Maximum number of results (default: 1000)"}}
   :required ["pattern"]})

(def grep-parameters
  {:type "object"
   :properties {:pattern {:type "string"
                         :description "Search pattern (regex or literal string)"}
                :path {:type "string"
                      :description "Directory or file to search (default: current directory)"}
                :glob {:type "string"
                      :description "Filter files by glob pattern, e.g. '*.ts' or '**/*.spec.ts'"}
                :ignoreCase {:type "boolean"
                            :description "Case-insensitive search (default: false)"}
                :literal {:type "boolean"
                         :description "Treat pattern as literal string instead of regex (default: false)"}
                :context {:type "integer"
                         :description "Number of lines to show before and after each match (default: 0)"}
                :limit {:type "integer"
                       :description "Maximum number of matches to return (default: 100)"}}
   :required ["pattern"]})

(def ls-parameters
  {:type "object"
   :properties {:path {:type "string"
                       :description "Directory to list (default: current directory)"}
                :limit {:type "integer"
                       :description "Maximum number of entries to return (default: 500)"}}
   :required []})
