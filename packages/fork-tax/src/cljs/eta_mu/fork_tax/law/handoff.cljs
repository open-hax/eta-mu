(ns eta-mu.fork-tax.law.handoff
  "Authoritative schema facts for Fork Tax handoff events.")

(def package-name "@eta-mu/fork-tax")
(def package-version "0.1.0")
(def handoff-recorded-schema
  :eta-mu.fork-tax/handoff-recorded)
(def handoff-recorded-version 1)

(def handoff-recorded-document
  {:schema/id handoff-recorded-schema
   :schema/version handoff-recorded-version
   :schema/status :current
   :schema/introduced-by
   {:package/version package-version
    :eta-mu/version "1.1.1"}
   :schema/predecessors []
   :schema/required
   [:repo-root :branch :sha :tag-name :owned :concurrent :blocked]
   :schema/optional
   [:commit/outcome :tag/outcome :push/outcome :verification]
   :schema/semantics
   {:owned "Paths intentionally included in the handoff."
    :concurrent
    "Dirty paths left untouched because ownership was not established."
    :blocked "Generated or runtime paths excluded from payment."}
   :schema/examples
   [{:repo-root "/repo"
     :branch "main"
     :sha "abc123"
     :tag-name "Π-20260729T000000Z"
     :owned []
     :concurrent []
     :blocked []}]
   :schema/compatibility
   {:reads-unversioned true
    :writes-envelope true}})

(def schema-documents [handoff-recorded-document])
(def schemas
  {[handoff-recorded-schema handoff-recorded-version]
   handoff-recorded-document})
(def current-versions
  {handoff-recorded-schema handoff-recorded-version})
