(ns eta-mu.coding.extern.git
  (:require [eta-mu.coding.extern.process-exec :as proc]))

(defn- run-git
  ([args] (run-git nil args {}))
  ([cwd args opts]
   (proc/execute-command (merge {:command "git" :args args :cwd cwd} opts))))

(defn git-status
  ([cwd] (git-status cwd {}))
  ([cwd opts] (run-git cwd ["status" "--porcelain=v1"] opts)))

(defn git-diff
  ([cwd] (git-diff cwd {}))
  ([cwd opts] (run-git cwd ["diff"] opts)))

(defn git-log
  ([cwd] (git-log cwd {}))
  ([cwd opts] (run-git cwd ["log" "--oneline"] opts)))

(defn git-branch
  ([cwd] (git-branch cwd {}))
  ([cwd opts] (run-git cwd ["branch"] opts)))

(defn git-checkout
  ([cwd branch] (git-checkout cwd branch {}))
  ([cwd branch opts] (run-git cwd ["checkout" branch] opts)))

(defn git-commit
  ([cwd message] (git-commit cwd message {}))
  ([cwd message opts] (run-git cwd ["commit" "-m" message] opts)))

(defn git-push
  ([cwd] (git-push cwd {}))
  ([cwd opts] (run-git cwd ["push"] opts)))

(defn git-pull
  ([cwd] (git-pull cwd {}))
  ([cwd opts] (run-git cwd ["pull"] opts)))

(defn git-clone
  ([repo-url dest] (git-clone repo-url dest {}))
  ([repo-url dest opts] (run-git nil ["clone" repo-url dest] opts)))

(defn git-rev-parse
  ([cwd arg] (git-rev-parse cwd arg {}))
  ([cwd arg opts] (run-git cwd ["rev-parse" arg] opts)))
