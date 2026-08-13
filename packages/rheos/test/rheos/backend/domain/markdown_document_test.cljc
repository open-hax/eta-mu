(ns rheos.backend.domain.markdown-document-test
  #?(:clj (:require [clojure.test :refer [deftest is testing]]
                    [rheos.backend.domain.markdown-document :as markdown])
     :cljs (:require [cljs.test :refer-macros [deftest is testing]]
                     [rheos.backend.domain.markdown-document :as markdown])))

(deftest preserves-frontmatter-and-body
  (let [raw (str "---\n"
                 "title: \"Finding A\"\n"
                 "custom-field: alpha\n"
                 "nested:\n"
                 "  arbitrary: true\n"
                 "---\n"
                 "# Finding A\n\nEvidence.")
        document (markdown/parse raw)]
    (is (= :markdown (:document/format document)))
    (is (:document/frontmatter-present? document))
    (is (= (str "title: \"Finding A\"\n"
                "custom-field: alpha\n"
                "nested:\n"
                "  arbitrary: true")
           (:document/frontmatter/raw document)))
    (is (= "Finding A" (get-in document [:document/frontmatter/data :title])))
    (is (= "alpha" (get-in document [:document/frontmatter/data :custom-field])))
    (is (= "# Finding A\n\nEvidence." (:document/body document)))))

(deftest accepts-closing-delimiter-at-eof
  (let [document (markdown/parse "---\ntitle: Empty body\n---")]
    (is (:document/frontmatter-present? document))
    (is (= "title: Empty body" (:document/frontmatter/raw document)))
    (is (= "" (:document/body document)))))

(deftest accepts-crlf-frontmatter
  (let [document (markdown/parse "---\r\ntitle: Windows\r\n---\r\nBody")]
    (is (:document/frontmatter-present? document))
    (is (= "title: Windows" (:document/frontmatter/raw document)))
    (is (= "Body" (:document/body document)))))

(deftest markdown-without-frontmatter-remains-unchanged
  (let [raw "# Plain document\n\nNo metadata."
        document (markdown/parse raw)]
    (is (false? (:document/frontmatter-present? document)))
    (is (= {} (:document/frontmatter/data document)))
    (is (= raw (:document/body document)))))
