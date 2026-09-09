(ns eta-mu.gitops-controller.domain.review-test
  (:require [cljs.test :refer [deftest is]]
            [eta-mu.gitops-controller.domain.review :as review]
            [eta-mu.gitops-controller.law.webhook :as law]
            [eta-mu.gitops-controller.shape.webhook :as shape]))

(def ^:private source-id "9eb17352-284c-4b55-879d-0d07f353fdee")
(def ^:private successor-id "d0cfe1b8-4952-4331-8b36-3f53af75d33e")
(def ^:private head-sha "0123456789abcdef0123456789abcdef01234567")
(def ^:private base-sha "1111111111111111111111111111111111111111")
(def ^:private merge-sha "2222222222222222222222222222222222222222")
(def ^:private other-sha "3333333333333333333333333333333333333333")

(deftest gate-identity-parser-requires-the-complete-canonical-v2-grammar
  (let [external-id (shape/review-gate-external-id
                     source-id 321 head-sha base-sha merge-sha)]
    (is (= {:delivery-id source-id :pr-number-text "321"
            :head-sha head-sha :base-sha base-sha :merge-sha merge-sha}
           (shape/parse-review-gate-external-id external-id)))
    (doseq [invalid [nil "" "eta-mu-review-gate/v2:newer"
                     (str "legacy:" external-id)
                     (str external-id ":extra")
                     (str external-id "\n")
                     (shape/review-gate-external-id
                      "not-a-delivery-id" 321 head-sha base-sha merge-sha)
                     (shape/review-gate-external-id
                      source-id "0321" head-sha base-sha merge-sha)
                     (shape/review-gate-external-id
                      source-id 0 head-sha base-sha merge-sha)
                     (shape/review-gate-external-id
                      source-id 321 "not-a-sha" base-sha merge-sha)]]
      (is (false? (law/review-gate-external-id? invalid)))
      (is (nil? (shape/parse-review-gate-external-id invalid))))))

(deftest ordered-review-gates-require-the-same-pr-and-complete-revision-tuple
  (let [external-id (shape/review-gate-external-id
                     source-id 321 head-sha base-sha merge-sha)
        expected {:name "eta-mu-review-gate" :pr-number 321
                  :head-sha head-sha :base-sha base-sha :merge-sha merge-sha
                  :external-id external-id}
        current {:id 4567 :app-id 123 :app-slug "eta-mu-controller"
                 :name (:name expected) :merge-sha merge-sha
                 :external-id external-id}
        successor (assoc current :id 4568 :external-id
                         (shape/review-gate-external-id
                          successor-id 321 head-sha base-sha merge-sha))]
    (is (true? (review/current-review-gate-check? 123 expected current)))
    (is (true? (review/current-review-gate-check? 123 expected successor)))
    (doseq [invalid [(assoc successor :id 0)
                     (assoc successor :app-id 999)
                     (assoc successor :app-slug "")
                     (assoc successor :name "other-check")
                     (assoc successor :merge-sha other-sha)
                     (assoc successor :external-id nil)
                     (assoc successor :external-id "eta-mu-review-gate/v2:newer")
                     (assoc successor :external-id
                            (str "eta-mu-review-gate/v1:" successor-id ":321:" head-sha))
                     (assoc successor :external-id
                            (shape/review-gate-external-id
                             "unbound-source" 321 head-sha base-sha merge-sha))
                     (assoc successor :external-id
                            (shape/review-gate-external-id
                             successor-id 322 head-sha base-sha merge-sha))
                     (assoc successor :external-id
                            (shape/review-gate-external-id
                             successor-id 321 other-sha base-sha merge-sha))
                     (assoc successor :external-id
                            (shape/review-gate-external-id
                             successor-id 321 head-sha other-sha merge-sha))
                     (assoc successor :external-id
                            (shape/review-gate-external-id
                             successor-id 321 head-sha base-sha other-sha))]]
      (is (false? (review/current-review-gate-check? 123 expected invalid))))
    (is (false? (review/current-review-gate-check?
                 123 (assoc expected :head-sha other-sha) successor)))
    (is (false? (review/current-review-gate-check?
                 123 (assoc expected :external-id "legacy") successor)))))
