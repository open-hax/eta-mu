(ns rheos.backend.law.markdown-document
  (:require [malli.core :as m]))

(def MarkdownDocument
  [:map {:closed false}
   [:document/format [:= :markdown]]
   [:document/source-path {:optional true} :string]
   [:document/frontmatter-present? :boolean]
   [:document/frontmatter/raw [:maybe :string]]
   [:document/frontmatter/data :map]
   [:document/body :string]])

(defn valid? [document]
  (m/validate MarkdownDocument document))
