(ns eta-mu.infra.tools.write
  "The `write` agent tool: creates or overwrites a file, making parent
  directories as needed."
  (:require [eta-mu.extern.fs :as fs]
            [eta-mu.extern.path :as path]
            [eta-mu.extern.process :as process]
            [eta-mu.law.tools :as law]))

(defn- ^:async execute [_id args _signal _on-update]
  (let [raw-path (:path args)
        content (:content args)]
    (when-not (and (string? raw-path) (string? content))
      (throw (js/Error. "write: path and content are required")))
    (let [abs-path (path/resolve-path (process/cwd) raw-path)
          dir (path/dirname abs-path)]
      (await (fs/mkdir-async dir))
      (await (fs/write-file-async abs-path content))
      {:content [{:type :text :text (str "Wrote " (count content) " bytes to " raw-path)}]
       :details {}})))

(def tool
  {:name "write"
   :label "write"
   :description "Write content to a file. Creates the file if it doesn't exist, overwrites if it does. Automatically creates parent directories."
   :parameters law/write-parameters
   :execute execute})
