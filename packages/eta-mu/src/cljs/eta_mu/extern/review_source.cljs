;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.extern.review-source
  "Read-only Git object boundary for independently reconstructing review bytes.
  The object-store path is an installation capability; archive bytes are data."
  (:require [clojure.string :as str]
            ["node:child_process" :as process]
            ["node:crypto" :as crypto]
            ["node:fs" :as fs]
            ["node:path" :as path]))

(def ^:private git-executable "/usr/bin/git")
(def ^:private trusted-path "/usr/bin:/bin")

(defn- refuse! [code data]
  (throw (ex-info "Review source reconstruction refused" (assoc data :code code))))

(defn- digest [bytes]
  (.digest (.update (.createHash crypto "sha256") bytes) "hex"))

(defn- now-ms [] (.now js/performance))

(defn- valid-store! [store]
  (when-not (and (string? store) (.isAbsolute path store))
    (refuse! :source-object-store {}))
  (try
    (.realpathSync fs store)
    (catch :default _ (refuse! :source-object-store {}))))

(defn- valid-git-executable! []
  (try
    (when-not (and (.isAbsolute path git-executable)
                   (.isFile (.statSync fs git-executable)))
      (refuse! :source-git-executable {:executable git-executable}))
    (.accessSync fs git-executable (.-X_OK (.-constants fs)))
    git-executable
    (catch :default _ (refuse! :source-git-executable {:executable git-executable}))))

(defn- clean-env []
  ;; Deliberately discard inherited Git, credential, loader and trace variables.
  #js {:PATH trusted-path
       :HOME "/nonexistent" :XDG_CONFIG_HOME "/dev/null"
       :LANG "C.UTF-8" :LC_ALL "C.UTF-8" :TZ "UTC"
       :GIT_CONFIG_NOSYSTEM "1" :GIT_CONFIG_GLOBAL "/dev/null"
       :GIT_ATTR_NOSYSTEM "1" :GIT_OPTIONAL_LOCKS "0"
       :GIT_NO_REPLACE_OBJECTS "1"})

(defn- argv [store args]
  (into ["--no-pager" "--no-replace-objects" "--literal-pathspecs" "--git-dir" store
         "-c" "core.fsmonitor=false" "-c" "core.hooksPath=/dev/null"
         "-c" "core.attributesFile=/dev/null" "-c" "diff.external="
         "-c" "diff.algorithm=myers" "-c" "diff.context=3" "-c" "diff.interHunkContext=0"
         "-c" "diff.mnemonicPrefix=false" "-c" "diff.srcPrefix=a/" "-c" "diff.dstPrefix=b/"
         "-c" "diff.indentHeuristic=true" "-c" "core.quotePath=true"] args))

(defn- run-git! [store git args start bounds commands input max-buffer]
  (let [elapsed (- (now-ms) start)
        remaining (- (:operation-ms bounds) elapsed)]
    (when (not (pos? remaining)) (refuse! :source-time {:argv args :elapsed-ms elapsed}))
    (let [full-argv (argv store args)
          before (now-ms)
          result (.spawnSync process git (clj->js full-argv)
                             (clj->js (cond-> {:encoding nil :timeout (max 1 (js/Math.floor remaining))
                                               :maxBuffer max-buffer :env (clean-env)}
                                        input (assoc :input input))))
          duration (- (now-ms) before)
          stdout (.-stdout result)
          stderr (.-stderr result)
          stdout-bytes (when stdout (.-length stdout))
          stderr-bytes (when stderr (.-length stderr))
          command {:executable git :argv full-argv :status (.-status result) :duration-ms duration
                   :stdout-bytes (or stdout-bytes 0)
                   :stdout-sha256 (when stdout (digest stdout))
                   :stderr-bytes (or stderr-bytes 0)
                   :stderr-sha256 (when stderr (digest stderr))}
          _ (swap! commands conj command)
          error-code (some-> (.-error result) .-code)]
      (when (= "ETIMEDOUT" error-code)
        (refuse! :source-time {:argv full-argv :elapsed-ms (- (now-ms) start)}))
      (when (contains? #{"ERR_CHILD_PROCESS_STDIO_MAXBUFFER" "ENOBUFS"} error-code)
        (refuse! :source-output-bytes {:argv full-argv :limit-bytes (dec max-buffer)}))
      (when (or error-code (nil? (.-status result)))
        (refuse! :source-process {:argv full-argv :process-error error-code}))
      {:status (.-status result) :stdout stdout :stderr stderr :argv full-argv
       :duration-ms duration})))

(defn- successful! [result code]
  (when-not (= 0 (:status result))
    (refuse! code {:argv (:argv result) :exit-status (:status result)}))
  result)

(defn- text! [result code]
  (successful! result code)
  (let [value (.toString (:stdout result) "utf8")]
    (when (or (str/includes? value "\uFFFD") (str/includes? value "\u0000"))
      (refuse! code {:argv (:argv result)}))
    (str/replace value #"\n$" "")))

(defn- object-type! [store git oid expected start bounds commands]
  (let [result (run-git! store git ["cat-file" "-t" oid] start bounds commands nil 1048576)
        type (text! result :source-object)]
    (when-not (= expected type) (refuse! :source-object {:object oid :type type}))
    type))

(defn- structural-values! [rows field oid-size oid]
  (let [values (->> rows
                    (remove #(str/starts-with? % " "))
                    (keep (fn [row]
                            (let [key (first (str/split row #"[ \t]" 2))]
                              (when (= field key)
                                (when-not (str/starts-with? row (str field " "))
                                  (refuse! :source-object {:object oid :header field}))
                                (let [value (subs row (inc (count field)))]
                                  (when-not (and (= oid-size (count value))
                                                 (re-matches #"[0-9a-f]+" value))
                                    (refuse! :source-object {:object oid :header field}))
                                  value)))))
                    vec)]
    (when (and (= "tree" field) (not= 1 (count values)))
      (refuse! :source-object {:object oid :header field :count (count values)}))
    (when-not (= (count values) (count (set values)))
      (refuse! :source-object {:object oid :header field :duplicate true}))
    values))

(defn- commit-object! [store git oid oid-size start bounds commands]
  (object-type! store git oid "commit" start bounds commands)
  (let [result (run-git! store git ["cat-file" "commit" oid] start bounds commands nil 4194304)
        bytes (:stdout (successful! result :source-object))
        separator (.indexOf bytes (.from js/Buffer "\n\n" "ascii"))]
    (when (or (neg? separator) (> (.-length bytes) 4194304))
      (refuse! :source-object {:object oid :bytes (.-length bytes)}))
    (let [header-bytes (.subarray bytes 0 separator)
          header (.toString header-bytes "utf8")
          _ (when-not (.equals header-bytes (.from js/Buffer header "utf8"))
              (refuse! :source-object {:object oid :header :invalid-utf8}))
          rows (vec (.split header "\n"))
          trees (structural-values! rows "tree" oid-size oid)
          parents (structural-values! rows "parent" oid-size oid)
          hash-result (run-git! store git ["hash-object" "-t" "commit" "--stdin" "--no-filters"]
                                start bounds commands bytes 1048576)
          actual (text! hash-result :source-object)
          tree (first trees)]
      (when-not (and (= oid actual) (= oid-size (count tree))
                     (every? #(= oid-size (count %)) parents))
        (refuse! :source-object {:object oid :computed-object actual :tree tree :parents parents
                                 :tree-count (count trees)}))
      {:oid oid :tree tree :parents parents :bytes (.-length bytes)})))

(defn- tree-object! [store git oid start bounds commands]
  (object-type! store git oid "tree" start bounds commands)
  (let [result (run-git! store git ["cat-file" "tree" oid] start bounds commands nil 67108865)
        bytes (:stdout (successful! result :source-object))
        actual (text! (run-git! store git ["hash-object" "-t" "tree" "--stdin" "--no-filters"]
                                start bounds commands bytes 1048576)
                      :source-object)]
    (when-not (= oid actual)
      (refuse! :source-object {:object oid :computed-object actual :type "tree"}))
    {:oid oid :bytes (.-length bytes)}))

(defn- source-diff [store git merge-base head start bounds commands]
  (let [args ["--attr-source" head "-c" "diff.renameLimit=10000" "diff"
              "--no-ext-diff" "--no-textconv" "--find-renames" "--no-color"
              merge-base head "--"]
        maximum (inc (:output-bytes bounds))
        result (run-git! store git args start bounds commands nil maximum)]
    (successful! result :source-diff)
    (let [bytes (:stdout result)]
      (when (> (.-length bytes) (:output-bytes bounds))
        (refuse! :source-output-bytes {:bytes (.-length bytes) :limit-bytes (:output-bytes bounds)}))
      bytes)))

(defn- decode-base64! [{:keys [base64 size sha256]} bounds]
  (when (> (count base64) (* 4 (js/Math.ceil (/ (:output-bytes bounds) 3))))
    (refuse! :source-output-bytes {:limit-bytes (:output-bytes bounds)}))
  (when-not (or (= "" base64) (re-matches #"(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?" base64))
    (refuse! :source-archive-bytes {}))
  (let [bytes (.from js/Buffer base64 "base64")]
    (when-not (and (= size (.-length bytes)) (= base64 (.toString bytes "base64"))
                   (= sha256 (digest bytes)) (<= size (:output-bytes bounds)))
      (refuse! :source-archive-bytes {:size-bytes (.-length bytes) :claimed-size size}))
    bytes))

(defn- preview-bytes [diff]
  (if (> (.-length diff) 300000)
    (.concat js/Buffer #js [(.subarray diff 0 300000)
                            (.from js/Buffer
                                   (str "\n[eta-mu review] diff truncated at 300000 bytes (was "
                                        (.-length diff) ").\n") "utf8")])
    diff))

(defn reconstruct!
  "Observe exact source objects and complete raw merge-base-to-head bytes.
  This never checks out or executes a source tree. It does not authenticate the
  trusted caller's native tuple or invent absent event/workflow custody."
  [{:keys [object-store tuple archive-diff archive-preview bounds]}]
  (let [start (now-ms)
        git (valid-git-executable!)
        store (valid-store! object-store)
        commands (atom [])
        version (text! (run-git! store git ["--version"] start bounds commands nil 1048576) :source-git)
        object-format (text! (run-git! store git ["rev-parse" "--show-object-format"] start bounds commands nil 1048576)
                             :source-object)
        oids [(:base-sha tuple) (:head-sha tuple) (:merge-sha tuple)]
        oid-size (if (= "sha1" object-format) 40 (if (= "sha256" object-format) 64 0))
        _ (when-not (and (pos? oid-size) (every? #(and (string? %) (= oid-size (count %))
                                                       (re-matches #"[0-9a-f]+" %)) oids))
            (refuse! :source-pin {:object-format object-format}))
        base (commit-object! store git (:base-sha tuple) oid-size start bounds commands)
        head (commit-object! store git (:head-sha tuple) oid-size start bounds commands)
        merge (commit-object! store git (:merge-sha tuple) oid-size start bounds commands)
        _base-tree (tree-object! store git (:tree base) start bounds commands)
        _head-tree (tree-object! store git (:tree head) start bounds commands)
        _merge-tree (tree-object! store git (:tree merge) start bounds commands)
        _ (when-not (and (= [(:base-sha tuple) (:head-sha tuple)] (:merge-parents tuple))
                         (= [(:base-sha tuple) (:head-sha tuple)] (:parents merge))
                         (= (:head-tree tuple) (:tree head) (:tree merge) (:merge-tree tuple))
                         (= (:base-sha tuple) (:oid base)))
            (refuse! :source-topology {:merge-parents (:parents merge) :head-tree (:tree head)
                                       :merge-tree (:tree merge)}))
        ancestor (run-git! store git ["merge-base" "--is-ancestor" (:base-sha tuple) (:head-sha tuple)]
                           start bounds commands nil 1048576)
        _ (when-not (and (= 0 (:status ancestor)) (:base-ancestor? tuple))
            (refuse! :source-ancestry {:exit-status (:status ancestor)}))
        merge-base-result (run-git! store git ["merge-base" (:base-sha tuple) (:head-sha tuple)]
                                    start bounds commands nil 1048576)
        merge-base (text! merge-base-result :source-merge-base)
        _ (when-not (and (= oid-size (count merge-base)) (re-matches #"[0-9a-f]+" merge-base))
            (refuse! :source-merge-base {}))
        source-bytes (source-diff store git merge-base (:head-sha tuple) start bounds commands)
        _ (when (or (>= (- (now-ms) start) (:operation-ms bounds))
                    (> (.-length source-bytes) (:output-bytes bounds)))
            (refuse! (if (> (.-length source-bytes) (:output-bytes bounds))
                       :source-output-bytes :source-time)
                     {:bytes (.-length source-bytes) :elapsed-ms (- (now-ms) start)}))
        actual-digest (digest source-bytes)
        actual-size (.-length source-bytes)
        preview (preview-bytes source-bytes)
        archive-bytes (decode-base64! archive-diff bounds)
        _ (when-not (and (= actual-size (.-length archive-bytes))
                         (= actual-digest (digest archive-bytes))
                         (.equals source-bytes archive-bytes))
            (refuse! :source-archive-mismatch {:expected-size actual-size
                                               :archive-size (.-length archive-bytes)}))
        archive-preview-bytes (decode-base64! archive-preview bounds)
        _ (when-not (.equals preview archive-preview-bytes)
            (refuse! :source-preview-mismatch {}))]
    (when (>= (- (now-ms) start) (:operation-ms bounds))
      (refuse! :source-time {:elapsed-ms (- (now-ms) start)}))
    {:status :observed :diff-base-sha merge-base
     :full-diff-base64 (.toString source-bytes "base64")
     :full-diff {:path "basehead.diff" :bytes actual-size :sha256 actual-digest}
     :preview-base64 (.toString preview "base64")
     :preview {:path "pr.diff" :limit_bytes 300000 :truncated (> actual-size 300000)}
     :native-provenance {:tuple tuple}
     :git-provenance {:executable git :path trusted-path
                      :version version :object-format object-format :commands @commands
                      :diff-argv (:argv (last @commands)) :diff-bytes actual-size
                      :diff-sha256 actual-digest :elapsed-ms (- (now-ms) start)
                      :output-limit-bytes (:output-bytes bounds)
                      :operation-limit-ms (:operation-ms bounds)}}))
