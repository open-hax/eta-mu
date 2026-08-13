(ns rheos.backend.shape.markdown-document-test
  #?(:clj (:require [clojure.test :refer [deftest is]]
                    [rheos.backend.shape.markdown-document :as markdown])
     :cljs (:require [cljs.test :refer-macros [deftest is]]
                     [rheos.backend.shape.markdown-document :as markdown])))

(deftest preserves-frontmatter-and-body
  (let [raw (str "---\n"
                 "title: Finding A\n"
                 "custom-field: alpha\n"
                 "nested:\n"
                 "  arbitrary: true\n"
                 "---\n"
                 "# Finding A")
        document (markdown/parse raw)]
    (is (markdown/valid? document))
    (is (.contains (:document/frontmatter/raw document) "custom-field: alpha"))
    (is (.contains (:document/frontmatter/raw document) "  arbitrary: true"))
    (is (= "Finding A" (get-in document [:document/frontmatter/data :title])))
    (is (= "# Finding A" (:document/body document)))))

(deftest plain-markdown-remains-unchanged
  (let [raw "# Plain document"
        document (markdown/parse raw)]
    (is (false? (:document/frontmatter-present? document)))
    (is (= raw (:document/body document)))))
