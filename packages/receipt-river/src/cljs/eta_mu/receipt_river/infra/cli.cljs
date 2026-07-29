(ns eta-mu.receipt-river.infra.cli
  "Receipt River command implementation owned by @eta-mu/receipt-river."
  (:require [clojure.string :as str]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]
            [eta-mu.receipt-river.api :as api]
            [eta-mu.receipt-river.archaeology.provider :as provider]
            [eta-mu.receipt-river.domain.discovery :as discovery]
            [eta-mu.receipt-river.domain.event :as event]
            [eta-mu.receipt-river.domain.receipt :as receipt]
            [eta-mu.receipt-river.generated.registry :as registry]
            [eta-mu.receipt-river.infra.local-git-provider :as local-git]
            [eta-mu.receipt-river.extern.git :as git]
            [eta-mu.receipt-river.shape.edn :as edn]))

(def ^:private default-tail 20)
(def ^:private default-validate 200)
(def ^:private max-lines 2000)

(defn- exit! [code]
  (.exit js/process code))

(defn- clamp-lines [value fallback]
  (let [number (js/Number value)]
    (if (js/Number.isFinite number)
      (js/Math.max 1 (js/Math.min max-lines (js/Math.trunc number)))
      fallback)))

(defn- expand-home [value]
  (cond
    (= value "~") (.homedir os)
    (str/starts-with? value "~/") (path/join (.homedir os) (subs value 2))
    :else value))

(defn- absolute-path [value]
  (path/resolve (expand-home value)))

(defn- ^:async resolve-repo []
  (let [{:keys [exit stdout]} (await (git/exec-at (.cwd js/process)
                                                  ["rev-parse" "--show-toplevel"]))]
    (if (zero? exit) stdout (.cwd js/process))))

(defn- receipt-file [repo-root]
  (path/join repo-root "receipts.edn"))

(defn- read-lines [file]
  (if-not (.existsSync fs file)
    []
    (->> (str/split-lines (.readFileSync fs file "utf8"))
         (filterv seq))))

(defn- tail-lines [file n]
  (let [lines (read-lines file)]
    (subvec lines (max 0 (- (count lines) n)))))

(defn- validate-file [file n]
  (if-not (.existsSync fs file)
    {:ok false
     :file file
     :count 0
     :failures [{:line-number 0 :errors ["file does not exist"]}]
     :last nil}
    (let [rows (map-indexed #(api/validate-line %2 (inc %1))
                            (tail-lines file n))
          failures (remove :ok rows)]
      {:ok (empty? failures)
       :file file
       :count (count rows)
       :failures (vec failures)
       :last (last rows)})))

(defn- schema-summary []
  {:package/name registry/package-name
   :package/version registry/package-version
   :schemas registry/schema-documents
   :current registry/current-versions})

(defn- parse-discovery-args
  "Parse repeated roots/exclusions without collapsing them into a flag map."
  [tokens]
  (loop [remaining (vec tokens)
         result {:roots [] :exclude [] :output nil}]
    (if (empty? remaining)
      result
      (let [token (first remaining)
            next-token (second remaining)]
        (cond
          (= token "--root")
          (recur (subvec remaining 2) (update result :roots conj next-token))

          (str/starts-with? token "--root=")
          (recur (subvec remaining 1) (update result :roots conj (subs token 7)))

          (= token "--exclude")
          (recur (subvec remaining 2) (update result :exclude conj next-token))

          (str/starts-with? token "--exclude=")
          (recur (subvec remaining 1) (update result :exclude conj (subs token 10)))

          (= token "--output")
          (recur (subvec remaining 2) (assoc result :output next-token))

          (str/starts-with? token "--output=")
          (recur (subvec remaining 1) (assoc result :output (subs token 9)))

          :else
          (throw (js/Error. (str "Unknown discovery argument: " token))))))))

(defn- normalized-exclusion [value]
  (if (or (= value "~")
          (str/starts-with? value "~/")
          (path/isAbsolute value))
    (absolute-path value)
    value))

(defn- read-previous-inventory [output-path]
  (when (.existsSync fs output-path)
    (try
      (edn/parse-line (.readFileSync fs output-path "utf8"))
      (catch :default _ nil))))

(defn- ^:async discover! [tokens]
  (let [{:keys [roots exclude output]} (parse-discovery-args tokens)
        roots (mapv absolute-path (if (seq roots) roots [(str (.homedir os))]))
        exclusions (mapv normalized-exclusion exclude)
        output-path (when output (absolute-path output))
        previous (when output-path (read-previous-inventory output-path))
        discovered (await (provider/discover-repositories
                           (local-git/local-git-provider)
                           roots
                           {:exclude exclusions}))
        result (if previous
                 (discovery/observe-moves previous discovered)
                 discovered)
        rendered (str (pr-str result) "\n")]
    (if output
      (do
        (.mkdirSync fs (path/dirname output-path) #js {:recursive true})
        (.writeFileSync fs output-path rendered "utf8")
        (println (str "Wrote repository inventory to " output-path))
        (println (str "repositories: " (count (:repositories result))))
        (println (str "observations: " (count (:observations result)))))
      (print rendered))
    (exit! 0)))

(defn- ^:async status! []
  (let [repo-root (await (resolve-repo))
        file (receipt-file repo-root)
        lines (read-lines file)]
    (println (str "repo: " repo-root))
    (println (str "file: " file))
    (println (str "exists: " (if (.existsSync fs file) "yes" "no")))
    (println (str "count: " (count lines)))
    (when-let [last-line (last lines)]
      (println (str "last: " last-line)))
    (exit! 0)))

(defn- ^:async tail! [args]
  (let [repo-root (await (resolve-repo))
        file (receipt-file repo-root)
        n (clamp-lines (first args) default-tail)]
    (if (.existsSync fs file)
      (doseq [line (tail-lines file n)] (println line))
      (println "No receipts yet."))
    (exit! 0)))

(defn- ^:async validate! [args]
  (let [repo-root (await (resolve-repo))
        result (validate-file (receipt-file repo-root)
                              (clamp-lines (first args) default-validate))]
    (if (:ok result)
      (do
        (println (str "receipts valid: " (:count result) " event"
                      (when (not= 1 (:count result)) "s")))
        (exit! 0))
      (do
        (println (str "receipts invalid: " (count (:failures result)) " failure"
                      (when (not= 1 (count (:failures result))) "s")))
        (doseq [failure (:failures result)]
          (println (str "  line " (:line-number failure) ": "
                        (str/join "; " (:errors failure)))))
        (exit! 1)))))

(defn- ^:async append! [component-manifest args]
  (let [repo-root (await (resolve-repo))
        kind (first args)
        note (str/join " " (rest args))]
    (when (str/blank? kind)
      (js/console.error "Usage: eta-mu receipt append <kind> <note>")
      (exit! 1))
    (let [recorded-at (js/Date.)
          payload (receipt/build-payload {:kind kind :note note}
                                         repo-root
                                         (.toISOString recorded-at)
                                         :observation)
          envelope (event/build-event
                    {:event-id (random-uuid)
                     :recorded-at recorded-at
                     :component-manifest component-manifest
                     :command "eta-mu receipt append"
                     :producer {}
                     :subject {:repository/path repo-root}}
                    payload)
          file (receipt-file repo-root)
          line (edn/format-line envelope)]
      (.mkdirSync fs (path/dirname file) #js {:recursive true})
      (.appendFileSync fs file (str line "\n") "utf8")
      (println (str "Appended receipt at " file))
      (println line)
      (exit! 0))))

(defn ^:async handle
  [{:keys [args raw-args component-manifest]}]
  (let [command (str/lower-case (or (first args) "status"))
        remaining (vec (rest args))]
    (case command
      "status" (await (status!))
      "tail" (await (tail! remaining))
      "validate" (await (validate! remaining))
      "append" (await (append! component-manifest remaining))
      "schemas" (do (println (pr-str (schema-summary))) (exit! 0))
      "audit" (if (= "discover" (first remaining))
                (await (discover! (drop 2 raw-args)))
                (do
                  (js/console.error "Usage: eta-mu receipt audit discover [--root PATH] [--exclude GLOB] [--output FILE]")
                  (exit! 1)))
      (do
        (js/console.error (str "Unknown receipt sub-command: " command))
        (js/console.error "Usage: eta-mu receipt {status|tail|validate|append|schemas|audit discover}")
        (exit! 1)))))
