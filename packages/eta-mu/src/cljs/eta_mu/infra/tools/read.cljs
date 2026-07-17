(ns eta-mu.infra.tools.read
  "The `read` agent tool: reads a text file with offset/limit truncation."
  (:require [eta-mu.domain.tools.read :as domain.read]
            [eta-mu.domain.tools.truncate :as truncate]
            [eta-mu.extern.fs :as fs]
            [eta-mu.extern.path :as path]
            [eta-mu.extern.process :as process]
            [eta-mu.law.tools :as law]))

(defn- ^:async execute [_id args _signal _on-update]
  (let [raw-path (:path args)]
    (when-not (string? raw-path)
      (throw (js/Error. "read: path is required")))
    (let [abs-path (path/resolve-path (process/cwd) raw-path)]
      (when-not (fs/file-exists? abs-path)
        (throw (js/Error. (str "File not found: " raw-path))))
      (let [content (await (fs/read-file-async abs-path))
            {:keys [text truncation out-of-bounds? start-line total-lines]}
            (domain.read/select-content content (:offset args) (:limit args))]
        (if out-of-bounds?
          (throw (js/Error. (str "Offset " (:offset args) " is beyond end of file ("
                                 total-lines " lines total)")))
          {:content [{:type :text :text text}]
           :details {:truncated (:truncated truncation)
                     :start-line start-line
                     :total-lines total-lines}})))))

(def tool
  {:name "read"
   :label "read"
   :description (str "Read the contents of a text file. Output is truncated to "
                     truncate/default-max-lines " lines or "
                     (truncate/format-size truncate/default-max-bytes)
                     " (whichever is hit first). Use offset/limit for large files.")
   :parameters law/read-parameters
   :execute execute})
