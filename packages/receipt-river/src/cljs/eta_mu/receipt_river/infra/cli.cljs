(ns eta-mu.receipt-river.infra.cli
  "Receipt River command implementation owned by @eta-mu/receipt-river."
  (:require [clojure.string :as str]
            [eta-mu.receipt-river.api :as api]
            [eta-mu.receipt-river.archaeology.provider :as provider]
            [eta-mu.receipt-river.domain.discovery :as discovery]
            [eta-mu.receipt-river.domain.event :as event]
            [eta-mu.receipt-river.domain.receipt :as receipt]
            [eta-mu.receipt-river.extern.bus :as bus]
            [eta-mu.receipt-river.extern.fs :as fs]
            [eta-mu.receipt-river.generated.registry :as registry]
            [eta-mu.receipt-river.extern.runtime :as runtime]
            [eta-mu.receipt-river.infra.local-git-provider :as local-git]
            [eta-mu.receipt-river.extern.git :as git]
            [eta-mu.receipt-river.shape.edn :as edn]))

(def ^:private default-tail 20)
(def ^:private default-validate 200)
(def ^:private max-lines 2000)
(def ^:private discovery-usage
  "Usage: eta-mu receipt audit discover [--root PATH] [--exclude GLOB] [--output FILE]")

(defn- exit! [code]
  (runtime/exit! code))

(defn- clamp-lines [value fallback]
  (let [number (when (some? value) (parse-long value))]
    (if (some? number)
      (max 1 (min max-lines number))
      fallback)))

(defn- expand-home [value]
  (cond
    (= value "~") (runtime/home-directory)
    (str/starts-with? value "~/") (fs/join (runtime/home-directory) (subs value 2))
    :else value))

(defn- absolute-path [value]
  (fs/resolve-path (expand-home value)))

(defn- ^:async resolve-repo []
  (let [{:keys [exit stdout]} (await (git/exec-at (runtime/current-directory)
                                                  ["rev-parse" "--show-toplevel"]))]
    (if (zero? exit) stdout (runtime/current-directory))))

(defn- receipt-file [repo-root]
  (fs/join repo-root "receipts.edn"))

(defn- read-lines [file]
  (if-not (fs/path-exists? file)
    []
    (->> (str/split-lines (fs/read-text file))
         (filterv seq))))

(defn- tail-lines [file n]
  (let [lines (read-lines file)]
    (subvec lines (max 0 (- (count lines) n)))))

(defn- validate-file [file n]
  (if-not (fs/path-exists? file)
    {:ok false
     :file file
     :count 0
     :failures [{:line-number 0 :errors ["file does not exist"]}]
     :last nil}
    (let [all-lines (read-lines file)
          tail (subvec all-lines (max 0 (- (count all-lines) n)))
          offset (- (count all-lines) (count tail))
          rows (map-indexed #(api/validate-line %2 (+ offset (inc %1)))
                            tail)
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
          (if (nil? next-token)
            (throw (ex-info "Invalid discovery argument: --root requires a value"
                            {:argument token}))
            (recur (subvec remaining 2) (update result :roots conj next-token)))

          (str/starts-with? token "--root=")
          (recur (subvec remaining 1) (update result :roots conj (subs token 7)))

          (= token "--exclude")
          (if (nil? next-token)
            (throw (ex-info "Invalid discovery argument: --exclude requires a value"
                            {:argument token}))
            (recur (subvec remaining 2) (update result :exclude conj next-token)))

          (str/starts-with? token "--exclude=")
          (recur (subvec remaining 1) (update result :exclude conj (subs token 10)))

          (= token "--output")
          (if (nil? next-token)
            (throw (ex-info "Invalid discovery argument: --output requires a value"
                            {:argument token}))
            (recur (subvec remaining 2) (assoc result :output next-token)))

          (str/starts-with? token "--output=")
          (recur (subvec remaining 1) (assoc result :output (subs token 9)))

          :else
          (throw (ex-info (str "Unknown discovery argument: " token)
                          {:argument token})))))))

(defn- normalized-exclusion [value]
  (if (or (= value "~")
          (str/starts-with? value "~/")
          (fs/absolute? value))
    (absolute-path value)
    value))

(defn- read-previous-inventory [output-path]
  (when (fs/path-exists? output-path)
    (try
      (edn/parse-line (fs/read-text output-path))
      (catch :default error
        (bus/emit-error! :receipt-river/invalid-previous-inventory
                         {:path output-path
                          :exception/name "Error"
                          :exception/message (ex-message error)})
        nil))))

(defn- ^:async discover! [tokens]
  (let [{:keys [roots exclude output]} (parse-discovery-args tokens)
        roots (mapv absolute-path
                    (if (seq roots) roots [(runtime/current-directory)]))
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
        (fs/make-directories! (fs/dirname output-path))
        (fs/write-text! output-path rendered)
        (println (str "Wrote repository inventory to " output-path))
        (println (str "repositories: " (count (:repositories result))))
        (println (str "observations: " (count (:observations result)))))
      (print rendered))
    (exit! 0)))

(defn- ^:async run-discovery! [tokens]
  (try
    (await (discover! tokens))
    (catch :default error
      (runtime/error! (ex-message error))
      (runtime/error! discovery-usage)
      (exit! 1))))

(defn- ^:async status! []
  (let [repo-root (await (resolve-repo))
        file (receipt-file repo-root)
        lines (read-lines file)]
    (println (str "repo: " repo-root))
    (println (str "file: " file))
    (println (str "exists: " (if (fs/path-exists? file) "yes" "no")))
    (println (str "count: " (count lines)))
    (when-let [last-line (last lines)]
      (println (str "last: " last-line)))
    (exit! 0)))

(defn- ^:async tail! [args]
  (let [repo-root (await (resolve-repo))
        file (receipt-file repo-root)
        n (clamp-lines (first args) default-tail)]
    (if (fs/path-exists? file)
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
      (runtime/error! "Usage: eta-mu receipt append <kind> <note>")
      (exit! 1))
    (let [recorded-at (runtime/now-timestamp)
          payload (receipt/build-payload {:kind kind :note note}
                                         repo-root
                                         recorded-at
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
      (fs/make-directories! (fs/dirname file))
      (fs/append-text! file (str line "\n"))
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
                (await (run-discovery! (drop 2 raw-args)))
                (do
                  (runtime/error! discovery-usage)
                  (exit! 1)))
      (do
        (runtime/error! (str "Unknown receipt sub-command: " command))
        (runtime/error! "Usage: eta-mu receipt {status|tail|validate|append|schemas|audit discover}")
        (exit! 1)))))
