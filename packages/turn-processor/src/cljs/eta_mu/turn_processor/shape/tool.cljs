(ns eta-mu.turn-processor.shape.tool
  "Canonical tool descriptor ↔ OpenAI-compatible function DTO conversions.

  The canonical tool shape is defined in `eta-mu.turn-processor.law.tool`.
  The OpenAI side follows the chat-completions `functions` / `tools` format."
  (:require [eta-mu.turn-processor.law.tool :as law]))

(defn tool->openai
  "Convert a canonical tool descriptor to an OpenAI `function` definition.

  The `parameters` value is passed through unchanged; it is expected to be a
  Malli schema or JSON-schema map that the consumer can interpret."  
  [tool]
  {:type "function"
   :function {:name (:name tool)
                :description (or (:description tool) "")
                :parameters (:parameters tool)}})

(defn openai->tool
  "Convert an OpenAI `function` definition to a canonical tool descriptor.

  Accepts both the wrapped `{:type 'function' :function {...}}` shape and the
  bare `{:name ... :description ... :parameters ...}` shape."  
  [function-dto]
  (let [fn-def (if (= (:type function-dto) "function")
                 (:function function-dto)
                 function-dto)]
    {:name (:name fn-def)
     :description (or (:description fn-def) "")
     :parameters (:parameters fn-def)}))

(defn tools->openai
  "Convert a vector of canonical tools to OpenAI `tools`."  
  [tools]
  (mapv tool->openai tools))

(defn openai->tools
  "Convert a vector of OpenAI `tools` to canonical tool descriptors."  
  [tools]
  (mapv openai->tool tools))

(defn openai-context
  "Build an OpenAI-compatible context map from a turn-processor context.

  Returns `{:system-prompt string :messages [...] :tools [...]}` where tools
  are OpenAI function definitions. Messages are not converted here; use
  `shape.message` for the message DTOs."
  [context]
  {:system-prompt (:system-prompt context)
   :messages (:messages context)
   :tools (tools->openai (:tools context))})

(defn validate-tools
  "Validate a sequence of canonical tools, returning nil on success or a
  sequence of Malli error maps on failure."  
  [tools]
  (let [errors (keep (fn [t]
                       (when-not (law/valid-tool? t)
                         {:tool t :error (law/explain-tool t)}))
                     tools)]
    (when (seq errors) errors)))
