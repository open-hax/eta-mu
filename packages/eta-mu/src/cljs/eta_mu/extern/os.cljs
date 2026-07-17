(ns eta-mu.extern.os
  "Node os boundary. All direct access to `node:os` is isolated here."
  (:require ["node:os" :as os]
            [eta-mu.extern.process :as process]))

(defn homedir
  "Return the user's home directory, preferring the HOME environment variable."
  []
  (or (process/env "HOME") (.homedir os)))
