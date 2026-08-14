(ns rheos.backend.shape.markdown-delimiter-test
  #?(:clj (:require [clojure.test :refer [deftest is]]
                    [rheos.backend.shape.markdown-document :as markdown])
     :cljs (:require [cljs.test :refer-macros [deftest is]]
                     [rheos.backend.shape.markdown-document :as markdown])))

(deftest indented-marker-remains-frontmatter-content
  (let [raw (str "---\n"
                 "note: |\n"
                 "  ---\n"
                 "status: ready\n"
                 "---\n"
                 "Body")
        document (markdown/parse raw)]
    (is (.contains (:document/frontmatter-raw document) "  ---"))
    (is (= "ready" (get-in document [:document/frontmatter-data :status])))
    (is (= "Body" (:document/body document)))))

(deftest trailing-delimiter-whitespace-is-accepted
  (let [document (markdown/parse "---   \ntitle: Spaced\n---   ")]
    (is (:document/frontmatter-present? document))
    (is (= "title: Spaced" (:document/frontmatter-raw document)))
    (is (= "" (:document/body document)))))

(deftest mixed-line-endings-are-accepted
  (let [document (markdown/parse "---\r\ntitle: Mixed\n---\nBody")]
    (is (:document/frontmatter-present? document))
    (is (= "title: Mixed" (:document/frontmatter-raw document)))
    (is (= "Mixed" (get-in document [:document/frontmatter-data :title])))
    (is (= "Body" (:document/body document)))))
