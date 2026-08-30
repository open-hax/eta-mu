(ns rheos.backend.law.frontmatter-test
  (:require [cljs.test :refer [deftest is testing]]
            [rheos.backend.law.frontmatter :as frontmatter]))

(deftest dependency-is-lawful-mutable-planning-frontmatter
  (testing "dependency uses the guarded update path while parent remains closed"
    (is (empty? (frontmatter/disallowed-keys {:dependency ["dep-a"]})))
    (is (= [:parent] (frontmatter/disallowed-keys {:parent "epic-a"}))))
  (testing "dependency is always a vector of nonblank ids; [] clears it"
    (is (empty? (frontmatter/planning-value-errors {:dependency []})))
    (is (empty? (frontmatter/planning-value-errors
                 {:dependency ["dep-a" "dep-b"]})))
    (doseq [dependency ["dep-a" [""] ["dep-a" " "]]]
      (is (= [:dependency]
             (mapv :key (frontmatter/planning-value-errors
                         {:dependency dependency})))))))
