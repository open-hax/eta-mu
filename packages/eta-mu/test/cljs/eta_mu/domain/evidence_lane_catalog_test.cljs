(ns eta-mu.domain.evidence-lane-catalog-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.domain.evidence-lane-catalog :as catalog]
            [eta-mu.law.evidence-lane-catalog :as law]))

(deftest first-lane-catalog-is-admissible
  (testing "the first three expert lanes are closed, independent, and bounded"
    (is (law/valid-catalog-shape? catalog/first-lane-catalog))
    (is (catalog/admissible-catalog? catalog/first-lane-catalog))
    (is (= [:ci-provenance :contracts-schema :tests-failures]
           (mapv :lane/id
                 (catalog/required-lane-profiles
                  catalog/first-lane-catalog)))))
  (testing "each lane has a dedicated actor and no direct effect authority"
    (let [lanes (:catalog/lanes catalog/first-lane-catalog)
          actors (mapv :lane/actor lanes)
          tools (set (mapcat :lane/tools lanes))]
      (is (= (count actors) (count (distinct actors))))
      (is (empty? (filter catalog/forbidden-lane-tools tools))))))

(deftest catalog-shape-is-closed
  (testing "credentials and executable host values cannot be added to a profile"
    (let [with-secret (assoc-in catalog/first-lane-catalog
                                [:catalog/lanes 0 :lane/github-token]
                                "secret")]
      (is (not (law/valid-catalog-shape? with-secret)))
      (is (some? (law/explain-catalog with-secret))))))

(deftest duplicate-or-shared-lanes-fail-admission
  (let [first-lane (first (:catalog/lanes catalog/first-lane-catalog))
        duplicate-lane (update catalog/first-lane-catalog
                               :catalog/lanes
                               conj
                               first-lane)
        shared-actor (assoc-in catalog/first-lane-catalog
                               [:catalog/lanes 1 :lane/actor]
                               (:lane/actor first-lane))]
    (testing "one lane identity cannot silently map to two profiles"
      (is (= [:duplicate-lane-id :shared-lane-actor]
             (catalog/catalog-admissibility-errors duplicate-lane))))
    (testing "dedicated lanes cannot share one actor identity"
      (is (= [:shared-lane-actor]
             (catalog/catalog-admissibility-errors shared-actor))))))

(deftest undeclared-required-lanes-and-effect-tools-fail-admission
  (let [unknown-required (update catalog/first-lane-catalog
                                 :catalog/required-lanes
                                 conj
                                 :security-secrets)
        direct-publisher (update-in catalog/first-lane-catalog
                                    [:catalog/lanes 0 :lane/tools]
                                    conj
                                    :github/publish)]
    (testing "a required lane must have an actual profile"
      (is (= [:unknown-required-lane]
             (catalog/catalog-admissibility-errors unknown-required))))
    (testing "expert lanes cannot publish, read secrets, or run ambient effects"
      (is (= [:forbidden-lane-tool]
             (catalog/catalog-admissibility-errors direct-publisher))))))
