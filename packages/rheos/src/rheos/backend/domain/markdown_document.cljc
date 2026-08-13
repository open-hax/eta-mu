(ns rheos.backend.domain.markdown-document
  (:require [clojure.string :as str]
            [rheos.backend.domain.frontmatter :as frontmatter]))

(defn- split-delimited [raw opening closing]
  (when (str/starts-with? raw opening)
    (let [start (count opening)
          end (str/index-of raw closing start)]
      (when (some? end)
        [(subs raw start end)
         (subs raw (+ end (count closing)))]))))

(defn parse [raw]
  (if-let [[frontmatter-raw body]
           (or (split-delimited raw "---\n" "\n---\n")
               (split-delimited raw "---\r\n" "\r\n---\r\n"))]
    {:document/format :markdown
     :document/frontmatter-present? true
     :document/frontmatter/raw frontmatter-raw
     :document/frontmatter/data (frontmatter/parse-flat frontmatter-raw)
     :document/body body}
    {:document/format :markdown
     :document/frontmatter-present? false
     :document/frontmatter/raw nil
     :document/frontmatter/data {}
     :document/body raw}))
