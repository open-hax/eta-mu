;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.extern.review-intent
  "Fixed NBB child-process boundary for the blocking canonical Clio kernel."
  (:require [cljs.reader :as reader]
            [nbb.core :as nbb]
            ["node:child_process" :as child]
            ["node:crypto" :as crypto]
            ["node:path" :as path]
            ["node:fs" :as fs]))

(def ^:private input-limit 65536)
(def ^:private output-limit 1048576)
(def ^:private timeout-ms 8000)
(def ^:private heap-mb 128)
(def ^:private installation-root
  (.resolve path (.dirname path nbb/*file*) "../../../../../../"))

(defn clock-ms [] (.now js/Date))

(defn partition-identity
  "Read an exact existing regular-file identity at the Node edge. BigInts stay
  local to this adapter; portable callers carry decimal strings only."
  [filename]
  (when (and (string? filename) (.isAbsolute path filename))
    (let [stat (.statSync fs filename #js {:bigint true})]
      (when (.isFile stat)
        [(str (.-dev stat)) (str (.-ino stat))]))))

(defn- text-size [s]
  (.byteLength js/Buffer (str s) "utf8"))

(defn read-worker-input!
  "Read one bounded UTF-8 input string from the fixed worker's stdin. Host
  buffers and decoding objects remain inside this boundary."
  []
  (let [buffer (.alloc js/Buffer (inc input-limit))]
    (loop [total 0]
      (if (= total (alength buffer))
        (throw (ex-info "Intent worker request exceeds its input bound"
                        {:intent/error :input-bound}))
        (let [read (.readSync fs 0 buffer total (- (alength buffer) total) nil)]
          (if (zero? read)
            (.decode (js/TextDecoder. "utf-8" #js {:fatal true})
                     (.subarray buffer 0 total))
            (recur (+ total read))))))))

(defn write-worker-output!
  "Write one bounded already-encoded response string to the fixed worker's stdout."
  [output]
  (when (> (text-size output) output-limit)
    (throw (ex-info "Response exceeds fixed bound" {:intent/error :output-bound})))
  (.writeSync fs 1 output))

(defn fail-worker!
  "Write the fixed worker's diagnostic and exit with its failure code."
  [message]
  (.writeSync fs 2 message)
  (.exit js/process 2))

(defn- fixed-layout []
  (let [root installation-root
        package-root (.resolve path root "packages/eta-mu")
        cli (.resolve path root "node_modules/.pnpm/nbb@1.5.212/node_modules/nbb/cli.js")
        worker (.resolve path package-root "src/cljs/eta_mu/infra/review_intent_worker_entry.cljs")
        package (js/JSON.parse (.readFileSync fs (.resolve path package-root "package.json") "utf8"))
        clio-pin (aget (aget package "dependencies") "clio-publication-kernel")]
    (when-not (and (.existsSync fs cli)
                   (= "github:riatzukiza/clio#5fad794de1a9e23d6e5aaad42eaa933be1c070be"
                      clio-pin)
                   (.existsSync fs worker)
                   (.existsSync fs (.resolve path package-root "node_modules/clio-publication-kernel/src/clio/infra/runtime.cljc")))
      (throw (ex-info "Fixed Clio/NBB installation is unavailable or not pinned"
                      {:intent/error :installation})))
    {:root root :package-root package-root :cli cli :worker worker}))

(defn run-fixed-worker!
  "Run exactly one fixed worker operation in a bounded child. The installation
  layout and executable are constants; caller data is one bounded EDN value.
  Its decoded result is an observation, never a capability."
  [request]
  (let [{:keys [package-root cli worker]} (fixed-layout)
        input (pr-str request)
        bytes (text-size input)]
    (when (> bytes input-limit)
      (throw (ex-info "Intent worker request exceeds fixed input bound"
                      {:intent/error :input-bound :bytes bytes})))
    (let [result (.spawnSync child (.-execPath js/process)
                             #js [(.concat "--max-old-space-size=" (str heap-mb)) cli
                                  "-cp" "src/cljs:node_modules/clio-publication-kernel/src" worker]
                             #js {:cwd package-root
                                  :env #js {:HOME "/tmp" :PATH "/usr/bin:/bin"
                                            :LANG "C.UTF-8" :LC_ALL "C.UTF-8"
                                            :NODE_OPTIONS ""}
                                  :input input :encoding "utf8"
                                  :timeout timeout-ms :maxBuffer output-limit
                                  :windowsHide true :killSignal "SIGKILL"})
          stdout (or (.-stdout result) "")
          stderr (or (.-stderr result) "")
          stdout-bytes (text-size stdout)]
      (cond
        (.-error result)
        {:status :unknown :reason :worker-process
         :error-code (or (.-code (.-error result)) "process-error")}

        (not= 0 (.-status result))
        {:status :unknown :reason :worker-exit :exit-code (.-status result)
         :stderr (subs stderr 0 (min 2048 (count stderr)))}

        (> stdout-bytes output-limit)
        {:status :unknown :reason :worker-output-bound :bytes stdout-bytes}

        :else
        (try
          (let [response (reader/read-string stdout)]
            (if (and (map? response) (= stdout (pr-str response)))
              response
              {:status :unknown :reason :worker-response-shape}))
          (catch :default _
            {:status :unknown :reason :worker-response-decode}))))))

(defn new-opaque-vault
  "Create an isolated process-local Symbol table. The caller retains the
  returned closures; this factory has no reference to any infra-owned vault."
  []
  (let [entries (atom {})
        token! (fn [] (js/Symbol (.toString (.randomBytes crypto 48) "base64url")))
        put! (fn [value]
               (let [token (token!)]
                 (swap! entries assoc token value)
                 token))
        lookup (fn [token] (get @entries token))
        replace! (fn [token value]
                   (when (contains? @entries token)
                     (swap! entries assoc token value)
                     true))
        remove! (fn [token]
                  (let [present? (contains? @entries token)]
                    (swap! entries dissoc token)
                    present?))]
    {:put! put! :lookup lookup :replace! replace! :remove! remove!}))
