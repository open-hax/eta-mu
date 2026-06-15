(ns eta-mu.docs.infra.indexer
  (:require [clojure.string :as str]
            [eta-mu.docs.domain.parse :as parse]
            [eta-mu.docs.extern.fs :as fs]
            [eta-mu.docs.extern.jsonl :as jsonl]
            [eta-mu.docs.infra.mounts :as mounts]
            [eta-mu.docs.law.docs :as law]
            [eta-mu.docs.shape.docs :as shape]
            [eta-mu.runtime.law.core :as core]
            [eta-mu.runtime.extern.time :as time]))

(def default-parser-version "eta_mu_docs_index.v1")

(defn- object-record?
  [value]
  (and (map? value) (not (vector? value))))

(defn- wikilink-link?
  [link]
  (and (object-record? link) (= :wikilink (:kind link))))

(defn- resolve-entity-id
  "Choose an entity id for a document based on parsed uuid, previous rows, or a stable id."
  [{:keys [uuid]} prev-by-path prev-by-content cache-key]
  (cond
    (seq uuid) (str "doc:" uuid)
    (and prev-by-path (seq (:entity-id prev-by-path))) (:entity-id prev-by-path)
    (and prev-by-content (seq (:entity-id prev-by-content))) (:entity-id prev-by-content)
    :else (fs/stable-id "doc" cache-key 20)))

(defn- collect-backlink-edges
  "Return a vector of backlink edge maps for `links` from document `entity-id` at `rel`."
  [entity-id rel links]
  (vec
   (for [link links
         :when (wikilink-link? link)
         :let [target-key (str (:target-key link))]
         :when (seq target-key)]
     {:target-key target-key
      :edge (shape/create-backlink-source
             {:kind :wikilink
              :src-entity-id entity-id
              :src-rel-path rel
              :target (str (:target link))
              :target-key target-key
              :line (:line link)})})))

(defn- build-backlink-rows
  "Group backlink edges by target-key and produce validated backlink rows."
  [edges]
  (let [by-target (group-by :target-key edges)
        keys (sort (keys by-target))
        now (time/now-iso)]
    (mapv (fn [k]
            (let [sources (mapv :edge (get by-target k))
                  row {:record "ημ.docs-backlinks.v1"
                       :generated-at now
                       :target-key k
                       :sources sources}]
              (core/validate! law/docs-backlinks-row-schema row "EtaMuDocsBacklinksRow")
              row))
          keys)))

(defn- make-index-row
  "Create a validated index row map from parsed document metadata."
  [{:keys [parser-version extracted-at entity-id mount-id rel bytes mtime-ns mtime-utc content-sha parsed]}]
  (let [row {:record "ημ.docs-index.v1"
             :parser-version parser-version
             :extracted-at extracted-at
             :entity-id entity-id
             :mount-id mount-id
             :source-rel-path rel
             :bytes bytes
             :mtime-ns mtime-ns
             :mtime-utc mtime-utc
             :content-sha256 content-sha
             :title (:title parsed)
             :headings (:headings parsed)
             :tags (:tags parsed)
             :links (:links parsed)}]
    (core/validate! law/docs-index-row-schema row "EtaMuDocsIndexRow")
    row))

(defn- index-file
  "Index a single markdown file, using the cache when possible."
  [mount-id root-abs abs-path parser-version by-path by-content]
  (let [rel (fs/posix-relative root-abs abs-path)
        {:keys [size mtime-ns mtime-utc]} (fs/stat abs-path)
        cache-key (str mount-id ":" rel)
        prev-by-path (get by-path cache-key)
        cached-ok (and prev-by-path
                       (= (str (:parser-version prev-by-path)) (str parser-version))
                       (= (:mtime-ns prev-by-path) mtime-ns)
                       (= (:bytes prev-by-path) size))]
    (if cached-ok
      (let [entity-id (or (not-empty (:entity-id prev-by-path))
                          (fs/stable-id "doc" cache-key 20))
            row (assoc prev-by-path :entity-id entity-id :mtime-utc mtime-utc)
            edges (collect-backlink-edges entity-id rel (:links row))]
        {:row row :edges edges})
      (let [text (fs/read-file abs-path)
            content-sha (fs/sha256-hex text)
            prev-by-content (get by-content content-sha)
            parsed (parse/parse-eta-mu-markdown {:rel-path rel :text text})
            entity-id (resolve-entity-id parsed prev-by-path prev-by-content cache-key)
            row (make-index-row {:parser-version parser-version
                                 :extracted-at (time/now-iso)
                                 :entity-id entity-id
                                 :mount-id mount-id
                                 :rel rel
                                 :bytes size
                                 :mtime-ns mtime-ns
                                 :mtime-utc mtime-utc
                                 :content-sha content-sha
                                 :parsed parsed})
            edges (collect-backlink-edges entity-id rel (:links parsed))]
        {:row row :edges edges}))))

(defn- index-mount
  "Index all markdown files under a single mount and return rows + edges."
  [root-abs mount parser-version by-path by-content]
  (let [mount-id (str (:id mount))
        mount-root (str (:root mount))
        mount-root-abs (fs/path-resolve [root-abs mount-root])
        files (fs/walk-markdown-files mount-root-abs)]
    (reduce (fn [acc abs-path]
              (let [{:keys [row edges]} (index-file mount-id root-abs abs-path parser-version by-path by-content)]
                (-> acc
                    (update :rows conj row)
                    (update :edges into edges))))
            {:rows [] :edges []}
            files)))

(defn index-eta-mu-docs
  "Walk configured mounts, parse markdown, and write index + backlinks JSONL.
   Options:
     :repo-root      repository root (defaults to cwd)
     :mounts-path    relative path to mounts JSON config
     :index-path     relative path for the index JSONL output
     :backlinks-path relative path for the backlinks JSONL output
     :parser-version optional parser version string"
  [{:keys [repo-root mounts-path index-path backlinks-path parser-version]}]
  (let [root-abs (fs/path-resolve [(or (some-> repo-root str str/trim not-empty) (fs/cwd))])
        parser-version (or parser-version default-parser-version)
        config (mounts/load-eta-mu-mounts {:repo-root root-abs :mounts-path mounts-path})
        index-abs (fs/path-resolve [root-abs (str index-path)])
        backlinks-abs (fs/path-resolve [root-abs (str backlinks-path)])
        existing-rows (mapv shape/index-row-from-external (jsonl/read-jsonl index-abs))
        by-path (into {}
                      (for [row existing-rows
                            :let [mount-id (str (:mount-id row))
                                  rel (str (:source-rel-path row))]
                            :when (and (seq mount-id) (seq rel))]
                        [(str mount-id ":" rel) row]))
        by-content (into {}
                         (for [row existing-rows
                               :let [content-sha (str (:content-sha256 row))]
                               :when (seq content-sha)]
                           [content-sha row]))
        results (mapv #(index-mount root-abs % parser-version by-path by-content) (:mounts config))
        next-rows (vec (sort-by :source-rel-path (mapcat :rows results)))
        backlink-edges (vec (mapcat :edges results))
        backlink-rows (build-backlink-rows backlink-edges)]
    (jsonl/write-jsonl index-abs (mapv shape/index-row->external next-rows))
    (jsonl/write-jsonl backlinks-abs (mapv shape/backlinks-row->external backlink-rows))
    {:indexed-files (count next-rows)
     :index-path index-abs
     :backlinks-path backlinks-abs}))
