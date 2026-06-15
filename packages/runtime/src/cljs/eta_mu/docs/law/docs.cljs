(ns eta-mu.docs.law.docs)

(def mount-schema
  [:map
   [:id [:string {:min 1}]]
   [:root [:string {:min 1}]]
   [:include {:optional true} [:vector [:string {:min 1}]]]
   [:exclude {:optional true} [:vector [:string {:min 1}]]]])

(def mounts-config-schema
  [:map
   [:record {:optional true} [:string {:min 1}]]
   [:version {:optional true} [:or [:string {:min 1}] number?]]
   [:generated-at {:optional true} [:string {:min 1}]]
   [:mounts [:vector mount-schema]]])

(def heading-schema
  [:map
   [:level [:and int? [:>= 1] [:<= 6]]]
   [:title [:string {:min 1}]]])

(def wikilink-schema
  [:map
   [:kind [:enum :wikilink]]
   [:target [:string {:min 1}]]
   [:target-key [:string {:min 1}]]
   [:alias [:string]]
   [:line [:and int? [:>= 1]]]])

(def markdown-link-schema
  [:map
   [:kind [:enum :markdown]]
   [:url [:string {:min 1}]]
   [:text [:string]]
   [:line [:and int? [:>= 1]]]])

(def link-schema
  [:multi {:dispatch :kind}
   [:wikilink wikilink-schema]
   [:markdown markdown-link-schema]])

(def docs-index-row-schema
  [:map
   [:record [:enum "ημ.docs-index.v1"]]
   [:parser-version [:string {:min 1}]]
   [:extracted-at [:string {:min 1}]]
   [:entity-id [:string {:min 1}]]
   [:mount-id [:string {:min 1}]]
   [:source-rel-path [:string {:min 1}]]
   [:bytes [:and int? [:>= 0]]]
   [:mtime-ns [:and int? [:>= 0]]]
   [:mtime-utc [:string {:min 1}]]
   [:content-sha256 [:string {:min 1}]]
   [:title [:string]]
   [:headings [:vector heading-schema]]
   [:tags [:vector [:string]]]
   [:links [:vector link-schema]]])

(def backlink-source-schema
  [:map
   [:kind [:enum :wikilink]]
   [:src-entity-id [:string {:min 1}]]
   [:src-rel-path [:string {:min 1}]]
   [:target [:string {:min 1}]]
   [:target-key [:string {:min 1}]]
   [:line [:and int? [:>= 1]]]])

(def docs-backlinks-row-schema
  [:map
   [:record [:enum "ημ.docs-backlinks.v1"]]
   [:generated-at [:string {:min 1}]]
   [:target-key [:string {:min 1}]]
   [:sources [:vector backlink-source-schema]]])
