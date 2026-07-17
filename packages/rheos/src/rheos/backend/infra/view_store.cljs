(ns rheos.backend.infra.view-store
  "Saved compose views: named query presets persisted via IStore."
  (:require ["node:path" :as path]
            [rheos.backend.infra.store :as store]))

(def default-views-file ".kanban/views.edn")

(defn- views-file-path [config-dir]
  (path/join (or config-dir (js/process.cwd)) default-views-file))

(defn ^:async load-view-store
  "Create an EdnStore-backed view store. Uses config-dir from loaded config if
   available, otherwise the current working directory."
  [config-dir]
  (store/load-edn-store (views-file-path config-dir)))

(defn ^:async save-view! [view-store name query-flags]
  (let [storable (dissoc query-flags "save" "preset")]
    (await (store/-put! view-store name storable))
    {:name name :query storable}))

(defn ^:async load-view [view-store name]
  (await (store/-get view-store name)))

(defn ^:async list-views [view-store]
  (await (store/-keys view-store)))

(defn merge-preset
  "Preset flags provide defaults; explicit CLI flags override."
  [flags preset-flags]
  (merge preset-flags (into {} (filter (comp some? val) flags))))
