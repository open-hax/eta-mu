(ns rheos.backend.infra.store
  "Minimal IStore driver protocol for kanban persistence.

   This is a local, lightweight abstraction inspired by the sol-extraction
   IStore idea. EdnStore is the only production-ready driver today; the
   protocol shape leaves room for a MongoStore later without changing callers.

   Full migration of task/config loading to use IStore is intentionally
   descoped: markdown task files and JSON board configs are loaded directly
   because their shapes are stable and the extra driver layer would not pay
   for itself at the current scale. Views are small, keyed documents, so they
   are a natural fit for the protocol."
  (:require ["node:fs/promises" :as fsp]
            ["node:path" :as path]
            [cljs.reader :as reader]))

(defprotocol IStore
  "Keyed document store. All operations return Promises."
  (-get [this key] "Return the document stored under key, or nil.")
  (-put! [this key doc] "Persist doc under key. Returns doc.")
  (-keys [this] "Return all stored keys."))

(defn- ensure-parent-dir [file-path]
  (let [parent (path/dirname file-path)]
    (.mkdir fsp parent #js {:recursive true})))

(defn- ^:async write-doc! [file-path data-atom key doc]
  (try
    (swap! data-atom assoc key doc)
    (let [content (pr-str @data-atom)]
      (await (ensure-parent-dir file-path))
      (await (.writeFile fsp file-path content "utf8"))
      doc)
    (catch :default err
      (js/console.error "EdnStore put error:" err)
      doc)))

(defrecord EdnStore [file-path data-atom]
  IStore
  (-get [_ key]
    (js/Promise.resolve (get @data-atom key)))

  (-put! [_ key doc]
    (write-doc! file-path data-atom key doc))

  (-keys [_]
    (js/Promise.resolve (vec (keys @data-atom)))))

(defn ^:async load-edn-store [file-path]
  (let [exists? (try (await (.access fsp file-path)) true (catch :default _ false))
        data (if exists?
               (try
                 (let [raw (await (.readFile fsp file-path "utf8"))]
                   (reader/read-string raw))
                 (catch :default err
                   (js/console.error "Failed to read EdnStore:" file-path (.-message err))
                   {}))
               {})]
    (->EdnStore file-path (atom data))))
