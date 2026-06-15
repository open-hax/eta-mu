(ns eta-mu.docs.shape-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.docs.shape.docs :as shape]))

(def valid-mount
  {:id "docs"
   :root "docs"
   :include ["*.md"]
   :exclude ["node_modules/**"]})

(def valid-mounts-config
  {:record "ημ.mounts.v1"
   :version 1
   :generated-at "2026-06-15T00:00:00.000Z"
   :mounts [valid-mount]})

(def valid-heading
  {:level 1
   :title "Title"})

(def valid-wikilink
  {:target "Other Note"
   :target-key "other note"
   :alias "alias"
   :line 2})

(def valid-markdown-link
  {:url "https://example.com"
   :text "ext"
   :line 3})

(def valid-backlink-source
  {:src-entity-id "doc:abc-123"
   :src-rel-path "docs/a.md"
   :target "Other Note"
   :target-key "other note"
   :line 2})

(def valid-index-row
  {:record "ημ.docs-index.v1"
   :parser-version "eta_mu_docs_index.v1"
   :extracted-at "2026-06-15T00:00:00.000Z"
   :entity-id "doc:abc-123"
   :mount-id "docs"
   :source-rel-path "docs/a.md"
   :bytes 256
   :mtime-ns 1700000000000
   :mtime-utc "2026-06-15T00:00:00.000Z"
   :content-sha256 "deadbeef"
   :title "Title"
   :headings [valid-heading]
   :tags ["alpha" "beta"]
   :links [(assoc valid-wikilink :kind :wikilink)
           (assoc valid-markdown-link :kind :markdown)]})

(def valid-backlinks-row
  {:record "ημ.docs-backlinks.v1"
   :generated-at "2026-06-15T00:00:00.000Z"
   :target-key "other note"
   :sources [(assoc valid-backlink-source :kind :wikilink)]})

(deftest create-mount-test
  (testing "valid mount round-trips"
    (let [record (shape/create-mount valid-mount)]
      (is (= "docs" (:id record)))
      (is (= "docs" (:root record)))
      (is (= ["*.md"] (:include record)))
      (is (= ["node_modules/**"] (:exclude record)))))
  (testing "malformed mount rejected"
    (is (thrown-with-msg? js/Error #"Invalid eta-mu runtime EtaMuMount"
                          (shape/create-mount (dissoc valid-mount :id))))
    (is (thrown-with-msg? js/Error #"Invalid eta-mu runtime EtaMuMount"
                          (shape/create-mount (assoc valid-mount :include [1]))))))

(deftest create-mounts-config-test
  (testing "valid mounts config round-trips"
    (let [record (shape/create-mounts-config valid-mounts-config)]
      (is (= "ημ.mounts.v1" (:record record)))
      (is (= 1 (:version record)))
      (is (= "2026-06-15T00:00:00.000Z" (:generated-at record)))
      (is (= 1 (count (:mounts record))))))
  (testing "malformed mounts config rejected"
    (is (thrown-with-msg? js/Error #"Invalid eta-mu runtime EtaMuMountsConfig"
                          (shape/create-mounts-config (dissoc valid-mounts-config :mounts))))
    (is (thrown-with-msg? js/Error #"Invalid eta-mu runtime EtaMuMountsConfig"
                          (shape/create-mounts-config (assoc valid-mounts-config :mounts {}))))))

(deftest create-heading-test
  (testing "valid heading round-trips"
    (let [record (shape/create-heading valid-heading)]
      (is (= 1 (:level record)))
      (is (= "Title" (:title record)))))
  (testing "malformed heading rejected"
    (is (thrown-with-msg? js/Error #"Invalid eta-mu runtime EtaMuHeading"
                          (shape/create-heading (assoc valid-heading :level 0))))
    (is (thrown-with-msg? js/Error #"Invalid eta-mu runtime EtaMuHeading"
                          (shape/create-heading (assoc valid-heading :title ""))))))

(deftest create-wikilink-test
  (testing "valid wikilink round-trips"
    (let [record (shape/create-wikilink valid-wikilink)]
      (is (= :wikilink (:kind record)))
      (is (= "Other Note" (:target record)))
      (is (= "other note" (:target-key record)))
      (is (= "alias" (:alias record)))
      (is (= 2 (:line record)))))
  (testing "wikilink defaults alias to empty string"
    (let [record (shape/create-wikilink (dissoc valid-wikilink :alias))]
      (is (= "" (:alias record)))))
  (testing "malformed wikilink rejected"
    (is (thrown-with-msg? js/Error #"Invalid eta-mu runtime EtaMuWikilink"
                          (shape/create-wikilink (assoc valid-wikilink :line 0))))
    (is (thrown-with-msg? js/Error #"Invalid eta-mu runtime EtaMuWikilink"
                          (shape/create-wikilink (dissoc valid-wikilink :target))))))

(deftest create-markdown-link-test
  (testing "valid markdown link round-trips"
    (let [record (shape/create-markdown-link valid-markdown-link)]
      (is (= :markdown (:kind record)))
      (is (= "https://example.com" (:url record)))
      (is (= "ext" (:text record)))
      (is (= 3 (:line record)))))
  (testing "markdown link defaults text to empty string"
    (let [record (shape/create-markdown-link (dissoc valid-markdown-link :text))]
      (is (= "" (:text record)))))
  (testing "malformed markdown link rejected"
    (is (thrown-with-msg? js/Error #"Invalid eta-mu runtime EtaMuMarkdownLink"
                          (shape/create-markdown-link (assoc valid-markdown-link :url ""))))
    (is (thrown-with-msg? js/Error #"Invalid eta-mu runtime EtaMuMarkdownLink"
                          (shape/create-markdown-link (assoc valid-markdown-link :line -1))))))

(deftest create-backlink-source-test
  (testing "valid backlink source round-trips"
    (let [record (shape/create-backlink-source valid-backlink-source)]
      (is (= :wikilink (:kind record)))
      (is (= "doc:abc-123" (:src-entity-id record)))
      (is (= "docs/a.md" (:src-rel-path record)))
      (is (= "Other Note" (:target record)))
      (is (= "other note" (:target-key record)))
      (is (= 2 (:line record)))))
  (testing "malformed backlink source rejected"
    (is (thrown-with-msg? js/Error #"Invalid eta-mu runtime EtaMuDocsBacklinkSource"
                          (shape/create-backlink-source (assoc valid-backlink-source :line 0))))
    (is (thrown-with-msg? js/Error #"Invalid eta-mu runtime EtaMuDocsBacklinkSource"
                          (shape/create-backlink-source (dissoc valid-backlink-source :src-entity-id))))))

(deftest create-index-row-test
  (testing "valid index row round-trips"
    (let [record (shape/create-index-row valid-index-row)]
      (is (= "ημ.docs-index.v1" (:record record)))
      (is (= "doc:abc-123" (:entity-id record)))
      (is (= 1 (count (:headings record))))
      (is (= 2 (count (:links record))))
      (is (= ["alpha" "beta"] (:tags record)))))
  (testing "malformed index row rejected"
    (is (thrown-with-msg? js/Error #"Invalid eta-mu runtime EtaMuDocsIndexRow"
                          (shape/create-index-row (assoc valid-index-row :record "wrong"))))
    (is (thrown-with-msg? js/Error #"Invalid eta-mu runtime EtaMuDocsIndexRow"
                          (shape/create-index-row (assoc valid-index-row :bytes -1))))
    (is (thrown-with-msg? js/Error #"Invalid eta-mu runtime EtaMuDocsIndexRow"
                          (shape/create-index-row (assoc valid-index-row :links [(assoc valid-wikilink :kind :wikilink :line 0)]))))))

(deftest create-backlinks-row-test
  (testing "valid backlinks row round-trips"
    (let [record (shape/create-backlinks-row valid-backlinks-row)]
      (is (= "ημ.docs-backlinks.v1" (:record record)))
      (is (= "other note" (:target-key record)))
      (is (= 1 (count (:sources record))))))
  (testing "malformed backlinks row rejected"
    (is (thrown-with-msg? js/Error #"Invalid eta-mu runtime EtaMuDocsBacklinksRow"
                          (shape/create-backlinks-row (assoc valid-backlinks-row :record "wrong"))))
    (is (thrown-with-msg? js/Error #"Invalid eta-mu runtime EtaMuDocsBacklinksRow"
                          (shape/create-backlinks-row (assoc valid-backlinks-row :sources [(assoc valid-backlink-source :kind :markdown)]))))))

(deftest mount-external-roundtrip-test
  (testing "mount converts from external JS-style keys and back"
    (let [external {:id "docs" :root "docs" :include ["*.md"] :exclude []}
          internal (shape/mount-from-external external)
          back (shape/mount->external internal)]
      (is (= "docs" (:id internal)))
      (is (= ["*.md"] (:include internal)))
      (is (= [] (:exclude internal)))
      (is (= external back)))))

(deftest mounts-config-external-roundtrip-test
  (testing "mounts config converts from external JS-style keys and back"
    (let [external {:record "ημ.mounts.v1" :version 1 :generated_at "2026-06-15T00:00:00.000Z"
                    :mounts [{:id "docs" :root "docs"}]}
          internal (shape/mounts-config-from-external external)
          back (shape/mounts-config->external internal)]
      (is (= 1 (:version internal)))
      (is (= "2026-06-15T00:00:00.000Z" (:generated-at internal)))
      (is (= external back)))))

(deftest heading-external-roundtrip-test
  (testing "heading converts from external JS-style keys and back"
    (let [external {:level 2 :title "Subtitle"}
          internal (shape/heading-from-external external)
          back (shape/heading->external internal)]
      (is (= 2 (:level internal)))
      (is (= "Subtitle" (:title internal)))
      (is (= external back)))))

(deftest wikilink-external-roundtrip-test
  (testing "wikilink converts from external JS-style keys and back"
    (let [external {:kind "wikilink" :target "Other Note" :target_key "other note" :alias "alias" :line 2}
          internal (shape/wikilink-from-external external)
          back (shape/wikilink->external internal)]
      (is (= :wikilink (:kind internal)))
      (is (= "other note" (:target-key internal)))
      (is (= external back)))))

(deftest markdown-link-external-roundtrip-test
  (testing "markdown link converts from external JS-style keys and back"
    (let [external {:kind "markdown" :url "https://example.com" :text "ext" :line 3}
          internal (shape/markdown-link-from-external external)
          back (shape/markdown-link->external internal)]
      (is (= :markdown (:kind internal)))
      (is (= "https://example.com" (:url internal)))
      (is (= external back)))))

(deftest backlink-source-external-roundtrip-test
  (testing "backlink source converts from external JS-style keys and back"
    (let [external {:kind "wikilink" :src_entity_id "doc:abc-123" :src_rel_path "docs/a.md"
                    :target "Other Note" :target_key "other note" :line 2}
          internal (shape/backlink-source-from-external external)
          back (shape/backlink-source->external internal)]
      (is (= :wikilink (:kind internal)))
      (is (= "doc:abc-123" (:src-entity-id internal)))
      (is (= external back)))))

(deftest index-row-external-roundtrip-test
  (testing "index row converts from external JS-style keys and back"
    (let [external {:record "ημ.docs-index.v1"
                    :parser_version "eta_mu_docs_index.v1"
                    :extracted_at "2026-06-15T00:00:00.000Z"
                    :entity_id "doc:abc-123"
                    :mount_id "docs"
                    :source_rel_path "docs/a.md"
                    :bytes 256
                    :mtime_ns 1700000000000
                    :mtime_utc "2026-06-15T00:00:00.000Z"
                    :content_sha256 "deadbeef"
                    :title "Title"
                    :headings [{:level 1 :title "Title"}]
                    :tags ["alpha" "beta"]
                    :links [{:kind "wikilink" :target "Other Note" :target_key "other note"
                             :alias "alias" :line 2}
                            {:kind "markdown" :url "https://example.com" :text "ext" :line 3}]}
          internal (shape/index-row-from-external external)
          back (shape/index-row->external internal)]
      (is (= "ημ.docs-index.v1" (:record internal)))
      (is (= "doc:abc-123" (:entity-id internal)))
      (is (= 2 (count (:links internal))))
      (is (= external back)))))

(deftest backlinks-row-external-roundtrip-test
  (testing "backlinks row converts from external JS-style keys and back"
    (let [external {:record "ημ.docs-backlinks.v1"
                    :generated_at "2026-06-15T00:00:00.000Z"
                    :target_key "other note"
                    :sources [{:kind "wikilink" :src_entity_id "doc:abc-123" :src_rel_path "docs/a.md"
                               :target "Other Note" :target_key "other note" :line 2}]}
          internal (shape/backlinks-row-from-external external)
          back (shape/backlinks-row->external internal)]
      (is (= "ημ.docs-backlinks.v1" (:record internal)))
      (is (= "other note" (:target-key internal)))
      (is (= 1 (count (:sources internal))))
      (is (= external back)))))
