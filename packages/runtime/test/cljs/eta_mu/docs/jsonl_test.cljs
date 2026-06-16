(ns eta-mu.docs.jsonl-test
  (:require [cljs.test :refer [deftest is testing use-fixtures]]
            [clojure.string :as str]
            [eta-mu.docs.extern.fs :as fs]
            [eta-mu.docs.extern.jsonl :as jsonl]))

(defn- temp-dir
  "Return a unique temp directory path under target/test-docs-jsonl."
  []
  (fs/path-resolve [(fs/cwd) "target" "test-docs-jsonl" (str (random-uuid))]))

(use-fixtures :each
  {:after (fn []
            (try
              (fs/rmdir (fs/path-resolve [(fs/cwd) "target" "test-docs-jsonl"]))
              (catch js/Error _
                nil)))})

(deftest write-json-read-json-roundtrip-test
  (testing "write-json and read-json round-trip keywordized CLJS data"
    (let [dir (temp-dir)
          path (fs/path-resolve [dir "single.json"])
          payload {:record "ημ.docs-index.v1"
                   :parser-version "v1"
                   :tags ["alpha" "beta"]}]
      (jsonl/write-json path payload)
      (is (fs/file-exists? path))
      (is (= payload (jsonl/read-json path))))))

(deftest read-jsonl-rejects-malformed-row-test
  (testing "read-jsonl throws a clear error when a non-blank line is invalid JSON"
    (let [dir (temp-dir)
          path (fs/path-resolve [dir "malformed.jsonl"])]
      (fs/write-file path (str "{\"ok\":true}\n"
                               "not-json-at-all\n"))
      (is (thrown-with-msg? js/Error #"JSONL row 2 is invalid JSON"
                            (jsonl/read-jsonl path))))))

(deftest read-jsonl-rejects-non-object-row-test
  (testing "read-jsonl throws when a line parses to a non-object value"
    (let [dir (temp-dir)
          path (fs/path-resolve [dir "array.jsonl"])]
      (fs/write-file path (str "{\"ok\":true}\n"
                               "[1, 2, 3]\n"))
      (is (thrown-with-msg? js/Error #"JSONL row 2 is not an object"
                            (jsonl/read-jsonl path))))))

(deftest write-jsonl-read-jsonl-roundtrip-test
  (testing "write-jsonl and read-jsonl round-trip multiple rows"
    (let [dir (temp-dir)
          path (fs/path-resolve [dir "rows.jsonl"])
          rows [{:record "ημ.docs-index.v1" :entity-id "doc:a" :title "A"}
                {:record "ημ.docs-index.v1" :entity-id "doc:b" :title "B"}]]
      (jsonl/write-jsonl path rows)
      (is (fs/file-exists? path))
      (let [read-rows (jsonl/read-jsonl path)]
        (is (= 2 (count read-rows)))
        (is (= "doc:a" (:entity-id (first read-rows))))
        (is (= "A" (:title (first read-rows))))
        (is (= "doc:b" (:entity-id (second read-rows))))
        (is (= "B" (:title (second read-rows))))))))

(deftest write-jsonl-empty-roundtrip-test
  (testing "write-jsonl with empty vector produces empty file and read-jsonl returns empty vector"
    (let [dir (temp-dir)
          path (fs/path-resolve [dir "empty.jsonl"])]
      (jsonl/write-jsonl path [])
      (is (fs/file-exists? path))
      (is (= "" (str/trim (fs/read-file path))))
      (is (= [] (jsonl/read-jsonl path))))))

(deftest read-jsonl-missing-file-test
  (testing "read-jsonl returns empty vector for a missing file"
    (let [path (fs/path-resolve [(temp-dir) "missing.jsonl"])]
      (is (= [] (jsonl/read-jsonl path))))))

(deftest read-jsonl-ignores-blank-lines-test
  (testing "read-jsonl ignores blank lines between valid rows"
    (let [dir (temp-dir)
          path (fs/path-resolve [dir "blanks.jsonl"])]
      (fs/write-file path (str "{\"n\":1}\n"
                               "\n"
                               "\n"
                               "{\"n\":2}\n"))
      (is (= [{:n 1} {:n 2}] (jsonl/read-jsonl path))))))
