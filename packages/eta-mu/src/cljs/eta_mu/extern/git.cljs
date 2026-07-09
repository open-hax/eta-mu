(ns eta-mu.extern.git
  "Git boundary. All direct git subprocess calls are isolated here."
  (:require [clojure.string :as str]
            [eta-mu.extern.child-process :as cp]))

(defn ^:async root
  "Return the git toplevel of the current working directory, or nil if not in a repo."
  []
  (let [{:keys [exit stdout]} (await (cp/exec-capture "git" ["rev-parse" "--show-toplevel"]))]
    (when (zero? exit)
      (str/trim stdout))))

(defn ^:async status
  "Return git status as a short string, or nil if not in a repo."
  []
  (let [{:keys [exit stdout stderr]} (await (cp/exec-capture "git" ["status" "--short"]))]
    (if (zero? exit)
      stdout
      (throw (js/Error. (str "git status failed: " stderr))))))

(defn ^:async status-porcelain
  "Return the parsed porcelain status as a sequence of maps.
  Each map has :status (two-letter status) and :path (relative path)."
  []
  (let [{:keys [exit stdout stderr]} (await (cp/exec-capture "git" ["status" "--porcelain=v1"]))]
    (if (zero? exit)
      (->> (str/split-lines stdout)
           (map (fn [line]
                  (let [status (subs line 0 2)
                        path (str/trim (subs line 3))]
                    {:status status :path path}))))
      (throw (js/Error. (str "git status failed: " stderr))))))

(defn ^:async branch
  "Return the current branch name."
  []
  (let [{:keys [exit stdout stderr]} (await (cp/exec-capture "git" ["rev-parse" "--abbrev-ref" "HEAD"]))]
    (if (zero? exit)
      (str/trim stdout)
      (throw (js/Error. (str "git branch failed: " stderr))))))

(defn ^:async commit-sha
  "Return the current HEAD SHA."
  []
  (let [{:keys [exit stdout stderr]} (await (cp/exec-capture "git" ["rev-parse" "HEAD"]))]
    (if (zero? exit)
      (str/trim stdout)
      (throw (js/Error. (str "git rev-parse failed: " stderr))))))

(defn ^:async add
  "Stage the given paths."
  [paths]
  (when (seq paths)
    (let [{:keys [exit stderr]} (await (cp/exec-capture "git" (into ["add" "--"] paths)))]
      (when-not (zero? exit)
        (throw (js/Error. (str "git add failed: " stderr)))))))

(defn ^:async commit
  "Create a commit with the given message and paths."
  [message paths]
  (await (add paths))
  (let [{:keys [exit stderr]} (await (cp/exec-capture "git" ["commit" "-m" message]))]
    (when-not (zero? exit)
      (throw (js/Error. (str "git commit failed: " stderr))))))

(defn ^:async tag
  "Create an annotated tag at HEAD."
  [tag-name message]
  (let [{:keys [exit stderr]} (await (cp/exec-capture "git" ["tag" "-a" tag-name "-m" message]))]
    (when-not (zero? exit)
      (throw (js/Error. (str "git tag failed: " stderr))))))

(defn ^:async push
  "Push the current branch and the given tags to origin."
  [tag-names]
  (let [{:keys [exit stderr]} (await (cp/exec-capture "git" ["push"]))]
    (when-not (zero? exit)
      (throw (js/Error. (str "git push failed: " stderr)))))
  (doseq [tag-name tag-names]
    (let [{:keys [exit stderr]} (await (cp/exec-capture "git" ["push" "origin" tag-name]))]
      (when-not (zero? exit)
        (throw (js/Error. (str "git push tag failed: " stderr)))))))

(defn ^:async remote-url
  "Return the origin URL, or nil if no origin is configured."
  []
  (let [{:keys [exit stdout]} (await (cp/exec-capture "git" ["remote" "get-url" "origin"]))]
    (when (zero? exit)
      (str/trim stdout))))
