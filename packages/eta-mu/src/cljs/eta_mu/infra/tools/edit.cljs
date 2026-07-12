(ns eta-mu.infra.tools.edit
  "The `edit` agent tool: exact-string replacement with a uniqueness check."
  (:require [eta-mu.domain.tools.edit :as domain.edit]
            [eta-mu.extern.fs :as fs]
            [eta-mu.extern.path :as path]
            [eta-mu.extern.process :as process]
            [eta-mu.law.tools :as law]))

(defn- ^:async execute [_id args _signal _on-update]
  (let [raw-path (:path args)
        old-text (:old_text args)
        new-text (:new_text args)]
    (when-not (and (string? raw-path) (string? old-text) (string? new-text))
      (throw (js/Error. "edit: path, old_text, and new_text are required")))
    (let [abs-path (path/resolve-path (process/cwd) raw-path)]
      (when-not (fs/file-exists? abs-path)
        (throw (js/Error. (str "File not found: " raw-path))))
      (let [content (await (fs/read-file-async abs-path))
            result (domain.edit/apply-edit content old-text new-text)]
        (case (:error result)
          :not-found (throw (js/Error. (str "old_text not found in " raw-path)))
          :not-unique (throw (js/Error. (str "old_text is not unique in " raw-path " ("
                                             (:count result) " matches); include more context")))
          :no-op (throw (js/Error. "old_text and new_text are identical; nothing to change"))
          (do
            (await (fs/write-file-async abs-path (:content result)))
            {:content [{:type :text :text (str "Edited " raw-path)}]
             :details {}}))))))

(def tool
  {:name "edit"
   :label "edit"
   :description "Replace an exact, unique block of text in a file. old_text must match exactly once in the file."
   :parameters law/edit-parameters
   :execute execute})
