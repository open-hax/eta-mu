(ns open-hax.sol.law.contract-kinds-test
  "Regression net for the katamorph cutover: every valid on-disk fixture
   contract must validate through the canonical katamorph schemas exactly as
   it did through the deleted sol-local open-hax.sol.law.contracts."
  (:require [cljs.test :refer [deftest is testing]]
            [cljs.reader :as reader]
            [clojure.string :as str]
            [open-hax.sol.law.contract-kinds :as ck]
            [katamorph.schema :as ks]
            ["node:fs" :as fs]
            ["node:path" :as path]))

(def ^:private fixture-roots
  ["test/fixtures/contracts"
   "test/fixtures/hello-world-contracts"
   "test/fixtures/model-contracts"])

(def ^:private invalid-by-design
  ;; broken.edn is not EDN; no_identity.edn lacks :contract/id on purpose.
  #{"broken.edn" "no_identity.edn"})

(defn- edn-files
  [root]
  (when (fs/existsSync root)
    (for [klass (fs/readdirSync root)
          :let [dir (path/join root klass)]
          :when (.isDirectory (fs/statSync dir))
          file (fs/readdirSync dir)
          :when (and (str/ends-with? file ".edn")
                     (not (contains? invalid-by-design file)))]
      [klass (path/join dir file)])))

(deftest all-valid-fixtures-validate-through-katamorph
  (let [checked (atom 0)]
    (doseq [root fixture-roots
            [klass file] (edn-files root)]
      (testing file
        (let [value (reader/read-string (fs/readFileSync file "utf8"))
              result (ck/validate klass value)]
          (swap! checked inc)
          (is (:ok result)
              (str file " failed: " (pr-str (:errors result)))))))
    (is (pos? @checked) "fixture sweep found no contracts — paths broken?")))

(deftest lenient-fallback-preserved
  ;; unknown kinds historically validated against the open agent contract
  (is (:ok (ck/validate nil {:contract/id "mystery" :contract/kind :whatever})))
  (is (:ok (ck/validate nil {:contract/id "just-an-id"}))))

(deftest invalid-contracts-still-fail
  (is (not (:ok (ck/validate "actors" {:actor/kind :user}))))
  (is (not (:ok (ck/validate "models" {:model/label "no id"})))))

(deftest deprecated-pipeline-dialect
  (is (:ok (ck/validate "pipelines"
                        {:contract/kind :pipeline
                         :contract/id "legacy"
                         :pipeline/steps [{:step/id "a" :step/contract "x"}]})))
  (is (not (:ok (ck/validate "pipelines" {:contract/kind :pipeline
                                          :contract/id "no-steps"})))))

;; ── contract-guard divergence net ─────────────────────────────────────────────

(def ^:private registry-kind->owned-def
  "katamorph registry kind -> the schema def name the contract-guard script
   must own. Every katamorph registry key MUST appear here; when katamorph
   gains a kind, this map (and the guard's OWNED list) must grow with it."
  {:unified/eval-node         "EvalNode"
   :unified/policy            "PolicyContract"
   :unified/policy-match      "PolicyMatch"
   :unified/fulfillment-match "FulfillmentMatch"
   :agent                     "AgentContract"
   :sub-agent                 "SubAgentContract"
   :actor                     "ActorContract"
   :role                      "RoleContract"
   :capability                "CapabilityContract"
   :policy                    "PolicyContract"
   :policy-gate               "PolicyGateContract"
   :fulfillment               "FulfillmentContract"
   :strategy                  "StrategyContract"
   :action                    "ActionContract"
   :trigger                   "TriggerContract"
   :store                     "StoreContract"
   :namespace                 "NamespaceFile"
   :generator                 "GeneratorContract"
   :schedule                  "ScheduleContract"
   :source                    "RuntimeSourceContract"
   :model-family              "ModelFamilyContract"
   :model                     "ModelContract"
   :provider                  "ProviderContract"
   :mcp-server                "McpServerContract"
   :mcp_server                "McpServerContract"
   :source-mode               "SourceModeContract"
   :runtime-feature           "RuntimeFeatureContract"
   :cms-block-registry        "CmsContract"
   :cms-templates             "CmsContract"
   :cms-template-registry     "CmsContract"
   :ingest_source             "IngestSourceContract"})

(defn- guard-owned-names
  "Parse the OWNED list out of scripts/contract-guard.mjs (cwd = packages/sol)."
  []
  (let [src (fs/readFileSync "../../scripts/contract-guard.mjs" "utf8")
        block (second (re-find #"(?s)export const OWNED = \[(.*?)\];" src))]
    (set (map second (re-seq #"\"([A-Za-z]+)\"" (or block ""))))))

(deftest contract-guard-list-covers-katamorph-registry
  ;; Fails when katamorph's registry gains a kind the guard does not cover:
  ;; bumping the katamorph git-ref then forces a guard-list update here.
  (let [owned (guard-owned-names)]
    (is (seq owned) "could not parse OWNED out of scripts/contract-guard.mjs")
    (doseq [kind (keys ks/registry)]
      (is (contains? registry-kind->owned-def kind)
          (str "katamorph registry kind " kind
               " has no entry in registry-kind->owned-def — extend the "
               "contract-guard OWNED list and this map")))
    (doseq [[kind def-name] registry-kind->owned-def]
      (is (contains? owned def-name)
          (str "guard OWNED list is missing " def-name " (kind " kind ")")))))
