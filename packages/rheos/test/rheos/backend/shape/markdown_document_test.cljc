(ns rheos.backend.shape.markdown-document-test
  #?(:clj (:require [clojure.test :refer [deftest is]]
                    [rheos.backend.law.markdown-document :as law]
                    [rheos.backend.shape.markdown-document :as markdown])
     :cljs (:require [cljs.test :refer-macros [deftest is]]
                     [rheos.backend.law.markdown-document :as law]
                     [rheos.backend.shape.markdown-document :as markdown])))

(deftest preserves-frontmatter-and-body
  (let [document (markdown/parse "---\ntitle: Finding A\n---\n# Finding A")]
    (is (law/valid? document))
    (is (= "Finding A" (get-in document [:document/frontmatter-data :title])))
    (is (= "# Finding A" (:document/body document)))))

(deftest plain-markdown-remains-unchanged
  (let [raw "# Plain document"
        document (markdown/parse raw)]
    (is (law/valid? document))
    (is (false? (:document/frontmatter-present? document)))
    (is (= raw (:document/body document)))))
