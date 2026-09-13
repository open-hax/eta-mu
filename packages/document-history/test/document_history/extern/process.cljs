(ns document-history.extern.process
  (:require ["node:child_process" :as child]
            ["node:fs" :as fs]
            ["node:path" :as path]
            [clio.extern.js.runtime :as runtime]))

(defn cwd [] (.cwd js/process))
(defn now-ms [] (.now js/Date))
(defn symbolic-link! [target link] (fs/symlinkSync target link "dir"))
(defn directory-names [directory] (vec (fs/readdirSync directory)))

(defn await-files-sync!
  "Only worker-side barriers use blocking waits; the supervising process must
   keep its event loop free to receive spawn errors and exit notifications."
  [files]
  (let [deadline (+ (now-ms) 5000)]
    (loop []
      (when-not (every? #(fs/existsSync %) files)
        (when (> (now-ms) deadline)
          (throw (ex-info "Timed out at worker barrier" {:files files})))
        (js/Atomics.wait (js/Int32Array. (js/SharedArrayBuffer. 4)) 0 0 10)
        (recur)))))

(defn- await-files! [files]
  (js/Promise.
   (fn [resolve reject]
     (let [deadline (+ (now-ms) 20000)]
       (letfn [(poll []
                 (cond
                   (every? #(fs/existsSync %) files) (resolve true)
                   (> (now-ms) deadline)
                   (reject (ex-info "Timed out waiting for worker markers" {:files files}))
                   :else (js/setTimeout poll 10)))]
         (poll))))))

(defn- failure-markers! [{:keys [ready result]} failure]
  ;; Check markers independently: an early result cannot suppress readiness.
  (when-not (fs/existsSync result) (fs/writeFileSync result (pr-str failure)))
  (when-not (fs/existsSync ready) (fs/writeFileSync ready "failed")))

(defn- start-worker! [root control command mode files {:keys [binary worker-script]}]
  (let [{:keys [ready result gate log]} files
        fd (fs/openSync log "w")
        closed-resolve (atom nil)
        closed (js/Promise. (fn [resolve _reject] (reset! closed-resolve resolve)))
        worker (try
                 (child/spawn
                  (or binary (.-execPath js/process))
                  (clj->js [(path/resolve "node_modules/nbb/cli.js") "-cp" "test"
                            (or worker-script "test/document_history/worker.nbb")
                            root (pr-str command) result ready gate mode control])
                  #js {:cwd (cwd) :stdio #js ["ignore" fd fd]})
                 (finally (fs/closeSync fd)))]
    (.on worker "error" #(failure-markers! files {:error (str %)}))
    (.on worker "close"
         (fn [code signal]
           (failure-markers! files {:error "Worker exited without a result"
                                    :code code :signal signal})
           (@closed-resolve true)))
    {:process worker :closed closed}))

(defn ^:async writers!
  "Start independent runtimes and rendezvous without blocking Node callbacks.
   mode may be a vector to direct deterministic lock interleavings."
  ([root commands mode] (await (writers! root commands mode {})))
  ([root commands mode options]
   (let [control (path/join root (str "workers-" (runtime/random-uuid)))
         _ (fs/mkdirSync control)
         gate (path/join control "go")
         files (mapv (fn [index]
                       {:ready (path/join control (str index ".ready"))
                        :result (path/join control (str index ".result"))
                        :log (path/join control (str index ".log"))
                        :gate gate})
                     (range (count commands)))
         workers (atom [])]
     (try
       (doseq [[index command file] (map vector (range) commands files)]
         (swap! workers conj
                (start-worker! root control command
                               (if (vector? mode) (nth mode index) mode) file options)))
       (await (await-files! (mapv :ready files)))
       (fs/writeFileSync gate "go")
       (await (await-files! (mapv :result files)))
       (mapv #(fs/readFileSync (:result %) "utf8") files)
       (finally
         (doseq [{:keys [process]} @workers] (.kill ^js process))
         ;; No terminal callback may outlive its fixture directory.
         (await (js/Promise.all (clj->js (mapv :closed @workers)))))))))
