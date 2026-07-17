(ns eta-mu.infra.cli.commands.receipt
  "Receipt River CLI command.

  Provides status, tail, validate, and append operations on a repo's
  receipts.edn file."
  (:require [clojure.string :as str]
            [eta-mu.domain.receipt :as receipt]
            [eta-mu.extern.fs :as fs]
            [eta-mu.extern.git :as git]
            [eta-mu.extern.path :as path]
            [eta-mu.extern.process :as process]))

(def ^:const DEFAULT-TAIL 20)
(def ^:const DEFAULT-VALIDATE 200)
(def ^:const MAX-LINES 2000)

(defn- clamp-lines [value fallback]
  (let [n (js/Number value)]
    (if (js/Number.isFinite n)
      (js/Math.max 1 (js/Math.min MAX-LINES (js/Math.trunc n)))
      fallback)))

(defn- ^:async resolve-repo
  "Return the git root of the current directory, or the current directory if not in a repo."
  []
  (or (await (git/root)) (process/cwd)))

(defn- file-path [repo-root]
  (path/join repo-root "receipts.edn"))

(defn ^:async status [_args]
  (let [repo-root (await (resolve-repo))
        file (file-path repo-root)
        exists (fs/file-exists? file)
        lines (if exists (receipt/read-lines file) [])
        last-line (last lines)]
    (println (str "repo: " repo-root))
    (println (str "file: " file))
    (println (str "exists: " (if exists "yes" "no")))
    (println (str "count: " (count lines)))
    (when last-line (println (str "last: " last-line)))
    (process/exit! 0)))

(defn ^:async tail [args]
  (let [repo-root (await (resolve-repo))
        file (file-path repo-root)
        n (clamp-lines (first args) DEFAULT-TAIL)]
    (if (fs/file-exists? file)
      (do (doseq [line (receipt/tail-lines file n)]
            (println line))
          (process/exit! 0))
      (do (println "No receipts yet.")
          (process/exit! 0)))))

(defn ^:async validate [args]
  (let [repo-root (await (resolve-repo))
        file (file-path repo-root)
        n (clamp-lines (first args) DEFAULT-VALIDATE)
        result (receipt/validate-file file n)]
    (if (:ok result)
      (do (println (str "receipts valid: " (:count result) " event" (when (not= 1 (:count result)) "s")))
          (process/exit! 0))
      (do (println (str "receipts invalid: " (count (:failures result)) " failure" (when (not= 1 (count (:failures result))) "s")))
          (doseq [failure (:failures result)]
            (println (str "  line " (:line-number failure) ": " (str/join "; " (:errors failure)))))
          (process/exit! 1)))))

(defn ^:async append [args]
  (let [repo-root (await (resolve-repo))
        file (file-path repo-root)
        kind (first args)
        note (str/join " " (rest args))]
    (when (str/blank? kind)
      (js/console.error "Usage: eta-mu git receipt append <kind> <note>")
      (process/exit! 1))
    (fs/mkdir (path/dirname file))
    (let [record (receipt/build-record {:kind kind :note note} repo-root :observation)
          line (receipt/format-line record)]
      (fs/append-file file (str line "\n"))
      (println (str "Appended receipt at " file))
      (println line)
      (process/exit! 0))))

(defn ^:async handle
  "Dispatch a receipt sub-command."
  [{:keys [args]}]
  (let [cmd (str/lower-case (or (first args) "status"))
        rest (rest args)]
    (cond
      (= cmd "status") (await (status rest))
      (= cmd "tail") (await (tail rest))
      (= cmd "validate") (await (validate rest))
      (= cmd "append") (await (append rest))
      :else
      (do (js/console.error (str "Unknown receipt sub-command: " cmd))
          (js/console.error "Usage: eta-mu git receipt {status|tail|validate|append}")
          (process/exit! 1)))))
