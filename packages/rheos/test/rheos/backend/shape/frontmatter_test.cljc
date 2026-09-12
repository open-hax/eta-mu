(ns rheos.backend.shape.frontmatter-test
  #?(:clj (:require [clojure.string :as str]
                    [clojure.test :refer [deftest is testing]]
                    [rheos.backend.law.markdown-document :as law]
                    [rheos.backend.shape.frontmatter :as frontmatter]
                    [rheos.backend.shape.markdown-document :as markdown])
     :cljs (:require [clojure.string :as str]
                     [cljs.test :refer-macros [deftest is testing]]
                     [rheos.backend.law.markdown-document :as law]
                     [rheos.backend.shape.frontmatter :as frontmatter]
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

(deftest plain-and-mixed-inline-string-sequences-are-decoded
  (doseq [[value expected]
          [["[graph, relationships, code, provenance]" ["graph" "relationships" "code" "provenance"]]
           ["[ci, \"security,review\", governance]" ["ci" "security,review" "governance"]]
           ["[needs review, domain:graph, \"false\"]" ["needs review" "domain:graph" "false"]]]]
    (let [raw (str "---\nlabels: " value "\n---\nBody")
          document (markdown/parse raw)]
      (is (= expected (get-in document [:document/frontmatter-data :labels])))
      (is (= (str "labels: " value) (:document/frontmatter-raw document)))
      (is (= "Body" (:document/body document))))))

(deftest inline-sequences-preserve-whitespace-after-the-closing-bracket
  (doseq [[value expected] [["[]" []]
                            ["[\"ci\"]" ["ci"]]
                            ["[ci, governance]" ["ci" "governance"]]
                            ["[ci, \"security,review\"]" ["ci" "security,review"]]]
          suffix [" " "\t" " \t  "]]
    (let [input (str value suffix)]
      (is (= expected (frontmatter/parse-canonical-string-sequence input)) (pr-str input))
      (is (= expected (:labels (frontmatter/parse-flat (str "labels: " input))))))))

(deftest inline-sequences-refuse-physical-line-breaks-and-form-feed
  (doseq [separator ["\n" "\r" "\f"]
          [prefix suffix] [["[" "]"]
                           ["[" "ci]"]
                           ["[ci," "provenance]"]
                           ["[\"ci\"," "\"review\"]"]
                           ["[\"ci\"" ", review]"]
                           ["[\"ci\"" "]"]
                           ["[]" ""]
                           ["[ci]" ""]
                           ["[\"ci" "review\"]"]
                           ["[ci, \"security" "review\"]"]]]
    (let [input (str prefix separator suffix)]
      (is (nil? (frontmatter/parse-canonical-string-sequence input))
          (str "An inline sequence must refuse the whole physical multiline value: " (pr-str input))))))

(deftest inline-sequences-retain-horizontal-whitespace-and-literal-escapes
  (doseq [[input expected]
          [["[ \t ] \t" []]
           ["[ \t \"ci\" \t , \t \"review\" \t ] \t" ["ci" "review"]]
           ["[ \t ci \t , \t provenance \t ] \t" ["ci" "provenance"]]
           ["[\"ci\treview\", \"security review\"]" ["ci\treview" "security review"]]
           ["[\"ci\\nreview\", \"security\\rreview\", \"page\\freview\"]"
            ["ci\\nreview" "security\\rreview" "page\\freview"]]]]
    (is (= expected (frontmatter/parse-canonical-string-sequence input)) (pr-str input))
    (is (= expected (:labels (frontmatter/parse-flat (str "labels: " input))))
        "The existing quoted grammar preserves escape bytes rather than interpreting them")))

(deftest flat-sequence-values-do-not-trim-away-forbidden-control-whitespace
  (doseq [value ["[]\f" "[ci]\f" "[\"ci\"] \f\t"]]
    (is (not (contains? (frontmatter/parse-flat (str "labels: \t" value)) :labels))
        (str "The flat projection must submit the original sequence suffix for validation: " (pr-str value)))))

(deftest unsupported-inline-collections-remain-fail-closed
  (doseq [line ["labels: [true, false]"
                "labels: [ci, null]"
                "labels: [ci, False]"
                "labels: [ci, -42]"
                "labels: [ci, owner: ops]"
                "labels: [ci, owner:]"
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
      (is (= ["one" "two"] (:tags decoded)) "A plain string sequence is supported")
      (is (= "ready" (:status decoded))))))

(deftest explicit-empty-quoted-string-remains-a-flat-scalar
  (let [document (markdown/parse "---\nsummary: \"\"\n---\nBody")]
    (is (contains? (:document/frontmatter-data document) :summary))
    (is (= "" (get-in document [:document/frontmatter-data :summary])))))

(deftest plain-markdown-makes-no-decoder-claim
  (let [document (markdown/parse "# Plain")]
    (is (law/valid? document))
    (is (not (contains? document :document/frontmatter-decoding)))))

(defn- milliseconds []
  #?(:clj (/ (System/nanoTime) 1000000.0)
     :cljs (.now js/performance)))

(deftest malformed-whitespace-heavy-sequences-have-bounded-refusal-cost
  (let [padding (apply str (repeat 50000 " "))]
    (doseq [prefix ["[a" "["]]
      (let [input (str prefix padding "!]")
            started (milliseconds)
            result (frontmatter/parse-canonical-string-sequence input)
            elapsed (- (milliseconds) started)]
        (is (nil? result) "Malformed input must remain outside the declared string subset")
        (is (< elapsed 2000)
            (str "50,000 padding characters must not stall synchronous task reads: " elapsed "ms"))))))

(deftest trailing-whitespace-has-bounded-acceptance-and-refusal-cost
  (let [padding (apply str (repeat 50000 " "))]
    (doseq [[value expected] [["[]" []] ["[ci]" ["ci"]]]
            trailer ["" "!"]]
      (let [input (str value padding trailer)
            started (milliseconds)
            result (frontmatter/parse-canonical-string-sequence input)
            elapsed (- (milliseconds) started)]
        (is (= (when (empty? trailer) expected) result))
        (is (< elapsed 2000)
            (str "Trailing whitespace must retain bounded scanning cost: " elapsed "ms"))))))
