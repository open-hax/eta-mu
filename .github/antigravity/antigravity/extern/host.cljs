;; SPDX-License-Identifier: GPL-3.0-or-later
(ns antigravity.extern.host
  "Node process/filesystem boundaries. No review admission policy."
  (:refer-clojure :exclude [exists? bytes run!])
  (:require [clojure.string :as str]
            ["node:child_process" :as child]
            ["node:crypto" :as crypto]
            ["node:fs" :as fs]
            ["node:path" :as path]
            ["node:util" :refer [TextDecoder]]))

(defn fail! [kind details] (throw (ex-info (name kind) {:kind kind :details details})))
(defn environment [] (into {} (js->clj (js/Object.entries (.-env js/process)))))
(defn absolute [x] (path/resolve x))
(defn join [& xs] (apply path/join xs))
(defn parent [x] (path/dirname x))
(defn realpath [x] (fs/realpathSync x))
(defn exists? [x] (fs/existsSync x))
(defn directory? [x] (.isDirectory (fs/statSync x)))
(defn executable-file? [x]
  (and (.isFile (fs/statSync x)) (do (fs/accessSync x (.-X_OK fs/constants)) true)))
(defn within? [root candidate]
  (let [relative (path/relative root candidate)]
    (or (= "" relative) (and (not= ".." relative) (not (str/starts-with? relative (str ".." path/sep)))
                              (not (path/isAbsolute relative))))))
(defn mkdir! [x] (fs/mkdirSync x #js {:mode 448}))
(defn ensure-dir! [x] (fs/mkdirSync x #js {:mode 448 :recursive true}))
(defn write! [file content] (fs/writeFileSync file content #js {:flag "wx" :mode 384}))
(defn read-text [file]
  (.decode (new TextDecoder "utf-8" #js {:fatal true :ignoreBOM true}) (fs/readFileSync file)))
(defn bytes [x] (js/Buffer.byteLength x "utf8"))
(defn sha256 [x] (.digest (.update (crypto/createHash "sha256") x) "hex"))
(defn file-sha256 [file] (sha256 (fs/readFileSync file)))
(defn remove-dir! [directory] (fs/rmSync directory #js {:recursive true :force true}))
(defn json [x] (js/JSON.stringify (clj->js x) nil 2))
(defn compact-json [x] (js/JSON.stringify (clj->js x)))
(defn parse-json [x] (js->clj (js/JSON.parse x) :keywordize-keys true))
(defn stdout! [x] (.write js/process.stdout x))
(defn stderr! [x] (.write js/process.stderr x))
(defn exit-code! [x] (set! (.-exitCode js/process) x))

(defn run!
  "Synchronous bounded child: shell is never involved; returns decoded data."
  [binary args {:keys [cwd env input timeout max-bytes]}]
  (let [r (child/spawnSync binary (clj->js args)
                           (clj->js {:cwd cwd :env env :input input
                                     :timeout (or timeout 30000) :killSignal "SIGKILL"
                                     :maxBuffer (or max-bytes 8388608)}))]
    (when-let [error (.-error r)] (fail! :process {:binary binary :code (.-code error)}))
    {:status (.-status r) :signal (.-signal r)
     :stdout (if (.-stdout r) (.toString (.-stdout r) "utf8") "")
     :stderr (if (.-stderr r) (.toString (.-stderr r) "utf8") "")}))

(defn git!
  [repo args max-bytes]
  (let [result (run! "git" (into ["-c" "core.hooksPath=/dev/null" "-c" "diff.external=" "-C" repo] args)
                     {:max-bytes max-bytes
                      :env {"PATH" (get (environment) "PATH") "HOME" "/nonexistent"
                            "GIT_CONFIG_NOSYSTEM" "1" "GIT_CONFIG_GLOBAL" "/dev/null"
                            "GIT_TERMINAL_PROMPT" "0" "GIT_PAGER" "cat" "GIT_NO_REPLACE_OBJECTS" "1"
                            "GIT_LITERAL_PATHSPECS" "1" "LC_ALL" "C.UTF-8"}})]
    (when-not (zero? (:status result)) (fail! :git {:args args :status (:status result)}))
    (:stdout result)))

(defn blob!
  "Return UTF-8 blob bytes faithfully, refusing binary/invalid encoding."
  [repo oid max-bytes]
  (if (re-matches #"0+" oid) ""
      (let [size (parse-long (str/trim (git! repo ["cat-file" "-s" oid] 1000)))]
        (when (or (nil? size) (> size max-bytes)) (fail! :blob-size {:oid oid :bytes size}))
        (let [r (child/spawnSync "git" #js ["-C" repo "cat-file" "blob" oid]
                                 #js {:maxBuffer (inc max-bytes) :timeout 30000
                                      :env #js {:PATH (get (environment) "PATH") :HOME "/nonexistent"
                                                :GIT_CONFIG_NOSYSTEM "1" :GIT_NO_REPLACE_OBJECTS "1" :GIT_CONFIG_GLOBAL "/dev/null"}})
              buffer (.-stdout r)]
          (when (or (.-error r) (not= 0 (.-status r))) (fail! :blob-read {:oid oid}))
          (when (not= -1 (.indexOf buffer 0)) (fail! :binary {:oid oid}))
          (try (.decode (new TextDecoder "utf-8" #js {:fatal true :ignoreBOM true}) buffer)
               (catch :default _ (fail! :invalid-utf8 {:oid oid})))))))

(defn native-lines [content]
  (mapv parse-json (remove str/blank? (str/split-lines content))))

(defn run-native! [{:keys [adapter cli snapshot output timeout max-bytes args environment input]}]
  (let [result (run! (.-execPath js/process)
                     [adapter cli snapshot output (str timeout) (str max-bytes) (json args) "stream-json"]
                     {:env environment :input input :timeout (+ 15000 timeout) :max-bytes 65536})]
    (when-not (= 0 (:status result)) (fail! :process-adapter (select-keys result [:status :signal :stderr])))
    (assoc (parse-json (:stdout result))
           :stdout (read-text (join output "native.stdout.json"))
           :stderr (read-text (join output "native.stderr.log")))))
