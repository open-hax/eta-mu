(ns rheos.backend.infra.github-sync-cli
  "Standalone CLI for projecting Rheos tasks to GitHub Issues."
  (:require [clojure.string :as str]
            [rheos.backend.infra.github-issues :as github]
            [rheos.backend.infra.task-store :as tasks]))

(defn- parse-flags [args]
  (loop [remaining (vec args) flags {}]
    (if (empty? remaining)
      flags
      (let [raw (first remaining)]
        (if (str/starts-with? raw "--")
          (let [key (subs raw 2)
                next-value (second remaining)
                has-value? (and next-value (not (str/starts-with? next-value "--")))]
            (recur (if has-value? (subvec remaining 2) (subvec remaining 1))
                   (assoc flags key (if has-value? next-value "true"))))
          (recur (subvec remaining 1) flags))))))

(defn- bool-flag [flags key default]
  (let [value (get flags key)]
    (if (nil? value)
      default
      (= "true" (str/lower-case value)))))

(defn- int-flag [flags key default]
  (let [value (get flags key)
        parsed (when value (js/parseInt value 10))]
    (if (and parsed (not (js/isNaN parsed))) parsed default)))

(defn- print-plan [repo dry-run result]
  (println (str (if dry-run "Dry-run" "Live") " Rheos GitHub issue sync for " repo))
  (println (str "Operations: " (count (:operations result))))
  (println (str "- Create labels: " (get-in result [:summary :create-labels])))
  (println (str "- Create issues: " (get-in result [:summary :create-issues])))
  (println (str "- Update issues: " (get-in result [:summary :update-issues])))
  (println (str "- Skip closed tasks without issues: " (get-in result [:summary :skipped-closed-tasks])))
  (println (str "- Exclude non-task markdown: " (get-in result [:summary :excluded-tasks])))
  (println (str "- Applied operations: " (count (:applied-operations result))))
  (println (str "- Deferred operations: " (:deferred-operations result)))
  (doseq [operation (:operations result)]
    (case (:type operation)
      :create-label (println (str "  + label " (:name operation)))
      :create-issue (println (str "  + issue " (:title operation)))
      :update-issue (println (str "  ~ issue #" (:issue-number operation) " " (:title operation) " -> " (:state operation)))
      nil)))

(defn ^:async main []
  (try
    (let [flags (parse-flags (drop 2 (js->clj js/process.argv)))
          tasks-dir (get flags "tasks-dir")
          repo (get flags "repo")
          token (or (aget js/process.env "GITHUB_TOKEN") (aget js/process.env "GH_TOKEN"))
          dry-run (bool-flag flags "dry-run" false)]
      (when (str/blank? tasks-dir)
        (throw (js/Error. "Missing --tasks-dir.")))
      (when (str/blank? repo)
        (throw (js/Error. "Missing --repo owner/name.")))
      (let [all-tasks (await (tasks/load-tasks tasks-dir))
            result (await (github/sync!
                           all-tasks
                           {:token token
                            :repo repo
                            :dry-run dry-run
                            :cwd (or (get flags "cwd") (js/process.cwd))
                            :close-done (bool-flag flags "close-done" true)
                            :close-rejected (bool-flag flags "close-rejected" true)
                            :manage-labels (bool-flag flags "manage-labels" true)
                            :write-delay-ms (int-flag flags "write-delay-ms" 1000)
                            :max-writes (int-flag flags "max-writes" 50)}))]
        (print-plan repo dry-run result)))
    (catch :default err
      (js/console.error (or (.-stack err) (.-message err) (str err)))
      (set! (.-exitCode js/process) 1))))
