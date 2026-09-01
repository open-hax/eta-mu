(ns rheos.backend.shape.frontmatter-test
  #?(:clj (:require [clojure.string :as str]
                    [clojure.test :refer [deftest is testing]]
                    [rheos.backend.law.markdown-document :as law]
                    [rheos.backend.shape.markdown-document :as markdown])
     :cljs (:require [clojure.string :as str]
                     [cljs.test :refer-macros [deftest is testing]]
                     [rheos.backend.law.markdown-document :as law]
                     [rheos.backend.shape.markdown-document :as markdown])))

(deftest flat-compatibility-view-declares-partial-provenance
  (let [document (markdown/parse "---\ntitle: Card\nstatus: ready\n---\nBody")]
    (is (law/valid? document))
    (is (= {:decoder/id :rheos/flat-frontmatter-v1
            :decode/status :partial
            :decode/capabilities #{:top-level-string-scalars
                                   :top-level-string-sequences}}
           (:document/frontmatter-decoding document)))
    (is (= {:title "Card" :status "ready"}
           (:document/frontmatter-data document)))))

(deftest canonical-inline-string-sequences-are-decoded
  (testing "non-empty sequences preserve member order"
    (let [document (markdown/parse
                    "---\nlabels: [\"ci\", \"security,review\", \"governance\"]\n---\nBody")]
      (is (= ["ci" "security,review" "governance"]
             (get-in document [:document/frontmatter-data :labels])))))
  (testing "the canonical empty sequence remains a vector"
    (let [document (markdown/parse "---\nlabels: []\n---\nBody")]
      (is (= [] (get-in document [:document/frontmatter-data :labels]))))))

(deftest unsupported-inline-collections-remain-fail-closed
  (doseq [line ["labels: [ci, automation]"
                "labels: [\"ci\", 42]"
                "labels: [[\"ci\"]]"
                "labels: [\"ci\", {\"owner\": \"ops\"}]"
                "labels: [\"ci\",]"
                "labels: [\"ci\"] trailing"
                "labels: [\"ci\""]]
    (testing line
      (let [document (markdown/parse (str "---\n" line "\n---\nBody"))]
        (is (not (contains? (:document/frontmatter-data document) :labels)))))))

(deftest structural-yaml-is-preserved-but-not-misrepresented
  (let [raw (str "---\n"
                 "nested:\n"
                 "  arbitrary: true\n"
                 "note: |2\n"
                 "  multi line\n"
                 "folded: >+2\n"
                 "  folded line\n"
                 "tags: [one, two]\n"
                 "status: ready\n"
                 "---\n"
                 "Body")
        document (markdown/parse raw)
        decoded (:document/frontmatter-data document)]
    (testing "raw source remains authoritative"
      (is (str/includes? (:document/frontmatter-raw document) "  arbitrary: true"))
      (is (str/includes? (:document/frontmatter-raw document) "note: |2"))
      (is (str/includes? (:document/frontmatter-raw document) "folded: >+2"))
      (is (str/includes? (:document/frontmatter-raw document) "tags: [one, two]")))
    (testing "ambiguous structural values are omitted from the partial view"
      (is (not (contains? decoded :nested)))
      (is (not (contains? decoded :note)))
      (is (not (contains? decoded :folded)))
      (is (not (contains? decoded :tags)))
      (is (= "ready" (:status decoded))))))

(deftest explicit-empty-quoted-string-remains-a-flat-scalar
  (let [document (markdown/parse "---\nsummary: \"\"\n---\nBody")]
    (is (contains? (:document/frontmatter-data document) :summary))
    (is (= "" (get-in document [:document/frontmatter-data :summary])))))

(deftest plain-markdown-makes-no-decoder-claim
  (let [document (markdown/parse "# Plain")]
    (is (law/valid? document))
    (is (not (contains? document :document/frontmatter-decoding)))))
