(ns document-history.extern.process
  (:require ["node:child_process" :as child]
            ["node:fs" :as fs]
            ["node:path" :as path]))

(defn cwd [] (.cwd js/process))
(defn- sleep! [] (js/Atomics.wait (js/Int32Array. (js/SharedArrayBuffer. 4)) 0 0 10))
(defn await-files! [files]
  (let [deadline (+ (.now js/Date) 60000)]
    (loop []
      (when-not (every? #(fs/existsSync %) files)
        (when (> (.now js/Date) deadline)
          (throw (ex-info "Timed out waiting for document-history workers" {:files files})))
        (sleep!)
        (recur)))))

(defn writers!
  "Start real independent runtimes, rendezvous before writing, and wait for
   result files. Blocking here keeps this fixture identical under NBB/Shadow."
  [root commands mode]
  (let [gate (path/join root "workers.go")
        files (mapv (fn [index]
                      {:ready (path/join root (str "worker-" index ".ready"))
                       :result (path/join root (str "worker-" index ".result"))
                       :log (path/join root (str "worker-" index ".log"))})
                    (range (count commands)))
        workers (mapv (fn [command {:keys [ready result log]}]
                        (let [fd (fs/openSync log "w")
                              worker (child/spawn
                                      "pnpm"
                                      (clj->js ["exec" "nbb" "-cp" "test"
                                                "test/document_history/worker.nbb"
                                                root (pr-str command) result ready gate mode])
                                      #js {:cwd (cwd) :stdio #js ["ignore" fd fd]})]
                          (fs/closeSync fd)
                          (.on worker "error" (fn [cause]
                                                (fs/writeFileSync result
                                                                  (pr-str {:error (str cause)}))))
                          worker))
                      commands files)]
    (try
      (await-files! (mapv :ready files))
      (fs/writeFileSync gate "go")
      (await-files! (mapv :result files))
      (mapv #(fs/readFileSync (:result %) "utf8") files)
      (finally
        (doseq [^js worker workers] (.kill worker))))))
