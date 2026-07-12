(ns eta-mu.platform.law
  "Law for the ημ platform DSL: wire policy and schema contracts.

  This namespace contains only data and pure validators. No I/O, no JS interop,
  no runtime host knowledge."
  (:require
   [malli.core :as m]))

(def wire-policy
  "Canonical mapping between ημ values and JSON/JS host wire representations.

  This table is the single source of truth for all boundary encoders and emitters
  (OpenCode, Fastify, MCP, TypeScript declarations, JSON Schema). Every entry
  declares a scalar ημ type and the corresponding wire shape; actual encoding
  and decoding functions live in `eta-mu.platform.boundary.js`."
  {:keyword   {:ημ/type :keyword   :wire/type :string}
   :uuid      {:ημ/type :uuid      :wire/type :string}
   :instant   {:ημ/type :instant   :wire/type :string}
   :string    {:ημ/type :string    :wire/type :string}
   :int       {:ημ/type :int       :wire/type :number}
   :number    {:ημ/type :number    :wire/type :number}
   :boolean   {:ημ/type :boolean   :wire/type :boolean}
   :nil       {:ημ/type :nil       :wire/type :null}
   :vector    {:ημ/type :vector    :wire/type :array}
   :set       {:ημ/type :set       :wire/type :array}
   :map       {:ημ/type :map       :wire/type :object}
   :tuple     {:ημ/type :tuple     :wire/type :array}
   :enum      {:ημ/type :enum      :wire/type :string}})

(defn wire-type
  "Return the wire type keyword for a scalar ημ type keyword."
  [ημ-type]
  (get-in wire-policy [ημ-type :wire/type]))

(defn validate!
  "Validate `value` against a Malli schema. Returns value on success, throws
  `ex-info` with `:explain` on failure."
  [schema value]
  (if (m/validate schema value)
    value
    (throw (ex-info "Schema validation failed"
                    {:schema  schema
                     :value   value
                     :explain (m/explain schema value)}))))
