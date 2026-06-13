(ns eta-mu.kanban.content-parser-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.kanban.content-parser :as parser]))

(deftest test-parse-frontmatter
  (testing "parses quoted string values"
    (let [raw "---\nuuid: \"test-uuid\"\ntitle: \"Test Title\"\n---\nBody content"
          result (parser/parse-frontmatter raw)]
      (is (= "test-uuid" (get-in result [:frontmatter :uuid])))
      (is (= "Test Title" (get-in result [:frontmatter :title])))
      (is (= "Body content" (:content result)))))

  (testing "parses unquoted values"
    (let [raw "---\nstatus: done\npriority: P0\n---\nBody"
          result (parser/parse-frontmatter raw)]
      (is (= "done" (get-in result [:frontmatter :status])))
      (is (= "P0" (get-in result [:frontmatter :priority])))))

  (testing "parses array values"
    (let [raw "---\nlabels: [\"epics\", \"cljs\", \"kanban\"]\n---\nBody"
          result (parser/parse-frontmatter raw)]
      (is (= ["epics" "cljs" "kanban"] (get-in result [:frontmatter :labels])))))

  (testing "parses empty values"
    (let [raw "---\ncategory:\n---\nBody"
          result (parser/parse-frontmatter raw)]
      (is (= "" (get-in result [:frontmatter :category])))))

  (testing "returns empty frontmatter when no match"
    (let [raw "No frontmatter here"
          result (parser/parse-frontmatter raw)]
      (is (= {} (:frontmatter result)))
      (is (= "No frontmatter here" (:content result))))))

(deftest test-parse-sections
  (testing "parses single body section"
    (let [content "\n# Heading\nBody text"
          sections (parser/parse-sections content)]
      (is (= 1 (count sections)))
      (is (= "body" (:type (first sections))))
      (is (= "# Heading\nBody text" (:content (first sections))))))

  (testing "parses body and comment sections"
    (let [content "\nBody text\n---\nComment text\n---\nMore body"
          sections (parser/parse-sections content)]
      (is (= 3 (count sections)))
      (is (= "body" (:type (nth sections 0))))
      (is (= "comment" (:type (nth sections 1))))
      (is (= "body" (:type (nth sections 2)))))))

(deftest test-parse-task-content
  (testing "parses complete task file"
    (let [raw "---\nuuid: \"test\"\ntitle: \"Test\"\nstatus: done\npriority: P0\nlabels: [\"epics\", \"cljs\"]\n---\n\n# Title\n\nBody content"
          result (parser/parse-task-content raw)]
      (is (= "test" (get-in result [:frontmatter :uuid])))
      (is (= "Test" (get-in result [:frontmatter :title])))
      (is (= "done" (get-in result [:frontmatter :status])))
      (is (= "P0" (get-in result [:frontmatter :priority])))
      (is (= ["epics" "cljs"] (get-in result [:frontmatter :labels])))
      (is (pos? (count (:sections result)))))))

(deftest test-serialize-frontmatter
  (testing "serializes quoted strings"
    (let [fm {:uuid "test" :title "Test"}
          result (parser/serialize-frontmatter fm)]
      (is (re-find #"uuid: \"test\"" result))
      (is (re-find #"title: \"Test\"" result))))

  (testing "serializes arrays"
    (let [fm {:labels ["epics" "cljs"]}
          result (parser/serialize-frontmatter fm)]
      (is (re-find #"labels: \[\"epics\", \"cljs\"\]" result))))

  (testing "serializes plain values"
    (let [fm {:status "done" :priority "P0"}
          result (parser/serialize-frontmatter fm)]
      (is (re-find #"status: \"done\"" result))
      (is (re-find #"priority: \"P0\"" result)))))

(deftest test-update-frontmatter
  (testing "updates a frontmatter field"
    (let [raw "---\nuuid: \"test\"\nstatus: \"incoming\"\n---\n\nBody"
          result (parser/update-frontmatter raw "status" "done")]
      (is (re-find #"status: \"done\"" result))
      (is (re-find #"uuid: \"test\"" result)))))

(deftest test-roundtrip
  (testing "parse then serialize preserves data"
    (let [raw "---\nuuid: \"test\"\ntitle: \"Test\"\nstatus: done\npriority: P0\nlabels: [\"epics\", \"cljs\"]\n---\n\n# Title\n\nBody content"
          parsed (parser/parse-task-content raw)
          serialized (parser/serialize-task-content parsed)
          re-parsed (parser/parse-task-content serialized)]
      (is (= (get-in parsed [:frontmatter :uuid]) (get-in re-parsed [:frontmatter :uuid])))
      (is (= (get-in parsed [:frontmatter :title]) (get-in re-parsed [:frontmatter :title])))
      (is (= (get-in parsed [:frontmatter :status]) (get-in re-parsed [:frontmatter :status])))
      (is (= (get-in parsed [:frontmatter :labels]) (get-in re-parsed [:frontmatter :labels]))))))
