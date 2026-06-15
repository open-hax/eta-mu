(ns eta-mu.docs.parse-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.docs.domain.parse :as parse]))

(def legacy-fixture-md
  "---\nuuid: abc-123\ntags: [Alpha, beta]\n---\n\n# Title\n\nSee [[Other Note|alias]] and [[Third#Heading]].\n\nInline #TagOne and #tag_two.\n\n#hashtags: #FromLine #line_two\n\n[ext](https://example.com)\n")

(deftest parse-eta-mu-markdown-legacy-fixture-test
  (testing "legacy fixture produces expected uuid, title, headings, tags, and links"
    (let [out (parse/parse-eta-mu-markdown {:rel-path "docs/a.md" :text legacy-fixture-md})]
      (is (= "abc-123" (:uuid out)))
      (is (= "Title" (:title out)))
      (is (some #(and (= 1 (:level %)) (= "Title" (:title %))) (:headings out)))
      (is (= ["alpha" "beta" "tagone" "tag_two" "hashtags" "fromline" "line_two"] (:tags out)))
      (is (= 2 (count (filter #(= :wikilink (:kind %)) (:links out)))))
      (is (= 1 (count (filter #(= :markdown (:kind %)) (:links out)))))
      (let [wiki (first (filter #(= :wikilink (:kind %)) (:links out)))]
        (is (= "Other Note" (:target wiki)))
        (is (= "other note" (:target-key wiki)))
        (is (= "alias" (:alias wiki)))
        (is (= 4 (:line wiki))))
      (let [ext (first (filter #(= :markdown (:kind %)) (:links out)))]
        (is (= "https://example.com" (:url ext)))
        (is (= "ext" (:text ext)))
        (is (= 9 (:line ext)))))))

(deftest parse-eta-mu-markdown-malformed-inputs-test
  (testing "empty text"
    (let [out (parse/parse-eta-mu-markdown {:rel-path "docs/empty.md" :text ""})]
      (is (= "" (:uuid out)))
      (is (= "empty.md" (:title out)))
      (is (= [] (:headings out)))
      (is (= [] (:tags out)))
      (is (= [] (:links out)))))

  (testing "missing frontmatter"
    (let [out (parse/parse-eta-mu-markdown {:rel-path "docs/b.md" :text "# Hello\n"})]
      (is (= "" (:uuid out)))
      (is (= "Hello" (:title out)))
      (is (= [{:level 1 :title "Hello"}] (:headings out)))))

  (testing "unclosed frontmatter"
    (let [out (parse/parse-eta-mu-markdown {:rel-path "docs/c.md" :text "---\nuuid: x\n# Hello\n"})]
      (is (= "" (:uuid out)))
      (is (= "Hello" (:title out)))))

  (testing "frontmatter with YAML list tags"
    (let [md "---\ntags:\n  - Gamma\n  - delta\n---\n# T\n"
          out (parse/parse-eta-mu-markdown {:rel-path "docs/d.md" :text md})]
      (is (= ["gamma" "delta"] (:tags out)))))

  (testing "code blocks hide tags and links"
    (let [md "# T\n\n```\n#CodeTag [[Wiki]]\n```\n\n#RealTag\n"
          out (parse/parse-eta-mu-markdown {:rel-path "docs/e.md" :text md})]
      (is (= ["realtag"] (:tags out)))
      (is (= [] (:links out)))))

  (testing "wikilinks without alias"
    (let [out (parse/parse-eta-mu-markdown {:rel-path "docs/f.md" :text "[[Target]]\n"})]
      (is (= 1 (count (:links out))))
      (let [link (first (:links out))]
        (is (= :wikilink (:kind link)))
        (is (= "Target" (:target link)))
        (is (= "" (:alias link))))))

  (testing "duplicate tags are deduplicated preserving first occurrence"
    (let [md "---\ntags: [Alpha, alpha]\n---\n# T\n\n#Alpha #beta #beta\n"
          out (parse/parse-eta-mu-markdown {:rel-path "docs/g.md" :text md})]
      (is (= ["alpha" "beta"] (:tags out)))))

  (testing "inline tag normalization"
    (let [out (parse/parse-eta-mu-markdown {:rel-path "docs/h.md" :text "#UPPER #lower\n"})]
      (is (= ["upper" "lower"] (:tags out)))))

  (testing "invalid inline tag characters are ignored"
    (let [out (parse/parse-eta-mu-markdown {:rel-path "docs/h2.md" :text "#[Bracket] #\"Quoted\"\n"})]
      (is (= [] (:tags out)))))

  (testing "markdown link inside image label is ignored"
    (let [out (parse/parse-eta-mu-markdown {:rel-path "docs/i.md" :text "![alt](img.png)\n[label](https://ok)\n"})]
      (is (= 1 (count (:links out))))
      (is (= "https://ok" (:url (first (:links out)))))))

  (testing "title falls back to basename when no h1"
    (let [out (parse/parse-eta-mu-markdown {:rel-path "nested/path/file.md" :text "## Sub\n"})]
      (is (= "file.md" (:title out)))))

  (testing "line numbers account for frontmatter and code blocks"
    (let [md "---\nuuid: x\n---\n# T\n\n[[Link]]\n"
          out (parse/parse-eta-mu-markdown {:rel-path "docs/j.md" :text md})]
      (is (= 3 (:line (first (:links out))))))))

(deftest parse-eta-mu-markdown-output-shape-test
  (testing "output contains exactly the legacy keys"
    (let [out (parse/parse-eta-mu-markdown {:rel-path "docs/k.md" :text "# T\n"})]
      (is (= #{:uuid :title :headings :tags :links} (set (keys out)))))))
