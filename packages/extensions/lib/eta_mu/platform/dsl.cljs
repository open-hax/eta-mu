(ns eta-mu.platform.dsl
  "Runtime constructors for the ημ platform DSL.

  The macros are in `eta_mu/platform/dsl.clj`. This namespace provides the
  pure data constructors that are used for dynamic composition, generated
  registrations, and tests.")

(defn plugin
  "Construct a plugin spec from nested entries."
  [id & entries]
  {:ημ/kind :plugin
   :ημ/id id
   :ημ/entries (vec entries)})

(defn capability
  "Construct a capability spec from options."
  [id opts]
  {:ημ/kind :capability
   :ημ/id id
   :ημ/input (:input opts)
   :ημ/output (:output opts)
   :ημ/effects (:effects opts)
   :ημ/errors (:errors opts)
   :ημ/handler (:handler opts)})

(defn tool
  "Construct a tool exposure spec from options."
  [id opts]
  {:ημ/kind :tool
   :ημ/id id
   :ημ/capability (:capability opts)
   :ημ/expose (:expose opts)})

(defn hook
  "Construct a hook spec from options."
  [id opts]
  {:ημ/kind :hook
   :ημ/id id
   :ημ/event (:event opts)
   :ημ/priority (or (:priority opts) 0)
   :ημ/handler (:handler opts)})
