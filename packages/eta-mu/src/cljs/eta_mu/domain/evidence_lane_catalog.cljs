(ns eta-mu.domain.evidence-lane-catalog
  "Pure catalog and admission rules for narrow evidence-review agents."
  (:require [clojure.set :as set]
            [eta-mu.law.evidence-lane-catalog :as law]))

(def forbidden-lane-tools
  #{:filesystem/write
    :github/publish
    :github/write
    :network/request
    :process/run
    :secret/read})

(def first-lane-catalog
  {:catalog/version 1
   :catalog/id :eta-mu/github-evidence-lanes-v1
   :catalog/required-lanes
   #{:contracts-schema :tests-failures :ci-provenance}
   :catalog/lanes
   [{:lane/id :contracts-schema
     :lane/actor :eta-mu.agent/contracts-schema-reviewer
     :lane/description
     "Validate declared contracts, schemas, resolvers, and executable resource references."
     :lane/artifact-kinds
     #{:contract-manifest :diff-manifest :schema-validation :resolver-trace}
     :lane/tools
     #{:artifact/read :contract/inspect :contract/validate}
     :lane/budgets
     {:wall-ms 180000
      :input-bytes 2097152
      :output-bytes 1048576
      :max-findings 25}}

    {:lane/id :tests-failures
     :lane/actor :eta-mu.agent/tests-failures-reviewer
     :lane/description
     "Inspect executed suites, exits, retained failure traces, fixtures, and coverage artifacts."
     :lane/artifact-kinds
     #{:coverage-summary :junit :test-log :test-manifest}
     :lane/tools
     #{:artifact/read :coverage/inspect :test/result-query}
     :lane/budgets
     {:wall-ms 180000
      :input-bytes 4194304
      :output-bytes 1048576
      :max-findings 25}}

    {:lane/id :ci-provenance
     :lane/actor :eta-mu.agent/ci-provenance-reviewer
     :lane/description
     "Verify exact-head workflow identity, action pins, dependency closure, and check provenance."
     :lane/artifact-kinds
     #{:check-run-manifest :dependency-closure :workflow-manifest}
     :lane/tools
     #{:artifact/read :dependency-closure/inspect :workflow/inspect}
     :lane/budgets
     {:wall-ms 120000
      :input-bytes 2097152
      :output-bytes 1048576
      :max-findings 20}}]})

(defn catalog-admissibility-errors
  [catalog]
  (let [shape-valid? (law/valid-catalog-shape? catalog)
        lanes (:catalog/lanes catalog)
        lane-ids (mapv :lane/id lanes)
        actor-ids (mapv :lane/actor lanes)
        declared-lanes (set lane-ids)
        required-lanes (:catalog/required-lanes catalog)
        granted-tools (set (mapcat :lane/tools lanes))]
    (cond-> []
      (not shape-valid?)
      (conj :invalid-catalog-shape)

      (and shape-valid? (empty? lanes))
      (conj :empty-lane-catalog)

      (and shape-valid? (not= (count lane-ids) (count (distinct lane-ids))))
      (conj :duplicate-lane-id)

      (and shape-valid? (not= (count actor-ids) (count (distinct actor-ids))))
      (conj :shared-lane-actor)

      (and shape-valid? (not (set/subset? required-lanes declared-lanes)))
      (conj :unknown-required-lane)

      (and shape-valid?
           (some #(or (empty? (:lane/artifact-kinds %))
                      (empty? (:lane/tools %)))
                 lanes))
      (conj :unbounded-lane-input)

      (and shape-valid?
           (some #(nil? (namespace %)) actor-ids))
      (conj :unqualified-lane-actor)

      (and shape-valid?
           (seq (set/intersection forbidden-lane-tools granted-tools)))
      (conj :forbidden-lane-tool))))

(defn admissible-catalog?
  [catalog]
  (empty? (catalog-admissibility-errors catalog)))

(defn lane-profile
  [catalog lane]
  (->> (:catalog/lanes catalog)
       (filter #(= lane (:lane/id %)))
       first))

(defn required-lane-profiles
  [catalog]
  (->> (:catalog/required-lanes catalog)
       (sort-by str)
       (mapv #(lane-profile catalog %))))
