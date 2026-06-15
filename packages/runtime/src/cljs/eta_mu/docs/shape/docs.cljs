(ns eta-mu.docs.shape.docs
  (:require [eta-mu.docs.extern.js :as extern]
            [eta-mu.docs.law.docs :as law]
            [eta-mu.runtime.law.core :as core]))

(defrecord EtaMuMount [id root include exclude])
(defrecord EtaMuMountsConfig [record version generated-at mounts])
(defrecord EtaMuHeading [level title])
(defrecord EtaMuWikilink [kind target target-key alias line])
(defrecord EtaMuMarkdownLink [kind url text line])
(defrecord EtaMuDocsBacklinkSource [kind src-entity-id src-rel-path target target-key line])
(defrecord EtaMuDocsIndexRow [record parser-version extracted-at entity-id mount-id source-rel-path
                              bytes mtime-ns mtime-utc content-sha256 title headings tags links])
(defrecord EtaMuDocsBacklinksRow [record generated-at target-key sources])

(defn- maybe-keyword
  [value]
  (cond
    (keyword? value) value
    (string? value) (keyword value)
    :else value))

(defn create-mount
  [{:keys [id root include exclude] :as mount}]
  (core/validate! law/mount-schema mount "EtaMuMount")
  (map->EtaMuMount {:id id
                    :root root
                    :include include
                    :exclude exclude}))

(defn create-mounts-config
  [{:keys [record version generated-at mounts] :as config}]
  (core/validate! law/mounts-config-schema config "EtaMuMountsConfig")
  (map->EtaMuMountsConfig {:record record
                           :version version
                           :generated-at generated-at
                           :mounts mounts}))

(defn create-heading
  [{:keys [level title] :as heading}]
  (core/validate! law/heading-schema heading "EtaMuHeading")
  (map->EtaMuHeading {:level level :title title}))

(defn create-wikilink
  [{:keys [target target-key alias line]}]
  (let [record (map->EtaMuWikilink {:kind :wikilink
                                    :target target
                                    :target-key target-key
                                    :alias (or alias "")
                                    :line line})]
    (core/validate! law/wikilink-schema record "EtaMuWikilink")
    record))

(defn create-markdown-link
  [{:keys [url text line]}]
  (let [record (map->EtaMuMarkdownLink {:kind :markdown
                                        :url url
                                        :text (or text "")
                                        :line line})]
    (core/validate! law/markdown-link-schema record "EtaMuMarkdownLink")
    record))

(defn create-backlink-source
  [{:keys [src-entity-id src-rel-path target target-key line]}]
  (let [record (map->EtaMuDocsBacklinkSource {:kind :wikilink
                                              :src-entity-id src-entity-id
                                              :src-rel-path src-rel-path
                                              :target target
                                              :target-key target-key
                                              :line line})]
    (core/validate! law/backlink-source-schema record "EtaMuDocsBacklinkSource")
    record))

(defn create-index-row
  [{:keys [record parser-version extracted-at entity-id mount-id source-rel-path
           bytes mtime-ns mtime-utc content-sha256 title headings tags links] :as row}]
  (core/validate! law/docs-index-row-schema row "EtaMuDocsIndexRow")
  (map->EtaMuDocsIndexRow {:record record
                           :parser-version parser-version
                           :extracted-at extracted-at
                           :entity-id entity-id
                           :mount-id mount-id
                           :source-rel-path source-rel-path
                           :bytes bytes
                           :mtime-ns mtime-ns
                           :mtime-utc mtime-utc
                           :content-sha256 content-sha256
                           :title title
                           :headings headings
                           :tags tags
                           :links links}))

(defn create-backlinks-row
  [{:keys [record generated-at target-key sources] :as row}]
  (core/validate! law/docs-backlinks-row-schema row "EtaMuDocsBacklinksRow")
  (map->EtaMuDocsBacklinksRow {:record record
                               :generated-at generated-at
                               :target-key target-key
                               :sources sources}))

(defn mount-from-external
  [mount]
  (cond-> {:id (:id mount)
           :root (:root mount)}
    (contains? mount :include) (assoc :include (vec (:include mount)))
    (contains? mount :exclude) (assoc :exclude (vec (:exclude mount)))))

(defn mount->external
  [mount]
  (cond-> {:id (:id mount)
           :root (:root mount)}
    (some? (:include mount)) (assoc :include (vec (:include mount)))
    (some? (:exclude mount)) (assoc :exclude (vec (:exclude mount)))))

(defn mounts-config-from-external
  [config]
  (cond-> {:mounts (mapv mount-from-external (:mounts config))}
    (contains? config :record) (assoc :record (:record config))
    (contains? config :version) (assoc :version (:version config))
    (contains? config :generated_at) (assoc :generated-at (:generated_at config))))

(defn mounts-config->external
  [config]
  (cond-> {:mounts (mapv mount->external (:mounts config))}
    (some? (:record config)) (assoc :record (:record config))
    (some? (:version config)) (assoc :version (:version config))
    (some? (:generated-at config)) (assoc :generated_at (:generated-at config))))

(defn heading-from-external
  [heading]
  {:level (:level heading)
   :title (:title heading)})

(defn heading->external
  [heading]
  {:level (:level heading)
   :title (:title heading)})

(defn wikilink-from-external
  [link]
  {:kind :wikilink
   :target (:target link)
   :target-key (:target_key link)
   :alias (or (:alias link) "")
   :line (:line link)})

(defn wikilink->external
  [link]
  {:kind "wikilink"
   :target (:target link)
   :target_key (:target-key link)
   :alias (:alias link)
   :line (:line link)})

(defn markdown-link-from-external
  [link]
  {:kind :markdown
   :url (:url link)
   :text (or (:text link) "")
   :line (:line link)})

(defn markdown-link->external
  [link]
  {:kind "markdown"
   :url (:url link)
   :text (:text link)
   :line (:line link)})

(defn link-from-external
  [link]
  (case (maybe-keyword (:kind link))
    :wikilink (wikilink-from-external link)
    :markdown (markdown-link-from-external link)
    link))

(defn link->external
  [link]
  (case (:kind link)
    :wikilink (wikilink->external link)
    :markdown (markdown-link->external link)
    link))

(defn backlink-source-from-external
  [source]
  {:kind :wikilink
   :src-entity-id (:src_entity_id source)
   :src-rel-path (:src_rel_path source)
   :target (:target source)
   :target-key (:target_key source)
   :line (:line source)})

(defn backlink-source->external
  [source]
  {:kind "wikilink"
   :src_entity_id (:src-entity-id source)
   :src_rel_path (:src-rel-path source)
   :target (:target source)
   :target_key (:target-key source)
   :line (:line source)})

(defn index-row-from-external
  [row]
  {:record (:record row)
   :parser-version (:parser_version row)
   :extracted-at (:extracted_at row)
   :entity-id (:entity_id row)
   :mount-id (:mount_id row)
   :source-rel-path (:source_rel_path row)
   :bytes (:bytes row)
   :mtime-ns (:mtime_ns row)
   :mtime-utc (:mtime_utc row)
   :content-sha256 (:content_sha256 row)
   :title (:title row)
   :headings (mapv heading-from-external (:headings row))
   :tags (vec (:tags row))
   :links (mapv link-from-external (:links row))})

(defn index-row->external
  [row]
  {:record (:record row)
   :parser_version (:parser-version row)
   :extracted_at (:extracted-at row)
   :entity_id (:entity-id row)
   :mount_id (:mount-id row)
   :source_rel_path (:source-rel-path row)
   :bytes (:bytes row)
   :mtime_ns (:mtime-ns row)
   :mtime_utc (:mtime-utc row)
   :content_sha256 (:content-sha256 row)
   :title (:title row)
   :headings (mapv heading->external (:headings row))
   :tags (vec (:tags row))
   :links (mapv link->external (:links row))})

(defn backlinks-row-from-external
  [row]
  {:record (:record row)
   :generated-at (:generated_at row)
   :target-key (:target_key row)
   :sources (mapv backlink-source-from-external (:sources row))})

(defn backlinks-row->external
  [row]
  {:record (:record row)
   :generated_at (:generated-at row)
   :target_key (:target-key row)
   :sources (mapv backlink-source->external (:sources row))})

(defn mount-from-js
  [js]
  (mount-from-external (extern/value->clj js)))

(defn mount->js
  [mount]
  (extern/clj->value (mount->external mount)))

(defn mounts-config-from-js
  [js]
  (mounts-config-from-external (extern/value->clj js)))

(defn mounts-config->js
  [config]
  (extern/clj->value (mounts-config->external config)))

(defn heading-from-js
  [js]
  (heading-from-external (extern/value->clj js)))

(defn heading->js
  [heading]
  (extern/clj->value (heading->external heading)))

(defn link-from-js
  [js]
  (link-from-external (extern/value->clj js)))

(defn link->js
  [link]
  (extern/clj->value (link->external link)))

(defn index-row-from-js
  [js]
  (index-row-from-external (extern/value->clj js)))

(defn index-row->js
  [row]
  (extern/clj->value (index-row->external row)))

(defn backlinks-row-from-js
  [js]
  (backlinks-row-from-external (extern/value->clj js)))

(defn backlinks-row->js
  [row]
  (extern/clj->value (backlinks-row->external row)))
