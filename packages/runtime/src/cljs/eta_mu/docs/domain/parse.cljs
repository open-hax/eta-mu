(ns eta-mu.docs.domain.parse
  (:require [eta-mu.docs.domain.frontmatter :as fm]
            [eta-mu.docs.domain.markdown :as md]
            [eta-mu.docs.law.docs :as law]
            [eta-mu.runtime.law.core :as core]))

(defn- distinct-ordered
  "Remove duplicate values from `coll` while preserving first-occurrence order."
  [coll]
  (let [seen (atom #{})]
    (vec
     (for [x coll
           :when (seq x)
           :when (not (contains? @seen x))]
       (do (swap! seen conj x)
           x)))))

(defn- heading->record
  [heading]
  (let [record {:level (:level heading) :title (:title heading)}]
    (core/validate! law/heading-schema record "EtaMuHeading")
    record))

(defn- wikilink->link
  [body-no-code wikilink]
  (let [record {:kind :wikilink
                :target (:target wikilink)
                :target-key (md/normalize-wikilink-key (:target wikilink))
                :alias (:alias wikilink)
                :line (md/line-number-at body-no-code (:index wikilink))}]
    (core/validate! law/wikilink-schema record "EtaMuWikilink")
    record))

(defn- markdown-link->link
  [body-no-code md-link]
  (let [record {:kind :markdown
                :url (:url md-link)
                :text (:text md-link)
                :line (md/line-number-at body-no-code (:index md-link))}]
    (core/validate! law/markdown-link-schema record "EtaMuMarkdownLink")
    record))

(defn parse-eta-mu-markdown
  "Parse an eta-mu markdown document.
   Accepts a map with `:rel-path` and `:text`.
   Returns a map with `:uuid`, `:title`, `:headings`, `:tags`, and `:links`
   matching the shape produced by the legacy Node implementation."
  [{:keys [rel-path text]}]
  (let [source-rel (str rel-path)
        raw (str text)
        {:keys [frontmatter body]} (fm/parse-frontmatter raw)
        body-no-code (md/strip-fenced-code-blocks body)
        headings (mapv heading->record (md/extract-headings body-no-code))
        title (or (->> headings
                         (filter #(= 1 (:level %)))
                         first
                         :title)
                  (md/basename source-rel))
        uuid (fm/parse-frontmatter-scalar frontmatter "uuid")
        frontmatter-tags (mapv md/normalize-tag (fm/parse-frontmatter-tags frontmatter))
        inline-tags (md/extract-inline-tags body-no-code)
        hashtag-tags (md/extract-hashtags-lines raw)
        tags (distinct-ordered (concat frontmatter-tags inline-tags hashtag-tags))
        wikilinks (md/extract-wikilinks body-no-code)
        md-links (md/extract-markdown-links body-no-code)
        links (vec (concat (mapv #(wikilink->link body-no-code %) wikilinks)
                           (mapv #(markdown-link->link body-no-code %) md-links)))]
    {:uuid uuid
     :title title
     :headings headings
     :tags tags
     :links links}))
