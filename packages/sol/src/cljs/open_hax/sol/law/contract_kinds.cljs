(ns open-hax.sol.law.contract-kinds
  "Sol's binding to the canonical katamorph contract registry.

   katamorph.schema owns every contract schema (agents, actors, roles,
   capabilities, models, providers, policies, ...). This namespace only maps
   sol's directory-derived contract-class strings onto katamorph registry
   kinds and preserves sol's historically lenient dispatch: anything the
   registry does not know validates as :agent, the open fallback contract.

   Do NOT define contract schemas here — extend katamorph and bump the
   git-ref in deps.edn instead. The one exception is PipelineContract below:
   a deprecated legacy kind katamorph deliberately does not own."
  (:require [katamorph.schema :as ks]
            [malli.core :as m]
            [malli.error :as me]))

(def ^:private cms-kinds
  #{:cms-block-registry :cms-templates :cms-template-registry})

(def class->kind
  "Canonical contract-class directory string -> katamorph registry kind.
   \"cms\" and \"pipelines\" dispatch specially in kind-for."
  {"agents"           :agent
   "actors"           :actor
   "roles"            :role
   "capabilities"     :capability
   "mcp_servers"      :mcp-server
   "policies"         :policy
   "generators"       :generator
   "schedules"        :schedule
   "source_modes"     :source-mode
   "sources"          :source
   "model_families"   :model-family
   "models"           :model
   "providers"        :provider
   "runtime_features" :runtime-feature
   "ingest_sources"   :ingest_source
   "actions"          :action
   "triggers"         :trigger
   "stores"           :store
   "sub_agents"       :sub-agent})

(def ^:deprecated PipelineContract
  "Deprecated: pipelines are now action contracts with :actions/run-steps.
   Kept only to validate legacy pipeline contracts during the migration
   window. Not a katamorph kind — do not upstream."
  [:map {:closed false}
   [:contract/kind [:= :pipeline]]
   [:contract/id [:or string? keyword?]]
   [:enabled {:optional true} boolean?]
   [:pipeline/steps [:vector [:map {:closed false}]]]
   [:data {:optional true} [:map {:closed false}]]])

(defn- kind-for
  "Resolve a contract-class string (nil = infer from the value) to a
   katamorph registry kind, falling back to :agent for anything unknown."
  [contract-class value]
  (cond
    (= "cms" contract-class)
    (if (contains? cms-kinds (:contract/kind value))
      (:contract/kind value)
      :cms-templates)

    (some? contract-class)
    (get class->kind contract-class :agent)

    :else
    (let [inferred (ks/infer-contract-class value)]
      (if (contains? ks/registry inferred) inferred :agent))))

(defn- validate-pipeline
  ;; PipelineContract is deprecated; this validator exists only for the
  ;; legacy migration window, so the deprecation warnings are expected here.
  [value]
  (if (m/validate #_:clj-kondo/ignore PipelineContract value)
    {:ok true :value value :errors []}
    {:ok false
     :value value
     :errors [{:path []
               :message (pr-str (me/humanize
                                 (m/explain #_:clj-kondo/ignore PipelineContract value)))}]}))

(defn validate
  "Validate a parsed contract-like map against the canonical katamorph
   schema for its class. Same result shape as katamorph.schema/validate:
   {:ok bool :value value :errors [{:path [...] :message <text>} ...]}."
  ([value]
   (validate nil value))
  ([contract-class value]
   (if (= "pipelines" contract-class)
     (validate-pipeline value)
     (ks/validate (kind-for contract-class value) value))))
