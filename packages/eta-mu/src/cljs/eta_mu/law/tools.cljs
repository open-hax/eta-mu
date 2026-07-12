(ns eta-mu.law.tools
  "Malli argument schemas and OpenAI-compatible JSON-schema parameter maps for
  the agent's coding tools (read, bash, edit, write).

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
