(ns rheos.backend.domain.kanban-projection-test
  #?(:clj (:require [clojure.test :refer [deftest is]]
                    [rheos.backend.domain.kanban-projection :as kanban])
     :cljs (:require [cljs.test :refer-macros [deftest is]]
                     [rheos.backend.domain.kanban-projection :as kanban])))

(deftest projects-historical-kanban-fields
  (let [document {:document/frontmatter-data
                  {:title "Review evidence"
                   :status "completed"
                   :priority "p1"
                   :labels "review, evidence"
                   :custom-field "survives-on-document"}
                  :document/body "Body"}
        task (kanban/task document
                          {:fallback-title "fallback"
                           :fallback-created-at "2026-08-13T00:00:00.000Z"
                           :source-path "/tmp/review.md"})]
    (is (= "Review evidence" (:title task)))
    (is (= "done" (:status task)))
    (is (= "P1" (:priority task)))
    (is (= ["review" "evidence"] (:labels task)))
    (is (= "review-evidence" (:uuid task)))
    (is (= "2026-08-13T00:00:00.000Z" (:created-at task)))
    (is (= "Body" (:content task)))))

(deftest projection-defaults-are-explicit-inputs
  (let [document {:document/frontmatter-data {}
                  :document/body "Body"}
        task (kanban/task document
                          {:fallback-title "No Metadata"
                           :fallback-created-at "fixed-time"
                           :source-path "/tmp/no-metadata.md"})]
    (is (= "no-metadata" (:uuid task)))
    (is (= "incoming" (:status task)))
    (is (= "P3" (:priority task)))
    (is (= "fixed-time" (:created-at task)))))

(deftest hyphenated-created-at-takes-precedence
  (let [document {:document/frontmatter-data
                  {:title "Timestamp spellings"
                   :created-at "hyphenated"
                   :created_at "underscored"
                   :createdAt "camel-cased"}
                  :document/body "Body"}
        task (kanban/task document
                          {:fallback-title "fallback"
                           :fallback-created-at "fallback-time"
                           :source-path "/tmp/timestamps.md"})]
    (is (= "hyphenated" (:created-at task)))))
