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
     :lane/revision :eta-mu.lane/contracts-schema-v1
     :lane/producer
     {:producer/actor :eta-mu.agent/contracts-schema-reviewer
      :producer/actor-binding "axxium:binding:contracts-schema-reviewer-v1"
      :producer/profile-revision :eta-mu.profile/contracts-schema-reviewer-v1
      :producer/workflow-revision :eta-mu.workflow/github-evidence-lanes-v1}
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
     :lane/revision :eta-mu.lane/tests-failures-v1
     :lane/producer
     {:producer/actor :eta-mu.agent/tests-failures-reviewer
      :producer/actor-binding "axxium:binding:tests-failures-reviewer-v1"
      :producer/profile-revision :eta-mu.profile/tests-failures-reviewer-v1
      :producer/workflow-revision :eta-mu.workflow/github-evidence-lanes-v1}
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
     :lane/revision :eta-mu.lane/ci-provenance-v1
     :lane/producer
     {:producer/actor :eta-mu.agent/ci-provenance-reviewer
      :producer/actor-binding "axxium:binding:ci-provenance-reviewer-v1"
      :producer/profile-revision :eta-mu.profile/ci-provenance-reviewer-v1
      :producer/workflow-revision :eta-mu.workflow/github-evidence-lanes-v1}
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

(defn- qualified-resource-revision?
  [revision]
  (or (string? revision)
      (and (keyword? revision) (some? (namespace revision)))))

(defn catalog-admissibility-errors
  [catalog]
  (let [shape-valid? (law/valid-catalog-shape? catalog)
        lanes (:catalog/lanes catalog)
        lane-ids (mapv :lane/id lanes)
        lane-revisions (mapv :lane/revision lanes)
        actor-ids (mapv #(get-in % [:lane/producer :producer/actor]) lanes)
        actor-bindings (mapv #(get-in % [:lane/producer :producer/actor-binding]) lanes)
        producer-revisions (mapcat (fn [lane]
                                     [(get-in lane [:lane/producer
                                                    :producer/profile-revision])
                                      (get-in lane [:lane/producer
                                                    :producer/workflow-revision])])
                                   lanes)
        declared-lanes (set lane-ids)
        required-lanes (:catalog/required-lanes catalog)
        granted-tools (set (mapcat :lane/tools lanes))]
    (cond-> []
      (not shape-valid?)
      (conj :invalid-catalog-shape)

      (and shape-valid? (empty? lanes))
      (conj :empty-lane-catalog)

      (and shape-valid? (empty? required-lanes))
      (conj :empty-required-lanes)

      (and shape-valid? (not= (count lane-ids) (count (distinct lane-ids))))
      (conj :duplicate-lane-id)

      (and shape-valid?
           (not= (count lane-revisions) (count (distinct lane-revisions))))
      (conj :shared-lane-revision)

      (and shape-valid? (not= (count actor-ids) (count (distinct actor-ids))))
      (conj :shared-lane-actor)

      (and shape-valid?
           (not= (count actor-bindings) (count (distinct actor-bindings))))
      (conj :shared-lane-actor-binding)

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
           (not-every? qualified-resource-revision?
                       (concat lane-revisions producer-revisions)))
      (conj :unqualified-resource-revision)

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
