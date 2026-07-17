(ns eta-mu.platform.dsl
  "Authoring macros for the ημ platform DSL.

  These macros capture definitions as plain data. No registration side effects
  are performed at macro-expansion time, so REPL reloads, dead-code elimination,
  and cross-target compilation remain predictable.")

(defmacro defschema
  "Define a Malli schema as a plain var."
  [sym schema]
  `(def ~sym ~schema))

(defmacro defcapability
  "Define a capability. The handler body is pure ημ data; it receives no JS
  host objects and returns no host Promise.

  Options:
    :id       - explicit capability id (default: namespaced symbol)
    :input    - Malli input schema
    :output   - Malli output schema
    :effects  - set of effect ids the capability may produce
    :errors   - set of error kinds the handler may return"
  [sym options argv & body]
  (let [id (or (:id options) (keyword (str *ns*) (name sym)))
        source (select-keys (meta &form) [:file :line :column])]
    `(def ~sym
       {:ημ/kind     :capability
        :ημ/id       ~id
        :ημ/input    ~(:input options)
        :ημ/output   ~(:output options)
        :ημ/effects  ~(:effects options)
        :ημ/errors   ~(:errors options)
        :ημ/handler  (fn ~argv ~@body)
        :ημ/source   ~source})))

(defmacro defhook
  "Define a lifecycle hook. The handler body receives shaped ημ data and may
  return an effect decision.

  Options:
    :id       - explicit hook id (default: namespaced symbol)
    :event    - event keyword (e.g. :tool.execute.before)
    :priority - higher priority hooks run first (default 0)"
  [sym options argv & body]
  (let [id (or (:id options) (keyword (str *ns*) (name sym)))
        priority (or (:priority options) 0)
        source (select-keys (meta &form) [:file :line :column])]
    `(def ~sym
       {:ημ/kind     :hook
        :ημ/id       ~id
        :ημ/event    ~(:event options)
        :ημ/priority ~priority
        :ημ/handler  (fn ~argv ~@body)
        :ημ/source   ~source})))

(defmacro deftool
  "Define a tool exposure that points to a capability. Tool behavior lives in
  the capability, not here.

  Options:
    :id         - explicit tool id (default: namespaced symbol)
    :capability - id of the capability this tool exposes
    :expose     - map of target-specific names, e.g.
                  {:opencode {:name ... :description ...}
                   :mcp      {:name ...}}"
  [sym options]
  (let [id (or (:id options) (keyword (str *ns*) (name sym)))
        source (select-keys (meta &form) [:file :line :column])]
    `(def ~sym
       {:ημ/kind       :tool
        :ημ/id         ~id
        :ημ/capability ~(:capability options)
        :ημ/expose     ~(:expose options)
        :ημ/source     ~source})))

(defmacro defplugin
  "Define a plugin as a collection of tools, hooks, and nested plugins."
  [sym & entries]
  (let [id (keyword (str *ns*) (name sym))
        source (select-keys (meta &form) [:file :line :column])]
    `(def ~sym
       {:ημ/kind    :plugin
        :ημ/id      ~id
        :ημ/entries [~@entries]
        :ημ/source  ~source})))
