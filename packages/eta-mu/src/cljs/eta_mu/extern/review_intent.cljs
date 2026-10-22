;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.extern.review-intent
  "Fixed NBB child-process boundary for the blocking canonical Clio kernel."
  (:require [cljs.reader :as reader]
            [eta-mu.domain.review-publication :as publication]
            [nbb.core :as nbb]
            ["node:child_process" :as child]
            ["node:crypto" :as crypto]
            ["node:path" :as path]
            ["node:fs" :as fs]))

(def ^:private input-limit 65536)
(def ^:private output-limit 1048576)
(def ^:private timeout-ms 8000)
(def ^:private heap-mb 128)
(def ^:private live-capabilities (atom {}))
(def ^:private recovery-receipts (atom {}))
(def ^:private installation-root
  (.resolve path (.dirname path nbb/*file*) "../../../../../../"))

(defn clock-ms [] (.now js/Date))

(defn- text-size [s]
  (.byteLength js/Buffer (str s) "utf8"))

(defn- fixed-layout []
  (let [root installation-root
        package-root (.resolve path root "packages/eta-mu")
        cli (.resolve path root "node_modules/.pnpm/nbb@1.5.212/node_modules/nbb/cli.js")
        worker (.resolve path package-root "src/cljs/eta_mu/infra/review_intent_worker_entry.cljs")
        package (js/JSON.parse (.readFileSync fs (.resolve path package-root "package.json") "utf8"))
        clio-pin (aget (aget package "dependencies") "clio-publication-kernel")]
    (when-not (and (.existsSync fs cli)
                   (= "github:riatzukiza/clio#5a7a04c6ced7b15be940e16dc772c95b0525d55f"
                      clio-pin)
                   (.existsSync fs worker)
                   (.existsSync fs (.resolve path package-root "node_modules/clio-publication-kernel/src/clio/infra/runtime.cljc")))
      (throw (ex-info "Fixed Clio/NBB installation is unavailable or not pinned"
                      {:intent/error :installation})))
    {:root root :package-root package-root :cli cli :worker worker}))

(defn- invoke-worker!
  "Run exactly one fixed worker operation in a bounded child. The installation
  layout and executable are constants; caller data is one bounded EDN value."
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

(defn- issue-capability! [binding]
  (let [opaque (js/Symbol (.toString (.randomBytes crypto 48) "base64url"))]
    (swap! live-capabilities assoc opaque binding)
    opaque))

(defn- recovery-token! [store recovery]
  (let [token (js/Symbol (.toString (.randomBytes crypto 48) "base64url"))]
    (swap! recovery-receipts assoc token
           {:store (select-keys store [:schema-directory :ledger-file :partition-device
                                      :partition-inode :expected-lock-key])
            :recovery recovery})
    token))

(defn- bind-recovery-result [store result]
  (if (map? (:recovery result))
    (-> result
        (dissoc :recovery)
        (assoc :recovery-receipt (recovery-token! store (:recovery result))))
    result))

(defn transition-child! [request]
  (let [result (bind-recovery-result (:store request) (invoke-worker! request))
        binding (:binding request)
        fresh-context (assoc (:context request) :now-ms (clock-ms))
        fresh-admission (publication/admit fresh-context)]
    (if (and (= :appended (:status result)) (= :post-started (:state result))
             (= :admitted (:status fresh-admission))
             (= binding (:binding fresh-admission)))
      (assoc result :capability (issue-capability! binding) :capability-issued? true)
      (assoc result :capability-issued? false))))

(defn recover-child! [store recovery]
  (let [store-key (select-keys store [:schema-directory :ledger-file :partition-device
                                      :partition-inode :expected-lock-key])
        receipt (get @recovery-receipts recovery)
        authorized? (and receipt (= store-key (:store receipt)))
        recovery-map (if authorized? (:recovery receipt) recovery)
        result (if (and (not authorized?) (not (map? recovery)))
                 {:status :refused :reason :recovery-receipt}
                 (invoke-worker! {:operation :recover
                                  :store store-key
                                  :recovery recovery-map
                                  :append-uncertain? authorized?}))
        result (if (map? (:recovery result))
                 (let [next-recovery (:recovery result)]
                   (if authorized?
                     (do (swap! recovery-receipts assoc recovery
                                (assoc receipt :recovery next-recovery))
                         (-> result (dissoc :recovery) (assoc :recovery-receipt recovery)))
                     (dissoc result :recovery)))
                 result)]
    (when (and authorized? (contains? #{:recovered :replayed} (:status result)))
      (swap! recovery-receipts dissoc recovery))
    (assoc result :capability-issued? false)))

(defn consume-capability! [token expected-binding]
  (let [actual (get @live-capabilities token)]
    (if (and actual (= actual expected-binding))
      (do (swap! live-capabilities dissoc token) true)
      false)))

(defn clear-capabilities! [] (reset! live-capabilities {}))
