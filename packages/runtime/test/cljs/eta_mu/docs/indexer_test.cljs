(ns eta-mu.docs.indexer-test
  (:require [cljs.test :refer [deftest is testing use-fixtures]]
            [eta-mu.docs.extern.fs :as fs]
            [eta-mu.docs.extern.jsonl :as jsonl]
            [eta-mu.docs.infra.indexer :as indexer]))

(defn- temp-dir
  "Return a unique temp directory path under target/test-docs-indexer."
  []
  (fs/path-resolve [(fs/cwd) "target" "test-docs-indexer" (str (random-uuid))]))

(defn- setup-docs-tree
  "Create a temp repo with mounts.json and markdown files. Returns the repo root."
  []
  (let [root (temp-dir)
        docs-dir (fs/path-resolve [root "docs"])
        mounts-path (fs/path-resolve [root "mounts.json"])]
    (fs/mkdir docs-dir)
    (fs/write-file (fs/path-resolve [docs-dir "a.md"])
                   (str "---\n"
                        "uuid: abc-123\n"
                        "tags: [Alpha, beta]\n"
                        "---\n"
                        "\n"
                        "# Title A\n"
                        "\n"
                        "See [[Title B]] for more.\n"
                        "\n"
                        "Inline #TagOne and #tag_two.\n"
                        "\n"
                        "[ext](https://example.com)\n"))
    (fs/write-file (fs/path-resolve [docs-dir "b.md"])
                   (str "---\n"
                        "uuid: def-456\n"
                        "---\n"
                        "\n"
                        "# Title B\n"
                        "\n"
                        "Back to [[Title A|alias a]].\n"))
    (jsonl/write-json mounts-path
                      {:record "ημ.mounts.v1"
                       :version 1
                       :mounts [{:id "docs"
                                 :root "docs"}]})
    root))

(use-fixtures :each
  {:after (fn []
            (try
              (fs/rmdir (fs/path-resolve [(fs/cwd) "target" "test-docs-indexer"]))
              (catch js/Error _
                nil)))})

(deftest index-eta-mu-docs-basic-test
  (testing "indexer walks mounts and produces index and backlinks JSONL"
    (let [root (setup-docs-tree)
          result (indexer/index-eta-mu-docs {:repo-root root
                                             :mounts-path "mounts.json"
                                             :index-path "index.jsonl"
                                             :backlinks-path "backlinks.jsonl"})]
      (is (= 2 (:indexed-files result)))
      (is (fs/file-exists? (fs/path-resolve [root "index.jsonl"])))
      (is (fs/file-exists? (fs/path-resolve [root "backlinks.jsonl"])))

      (let [index-rows (jsonl/read-jsonl (fs/path-resolve [root "index.jsonl"]))
            by-path (into {} (map (juxt :source_rel_path identity)) index-rows)]
        (is (= 2 (count index-rows)))
        (is (= "ημ.docs-index.v1" (:record (first index-rows))))
        (is (= "doc:abc-123" (:entity_id (get by-path "docs/a.md"))))
        (is (= "doc:def-456" (:entity_id (get by-path "docs/b.md"))))
        (is (= "Title A" (:title (get by-path "docs/a.md"))))
        (is (= "Title B" (:title (get by-path "docs/b.md"))))
        (is (= ["alpha" "beta" "tagone" "tag_two"] (:tags (get by-path "docs/a.md"))))
        (is (= 1 (count (:links (get by-path "docs/b.md"))))))

      (let [backlink-rows (jsonl/read-jsonl (fs/path-resolve [root "backlinks.jsonl"]))
            by-target (into {} (map (juxt :target_key identity)) backlink-rows)]
        (is (= 2 (count backlink-rows)))
        (is (= "ημ.docs-backlinks.v1" (:record (first backlink-rows))))
        (is (= 1 (count (:sources (get by-target "title b")))))
        (is (= "doc:abc-123" (:src_entity_id (first (:sources (get by-target "title b"))))))
        (is (= 1 (count (:sources (get by-target "title a")))))))))

(deftest index-eta-mu-docs-cache-test
  (testing "re-running the indexer reuses cached rows when mtime and parser version match"
    (let [root (setup-docs-tree)
          _ (indexer/index-eta-mu-docs {:repo-root root
                                        :mounts-path "mounts.json"
                                        :index-path "index.jsonl"
                                        :backlinks-path "backlinks.jsonl"
                                        :parser-version "eta_mu_docs_index.v1"})
          first-rows (jsonl/read-jsonl (fs/path-resolve [root "index.jsonl"]))
          first-entity-ids (mapv :entity_id first-rows)
          _ (indexer/index-eta-mu-docs {:repo-root root
                                        :mounts-path "mounts.json"
                                        :index-path "index.jsonl"
                                        :backlinks-path "backlinks.jsonl"
                                        :parser-version "eta_mu_docs_index.v1"})
          second-rows (jsonl/read-jsonl (fs/path-resolve [root "index.jsonl"]))
          second-entity-ids (mapv :entity_id second-rows)]
      (is (= first-entity-ids second-entity-ids))
      (is (= 2 (count second-rows))))))

(deftest index-eta-mu-docs-empty-mount-test
  (testing "indexer handles an empty mount gracefully"
    (let [root (temp-dir)
          docs-dir (fs/path-resolve [root "docs"])
          mounts-path (fs/path-resolve [root "mounts.json"])]
      (fs/mkdir docs-dir)
      (jsonl/write-json mounts-path {:record "ημ.mounts.v1"
                                     :version 1
                                     :mounts [{:id "docs"
                                               :root "docs"}]})
      (let [result (indexer/index-eta-mu-docs {:repo-root root
                                               :mounts-path "mounts.json"
                                               :index-path "index.jsonl"
                                               :backlinks-path "backlinks.jsonl"})]
        (is (= 0 (:indexed-files result)))
        (is (= [] (jsonl/read-jsonl (fs/path-resolve [root "index.jsonl"]))))
        (is (= [] (jsonl/read-jsonl (fs/path-resolve [root "backlinks.jsonl"]))))))))
