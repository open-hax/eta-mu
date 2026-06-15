(ns eta-mu.docs.infra.mounts
  (:require [clojure.string :as str]
            [eta-mu.docs.extern.fs :as fs]
            [eta-mu.docs.extern.jsonl :as jsonl]
            [eta-mu.docs.law.docs :as law]
            [eta-mu.docs.shape.docs :as shape]
            [eta-mu.runtime.law.core :as core]))

(defn load-eta-mu-mounts
  "Load and validate the eta-mu mounts configuration from `mounts-path`.
   `repo-root` defaults to the current working directory."
  [{:keys [repo-root mounts-path]}]
  (let [root (or (some-> repo-root str str/trim not-empty) (fs/cwd))
        mounts-abs (fs/path-resolve [root (str mounts-path)])
        payload (jsonl/read-json mounts-abs)
        config (shape/mounts-config-from-external payload)]
    (core/validate! law/mounts-config-schema config "EtaMuMountsConfig")
    config))
