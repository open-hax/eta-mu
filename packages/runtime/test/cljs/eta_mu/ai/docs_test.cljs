(ns eta-mu.ai.docs-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.docs.law.docs :as law]
            [eta-mu.docs.shape.docs :as shape]
            [eta-mu.runtime.law.core :as core]
            [goog.object :as gobj]))

(def valid-mount
  {:id "docs"
   :root "docs"
   :include ["*.md"]
   :exclude ["node_modules/**"]})

(def valid-mounts-config
  {:record "eta_mu_mounts.v1"
   :version 1
   :generated-at "2026-06-15T00:00:00.000Z"
   :mounts [valid-mount]})

(def valid-heading
  {:level 1
   :title "Title"})

(def valid-wikilink
  {:kind :wikilink
   :target "Other Note"
   :target-key "other note"
   :alias "alias"
   :line 2})

(def valid-markdown-link
  {:kind :markdown
   :url "https://example.com"
   :text "ext"
   :line 3})

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
   :links [valid-wikilink valid-markdown-link]})

(def valid-backlink-source
  {:kind :wikilink
   :src-entity-id "doc:abc-123"
   :src-rel-path "docs/a.md"
   :target "Other Note"
   :target-key "other note"
   :line 2})

(def valid-backlinks-row
  {:record "ημ.docs-backlinks.v1"
   :generated-at "2026-06-15T00:00:00.000Z"
   :target-key "other note"
   :sources [valid-backlink-source]})

(def js-link-wikilink
  #js {:kind "wikilink"
       :target "Other Note"
       :target_key "other note"
       :alias "alias"
       :line 2})

(def js-link-markdown
  #js {:kind "markdown"
       :url "https://example.com"
       :text "ext"
       :line 3})

(def js-index-row
  #js {:record "ημ.docs-index.v1"
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
       :headings #js [#js {:level 1 :title "Title"}]
       :tags #js ["alpha" "beta"]
       :links #js [js-link-wikilink js-link-markdown]})

(def js-backlinks-row
  #js {:record "ημ.docs-backlinks.v1"
       :generated_at "2026-06-15T00:00:00.000Z"
       :target_key "other note"
       :sources #js [#js {:kind "wikilink"
                          :src_entity_id "doc:abc-123"
                          :src_rel_path "docs/a.md"
                          :target "Other Note"
                          :target_key "other note"
                          :line 2}]})

(deftest mount-schema-validation-test
  (testing "valid mount accepted"
    (is (core/valid? law/mount-schema valid-mount)))
  (testing "missing id rejected"
    (is (not (core/valid? law/mount-schema (dissoc valid-mount :id)))))
  (testing "include must be a vector of strings"
    (is (not (core/valid? law/mount-schema (assoc valid-mount :include [1]))))))

(deftest mounts-config-schema-validation-test
  (testing "valid config accepted"
    (is (core/valid? law/mounts-config-schema valid-mounts-config)))
  (testing "version may be string or number"
    (is (core/valid? law/mounts-config-schema (assoc valid-mounts-config :version "1.0.0")))
    (is (core/valid? law/mounts-config-schema (assoc valid-mounts-config :version 2)))
    (is (not (core/valid? law/mounts-config-schema (assoc valid-mounts-config :version true)))))
  (testing "missing mounts rejected"
    (is (not (core/valid? law/mounts-config-schema (dissoc valid-mounts-config :mounts))))))

(deftest heading-schema-validation-test
  (testing "valid heading accepted"
    (is (core/valid? law/heading-schema valid-heading)))
  (testing "level out of range rejected"
    (is (not (core/valid? law/heading-schema (assoc valid-heading :level 0))))
    (is (not (core/valid? law/heading-schema (assoc valid-heading :level 7))))))

(deftest link-schema-validation-test
  (testing "valid wikilink and markdown links accepted"
    (is (core/valid? law/link-schema valid-wikilink))
    (is (core/valid? law/link-schema valid-markdown-link)))
  (testing "unknown link kind rejected"
    (is (not (core/valid? law/link-schema (assoc valid-wikilink :kind :unknown)))))
  (testing "wikilink missing target_key rejected"
    (is (not (core/valid? law/link-schema (dissoc valid-wikilink :target-key))))))

(deftest index-row-schema-validation-test
  (testing "valid index row accepted"
    (is (core/valid? law/docs-index-row-schema valid-index-row)))
  (testing "wrong record literal rejected"
    (is (not (core/valid? law/docs-index-row-schema (assoc valid-index-row :record "wrong")))))
  (testing "negative bytes rejected"
    (is (not (core/valid? law/docs-index-row-schema (assoc valid-index-row :bytes -1)))))
  (testing "malformed nested link rejected"
    (is (not (core/valid? law/docs-index-row-schema
                          (assoc valid-index-row :links [(assoc valid-wikilink :line 0)]))))))

(deftest backlinks-row-schema-validation-test
  (testing "valid backlinks row accepted"
    (is (core/valid? law/docs-backlinks-row-schema valid-backlinks-row)))
  (testing "wrong record literal rejected"
    (is (not (core/valid? law/docs-backlinks-row-schema (assoc valid-backlinks-row :record "wrong")))))
  (testing "source with wrong kind rejected"
    (is (not (core/valid? law/docs-backlinks-row-schema
                          (assoc valid-backlinks-row
                                 :sources [(assoc valid-backlink-source :kind :markdown)]))))))

(deftest shape-constructors-test
  (testing "constructors create valid records"
    (is (core/valid? law/mount-schema (shape/create-mount valid-mount)))
    (is (core/valid? law/mounts-config-schema (shape/create-mounts-config valid-mounts-config)))
    (is (core/valid? law/heading-schema (shape/create-heading valid-heading)))
    (is (core/valid? law/link-schema (shape/create-wikilink (dissoc valid-wikilink :kind))))
    (is (core/valid? law/link-schema (shape/create-markdown-link (dissoc valid-markdown-link :kind))))
    (is (core/valid? law/docs-index-row-schema (shape/create-index-row valid-index-row)))
    (is (core/valid? law/docs-backlinks-row-schema (shape/create-backlinks-row valid-backlinks-row))))
  (testing "constructors reject invalid payloads"
    (is (thrown? cljs.core/ExceptionInfo (shape/create-mount (dissoc valid-mount :id))))
    (is (thrown? cljs.core/ExceptionInfo (shape/create-heading (assoc valid-heading :level 0))))))

(deftest shape-js-roundtrip-test
  (testing "JS fixtures convert to internal shapes that satisfy schemas"
    (is (core/valid? law/link-schema (shape/link-from-js js-link-wikilink)))
    (is (core/valid? law/link-schema (shape/link-from-js js-link-markdown)))
    (is (core/valid? law/docs-index-row-schema (shape/index-row-from-js js-index-row)))
    (is (core/valid? law/docs-backlinks-row-schema (shape/backlinks-row-from-js js-backlinks-row))))
  (testing "internal shapes convert back to JS with string keys and kinds"
    (let [index-js (shape/index-row->js (shape/index-row-from-js js-index-row))
          backlink-js (shape/backlinks-row->js (shape/backlinks-row-from-js js-backlinks-row))]
      (is (= "ημ.docs-index.v1" (gobj/get index-js "record")))
      (is (= "wikilink" (gobj/get (gobj/getValueByKeys index-js "links" 0) "kind")))
      (is (= "ημ.docs-backlinks.v1" (gobj/get backlink-js "record")))
      (is (= "other note" (gobj/get backlink-js "target_key"))))))

(deftest fixture-shape-acceptance-test
  (testing "schemas accept fixture shapes produced by the current parser"
    (let [wiki-from-js (shape/link-from-js js-link-wikilink)
          md-from-js (shape/link-from-js js-link-markdown)
          heading-from-js (shape/heading-from-js #js {:level 1 :title "Title"})]
      (is (= :wikilink (:kind wiki-from-js)))
      (is (= "other note" (:target-key wiki-from-js)))
      (is (= :markdown (:kind md-from-js)))
      (is (= "https://example.com" (:url md-from-js)))
      (is (= 1 (:level heading-from-js)))
      (is (= "Title" (:title heading-from-js))))))
